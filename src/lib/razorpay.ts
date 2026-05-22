"use client";

import { supabase } from "@/lib/supabase";

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface PaymentOptions {
  userId: string;
  planName: "Yearly Pro" | "Monthly Pro";
  amountINR: number;
  userEmail: string;
  userName: string;
  onSuccess: (paymentId: string) => void;
}

export async function triggerRazorpayPayment({
  userId,
  planName,
  amountINR,
  userEmail,
  userName,
  onSuccess,
}: PaymentOptions) {
  const hasKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID !== "";

  if (!hasKey) {
    const confirmSimulation = typeof window !== "undefined" && confirm(
      `No custom Razorpay Key ID detected in .env.local.\n\nWould you like to SIMULATE a successful payment of ₹${amountINR} for testing? \n\n• Click 'OK' to simulate success (triggers Supabase/localStorage update and redirects to profile).\n• Click 'Cancel' to try launching the official Razorpay Checkout popup using the fallback test key.`
    );

    if (confirmSimulation) {
      const mockPaymentId = "pay_mock_" + Math.random().toString(36).substring(2, 11);

      // Save the plan to localStorage
      localStorage.setItem("user_plan", planName);

      // Try saving the plan status to Supabase profile
      try {
        if (userEmail) {
          const startDate = new Date();
          const endDate = new Date();
          if (planName.toLowerCase().includes("yearly")) {
            endDate.setFullYear(startDate.getFullYear() + 1);
          } else {
            endDate.setMonth(startDate.getMonth() + 1);
          }

          // Get User ID
          const { data: userRow } = await supabase
            .from("users")
            .select("id")
            .eq("email", userEmail)
            .single();

          await supabase
            .from("users")
            .update({ 
              plan: planName, 
              current_plan: planName, 
              subscription_status: "active",
              subscription_start_date: startDate.toISOString(),
              subscription_end_date: endDate.toISOString()
            })
            .eq("email", userEmail);

          if (userRow?.id) {
            // Write simulated subscription
            await supabase
              .from("subscriptions")
              .upsert({
                user_id: userRow.id,
                plan_id: planName,
                status: "active",
                current_start: startDate.toISOString(),
                current_end: endDate.toISOString(),
                razorpay_subscription_id: mockPaymentId,
                updated_at: new Date().toISOString()
              }, { onConflict: 'razorpay_subscription_id' });

            // Write simulated payment record
            await supabase
              .from("payments")
              .insert({
                user_id: userRow.id,
                razorpay_order_id: "order_mock_" + Math.random().toString(36).substring(2, 11),
                razorpay_payment_id: mockPaymentId,
                amount: planName.toLowerCase().includes("yearly") ? 1699 : 399,
                currency: "INR",
                status: "captured",
              });
          }
        }
      } catch (dbErr) {
        console.warn("Could not save simulated plan update to Supabase table:", dbErr);
      }

      onSuccess(mockPaymentId);
      return;
    }
  }

  // Real Secure Razorpay Flow
  try {
    // 1. Create order on server api
    const orderRes = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, planName, amountINR, userEmail }),
    });

    let orderData;
    const orderContentType = orderRes.headers.get("content-type");
    if (orderContentType && orderContentType.includes("application/json")) {
      orderData = await orderRes.json();
    } else {
      const text = await orderRes.text();
      console.error("Razorpay create-order API error response:", text);
      throw new Error(`Server error (${orderRes.status}). Failed to create payment order.`);
    }

    if (!orderRes.ok) {
      throw new Error(orderData.error || "Failed to create order on server");
    }

    const { orderId } = orderData;

    // 2. Load Checkout script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load Razorpay payment portal. Please check your internet connection.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SSITbj2voJfP8y",
      amount: amountINR * 100, // paise
      currency: "INR",
      name: "SmartPDFs Plus",
      description: `${planName} Subscription Plan`,
      image: "https://raw.githubusercontent.com/Hardik160998/PDF-Tools/main/public/favicon.ico",
      order_id: orderId,
      handler: async function (response: any) {
        try {
          // 3. Post verification payload to verify-signature endpoint
          const verifyRes = await fetch("/api/payments/verify-signature", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              userEmail,
              planName,
              razorpay_order_id: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          let verifyData;
          const verifyContentType = verifyRes.headers.get("content-type");
          if (verifyContentType && verifyContentType.includes("application/json")) {
            verifyData = await verifyRes.json();
          } else {
            const text = await verifyRes.text();
            console.error("Razorpay verify-signature API error response:", text);
            throw new Error(`Server error (${verifyRes.status}). Failed to verify signature.`);
          }

          if (!verifyRes.ok) {
            throw new Error(verifyData.error || "Signature verification failed on server");
          }

          // Save the plan to localStorage on success
          localStorage.setItem("user_plan", planName);
          onSuccess(response.razorpay_payment_id);
        } catch (verifyErr: any) {
          console.error("Verification error:", verifyErr);
          alert(`Signature verification failed: ${verifyErr.message}`);
        }
      },
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: {
        color: "#ef4444",
      },
      modal: {
        ondismiss: function () {
          console.log("Razorpay modal closed by user.");
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error: any) {
    console.error("Checkout initiation failed:", error);
    alert(`Could not initiate checkout: ${error.message}`);
  }
}

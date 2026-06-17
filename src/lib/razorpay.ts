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
    script.async = true;

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
  try {
    // =====================================================
    // Create Razorpay Order
    // =====================================================

    const orderRes = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        planName,
        amountINR,
        userEmail,
      }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      throw new Error(
        orderData.error ||
          orderData.message ||
          "Failed to create payment order"
      );
    }

    const {
      orderId,
      amount,
      currency,
      key,
    } = orderData;

    console.log("Razorpay Order Created:", orderData);

    // =====================================================
    // Load Razorpay Script
    // =====================================================

    const loaded = await loadRazorpayScript();

    if (!loaded) {
      throw new Error(
        "Failed to load Razorpay Checkout SDK"
      );
    }

    // =====================================================
    // Razorpay Checkout
    // =====================================================

    const options = {
      key,

      order_id: orderId,

      amount,
      currency,

      name: "SmartPDFPro",

      description: `${planName} Subscription`,

      image: "/img/favicons/512x512.png",

      prefill: {
        name: userName,
        email: userEmail,
      },

      theme: {
        color: "#ef4444",
      },

      modal: {
        ondismiss() {
          console.log(
            "Razorpay checkout closed by user"
          );
        },
      },

      handler: async function (response: any) {
        try {
          console.log(
            "Payment Success:",
            response
          );

          const verifyRes = await fetch(
            "/api/payments/verify-signature",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                userEmail,
                planName,

                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              }),
            }
          );

          const verifyData =
            await verifyRes.json();

          if (!verifyRes.ok) {
            throw new Error(
              verifyData.error ||
                "Signature verification failed"
            );
          }

          localStorage.setItem(
            "user_plan",
            planName
          );

          onSuccess(
            response.razorpay_payment_id
          );
        } catch (verifyError: any) {
          console.error(
            "Verification Error:",
            verifyError
          );

          alert(
            `Payment verification failed: ${verifyError.message}`
          );
        }
      },
    };

    const razorpay = new (window as any).Razorpay(
      options
    );

    razorpay.open();
  } catch (error: any) {
    console.error(
      "Checkout initiation failed:",
      error
    );

    alert(
      error?.message ||
        "Failed to start payment"
    );
  }
}
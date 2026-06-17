import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    // =====================================================
    // Validate Razorpay Environment Variables
    // =====================================================

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    console.log("RAZORPAY_KEY_ID:", keyId);
    console.log(
      "RAZORPAY_KEY_SECRET EXISTS:",
      !!keySecret
    );

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error: "Razorpay environment variables missing",
          details:
            "Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // Initialize Razorpay
    // =====================================================

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // =====================================================
    // Parse Request Body
    // =====================================================

    let payload;

    try {
      payload = await request.json();
    } catch (err) {
      console.error("JSON Parse Error:", err);

      return NextResponse.json(
        {
          error: "Invalid JSON payload",
        },
        { status: 400 }
      );
    }

    const {
      userId,
      planName,
      amountINR,
      userEmail,
    } = payload;

    // =====================================================
    // Validate Input
    // =====================================================

    if (!userId || !planName || !amountINR) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters (userId, planName, amountINR)",
        },
        { status: 400 }
      );
    }

    if (Number(amountINR) <= 0) {
      return NextResponse.json(
        {
          error: "Invalid payment amount",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // Create Razorpay Order
    // =====================================================

    const orderOptions = {
      amount: Math.round(Number(amountINR) * 100), // INR → Paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        planName,
        userEmail: userEmail || "",
      },
    };

    console.log("Creating Razorpay Order:");
    console.log(orderOptions);

    let order;

    try {
      order = await razorpay.orders.create(orderOptions);

      console.log("ORDER CREATED SUCCESSFULLY");
      console.log(order);
    } catch (rpError: any) {
      console.error("================================");
      console.error("RAZORPAY ORDER CREATE ERROR");
      console.error("================================");

      console.error("Message:", rpError?.message);
      console.error("Status Code:", rpError?.statusCode);
      console.error("Error:", rpError?.error);
      console.error(
        "Description:",
        rpError?.error?.description
      );

      return NextResponse.json(
        {
          error: "Failed to create Razorpay order",
          message: rpError?.message,
          description: rpError?.error?.description,
          statusCode: rpError?.statusCode,
        },
        { status: 500 }
      );
    }

    // =====================================================
    // Supabase Logging
    // =====================================================

    try {
      const supabase = createServerSupabase();

      let resolvedUserId = userId;

      if (userEmail) {
        try {
          const { data: userRow } = await supabase
            .from("users")
            .select("id")
            .eq("email", userEmail.toLowerCase().trim())
            .single();

          if (userRow?.id) {
            resolvedUserId = userRow.id;
          }
        } catch (err) {
          console.warn(
            "User lookup failed:",
            err
          );
        }
      }

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      const dbUserId = uuidRegex.test(
        resolvedUserId
      )
        ? resolvedUserId
        : null;

      const { error: paymentError } =
        await supabase.from("payments").insert({
          user_id: dbUserId,
          razorpay_order_id: order.id,
          amount: amountINR,
          currency: "INR",
          status: "created",
        });

      if (paymentError) {
        console.warn(
          "Payment Log Error:",
          paymentError
        );
      }
    } catch (dbErr) {
      console.warn(
        "Could not save payment record:",
        dbErr
      );
    }

    // =====================================================
    // Success Response
    // =====================================================

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error(
      "UNHANDLED CREATE ORDER ERROR:"
    );
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create order",
        message: error?.message,
        stack:
          process.env.NODE_ENV === "development"
            ? error?.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}

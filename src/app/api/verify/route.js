import { NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { recordTransaction } from "@/lib/db";

export async function POST(request) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      featureId,
      birthHash,
      price,
      isDemo
    } = await request.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const jwtSecret = process.env.JWT_SECRET || "astro_jwt_secret_key_xyz";

    let isValid = false;

    if (isDemo || !keySecret) {
      // In Demo mode, we auto-approve
      console.log("Demo payment verified for:", featureId);
      isValid = true;
    } else {
      // Real signature verification
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body.toString())
        .digest("hex");
      
      isValid = expectedSignature === razorpay_signature;
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Record the transaction in the database
    await recordTransaction({
      orderId: razorpay_order_id || `order_demo_${Math.random().toString(36).substring(2, 9)}`,
      paymentId: razorpay_payment_id || "pay_demo_unknown",
      featureId,
      price: Number(price) || 0
    });

    // Generate JWT token containing access rights
    const token = jwt.sign(
      {
        featureId,
        birthHash,
        price,
        unlockedAt: Date.now()
      },
      jwtSecret,
      { expiresIn: "30d" } // 30-day access validity
    );

    return NextResponse.json({
      success: true,
      token,
      message: `Premium ${featureId} report unlocked successfully!`
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

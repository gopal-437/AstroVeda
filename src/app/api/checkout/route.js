import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request) {
  try {
    const { featureId, price } = await request.json();
    
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Fallback if environment variables are not yet configured
    if (!keyId || !keySecret) {
      console.log("Razorpay keys missing in environment. Initializing Sandbox/Demo payment.");
      return NextResponse.json({
        isDemo: true,
        orderId: `order_demo_${Math.random().toString(36).substring(2, 9)}`,
        keyId: "rzp_test_demoKey123",
        amount: price * 100,
        currency: "INR"
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: price * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${featureId}_${Date.now()}`
    });

    return NextResponse.json({
      isDemo: false,
      orderId: order.id,
      keyId: keyId,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

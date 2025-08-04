import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// ✅ Required for dynamic server execution
export const dynamic = "force-dynamic";

export async function GET() {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const order = await razorpay.orders.create({
      amount: 10000, // ₹100 (replace as needed)
      currency: "INR",
      receipt: "quiz_order_" + Date.now(),
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay API error:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}

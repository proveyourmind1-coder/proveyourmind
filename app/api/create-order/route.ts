import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

export const POST = async (req: NextRequest) => {
  try {
    const { amount } = await req.json()

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const options = {
      amount: amount * 100, // ₹50 → 5000 paisa
      currency: "INR",
      receipt: "receipt_order_" + Math.random().toString(36).substring(7),
    }

    const order = await razorpay.orders.create(options)
    return NextResponse.json(order)
  } catch (err: any) {
    console.error("❌ Razorpay Order Error:", err)
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 })
  }
}

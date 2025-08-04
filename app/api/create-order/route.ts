// app/api/create-order/route.ts

import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

export const dynamic = "force-dynamic"

export const POST = async (req: NextRequest) => {
  try {
    const { amount, uid } = await req.json()

    if (!amount || !uid) {
      return NextResponse.json({ error: "Missing amount or uid" }, { status: 400 })
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    // ✅ Fix: Keep receipt under 40 characters
    const receipt = `wallet_${uid.slice(0, 10)}_${Date.now()}`.slice(0, 40)

    const options = {
      amount: amount * 100, // ₹50 → 5000 paisa
      currency: "INR",
      receipt,
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({ order }) // ✅ frontend expects { order }
  } catch (err: any) {
    console.error("❌ Razorpay Order Error:", err)
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 })
  }
}

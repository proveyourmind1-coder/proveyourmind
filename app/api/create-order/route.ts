import { NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(req: Request) {
  const { amount, currency, quizType } = await req.json()

  // ✅ TEMP LOG to verify env values
  console.log("🔐 RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID)
  console.log("🔐 RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET)

  if (!amount || !currency || !quizType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const razorpayKeyId = process.env.RAZORPAY_KEY_ID
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

  if (!razorpayKeyId || !razorpayKeySecret) {
    console.error("❌ Razorpay API keys are not set in environment variables.")
    return NextResponse.json({ error: "Server configuration error: Razorpay keys missing." }, { status: 500 })
  }

  try {
    const instance = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })

    const options = {
      amount: amount,
      currency,
      receipt: `receipt_quiz_${Date.now()}`,
      notes: {
        quizType,
        userId: "user_id_placeholder",
      },
    }

    const order = await instance.orders.create(options)
    return NextResponse.json(order)
  } catch (error: any) {
    console.error("❌ Error creating Razorpay order:", error.message, error)
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}

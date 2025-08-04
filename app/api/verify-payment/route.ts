import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing required payment verification fields" }, { status: 400 })
  }

  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

  if (!razorpayKeySecret) {
    console.error("Razorpay API Key Secret is not set in environment variables for verification.")
    return NextResponse.json({ error: "Server configuration error: Razorpay key secret missing." }, { status: 500 })
  }

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac("sha256", razorpayKeySecret).update(body.toString()).digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      // Payment is authentic, you can now update your database
      // For example, mark the user's quiz entry as paid
      console.log("Payment verified successfully:", { razorpay_payment_id, razorpay_order_id })
      return NextResponse.json({ message: "Payment verified successfully" }, { status: 200 })
    } else {
      console.warn("Payment verification failed: Signature mismatch.", {
        razorpay_payment_id,
        razorpay_order_id,
        expectedSignature,
        receivedSignature: razorpay_signature,
      })
      return NextResponse.json({ error: "Payment verification failed: Invalid signature" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error verifying Razorpay payment:", error.message, error)
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 })
  }
}
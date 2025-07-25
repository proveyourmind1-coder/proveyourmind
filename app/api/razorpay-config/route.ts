import { NextResponse } from "next/server"

export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID

  if (!keyId) {
    console.error("Razorpay Key ID is not set in environment variables.")
    return NextResponse.json({ error: "Razorpay Key ID not configured" }, { status: 500 })
  }

  return NextResponse.json({ keyId })
}
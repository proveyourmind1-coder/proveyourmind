// lib/razorpay-config.ts

import axios from "axios"

export async function getRazorpayKey(): Promise<string> {
  const response = await axios.get("/api/razorpay-config")
  return response.data.key
}

export async function createRazorpayOrder(amount: number, uid: string) {
  const response = await axios.post("/api/create-order", {
    amount,
    uid,
  })
  return response.data.order
}

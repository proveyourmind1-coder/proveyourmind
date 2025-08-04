"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

interface RazorpayPaymentProps {
  amount: number
  difficulty?: string
  user?: {
    id: string
    email?: string
  }
  redirectUrl?: string
  onSuccess?: () => void
  onFailure?: () => void
}

export default function RazorpayPayment({
  amount,
  difficulty = "quiz",
  user,
  redirectUrl,
  onSuccess,
  onFailure,
}: RazorpayPaymentProps) {
  const router = useRouter()

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = async () => {
      try {
        // ✅ Create order from backend
        const orderRes = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, uid: user?.id || "guest" }),
        })
        const { order } = await orderRes.json()

        if (!order?.id) throw new Error("Order creation failed")

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: order.amount,
          currency: "INR",
          name: "ProveYourMind",
          description: `Quiz Fee for ${difficulty}`,
          order_id: order.id,
          prefill: {
            email: user?.email || "",
          },
          notes: {
            userId: user?.id || "unknown",
            difficulty,
          },
          theme: {
            color: "#6D28D9",
          },

          // ✅ Payment success handler
          handler: async function (response: any) {
            console.log("✅ Razorpay Success Response:", response)
            toast({ title: "✅ Payment Successful!" })

            // ✅ Log payment record to Firestore
            try {
              await addDoc(collection(db, "paymentRecords"), {
                userId: user?.id || "guest",
                email: user?.email || "",
                amount,
                difficulty,
                orderId: order.id,
                paymentId: response.razorpay_payment_id || "",
                status: "success",
                delivered: false, // 👉 updated later when questions shown
                createdAt: serverTimestamp(),
              })
              console.log("✅ Payment log saved")
            } catch (err) {
              console.error("🔥 Failed to log payment:", err)
            }

            if (onSuccess) onSuccess()
            else if (redirectUrl) router.push(redirectUrl)
          },
        }

        // @ts-ignore
        const rzp = new window.Razorpay(options)
        rzp.open()
      } catch (error: any) {
        console.error("❌ Razorpay Error:", error)
        toast({ title: "Payment Failed", description: error.message, variant: "destructive" })

        // ✅ Log failed attempt
        try {
          await addDoc(collection(db, "paymentRecords"), {
            userId: user?.id || "guest",
            email: user?.email || "",
            amount,
            difficulty,
            orderId: null,
            paymentId: null,
            status: "failed",
            delivered: false,
            createdAt: serverTimestamp(),
          })
          console.log("⚠️ Failed payment log saved")
        } catch (err) {
          console.error("🔥 Failed to log failed payment:", err)
        }

        if (onFailure) onFailure()
      }
    }
  }, [amount, difficulty, user, redirectUrl, onSuccess, onFailure, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-center font-semibold text-purple-600 animate-pulse">
        Loading Razorpay... Please wait
      </p>
    </div>
  )
}

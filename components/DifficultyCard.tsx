"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { getWalletBalance, deductFromWallet } from "@/lib/firestore"

interface DifficultyProps {
  name: string
  emoji: string
  price: number
  description?: string
}

export default function DifficultyCard({ name, emoji, price, description }: DifficultyProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading } = useAuth()
  const [clicking, setClicking] = useState(false)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const fetchBalance = async () => {
      if (user?.uid) {
        const b = await getWalletBalance(user.uid)
        setBalance(b)
      }
    }
    fetchBalance()
  }, [user])

  const handleClick = async () => {
    console.log("🎯 Quiz card clicked:", name, "Price:", price)

    if (!user || !user.uid) {
      console.warn("⚠️ User not loaded yet or UID missing.")
      toast({ title: "Login required", description: "Please sign in to start a quiz." })
      return
    }

    const uid = user.uid
    console.log("🔐 User UID:", uid)
    setClicking(true)

    try {
      if (price > 0) {
        console.log("💰 Checking wallet balance...")
        const currentBalance = await getWalletBalance(uid)
        setBalance(currentBalance)
        console.log("💼 Current wallet balance:", currentBalance)

        if (currentBalance < price) {
          console.warn(`❌ Insufficient balance: ₹${currentBalance} < ₹${price}`)
          const proceed = confirm(
            `You need ₹${price} to start this quiz.\nYour current balance is ₹${currentBalance}.\n\nWould you like to add money now?`
          )
          if (!proceed) {
            setClicking(false)
            return
          }

          // ✅ Create order from backend
          const orderRes = await fetch("/api/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: price, uid }),
          })
          const { order } = await orderRes.json()

          if (!order?.id) {
            throw new Error("Order creation failed")
          }

          console.log("🧾 Created Razorpay Order:", order.id)

          const script = document.createElement("script")
          script.src = "https://checkout.razorpay.com/v1/checkout.js"
          script.async = true
          document.body.appendChild(script)

          script.onload = () => {
            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
              amount: order.amount,
              currency: "INR",
              name: "ProveYourMind",
              description: `Pay for ${name} quiz`,
              order_id: order.id,
              prefill: {
                email: user.email || "",
              },
              notes: {
                userId: uid,
                difficulty: name,
              },
              theme: {
                color: "#6D28D9",
              },
              handler: async function (response: any) {
                console.log("✅ Razorpay Payment Successful:", response)
                toast({ title: "Payment Successful", description: "Balance added. Starting quiz..." })

                // ✅ Deduct after payment (you can replace this with wallet top-up if needed)
                await deductFromWallet(uid, price)
                router.push(`/quiz/${name.toLowerCase()}`)
              },
            }

            // @ts-ignore
            const rzp = new window.Razorpay(options)
            rzp.open()
          }

          script.onerror = () => {
            toast({ title: "Payment Error", description: "Failed to load Razorpay script." })
          }

          setClicking(false)
          return
        }

        console.log("✅ Sufficient balance. Deducting ₹" + price)
        await deductFromWallet(uid, price)
        toast({ title: "Success", description: `₹${price} deducted. Good luck!` })
      } else {
        console.log("🆓 Free quiz. No wallet deduction needed.")
      }

      router.push(`/quiz/${name.toLowerCase()}`)
    } catch (err) {
      console.error("❌ Error starting quiz:", err)
      toast({ title: "Error", description: "Something went wrong. Try again.", variant: "destructive" })
    } finally {
      setClicking(false)
    }
  }

  return (
    <Card className="bg-white shadow-md rounded-xl p-4 hover:scale-105 transition-transform min-w-[240px] flex flex-col justify-between">
      <div>
        <div className="text-3xl mb-2">{emoji}</div>
        <h3 className="text-lg font-bold">{name} Quiz</h3>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <p className="text-md font-medium mb-3">
          {price === 0 ? "Free" : `₹${price} Entry`}
        </p>
      </div>

      <Button
        onClick={handleClick}
        disabled={clicking || loading}
        className="w-full bg-black text-white hover:bg-gray-900"
      >
        {clicking || loading ? "Loading..." : "Start Quiz"}
      </Button>
    </Card>
  )
}

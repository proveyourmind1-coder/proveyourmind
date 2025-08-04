"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { fetchUserWalletBalance, updateUserWalletBalance } from "@/lib/firestore"
import { createRazorpayOrder, getRazorpayKey } from "@/lib/razorpay-config"
import { useAuth } from "@/components/providers/auth-provider"

const WALLET_AMOUNTS = [10, 50, 100]

export default function WalletCard() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.id) return
    const loadBalance = async () => {
      const bal = await fetchUserWalletBalance(user.id)
      setBalance(bal || 0)
    }
    loadBalance()
  }, [user?.id])

  const handleAddMoney = async (amount: number) => {
    if (!user?.id) {
      toast({ title: "Please log in to add money." })
      return
    }

    try {
      setLoading(true)

      // 1. Get Razorpay key and create order
      const key = await getRazorpayKey()
      const { id: order_id } = await createRazorpayOrder(amount, user.id)

      // 2. Open Razorpay checkout
      const options = {
        key,
        amount: amount * 100,
        currency: "INR",
        name: "ProveYourMind",
        description: "Wallet Top-up",
        order_id,
        handler: async function (response: any) {
          // 3. On success, update wallet
          await updateUserWalletBalance(user.id, amount)
          toast({ title: "Wallet topped up!", description: `₹${amount} added successfully.` })
          setBalance((prev) => prev + amount)
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#6366f1",
        },
      }

      const razor = new (window as any).Razorpay(options)
      razor.open()
    } catch (err: any) {
      console.error("Razorpay error:", err)
      toast({ title: "Payment failed", description: err.message || "Try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-lg font-bold mb-2">💰 Wallet Balance</h2>
      <p className="text-2xl font-semibold text-green-600 mb-4">₹{balance}</p>
      <div className="flex gap-3">
        {WALLET_AMOUNTS.map((amt) => (
          <Button
            key={amt}
            onClick={() => handleAddMoney(amt)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add ₹{amt}
          </Button>
        ))}
      </div>
    </div>
  )
}

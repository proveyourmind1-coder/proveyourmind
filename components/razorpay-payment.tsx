"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { CreditCard, CheckCircle, Shield } from "lucide-react"

interface RazorpayPaymentProps {
  amount: number
  quizType: string
  onSuccess: (paymentId: string) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function RazorpayPayment({ amount, quizType, onSuccess }: RazorpayPaymentProps) {
  const [processing, setProcessing] = useState(false)
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchRazorpayKey = async () => {
      try {
        const response = await fetch("/api/razorpay-config")
        const data = await response.json()
        if (response.ok) {
          setRazorpayKeyId(data.keyId)
        } else {
          // Log the specific error from the API route if available
          console.error("Failed to fetch Razorpay config from API:", data.error || "Unknown error")
          throw new Error(data.error || "Failed to fetch payment configuration.")
        }
      } catch (error: any) {
        console.error("Client-side error fetching Razorpay key:", error.message, error)
        toast({
          title: "Payment Setup Error",
          description: error.message || "Could not load payment configuration. Please try again later.",
          variant: "destructive",
        })
      }
    }
    fetchRazorpayKey()
  }, [toast])

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK script.")
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!razorpayKeyId) {
      toast({
        title: "Payment Not Ready",
        description: "Payment configuration is still loading or failed. Please wait a moment.",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Check your internet connection.")
      }

      // Create order on backend
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: "INR",
          quizType,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        // Log the specific error from the API route if available
        console.error("Failed to create Razorpay order on backend:", orderData.error || "Unknown error")
        throw new Error(orderData.error || "Failed to initiate payment. Please try again.")
      }

      // Configure Razorpay options
      const options = {
        key: razorpayKeyId, // Dynamically fetched Key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ProveYourMind",
        description: `${quizType} Quiz Entry Fee`,
        order_id: orderData.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#7C3AED", // Purple theme
        },
        handler: (response: any) => {
          // Payment successful
          toast({
            title: "Payment Successful! 🎉",
            description: `₹${amount} paid for ${quizType} quiz`,
          })
          onSuccess(response.razorpay_payment_id)
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
            toast({
              title: "Payment Cancelled",
              description: "You closed the payment window. You can try again when ready.",
              variant: "destructive",
            })
          },
        },
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error("Client-side payment process error:", error.message, error)
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong during payment. Please try again.",
        variant: "destructive",
      })
      setProcessing(false)
    }
  }

  if (amount === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Free Quiz!</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => onSuccess("free")} className="w-full bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-2 h-4 w-4" />
            Start Free Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Secure Payment</CardTitle>
        <div className="text-3xl font-bold text-purple-600">₹{amount}</div>
        <Badge variant="secondary">{quizType} Quiz Entry</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Secure Payment Gateway</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">Your payment is protected by bank-level security</p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Quiz Entry Fee:</span>
            <span>₹{amount}</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Fee:</span>
            <span>₹0</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total Amount:</span>
            <span>₹{amount}</span>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={processing || !razorpayKeyId}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {processing ? "Opening Payment..." : `Pay ₹${amount}`}
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <img src="/placeholder.svg?height=20&width=60&text=Razorpay" alt="Razorpay" className="h-4" />
          <span>Powered by Razorpay</span>
        </div>
      </CardContent>
    </Card>
  )
}
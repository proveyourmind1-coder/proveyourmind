"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, CheckCircle } from "lucide-react"

interface PaymentDemoProps {
  amount: number
  quizType: string
  onSuccess: () => void
}

export function PaymentDemo({ amount, quizType, onSuccess }: PaymentDemoProps) {
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      toast({
        title: "Payment Successful! 🎉",
        description: `₹${amount} paid for ${quizType} quiz`,
      })
      onSuccess()
    }, 2000)
  }

  if (amount === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Free Quiz!</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={onSuccess} className="w-full bg-green-600 hover:bg-green-700">
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
        <CardTitle>Payment Required</CardTitle>
        <div className="text-3xl font-bold text-purple-600">₹{amount}</div>
        <Badge variant="secondary">{quizType} Quiz</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> This is a demonstration for Razorpay verification. No actual payment will be
            processed.
          </p>
        </div>

        <Button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {processing ? "Processing..." : `Pay ₹${amount} (Demo)`}
        </Button>

        <div className="text-xs text-gray-500 text-center">Powered by Razorpay • Secure Payment Gateway</div>
      </CardContent>
    </Card>
  )
}

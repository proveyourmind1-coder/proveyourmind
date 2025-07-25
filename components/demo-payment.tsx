"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, CheckCircle, AlertTriangle } from "lucide-react"

interface DemoPaymentProps {
  amount: number
  quizType: string
  onSuccess: (paymentId: string) => void
}

export function DemoPayment({ amount, quizType, onSuccess }: DemoPaymentProps) {
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  const handleDemoPayment = async () => {
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      toast({
        title: "Demo Payment Successful! 🎉",
        description: `₹${amount} paid for ${quizType} quiz (Demo Mode)`,
      })
      onSuccess(`demo_${Date.now()}`)
    }, 2000)
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
        <CardTitle>Demo Payment</CardTitle>
        <div className="text-3xl font-bold text-purple-600">₹{amount}</div>
        <Badge variant="secondary">{quizType} Quiz Entry</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Demo Mode Active</span>
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            Payment gateway is in demo mode. No real payment will be processed.
          </p>
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
          onClick={handleDemoPayment}
          disabled={processing}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {processing ? "Processing Demo Payment..." : `Pay ₹${amount} (Demo)`}
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <span>🔒 Demo Mode • No Real Payment</span>
        </div>
      </CardContent>
    </Card>
  )
}

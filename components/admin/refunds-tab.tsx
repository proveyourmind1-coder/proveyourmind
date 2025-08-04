"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { refundQuizPayment, getFailedQuizAttempts } from "@/lib/firestore" // ✅ Adjust path if needed

export default function RefundsTab() {
  const { toast } = useToast()
  const [failedAttempts, setFailedAttempts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadFailedAttempts = async () => {
    setLoading(true)
    try {
      const data = await getFailedQuizAttempts()
      console.log("✅ Loaded failed attempts:", data)
      setFailedAttempts(data)
    } catch (error) {
      console.error("❌ Failed to load failed attempts:", error)
      toast({ title: "Error", description: "Failed to fetch refund data", variant: "destructive" })
    }
    setLoading(false)
  }

  const handleRefund = async (attemptId: string) => {
    try {
      await refundQuizPayment(attemptId)
      toast({ title: "Refunded", description: "User has been refunded 💸" })
      loadFailedAttempts()
    } catch (error) {
      console.error("❌ Refund failed:", error)
      toast({ title: "Error", description: "Refund failed", variant: "destructive" })
    }
  }

  useEffect(() => {
    loadFailedAttempts()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔁 Failed Attempts Needing Refund</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Loading failed transactions...</p>
        ) : failedAttempts.length === 0 ? (
          <p className="text-gray-500">No failed paid attempts needing refund.</p>
        ) : (
          failedAttempts.map((attempt) => (
            <div key={attempt.id} className="border rounded p-4 space-y-1">
              <p className="text-sm">
                <strong>User:</strong> {attempt.userEmail || attempt.userId}
              </p>
              <p className="text-sm">
                <strong>Difficulty:</strong> {attempt.difficulty}
              </p>
              <p className="text-sm">
                <strong>Paid:</strong> ₹{attempt.amount} | <strong>TXN:</strong>{" "}
                <span className="font-mono">{attempt.transactionId}</span>
              </p>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRefund(attempt.id)}
              >
                Refund Now
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

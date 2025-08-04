"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

export function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!feedback.trim()) return
    setSubmitting(true)
    try {
      await addDoc(collection(db, "feedback"), {
        userId: user?.id || "guest",
        message: feedback,
        email: user?.email || "anonymous",
        createdAt: serverTimestamp(),
      })
      toast({ title: "Thanks for your feedback!" })
      onClose()
    } catch (err) {
      toast({ title: "Error", description: "Failed to send feedback." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>💬 We value your feedback</DialogTitle>
        </DialogHeader>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Type your feedback here..."
          className="min-h-[120px]"
        />
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Sending..." : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

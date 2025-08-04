"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { submitFeedback } from "@/lib/firestore"

interface FeedbackModalProps {
  onClose: () => void
}

export function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleSubmit = async () => {
    const trimmed = feedback.trim()
    if (!trimmed || !user?.uid) return

    try {
      setSubmitting(true)
      await submitFeedback(user.uid, trimmed)
      toast({
        title: "Thanks for your feedback!",
        description: "We’ll use this to improve the experience 🚀",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error submitting feedback",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            We’d love your feedback!
          </DialogTitle>
        </DialogHeader>

        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what you loved or what could be improved..."
          className="min-h-[120px]"
        />

        <DialogFooter className="pt-4">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!feedback.trim() || submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

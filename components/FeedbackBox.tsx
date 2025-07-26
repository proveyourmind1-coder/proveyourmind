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

interface FeedbackModalProps {
  onClose: () => void
  onSubmit?: (feedback: string) => void
}

function FeedbackModal({ onClose, onSubmit }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("")

  const handleSubmit = () => {
    const trimmed = feedback.trim()
    if (!trimmed) return
    console.log("📋 User Feedback:", trimmed)
    if (onSubmit) onSubmit(trimmed)
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            We’d love your feedback!
          </DialogTitle>
        </DialogHeader>

        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what you loved or what can be improved..."
          className="min-h-[120px]"
        />

        <DialogFooter className="pt-4">
          <Button variant="secondary" onClick={onClose}>
            Skip
          </Button>
          <Button onClick={handleSubmit} disabled={!feedback.trim()}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackModal

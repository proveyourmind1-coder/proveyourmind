"use client"

import { Sparkles } from "lucide-react"

export default function FlashMarquee({ messages }: { messages?: string[] }) {
  if (!Array.isArray(messages) || messages.length === 0) return null

  return (
    <div className="w-full bg-yellow-100 py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex gap-10 px-4">
        {messages.map((msg, idx) => (
          <span key={idx} className="mx-6 flex items-center">
            <Sparkles className="w-4 h-4 mr-1 text-yellow-600" />
            {msg}
          </span>
        ))}
      </div>
    </div>
  )
}

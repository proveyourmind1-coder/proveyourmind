"use client"

import { useEffect, useState } from "react"
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Marquee } from "@/components/ui/marquee"

export function LiveBroadcastFeed() {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const q = query(collection(db, "broadcasts"), orderBy("timestamp", "desc"), limit(10))
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data().message)
      setMessages(msgs)
    })
    return () => unsub()
  }, [])

  if (!messages.length) return null

  return (
    <div className="w-full py-2 bg-yellow-100 border-t border-b border-yellow-300 shadow-sm">
      <Marquee className="text-sm text-yellow-900 font-semibold tracking-wide">
        {messages.map((msg, i) => (
          <span key={i} className="mx-6">💥 {msg}</span>
        ))}
      </Marquee>
    </div>
  )
}
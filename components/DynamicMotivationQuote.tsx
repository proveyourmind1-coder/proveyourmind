// components/DynamicMotivationQuote.tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

// 💬 Sample motivational quotes
const quotes = [
  "Believe in your brainpower! 🧠",
  "One quiz at a time, you're leveling up! 🎯",
  "Consistency beats intensity. Keep going! 🔥",
  "Knowledge is your superpower! 💡",
  "You're smarter than you think. Keep proving it! 🚀",
  "Winners focus on progress, not perfection! 🏆",
  "The mind grows when challenged. Stay sharp! ✨"
]

export default function DynamicMotivationQuote() {
  const [quote, setQuote] = useState(quotes[0])

  useEffect(() => {
    // 🕒 Rotate quote every 8 seconds
    const interval = setInterval(() => {
      const next = quotes[Math.floor(Math.random() * quotes.length)]
      setQuote(next)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="bg-gradient-to-r from-pink-100 to-yellow-100 p-3 rounded-lg shadow flex items-center gap-2 text-sm font-medium text-gray-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
      <span>{quote}</span>
    </motion.div>
  )
}

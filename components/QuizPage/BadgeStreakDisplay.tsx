"use client"

import { motion } from "framer-motion"

export function BadgeStreakDisplay({ score }: { score: number }) {
  const getBadge = () => {
    if (score >= 10) return "🏆 Champion"
    if (score >= 7) return "🔥 Streak Master"
    if (score >= 4) return "🎯 Rising Star"
    return "✨ Keep Going"
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="my-4 text-lg font-semibold text-purple-700"
    >
      🏅 {getBadge()}
    </motion.div>
  )
}

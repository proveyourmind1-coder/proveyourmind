"use client"

import { useEffect, useState } from "react"
import { Award, Flame, Star, Zap } from "lucide-react"
import { motion } from "framer-motion"

interface Props {
  score: number // 🌟 Final quiz score (0-10)
}

export default function BadgeStreakDisplay({ score }: Props) {
  const [badge, setBadge] = useState("")                // 🏷️ Badge title
  const [icon, setIcon] = useState<JSX.Element | null>(null) // 🖼️ Matching animated icon

  // 🧠 Determine badge type based on score
  useEffect(() => {
    if (score >= 9) {
      setBadge("Genius Champion")
      setIcon(<Award className="text-yellow-500 animate-bounce" size={32} />)
    } else if (score >= 7) {
      setBadge("Quiz Master")
      setIcon(<Zap className="text-purple-600 animate-pulse" size={32} />)
    } else if (score >= 5) {
      setBadge("Brainy Buddy")
      setIcon(<Star className="text-blue-500 animate-spin" size={28} />)
    } else if (score > 0) {
      setBadge("Rising Thinker")
      setIcon(<Flame className="text-orange-500 animate-ping" size={24} />)
    } else {
      setBadge("Keep Trying!")
      setIcon(<Flame className="text-gray-400" size={20} />)
    }
  }, [score])

  return (
    <motion.div
      className="text-center mt-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* 🏅 Badge Icon */}
      <div className="flex justify-center mb-2">{icon}</div>

      {/* 📛 Badge Name */}
      <p className="text-lg font-semibold text-purple-800">
        🏅 {badge}
      </p>
    </motion.div>
  )
}

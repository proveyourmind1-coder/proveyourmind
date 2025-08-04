"use client"

// 🚀 RankProgressBar Component
// Shows animated rank progress (e.g. XP bar or score progress)

import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"

interface RankProgressBarProps {
  currentScore: number
  maxScore?: number
  rank?: number
}

export default function RankProgressBar({ currentScore, maxScore = 1000, rank = 10 }: RankProgressBarProps) {
  const [progress, setProgress] = useState(0)

  // 🌀 Animate progress bar fill
  useEffect(() => {
    const percent = Math.min((currentScore / maxScore) * 100, 100)
    const timer = setTimeout(() => setProgress(percent), 500)
    return () => clearTimeout(timer)
  }, [currentScore, maxScore])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md p-4 rounded-xl border border-gray-200"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Your Rank Progress</h3>
        <span className="text-xs text-gray-500">Rank #{rank}</span>
      </div>

      {/* 🌟 Animated Score Bar */}
      <Progress value={progress} className="h-3 rounded-full" />

      <div className="text-xs text-gray-600 mt-2 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        You’ve scored {currentScore} out of {maxScore} points
      </div>
    </motion.div>
  )
}

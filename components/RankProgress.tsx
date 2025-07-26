"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, BadgeCheck } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// 🧩 Props for dynamic progress visualization
interface RankProgressProps {
  rank: number
  totalScore: number
  badgeUnlocked?: boolean
}

const RankProgress: React.FC<RankProgressProps> = ({
  rank,
  totalScore,
  badgeUnlocked = false,
}) => {
  const [progress, setProgress] = useState(0)

  // 📈 Animate progress based on totalScore
  useEffect(() => {
    const goal = Math.min(100, Math.floor((totalScore / 2500) * 100)) // Assume 2500 = top score
    const timer = setTimeout(() => setProgress(goal), 400)
    return () => clearTimeout(timer)
  }, [totalScore])

  return (
    <motion.div
      className="p-4 border rounded-xl bg-white shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 🔥 Header */}
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="text-yellow-500 w-5 h-5" />
        <p className="text-sm font-semibold text-gray-700">
          Rank Progress: <span className="text-purple-700">#{rank}</span>
        </p>
      </div>

      {/* 📊 Progress bar */}
      <Progress value={progress} className="h-2 bg-gray-200" />

      {/* 🏅 Badge popup */}
      {badgeUnlocked && (
        <motion.div
          className="mt-3 flex items-center gap-2 text-green-600 font-bold text-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        >
          <BadgeCheck className="w-4 h-4" />
          Badge Unlocked!
        </motion.div>
      )}
    </motion.div>
  )
}

export default RankProgress

"use client"

import { motion } from "framer-motion"

interface UserStreakProgressProps {
  streak: number
  maxStreak: number
}

export default function UserStreakProgress({ streak, maxStreak }: UserStreakProgressProps) {
  // ✅ Safety: fallback to 0 if undefined
  const currentStreak = isNaN(streak) ? 0 : streak
  const maximum = isNaN(maxStreak) || maxStreak === 0 ? 10 : maxStreak // prevent divide-by-zero
  const percentage = Math.min((currentStreak / maximum) * 100, 100)
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-24 h-24">
      {/* Animated progress ring */}
      <svg className="absolute top-0 left-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#ddd"
          strokeWidth="10"
          fill="transparent"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#00bcd4"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1 }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800">
        🔥 {currentStreak}
      </div>
    </div>
  )
}

// components/BadgeGrid.tsx
"use client"

// 🏅 BadgeGrid: Displays user's achievement badges with visual effects
import React from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface Badge {
  emoji: string
  title: string
  description: string
  earned: boolean
}

interface BadgeGridProps {
  badges: Badge[]
}

export default function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 border">
      {/* 🔰 Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h2 className="text-sm font-semibold text-gray-800">Your Achievements</h2>
      </div>

      {/* 🧩 Badge Display Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={index}
            className={`p-3 rounded-lg border text-center ${
              badge.earned
                ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 shadow-sm animate-pulse"
                : "bg-gray-100 border-gray-200 opacity-50"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-2xl mb-1">{badge.emoji}</div>
            <div className="text-xs font-medium">{badge.title}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

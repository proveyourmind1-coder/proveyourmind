"use client"

// 📢 DashboardTeaserCard: Shows upcoming features with emoji + title + tag
import React from "react"
import { motion } from "framer-motion"

interface TeaserCardProps {
  emoji: string
  title: string
  tag?: string
}

export default function DashboardTeaserCard({ emoji, title, tag }: TeaserCardProps) {
  return (
    <motion.div
      className="bg-gradient-to-br from-pink-100 to-purple-100 p-4 rounded-xl border border-pink-200 shadow-md hover:shadow-lg transition"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {tag && <p className="text-xs text-purple-700 mt-1 italic">{tag}</p>}
    </motion.div>
  )
}

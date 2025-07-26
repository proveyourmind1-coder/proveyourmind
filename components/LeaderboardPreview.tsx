"use client"

// 🏆 LeaderboardPreview: Shows top 3 users with ranks and scores
import React from "react"
import { Crown } from "lucide-react"
import { motion } from "framer-motion"

interface LeaderboardUser {
  name: string
  score: number
  rank: number
}

interface LeaderboardPreviewProps {
  users: LeaderboardUser[]
}

export default function LeaderboardPreview({ users }: LeaderboardPreviewProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 border">
      {/* 🥇 Title */}
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5 text-yellow-500" />
        <h2 className="text-sm font-semibold text-gray-800">Top Performers</h2>
      </div>

      {/* 👥 Top 3 User List */}
      <div className="space-y-2">
        {users.slice(0, 3).map((user, index) => (
          <motion.div
            key={index}
            className="flex justify-between items-center bg-gray-50 p-2 rounded-md border hover:bg-yellow-50 transition"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-yellow-600">#{user.rank}</span>
              <span className="text-sm">{user.name}</span>
            </div>
            <div className="text-xs text-gray-600">{user.score} pts</div>
          </motion.div>
        ))}
      </div>

      {/* 🔗 Link to full leaderboard */}
      <div className="text-right mt-2">
        <a href="/leaderboard" className="text-xs text-blue-600 hover:underline">
          View full leaderboard →
        </a>
      </div>
    </div>
  )
}

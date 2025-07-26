// components/AchievementsBlock.tsx

"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Star, Award } from "lucide-react"

export default function AchievementsBlock() {
  const badges = [
    { icon: <Trophy className="text-yellow-500 w-6 h-6" />, label: "Top Scorer" },
    { icon: <Star className="text-purple-500 w-6 h-6" />, label: "5-Day Streak" },
    { icon: <Award className="text-green-500 w-6 h-6" />, label: "100 Points" },
  ]

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-3">🏅 Achievements</h3>
      <div className="flex flex-col gap-2">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center gap-3">
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

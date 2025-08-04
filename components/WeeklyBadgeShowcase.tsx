"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BadgeCheck } from "lucide-react"

// Dummy badges (You can later replace this with real data from Firestore)
const weeklyBadges = [
  { title: "Speedster", description: "Completed quiz under 5 mins ⏱️", color: "bg-green-200" },
  { title: "Perfectionist", description: "Scored 100% in Expert level 🌟", color: "bg-yellow-200" },
  { title: "Comeback King", description: "Improved score by 50% 🏆", color: "bg-purple-200" },
]

const WeeklyBadgeShowcase = () => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Card className="w-full shadow-md border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
            <BadgeCheck className="text-green-500" /> Weekly Badge Showcase
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {weeklyBadges.map((badge, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`rounded-lg p-3 ${badge.color} shadow-sm`}
            >
              <h4 className="font-semibold text-sm">{badge.title}</h4>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default WeeklyBadgeShowcase

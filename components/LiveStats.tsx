"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LiveStats() {
  const [stats, setStats] = useState<{
    totalPlayers: number
    totalAttempts: number
    quizzesPlayed: number
    prizesAwarded: number
  } | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const docRef = doc(db, "stats", "global")
        const snapshot = await getDoc(docRef)
        if (snapshot.exists()) {
          const data = snapshot.data()
          setStats({
            totalPlayers: data.totalPlayers || 0,
            totalAttempts: data.totalAttempts || 0,
            quizzesPlayed: data.quizzesPlayed || 0,
            prizesAwarded: data.prizesAwarded || 0,
          })
        } else {
          console.warn("No stats/global doc found.")
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  if (!stats) {
    return <div className="text-center text-gray-500 py-4">Loading real stats...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Community Stats (Live)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Players</span>
            <span className="font-semibold">{stats.totalPlayers.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Attempts</span>
            <span className="font-semibold">{stats.totalAttempts.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Quizzes Played</span>
            <span className="font-semibold">{stats.quizzesPlayed.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Prizes Awarded</span>
            <span className="font-semibold text-green-600">₹{stats.prizesAwarded.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

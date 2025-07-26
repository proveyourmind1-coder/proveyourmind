"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, query, orderBy, limit } from "firebase/firestore"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function LiveStatsSwitcher() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [totalWinners, setTotalWinners] = useState(0)
  const [topScore, setTopScore] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Total Users
        const usersSnapshot = await getDocs(collection(db, "users"))
        setTotalUsers(usersSnapshot.size)

        // Total Attempts from central stats doc
        const statsDoc = await getDoc(doc(db, "stats", "global"))
        if (statsDoc.exists()) {
          const data = statsDoc.data()
          setTotalAttempts(data?.totalAttempts || 0)
        }

        // Top Score
        const topScoreQuery = query(
          collection(db, "users"),
          orderBy("score", "desc"),
          limit(1)
        )
        const topSnapshot = await getDocs(topScoreQuery)
        const top = topSnapshot.docs[0]?.data()?.score || 0
        setTopScore(top)

        // Total Winners (example: score >= 800)
        const winnerQuery = query(collection(db, "users"))
        const winnerSnapshot = await getDocs(winnerQuery)
        const winners = winnerSnapshot.docs.filter(doc => (doc.data()?.score || 0) >= 800)
        setTotalWinners(winners.length)
      } catch (error) {
        console.error("Error fetching live stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-indigo-700">📊 Platform Stats</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Real-time community quiz insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
            <p className="text-sm text-gray-700">👥 Total Users</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{totalAttempts}</p>
            <p className="text-sm text-gray-700">🧠 Quizzes Played</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{totalWinners}</p>
            <p className="text-sm text-gray-700">🏆 Winners (800+ pts)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{topScore} pts</p>
            <p className="text-sm text-gray-700">🔥 Top Score</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

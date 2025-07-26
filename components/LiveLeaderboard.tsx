"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { Crown, Medal, Star, TrendingUp, Trophy, Users } from "lucide-react"
import Image from "next/image"

interface Player {
  id: string
  name: string
  score: number
  streak: number
  badges: number
  avatar?: string
}

export default function LiveLeaderboard() {
  const { user } = useAuth()
  const [players, setPlayers] = useState<Player[]>([])
  const [activeTab, setActiveTab] = useState("weekly")

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("score", "desc"), limit(12))
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map((doc, index) => ({
          id: doc.id,
          name: doc.data().name || "Player",
          score: doc.data().score || 0,
          streak: doc.data().streak || 0,
          badges: doc.data().badges || 0,
          avatar: doc.data().avatar || "/placeholder.svg?height=40&width=40",
          rank: index + 1,
        }))
        setPlayers(data)
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
      }
    }

    fetchLeaderboard()
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return (
          <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-white">
            {rank}
          </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Live Leaderboard
        </CardTitle>
        <CardDescription>Top users fetched from Firestore</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>

          {/* We use same data for now in all tabs */}
          {["weekly", "monthly", "allTime"].map((period) => (
            <TabsContent key={period} value={period} className="mt-4 space-y-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    player.name === user?.name
                      ? "bg-purple-50 border-purple-200 ring-2 ring-purple-200"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {getRankIcon(player.rank)}
                    <Image
                      src={player.avatar || "/placeholder.svg"}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm text-gray-500 flex gap-4">
                        <span>
                          <Star className="inline w-3 h-3 mr-1" />
                          {player.badges} badges
                        </span>
                        <span>
                          <TrendingUp className="inline w-3 h-3 mr-1" />
                          {player.streak} streak
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">
                      {player.score.toLocaleString()} pts
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

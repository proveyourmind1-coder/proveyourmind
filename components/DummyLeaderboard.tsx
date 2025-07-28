"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Crown, Medal, Star, TrendingUp, Trophy, Users } from "lucide-react"
import Image from "next/image"

const dummyPlayers = [
  { rank: 1, name: "QuizMaster", score: 2450, streak: 15, badges: 12 },
  { rank: 2, name: "BrainGenius", score: 2100, streak: 8, badges: 9 },
  { rank: 3, name: "SmartCookie", score: 1950, streak: 12, badges: 8 },
  { rank: 4, name: "ThinkTank", score: 1800, streak: 6, badges: 7 },
  { rank: 5, name: "WisdomSeeker", score: 1750, streak: 9, badges: 6 },
]

export default function DummyLeaderboard() {
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
          Dummy Leaderboard
        </CardTitle>
        <CardDescription>This is static demo data only</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="allTime">All Time</TabsTrigger>
          </TabsList>

          {["weekly", "monthly", "allTime"].map((period) => (
            <TabsContent key={period} value={period} className="mt-4 space-y-3">
              {dummyPlayers.map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    {getRankIcon(player.rank)}
                    <Image
                      src="/placeholder.svg?height=40&width=40"
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

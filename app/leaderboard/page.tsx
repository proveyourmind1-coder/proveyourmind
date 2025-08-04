"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/providers/auth-provider"
import { Crown, Trophy, Medal, Star, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast" // Import useToast

const leaderboardData = {
  weekly: [
    { rank: 1, name: "QuizMaster", score: 2450, avatar: "/placeholder.svg?height=40&width=40", streak: 15, badges: 12 },
    { rank: 2, name: "BrainGenius", score: 2100, avatar: "/placeholder.svg?height=40&width=40", streak: 8, badges: 9 },
    { rank: 3, name: "SmartCookie", score: 1950, avatar: "/placeholder.svg?height=40&width=40", streak: 12, badges: 8 },
    { rank: 4, name: "ThinkTank", score: 1800, avatar: "/placeholder.svg?height=40&width=40", streak: 6, badges: 7 },
    { rank: 5, name: "WisdomSeeker", score: 1750, avatar: "/placeholder.svg?height=40&width=40", streak: 9, badges: 6 },
    {
      rank: 6,
      name: "KnowledgeKing",
      score: 1650,
      avatar: "/placeholder.svg?height=40&width=40",
      streak: 4,
      badges: 5,
    },
    { rank: 7, name: "QuizQueen", score: 1600, avatar: "/placeholder.svg?height=40&width=40", streak: 11, badges: 8 },
    { rank: 8, name: "MindMaster", score: 1550, avatar: "/placeholder.svg?height=40&width=40", streak: 3, badges: 4 },
    { rank: 9, name: "BrainBox", score: 1500, avatar: "/placeholder.svg?height=40&width=40", streak: 7, badges: 6 },
    { rank: 10, name: "SmartStar", score: 1450, avatar: "/placeholder.svg?height=40&width=40", streak: 5, badges: 5 },
    { rank: 11, name: "QuizChamp", score: 1400, avatar: "/placeholder.svg?height=40&width=40", streak: 2, badges: 3 },
    { rank: 12, name: "John Doe", score: 1250, avatar: "/placeholder.svg?height=40&width=40", streak: 7, badges: 3 },
  ],
  monthly: [
    { rank: 1, name: "QuizMaster", score: 8450, avatar: "/placeholder.svg?height=40&width=40", streak: 25, badges: 15 },
    {
      rank: 2,
      name: "BrainGenius",
      score: 7800,
      avatar: "/placeholder.svg?height=40&width=40",
      streak: 18,
      badges: 12,
    },
    {
      rank: 3,
      name: "SmartCookie",
      score: 7200,
      avatar: "/placeholder.svg?height=40&width=40",
      streak: 22,
      badges: 11,
    },
    { rank: 4, name: "ThinkTank", score: 6900, avatar: "/placeholder.svg?height=40&width=40", streak: 16, badges: 10 },
    {
      rank: 5,
      name: "WisdomSeeker",
      score: 6500,
      avatar: "/placeholder.svg?height=40&width=40",
      streak: 19,
      badges: 9,
    },
    { rank: 12, name: "John Doe", score: 4250, avatar: "/placeholder.svg?height=40&width=40", streak: 12, badges: 6 },
  ],
  allTime: [
    {
      rank: 1,
      name: "QuizMaster",
      score: 25450,
      avatar: "/placeholder.svg?height=40&width=40",
      streak: 45,
      badges: 25,
    },
    {
      rank: 2,
      name: "BrainGenius",
      score: 22100,
      avatar: "/placeholder.svg?height=40&width=40",
      streak: 38,
      badges: 22,
    },
    {
      rank: 3,
      name: "SmartCookie",
      score: 19950,
      avatar: "/placeholder.svg?height=40&width=40",
      streak: 42,
      badges: 20,
    },
    { rank: 12, name: "John Doe", score: 12250, avatar: "/placeholder.svg?height=40&width=40", streak: 28, badges: 15 },
  ],
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("weekly")
  const { toast } = useToast() // Initialize useToast

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

  const getRankBadge = (rank: number) => {
    if (rank <= 3) return "bg-gradient-to-r from-yellow-400 to-yellow-600"
    if (rank <= 10) return "bg-gradient-to-r from-purple-400 to-purple-600"
    return "bg-gradient-to-r from-gray-400 to-gray-600"
  }

  const handleViewAllBadges = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "A dedicated page to view all your badges is under development.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
                Leaderboard
              </h1>
              <p className="text-gray-600 mt-1">Compete with the best minds in India</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Rankings
                </CardTitle>
                <CardDescription>See how you stack up against other players</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="weekly">This Week</TabsTrigger>
                    <TabsTrigger value="monthly">This Month</TabsTrigger>
                    <TabsTrigger value="allTime">All Time</TabsTrigger>
                  </TabsList>

                  {Object.entries(leaderboardData).map(([period, data]) => (
                    <TabsContent key={period} value={period} className="mt-6">
                      <div className="space-y-3">
                        {data.map((player, index) => (
                          <div
                            key={player.rank}
                            className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                              player.name === user?.name
                                ? "bg-purple-50 border-purple-200 ring-2 ring-purple-200"
                                : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center justify-center w-8">{getRankIcon(player.rank)}</div>

                              <img
                                src={player.avatar || "/placeholder.svg?height=40&width=40"}
                                alt={player.name}
                                className="w-10 h-10 rounded-full"
                              />

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">
                                    {player.name}
                                    {player.name === user?.name && (
                                      <Badge variant="secondary" className="ml-2">
                                        You
                                      </Badge>
                                    )}
                                  </span>
                                  {player.rank <= 3 && (
                                    <Badge className={getRankBadge(player.rank)}>Top {player.rank}</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    {player.badges} badges
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {player.streak} day streak
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xl font-bold text-purple-600">
                                {player.score.toLocaleString()} Score Points
                              </div>{" "}
                              {/* Clarified "Points" */}
                              <div className="text-sm text-gray-500">earned</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Rank */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-purple-600">#{user?.rank}</div>
                  <div className="text-sm text-gray-600">Current Position</div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly</span>
                      <span className="font-semibold">#12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly</span>
                      <span className="font-semibold">#12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>All Time</span>
                      <span className="font-semibold">#12</span>
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Trophy className="mr-2 h-4 w-4" />
                    Climb Higher
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Prizes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Weekly Prizes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">1st Place</span>
                    </div>
                    <span className="font-bold text-green-600">₹5,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">2nd Place</span>
                    </div>
                    <span className="font-bold text-green-600">₹3,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Medal className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">3rd Place</span>
                    </div>
                    <span className="font-bold text-green-600">₹1,000</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-3">Prizes are awarded every Sunday at midnight</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Players</span>
                    <span className="font-semibold">50,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active This Week</span>
                    <span className="font-semibold">12,456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Quizzes Played</span>
                    <span className="font-semibold">2.1M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Prizes Awarded</span>
                    <span className="font-semibold text-green-600">₹10.2L</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

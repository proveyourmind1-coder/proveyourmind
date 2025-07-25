"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/providers/auth-provider"
import {
  Trophy,
  Zap,
  Target,
  Users,
  Star,
  Gift,
  TrendingUp,
  Calendar,
  Crown,
  FlameIcon as Fire,
  LogOut,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast" // Import useToast
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { toast } = useToast() // Initialize useToast
  const router = useRouter()

  if (!user) {
    console.log("User role:", user?.role)
    return <div>Please login to access dashboard</div>
  }

  const difficultyLevels = [
    {
      name: "Easy",
      price: 0,
      emoji: "🟢",
      description: "Free practice quizzes",
      color: "bg-green-500",
    },
    {
      name: "Medium",
      price: 10,
      emoji: "🟡",
      description: "Moderate challenge",
      color: "bg-yellow-500",
    },
    {
      name: "Hard",
      price: 50,
      emoji: "🟠",
      description: "Serious competition",
      color: "bg-orange-500",
    },
    {
      name: "Expert",
      price: 100,
      emoji: "🔴",
      description: "Ultimate challenge",
      color: "bg-red-500",
    },
  ]

  const recentAchievements = [
    { name: "First Quiz", icon: Star, color: "text-yellow-500" },
    { name: "Streak Master", icon: Fire, color: "text-red-500" },
    { name: "Top Scorer", icon: Crown, color: "text-purple-500" },
  ]

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={user.photoURL || "/placeholder.svg?height=40&width=40"}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  Welcome back, {user.name}!{user.role === "admin" && <Badge className="bg-purple-600">Admin</Badge>}
                </h1>
                <p className="text-gray-600">Ready to prove your mind?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Fire className="h-4 w-4" />
                {user.streak} day streak
              </Badge>
              <Badge className="bg-purple-600">Rank #{user.rank}</Badge>
              {user.role === "admin" && ( // Conditionally render for admin
                <Link href="/admin">
                  <Button variant="outline" className="bg-transparent">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={() => logout("/")} className="bg-transparent">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Score</CardTitle>
                  <Trophy className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.totalScore}</div>
                  <p className="text-xs text-muted-foreground">+180 from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quizzes Played</CardTitle>
                  <Target className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.totalAttempts}</div>
                  <p className="text-xs text-muted-foreground">+12 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Quiz Difficulty Cards */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Choose Your Challenge</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {difficultyLevels.map((level, index) => (
                  <motion.div
                    key={level.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-12 h-12 rounded-full ${level.color} flex items-center justify-center text-2xl`}
                            >
                              {level.emoji}
                            </div>
                            <div>
                              <CardTitle className="group-hover:text-purple-600 transition-colors">
                                {level.name}
                              </CardTitle>
                              <CardDescription>{level.description}</CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{level.price === 0 ? "FREE" : `₹${level.price}`}</div>
                            <div className="text-sm text-gray-500">entry fee</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link href={`/quiz/${level.name.toLowerCase()}`}>
                          <Button className="w-full group-hover:bg-purple-600 transition-colors">
                            <Zap className="mr-2 h-4 w-4" />
                            Start Quiz
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completed Medium Quiz</p>
                      <p className="text-xs text-gray-500">2 hours ago • Score: 8/10</p>
                    </div>
                    <Badge variant="secondary">+80 points</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Achieved 7-day streak</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                    <Badge variant="secondary">Badge earned</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Ranked up to #12</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                    <Badge variant="secondary">Rank up</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAchievements.map((achievement, index) => (
                    <div key={achievement.name} className="flex items-center space-x-3">
                      <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                      <span className="text-sm font-medium">{achievement.name}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={handleViewAllBadges}>
                  View All Badges
                </Button>
              </CardContent>
            </Card>

            {/* Leaderboard Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">QuizMaster</span>
                    </div>
                    <span className="text-sm text-gray-500">2,450 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white">
                        2
                      </div>
                      <span className="text-sm font-medium">BrainGenius</span>
                    </div>
                    <span className="text-sm text-gray-500">2,100 pts</span>
                  </div>
                  <div className="flex items-center justify-between bg-purple-50 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-xs text-white">
                        12
                      </div>
                      <span className="text-sm font-medium">You</span>
                    </div>
                    <span className="text-sm text-purple-600">{user.totalScore} pts</span>
                  </div>
                </div>
                <Link href="/leaderboard">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View Full Leaderboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Daily Challenge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  Daily Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Science & Technology</p>
                    <p className="text-xs text-gray-500">Complete today's challenge</p>
                  </div>
                  <Progress value={0} className="h-2" />
                  <Link href="/quiz/easy">
                    {" "}
                    {/* Link to easy quiz for daily challenge */}
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Gift className="mr-2 h-4 w-4" />
                      Start Challenge
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

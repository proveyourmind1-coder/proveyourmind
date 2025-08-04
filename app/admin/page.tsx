"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Settings,
  Trophy,
  Undo2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import {
  fetchUsers,
  fetchQuizzes,
  fetchFeedback,
  getShowDummyData,
  setShowDummyData,
  getMarqueeMessage,
  setMarqueeMessage
} from "@/app/admin/actions"

import type { User, Quiz, Feedback } from "@/lib/types"
import V0Generator from "@/components/V0Generator"
import TournamentsTab from "./tournaments-tab"
import RefundsTab from "@/components/admin/refunds-tab" // ✅ Correct path

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()

  const [users, setUsers] = useState<User[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [showDummy, setShowDummy] = useState<boolean>(false)
  const [marquee, setMarquee] = useState("")
  const [isSavingMarquee, setIsSavingMarquee] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      loadUsers()
      loadQuizzes()
      loadFeedback()
      loadDummyToggle()
      loadMarquee()
    }
  }, [isAdmin])

  const loadUsers = async () => {
    try {
      const fetchedUsers = await fetchUsers()
      setUsers(fetchedUsers)
    } catch (err) {
      console.error("❌ Error loading users:", err)
      toast({ title: "Error", description: "Failed to load users.", variant: "destructive" })
    }
  }

  const loadQuizzes = async () => {
    try {
      const fetchedQuizzes = await fetchQuizzes()
      setQuizzes(fetchedQuizzes)
    } catch (err) {
      console.error("❌ Error loading quizzes:", err)
      toast({ title: "Error", description: "Failed to load quizzes.", variant: "destructive" })
    }
  }

  const loadFeedback = async () => {
    try {
      const data = await fetchFeedback()
      setFeedbacks(data)
    } catch (err) {
      console.error("❌ Feedback fetch error:", err)
      toast({
        title: "Error",
        description: "Failed to load feedback. Please check console.",
        variant: "destructive"
      })
    }
  }

  const loadDummyToggle = async () => {
    try {
      const status = await getShowDummyData()
      setShowDummy(status)
    } catch (err) {
      console.error("❌ Error loading dummy toggle:", err)
    }
  }

  const handleToggleDummy = async () => {
    const newVal = !showDummy
    try {
      await setShowDummyData(newVal)
      setShowDummy(newVal)
      toast({
        title: "Success",
        description: `Dummy data ${newVal ? "enabled" : "disabled"}`
      })
    } catch (err) {
      console.error("❌ Dummy data toggle error:", err)
      toast({
        title: "Error",
        description: "Failed to toggle dummy data. Check console.",
        variant: "destructive"
      })
    }
  }

  const loadMarquee = async () => {
    try {
      const message = await getMarqueeMessage()
      setMarquee(message)
    } catch (err) {
      console.error("❌ Error loading marquee:", err)
    }
  }

  const handleSaveMarquee = async () => {
    try {
      setIsSavingMarquee(true)
      await setMarqueeMessage(marquee)
      toast({ title: "Success", description: "Marquee message updated!" })
    } catch (err) {
      console.error("❌ Marquee update error:", err)
      toast({
        title: "Error",
        description: "Failed to update marquee",
        variant: "destructive"
      })
    } finally {
      setIsSavingMarquee(false)
    }
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <p>Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = [
    { title: "Total Users", value: users.length.toLocaleString(), change: "+12%", icon: Users, color: "text-blue-600" },
    { title: "Active Quizzes", value: quizzes.filter(q => q.isActive).length.toLocaleString(), change: "+5%", icon: BookOpen, color: "text-green-600" },
    { title: "Revenue", value: "₹2,45,000", change: "+18%", icon: DollarSign, color: "text-purple-600" },
    { title: "Completion Rate", value: "78%", change: "+3%", icon: TrendingUp, color: "text-orange-600" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-7 w-7 text-purple-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your ProveYourMind platform</p>
          </div>
          <Badge className="bg-green-600">Admin</Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="tournaments">
              <Trophy className="h-4 w-4 mr-1" /> Tournaments
            </TabsTrigger>
            <TabsTrigger value="refunds">
              <Undo2 className="h-4 w-4 mr-1" /> Refunds
            </TabsTrigger>
            <TabsTrigger value="generator">v0.dev Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="max-w-xl">
              <CardHeader>
                <CardTitle>Dummy Data Toggle</CardTitle>
                <CardDescription>Enable/Disable dummy data in stats/leaderboard</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <p>Status: <strong>{showDummy ? "Enabled" : "Disabled"}</strong></p>
                <Button onClick={handleToggleDummy} variant="outline">
                  {showDummy ? "Disable" : "Enable"}
                </Button>
              </CardContent>
            </Card>

            <Card className="max-w-3xl">
              <CardHeader>
                <CardTitle>Announcement Marquee</CardTitle>
                <CardDescription>Update the banner shown on user dashboards</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter marquee message..."
                  value={marquee}
                  onChange={(e) => setMarquee(e.target.value)}
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={handleSaveMarquee} disabled={isSavingMarquee}>
                    {isSavingMarquee ? "Saving..." : "Save Message"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Feedback</CardTitle>
                <CardDescription>Messages submitted via feedback form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedbacks.length === 0 ? (
                  <p className="text-gray-500">No feedback messages yet.</p>
                ) : (
                  feedbacks.map((fb) => (
                    <div key={fb.id} className="border rounded-lg p-4 space-y-1">
                      <p className="font-medium">
                        {fb.name}{" "}
                        {fb.email && (
                          <span className="text-xs text-gray-500">({fb.email})</span>
                        )}
                      </p>
                      <p className="text-sm">{fb.message}</p>
                      <p className="text-xs text-gray-400">
                        Submitted on {fb.createdAt?.toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6">
            <TournamentsTab />
          </TabsContent>

          <TabsContent value="refunds" className="space-y-6">
            <RefundsTab />
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>v0.dev Component Generator</CardTitle>
                <CardDescription>Describe a component and generate ready-to-use UI code</CardDescription>
              </CardHeader>
              <CardContent>
                <V0Generator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

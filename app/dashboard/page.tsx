"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase"

import FlashMarquee from "@/components/FlashMarquee"
import AnnouncementStrip from "@/components/AnnouncementStrip"
import NotificationBell from "@/components/NotificationBell"
import DynamicMotivationQuote from "@/components/DynamicMotivationQuote"
import UserStreakProgress from "@/components/UserStreakProgress"
import RankProgressBar from "@/components/RankProgressBar"
import DashboardTeaserCard from "@/components/DashboardTeaserCard"
import DifficultyCard from "@/components/DifficultyCard"
import AchievementsBlock from "@/components/AchievementsBlock"
import DailyChallengeCard from "@/components/DailyChallengeCard"
import RecentActivity from "@/components/RecentActivity"
import StatsSwitcher from "@/components/StatsSwitcher"
import LeaderboardSwitcher from "@/components/LeaderboardSwitcher"
import WalletCard from "@/components/wallet/wallet-card"

import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore"
import { Settings } from "lucide-react"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [feedback, setFeedback] = useState("")
  const [sending, setSending] = useState(false)
  const [attempts, setAttempts] = useState<any[]>([])

  const difficultyLevels = [
    { name: "Easy", price: 0, emoji: "🟢", description: "Free practice quizzes" },
    { name: "Medium", price: 10, emoji: "🟡", description: "Moderate challenge" },
    { name: "Hard", price: 50, emoji: "🟠", description: "Serious competition" },
    { name: "Expert", price: 100, emoji: "🔴", description: "Ultimate challenge" },
  ]

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return
    try {
      setSending(true)
      await addDoc(collection(db, "feedback"), {
        userId: user?.id || "anonymous",
        email: user?.email || "unknown",
        message: feedback,
        createdAt: serverTimestamp(),
      })
      toast({ title: "Feedback received", description: "Thank you!" })
      setFeedback("")
    } catch (err) {
      console.error("Feedback submission error:", err)
      toast({ title: "Error", description: "Feedback failed." })
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    document.title = "Dashboard | ProveYourMind"
  }, [])

  useEffect(() => {
    const fetchAttempts = async () => {
      if (!user?.id) return
      try {
        // ✅ Update: Fetch user-specific quiz attempts from users/{uid}/quizzes
        const q = query(collection(db, "users", user.id, "quizzes"))
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setAttempts(data)
      } catch (err) {
        console.error("Failed to load attempts:", err)
      }
    }
    fetchAttempts()
  }, [user])

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* 🔐 Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={user?.photoURL || "/avatar.png"} className="w-10 h-10 rounded-full" />
            <div>
              <h1 className="text-lg font-semibold">Welcome back, {user?.name} 👋</h1>
              <p className="text-sm text-gray-500">Ready to prove your mind?</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500 text-white">{user?.streak || 0} day streak</Badge>
            <Badge className="bg-purple-600 text-white">Rank #{user?.rank || 0}</Badge>
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4 mr-1" /> Admin Panel
                </Button>
              </Link>
            )}
            <Button size="sm" variant="outline" onClick={() => logout("/")}>Logout</Button>
          </div>
        </div>
      </div>

      {/* 🔊 Announcements */}
      <AnnouncementStrip announcements={[
        "🌟 Weekly Jackpot Now Live!",
        "📢 New badges added this week!",
        "🔥 Beat your own streak and win rewards!",
      ]} />

      <div className="bg-gradient-to-r from-yellow-200 to-red-200 py-1 border-y border-yellow-400">
        <FlashMarquee />
      </div>

      {/* 🏦 WalletCard Section */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <WalletCard />
      </div>

      {/* 🔄 Dynamic Stats + Leaderboard */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsSwitcher />
        <LeaderboardSwitcher />
      </div>

      {/* 🎯 Difficulty Cards */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {difficultyLevels.map((level) => (
          <DifficultyCard key={level.name} {...level} />
        ))}
      </div>

      {/* 🌟 Add-ons */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserStreakProgress streak={user?.streak || 0} goal={5} />
        <DynamicMotivationQuote />
        <NotificationBell />
        <RankProgressBar currentScore={user?.score || 0} maxScore={1000} rank={user?.rank || 0} />
      </div>

      {/* 🏆 Achievements + Challenge */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
        <AchievementsBlock />
        <DailyChallengeCard topic="Science & Technology" />
        <RecentActivity attempts={attempts} />
      </div>

      {/* 💬 Feedback */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Have Feedback?</CardTitle>
            <CardDescription>Tell us what you love or what we can improve.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[100px]"
            />
            <Button onClick={handleSubmitFeedback} disabled={sending} className="mt-3">
              {sending ? "Sending..." : "Submit Feedback"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

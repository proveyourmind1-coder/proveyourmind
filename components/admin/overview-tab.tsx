"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { TrendingUp, Users, Target, Settings, Loader2, Save } from "lucide-react"
import confetti from "canvas-confetti"
import {
  updateDummyDataFlag,
  updateMarqueeMessage,
  fetchGlobalAnalytics,
} from "@/app/admin/actions"

interface OverviewTabProps {
  onStatsUpdate: (stats: any) => void
}

export function OverviewTab({ onStatsUpdate }: OverviewTabProps) {
  const { toast } = useToast()
  const [showDummyData, setShowDummyData] = useState(false)
  const [marqueeMessage, setMarqueeMessage] = useState("")
  const [saving, setSaving] = useState(false)
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    quizAttempts: 0,
    leaderboardEngagement: 0,
  })

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const data = await fetchGlobalAnalytics()
      setAnalytics(data.analytics)
      setShowDummyData(data.showDummyData)
      setMarqueeMessage(data.marqueeMessage)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive",
      })
    }
  }

  const handleDummyDataToggle = async (checked: boolean) => {
    setSaving(true)
    try {
      await updateDummyDataFlag(checked)
      setShowDummyData(checked)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      toast({
        title: "Success",
        description: `Dummy data ${checked ? "enabled" : "disabled"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update dummy data setting",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleMarqueeUpdate = async () => {
    setSaving(true)
    try {
      await updateMarqueeMessage(marqueeMessage)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      toast({
        title: "Success",
        description: "Marquee message updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update marquee",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* 📊 Global Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Visits"
          value={analytics.totalVisits.toLocaleString()}
          icon={<TrendingUp className="text-blue-500" />}
          bg="from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800"
        />
        <StatCard
          title="Quiz Attempts"
          value={analytics.quizAttempts.toLocaleString()}
          icon={<Target className="text-emerald-500" />}
          bg="from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900"
        />
        <StatCard
          title="Leaderboard Engagement"
          value={`${analytics.leaderboardEngagement}%`}
          icon={<Users className="text-purple-500" />}
          bg="from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900"
        />
      </div>

      {/* ⚙️ Dummy Data Toggle */}
      <Card className="shadow-xl bg-white/80 dark:bg-slate-800/70 backdrop-blur-xl border-0">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Dummy Data Control
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Toggle dummy data visibility for testing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between px-6 pb-6">
          <Label htmlFor="dummy-toggle" className="text-base font-medium">
            Show Dummy Data
          </Label>
          <Switch
            id="dummy-toggle"
            checked={showDummyData}
            onCheckedChange={handleDummyDataToggle}
            className="scale-125"
          />
        </CardContent>
      </Card>

      {/* 📝 Marquee Message */}
      <Card className="shadow-xl bg-white/80 dark:bg-slate-800/70 backdrop-blur-xl border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Marquee Message</CardTitle>
          <CardDescription>Displayed on the homepage as flash announcement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Type your announcement here..."
            value={marqueeMessage}
            onChange={(e) => setMarqueeMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleMarqueeUpdate}
            disabled={saving}
            className="w-full md:w-fit"
          >
            {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Announcement
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string
  value: string | number
  icon: JSX.Element
  bg: string
}) {
  return (
    <Card
      className={`group relative overflow-hidden bg-gradient-to-br ${bg} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
    >
      <CardHeader className="flex items-center justify-between pb-3">
        <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
          {title}
        </CardTitle>
        <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-900/40">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">Live analytics</p>
      </CardContent>
    </Card>
  )
}

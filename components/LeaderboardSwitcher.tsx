"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import DummyLeaderboard from "@/components/DummyLeaderboard"
import LiveLeaderboard from "@/components/LiveLeaderboard"

export default function LeaderboardSwitcher() {
  const [showDummy, setShowDummy] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchToggle = async () => {
      try {
        const configRef = doc(db, "config", "global")
        const configSnap = await getDoc(configRef)
        if (configSnap.exists()) {
          const data = configSnap.data()
          setShowDummy(data.showDummyData ?? false)
        } else {
          console.warn("No config/global doc found.")
          setShowDummy(false)
        }
      } catch (error) {
        console.error("Failed to load dummy data toggle:", error)
        setShowDummy(false)
      }
    }

    fetchToggle()
  }, [])

  if (showDummy === null) {
    return <div className="text-center py-4 text-gray-500">Loading leaderboard...</div>
  }

  return showDummy ? <DummyLeaderboard /> : <LiveLeaderboard />
}

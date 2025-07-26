"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

export default function DummyDataToggle() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // 🔄 Fetch current status on load
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const ref = doc(db, "config", "global")
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setEnabled(snap.data()?.showDummyData === true)
        }
      } catch (e) {
        console.error("Error fetching dummy flag", e)
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  // ✅ Handle toggle change
  const handleChange = async (value: boolean) => {
    setEnabled(value)
    try {
      const ref = doc(db, "config", "global")
      await updateDoc(ref, { showDummyData: value })
      toast({ title: "Updated", description: `Dummy data ${value ? "enabled" : "disabled"}` })
    } catch (e) {
      toast({ title: "Failed", description: "Could not update dummy data toggle" })
    }
  }

  return (
    <div className="flex items-center gap-4 py-2">
      <Label htmlFor="dummy-toggle">Show Dummy Data</Label>
      <Switch
        id="dummy-toggle"
        checked={enabled}
        onCheckedChange={handleChange}
        disabled={loading}
      />
    </div>
  )
}

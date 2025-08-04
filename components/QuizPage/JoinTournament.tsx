"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase"
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  increment,
} from "firebase/firestore"

interface Props {
  tournamentId: string
  entryFee: number
  onJoined: () => void
}

export default function JoinTournament({ tournamentId, entryFee, onJoined }: Props) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    if (!user) return toast({ title: "Please login to join." })

    setLoading(true)
    try {
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)
      const userData = userSnap.data()

      if (!userData || (userData.walletBalance || 0) < entryFee) {
        toast({ title: "❌ Not enough wallet balance", variant: "destructive" })
        return
      }

      // Deduct fee
      await updateDoc(userRef, {
        walletBalance: increment(-entryFee),
      })

      // Add user to tournament
      const tournamentRef = doc(db, "tournaments", tournamentId)
      await updateDoc(tournamentRef, {
        participants: arrayUnion(user.uid),
      })

      toast({ title: "✅ Joined tournament!" })
      onJoined()
    } catch (err) {
      console.error("❌ Error joining tournament:", err)
      toast({ title: "Failed to join", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleJoin} disabled={loading}>
      {loading ? "Joining..." : `Join Tournament (₹${entryFee})`}
    </Button>
  )
}

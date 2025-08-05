"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { getWalletBalance, deductFromWallet } from "@/lib/firestore" // ✅ FIXED PATH

interface Tournament {
  id: string
  title: string
  difficulty: string
  entryFee: number
  prizePool: number
  status: string
  participants: string[]
  startTime: string
  endTime: string
}

export default function TournamentDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) return
      const ref = doc(db, "tournaments", String(id))
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setTournament({ id: snap.id, ...(snap.data() as Tournament) })
      }
      setLoading(false)
    }
    fetchTournament()
  }, [id])

  const joinTournament = async () => {
    if (!user || !tournament) return
    setJoining(true)

    try {
      const balance = await getWalletBalance(user.uid)
      if (balance < tournament.entryFee) {
        alert("❌ Not enough balance in wallet. Please top-up.")
        return
      }

      await deductFromWallet(user.uid, tournament.entryFee)

      const ref = doc(db, "tournaments", tournament.id)
      await updateDoc(ref, {
        participants: arrayUnion(user.uid),
        lastJoined: serverTimestamp(),
      })

      alert("✅ Joined tournament!")
      router.push(`/quiz/${tournament.difficulty}?fromTournament=${tournament.id}`)
    } catch (err) {
      console.error("❌ Error joining:", err)
      alert("Failed to join tournament")
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-muted" />
      </div>
    )
  }

  if (!tournament) {
    return <p className="p-6">❌ Tournament not found.</p>
  }

  const hasJoined = tournament.participants.includes(user?.uid || "")
  const isClosed = tournament.status !== "open"

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {tournament.title}
            <Badge variant={isClosed ? "destructive" : "success"}>
              {tournament.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Difficulty:</strong> {tournament.difficulty}</p>
          <p><strong>Entry Fee:</strong> ₹{tournament.entryFee}</p>
          <p><strong>Prize Pool:</strong> ₹{tournament.prizePool}</p>
          <p><strong>Participants:</strong> {tournament.participants.length}</p>
          <p><strong>Start:</strong> {new Date(tournament.startTime).toLocaleString()}</p>
          <p><strong>End:</strong> {new Date(tournament.endTime).toLocaleString()}</p>

          {!hasJoined && !isClosed && (
            <Button
              className="mt-4 w-full"
              disabled={joining}
              onClick={joinTournament}
            >
              {joining ? "Joining..." : "Join Tournament & Start Quiz"}
            </Button>
          )}

          {hasJoined && (
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => router.push(`/quiz/${tournament.difficulty}?fromTournament=${tournament.id}`)}
            >
              Start Quiz
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

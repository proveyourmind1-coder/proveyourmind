"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Tournament {
  id: string
  title: string
  difficulty: string
  entryFee: number
  status: "open" | "ongoing" | "finished"
  prizePool?: number
  participants?: string[]
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])

  useEffect(() => {
    const q = query(collection(db, "tournaments"), orderBy("title", "asc"))
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Tournament),
      }))
      setTournaments(data)
    })

    return () => unsub()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏆 Available Tournaments</h1>

      {tournaments.length === 0 ? (
        <p className="text-gray-500">No tournaments available right now.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map(t => (
            <Link href={`/tournaments/${t.id}`} key={t.id}>
              <Card className="hover:shadow-lg transition cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {t.title}
                    <Badge variant={
                      t.status === "open"
                        ? "success"
                        : t.status === "ongoing"
                        ? "secondary"
                        : "destructive"
                    }>
                      {t.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Difficulty:</strong> {t.difficulty}</p>
                  <p><strong>Entry Fee:</strong> ₹{t.entryFee}</p>
                  <p><strong>Prize Pool:</strong> ₹{t.prizePool || 0}</p>
                  <p><strong>Participants:</strong> {t.participants?.length || 0}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Tournament {
  id: string
  title: string
  difficulty: string
  entryFee: number
  prizePool: number
  startTime: string
  endTime: string
  status: string
  participants: string[]
  createdAt?: any
}

export default function TournamentsTab() {
  const [title, setTitle] = useState("")
  const [difficulty, setDifficulty] = useState("easy")
  const [entryFee, setEntryFee] = useState(0)
  const [prizePool, setPrizePool] = useState(0)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [tournaments, setTournaments] = useState<Tournament[]>([])

  const createTournament = async () => {
    if (!title || !startTime || !endTime) {
      alert("Please fill all required fields")
      return
    }

    try {
      await addDoc(collection(db, "tournaments"), {
        title,
        difficulty,
        entryFee,
        prizePool,
        startTime,
        endTime,
        status: "open",
        participants: [],
        createdAt: serverTimestamp()
      })
      alert("✅ Tournament created")
      setTitle("")
      setEntryFee(0)
      setPrizePool(0)
      setStartTime("")
      setEndTime("")
    } catch (err) {
      console.error("❌ Error creating tournament:", err)
      alert("❌ Failed to create")
    }
  }

  useEffect(() => {
    const q = query(collection(db, "tournaments"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Tournament)
      }))
      setTournaments(data)
    })

    return () => unsubscribe()
  }, [])

  const formatDate = (datetime: string) =>
    new Date(datetime).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    })

  return (
    <div className="space-y-8 mt-4">
      {/* Create Tournament Form */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Create New Tournament</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Input
              placeholder="Tournament Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <select
              className="w-full p-2 border rounded"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
            <Input
              type="number"
              placeholder="Entry Fee (₹)"
              value={entryFee}
              onChange={e => setEntryFee(Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Prize Pool (₹)"
              value={prizePool}
              onChange={e => setPrizePool(Number(e.target.value))}
            />
            <Input
              type="datetime-local"
              placeholder="Start Time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
            <Input
              type="datetime-local"
              placeholder="End Time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
            <Button onClick={createTournament}>Create Tournament</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tournament List */}
      {tournaments.length === 0 ? (
        <p className="text-gray-500 text-center">No tournaments created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map(t => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {t.title}
                  <Badge variant={t.status === "open" ? "success" : "destructive"}>
                    {t.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-700">
                <p><strong>Difficulty:</strong> {t.difficulty}</p>
                <p><strong>Entry Fee:</strong> ₹{t.entryFee}</p>
                <p><strong>Prize Pool:</strong> ₹{t.prizePool}</p>
                <p><strong>Participants:</strong> {t.participants?.length || 0}</p>
                <p><strong>Start:</strong> {formatDate(t.startTime)}</p>
                <p><strong>End:</strong> {formatDate(t.endTime)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

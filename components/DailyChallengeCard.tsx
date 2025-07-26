"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Props {
  topic: string
}

export default function DailyChallengeCard({ topic }: Props) {
  const router = useRouter()

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">📅 Daily Challenge</h3>
      <p className="text-sm text-gray-500 mb-4">
        Today’s Topic: <strong>{topic}</strong>
      </p>
      <Button onClick={() => router.push("/quiz/hard")} className="w-full">
        Take Challenge
      </Button>
    </Card>
  )
}

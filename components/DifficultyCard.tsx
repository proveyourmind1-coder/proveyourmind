"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface DifficultyProps {
  name: string
  emoji: string
  price: number
  description?: string
}

export default function DifficultyCard({ name, emoji, price, description }: DifficultyProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => {
      router.push(`/quiz/${name.toLowerCase()}`)
    }, 500)
  }

  return (
    <Card className="bg-white shadow-md rounded-xl p-4 hover:scale-105 transition-transform">
      <div className="text-3xl mb-2">{emoji}</div>
      <h3 className="text-lg font-bold">{name} Quiz</h3>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      <p className="text-md font-medium mb-3">
        {price === 0 ? "Free" : `₹${price} Entry`}
      </p>
      <Button onClick={handleClick} disabled={loading} className="w-full">
        {loading ? "Loading..." : "Start Quiz"}
      </Button>
    </Card>
  )
}

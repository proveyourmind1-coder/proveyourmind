"use client"

import { Card } from "@/components/ui/card"

interface Props {
  user: any
}

export default function QuizStats({ user }: Props) {
  const totalAttempts = user?.totalAttempts || 0
  const totalScore = user?.totalScore || 0
  const winRate = totalAttempts > 0 ? ((totalScore / (totalAttempts * 5)) * 100).toFixed(1) : "0.0"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-blue-100 text-center p-4 rounded-xl">
        <h4 className="text-sm text-gray-600">Total Score</h4>
        <p className="text-xl font-bold text-blue-700">{totalScore}</p>
      </Card>
      <Card className="bg-green-100 text-center p-4 rounded-xl">
        <h4 className="text-sm text-gray-600">Quizzes Played</h4>
        <p className="text-xl font-bold text-green-700">{totalAttempts}</p>
      </Card>
      <Card className="bg-yellow-100 text-center p-4 rounded-xl">
        <h4 className="text-sm text-gray-600">Win Rate</h4>
        <p className="text-xl font-bold text-yellow-700">{winRate}%</p>
      </Card>
    </div>
  )
}

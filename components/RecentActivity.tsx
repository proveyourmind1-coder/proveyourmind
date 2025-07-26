// components/RecentActivity.tsx

"use client"

import { Card } from "@/components/ui/card"

interface Props {
  attempts: any[]
}

export default function RecentActivity({ attempts }: Props) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">🕓 Recent Activity</h3>
      {attempts.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent attempts found.</p>
      ) : (
        <ul className="text-sm text-gray-700 space-y-1">
          {attempts.slice(0, 5).map((attempt, index) => (
            <li key={index}>
              ✅ Played <strong>{attempt.difficulty}</strong> quiz — Scored {attempt.score}/{attempt.totalQuestions}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

// components/RecentActivity.tsx

"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Props {
  attempts: any[]
}

export default function RecentActivity({ attempts }: Props) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">📋 Recent Activity</h3>

      {attempts.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent attempts found.</p>
      ) : (
        <ul className="space-y-4 text-sm text-gray-800">
          {attempts.slice(0, 5).map((attempt, index) => {
            const status = attempt.success ? "success" : "failed"

            // ✅ Fix: Robust date fallback logic
            let timeLabel = "Unknown time"
            try {
              const rawDate =
                attempt.completedAt?.toDate?.() ||
                attempt.at?.toDate?.() ||
                attempt.createdAt?.toDate?.() ||
                (typeof attempt.completedAt === "string" && new Date(attempt.completedAt)) ||
                (typeof attempt.at === "string" && new Date(attempt.at)) ||
                null

              if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
                timeLabel = formatDistanceToNow(rawDate, { addSuffix: true })
              }
            } catch (error) {
              console.warn("⚠️ Invalid date in attempt:", error)
            }

            return (
              <li key={index} className="flex flex-col gap-1 border-b pb-2">
                <div>
                  <strong className="capitalize">{attempt.difficulty}</strong> Quiz —{" "}
                  <span className="text-purple-600 font-medium">
                    {attempt.score}/{attempt.totalQuestions}
                  </span>
                </div>

                {attempt.transactionId && (
                  <div className="text-xs text-gray-500">
                    TXN ID: <span className="font-mono">{attempt.transactionId}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Badge variant={status === "success" ? "default" : "destructive"}>
                    {status === "success" ? "✅ Delivered" : "❌ Failed"}
                  </Badge>
                  <span className="text-xs text-gray-400">{timeLabel}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

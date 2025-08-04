"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DummyStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Stats </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>👥 Total Users: <strong>9,876</strong></li>
          <li>🧠 Total Quizzes Played: <strong>12,345</strong></li>
          <li>🏆 Total Winners: <strong>2,340</strong></li>
          <li>🔥 Top Score: <strong>999 pts</strong></li>
        </ul>
      </CardContent>
    </Card>
  )
}

// app/api/generate-questions/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { difficulty = "easy", count = 5 } = await request.json()

    // Load static question file
    const filePath = path.join(process.cwd(), "public", "data", `${difficulty}.json`)
    const fileContents = await fs.readFile(filePath, "utf-8")
    const allQuestions = JSON.parse(fileContents)

    // Shuffle and select
    const shuffled = allQuestions.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, count)

    return NextResponse.json({ questions: selected })
  } catch (error: any) {
    console.error("❌ Error loading static questions:", error)
    return NextResponse.json({ error: "Failed to load static questions" }, { status: 500 })
  }
}

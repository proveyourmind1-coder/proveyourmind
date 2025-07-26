import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"

// POST /api/admin/add-question
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      question,
      options,
      correctAnswer,
      explanation,
      difficulty,
      category,
      points,
    } = body

    const docRef = await addDoc(collection(db, "questions"), {
      question,
      options,
      correctAnswer,
      explanation,
      difficulty,
      category,
      points,
      createdAt: Timestamp.now(),
    })

    return NextResponse.json({ success: true, id: docRef.id })
  } catch (error) {
    console.error("❌ Error adding question:", error)
    return NextResponse.json({ success: false, error: "Failed to add question" }, { status: 500 })
  }
}

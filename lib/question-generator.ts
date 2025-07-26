// lib/question-generator.ts (Updated with per-user unique filtering)

import { db } from "@/lib/firebase"
import { getDoc, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore"

export interface GeneratedQuestion {
  question: string
  options: string[]
  answer: string // from your JSON
}

export async function generateQuestions(
  difficulty: "easy" | "medium" | "hard" | "expert",
  count = 5,
  uid?: string
): Promise<GeneratedQuestion[]> {
  try {
    const res = await fetch(`/data/${difficulty}.json`)
    if (!res.ok) throw new Error("Failed to load questions")

    const allQuestions: GeneratedQuestion[] = await res.json()

    // If no user ID, just shuffle and return
    if (!uid) {
      const shuffled = allQuestions.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    }

    // Fetch user's previously attempted questions
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)
    const attempted = userSnap.exists() ? userSnap.data()?.[`attempted.${difficulty}`] || [] : []

    // Filter out previously attempted
    const freshQuestions = allQuestions.filter((q) => !attempted.includes(q.question))
    const shuffled = freshQuestions.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, count)

    // Save newly attempted questions
    if (selected.length > 0) {
      await setDoc(
        userRef,
        { [`attempted.${difficulty}`]: arrayUnion(...selected.map((q) => q.question)) },
        { merge: true }
      )
    }

    return selected
  } catch (err) {
    console.error("Error loading static questions:", err)
    return []
  }
}

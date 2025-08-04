"use server"

import { QuizQuestion } from "@/types/quiz"

// ✅ Utility: Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ✅ Main function: Load quiz questions via fetch instead of fs
export async function generateQuestions(difficulty: string): Promise<QuizQuestion[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/data/${difficulty}.json`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!res.ok) throw new Error("Failed to fetch questions.")

    const rawQuestions: QuizQuestion[] = await res.json()

    const enriched = rawQuestions
      .filter((q) => q.question && q.options && q.answer)
      .map((q) => ({
        ...q,
        difficulty: q.difficulty || (difficulty as any),
        points:
          q.points ||
          (difficulty === "easy"
            ? 10
            : difficulty === "medium"
            ? 20
            : difficulty === "hard"
            ? 30
            : 50),
        addedOn: q.addedOn || new Date().toISOString(),
        options: shuffleArray(q.options),
      }))
      .filter((q) => {
        if (!q.validUntil) return true
        return new Date(q.validUntil) > new Date()
      })

    return shuffleArray(enriched).slice(0, 10)
  } catch (err) {
    console.error("🚨 Question generation failed:", err)
    return []
  }
}

// ✅ Optional AI-enhancer placeholder
export async function aiEnhanceQuestions(questions: QuizQuestion[]): Promise<QuizQuestion[]> {
  return questions
}

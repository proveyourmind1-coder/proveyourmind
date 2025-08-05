import { generateQuestions } from "@/lib/question-generator"
import QuizPageClient from "@/components/QuizPage/QuizPageClient"
import { saveQuizAttempt, getPaymentRecord } from "@/lib/firestore"
import type { Metadata } from "next"

// ✅ Next.js dynamic route props
interface PageProps {
  params: { difficulty: string }
  searchParams?: { paymentId?: string; amount?: string }
}

// ✅ Main quiz page entry
export default async function Page({ params, searchParams }: PageProps) {
  const difficulty = decodeURIComponent(params.difficulty || "easy").toLowerCase() as
    | "easy"
    | "medium"
    | "hard"
    | "expert"

  const paymentId = searchParams?.paymentId || null
  const amount = searchParams?.amount ? parseInt(searchParams.amount) : undefined

  console.log("🔍 Loading questions for:", difficulty)
  if (paymentId) console.log("💸 Razorpay Payment ID:", paymentId)

  try {
    const questions = await generateQuestions(difficulty)

    if (!questions || questions.length === 0) {
      throw new Error("No questions found")
    }

    return (
      <QuizPageClient
        difficulty={difficulty}
        questions={questions}
        paymentId={paymentId}
      />
    )
  } catch (error) {
    console.error("🚨 Failed to load questions:", error)

    if (paymentId && typeof window === "undefined") {
      const uid = await getUidFromPayment(paymentId)
      if (uid) {
        await saveQuizAttempt({
          uid,
          difficulty,
          score: 0,
          total: 0,
          timestamp: new Date().toISOString(),
          transactionId: paymentId,
          success: false,
        })
      }
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-red-600 p-4">
        <h1 className="text-2xl font-bold mb-2">❌ Failed to load questions</h1>
        <p>Please check if the selected quiz is available or try again later.</p>
      </div>
    )
  }
}

// ✅ Helper: Get UID from payment record
async function getUidFromPayment(paymentId: string): Promise<string | null> {
  try {
    const record = await getPaymentRecord(paymentId)
    return record?.uid || null
  } catch (error) {
    console.error("❌ Error fetching UID from payment:", error)
    return null
  }
}

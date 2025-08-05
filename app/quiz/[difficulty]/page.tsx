import { generateQuestions } from "@/lib/question-generator"
import QuizPageClient from "@/components/QuizPage/QuizPageClient"
import { saveQuizAttempt, getPaymentRecord } from "@/lib/firestore"

interface Props {
  params: { difficulty: string }
  searchParams?: { paymentId?: string; amount?: string }
}

export default async function QuizPage({ params, searchParams }: Props) {
  const difficultyParam = params?.difficulty || "easy"
  const difficulty = decodeURIComponent(difficultyParam).toLowerCase() as
    | "easy"
    | "medium"
    | "hard"
    | "expert"

  const paymentId = searchParams?.paymentId || null
  const amount = searchParams?.amount ? parseInt(searchParams.amount) : undefined

  console.log("🔍 Loading questions for difficulty:", difficulty)
  if (paymentId) console.log("💸 Razorpay Payment ID:", paymentId)

  try {
    const questions = await generateQuestions(difficulty)

    console.log("📦 Loaded questions:", questions?.length)

    if (!questions || questions.length === 0) {
      throw new Error("No questions found for: " + difficulty)
    }

    return (
      <QuizPageClient
        difficulty={difficulty}
        questions={questions}
        paymentId={paymentId}
      />
    )
  } catch (error) {
    console.error("🚨 Question generation failed:", error)

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
        console.log("⚠️ Failed quiz attempt saved for refund tracking")
      } else {
        console.warn("⚠️ Could not find UID for payment ID:", paymentId)
      }
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600 text-center p-4">
        <h1 className="text-2xl font-bold mb-4">❌ Failed to load questions</h1>
        <p className="text-sm">
          Please check if questions are available for <strong>{difficulty}</strong> difficulty.
        </p>
      </div>
    )
  }
}

// ✅ Get UID from Razorpay payment record
async function getUidFromPayment(paymentId: string): Promise<string | null> {
  try {
    const record = await getPaymentRecord(paymentId)
    return record?.uid || null
  } catch (err) {
    console.error("❌ Failed to get UID from payment:", err)
    return null
  }
}

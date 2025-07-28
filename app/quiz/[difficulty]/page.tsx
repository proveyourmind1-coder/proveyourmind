"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import QuizClient from "@/components/QuizPage/QuizClient"

interface GeneratedQuestion {
  question: string
  options: string[]
  answer: string
  category?: string
}

interface Props {
  params: { difficulty: string }
}

export default function QuizPage({ params }: Props) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPaid, setIsPaid] = useState(false)

  const difficulty = decodeURIComponent(params.difficulty || "").toLowerCase() as
    | "easy"
    | "medium"
    | "hard"
    | "expert"

  const isFree = difficulty === "easy"

  // ✅ Moved generateQuestions logic inside
  const generateQuestions = async (
    difficulty: "easy" | "medium" | "hard" | "expert",
    count = 5
  ): Promise<GeneratedQuestion[]> => {
    try {
      const baseUrl =
        typeof window !== "undefined" ? "" : "http://localhost:3000"
      const fullPath = `${baseUrl}/data/${difficulty}.json`
      console.log("📦 Fetching questions from:", fullPath)

      const res = await fetch(fullPath)

      if (!res.ok) {
        throw new Error(`❌ Failed to fetch: ${fullPath}`)
      }

      const allQuestions: GeneratedQuestion[] = await res.json()
      console.log("✅ Questions loaded:", allQuestions.length)

      if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
        throw new Error("❌ No questions found or invalid format.")
      }

      return allQuestions.sort(() => 0.5 - Math.random()).slice(0, count)
    } catch (error) {
      console.error("❌ generateQuestions() error:", error)
      return []
    }
  }

  useEffect(() => {
    if (!user || !difficulty) return

    const fetchData = async () => {
      try {
        const result = await generateQuestions(difficulty)
        if (!result || result.length === 0) {
          toast.error("❌ No questions found.")
          return
        }
        setQuestions(result)
      } catch (error) {
        console.error("Error fetching questions:", error)
        toast.error("❌ Failed to load questions.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, difficulty])

  const startPayment = async () => {
    toast.info("💸 Creating Razorpay order...")

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000 }), // ₹50
      })

      const data = await res.json()

      if (!data || !data.id) {
        throw new Error("Invalid Razorpay order response")
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_4iSCS9bAG1vOMj",
        amount: data.amount,
        currency: data.currency,
        name: "Prove Your Mind",
        description: `${difficulty} quiz`,
        order_id: data.id,
        handler: function (response: any) {
          console.log("✅ Payment successful:", response)
          toast.success("✅ Payment Success!")
          setIsPaid(true)
        },
        prefill: {
          name: user?.displayName || "Guest",
          email: user?.email || "",
        },
        theme: {
          color: "#3399cc",
        },
      }

      const razor = new window.Razorpay(options)
      razor.open()
    } catch (error) {
      console.error("❌ Razorpay Error:", error)
      toast.error("❌ Payment failed")
    }
  }

  if (loading || isLoading) return <div className="p-10 text-center">⏳ Loading quiz...</div>

  if (!user) {
    router.push("/")
    return null
  }

  if (!isFree && !isPaid) {
    return (
      <div className="p-10 text-center space-y-6">
        <h2 className="text-xl font-bold">💰 Pay ₹50 to unlock the {difficulty} quiz</h2>
        <button
          onClick={startPayment}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-lg"
        >
          🔓 Pay & Start Quiz
        </button>
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div className="p-10 text-center text-red-500">
        ❌ No questions available.
      </div>
    )
  }

  return <QuizClient difficulty={difficulty} questions={questions} />
}

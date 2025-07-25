"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, Loader2, Timer, Award, TrendingUp, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { RazorpayPayment } from "@/components/razorpay-payment"
import { GuestQuizModal } from "@/components/guest-quiz-modal"
import { generateQuestions } from "@/lib/question-generator"

export default function QuizPage() {
  const params = useParams()
  const difficulty = params.difficulty as "easy" | "medium" | "hard" | "expert"
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [quizStarted, setQuizStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  const [paymentSuccessful, setPaymentSuccessful] = useState(false)
  const [quizEntryFee, setQuizEntryFee] = useState(0)
  const [quizPoints, setQuizPoints] = useState(0)
  const [quizMoney, setQuizMoney] = useState(0)
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  const difficultySettings = {
    easy: { fee: 0, points: 10, money: 0, questionCount: 5 },
    medium: { fee: 10, points: 25, money: 5, questionCount: 10 },
    hard: { fee: 50, points: 100, money: 25, questionCount: 15 },
    expert: { fee: 100, points: 250, money: 50, questionCount: 20 },
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNextQuestion = useCallback(() => {
    setSelectedAnswer(null)
    setShowAnswer(false)
    setTimeLeft(30)
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setTimerActive(true)
    } else {
      setQuizCompleted(true)
      setTimerActive(false)
    }
  }, [currentQuestionIndex, questions.length])

  useEffect(() => {
    const settings = difficultySettings[difficulty]
    if (settings) {
      setQuizEntryFee(settings.fee)
      setQuizPoints(settings.points)
      setQuizMoney(settings.money)
    } else {
      toast({
        title: "Invalid Quiz Difficulty",
        description: "Please select a valid quiz difficulty.",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [difficulty, router, toast])

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const questionCount = difficultySettings[difficulty]?.questionCount || 5
      const qs = await generateQuestions(difficulty, questionCount)
      setQuestions(qs)
    } catch (err: any) {
      console.error("Error loading questions:", err)
      toast({
        title: "Failed to load quiz",
        description: err.message || "Could not fetch questions. Please try again.",
        variant: "destructive",
      })
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }, [difficulty, router, toast])

  useEffect(() => {
    if (!authLoading && !user && quizEntryFee > 0) {
      setIsGuestModalOpen(true)
    } else if (!authLoading && (user || quizEntryFee === 0)) {
      setPaymentSuccessful(quizEntryFee === 0)
      if (quizEntryFee === 0) fetchQuestions()
    }
  }, [authLoading, user, quizEntryFee, fetchQuestions])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (timerActive && timeLeft > 0 && !showAnswer && !quizCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && timerActive) {
      handleNextQuestion()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, timerActive, showAnswer, quizCompleted, currentQuestionIndex, questions.length, handleNextQuestion])

  const handleStartQuiz = () => {
    if (quizEntryFee > 0 && !paymentSuccessful) {
      toast({
        title: "Payment Required",
        description: "Please complete the payment to start the quiz.",
        variant: "info",
      })
      return
    }
    setQuizStarted(true)
    setTimerActive(true)
  }

  const handleAnswerSelect = (answer: string) => {
    if (!showAnswer) {
      setSelectedAnswer(answer)
    }
  }

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) {
      toast({
        title: "No answer selected",
        description: "Please select an answer before confirming.",
        variant: "info",
      })
      return
    }
    setTimerActive(false)
    setShowAnswer(true)
    if (selectedAnswer === currentQuestion.answer) {
      setScore(score + 1)
    }
  }

  const handlePaymentSuccess = () => {
    setPaymentSuccessful(true)
    fetchQuestions()
    toast({
      title: "Payment Confirmed!",
      description: "You can now start your quiz.",
    })
  }

  if (!mounted || loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    )
  }

  if (isGuestModalOpen) {
    return <GuestQuizModal isOpen onClose={() => router.push("/dashboard")} />
  }

  if (quizEntryFee > 0 && !paymentSuccessful) {
    return <RazorpayPayment amount={quizEntryFee} quizType={difficulty} onSuccess={handlePaymentSuccess} />
  }

  if (!quizStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">{difficulty.toUpperCase()} QUIZ</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStartQuiz} className="w-full">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-3xl font-bold text-purple-700">Quiz Completed!</h2>
        <p className="mt-2">Score: {score}/{questions.length}</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Progress value={progress} className="w-full" />
          <CardTitle className="text-xl mt-4">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion.options.map((option: string, index: number) => (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full mb-2 ${selectedAnswer === option ? "border-purple-500" : ""}`}
              variant="outline"
              disabled={showAnswer}
            >
              {option}
            </Button>
          ))}

          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 rounded-md border bg-muted text-sm"
              >
                {selectedAnswer === currentQuestion.answer ? (
                  <span className="text-green-600 font-bold">Correct!</span>
                ) : (
                  <span className="text-red-600 font-bold">Incorrect! Correct answer: {currentQuestion.answer}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter>
          <Button
            onClick={showAnswer ? handleNextQuestion : handleConfirmAnswer}
            className="w-full"
            disabled={!selectedAnswer && !showAnswer}
          >
            {showAnswer ? "Next" : "Confirm"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

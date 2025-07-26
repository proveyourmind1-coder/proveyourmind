"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Timer } from "lucide-react"
import { db } from "@/lib/firebase"
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore"

import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { RazorpayPayment } from "@/components/razorpay-payment"
import { GuestQuizModal } from "@/components/guest-quiz-modal"
import FlashMarquee from "@/components/QuizPage/FlashMarquee"
import { FeedbackModal } from "@/components/QuizPage/FeedbackBox"
import { BadgeStreakDisplay } from "@/components/QuizPage/BadgeStreakDisplay"
import Confetti from "react-confetti"
import useWindowSize from "react-use/lib/useWindowSize"
import useSound from "use-sound"
import { generateQuestions } from "@/lib/question-generator"
import Image from "next/image"

export default function QuizPage() {
  const params = useParams()
  const difficulty = (params?.difficulty || "easy") as "easy" | "medium" | "hard" | "expert"
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const { width, height } = useWindowSize()

  const [playCorrect] = useSound("/sounds/correct.mp3")
  const [playWrong] = useSound("/sounds/buzzer.mp3")
  const [playWin] = useSound("/sounds/cheer.mp3")

  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [quizStarted, setQuizStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [timerActive, setTimerActive] = useState(false)
  const [paymentSuccessful, setPaymentSuccessful] = useState(false)
  const [quizEntryFee, setQuizEntryFee] = useState(0)
  const [quizPoints, setQuizPoints] = useState(0)
  const [quizMoney, setQuizMoney] = useState(0)
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]

  const difficultySettings = {
    easy: { fee: 0, points: 10, money: 0, questionCount: 5 },
    medium: { fee: 10, points: 25, money: 5, questionCount: 10 },
    hard: { fee: 50, points: 100, money: 25, questionCount: 15 },
    expert: { fee: 100, points: 250, money: 50, questionCount: 20 },
  }

  const handleAnswerSelect = (answer: string) => {
    if (!showAnswer) setSelectedAnswer(answer)
  }

  const handleStartQuiz = () => {
    if (quizEntryFee > 0 && !paymentSuccessful) {
      toast({ title: "Payment Required", description: "Complete payment to start quiz.", variant: "info" })
      return
    }
    setQuizStarted(true)
    setTimerActive(true)
  }

  const handleConfirmAnswer = () => {
    if (!selectedAnswer) {
      toast({ title: "No answer selected", description: "Please select an answer first.", variant: "info" })
      return
    }
    setTimerActive(false)
    setShowAnswer(true)
    if (selectedAnswer === currentQuestion.answer) {
      setScore(score + 1)
      setStreak(streak + 1)
      setMaxStreak(Math.max(maxStreak, streak + 1))
      playCorrect()
    } else {
      playWrong()
      setStreak(0)
    }
  }

  const handleNextQuestion = useCallback(() => {
    setSelectedAnswer(null)
    setShowAnswer(false)
    setTimeLeft(10)
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setTimerActive(true)
    } else {
      setQuizCompleted(true)
      setShowFeedback(true)
      setTimerActive(false)
    }
  }, [currentQuestionIndex, questions.length])

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const count = difficultySettings[difficulty]?.questionCount || 5
      const qs = await generateQuestions(difficulty, count)
      setQuestions(qs)
    } catch (err: any) {
      toast({ title: "Failed to load quiz", description: err.message || "Could not fetch questions.", variant: "destructive" })
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }, [difficulty, router, toast])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (timerActive && timeLeft > 0 && !showAnswer && !quizCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && timerActive) {
      playWrong()
      setStreak(0)
      handleNextQuestion()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, timerActive, showAnswer, quizCompleted, handleNextQuestion, playWrong])

  const handlePaymentSuccess = () => {
    setPaymentSuccessful(true)
    fetchQuestions()
    toast({ title: "Payment Confirmed!", description: "You can now start your quiz." })
  }

  useEffect(() => {
    if (quizCompleted && user) {
      playWin()
      const saveResult = async () => {
        try {
          const quizRef = collection(db, "users", user.uid, "quizzes")
          await addDoc(quizRef, {
            difficulty,
            score,
            totalQuestions: questions.length,
            completedAt: serverTimestamp(),
            streak: maxStreak,
          })
          const userRef = doc(db, "users", user.uid)
          await updateDoc(userRef, {
            totalAttempts: increment(1),
            totalScore: increment(score),
          })
          const q = query(collection(db, "users"), orderBy("totalScore", "desc"))
          const snapshot = await getDocs(q)
          const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          setLeaderboard(users.slice(0, 10))
          const rank = users.findIndex(u => u.id === user.uid)
          setUserRank(rank >= 0 ? rank + 1 : null)
        } catch (error) {
          console.error("Error saving quiz:", error)
        }
      }
      saveResult()
    }
  }, [quizCompleted, user, questions.length, score, difficulty, maxStreak])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const settings = difficultySettings[difficulty]
    if (settings) {
      setQuizEntryFee(settings.fee)
      setQuizPoints(settings.points)
      setQuizMoney(settings.money)
    } else {
      toast({ title: "Invalid Quiz Difficulty", description: "Please select a valid quiz difficulty.", variant: "destructive" })
      router.push("/dashboard")
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

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const xpProgress = (score / questions.length) * 100
  const reactionGifUrl = selectedAnswer && showAnswer
    ? selectedAnswer === currentQuestion?.answer
      ? "/funny/correct.gif"
      : "/funny/wrong.gif"
    : null

  if (!mounted || loading || authLoading) return <div className="p-10 text-center">Loading...</div>
  if (isGuestModalOpen) return <GuestQuizModal isOpen onClose={() => router.push("/dashboard")} />
  if (quizEntryFee > 0 && !paymentSuccessful) return <RazorpayPayment amount={quizEntryFee} quizType={difficulty} onSuccess={handlePaymentSuccess} />

  if (!quizStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-white mb-4">{difficulty.toUpperCase()} Quiz Challenge</h1>
          <p className="text-white mb-6">Test your knowledge and earn XP! 🚀</p>
          <Button onClick={handleStartQuiz} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg">
            Start Quiz 🎉
          </Button>
        </motion.div>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-purple-100 to-indigo-100 p-4 text-center">
        <FlashMarquee messages={["🔥 Weekly Challenge Open!", "🎁 Top 10 win rewards!", "💡 Answer fast, earn XP!"]} />
        <Confetti width={width} height={height} />
        {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
        <h2 className="text-3xl font-bold text-purple-700">🎉 Quiz Completed!</h2>
        <p className="mt-2 text-lg">You scored {score} out of {questions.length}</p>
        <BadgeStreakDisplay score={score} />
        <p className="text-sm text-muted-foreground mt-2">🔥 Max Streak: {maxStreak}</p>
        <Progress value={xpProgress} className="my-2 h-2 bg-indigo-200" />
        <p className="text-xs text-indigo-700">XP Earned: {score * 10} XP</p>
        {userRank && <p className="mt-2 text-sm text-green-600 font-semibold">🎯 Your Rank: #{userRank}</p>}
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          <Button onClick={() => router.refresh()} variant="outline">Retry Quiz</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 bg-gradient-to-br from-pink-100 via-violet-100 to-purple-200">
      <FlashMarquee messages={["🔥 Answer quickly!", "🏆 Reach top 10!", "💡 Think smart, act fast!"]} />
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="mb-4">
          <Progress value={progress} className="h-2 bg-white/30" />
          <div className="flex justify-between text-sm text-muted-foreground mt-1 px-1">
            <div className="flex items-center gap-1"><Timer className="w-4 h-4 text-purple-600" /> {timeLeft}s</div>
            <div>{currentQuestionIndex + 1}/{questions.length}</div>
          </div>
        </div>
        {currentQuestion ? (
          <motion.div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 text-center mb-6">{currentQuestion.question}</h2>
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option: string, index: number) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-3 rounded-2xl border font-semibold transition-all ${
                    selectedAnswer === option
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                  disabled={showAnswer}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {reactionGifUrl && (
              <div className="my-4 flex justify-center">
                <Image src={reactionGifUrl} alt="reaction" width={160} height={120} />
              </div>
            )}

            {showAnswer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 rounded-md border bg-muted text-sm"
              >
                {selectedAnswer === currentQuestion.answer ? (
                  <span className="text-green-600 font-bold">✅ Correct!</span>
                ) : (
                  <span className="text-red-600 font-bold">❌ Incorrect! Correct answer: {currentQuestion.answer}</span>
                )}
              </motion.div>
            )}

            <Button
              onClick={showAnswer ? handleNextQuestion : handleConfirmAnswer}
              className="w-full mt-6"
              disabled={!selectedAnswer && !showAnswer}
            >
              {showAnswer ? "Next" : "Confirm"}
            </Button>
          </motion.div>
        ) : (
          <p className="text-center text-muted">Loading Question...</p>
        )}
      </motion.div>
    </div>
  )
}

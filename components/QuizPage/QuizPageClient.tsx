"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import useWindowSize from "react-use/lib/useWindowSize"
import useSound from "use-sound"
import Confetti from "react-confetti"
import Image from "next/image"
import FlashMarquee from "@/components/QuizPage/FlashMarquee"
import { FeedbackModal } from "@/components/QuizPage/FeedbackBox"
import { BadgeStreakDisplay } from "@/components/QuizPage/BadgeStreakDisplay"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import RazorpayPayment from "@/components/razorpay-payment"
import { Timer, PauseCircle, PlayCircle } from "lucide-react"
import { motion } from "framer-motion"
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
import { db } from "@/lib/firebase"

interface Props {
  difficulty: string
  questions: {
    question: string
    options: string[]
    answer: string
  }[]
  paymentId?: string // ✅ Passed from parent if available
}

const quizPrices: Record<string, number> = {
  easy: 0,
  medium: 10,
  hard: 50,
  expert: 100,
}

export default function QuizPageClient({ difficulty, questions, paymentId }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const { width, height } = useWindowSize()

  const [playCorrect] = useSound("/sounds/correct.mp3")
  const [playWrong] = useSound("/sounds/buzzer.mp3")
  const [playWin] = useSound("/sounds/cheer.mp3")

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [timerOn, setTimerOn] = useState(true)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [rank, setRank] = useState<number | null>(null)
  const [paid, setPaid] = useState(false)

  const fee = quizPrices[difficulty] || 0

  // ✅ Timer logic
  useEffect(() => {
    let t: NodeJS.Timeout
    if (timerOn && timeLeft > 0 && !showAnswer && !completed) {
      t = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    } else if (timeLeft === 0 && timerOn) {
      playWrong()
      setStreak(0)
      next()
    }
    return () => clearTimeout(t)
  }, [timeLeft, timerOn, showAnswer, completed])

  const confirm = () => {
    if (!selected) {
      toast({ title: "Select an answer", variant: "default" })
      return
    }
    setTimerOn(false)
    setShowAnswer(true)
    if (selected === questions[current].answer) {
      playCorrect()
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
      setMaxStreak((ms) => Math.max(ms, streak + 1))
    } else {
      playWrong()
      setStreak(0)
    }
  }

  const next = () => {
    setSelected(null)
    setShowAnswer(false)
    setTimeLeft(10)
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1)
      setTimerOn(true)
    } else {
      finish()
    }
  }

  const finish = () => {
    setCompleted(true)
    setTimerOn(false)
    playWin()
    setFeedbackOpen(true)

    if (!user) return

    const save = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const fromTournament = urlParams.get("fromTournament")

        const quizRef = collection(db, "users", user.uid, "quizzes")
        await addDoc(quizRef, {
          difficulty,
          score,
          total: questions.length,
          at: serverTimestamp(),
          streak: maxStreak,
          tournamentId: fromTournament || null,
          transactionId: paymentId || null, // ✅ Save payment ID
        })

        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          totalAttempts: increment(1),
          totalScore: increment(score),
        })

        const q = query(collection(db, "users"), orderBy("totalScore", "desc"))
        const snap = await getDocs(q)
        const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        const r = users.findIndex((u) => u.id === user.uid)
        if (r >= 0) setRank(r + 1)

        console.log("✅ Quiz saved with payment ID:", paymentId || "none")
      } catch (err) {
        console.error("🔥 Save Error:", err)
      }
    }

    save()
  }

  const progress = ((current + 1) / questions.length) * 100
  const xpProgress = (score / questions.length) * 100

  const gif =
    selected && showAnswer
      ? selected === questions[current]?.answer
        ? "/gifs/DonaldDuckDance.gif"
        : "/gifs/BugsBunnyRunning.gif"
      : null

  if (fee > 0 && !paid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <RazorpayPayment
          amount={fee}
          onSuccess={(id) => {
            toast({ title: "✅ Payment Successful!" })
            setPaid(true)
            window.history.replaceState({}, "", window.location.pathname + "?paid=1")
          }}
          onFailure={() => {
            toast({ title: "❌ Payment failed", variant: "destructive" })
            router.push("/dashboard")
          }}
        />
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-4 text-center">
        <FlashMarquee messages={["🔥 Weekly Challenge Open!", "🎁 Top 10 win rewards!", "💡 Answer fast, earn XP!"]} />
        <Confetti width={width} height={height} />
        {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
        <h2 className="text-3xl font-bold text-purple-700">🎉 Quiz Completed!</h2>
        <Avatar className="mx-auto my-2">
          <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
          <AvatarFallback>{user?.displayName?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <p className="mt-2 text-lg">You scored {score} out of {questions.length}</p>
        <BadgeStreakDisplay score={score} />
        <p className="text-sm mt-1">🔥 Max Streak: {maxStreak}</p>
        <Progress value={xpProgress} className="my-2 h-2 bg-indigo-200" />
        <p className="text-xs">XP Earned: {score * 10}</p>
        {rank && <p className="mt-2 text-green-600 font-semibold text-sm">🎯 Your Rank: #{rank}</p>}
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          <Button variant="outline" onClick={() => router.refresh()}>Retry Quiz</Button>
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
            <div className="flex items-center gap-1">
              <Timer className="w-4 h-4 text-purple-600" /> {timeLeft}s
            </div>
            <div>{current + 1}/{questions.length}</div>
          </div>
        </div>

        <motion.div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-center mb-6">{questions[current].question}</h2>
          <div className="grid grid-cols-1 gap-3">
            {questions[current].options.map((option, i) => (
              <motion.button
                key={i}
                onClick={() => setSelected(option)}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-3 rounded-2xl border font-semibold transition-all ${
                  selected === option
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
                disabled={showAnswer}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {gif && (
            <div className="my-4 flex justify-center">
              <Image src={gif} alt="reaction" width={160} height={120} unoptimized />
            </div>
          )}

          {showAnswer && (
            <motion.div className="mt-4 p-3 rounded-md border bg-muted text-sm">
              {selected === questions[current].answer ? (
                <span className="text-green-600 font-bold">✅ Correct!</span>
              ) : (
                <span className="text-red-600 font-bold">
                  ❌ Incorrect! Correct: {questions[current].answer}
                </span>
              )}
            </motion.div>
          )}

          <div className="flex justify-end mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTimerOn(!timerOn)}
              className="text-xs text-purple-600 hover:text-purple-800"
            >
              {timerOn ? (
                <><PauseCircle className="w-4 h-4 mr-1" /> Pause Timer</>
              ) : (
                <><PlayCircle className="w-4 h-4 mr-1" /> Resume Timer</>
              )}
            </Button>
          </div>

          <Button className="w-full mt-6" onClick={showAnswer ? next : confirm}>
            {showAnswer ? "Next" : "Confirm"}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

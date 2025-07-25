"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Trophy, Star } from "lucide-react"

interface GuestQuizModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const sampleQuestions = [
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    correct: 1,
    explanation: "New Delhi is the capital and seat of government of India.",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    explanation: "Mars is called the Red Planet due to iron oxide on its surface.",
  },
  {
    question: "Who wrote the Indian National Anthem?",
    options: ["Mahatma Gandhi", "Rabindranath Tagore", "Subhas Chandra Bose", "Jawaharlal Nehru"],
    correct: 1,
    explanation: "Rabindranath Tagore wrote 'Jana Gana Mana', India's national anthem.",
  },
]

export function GuestQuizModal({ open, onOpenChange }: GuestQuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNext = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    if (selectedAnswer === sampleQuestions[currentQuestion].correct) {
      setScore(score + 1)
    }

    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
  }

  const handleClose = () => {
    resetQuiz()
    onOpenChange(false)
  }

  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Free Sample Quiz
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Question {currentQuestion + 1} of {sampleQuestions.length}
                  </span>
                  <span>
                    Score: {score}/{currentQuestion}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{sampleQuestions[currentQuestion].question}</h3>

                <div className="grid gap-3">
                  {sampleQuestions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className="justify-start text-left h-auto p-4"
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {currentQuestion < sampleQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="space-y-4">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
                <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                <div className="text-4xl font-bold text-purple-600">
                  {score}/{sampleQuestions.length}
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {score === 3 ? "Perfect!" : score >= 2 ? "Great Job!" : "Good Try!"}
                </Badge>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold">Your Performance:</h4>
                {sampleQuestions.map((q, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {answers[index] === q.correct ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>Question {index + 1}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-gray-600">Ready to play for real money and compete with thousands of players?</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={resetQuiz} variant="outline">
                    Try Again
                  </Button>
                  <Button className="bg-yellow-400 text-purple-900 hover:bg-yellow-300">Sign Up & Play</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

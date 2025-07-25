export interface User {
  id: string
  email: string
  name: string
  photoURL?: string
  role: "user" | "admin"
  totalScore: number
  totalAttempts: number
  rank: number
  badges: string[]
  streak: number
  lastLogin: Date // Changed to Date type for consistency
  referralCode: string
  referredBy?: string
}

export interface Quiz {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard" | "expert"
  price: number
  questions: Question[] // Array of Question objects
  timeLimit: number
  category: string
  language: string
  isActive: boolean
  createdAt: Date
}

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number // Changed to correctAnswer for clarity
  explanation?: string
  points: number
  difficulty: "easy" | "medium" | "hard" | "expert" // Added difficulty
  category: string // Added category
}

export interface QuizAttempt {
  id: string
  userId: string
  quizId: string
  score: number
  totalQuestions: number
  timeSpent: number
  answers: number[]
  completedAt: Date
  paymentId?: string
}

export interface Tournament {
  id: string
  name: string
  description: string
  entryFee: number
  prizePool: number
  startDate: Date
  endDate: Date
  participants: string[]
  winners: { userId: string; prize: number; rank: number }[]
  isActive: boolean
}

// User profile
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
  lastLogin: Date
  referralCode: string
  referredBy?: string
}

// Quiz definition
export interface Quiz {
  id: string
  title: string
  difficulty: "easy" | "medium" | "hard" | "expert"
  price: number
  questions: Question[] // Optional: You can change to string[] if referencing question IDs
  timeLimit: number
  category: string
  language: string
  isActive: boolean
  createdAt: Date
}

// Individual Question
export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points: number
  difficulty: "easy" | "medium" | "hard" | "expert"
  category: string
}

// Quiz attempt record
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

// Tournament model
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

// Feedback form submission
export interface Feedback {
  id: string
  name: string
  email?: string
  message: string
  createdAt: Date
}

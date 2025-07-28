import { db } from "./firebase"
import {
  doc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  increment,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore"

interface QuizAttemptData {
  uid: string
  difficulty: string
  score: number
  total: number
  timestamp: string
  streak?: number
}

export async function saveQuizAttempt(data: QuizAttemptData) {
  try {
    // Save in user subcollection
    const quizRef = collection(db, "users", data.uid, "quizzes")
    await addDoc(quizRef, {
      difficulty: data.difficulty,
      score: data.score,
      totalQuestions: data.total,
      completedAt: serverTimestamp(),
      streak: data.streak || 0,
    })

    // Update user stats
    const userRef = doc(db, "users", data.uid)
    await updateDoc(userRef, {
      totalAttempts: increment(1),
      totalScore: increment(data.score),
    })

    // Update global stats
    const globalRef = doc(db, "appConfig", "globalStats")
    await updateDoc(globalRef, {
      totalAttempts: increment(1),
    })

    console.log("✅ Quiz attempt saved successfully")
  } catch (error) {
    console.error("❌ Error saving quiz attempt:", error)
  }
}

export async function getLeaderboardTop10() {
  try {
    const q = query(collection(db, "users"), orderBy("totalScore", "desc"))
    const snapshot = await getDocs(q)
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    return users.slice(0, 10)
  } catch (err) {
    console.error("❌ Error fetching leaderboard:", err)
    return []
  }
}

export async function submitFeedback(uid: string, message: string) {
  try {
    await addDoc(collection(db, "feedback"), {
      uid,
      message,
      createdAt: serverTimestamp(),
    })
    console.log("✅ Feedback submitted")
  } catch (error) {
    console.error("❌ Error submitting feedback:", error)
  }
}

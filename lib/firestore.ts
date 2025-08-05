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
  getDoc,
  arrayUnion,
  where
} from "firebase/firestore"

// ✅ Quiz Attempt Interface
export interface QuizAttemptData {
  uid: string
  difficulty: string
  score: number
  total: number
  timestamp: string
  streak?: number
  transactionId?: string
  success: boolean
  refundStatus?: "initiated" | "completed" | "not_required" | "failed"
  failureReason?: string
}

// ✅ Save Quiz Attempt
export async function saveQuizAttempt(data: QuizAttemptData) {
  try {
    const quizRef = collection(db, "users", data.uid, "quizzes")
    const attemptDoc = {
      difficulty: data.difficulty,
      score: data.score,
      totalQuestions: data.total,
      completedAt: serverTimestamp(),
      streak: data.streak || 0,
      transactionId: data.transactionId || null,
      success: data.success ?? true,
      amount: data.transactionId ? getQuizPrice(data.difficulty) : 0,
      refunded: false,
      refundStatus: data.refundStatus || "not_required",
      failureReason: data.failureReason || null,
    }

    await addDoc(quizRef, attemptDoc)

    const userRef = doc(db, "users", data.uid)
    await updateDoc(userRef, {
      totalAttempts: increment(1),
      totalScore: increment(data.score),
    })

    const globalRef = doc(db, "appConfig", "globalStats")
    await updateDoc(globalRef, {
      totalAttempts: increment(1),
    })

    console.log("✅ Quiz attempt saved successfully:", data)
  } catch (error) {
    console.error("❌ Error saving quiz attempt:", error)
  }
}

// ✅ Dummy pricing logic
function getQuizPrice(difficulty: string): number {
  switch (difficulty) {
    case "medium": return 10
    case "hard": return 50
    case "expert": return 100
    default: return 0
  }
}

// ✅ Leaderboard
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

// ✅ Feedback
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

// ✅ Wallet Functions
export async function getWalletBalance(uid: string): Promise<number> {
  try {
    const userRef = doc(db, "users", uid)
    const snap = await getDoc(userRef)
    if (!snap.exists()) {
      console.warn(`⚠️ No user found for UID: ${uid}`)
      return 0
    }
    const data = snap.data()
    return data?.walletBalance || 0
  } catch (error) {
    console.error("❌ Error getting wallet balance:", error)
    return 0
  }
}

export async function addToWallet(uid: string, amount: number) {
  try {
    const userRef = doc(db, "users", uid)
    await updateDoc(userRef, {
      walletBalance: increment(amount),
      lastWalletUpdate: serverTimestamp(),
    })
    console.log(`✅ ₹${amount} added to wallet for ${uid}`)
  } catch (error) {
    console.error("❌ Failed to add to wallet:", error)
  }
}

export async function deductFromWallet(uid: string, amount: number) {
  try {
    const balance = await getWalletBalance(uid)
    if (balance < amount) {
      throw new Error(`❌ Insufficient wallet balance: ₹${balance} < ₹${amount}`)
    }

    const userRef = doc(db, "users", uid)
    await updateDoc(userRef, {
      walletBalance: increment(-amount),
      lastWalletUpdate: serverTimestamp(),
    })

    console.log(`✅ ₹${amount} deducted from wallet for ${uid}`)
  } catch (error) {
    console.error("❌ Failed to deduct from wallet:", error)
    throw error
  }
}

// ✅ Tournament Interface
export interface Tournament {
  id?: string
  title: string
  prizePool: number
  entryFee: number
  startTime: string
  endTime: string
  difficulty: "easy" | "medium" | "hard" | "expert"
  participants?: string[]
  createdAt?: any
}

// ✅ Fetch All Tournaments
export async function fetchTournaments(): Promise<Tournament[]> {
  try {
    const q = query(collection(db, "tournaments"), orderBy("startTime", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament))
  } catch (error) {
    console.error("❌ Error fetching tournaments:", error)
    return []
  }
}

// ✅ Add Tournament
export async function addTournament(tournament: Tournament) {
  try {
    await addDoc(collection(db, "tournaments"), {
      ...tournament,
      createdAt: serverTimestamp(),
    })
    console.log("✅ Tournament created successfully")
  } catch (error) {
    console.error("❌ Error creating tournament:", error)
  }
}

// ✅ Join Tournament
export async function joinTournament(tournamentId: string, uid: string, entryFee: number) {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)
    const balance = userSnap.data()?.walletBalance || 0

    if (balance < entryFee) throw new Error("❌ Insufficient wallet balance")

    await updateDoc(userRef, {
      walletBalance: increment(-entryFee),
      lastWalletUpdate: serverTimestamp(),
    })

    const tournamentRef = doc(db, "tournaments", tournamentId)
    await updateDoc(tournamentRef, {
      participants: arrayUnion(uid),
    })

    console.log(`✅ User ${uid} joined tournament ${tournamentId}`)
  } catch (error) {
    console.error("❌ Error joining tournament:", error)
    throw error
  }
}

// ✅ Wallet Aliases
export async function fetchUserWalletBalance(uid: string): Promise<number> {
  return await getWalletBalance(uid)
}

export async function updateUserWalletBalance(uid: string, amount: number) {
  return await addToWallet(uid, amount)
}

// ✅ Get Failed Quiz Attempts (with payment but not refunded)
export async function getFailedQuizAttempts(): Promise<any[]> {
  const results: any[] = []
  const usersSnapshot = await getDocs(collection(db, "users"))

  for (const userDoc of usersSnapshot.docs) {
    const uid = userDoc.id
    const quizzesRef = collection(db, "users", uid, "quizzes")
    const q = query(
      quizzesRef,
      where("success", "==", false),
      where("transactionId", "!=", null),
      where("refunded", "==", false)
    )
    const snapshot = await getDocs(q)
    snapshot.forEach(docSnap => {
      const data = docSnap.data()
      results.push({
        id: docSnap.id,
        userId: uid,
        userEmail: userDoc.data().email || "N/A",
        ...data
      })
    })
  }

  return results
}

// ✅ Refund a Failed Quiz Attempt
export async function refundQuizPayment(attemptId: string): Promise<void> {
  const usersSnapshot = await getDocs(collection(db, "users"))

  for (const userDoc of usersSnapshot.docs) {
    const uid = userDoc.id
    const quizRef = doc(db, "users", uid, "quizzes", attemptId)
    const quizSnap = await getDoc(quizRef)
    if (quizSnap.exists()) {
      const data = quizSnap.data()
      const amount = data?.amount || 0
      const alreadyRefunded = data?.refunded

      if (!alreadyRefunded && amount > 0) {
        await addToWallet(uid, amount)
        await updateDoc(quizRef, {
          refunded: true,
          refundStatus: "completed",
        })
        console.log(`✅ Refunded ₹${amount} to user ${uid} for attempt ${attemptId}`)
      }
      break
    }
  }
}

// ✅ Get Payment Record by ID
export async function getPaymentRecord(paymentId: string): Promise<any | null> {
  try {
    const docRef = doc(db, "paymentRecords", paymentId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? docSnap.data() : null
  } catch (error) {
    console.error("❌ Error fetching payment record:", error)
    return null
  }
}

"use server"

import { adminDb as db } from "@/lib/firebase-admin"
import { Timestamp } from "firebase-admin/firestore"
import type { Question, User, Quiz, Feedback } from "@/lib/types"

// --- 📌 Question Management ---
export async function addQuestion(questionData: Omit<Question, "id">) {
  try {
    const docRef = await db.collection("questions").add({
      ...questionData,
      createdAt: new Date(),
    })
    console.log("✅ Question added with ID:", docRef.id)
    return { success: true, id: docRef.id }
  } catch (e) {
    console.error("❌ Error adding question:", e)
    throw new Error("Failed to add question.")
  }
}

// --- 👥 User Management ---
export async function fetchUsers(): Promise<User[]> {
  try {
    const usersCol = db.collection("users")
    const userSnapshot = await usersCol.get()
    const usersList = userSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        lastLogin: data.lastLogin instanceof Timestamp ? data.lastLogin.toDate().toISOString() : null,
        lastWalletUpdate: data.lastWalletUpdate instanceof Timestamp ? data.lastWalletUpdate.toDate().toISOString() : null,
      }
    }) as User[]
    return usersList
  } catch (e) {
    console.error("❌ Error fetching users:", e)
    throw new Error("Failed to fetch users.")
  }
}

export async function updateUserRole(userId: string, newRole: "user" | "admin") {
  try {
    const userRef = db.collection("users").doc(userId)
    await userRef.update({ role: newRole })
    console.log(`✅ User ${userId} role updated to ${newRole}`)
    return { success: true }
  } catch (e) {
    console.error("❌ Error updating user role:", e)
    throw new Error("Failed to update user role.")
  }
}

// --- 🧠 Quiz Management ---
export async function fetchQuizzes(): Promise<Quiz[]> {
  try {
    const quizzesCol = db.collection("quizzes")
    const quizSnapshot = await quizzesCol.get()
    const quizzesList = quizSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate instanceof Timestamp ? data.startDate.toDate().toISOString() : null,
        endDate: data.endDate instanceof Timestamp ? data.endDate.toDate().toISOString() : null,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null,
      }
    }) as Quiz[]
    return quizzesList
  } catch (e) {
    console.error("❌ Error fetching quizzes:", e)
    throw new Error("Failed to fetch quizzes.")
  }
}

export async function toggleQuizActiveStatus(quizId: string, isActive: boolean) {
  try {
    const quizRef = db.collection("quizzes").doc(quizId)
    await quizRef.update({ isActive })
    console.log(`✅ Quiz ${quizId} active status toggled to ${isActive}`)
    return { success: true }
  } catch (e) {
    console.error("❌ Error toggling quiz active status:", e)
    throw new Error("Failed to toggle quiz active status.")
  }
}

// --- 💬 Feedback Management ---
export async function fetchFeedback(): Promise<Feedback[]> {
  try {
    const feedbackCol = db.collection("feedback")
    const snapshot = await feedbackCol.get()
    const feedbackList = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null,
      }
    }) as Feedback[]
    return feedbackList
  } catch (e) {
    console.error("❌ Error fetching feedback:", e)
    throw new Error("Failed to fetch feedback.")
  }
}

// --- ⚙️ Global Config: Dummy Data Toggle ---
export async function getShowDummyData(): Promise<boolean> {
  try {
    const configRef = db.collection("config").doc("global")
    const snapshot = await configRef.get()
    return snapshot.exists ? snapshot.data()?.showDummyData ?? false : false
  } catch (e) {
    console.error("❌ Error getting showDummyData:", e)
    return false
  }
}

export async function setShowDummyData(value: boolean) {
  try {
    const configRef = db.collection("config").doc("global")
    await configRef.update({ showDummyData: Boolean(value) })
    console.log("✅ showDummyData set to", value)
    return { success: true }
  } catch (e) {
    console.error("❌ Error setting showDummyData:", e)
    throw new Error("Failed to update dummy data flag.")
  }
}

// --- 📰 Global Config: Marquee Message ---
export async function getMarqueeMessage(): Promise<string> {
  try {
    const configRef = db.collection("config").doc("global")
    const snapshot = await configRef.get()
    return snapshot.exists ? snapshot.data()?.marqueeMessage ?? "" : ""
  } catch (e) {
    console.error("❌ Error fetching marquee message:", e)
    return ""
  }
}

export async function setMarqueeMessage(newMessage: string) {
  try {
    const configRef = db.collection("config").doc("global")
    await configRef.update({ marqueeMessage: newMessage })
    console.log("✅ Updated marquee message:", newMessage)
    return { success: true }
  } catch (e) {
    console.error("❌ Error updating marquee message:", e)
    throw new Error("Failed to update marquee message.")
  }
}

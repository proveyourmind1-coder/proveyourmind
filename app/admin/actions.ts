"use server"

import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore"
import type { Question, User, Quiz } from "@/lib/types"

// --- Question Management ---
export async function addQuestion(questionData: Omit<Question, "id">) {
  try {
    const docRef = await addDoc(collection(db, "questions"), {
      ...questionData,
      createdAt: new Date(),
    })
    console.log("Question added with ID: ", docRef.id)
    return { success: true, id: docRef.id }
  } catch (e) {
    console.error("Error adding question: ", e)
    throw new Error("Failed to add question.")
  }
}

// --- User Management ---
export async function fetchUsers(): Promise<User[]> {
  try {
    const usersCol = collection(db, "users")
    const userSnapshot = await getDocs(usersCol)
    const usersList = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      lastLogin: doc.data().lastLogin?.toDate(), // Convert Firebase Timestamp to Date
    })) as User[]
    return usersList
  } catch (e) {
    console.error("Error fetching users: ", e)
    throw new Error("Failed to fetch users.")
  }
}

export async function updateUserRole(userId: string, newRole: "user" | "admin") {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, { role: newRole })
    console.log(`User ${userId} role updated to ${newRole}`)
    return { success: true }
  } catch (e) {
    console.error("Error updating user role: ", e)
    throw new Error("Failed to update user role.")
  }
}

// --- Quiz Management ---
export async function fetchQuizzes(): Promise<Quiz[]> {
  try {
    const quizzesCol = collection(db, "quizzes")
    const quizSnapshot = await getDocs(quizzesCol)
    const quizzesList = quizSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate(), // Convert Firebase Timestamp to Date
      endDate: doc.data().endDate?.toDate(), // Convert Firebase Timestamp to Date
      createdAt: doc.data().createdAt?.toDate(), // Convert Firebase Timestamp to Date
    })) as Quiz[]
    return quizzesList
  } catch (e) {
    console.error("Error fetching quizzes: ", e)
    throw new Error("Failed to fetch quizzes.")
  }
}

export async function toggleQuizActiveStatus(quizId: string, isActive: boolean) {
  try {
    const quizRef = doc(db, "quizzes", quizId)
    await updateDoc(quizRef, { isActive: isActive })
    console.log(`Quiz ${quizId} active status toggled to ${isActive}`)
    return { success: true }
  } catch (e) {
    console.error("Error toggling quiz active status: ", e)
    throw new Error("Failed to toggle quiz active status.")
  }
}

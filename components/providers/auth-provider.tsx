"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { auth, db, googleProvider } from "@/lib/firebase" // Import Firebase auth and db
import { signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: (redirectPath?: string) => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // Set to true initially to handle auth state
  const { toast } = useToast()
  const router = useRouter()

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch their profile from Firestore
        const userRef = doc(db, "users", firebaseUser.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const userData = userSnap.data() as User
          setUser({
            ...userData,
            id: firebaseUser.uid,
            email: firebaseUser.email || userData.email, // Ensure email is set
            name: firebaseUser.displayName || userData.name || firebaseUser.email?.split("@")[0] || "User",
            photoURL: firebaseUser.photoURL || userData.photoURL,
            lastLogin: new Date(), // Update last login on every auth state change
          })
          // Update lastLogin in Firestore
          await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true })
        } else {
          // New user or user not in Firestore, create a profile
          const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "New User",
            photoURL: firebaseUser.photoURL || "/placeholder.svg?height=40&width=40",
            role: "user", // Default role for new users
            totalScore: 0,
            totalAttempts: 0,
            rank: 0,
            badges: [],
            streak: 0,
            lastLogin: new Date(),
            referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(), // Generate a simple referral code
          }
          await setDoc(userRef, newUser)
          setUser(newUser)
          toast({
            title: "Welcome! 🎉",
            description: "Your account has been created.",
          })
        }
      } else {
        // User is signed out
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe() // Cleanup subscription on unmount
  }, [toast])

  const loginWithGoogle = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      // onAuthStateChanged listener will handle setting the user state
      toast({
        title: "Login Successful! 🎉",
        description: "Welcome to ProveYourMind!",
      })
    } catch (error: any) {
      console.error("Google login error:", error)
      let errorMessage = "Google login failed. Please try again."
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Login cancelled. Please try again."
      } else if (error.code === "auth/unauthorized-domain") {
        errorMessage = "Login domain not authorized. Please contact support."
      } else if (error.message) {
        errorMessage = error.message
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // onAuthStateChanged listener will handle setting the user state
      toast({
        title: "Login Successful! 🎉",
        description: `Welcome back!`,
      })
    } catch (error: any) {
      console.error("Email/Password login error:", error)
      let errorMessage = "Invalid email or password. Please try again."
      if (error.message) {
        errorMessage = error.message
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const logout = async (redirectPath = "/") => {
    // Add redirectPath parameter with default
    try {
      await signOut(auth)
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      router.push(redirectPath) // Redirect after logout
    } catch (error: any) {
      console.error("Logout error:", error)
      toast({
        title: "Logout Failed",
        description: "Something went wrong during logout.",
        variant: "destructive",
      })
    }
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

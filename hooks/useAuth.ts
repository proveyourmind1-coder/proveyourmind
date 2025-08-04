"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export function useAuth(redirectTo: string = "/") {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)

      // Redirect if not logged in
      if (!firebaseUser && redirectTo) {
        router.push(redirectTo)
      }
    })

    return () => unsubscribe()
  }, [router, redirectTo])

  return { user, loading }
}

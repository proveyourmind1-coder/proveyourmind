import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics" // Import isSupported

import { firebaseConfig } from "./config"

let app
if (typeof window !== "undefined") {
  // Only initialize on the client
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }
}

// Export services conditionally
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null

// Initialize analytics only if supported and on the client
export const analytics = app && typeof window !== "undefined" && isAnalyticsSupported() ? getAnalytics(app) : null

// Configure Google Auth Provider (can be done unconditionally as it's just an object)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: "select_account",
})

export default app

// ✅ Firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyD7mp0YXiXWUhoMBH21nMXZyu2EsizeMxU",
  authDomain: "proveyourmind.firebaseapp.com",
  projectId: "proveyourmind",
  storageBucket: "proveyourmind.firebasestorage.app",
  messagingSenderId: "498360240063",
  appId: "1:498360240063:web:c3aec2ebf8a675f8e1030a",
}

// ✅ Static app config
export const appConfig = {
  name: "ProveYourMind",
  tagline: "Reward Intelligence. Gamify Knowledge.",
  currency: "INR",
  quizPrices: {
    easy: 0,
    medium: 10,
    hard: 50,
    expert: 100,
  },
}

// ✅ Firebase Firestore dynamic config
import { doc, getDoc } from "firebase/firestore"
import { db } from "./firebase"

// 🔁 Live Marquee Message
export async function getLiveMarqueeMessage(): Promise<string> {
  try {
    const ref = doc(db, "config", "global")
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data().marqueeMessage ?? "" : ""
  } catch (e) {
    console.error("❌ Error fetching marquee message", e)
    return ""
  }
}

// ✅ Dummy data toggle function
export async function isDummyDataEnabled(): Promise<boolean> {
  try {
    const ref = doc(db, "config", "global")
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data().showDummyData === true : false
  } catch (e) {
    console.error("❌ Error fetching dummy toggle", e)
    return false
  }
}

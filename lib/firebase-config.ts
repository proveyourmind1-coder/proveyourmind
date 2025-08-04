import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase"

export async function fetchShowDummyData(): Promise<boolean> {
  try {
    const docRef = doc(db, "config", "global")
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      return data.showDummyData === true
    }
    return false
  } catch (error) {
    console.error("❌ Error fetching dummy toggle:", error)
    return false
  }
}

export async function toggleShowDummyData(value: boolean): Promise<void> {
  try {
    const docRef = doc(db, "config", "global")
    await updateDoc(docRef, { showDummyData: value })
  } catch (error) {
    console.error("❌ Error updating dummy toggle:", error)
  }
}

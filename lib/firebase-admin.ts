  // lib/firebase-admin.ts
  import * as admin from "firebase-admin"

  let isInitialized = false

  // ✅ Check and initialize only once
  if (!admin.apps.length) {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || ""

    if (!serviceAccountBase64) {
      console.error("❌ ENV Missing: FIREBASE_SERVICE_ACCOUNT_BASE64 is not defined")
      throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable.")
    }

    try {
      // ✅ Decode and parse base64-encoded JSON
      const decoded = Buffer.from(serviceAccountBase64, "base64").toString("utf8")
      console.log("✅ Decoded Firebase Admin credentials")

      const serviceAccount = JSON.parse(decoded)
      console.log("✅ Parsed service account JSON")

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })

      console.log("✅ Firebase Admin SDK Initialized")
      isInitialized = true
    } catch (error) {
      console.error("❌ Failed to initialize Firebase Admin SDK:")
      console.error(error)
      throw new Error("Firebase Admin initialization failed. Check base64 string format.")
    }
  } else {
    console.log("ℹ️ Firebase Admin SDK already initialized")
  }

  // ✅ Export the Firestore instance
  export const adminDb = admin.firestore()

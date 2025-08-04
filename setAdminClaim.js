// setAdminClaim.js

const admin = require("firebase-admin")
const serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const uid = "wJg9RPqdzURhjezI72gxUu5Alpk1" // 👈 your UID

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Admin claim set for UID: ${uid}`)
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Failed to set admin claim:", error)
    process.exit(1)
  })

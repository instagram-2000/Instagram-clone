// One-off dev script: seeds Firestore with dummy hospital tenant configs.
// Run with: npm run seed
import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { dummyHospitals } from '../src/seed/hospitals.data.js'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

for (const [slug, config] of Object.entries(dummyHospitals)) {
  const ref = doc(db, 'hospitals', slug)
  const existing = await getDoc(ref)

  if (existing.exists()) {
    // Re-seeding refreshes presentational content but preserves an
    // existing status/createdAt so admin changes made via the superadmin
    // dashboard (trial/active toggle, etc.) survive re-running this
    // script — only backfilled when genuinely missing (e.g. hospitals
    // seeded before these fields existed).
    const data = existing.data()
    const patch = { ...config, updatedAt: serverTimestamp() }
    if (data.status === undefined) patch.status = 'trial'
    if (data.createdAt === undefined) patch.createdAt = serverTimestamp()
    await setDoc(ref, patch, { merge: true })
  } else {
    await setDoc(ref, {
      ...config,
      status: 'trial',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: 'seed-script',
    })
  }

  console.log(`Seeded hospitals/${slug}`)
}

console.log('Done.')
process.exit(0)

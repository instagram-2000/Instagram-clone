// One-off dev script: seeds Firestore with dummy hospital tenant configs.
// Run with: npm run seed
import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
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
  await setDoc(doc(db, 'hospitals', slug), config)
  console.log(`Seeded hospitals/${slug}`)
}

console.log('Done.')
process.exit(0)

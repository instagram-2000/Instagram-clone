import { initializeApp, getApps, deleteApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signOut, inMemoryPersistence } from 'firebase/auth'
import { firebaseConfig } from './config'

const SECONDARY_APP_NAME = 'staff-account-creator'

// Firebase's client SDK signs in as whatever account you just created with
// createUserWithEmailAndPassword, which would boot the superadmin out of
// their own session. Creating the account on a second, isolated app
// instance (with in-memory-only persistence) avoids touching the
// superadmin's primary session at all.
function getSecondaryAuth() {
  const existing = getApps().find((app) => app.name === SECONDARY_APP_NAME)
  const app = existing || initializeApp(firebaseConfig, SECONDARY_APP_NAME)
  const secondaryAuth = getAuth(app)
  secondaryAuth.setPersistence(inMemoryPersistence)
  return { app, secondaryAuth }
}

/**
 * Creates a new Firebase Auth user without disturbing the currently
 * signed-in (superadmin) session. Returns the new user's uid.
 */
export async function createStaffAuthAccount(email, password) {
  const { app, secondaryAuth } = getSecondaryAuth()
  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password)
    return credential.user.uid
  } finally {
    await signOut(secondaryAuth).catch(() => {})
    await deleteApp(app).catch(() => {})
  }
}

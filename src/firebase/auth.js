import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './config'

export function signInSuperAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function signOutSuperAdmin() {
  return signOut(auth)
}

export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback)
}

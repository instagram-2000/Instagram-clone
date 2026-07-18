import { doc, getDoc } from 'firebase/firestore'
import { db } from './config'

const HOSPITALS_COLLECTION = 'hospitals'

/**
 * Fetches a single hospital's tenant configuration by its subdomain slug.
 * Returns null if no hospital is configured for that slug.
 */
export async function fetchHospitalConfigBySlug(slug) {
  const ref = doc(db, HOSPITALS_COLLECTION, slug)
  const snapshot = await getDoc(ref)

  if (!snapshot.exists()) {
    return null
  }

  return { slug, ...snapshot.data() }
}

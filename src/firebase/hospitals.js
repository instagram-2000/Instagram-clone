import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './config'
import { hasActiveStaffForHospital } from './users'

const HOSPITALS_COLLECTION = 'hospitals'

// Slugs that would collide with app routes or be confusing as a hospital
// subdomain (e.g. abc.xyz.com is fine, but superadmin.xyz.com is not a tenant).
const RESERVED_SLUGS = new Set(['superadmin', 'www', 'api', 'admin', 'app'])

// Content sections (services/departments/doctors/testimonials) start empty
// and disabled — hospitals opt into managing this presentational content
// later; the superadmin form only owns branding, status and contact info.
export const DEFAULT_OPTIONALS = {
  services: { enabled: 'off', orderNumber: 1, items: [] },
  departments: { enabled: 'off', orderNumber: 2, items: [] },
  doctors: { enabled: 'off', orderNumber: 3, items: [] },
  testimonials: { enabled: 'off', orderNumber: 4, items: [] },
}

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

export function isReservedSlug(slug) {
  return RESERVED_SLUGS.has(slug.toLowerCase())
}

// Fills in defaults for hospitals created before status/optionals existed
// in the schema, so older/legacy docs render correctly in the admin UI
// without requiring a data migration.
function normalizeHospital(slug, data) {
  return { status: 'trial', optionals: DEFAULT_OPTIONALS, ...data, slug }
}

export function subscribeHospital(slug, callback) {
  return onSnapshot(doc(db, HOSPITALS_COLLECTION, slug), (snapshot) => {
    callback(snapshot.exists() ? normalizeHospital(snapshot.id, snapshot.data()) : null)
  })
}

export function subscribeHospitals(callback) {
  // Sorted client-side (rather than an orderBy('createdAt') query) so
  // hospitals seeded before this field existed still show up instead of
  // being silently excluded by Firestore.
  return onSnapshot(collection(db, HOSPITALS_COLLECTION), (snapshot) => {
    const hospitals = snapshot.docs.map((d) => normalizeHospital(d.id, d.data()))
    hospitals.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
    callback(hospitals)
  })
}

export async function createHospital(slug, data, createdBy) {
  const normalizedSlug = slug.trim().toLowerCase()
  if (!/^[a-z0-9-]+$/.test(normalizedSlug)) {
    throw new Error('Slug can only contain lowercase letters, numbers and hyphens.')
  }
  if (isReservedSlug(normalizedSlug)) {
    throw new Error(`"${normalizedSlug}" is a reserved slug and can't be used.`)
  }

  const ref = doc(db, HOSPITALS_COLLECTION, normalizedSlug)
  const existing = await getDoc(ref)
  if (existing.exists()) {
    throw new Error(`A hospital already exists at slug "${normalizedSlug}".`)
  }

  await setDoc(ref, {
    optionals: DEFAULT_OPTIONALS,
    ...data,
    status: 'trial',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy,
  })

  return normalizedSlug
}

export function updateHospital(slug, patch) {
  return updateDoc(doc(db, HOSPITALS_COLLECTION, slug), {
    ...patch,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteHospital(slug) {
  const hasActiveStaff = await hasActiveStaffForHospital(slug)
  if (hasActiveStaff) {
    throw new Error(
      'This hospital still has active staff assigned. Deactivate or reassign them before deleting it.'
    )
  }
  await deleteDoc(doc(db, HOSPITALS_COLLECTION, slug))
}

export async function getHospitalCounts() {
  const hospitalsRef = collection(db, HOSPITALS_COLLECTION)
  const [totalSnap, trialSnap, activeSnap] = await Promise.all([
    getCountFromServer(hospitalsRef),
    getCountFromServer(query(hospitalsRef, where('status', '==', 'trial'))),
    getCountFromServer(query(hospitalsRef, where('status', '==', 'active'))),
  ])
  return {
    total: totalSnap.data().count,
    trial: trialSnap.data().count,
    active: activeSnap.data().count,
  }
}

import { fetchHospitalConfigBySlug } from '../firebase/hospitals'
import { readCache, writeCache } from './cacheStorage'

const cacheKey = (slug) => `hospital-config:${slug}`

/**
 * Resolves a hospital's tenant config for the given slug, cache-first.
 * Returns null when no hospital exists for that slug.
 */
export async function resolveHospitalConfig(slug) {
  const cached = readCache(cacheKey(slug))
  if (cached) return cached

  const config = await fetchHospitalConfigBySlug(slug)
  if (config) writeCache(cacheKey(slug), config)

  return config
}

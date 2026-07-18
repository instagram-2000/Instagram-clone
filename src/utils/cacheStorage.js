const DEFAULT_TTL_MS = 30 * 60 * 1000 // 30 minutes

/**
 * Thin wrapper around localStorage for caching JSON-serializable values
 * with an expiry. Used to avoid re-fetching tenant config from Firestore
 * on every page load. Falls back to a no-op silently if storage is
 * unavailable (private browsing, disabled storage, etc).
 */
export function readCache(key) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null

    const { value, expiresAt } = JSON.parse(raw)
    if (Date.now() > expiresAt) {
      window.localStorage.removeItem(key)
      return null
    }

    return value
  } catch {
    return null
  }
}

export function writeCache(key, value, ttlMs = DEFAULT_TTL_MS) {
  try {
    const payload = JSON.stringify({ value, expiresAt: Date.now() + ttlMs })
    window.localStorage.setItem(key, payload)
  } catch {
    // storage unavailable or quota exceeded — cache is best-effort
  }
}

export function clearCache(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

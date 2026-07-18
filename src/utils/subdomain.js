const ROOT_HOSTNAMES = new Set(['localhost', '127.0.0.1'])

/**
 * Resolves the tenant slug from the current URL.
 *
 * Examples:
 *   xyz.com            -> null   (root marketing site)
 *   www.xyz.com        -> null   (root marketing site)
 *   abc.xyz.com         -> "abc"  (hospital tenant)
 *   localhost           -> null   (root, for local dev)
 *   abc.localhost        -> "abc"  (hospital tenant, for local dev)
 *
 * A `?tenant=abc` query param always wins, so a tenant site can be
 * previewed on plain `localhost` without configuring hosts/DNS.
 */
export function getTenantSlug(location = window.location) {
  const override = new URLSearchParams(location.search).get('tenant')
  if (override) return override.toLowerCase()

  const hostname = location.hostname.toLowerCase()

  if (ROOT_HOSTNAMES.has(hostname)) return null

  const parts = hostname.split('.')

  if (parts.length >= 3) {
    return parts[0] === 'www' ? null : parts[0]
  }

  if (parts.length === 2 && parts[1] === 'localhost') {
    return parts[0]
  }

  return null
}

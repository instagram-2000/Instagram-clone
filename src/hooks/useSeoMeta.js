import { useEffect } from 'react'

const DEFAULT_IMAGE = '/currez-mark.png'

function upsertMeta(attr, key, content) {
  if (!content) return null
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  return el
}

function upsertCanonical(href) {
  if (!href) return null
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  return el
}

// Per-page <title>, meta description, robots directive, Open Graph/Twitter
// card tags, canonical URL, and (optionally) a JSON-LD structured-data
// script — all set imperatively on mount and reverted on unmount, so
// navigating between routes never leaves a previous page's tags behind.
// No new dependency (no react-helmet) — this app is a client-rendered SPA
// with a single static index.html, so these are the only per-route SEO
// signals available without adding a build/server step.
export function useSeoMeta({ title, description, image, noindex = false, structuredData } = {}) {
  useEffect(() => {
    const previousTitle = document.title
    if (title) document.title = title

    const managedEls = [
      upsertMeta('name', 'description', description),
      upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow'),
      upsertMeta('property', 'og:title', title),
      upsertMeta('property', 'og:description', description),
      upsertMeta('property', 'og:image', image || DEFAULT_IMAGE),
      upsertMeta('property', 'og:url', window.location.href),
      upsertMeta('property', 'og:type', 'website'),
      upsertMeta('name', 'twitter:card', 'summary_large_image'),
      upsertMeta('name', 'twitter:title', title),
      upsertMeta('name', 'twitter:description', description),
      upsertMeta('name', 'twitter:image', image || DEFAULT_IMAGE),
      upsertCanonical(window.location.origin + window.location.pathname),
    ].filter(Boolean)

    let scriptEl = null
    if (structuredData) {
      scriptEl = document.createElement('script')
      scriptEl.type = 'application/ld+json'
      scriptEl.textContent = JSON.stringify(structuredData)
      document.head.appendChild(scriptEl)
    }

    return () => {
      document.title = previousTitle
      managedEls.forEach((el) => el.remove())
      scriptEl?.remove()
    }
    // structuredData is a fresh object every render by design (callers pass
    // object literals) — comparing its JSON avoids re-running this effect
    // (and the tag churn that implies) on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, noindex, JSON.stringify(structuredData)])
}

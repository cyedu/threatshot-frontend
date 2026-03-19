import { useEffect } from 'react'

const SITE_NAME = 'ThreatShot'
const BASE_URL = 'https://threatshot.in'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`
const DEFAULT_DESCRIPTION =
  'ThreatShot is a cyber threat intelligence platform for Indian SMEs, NBFCs, and banks. Search CVEs, track threat feeds, scan IOCs, and stay ahead of attackers.'

/**
 * useSEO — sets document title, meta tags, OG/Twitter cards, canonical, and JSON-LD.
 *
 * Works without any external library by directly manipulating document.head.
 * Compatible with Googlebot, Bingbot, and AI crawlers (GPTBot, ClaudeBot, PerplexityBot)
 * that execute JavaScript.
 *
 * @param {object} options
 * @param {string}  options.title         - Page title (will be appended with "| ThreatShot")
 * @param {string}  options.description   - Meta description
 * @param {string}  options.keywords      - Comma-separated keywords
 * @param {string}  options.ogImage       - Absolute URL to OG image (defaults to og-image.png)
 * @param {string}  options.ogType        - OG type, e.g. "article" | "website" (default: "website")
 * @param {string}  options.canonical     - Canonical URL (defaults to current URL)
 * @param {boolean} options.noIndex       - Set to true for noindex pages
 * @param {object|object[]} options.structuredData - JSON-LD schema object(s)
 */
export function useSEO({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonical,
  noIndex = false,
  structuredData,
} = {}) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} — Cyber Threat Intelligence for India`
    const desc = description || DEFAULT_DESCRIPTION
    const image = ogImage || DEFAULT_OG_IMAGE
    const url = canonical || `${BASE_URL}${window.location.pathname}`

    // Track only newly-created elements so we can clean them up on unmount
    const created = []

    const upsertMeta = (attr, attrVal, content) => {
      let el = document.querySelector(`meta[${attr}="${attrVal}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, attrVal)
        document.head.appendChild(el)
        created.push(el)
      }
      el.setAttribute('content', content)
    }

    // ── Document title ───────────────────────────────────────────────────────
    const prevTitle = document.title
    document.title = fullTitle

    // ── Standard meta ────────────────────────────────────────────────────────
    upsertMeta('name', 'description', desc)
    if (keywords) upsertMeta('name', 'keywords', keywords)
    upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')

    // ── Open Graph ───────────────────────────────────────────────────────────
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', desc)
    upsertMeta('property', 'og:type', ogType)
    upsertMeta('property', 'og:image', image)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:locale', 'en_IN')

    // ── Twitter Card ─────────────────────────────────────────────────────────
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', desc)
    upsertMeta('name', 'twitter:image', image)

    // ── Canonical link ───────────────────────────────────────────────────────
    let canonicalEl = document.querySelector('link[rel="canonical"]')
    const prevCanonical = canonicalEl?.getAttribute('href') || null
    if (!canonicalEl) {
      canonicalEl = document.createElement('link')
      canonicalEl.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalEl)
      created.push(canonicalEl)
    }
    canonicalEl.setAttribute('href', url)

    // ── JSON-LD structured data ───────────────────────────────────────────────
    let ldScript = document.getElementById('seo-jsonld')
    if (structuredData) {
      if (!ldScript) {
        ldScript = document.createElement('script')
        ldScript.setAttribute('type', 'application/ld+json')
        ldScript.setAttribute('id', 'seo-jsonld')
        document.head.appendChild(ldScript)
      }
      // Wrap array schemas in @graph; use object directly for single schema
      const payload = Array.isArray(structuredData)
        ? { '@context': 'https://schema.org', '@graph': structuredData }
        : structuredData
      ldScript.textContent = JSON.stringify(payload)
    }

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      document.title = prevTitle
      if (prevCanonical && canonicalEl) canonicalEl.setAttribute('href', prevCanonical)
      created.forEach(el => el.remove())
      // Always remove JSON-LD — each page has different structured data
      const ld = document.getElementById('seo-jsonld')
      if (ld) ld.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, keywords, ogImage, ogType, canonical, noIndex])
}

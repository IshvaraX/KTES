import { readFileSync } from 'node:fs'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Search engines and link previews need absolute URLs; set SITE_URL in .env or Netlify to override
const DEFAULT_SITE_URL = 'https://ktes.netlify.app'

function seo(siteUrl) {
  const site = siteUrl.replace(/\/+$/, '')
  const seen = new Set()
  const trails = JSON.parse(readFileSync(new URL('./src/components/trails.json', import.meta.url), 'utf8')).filter(
    (t) => !seen.has(t.id) && seen.add(t.id)
  )

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'KTES',
      alternateName: 'Karnataka Trekking Exploration Site',
      url: `${site}/`,
      inLanguage: 'en-IN',
      description:
        'An independent guide to treks, forts and waterfalls near Bangalore, with group trek plans and nearby railway stations.',
      publisher: { '@type': 'Organization', name: 'KTES', url: `${site}/`, logo: `${site}/icon-512.png` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Treks and waterfalls within a day of Bangalore',
      itemListElement: trails.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'TouristAttraction',
          name: t.name,
          description: t.note,
          url: `${site}/#trail-${t.id}`,
          isAccessibleForFree: t.isFree,
          touristType: 'Trekkers',
          geo: { '@type': 'GeoCoordinates', latitude: t.lat, longitude: t.lng },
          address: { '@type': 'PostalAddress', addressRegion: 'Karnataka', addressLocality: t.region, addressCountry: 'IN' },
        },
      })),
    },
  ]

  return {
    name: 'ktes-seo',
    transformIndexHtml(html) {
      return html
        .replaceAll('%SITE_URL%', site)
        .replace(
          '</head>',
          `    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>\n  </head>`
        )
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), seo(process.env.SITE_URL || env.SITE_URL || DEFAULT_SITE_URL)],
    // Lets the browser read MAPTILER_API from app/.env without renaming it
    envPrefix: ['VITE_', 'MAPTILER_'],
  }
})

/**
 * Regenerates the blog hero / social-card images.
 *
 *   node scripts/generate-blog-images.mjs               -> writes public/blog/
 *   node scripts/generate-blog-images.mjs --out=scripts -> preview render
 *
 * One card per post, 1200x630 JPEG, filenames matching the `image` paths in
 * data/blog-posts.ts. These are the BlogPosting `image` and per-post og:image
 * targets — before this script existed the paths pointed at files that were
 * never created, so every post's Article rich result carried a soft-404.
 *
 * The composition is the OG card (scripts/generate-og-images.mjs) with the
 * lockup swapped for editorial copy: same blackhole lower arc, same seeded
 * starfield, same #030014 field and vendored Inter — one visual system, not a
 * second one. Everything is data URIs; the render never touches the network
 * and is byte-stable across machines (seeded stars, no Math.random()).
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const outArg = process.argv.find((a) => a.startsWith('--out='))
const OUT = join(ROOT, outArg ? outArg.slice(6) : 'public/blog')

const W = 1200
const H = 630

const dataUri = (p, mime) =>
  `data:${mime};base64,${readFileSync(join(ROOT, p)).toString('base64')}`

const logo = dataUri('public/brand/logo-final-white.svg', 'image/svg+xml')
const blackhole = dataUri('public/videos/blackhole-poster.webp', 'image/webp')
const interLatin = dataUri('scripts/assets/inter-latin.woff2', 'font/woff2')
const interExt = dataUri('scripts/assets/inter-latin-ext.woff2', 'font/woff2')

// Same ring geometry as the OG cards — see generate-og-images.mjs for why the
// disk line sits flush with the top edge.
const RING_H = Math.round(810 * (W / 1440)) // 675
const RING_TOP = -Math.round(RING_H / 2)

/** Mulberry32 -- tiny seeded PRNG, so the star field is identical every run. */
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function stars(seed, count) {
  const rand = rng(seed)
  const out = []
  for (let i = 0; i < count; i++) {
    const x = rand() * W
    const y = rand() * H
    const nearGlow = y < 300 && Math.abs(x - W / 2) < 420
    if (nearGlow && rand() < 0.72) continue
    const size = rand() < 0.86 ? 1.5 : 2.5
    const alpha = (0.18 + rand() * 0.55).toFixed(2)
    out.push(
      `<i style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${size}px;height:${size}px;opacity:${alpha}"></i>`
    )
  }
  return out.join('')
}

// Titles are duplicated from data/blog-posts.ts rather than imported: this is
// an .mjs run outside the TS pipeline, and the card copy is allowed to break
// a long SEO title for composition. Keep them in sync when a title changes.
const CARDS = [
  {
    file: 'claude-code-guide.jpg',
    category: 'AI & Engineering',
    title: 'Claude Code: The Complete Guide to AI-Powered Development',
    seed: 20260301,
  },
  {
    file: 'agentic-ai-systems.jpg',
    category: 'AI & Engineering',
    title: 'Agentic AI Systems: Autonomous Agents in Enterprise Software',
    seed: 20260302,
  },
  {
    file: 'smart-contracts-guide.jpg',
    category: 'Blockchain & Web3',
    title: 'Smart Contract Development: ERC Standards, Security & Chainlink VRF',
    seed: 20260303,
  },
]

const card = ({ category, title, seed }) => `<!doctype html>
<style>
  @font-face { font-family: Inter; font-weight: 100 900; font-display: block;
    src: url(${interLatin}) format('woff2'); }
  @font-face { font-family: Inter; font-weight: 100 900; font-display: block;
    src: url(${interExt}) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
      U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }

  html, body { margin: 0; padding: 0; }
  .card {
    position: relative; width: ${W}px; height: ${H}px; overflow: hidden;
    background: #030014; font-family: Inter, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .ring {
    position: absolute; left: 50%; top: ${RING_TOP}px;
    height: ${RING_H}px; width: auto; transform: translateX(-50%) rotate(180deg);
  }
  .stars { position: absolute; inset: 0; }
  .stars i {
    position: absolute; display: block; border-radius: 50%; background: #fff;
  }

  /* Copy block sits below the glow like the OG card's lockup, but ranges
     left: an article title is a sentence, and centred three-line sentences
     read as a poem, not a headline. */
  .content {
    position: absolute; left: 80px; right: 80px; bottom: 0; top: 250px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .category {
    font-size: 22px; font-weight: 600; letter-spacing: 0.18em;
    text-transform: uppercase; color: #CBBFF2;
  }
  .title {
    margin-top: 22px; font-size: 54px; font-weight: 800;
    letter-spacing: -0.015em; line-height: 1.16; color: #fff;
    max-width: 980px;
  }
  .byline {
    margin-top: 34px; display: flex; align-items: center; gap: 16px;
  }
  .byline img { height: 40px; width: auto; }
  .byline .name {
    font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.01em;
  }
  .byline .domain {
    font-size: 17px; font-weight: 500; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(255,255,255,0.34);
    margin-left: 6px;
  }
</style>
<div class="card">
  <img class="ring" src="${blackhole}">
  <div class="stars">${stars(seed, 260)}</div>
  <div class="content">
    <div class="category">${category}</div>
    <div class="title">${title}</div>
    <div class="byline">
      <img src="${logo}">
      <span class="name">M.D.N Tech</span>
      <span class="domain">mdntech.org/blog</span>
    </div>
  </div>
</div>`

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: W, height: H } })

for (const c of CARDS) {
  await page.setContent(card(c))
  await page.evaluate(() => document.fonts.ready)
  const buf = await page
    .locator('.card')
    .screenshot({ type: 'jpeg', quality: 88 })
  writeFileSync(join(OUT, c.file), buf)
  console.log(`${c.file}  ${W}x${H}  ${(buf.length / 1024).toFixed(0)} KB`)
}

await browser.close()

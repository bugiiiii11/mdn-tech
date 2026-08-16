/**
 * Regenerates the link-preview (Open Graph) images.
 *
 *   node scripts/generate-og-images.mjs              -> writes public/
 *   node scripts/generate-og-images.mjs --out=scripts -> preview render
 *
 * One card per locale, 1200x630 (the size Facebook, LinkedIn, Slack, WhatsApp
 * and X all crop from). The composition reproduces the landing hero rather
 * than inventing a second visual language: the same blackhole poster frame,
 * rotated 180 and pushed off the top edge so only the lower arc shows, over
 * the same #030014 field, with the wordmark centred in the dark below the
 * glow -- exactly the fold a visitor lands on after clicking the link.
 *
 * Everything is embedded as data URIs and the fonts are vendored in
 * scripts/assets/, so the render never touches the network and is
 * byte-stable across machines. Stars come from a seeded generator for the
 * same reason: an unseeded Math.random() would churn the PNG on every run
 * and show up as noise in every diff.
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const outArg = process.argv.find((a) => a.startsWith('--out='))
const OUT = join(ROOT, outArg ? outArg.slice(6) : 'public')

const W = 1200
const H = 630

const dataUri = (p, mime) =>
  `data:${mime};base64,${readFileSync(join(ROOT, p)).toString('base64')}`

// The white mark, not the currentColor one: this is a flat PNG render, so
// there is no CSS around to inherit a colour from.
const logo = dataUri('public/brand/logo-final-white.svg', 'image/svg+xml')
const blackhole = dataUri('public/videos/blackhole-poster.webp', 'image/webp')
const interLatin = dataUri('scripts/assets/inter-latin.woff2', 'font/woff2')
const interExt = dataUri('scripts/assets/inter-latin-ext.woff2', 'font/woff2')

/**
 * Ring size comes from the lg tier in components/main/hero-shell.ts (810px
 * tall on a 1440px viewport), scaled to this canvas so the arc's thickness
 * matches the real fold instead of being eyeballed.
 *
 * The vertical offset deliberately does NOT follow the hero. The poster is
 * symmetrical about its accretion disk, so parking that disk exactly on the
 * top edge crops the upper half of the ring away and leaves only the lower
 * bowl -- a cleaner silhouette at thumbnail size than the hero's framing,
 * which lets a slice of the upper arc peek in and reads as a smudge once a
 * chat client downscales the card.
 */
const RING_H = Math.round(810 * (W / 1440)) // 675
const RING_TOP = -Math.round(RING_H / 2) // disk line flush with the top edge

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

/**
 * The starfield the R3F canvas draws at runtime, frozen into markup. Density
 * is deliberately lowest near the top: that is where the glow sits, and stars
 * competing with it read as JPEG noise once a chat client downscales the card.
 */
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

const CARDS = [
  {
    file: 'og-image.png',
    subtitle: 'Grow Your Business with AI.',
    seed: 20260817,
  },
  {
    file: 'og-image-sk.png',
    subtitle: 'Expandujte svoj biznis online.',
    seed: 20260818,
  },
]

const card = ({ subtitle, seed }) => `<!doctype html>
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

  /* Ring first, so the star layer above it can twinkle through the falloff. */
  .ring {
    position: absolute; left: 50%; top: ${RING_TOP}px;
    height: ${RING_H}px; width: auto; transform: translateX(-50%) rotate(180deg);
  }
  .stars { position: absolute; inset: 0; }
  .stars i {
    position: absolute; display: block; border-radius: 50%; background: #fff;
  }

  /* Content sits below the glow's reach, mirroring the hero's copy block.
     Cropping the ring at the disk line pulled the glow ~50px up the canvas,
     so the block follows it -- otherwise the gap opens into dead space and
     the card reads bottom-heavy. */
  .content {
    position: absolute; left: 0; right: 0; bottom: 0; top: 265px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
  }
  .lockup { display: flex; align-items: center; gap: 26px; }
  /* Sized by height, width free: the mark is ~1.7:1, so pinning both axes
     would squash it. Set well above the wordmark's cap height on purpose --
     the mark is mostly negative space and reads small when matched to it. */
  .lockup img { height: 84px; width: auto; }
  .wordmark {
    font-size: 68px; font-weight: 800; letter-spacing: -0.01em; color: #fff;
    line-height: 1;
  }
  .subtitle {
    margin-top: 30px; font-size: 32px; font-weight: 500; letter-spacing: -0.01em;
    color: #CBBFF2;
  }
  .domain {
    margin-top: 34px; font-size: 19px; font-weight: 500; letter-spacing: 0.16em;
    text-transform: uppercase; color: rgba(255,255,255,0.34);
  }
</style>
<div class="card">
  <img class="ring" src="${blackhole}">
  <div class="stars">${stars(seed, 260)}</div>
  <div class="content">
    <div class="lockup">
      <img src="${logo}">
      <div class="wordmark">M.D.N Tech</div>
    </div>
    <div class="subtitle">${subtitle}</div>
    <div class="domain">mdntech.org</div>
  </div>
</div>`

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: W, height: H } })

for (const c of CARDS) {
  await page.setContent(card(c))
  await page.evaluate(() => document.fonts.ready)
  const buf = await page.locator('.card').screenshot({ type: 'png' })
  writeFileSync(join(OUT, c.file), buf)
  console.log(`${c.file}  ${W}x${H}  ${(buf.length / 1024).toFixed(0)} KB`)
}

await browser.close()

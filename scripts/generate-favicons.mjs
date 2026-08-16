/**
 * Regenerates the site-wide favicon set from public/logo.png.
 *
 *   node scripts/generate-favicons.mjs
 *
 * The favicon is the site logo, white, on a near-black rounded tile. The tile
 * is the whole point: a transparent favicon inherits the browser's tab strip,
 * so a dark mark disappears in light chrome and a light mark disappears in
 * dark chrome. Baking the background in makes the icon read identically
 * everywhere, at the cost of looking like an app tile -- which at 16 px is a
 * feature, since the silhouette of the tile itself aids recognition.
 *
 * Outputs land in app/ as Next.js file-convention icons, so every route in the
 * app inherits them from the root layout -- mdntech.org, app.mdntech.org
 * (/portal) and admin.mdntech.org (/command-center) alike. Do NOT re-add an
 * `icons` block to config/index.ts: it would not replace these, only append a
 * second competing <link>.
 *
 * When launch-plan task C7 swaps public/logo.png for the redrawn mark from
 * public/brand/, re-run this and the favicon follows automatically.
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const BG = '#0A0912' // near-black, the site's Event Horizon backdrop rather than flat #000
const RADIUS = 0.22 // fraction of canvas -- matches the iOS/Android tile idiom
const LOGO = 0.84 // logo box as a fraction of canvas; below ~0.8 the mark reads small at 16 px

const logo = `data:image/png;base64,${readFileSync(join(ROOT, 'public/logo.png')).toString('base64')}`

const TARGETS = [
  // 32 covers the 16 px tab slot (browsers downscale it) and the 32 px bookmark slot.
  { file: 'app/icon.png', size: 32, rounded: true },
  // Bookmark tiles, Android home screen, PWA install prompt.
  { file: 'app/icon1.png', size: 192, rounded: true },
  // iOS home screen. Deliberately a full-bleed square: iOS applies its own
  // squircle mask, so shipping our own rounded corners would either double up
  // or leave the mask clipping into the artwork.
  { file: 'app/apple-icon.png', size: 180, rounded: false },
]

const tile = (size, rounded) => `<!doctype html>
<style>html,body{margin:0;padding:0;background:transparent}</style>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rounded ? size * RADIUS : 0}" fill="${BG}"/>
  <image href="${logo}"
         x="${(size * (1 - LOGO)) / 2}" y="${(size * (1 - LOGO)) / 2}"
         width="${size * LOGO}" height="${size * LOGO}"/>
</svg>`

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()

for (const { file, size, rounded } of TARGETS) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(tile(size, rounded))
  // omitBackground or the page's white paints INTO the rounded corners, which
  // is what shipped the first time -- white notches on every tab.
  const buf = await page.screenshot({ type: 'png', omitBackground: true })
  writeFileSync(join(ROOT, file), buf)
  console.log(`${file}  ${size}x${size}  ${buf.length} B`)
}

await browser.close()

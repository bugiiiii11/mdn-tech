// Dev-only: capture above-the-fold screenshots of the live client sites for the
// /sk "Realizácie" section. Drives the locally-installed Chrome via Playwright's
// `channel` option (no Chromium download needed). Output: public/portfolio/*.jpg
//
//   node scripts/capture-portfolio.mjs
//
// next/image re-encodes these JPEGs to webp/avif at serve time, so JPEG source
// keeps the repo light while delivery stays modern-format.

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../public/portfolio");

const sites = [
  { name: "kurenieturiec", url: "https://kurenieturiec.sk" },
  { name: "royalstroje", url: "https://royalstroje.sk" },
  { name: "royalworks", url: "https://royalworks.sk" },
  { name: "goodhairbyzane", url: "https://goodhairbyzane.com" },
];

const VIEWPORT = { width: 1280, height: 800 };

// Cookie banners sit on top of the hero and would end up baked into the card
// preview. Decline (never accept — we do not want to opt these captures into
// the client's analytics), then let the banner animate out.
const CONSENT_LABELS = [
  "Odmietnuť",
  "Odmietam",
  "Iba nevyhnutné",
  "Len nevyhnutné",
  "Decline",
  "Reject all",
  "Reject",
];

async function dismissConsent(page) {
  for (const label of CONSENT_LABELS) {
    const button = page.getByRole("button", { name: label, exact: false }).first();
    try {
      if (await button.isVisible({ timeout: 500 })) {
        await button.click({ timeout: 2000 });
        await page.waitForTimeout(800);
        return label;
      }
    } catch {}
  }
  return null;
}

// optional CLI filter: `node scripts/capture-portfolio.mjs kurenieturiec`
const only = process.argv[2];

async function run() {
  await mkdir(outDir, { recursive: true });

  const targets = only ? sites.filter((s) => s.name === only) : sites;

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // crisp on retina cards
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  });

  for (const site of targets) {
    const page = await context.newPage();
    const outFile = path.join(outDir, `${site.name}.jpg`);
    try {
      await page.goto(site.url, { waitUntil: "load", timeout: 45000 });
      // some sites lazy-load / fade-in above-the-fold on scroll — nudge to
      // trigger IntersectionObserver + lazy images, then return to top.
      try {
        await page.waitForLoadState("networkidle", { timeout: 15000 });
      } catch {}
      const declined = await dismissConsent(page);
      await page.evaluate(() => window.scrollTo(0, 600));
      await page.waitForTimeout(1200);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(3500);
      // Chat bubbles load late and float over the bottom-right corner.
      await page.addStyleTag({
        content: `
          [class*="chat-widget"], [id*="chat-widget"],
          [class*="chatkit"], [id*="chatkit"],
          [class*="smartsupp"], [id*="smartsupp"],
          [class*="tawk"], [id*="tawk"] { display: none !important; }
        `,
      });
      await page.waitForTimeout(400);
      await page.screenshot({
        path: outFile,
        type: "jpeg",
        quality: 82,
        clip: { x: 0, y: 0, ...VIEWPORT },
      });
      console.log(
        `✓ ${site.name} -> ${outFile}${declined ? ` (consent: "${declined}")` : ""}`
      );
    } catch (err) {
      console.error(`✗ ${site.name} (${site.url}): ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

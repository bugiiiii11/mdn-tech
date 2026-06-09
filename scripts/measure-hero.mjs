// Dev-only: measure the hero container + blackhole video geometry on EN (/) vs
// SK (/sk) at several mobile widths, so we can match the SK blackhole position
// to the EN home. Drives system Chrome via Playwright `channel`.
//
//   node scripts/measure-hero.mjs
//
// Reads from the local dev server (PORT env or 3000).

import { chromium } from "playwright";

const PORT = process.env.PORT || "3000";
const BASE = `http://localhost:${PORT}`;

const widths = [360, 390, 414];

async function measure(page, url, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`${BASE}${url}`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(800);
  return page.evaluate(() => {
    const hero =
      document.querySelector("#home") || document.querySelector("#domov");
    const video = hero ? hero.querySelector("video") : null;
    const content = hero ? hero.querySelector("[class*='min-h-']") : null;
    const r = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        top: Math.round(b.top),
        bottom: Math.round(b.bottom),
        height: Math.round(b.height),
      };
    };
    return { hero: r(hero), video: r(video), content: r(content) };
  });
}

async function run() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  for (const w of widths) {
    const en = await measure(page, "/", w);
    const sk = await measure(page, "/sk", w);
    console.log(`\n=== width ${w}px ===`);
    console.log("EN hero   :", JSON.stringify(en.hero), "video:", JSON.stringify(en.video));
    console.log("SK hero   :", JSON.stringify(sk.hero), "video:", JSON.stringify(sk.video));
    console.log("EN content:", JSON.stringify(en.content));
    console.log("SK content:", JSON.stringify(sk.content));
  }
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

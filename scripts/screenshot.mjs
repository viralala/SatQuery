// Capture full-resolution section screenshots for design review.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = process.argv[2] || "./shots";
const WIDTH = Number(process.argv[3] || 1440);
const HEIGHT = Number(process.argv[4] || 900);
const ONLY = process.argv[5];

const SECTIONS = [
  ["01-hero", "#top"],
  ["02-console", "#console"],
  ["03-problem", "#problem"],
  ["04-reveal", "#reveal"],
  ["05-agent", "#agent"],
  ["06-routing", "#routing"],
  ["07-multimodal", "#multimodal"],
  ["08-temporal", "#temporal"],
  ["09-evidence", "#evidence"],
  ["10-capabilities", "#capabilities"],
  ["11-applications", "#applications"],
  ["12-demo", "#demo"],
  ["13-why", "#why"],
  ["14-builtfor", "#builtfor"],
  ["15-scopes", "#scopes"],
  ["16-technical", "#technical"],
  ["17-cta", "#cta"],
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});

page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE:", m.text());
});

await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);

// Walk the whole page once so every IntersectionObserver reveal has fired.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.6;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 90));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
});

const list = ONLY ? SECTIONS.filter(([n]) => n.includes(ONLY)) : SECTIONS;

for (const [name, sel] of list) {
  const el = await page.$(sel);
  if (!el) {
    console.log("missing", sel);
    continue;
  }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const box = await el.boundingBox();
  // Cap very tall sections so the review image stays legible.
  const h = Math.min(box.height, 1700);
  await page.screenshot({
    path: `${OUT}/${name}.png`,
    clip: { x: 0, y: box.y, width: WIDTH, height: h },
  });
  console.log("shot", name, Math.round(box.height));
}

await browser.close();
console.log("done");

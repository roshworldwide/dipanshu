import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.screenshot({ path: "/tmp/vc-hero.png" });

// Step-scroll so IntersectionObserver reveals fire, capturing each section.
const ids = [
  "manifesto",
  "vision",
  "philosophy",
  "depth",
  "team",
  "work",
  "closing",
  "inquiry",
];
for (const id of ids) {
  await page.evaluate((sid) => {
    document.getElementById(sid)?.scrollIntoView({ block: "center" });
  }, id);
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `/tmp/vc-${id}.png` });
}

console.log("CONSOLE ERRORS:", errors.length ? errors.slice(0, 12) : "none");
await browser.close();

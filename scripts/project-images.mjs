/**
 * Captures each project's live site and builds its portfolio images:
 *   public/work/<slug>/cover.jpg      hero in a browser frame on a brand backdrop (1600×1000)
 *   public/work/<slug>/screen-0N.jpg  real sections of the site, for the case study
 *
 *   npm run project-images            # all projects
 *   npm run project-images -- keyflo   # just one
 *
 * Uses your installed Google Chrome through puppeteer-core (no browser download).
 * Cookie banners are declined, floating chat widgets are hidden, and every shot
 * is taken after scrolling to it, so scroll-triggered sections have rendered.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const VIEWPORT = { width: 1440, height: 900, deviceScaleFactor: 2 }; // shots are 2880×1800

/**
 * Each shot is placed either by `anchor` (text of the section heading, scrolled
 * to sit `offset` px below the top, clear of the site's fixed nav) or by `y`.
 * `crop` (optional) is in shot pixels (2×); screens may be any shape, since
 * case-study figures read their size from the file. `ready` waits (up to 8s)
 * for page text to match, e.g. for a typing animation to finish a phrase.
 */
const projects = {
  fabricbloc: {
    url: "https://fabricbloc.com",
    backdrop: ["#1b1420", "#0f0f12"],
    shots: [
      { y: 0, out: "cover" },
      { anchor: "Two ways in.", out: "screen-01" },
      { anchor: "The layer between your app", out: "screen-02" },
      { anchor: "The same stack, exposed to agents", out: "screen-03" },
    ],
  },
  bloclabs: {
    url: "https://bloclabs.com",
    backdrop: ["#2a0c19", "#0b0b0d"],
    shots: [
      { y: 0, out: "cover" },
      { anchor: "What Blockchain Projects Has BlocLabs Delivered?", out: "screen-01" },
      { anchor: "How Does BlocLabs Build", out: "screen-02" },
      { anchor: "Core Values Driving", out: "screen-03" },
    ],
  },
  keyflo: {
    url: "https://keyflo.app",
    backdrop: ["#3a1a0c", "#0d0d0f"],
    shots: [
      { y: 0, out: "cover" },
      {
        anchor: "Money shouldn",
        offset: 170,
        out: "screen-01",
        crop: { left: 0, top: 0, width: 2880, height: 1700 },
      },
      {
        anchor: "How do I get started",
        offset: 170,
        out: "screen-02",
        crop: { left: 0, top: 0, width: 2880, height: 1300 },
      },
      { y: 0, out: "screen-03", crop: { left: 1480, top: 260, width: 1140, height: 1240 } },
    ],
  },
  viewfi: {
    url: "https://viewfi.io",
    backdrop: ["#2a1035", "#0b1426"],
    shots: [
      { y: 0, out: "cover", ready: "Attention\\.\\s*Your (Data|Terms|Rules)\\." },
      {
        anchor: "Step 1: Watch Video Content",
        offset: 200,
        out: "screen-01",
        crop: { left: 0, top: 0, width: 2880, height: 1520 },
      },
      { anchor: "Engaging Rewarded Ad Formats", out: "screen-02" },
      {
        anchor: "Roblox UGC",
        offset: 200,
        out: "screen-03",
        crop: { left: 0, top: 0, width: 2880, height: 1150 },
      },
    ],
  },
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Scroll position that puts the deepest element starting with `text` at `offset` px from the top. */
async function anchorY(page, text, offset = 110) {
  const top = await page.evaluate((t) => {
    const matches = [...document.querySelectorAll("body *")].filter((el) =>
      el.textContent.trim().startsWith(t),
    );
    const deepest = matches.find(
      (el) => ![...el.children].some((c) => c.textContent.trim().startsWith(t)),
    );
    return deepest ? deepest.getBoundingClientRect().top + window.scrollY : null;
  }, text);
  if (top === null) throw new Error(`Anchor not found: "${text}"`);
  return Math.max(0, Math.round(top - offset));
}

async function capture(page, y, ready) {
  const from = await page.evaluate(() => window.scrollY);
  const step = y >= from ? 400 : -400;
  for (let v = from; step > 0 ? v < y : v > y; v += step) {
    await page.evaluate((p) => window.scrollTo(0, p), v);
    await wait(120);
  }
  await page.evaluate((p) => window.scrollTo(0, p), y);
  await wait(1600);
  if (ready) {
    await page
      .waitForFunction(
        (src) => new RegExp(src).test(document.body.innerText),
        { timeout: 8000, polling: 50 },
        ready,
      )
      .catch(() => console.warn("  (ready text not seen; capturing anyway)"));
  }
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body *")) {
      if (getComputedStyle(el).position !== "fixed") continue;
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight * 0.6 && r.left > innerWidth * 0.7 && r.width < 420)
        el.style.visibility = "hidden";
    }
  });
  return page.screenshot({ type: "png" });
}

/** Hero in a browser window with the site's address, bleeding off the bottom of a brand backdrop. */
async function cover(shot, { url, backdrop: [glow, base] }) {
  const W = 1600,
    H = 1000,
    x = 110,
    y = 96,
    w = W - 2 * x,
    bar = 46;
  const domain = new URL(url).hostname;
  const frame = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><radialGradient id="g" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="${glow}"/><stop offset="1" stop-color="${base}"/></radialGradient>
    <filter id="s"><feGaussianBlur stdDeviation="28"/></filter></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="${x + 20}" y="${y + 40}" width="${w - 40}" height="${H}" rx="22" fill="#000" opacity="0.55" filter="url(#s)"/>
    <rect x="${x}" y="${y}" width="${w}" height="${H}" rx="18" fill="#1d1d21" stroke="#ffffff" stroke-opacity="0.12"/>
    <circle cx="${x + 26}" cy="${y + bar / 2}" r="6.5" fill="#ff5f57"/><circle cx="${x + 48}" cy="${y + bar / 2}" r="6.5" fill="#febc2e"/><circle cx="${x + 70}" cy="${y + bar / 2}" r="6.5" fill="#28c840"/>
    <rect x="${W / 2 - 170}" y="${y + 10}" width="340" height="26" rx="13" fill="#ffffff" fill-opacity="0.08"/>
    <text x="${W / 2}" y="${y + 28}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#ffffff" fill-opacity="0.75">${domain}</text>
  </svg>`;
  const page = await sharp(shot).resize(w).toBuffer();
  return sharp(Buffer.from(frame))
    .composite([{ input: page, left: x, top: y + bar }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
}

async function screen(shot, crop) {
  const image = crop ? sharp(shot).extract(crop) : sharp(shot);
  return image
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

const only = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});
try {
  for (const [slug, project] of Object.entries(projects)) {
    if (only.length && !only.includes(slug)) continue;
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    await page.goto(project.url, { waitUntil: "networkidle2", timeout: 60_000 });
    await wait(1500);
    await page.evaluate(() => {
      const labels = ["reject all", "decline", "reject", "deny"];
      [...document.querySelectorAll("button, a")]
        .find((el) => labels.includes(el.textContent.trim().toLowerCase()))
        ?.click();
    });
    const dir = join("public", "work", slug);
    mkdirSync(dir, { recursive: true });
    for (const shot of project.shots) {
      const y = shot.anchor ? await anchorY(page, shot.anchor, shot.offset) : shot.y;
      const png = await capture(page, y, shot.ready);
      const out = shot.out === "cover" ? await cover(png, project) : await screen(png, shot.crop);
      await sharp(out).toFile(join(dir, `${shot.out}.jpg`));
      console.log("wrote", join(dir, `${shot.out}.jpg`));
    }
    await page.close();
  }
} finally {
  await browser.close();
}

/**
 * Prints design/cv/cv.html to public/Taimur-Abid-CV.pdf with the installed
 * Google Chrome (the same engine the original CV was made with).
 *
 *   npm run cv
 */
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const source = pathToFileURL(resolve("design/cv/cv.html")).href;
const output = resolve("public/Taimur-Abid-CV.pdf");

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  const page = await browser.newPage();
  await page.goto(source, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready); // Lora must be loaded before printing
  await page.pdf({
    path: output,
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log("wrote", output);
} finally {
  await browser.close();
}

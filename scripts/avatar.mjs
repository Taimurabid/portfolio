/**
 * Generates the avatar options from SVG (project images come from
 * scripts/project-images.mjs, which screenshots the live sites).
 *
 *   npm run avatar            # only writes files that don't exist yet
 *   npm run avatar -- --force # overwrites the options and public/avatar.jpg
 *
 * Options go to design/avatar-options/; option A is used as public/avatar.jpg.
 */
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const force = process.argv.includes("--force");
const ORANGE = "#ee6a1f";

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

// Solid letterforms on a 160px cap height: T plus a flat-topped A with a counter.
const TA = (color) =>
  `<g fill="${color}" transform="translate(-8 0)"><rect x="96" y="140" width="130" height="34"/><rect x="144" y="140" width="34" height="160"/><path fill-rule="evenodd" d="M282 140H314L360 300H325L315.2 266H280.8L271 300H236ZM289.4 236H306.6L298 206Z"/></g>`;

/** Two monograms and an abstract design + code mark. */
const avatars = {
  "a-monogram-orange": svg(
    440,
    440,
    `<rect width="440" height="440" fill="${ORANGE}"/>${TA("#ffffff")}`,
  ),
  "b-monogram-ink": svg(440, 440, `<rect width="440" height="440" fill="#1e1c1a"/>${TA(ORANGE)}`),
  "c-design-code": svg(
    440,
    440,
    `<rect width="440" height="440" fill="#eeece8"/><circle cx="178" cy="220" r="104" fill="${ORANGE}"/><rect x="196" y="116" width="166" height="208" rx="26" fill="#1e1c1a"/><path d="M252 186 L224 220 L252 254 M306 186 L334 220 L306 254" fill="none" stroke="#f5f3ef" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`,
  ),
};

async function write(file, markup, format) {
  if (existsSync(file) && !force) return console.log("skipped (exists)", file);
  const image = sharp(Buffer.from(markup));
  await (format === "png" ? image.png() : image.jpeg({ quality: 84, mozjpeg: true })).toFile(file);
  console.log("wrote", file);
}

mkdirSync(join("design", "avatar-options"), { recursive: true });
for (const [name, markup] of Object.entries(avatars)) {
  await write(join("design", "avatar-options", `${name}.png`), markup, "png");
}
await write(join("public", "avatar.jpg"), avatars["a-monogram-orange"], "jpg");

/**
 * Generates placeholder images in public/work/<slug>/ for every case study.
 * Existing files are never overwritten, so real screenshots are safe.
 *
 *   npm run placeholders
 */
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTH = 1600;
const HEIGHT = 1000;

const projects = {
  fabricbloc: { name: "FabricBloc", hue: "#2f3a4a" },
  bloclabs: { name: "BlocLabs", hue: "#3d2f4a" },
  key3: { name: "Key3", hue: "#2f4a40" },
  viewfi: { name: "ViewFi", hue: "#4a382f" },
};

const files = [
  { file: "cover.jpg", label: "Cover" },
  { file: "screen-01.jpg", label: "Screen 01" },
  { file: "screen-02.jpg", label: "Screen 02" },
  { file: "screen-03.jpg", label: "Screen 03" },
];

const svg = (name, label, hue) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="100%" height="100%" fill="${hue}"/>
  <rect x="120" y="120" width="${WIDTH - 240}" height="${HEIGHT - 240}" rx="24"
        fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2" stroke-dasharray="12 12"/>
  <text x="50%" y="47%" text-anchor="middle" font-family="Georgia, serif" font-size="112"
        fill="#ffffff" fill-opacity="0.92">${name}</text>
  <text x="50%" y="58%" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="36" letter-spacing="6" fill="#ffffff" fill-opacity="0.6">
    ${label.toUpperCase()} · PLACEHOLDER · ${WIDTH}×${HEIGHT}
  </text>
</svg>`;

for (const [slug, { name, hue }] of Object.entries(projects)) {
  const dir = join("public", "work", slug);
  mkdirSync(dir, { recursive: true });
  for (const { file, label } of files) {
    const out = join(dir, file);
    if (existsSync(out)) continue;
    await sharp(Buffer.from(svg(name, label, hue)))
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(out);
    console.log("created", out);
  }
}

// Avatar placeholder (440×440, flat orange backdrop like the design spec).
const avatar = join("public", "avatar.jpg");
if (!existsSync(avatar)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="440">
    <rect width="100%" height="100%" fill="#ee6a1f"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
          font-family="Helvetica, Arial, sans-serif" font-size="150" font-weight="600"
          letter-spacing="-6" fill="#ffffff">TA</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 80, mozjpeg: true }).toFile(avatar);
  console.log("created", avatar);
}

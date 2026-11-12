/**
 * Generates the project cover illustrations and avatar options from SVG.
 * No text, logos or fake UI data: just themed artwork in the site's palette,
 * so real screenshots can replace any of it later.
 *
 *   npm run artwork            # only writes files that don't exist yet
 *   npm run artwork -- --force # overwrites covers and public/avatar.jpg
 *
 * Covers keep their focal point in the middle ~900px so square-ish crops work.
 * Also writes detail crops of each cover as the case-study screens.
 */
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const force = process.argv.includes("--force");
const W = 1600;
const H = 1000;
const ORANGE = "#ee6a1f";

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

const glow = (id, color, opacity) =>
  `<defs><radialGradient id="${id}" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="${color}" stop-opacity="${opacity}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#${id})"/>`;

/** FabricBloc: a woven grid of blocks, one chain of them linked in orange. */
function fabricbloc() {
  const size = 110,
    gap = 26,
    cols = 6,
    rows = 4;
  const x0 = (W - (cols * size + (cols - 1) * gap)) / 2;
  const y0 = (H - (rows * size + (rows - 1) * gap)) / 2;
  const chain = [
    [0, 3],
    [1, 2],
    [2, 2],
    [3, 1],
    [4, 1],
    [5, 0],
  ];
  const center = ([c, r]) => [x0 + c * (size + gap) + size / 2, y0 + r * (size + gap) + size / 2];
  let cells = "";
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      cells += `<rect x="${x0 + c * (size + gap)}" y="${y0 + r * (size + gap)}" width="${size}" height="${size}" rx="18" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>`;
  const line = chain
    .map(center)
    .map(([x, y]) => `${x},${y}`)
    .join(" ");
  const blocks = chain
    .map(([c, r], i) => {
      const x = x0 + c * (size + gap),
        y = y0 + r * (size + gap);
      const last = i === chain.length - 1;
      return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="18" fill="${last ? ORANGE : "#33425c"}"/><rect x="${x + 16}" y="${y + 16}" width="${size - 32}" height="10" rx="5" fill="#ffffff" fill-opacity="${last ? 0.45 : 0.14}"/>`;
    })
    .join("");
  return svg(
    W,
    H,
    `<rect width="100%" height="100%" fill="#1b2433"/>${glow("g", "#4a6a9a", 0.35)}${cells}<polyline points="${line}" fill="none" stroke="${ORANGE}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>${blocks}`,
  );
}

/** BlocLabs: an abstract website with a hero and CMS-driven cards. */
function bloclabs() {
  const x = 320,
    y = 170,
    w = 960,
    h = 660;
  const card = (i) => {
    const cx = x + 48 + i * 296;
    return `<rect x="${cx}" y="${y + 440}" width="272" height="168" rx="16" fill="#ece8e1"/><rect x="${cx + 18}" y="${y + 458}" width="236" height="76" rx="10" fill="${i === 1 ? ORANGE : "#d9d3ca"}" fill-opacity="${i === 1 ? 0.9 : 1}"/><rect x="${cx + 18}" y="${y + 550}" width="150" height="12" rx="6" fill="#1e1c1a" fill-opacity="0.75"/><rect x="${cx + 18}" y="${y + 572}" width="110" height="10" rx="5" fill="#1e1c1a" fill-opacity="0.25"/>`;
  };
  return svg(
    W,
    H,
    `<rect width="100%" height="100%" fill="#e4dfd6"/>
    <rect x="${x + 14}" y="${y + 22}" width="${w}" height="${h}" rx="26" fill="#1e1c1a" fill-opacity="0.08"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#f7f4ef" stroke="#000" stroke-opacity="0.08" stroke-width="2"/>
    <circle cx="${x + 34}" cy="${y + 30}" r="8" fill="#1e1c1a" fill-opacity="0.18"/><circle cx="${x + 60}" cy="${y + 30}" r="8" fill="#1e1c1a" fill-opacity="0.18"/><circle cx="${x + 86}" cy="${y + 30}" r="8" fill="#1e1c1a" fill-opacity="0.18"/>
    <line x1="${x}" y1="${y + 60}" x2="${x + w}" y2="${y + 60}" stroke="#000" stroke-opacity="0.07" stroke-width="2"/>
    <rect x="${x + 48}" y="${y + 120}" width="430" height="38" rx="10" fill="#1e1c1a"/>
    <rect x="${x + 48}" y="${y + 172}" width="330" height="38" rx="10" fill="#1e1c1a"/>
    <rect x="${x + 48}" y="${y + 236}" width="380" height="14" rx="7" fill="#1e1c1a" fill-opacity="0.3"/>
    <rect x="${x + 48}" y="${y + 262}" width="300" height="14" rx="7" fill="#1e1c1a" fill-opacity="0.3"/>
    <rect x="${x + 48}" y="${y + 312}" width="170" height="52" rx="26" fill="${ORANGE}"/>
    <circle cx="${x + 720}" cy="${y + 230}" r="120" fill="${ORANGE}"/>
    <rect x="${x + 640}" y="${y + 190}" width="180" height="180" rx="28" fill="#1e1c1a" transform="rotate(12 ${x + 730} ${y + 280})"/>
    <rect x="${x + 680}" y="${y + 230}" width="100" height="100" rx="18" fill="#f7f4ef" fill-opacity="0.92" transform="rotate(12 ${x + 730} ${y + 280})"/>
    ${[0, 1, 2].map(card).join("")}`,
  );
}

/** Key3: a phone keyboard with an orange "send" key and a crypto coin in the chat. */
function key3() {
  const px = 600,
    py = 90,
    pw = 400,
    ph = 820;
  let keys = "";
  const rows = [10, 9, 7];
  rows.forEach((n, r) => {
    const kw = 30,
      gap = 6,
      rowW = n * kw + (n - 1) * gap;
    for (let i = 0; i < n; i++)
      keys += `<rect x="${px + (pw - rowW) / 2 + i * (kw + gap)}" y="${py + 560 + r * 54}" width="${kw}" height="44" rx="7" fill="#ffffff" fill-opacity="0.13"/>`;
  });
  return svg(
    W,
    H,
    `<rect width="100%" height="100%" fill="#1b3a30"/>${glow("g", "#3f8a6c", 0.35)}
    <rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="58" fill="#0e211b" stroke="#ffffff" stroke-opacity="0.14" stroke-width="3"/>
    <rect x="${px + 160}" y="${py + 22}" width="80" height="10" rx="5" fill="#ffffff" fill-opacity="0.18"/>
    <rect x="${px + 32}" y="${py + 90}" width="220" height="56" rx="22" fill="#ffffff" fill-opacity="0.12"/>
    <rect x="${px + 32}" y="${py + 160}" width="170" height="56" rx="22" fill="#ffffff" fill-opacity="0.12"/>
    <rect x="${px + 120}" y="${py + 250}" width="248" height="150" rx="26" fill="${ORANGE}"/>
    <circle cx="${px + 184}" cy="${py + 325}" r="38" fill="#ffffff" fill-opacity="0.95"/>
    <circle cx="${px + 184}" cy="${py + 325}" r="22" fill="none" stroke="${ORANGE}" stroke-width="7"/>
    <rect x="${px + 240}" y="${py + 300}" width="100" height="14" rx="7" fill="#ffffff" fill-opacity="0.9"/>
    <rect x="${px + 240}" y="${py + 326}" width="70" height="12" rx="6" fill="#ffffff" fill-opacity="0.55"/>
    <defs><clipPath id="phone"><rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="58"/></clipPath></defs>
    <rect x="${px}" y="${py + 520}" width="${pw}" height="${ph - 520}" fill="#ffffff" fill-opacity="0.04" clip-path="url(#phone)"/>
    ${keys}
    <rect x="${px + 112}" y="${py + 722}" width="120" height="44" rx="7" fill="#ffffff" fill-opacity="0.13"/>
    <rect x="${px + 244}" y="${py + 722}" width="88" height="44" rx="7" fill="${ORANGE}"/>
    <path d="M${px + 276} ${py + 744} h24 m-9 -9 l9 9 l-9 9" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
  );
}

/** ViewFi: a video frame with a play button and reward tokens floating around it. */
function viewfi() {
  const x = 370,
    y = 258,
    w = 860,
    h = 484;
  const coin = (cx, cy, r) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${ORANGE}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.62}" fill="none" stroke="#ffffff" stroke-opacity="0.75" stroke-width="${Math.max(r * 0.12, 3)}"/>`;
  const spark = (cx, cy, s) =>
    `<path d="M${cx} ${cy - s} Q${cx} ${cy} ${cx + s} ${cy} Q${cx} ${cy} ${cx} ${cy + s} Q${cx} ${cy} ${cx - s} ${cy} Q${cx} ${cy} ${cx} ${cy - s}Z" fill="#ffffff" fill-opacity="0.85"/>`;
  return svg(
    W,
    H,
    `<rect width="100%" height="100%" fill="#33242e"/>${glow("g", "#a0526e", 0.4)}
    <defs><linearGradient id="v" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a3446"/><stop offset="1" stop-color="#211820"/></linearGradient></defs>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="url(#v)" stroke="#ffffff" stroke-opacity="0.12" stroke-width="2"/>
    <circle cx="${x + w / 2}" cy="${y + h / 2 - 10}" r="64" fill="#ffffff"/>
    <path d="M${x + w / 2 - 18} ${y + h / 2 - 44} L${x + w / 2 + 30} ${y + h / 2 - 10} L${x + w / 2 - 18} ${y + h / 2 + 24}Z" fill="#33242e"/>
    <rect x="${x + 40}" y="${y + h - 46}" width="${w - 80}" height="8" rx="4" fill="#ffffff" fill-opacity="0.2"/>
    <rect x="${x + 40}" y="${y + h - 46}" width="${(w - 80) * 0.42}" height="8" rx="4" fill="${ORANGE}"/>
    <circle cx="${x + 40 + (w - 80) * 0.42}" cy="${y + h - 42}" r="10" fill="#ffffff"/>
    ${coin(x + w - 30, y + 20, 46)}${coin(x + w + 60, y + 140, 28)}${coin(x - 20, y + 120, 34)}${coin(x + w - 140, y - 40, 22)}
    ${spark(x + w + 30, y + 30, 18)}${spark(x + 60, y - 30, 14)}${spark(x - 50, y + 230, 12)}`,
  );
}

/** Avatar options: two monograms and an abstract design + code mark. */
// Solid letterforms on a 160px cap height: T plus a flat-topped A with a counter.
const TA = (color) =>
  `<g fill="${color}" transform="translate(-8 0)"><rect x="96" y="140" width="130" height="34"/><rect x="144" y="140" width="34" height="160"/><path fill-rule="evenodd" d="M282 140H314L360 300H325L315.2 266H280.8L271 300H236ZM289.4 236H306.6L298 206Z"/></g>`;
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

/** Detail crops of a cover (same art, zoomed), used until real screens exist. */
const crops = [
  [260, 140, 840, 525],
  [620, 330, 800, 500],
  [420, 230, 760, 475],
];
const crop = (markup, [x, y, w, h]) =>
  markup
    .replace(`viewBox="0 0 ${W} ${H}"`, `viewBox="${x} ${y} ${w} ${h}"`)
    // "100%" backgrounds only cover the viewBox from 0,0; pin them to the full canvas.
    .replaceAll('width="100%" height="100%"', `width="${W}" height="${H}"`);

async function write(file, markup, format) {
  if (existsSync(file) && !force) return console.log("skipped (exists)", file);
  const image = sharp(Buffer.from(markup));
  await (format === "png" ? image.png() : image.jpeg({ quality: 84, mozjpeg: true })).toFile(file);
  console.log("wrote", file);
}

for (const [slug, draw] of Object.entries({ fabricbloc, bloclabs, key3, viewfi })) {
  mkdirSync(join("public", "work", slug), { recursive: true });
  const cover = draw();
  await write(join("public", "work", slug, "cover.jpg"), cover, "jpg");
  for (const [i, region] of crops.entries()) {
    await write(join("public", "work", slug, `screen-0${i + 1}.jpg`), crop(cover, region), "jpg");
  }
}

mkdirSync(join("design", "avatar-options"), { recursive: true });
for (const [name, markup] of Object.entries(avatars)) {
  await write(join("design", "avatar-options", `${name}.png`), markup, "png");
}
await write(join("public", "avatar.jpg"), avatars["a-monogram-orange"], "jpg");

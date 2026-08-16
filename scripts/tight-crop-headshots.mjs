import sharp from "sharp";
// Every source is a social-media post with a round-cropped photo on a decorated
// background. Extract only the person (face + shoulders) so no baked-in border,
// dot pattern or dark corner shows through the full-bleed square in the quote
// slider. All outputs are portrait 500×600.
const SOCIAL = "/Users/georgevernon/Library/Mobile Documents/com~apple~CloudDocs/Social media posts";
const OUT = "/Users/georgevernon/gv-results-page/public/images";

const jobs = [
  // Matt/Sanchia/Darren sources are 350×350 social posts.
  { in: `${OUT}/../../scripts/_source-matt.png`, orig: `${OUT}/headshot-matt-hadman.webp`,
    out: `${OUT}/headshot-matt-hadman.webp`, extract: { left: 60, top: 20, width: 220, height: 265 } },
  { in: `${OUT}/../../scripts/_source-sanchia.png`, orig: `${OUT}/headshot-sanchia.webp`,
    out: `${OUT}/headshot-sanchia.webp`, extract: { left: 55, top: 12, width: 220, height: 270 } },
  { in: `${OUT}/../../scripts/_source-darren.png`, orig: `${OUT}/headshot-darren.webp`,
    out: `${OUT}/headshot-darren.webp`, extract: { left: 55, top: 12, width: 220, height: 265 } },
  // Rob/Steve/Ben sources are 1280×720 banners with round photo on the left.
  { in: `${SOCIAL}/Copy of Rob.png`, out: `${OUT}/rob-allen-pugh.webp`,
    extract: { left: 155, top: 90, width: 210, height: 260 } },
  { in: `${SOCIAL}/Steve.png`, out: `${OUT}/steve-want.webp`,
    extract: { left: 160, top: 65, width: 210, height: 260 } },
  { in: `${SOCIAL}/Steve Want.png`, out: `${OUT}/ben-rutter.webp`,
    extract: { left: 140, top: 55, width: 220, height: 265 } },
];

// For the Matt/Sanchia/Darren case, we already tight-cropped the WebP in a
// previous pass, so the source no longer has the same dimensions as before.
// Fall back to whatever exists and re-crop from that.
import { access } from "node:fs/promises";
async function fileExists(p) { try { await access(p); return true; } catch { return false; } }

for (const j of jobs) {
  let src = j.in;
  if (!(await fileExists(src)) && j.orig && await fileExists(j.orig)) src = j.orig;
  if (!(await fileExists(src))) { console.log("skip (no source):", src); continue; }
  const meta = await sharp(src).metadata();
  console.log(`from ${meta.width}x${meta.height} → ${j.out.split("/").pop()}  extract ${JSON.stringify(j.extract)}`);
  const tmp = j.out + ".tmp";
  await sharp(src)
    .extract(j.extract)
    .resize(500, 600, { fit: "cover" })
    .webp({ quality: 86 })
    .toFile(tmp);
  const { rename } = await import("node:fs/promises");
  await rename(tmp, j.out);
}

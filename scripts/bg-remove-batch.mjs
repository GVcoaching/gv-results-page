#!/usr/bin/env node
// Remove background from portrait photos, then trim, resize to portrait 500x600,
// and write as WebP under /public/images/. Transparent PNG output from
// @imgly/background-removal-node is trimmed to the person's bounding box.
import { removeBackground } from "@imgly/background-removal-node";
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { basename, join } from "node:path";

const SRC = "/tmp/gv-photos";
const OUT = "/Users/georgevernon/gv-results-page/public/images";

// slug map: input file → output stem
const jobs = [
  { in: "matt.png", out: "headshot-matt-hadman" },
  { in: "sanchia.jpg", out: "headshot-sanchia" },
  { in: "darren.png", out: "headshot-darren" },
  { in: "ben.jpg", out: "ben-rutter" },
  { in: "steve.jpg", out: "steve-want" },
  { in: "mani.jpg", out: "mani-konkon" },
  { in: "vish-crutches.jpg", out: "vish-crutches" },
  { in: "andrew.jpg", out: "andrew-thompson" },
  { in: "ian.png", out: "ian-tilley" },
  { in: "jaz.jpg", out: "jaz" },
  { in: "sam.jpg", out: "sam" },
  { in: "reece.png", out: "reece" },
  { in: "lukman.png", out: "lukman" },
  { in: "jacob.png", out: "jacob" },
];

await mkdir(OUT, { recursive: true });

for (const j of jobs) {
  const src = join(SRC, j.in);
  try {
    console.log(`→ ${j.in}`);
    const t0 = Date.now();

    // Remove background
    const blob = await removeBackground(src);
    const arr = await blob.arrayBuffer();
    const buf = Buffer.from(arr);

    // Trim to person bounding box + resize portrait 500x600 + WebP
    // Use extract-and-cover with cover fit so a portrait aspect is guaranteed.
    const trimmed = await sharp(buf).trim({ threshold: 10 }).toBuffer();
    const meta = await sharp(trimmed).metadata();
    const w = meta.width ?? 500;
    const h = meta.height ?? 600;

    // Aim for a 5:6 portrait output. If the trimmed image is wider than 5:6 we
    // pad top/bottom with transparent so no head is cut; if narrower we pad
    // left/right.
    const targetRatio = 500 / 600;
    const curRatio = w / h;
    let padTop = 0, padBottom = 0, padLeft = 0, padRight = 0;
    if (curRatio > targetRatio) {
      // wider — add vertical padding
      const targetH = Math.round(w / targetRatio);
      const extra = targetH - h;
      padTop = Math.round(extra * 0.15); // give a bit more headroom bottom
      padBottom = extra - padTop;
    } else if (curRatio < targetRatio) {
      const targetW = Math.round(h * targetRatio);
      const extra = targetW - w;
      padLeft = Math.floor(extra / 2);
      padRight = extra - padLeft;
    }

    const padded = await sharp(trimmed)
      .extend({
        top: padTop, bottom: padBottom, left: padLeft, right: padRight,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();

    // Composite over the site's beige card colour (#e9e7e2) so the WebP is
    // opaque and blends into .qc-photo's background without alpha edges.
    const outPath = join(OUT, `${j.out}.webp`);
    await sharp(padded)
      .resize(500, 600, { fit: "cover" })
      .flatten({ background: "#e9e7e2" })
      .webp({ quality: 86 })
      .toFile(outPath);

    const dt = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`  ✓ ${outPath.replace(OUT, "")} (${dt}s)`);
  } catch (e) {
    console.error(`  ✗ ${j.in}:`, e.message);
  }
}

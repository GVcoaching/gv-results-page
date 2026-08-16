#!/usr/bin/env node
// Targeted photo fixes:
//   Ben — restore original background (skip bg-removal)
//   Jaz — rotate 180° AND keep original background
//   Andrew — recenter (bg-removed silhouette was offset right)
import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { rename } from "node:fs/promises";

const SRC = "/tmp/gv-photos";
const OUT = "/Users/georgevernon/gv-results-page/public/images";

async function saveOpaquePortrait({ buf, outStem, extract }) {
  let s = sharp(buf);
  if (extract) s = s.extract(extract);
  const meta = await s.clone().metadata();
  const w = meta.width, h = meta.height;
  const targetRatio = 500 / 600;
  const curRatio = w / h;
  let padTop = 0, padBottom = 0, padLeft = 0, padRight = 0;
  if (curRatio > targetRatio) {
    const targetH = Math.round(w / targetRatio);
    const extra = targetH - h;
    padTop = Math.round(extra * 0.15);
    padBottom = extra - padTop;
  } else if (curRatio < targetRatio) {
    const targetW = Math.round(h * targetRatio);
    const extra = targetW - w;
    padLeft = Math.floor(extra / 2);
    padRight = extra - padLeft;
  }
  const tmp = `${OUT}/${outStem}.webp.tmp`;
  await s
    .extend({ top: padTop, bottom: padBottom, left: padLeft, right: padRight, background: { r: 233, g: 231, b: 226, alpha: 1 } })
    .resize(500, 600, { fit: "cover" })
    .webp({ quality: 86 })
    .toFile(tmp);
  await rename(tmp, `${OUT}/${outStem}.webp`);
  console.log(`  ✓ ${outStem}.webp`);
}

// Ben — original photo, no bg removal. Tight crop around him at Real Madrid.
{
  console.log("→ Ben (keep original background)");
  const src = `${SRC}/ben.jpg`;
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  // Ben is centered vertically, take a portrait crop around him
  await saveOpaquePortrait({
    buf: await sharp(src).rotate().toBuffer(),
    outStem: "ben-rutter",
    extract: {
      left: Math.round(w * 0.15),
      top: Math.round(h * 0.15),
      width: Math.round(w * 0.7),
      height: Math.round(h * 0.75),
    },
  });
}

// Jaz — rotate 180°, keep original background, tight crop
{
  console.log("→ Jaz (rotate 180 + keep bg)");
  const src = `${SRC}/jaz.jpg`;
  const rotated = await sharp(src).rotate(180).toBuffer();
  const meta = await sharp(rotated).metadata();
  const w = meta.width, h = meta.height;
  // Landscape source (4032×3024) — take center-right portrait crop (Jaz on
  // one side, George on the other). Portrait aspect focuses on both faces.
  await saveOpaquePortrait({
    buf: rotated,
    outStem: "jaz",
    extract: {
      left: Math.round(w * 0.05),
      top: Math.round(h * 0.05),
      width: Math.round(w * 0.9),
      height: Math.round(h * 0.9),
    },
  });
}

// Andrew — recenter. His current bg-removed output had him offset right,
// so redo with a much tighter crop of just his face+shoulders BEFORE bg
// removal, then bg-remove, then let extend()+cover center him.
{
  console.log("→ Andrew (recenter face)");
  const src = `${SRC}/andrew.jpg`;
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  // Andrew's face is on the right of the frame in the source. Extract that
  // right portion so bg-removal + cover crop centers him.
  const cropped = await sharp(src)
    .rotate()
    .extract({
      left: Math.round(w * 0.4),
      top: Math.round(h * 0.15),
      width: Math.round(w * 0.55),
      height: Math.round(h * 0.75),
    })
    .toBuffer();
  const blob = await removeBackground(cropped);
  const arr = Buffer.from(await blob.arrayBuffer());
  const trimmed = await sharp(arr).trim({ threshold: 10 }).toBuffer();
  const tm = await sharp(trimmed).metadata();
  const tw = tm.width, th = tm.height;
  const targetRatio = 500 / 600;
  const cr = tw / th;
  let pt = 0, pb = 0, pl = 0, pr = 0;
  if (cr > targetRatio) {
    const targetH = Math.round(tw / targetRatio);
    const extra = targetH - th;
    pt = Math.round(extra * 0.1);
    pb = extra - pt;
  } else if (cr < targetRatio) {
    const targetW = Math.round(th * targetRatio);
    const extra = targetW - tw;
    pl = Math.floor(extra / 2);
    pr = extra - pl;
  }
  const outStem = "andrew-thompson";
  const tmp = `${OUT}/${outStem}.webp.tmp`;
  await sharp(trimmed)
    .extend({ top: pt, bottom: pb, left: pl, right: pr, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(500, 600, { fit: "cover" })
    .flatten({ background: "#e9e7e2" })
    .webp({ quality: 86 })
    .toFile(tmp);
  await rename(tmp, `${OUT}/${outStem}.webp`);
  console.log(`  ✓ ${outStem}.webp`);
}

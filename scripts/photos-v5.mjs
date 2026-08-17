#!/usr/bin/env node
// Photo pass v5 targeted tweaks.
import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { writeFile } from "node:fs/promises";
const OUT = "/Users/georgevernon/gv-results-page/public/images";

async function bgRemoveCenter({ src, extract, outStem, fit = "contain", bg = "#ffffff" }) {
  const tmp = `/tmp/gv-photos/_v5-${outStem}.png`;
  const buf = extract
    ? await sharp(src).rotate().extract(extract).png().toBuffer()
    : await sharp(src).rotate().png().toBuffer();
  await writeFile(tmp, buf);
  const blob = await removeBackground(tmp);
  const cutBuf = Buffer.from(await blob.arrayBuffer());
  const trimmed = await sharp(cutBuf).trim({ threshold: 10 }).toBuffer();
  await sharp(trimmed)
    .resize({ width: 500, height: 600, fit, background: bg, position: "center" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/${outStem}.webp`);
  console.log(`  ✓ ${outStem}`);
}

// Steve — recentre via COVER so he fills the frame edge-to-edge
{
  console.log("→ steve-want (cover, centered)");
  await bgRemoveCenter({
    src: "/Users/georgevernon/Library/Mobile Documents/com~apple~CloudDocs/Social media posts/Steve.png",
    extract: { left: 80, top: 40, width: 340, height: 340 },
    outStem: "steve-want",
    fit: "cover",
  });
}

// Andrew — WIDER pre-crop again and use cover so whole face + shoulders fill
{
  console.log("→ andrew-thompson (wider, cover)");
  const src = "/tmp/gv-photos/andrew.jpg";
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  await bgRemoveCenter({
    src,
    extract: {
      left: Math.round(w * 0.22),
      top: Math.round(h * 0.02),
      width: Math.round(w * 0.76),
      height: Math.round(h * 0.96),
    },
    outStem: "andrew-thompson",
    fit: "cover",
  });
}

// Sana — extract wider region and use cover so she fills the card
{
  console.log("→ sana-ali (cover)");
  await bgRemoveCenter({
    src: "/tmp/gv-photos/sana-graphic.png",
    extract: { left: 590, top: 700, width: 460, height: 500 },
    outStem: "sana-ali",
    fit: "cover",
  });
}

// Jaz — even wider so both faces + shoulders visible; keep natural bg, wide 1:1
{
  console.log("→ jaz (wider, natural bg, wide)");
  const src = "/tmp/gv-photos/jaz.jpg";
  const rotated = await sharp(src).rotate(180).toBuffer();
  const meta = await sharp(rotated).metadata();
  const w = meta.width, h = meta.height;
  // Full source 4032x3024 landscape. Take full width, ~85% height centered.
  const cropH = Math.round(h * 0.85);
  const cropW = w;  // full width to show both plus surroundings
  const top = Math.round((h - cropH) / 2);
  await sharp(rotated)
    .extract({ left: 0, top, width: cropW, height: cropH })
    .resize({ width: 700, height: 700, fit: "cover", position: "center" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/jaz.webp`);
  console.log("  ✓ jaz");
}

// Reece — tighter crop around the two of them so the pair fills the frame
{
  console.log("→ reece (tighter, fills frame)");
  const src = "/tmp/gv-photos/reece.png";
  // 1080×1350 source. George + Reece are centered horizontally around x=520
  // and vertically around y=750. Take a tighter portrait crop.
  await sharp(src)
    .extract({ left: 220, top: 380, width: 640, height: 800 })
    .resize({ width: 700, height: 700, fit: "cover", position: "center" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/reece.webp`);
  console.log("  ✓ reece");
}

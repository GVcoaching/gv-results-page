#!/usr/bin/env node
// Photo pass v4:
//   - Regenerate all bg-removed portraits onto white (was beige) so no grey
//     shows in the white .qc-media card
//   - Restore Mani's natural background (no bg-remove)
//   - Andrew wider crop so whole face visible
//   - Process Reece from the marathon photo
import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { writeFile } from "node:fs/promises";

const OUT = "/Users/georgevernon/gv-results-page/public/images";

async function cutAndCenter({ src, extract, outStem, bg = "#ffffff" }) {
  const tmp = `/tmp/gv-photos/_tmp-${outStem}.png`;
  const buf = extract
    ? await sharp(src).rotate().extract(extract).png().toBuffer()
    : await sharp(src).rotate().png().toBuffer();
  await writeFile(tmp, buf);
  const blob = await removeBackground(tmp);
  const cutBuf = Buffer.from(await blob.arrayBuffer());
  const trimmed = await sharp(cutBuf).trim({ threshold: 10 }).toBuffer();
  await sharp(trimmed)
    .resize({ width: 500, height: 600, fit: "contain", background: bg })
    .webp({ quality: 86 })
    .toFile(`${OUT}/${outStem}.webp`);
  console.log(`  ✓ ${outStem}`);
}

// Bg-removed portraits — regenerate on WHITE (not beige)
const jobs = [
  { src: "/tmp/gv-photos/matt.png", stem: "headshot-matt-hadman", extract: null },
  { src: "/tmp/gv-photos/sanchia.jpg", stem: "headshot-sanchia", extract: null },
  { src: "/tmp/gv-photos/darren.png", stem: "headshot-darren", extract: null },
  { src: "/tmp/gv-photos/sana-graphic.png", stem: "sana-ali",
    extract: { left: 605, top: 720, width: 430, height: 460 } },
];
for (const j of jobs) {
  console.log(`→ ${j.stem}`);
  await cutAndCenter({ src: j.src, extract: j.extract, outStem: j.stem, bg: "#ffffff" });
}

// Rob and Steve — also on white
{
  console.log("→ rob-allen-pugh");
  const src = "/tmp/gv-photos/../../Users/georgevernon/Library/Mobile Documents/com~apple~CloudDocs/Social media posts/Copy of Rob.png";
  // Rob source is 1280x720 social banner; extract just the round photo area
  await cutAndCenter({
    src: "/Users/georgevernon/Library/Mobile Documents/com~apple~CloudDocs/Social media posts/Copy of Rob.png",
    extract: { left: 90, top: 65, width: 330, height: 330 },
    outStem: "rob-allen-pugh", bg: "#ffffff",
  });
}
{
  console.log("→ steve-want");
  await cutAndCenter({
    src: "/Users/georgevernon/Library/Mobile Documents/com~apple~CloudDocs/Social media posts/Steve.png",
    extract: { left: 80, top: 45, width: 335, height: 335 },
    outStem: "steve-want", bg: "#ffffff",
  });
}

// Ben-Rutter — already using original bg, redo on WHITE fallback if any
// (Ben photo is landscape sharp attention crop). Skip — leave as-is.

// Andrew — wider pre-crop (show WHOLE face + shoulders) on white
{
  console.log("→ andrew-thompson (wider)");
  const src = "/tmp/gv-photos/andrew.jpg";
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  await cutAndCenter({
    src,
    extract: {
      left: Math.round(w * 0.28),
      top: Math.round(h * 0.05),
      width: Math.round(w * 0.7),
      height: Math.round(h * 0.92),
    },
    outStem: "andrew-thompson", bg: "#ffffff",
  });
}

// Mani — RESTORE natural background (no bg-remove)
{
  console.log("→ mani-konkon (natural bg)");
  const src = "/tmp/gv-photos/mani.jpg";
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  await sharp(src).rotate()
    .extract({
      left: Math.round(w * 0.02),
      top: Math.round(h * 0.02),
      width: Math.round(w * 0.85),
      height: Math.round(h * 0.9),
    })
    .resize({ width: 500, height: 600, fit: "cover" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/mani-konkon.webp`);
  console.log("  ✓ mani-konkon");
}

// Jaz — wider crop so both faces sit centered (already wide)
{
  console.log("→ jaz (wider natural bg)");
  const src = "/tmp/gv-photos/jaz.jpg";
  const rotated = await sharp(src).rotate(180).toBuffer();
  const meta = await sharp(rotated).metadata();
  const w = meta.width, h = meta.height;
  // Wider portion so both faces fit; use as 1:1 output for the wide slot
  const cropH = Math.round(h * 0.85);
  const cropW = Math.min(w, Math.round(cropH * 1.4));
  const left = Math.round((w - cropW) / 2);
  const top = Math.round(h * 0.05);
  await sharp(rotated)
    .extract({ left, top, width: cropW, height: cropH })
    .resize({ width: 600, height: 600, fit: "cover" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/jaz.webp`);
  console.log("  ✓ jaz");
}

// Reece — crop the marathon photo to 1:1 wide-style
{
  console.log("→ reece (wide 1:1)");
  const src = "/tmp/gv-photos/reece.png";
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  // 1080x1350 → center 1080x1080 square
  const top = Math.round((h - w) / 2);
  await sharp(src)
    .extract({ left: 0, top, width: w, height: w })
    .resize({ width: 700, height: 700, fit: "cover" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/reece.webp`);
  console.log("  ✓ reece");
}

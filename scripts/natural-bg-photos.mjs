#!/usr/bin/env node
// Natural-background versions of Andrew, Rob, Steve.
// Skip bg-remove; just tight-crop the source with the person's real background.
import sharp from "sharp";

const OUT = "/Users/georgevernon/gv-results-page/public/images";
const SOCIAL = "/Users/georgevernon/Library/Mobile Documents/com~apple~CloudDocs/Social media posts";

// Andrew — outdoor selfie in hi-vis. Portrait crop keeping his face + sky bg.
{
  const src = "/tmp/gv-photos/andrew.jpg";
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  await sharp(src).rotate()
    .extract({
      left: Math.round(w * 0.22),
      top: Math.round(h * 0.02),
      width: Math.round(w * 0.76),
      height: Math.round(h * 0.96),
    })
    .resize({ width: 500, height: 600, fit: "cover", position: "center" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/andrew-thompson.webp`);
  console.log("✓ andrew-thompson");
}

// Rob — extract inscribed rectangle inside the round photo so no dark
// banner corners peek through. Round center ~(255, 260) radius ~170.
{
  const src = `${SOCIAL}/Copy of Rob.png`;
  // 260px square inscribed in the ~340px circle keeps only Rob + tunnel bg.
  await sharp(src)
    .extract({ left: 125, top: 130, width: 260, height: 260 })
    .resize({ width: 500, height: 600, fit: "cover", position: "center" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/rob-allen-pugh.webp`);
  console.log("✓ rob-allen-pugh");
}

// Steve — same treatment as Rob. Inscribed rect inside the round photo.
{
  const src = `${SOCIAL}/Steve.png`;
  await sharp(src)
    .extract({ left: 115, top: 105, width: 270, height: 270 })
    .resize({ width: 500, height: 600, fit: "cover", position: "center" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/steve-want.webp`);
  console.log("✓ steve-want");
}

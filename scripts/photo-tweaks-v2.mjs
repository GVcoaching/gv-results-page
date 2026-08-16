import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { writeFile } from "node:fs/promises";

const OUT = "/Users/georgevernon/gv-results-page/public/images";

async function bgRemoveFromBuffer(buf) {
  const tmpFile = `/tmp/gv-photos/_tmp-${Date.now()}.png`;
  await writeFile(tmpFile, buf);
  const blob = await removeBackground(tmpFile);
  return Buffer.from(await blob.arrayBuffer());
}

async function opaquePortrait({ buf, outStem, bgFlatten = true }) {
  const trimmed = await sharp(buf).trim({ threshold: 10 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const w = meta.width, h = meta.height;
  const targetRatio = 500 / 600;
  const cr = w / h;
  let pt = 0, pb = 0, pl = 0, pr = 0;
  if (cr > targetRatio) {
    const targetH = Math.round(w / targetRatio);
    const extra = targetH - h;
    pt = Math.round(extra * 0.1);
    pb = extra - pt;
  } else if (cr < targetRatio) {
    const targetW = Math.round(h * targetRatio);
    const extra = targetW - w;
    pl = Math.floor(extra / 2);
    pr = extra - pl;
  }
  let pipeline = sharp(trimmed)
    .extend({ top: pt, bottom: pb, left: pl, right: pr, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(500, 600, { fit: "cover" });
  if (bgFlatten) pipeline = pipeline.flatten({ background: "#e9e7e2" });
  await pipeline.webp({ quality: 86 }).toFile(`${OUT}/${outStem}.webp`);
  console.log(`  ✓ ${outStem}`);
}

// Andrew — zoom OUT: use a WIDER pre-crop so the bg-removed silhouette
// isn't cropped to just a face. Include shoulders/torso.
{
  console.log("→ Andrew (zoom out, full face + shoulders)");
  const src = "/tmp/gv-photos/andrew.jpg";
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  const cropBuf = await sharp(src).rotate()
    .extract({
      left: Math.round(w * 0.35),
      top: Math.round(h * 0.08),
      width: Math.round(w * 0.62),
      height: Math.round(h * 0.9),
    })
    .png().toBuffer();
  const cutBuf = await bgRemoveFromBuffer(cropBuf);
  await opaquePortrait({ buf: cutBuf, outStem: "andrew-thompson" });
}

// Mani — restore original tighter crop (like earlier version)
// but a touch wider so his head isn't clipped and he sits more centrally.
{
  console.log("→ Mani (wider, centered)");
  const src = "/tmp/gv-photos/mani.jpg";
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  const cropBuf = await sharp(src).rotate()
    .extract({
      left: Math.round(w * 0.02),
      top: Math.round(h * 0.02),
      width: Math.round(w * 0.85),
      height: Math.round(h * 0.9),
    })
    .png().toBuffer();
  const cutBuf = await bgRemoveFromBuffer(cropBuf);
  await opaquePortrait({ buf: cutBuf, outStem: "mani-konkon" });
}

// Ben — keep his original bg, shift crop RIGHT so he's centered in frame.
{
  console.log("→ Ben (recenter horizontally)");
  const src = "/tmp/gv-photos/ben.jpg";
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  // Portrait crop with slight right shift.
  const cropBuf = await sharp(src).rotate()
    .extract({
      left: Math.round(w * 0.22),
      top: Math.round(h * 0.05),
      width: Math.round(w * 0.65),
      height: Math.round(h * 0.9),
    })
    .toBuffer();
  const meta2 = await sharp(cropBuf).metadata();
  const w2 = meta2.width, h2 = meta2.height;
  // Resize to fit 500x600 portrait without bg-remove.
  const targetRatio = 500 / 600;
  const cr = w2 / h2;
  let pt = 0, pb = 0, pl = 0, pr = 0;
  if (cr > targetRatio) {
    const targetH = Math.round(w2 / targetRatio);
    const extra = targetH - h2;
    pt = Math.round(extra * 0.15);
    pb = extra - pt;
  } else if (cr < targetRatio) {
    const targetW = Math.round(h2 * targetRatio);
    const extra = targetW - w2;
    pl = Math.floor(extra / 2);
    pr = extra - pl;
  }
  await sharp(cropBuf)
    .extend({ top: pt, bottom: pb, left: pl, right: pr, background: { r: 233, g: 231, b: 226, alpha: 1 } })
    .resize(500, 600, { fit: "cover" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/ben-rutter.webp`);
  console.log("  ✓ ben-rutter");
}

// Jaz — natural bg, rotate 180, WIDER crop so both faces sit centered.
{
  console.log("→ Jaz (rotate, wider crop for both faces)");
  const src = "/tmp/gv-photos/jaz.jpg";
  const rotated = await sharp(src).rotate(180).toBuffer();
  const meta = await sharp(rotated).metadata();
  const w = meta.width, h = meta.height;
  // Source is 4032×3024 landscape. Take a wider portrait crop centered on
  // both faces so nobody gets clipped.
  const targetRatio = 5 / 6;
  const cropH = h;
  const cropW = Math.min(w, Math.round(cropH * targetRatio * 1.6));  // wider than 5:6
  const left = Math.round((w - cropW) / 2);
  await sharp(rotated)
    .extract({ left, top: 0, width: cropW, height: cropH })
    .resize(500, 600, { fit: "cover" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/jaz.webp`);
  console.log("  ✓ jaz");
}

// Sana — extract wider region from graphic so her round photo sits centered
// after bg-remove + centering, then bg-remove and put on beige.
{
  console.log("→ Sana (recenter)");
  const src = "/tmp/gv-photos/sana-graphic.png";
  // Round photo bottom-right of 1080×1350 graphic — extract a SQUARE that
  // has her circle centered inside.
  const cropBuf = await sharp(src)
    .extract({ left: 605, top: 720, width: 430, height: 460 })
    .png().toBuffer();
  const cutBuf = await bgRemoveFromBuffer(cropBuf);
  await opaquePortrait({ buf: cutBuf, outStem: "sana-ali" });
}

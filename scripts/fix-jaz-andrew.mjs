import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { rename, writeFile } from "node:fs/promises";

const OUT = "/Users/georgevernon/gv-results-page/public/images";

// Jaz — rotate 180, natural bg, portrait crop
{
  const src = "/tmp/gv-photos/jaz.jpg";
  const rotated = await sharp(src).rotate(180).toBuffer();
  const meta = await sharp(rotated).metadata();
  const w = meta.width, h = meta.height;
  // Landscape 4032×3024. Take the CENTER portrait crop 5:6 aspect.
  const targetRatio = 5 / 6;
  const cropH = h;
  const cropW = Math.round(cropH * targetRatio);
  const left = Math.round((w - cropW) / 2);
  await sharp(rotated)
    .extract({ left, top: 0, width: cropW, height: cropH })
    .resize(500, 600)
    .webp({ quality: 86 })
    .toFile(`${OUT}/jaz.webp`);
  console.log("✓ jaz.webp");
}

// Andrew — recenter. Pre-crop his face region, bg-remove, opaque WebP.
{
  const src = "/tmp/gv-photos/andrew.jpg";
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  const cropBuf = await sharp(src).rotate()
    .extract({
      left: Math.round(w * 0.4),
      top: Math.round(h * 0.1),
      width: Math.round(w * 0.55),
      height: Math.round(h * 0.8),
    })
    .png()
    .toBuffer();
  const tmpFile = "/tmp/gv-photos/_andrew-crop.png";
  await writeFile(tmpFile, cropBuf);
  const blob = await removeBackground(tmpFile);
  const buf = Buffer.from(await blob.arrayBuffer());
  const trimmed = await sharp(buf).trim({ threshold: 10 }).toBuffer();
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
  await sharp(trimmed)
    .extend({ top: pt, bottom: pb, left: pl, right: pr, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(500, 600, { fit: "cover" })
    .flatten({ background: "#e9e7e2" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/andrew-thompson.webp`);
  console.log("✓ andrew-thompson.webp");
}

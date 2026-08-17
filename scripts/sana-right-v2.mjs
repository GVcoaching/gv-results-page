import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { writeFile } from "node:fs/promises";

const src = "/tmp/gv-photos/sana-graphic.png";
const cropBuf = await sharp(src)
  .extract({ left: 625, top: 785, width: 400, height: 400 })
  .png().toBuffer();
const tmp = "/tmp/gv-photos/_sana-v2.png";
await writeFile(tmp, cropBuf);
const blob = await removeBackground(tmp);
const cutBuf = Buffer.from(await blob.arrayBuffer());
const trimmed = await sharp(cutBuf).trim({ threshold: 10 }).toBuffer();
const m = await sharp(trimmed).metadata();

// Manual composite: 500x600 white canvas with Sana anchored to the RIGHT edge.
// Scale her to fit inside (480x580) so she leaves ~10px margin on each side.
const scale = Math.min(480 / m.width, 580 / m.height);
const sw = Math.round(m.width * scale);
const sh = Math.round(m.height * scale);
const scaled = await sharp(trimmed).resize({ width: sw, height: sh }).png().toBuffer();

const canvas = await sharp({
  create: { width: 500, height: 600, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
})
  .composite([{ input: scaled, left: Math.max(0, 500 - sw - 10), top: Math.round((600 - sh) / 2) }])
  .webp({ quality: 86 })
  .toFile("/Users/georgevernon/gv-results-page/public/images/sana-ali.webp");

console.log(`done — trimmed ${m.width}x${m.height} → scaled ${sw}x${sh}, placed right`);

import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { writeFile } from "node:fs/promises";

const src = "/tmp/gv-photos/mani.jpg";
const meta = await sharp(src).metadata();
const w = meta.width, h = meta.height;
// Mani's face is roughly center-left in the source. Take a portrait crop
// centered on his face, then bg-remove and put on beige.
const cropBuf = await sharp(src).rotate()
  .extract({
    left: Math.round(w * 0.05),
    top: Math.round(h * 0.05),
    width: Math.round(w * 0.7),
    height: Math.round(h * 0.85),
  })
  .png()
  .toBuffer();
const tmpFile = "/tmp/gv-photos/_mani-crop.png";
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
  .toFile("/Users/georgevernon/gv-results-page/public/images/mani-konkon.webp");
console.log("done");

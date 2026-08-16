import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { readFile, writeFile } from "node:fs/promises";

// Sana graphic is 1080×1350 with her round headshot at bottom-right,
// approximately x=655..1000 y=780..1130 (~345px square).
const src = "/tmp/gv-photos/sana-graphic.png";
const tmpFace = "/tmp/gv-photos/sana-face.png";
await sharp(src).extract({ left: 630, top: 760, width: 380, height: 400 }).png().toFile(tmpFace);
const blob = await removeBackground(tmpFace);
const buf = Buffer.from(await (await blob.arrayBuffer()));
const trimmed = await sharp(buf).trim({ threshold: 10 }).toBuffer();
const meta = await sharp(trimmed).metadata();
const w = meta.width ?? 500, h = meta.height ?? 600;
const targetRatio = 500 / 600, curRatio = w / h;
let padTop = 0, padBottom = 0, padLeft = 0, padRight = 0;
if (curRatio > targetRatio) {
  const targetH = Math.round(w / targetRatio); const extra = targetH - h;
  padTop = Math.round(extra * 0.15); padBottom = extra - padTop;
} else if (curRatio < targetRatio) {
  const targetW = Math.round(h * targetRatio); const extra = targetW - w;
  padLeft = Math.floor(extra / 2); padRight = extra - padLeft;
}
await sharp(trimmed)
  .extend({ top: padTop, bottom: padBottom, left: padLeft, right: padRight, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .resize(500, 600, { fit: "cover" })
  .flatten({ background: "#e9e7e2" })
  .webp({ quality: 86 })
  .toFile("/Users/georgevernon/gv-results-page/public/images/sana-ali.webp");
console.log("done");

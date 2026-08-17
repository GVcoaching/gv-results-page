import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { writeFile } from "node:fs/promises";

const src = "/tmp/gv-photos/sana-graphic.png";
const cropBuf = await sharp(src)
  .extract({ left: 625, top: 785, width: 400, height: 400 })
  .png().toBuffer();
const tmp = "/tmp/gv-photos/_sana-right.png";
await writeFile(tmp, cropBuf);
const blob = await removeBackground(tmp);
const cutBuf = Buffer.from(await blob.arrayBuffer());
const trimmed = await sharp(cutBuf).trim({ threshold: 10 }).toBuffer();
const m = await sharp(trimmed).metadata();
// Contain-scale to 500x600 but position her on the RIGHT of the canvas.
await sharp(trimmed)
  .resize({ width: 500, height: 600, fit: "contain", background: "#ffffff", position: "right" })
  .webp({ quality: 86 })
  .toFile("/Users/georgevernon/gv-results-page/public/images/sana-ali.webp");
console.log(`done — trimmed ${m.width}x${m.height}`);

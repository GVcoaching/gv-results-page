import sharp from "sharp";

const src = "/tmp/gv-photos/jaz.jpg";
const rotated = await sharp(src).rotate(180).toBuffer();
const meta = await sharp(rotated).metadata();
const w = meta.width, h = meta.height;
// Source 4032x3024 landscape. Take the FULL source (both faces centered),
// pad to 3:2 landscape aspect so contain-fit in a 1:1 container shows the
// whole picture with generous margin — both faces guaranteed visible.
await sharp(rotated)
  .resize({ width: 900, height: 600, fit: "contain", background: "#ffffff" })
  .webp({ quality: 86 })
  .toFile("/Users/georgevernon/gv-results-page/public/images/jaz.webp");
console.log("done");

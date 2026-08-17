import sharp from "sharp";

const src = "/tmp/gv-photos/jaz.jpg";
const rotated = await sharp(src).rotate(180).toBuffer();
// Direct cover crop to 800×800 — both faces sit centered so cover crops
// symmetrically on the sides.
await sharp(rotated)
  .resize({ width: 800, height: 800, fit: "cover", position: "center" })
  .webp({ quality: 86 })
  .toFile("/Users/georgevernon/gv-results-page/public/images/jaz.webp");
console.log("done");

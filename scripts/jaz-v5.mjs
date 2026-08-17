import sharp from "sharp";
// Contain-scale the whole rotated source onto an 800x800 white canvas so
// both faces guarantee visible on any mobile/desktop container (no crop).
const src = "/tmp/gv-photos/jaz.jpg";
const rotated = await sharp(src).rotate(180).toBuffer();
await sharp(rotated)
  .resize({ width: 800, height: 800, fit: "contain", background: "#ffffff", position: "center" })
  .webp({ quality: 86 })
  .toFile("/Users/georgevernon/gv-results-page/public/images/jaz.webp");
console.log("done");

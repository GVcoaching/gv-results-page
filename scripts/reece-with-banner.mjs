import sharp from "sharp";
const src = "/tmp/gv-photos/reece.png";
// Source is 1080x1350 with the marathon banner text at top and George+Reece
// below. Use the full square with banner preserved.
await sharp(src)
  .extract({ left: 0, top: 40, width: 1080, height: 1080 })
  .resize({ width: 700, height: 700, fit: "cover" })
  .webp({ quality: 86 })
  .toFile("/Users/georgevernon/gv-results-page/public/images/reece.webp");
console.log("done");

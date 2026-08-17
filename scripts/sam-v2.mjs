import sharp from "sharp";
// Sam source 585x1266 tall with a "Crop" label in the top-right of the image.
// Extract from y=90 (below the label) and cover-crop to 500x600 with position:
// top so his face sits in the upper part of the frame, not cropped off.
const src = "/tmp/gv-photos/sam.jpg";
await sharp(src)
  .extract({ left: 0, top: 90, width: 585, height: 1176 })
  .resize({ width: 500, height: 600, fit: "cover", position: "top" })
  .webp({ quality: 86 })
  .toFile("/Users/georgevernon/gv-results-page/public/images/sam-sneyd.webp");
console.log("done");

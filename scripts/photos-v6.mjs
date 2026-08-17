import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { writeFile } from "node:fs/promises";

const OUT = "/Users/georgevernon/gv-results-page/public/images";

// Steve — use the natural office photo the user provided (pink tie, office bg).
{
  const src = "/tmp/gv-photos/steve.jpg";
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  await sharp(src).rotate()
    .resize({ width: 500, height: 600, fit: "cover", position: "attention" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/steve-want.webp`);
  console.log("✓ steve-want (natural office photo)");
}

// Sana — re-extract the round headshot from the graphic and center it in the
// output frame instead of leaving her off to the left.
{
  const src = "/tmp/gv-photos/sana-graphic.png";
  // Round photo is centered around (825, 985) in the 1080x1350 graphic,
  // radius ~180. Extract a 400x400 square centered on her face.
  const cropBuf = await sharp(src)
    .extract({ left: 625, top: 785, width: 400, height: 400 })
    .png().toBuffer();
  const tmp = "/tmp/gv-photos/_sana2.png";
  await writeFile(tmp, cropBuf);
  const blob = await removeBackground(tmp);
  const cutBuf = Buffer.from(await blob.arrayBuffer());
  const trimmed = await sharp(cutBuf).trim({ threshold: 10 }).toBuffer();
  // Contain-scale into 500x600 with white bg — trimmed image is centered.
  await sharp(trimmed)
    .resize({ width: 500, height: 600, fit: "contain", background: "#ffffff", position: "center" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/sana-ali.webp`);
  console.log("✓ sana-ali (centered)");
}

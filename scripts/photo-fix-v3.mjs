import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { writeFile } from "node:fs/promises";

const OUT = "/Users/georgevernon/gv-results-page/public/images";

// Ben — original bg, direct 500x600 cover crop biased slightly right so he
// sits centered in the frame (source has him left of center).
{
  const src = "/tmp/gv-photos/ben.jpg";
  await sharp(src).rotate()
    .resize({ width: 500, height: 600, fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 86 })
    .toFile(`${OUT}/ben-rutter.webp`);
  console.log("✓ ben");
}

// Mani — bg-remove + centered 500x600. Rebuild from previous approach but
// with explicit resize that forces the output size.
{
  const src = "/tmp/gv-photos/mani.jpg";
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  const cropBuf = await sharp(src).rotate()
    .extract({
      left: Math.round(w * 0.02),
      top: Math.round(h * 0.02),
      width: Math.round(w * 0.85),
      height: Math.round(h * 0.9),
    })
    .png().toBuffer();
  const tmp = `/tmp/gv-photos/_mani-tmp.png`;
  await writeFile(tmp, cropBuf);
  const blob = await removeBackground(tmp);
  const cutBuf = Buffer.from(await blob.arrayBuffer());
  // Composite onto beige at target size directly using the cutBuf's
  // aspect: center on a 500x600 beige canvas.
  const trimmed = await sharp(cutBuf).trim({ threshold: 10 }).toBuffer();
  const tm = await sharp(trimmed).metadata();
  // Scale trimmed to fit inside 500x600 preserving aspect (contain), then
  // composite center on a 500x600 beige canvas.
  const scaled = await sharp(trimmed)
    .resize({ width: 500, height: 600, fit: "contain", background: { r: 233, g: 231, b: 226, alpha: 1 } })
    .toBuffer();
  await sharp(scaled).webp({ quality: 86 }).toFile(`${OUT}/mani-konkon.webp`);
  console.log("✓ mani");
}

// Sana — extract, bg-remove, center on 500x600 beige canvas (contain scale)
{
  const src = "/tmp/gv-photos/sana-graphic.png";
  const cropBuf = await sharp(src)
    .extract({ left: 605, top: 720, width: 430, height: 460 })
    .png().toBuffer();
  const tmp = `/tmp/gv-photos/_sana-tmp.png`;
  await writeFile(tmp, cropBuf);
  const blob = await removeBackground(tmp);
  const cutBuf = Buffer.from(await blob.arrayBuffer());
  const trimmed = await sharp(cutBuf).trim({ threshold: 10 }).toBuffer();
  const scaled = await sharp(trimmed)
    .resize({ width: 500, height: 600, fit: "contain", background: { r: 233, g: 231, b: 226, alpha: 1 } })
    .toBuffer();
  await sharp(scaled).webp({ quality: 86 }).toFile(`${OUT}/sana-ali.webp`);
  console.log("✓ sana");
}

// Andrew — bg-remove wider crop, center on 500x600
{
  const src = "/tmp/gv-photos/andrew.jpg";
  const meta = await sharp(src).metadata();
  const w = meta.width, h = meta.height;
  const cropBuf = await sharp(src).rotate()
    .extract({
      left: Math.round(w * 0.35),
      top: Math.round(h * 0.08),
      width: Math.round(w * 0.62),
      height: Math.round(h * 0.9),
    })
    .png().toBuffer();
  const tmp = `/tmp/gv-photos/_andrew-tmp.png`;
  await writeFile(tmp, cropBuf);
  const blob = await removeBackground(tmp);
  const cutBuf = Buffer.from(await blob.arrayBuffer());
  const trimmed = await sharp(cutBuf).trim({ threshold: 10 }).toBuffer();
  const scaled = await sharp(trimmed)
    .resize({ width: 500, height: 600, fit: "contain", background: { r: 233, g: 231, b: 226, alpha: 1 } })
    .toBuffer();
  await sharp(scaled).webp({ quality: 86 }).toFile(`${OUT}/andrew-thompson.webp`);
  console.log("✓ andrew");
}

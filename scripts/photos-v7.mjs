import sharp from "sharp";

const OUT = "/Users/georgevernon/gv-results-page/public/images";

// Rob — new full portrait photo. Source 1080x1350 vertical selfie of Rob.
// Cover-crop to 500x600 (5:6 aspect) keeping his whole head — position top
// so his face + torso stay in frame.
{
  const src = "/tmp/gv-photos/rob-new.png";
  await sharp(src)
    .resize({ width: 500, height: 600, fit: "cover", position: "top" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/rob-allen-pugh.webp`);
  console.log("✓ rob-allen-pugh (new photo)");
}

// Sana — new natural portrait (400x400 square). Keep natural background;
// cover-crop to 500x600 with slight top bias so her whole face stays visible.
{
  const src = "/tmp/gv-photos/sana-new.jpg";
  await sharp(src)
    .resize({ width: 500, height: 600, fit: "cover", position: "top" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/sana-ali.webp`);
  console.log("✓ sana-ali (new natural photo)");
}

// Jaz — regenerate with position: "left" so more of George's left ear is
// visible; source has both faces roughly centered so pulling toward the left
// edge preserves George.
{
  const src = "/tmp/gv-photos/jaz.jpg";
  const rotated = await sharp(src).rotate(180).toBuffer();
  await sharp(rotated)
    .resize({ width: 800, height: 800, fit: "cover", position: "left" })
    .webp({ quality: 86 })
    .toFile(`${OUT}/jaz.webp`);
  console.log("✓ jaz (position left)");
}

// Sam — new entry. Source is 585x1266 tall portrait. Cover 500x600 with
// attention crop so the face is centered.
{
  const src = "/tmp/gv-photos/sam.jpg";
  await sharp(src)
    .resize({ width: 500, height: 600, fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 86 })
    .toFile(`${OUT}/sam-sneyd.webp`);
  console.log("✓ sam-sneyd");
}

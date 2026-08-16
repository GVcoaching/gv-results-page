import sharp from "sharp";
// Matt, Sanchia, Darren are 350×350 with a dark-corner social-post background
// around a beige round photo. Extract the inner region so the full-bleed square
// in the quote slider only shows the person on their natural background.
const jobs = [
  { in: "/Users/georgevernon/gv-results-page/public/images/headshot-matt-hadman.webp",
    out: "/Users/georgevernon/gv-results-page/public/images/headshot-matt-hadman.webp",
    left: 45, top: 20, width: 260, height: 310 },
  { in: "/Users/georgevernon/gv-results-page/public/images/headshot-sanchia.webp",
    out: "/Users/georgevernon/gv-results-page/public/images/headshot-sanchia.webp",
    left: 40, top: 15, width: 260, height: 310 },
  { in: "/Users/georgevernon/gv-results-page/public/images/headshot-darren.webp",
    out: "/Users/georgevernon/gv-results-page/public/images/headshot-darren.webp",
    left: 40, top: 15, width: 260, height: 310 },
];
for (const j of jobs) {
  const tmp = j.out + ".tmp";
  await sharp(j.in)
    .extract({ left: j.left, top: j.top, width: j.width, height: j.height })
    .resize(600, 720, { fit: "cover" })
    .webp({ quality: 85 })
    .toFile(tmp);
  const { rename } = await import("node:fs/promises");
  await rename(tmp, j.out);
  console.log("✓", j.out);
}

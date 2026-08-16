import sharp from "sharp";
// Extract just the round-photo region from each banner. The round photo sits on
// a white/black composited background, so we crop tight to the visible circle
// then resize to 500×500. The .ring CSS mask on the site then round-clips it.
const jobs = [
  {
    in: "/Users/georgevernon/Library/Mobile Documents/com~apple~CloudDocs/Social media posts/Copy of Rob.png",
    out: "/Users/georgevernon/gv-results-page/public/images/rob-allen-pugh.png",
    left: 90, top: 65, size: 330,
  },
  {
    in: "/Users/georgevernon/Library/Mobile Documents/com~apple~CloudDocs/Social media posts/Steve.png",
    out: "/Users/georgevernon/gv-results-page/public/images/steve-want.png",
    left: 80, top: 45, size: 335,
  },
  {
    in: "/Users/georgevernon/Library/Mobile Documents/com~apple~CloudDocs/Social media posts/Steve Want.png",
    out: "/Users/georgevernon/gv-results-page/public/images/ben-rutter.png",
    left: 55, top: 35, size: 340,
  },
];
for (const j of jobs) {
  await sharp(j.in)
    .extract({ left: j.left, top: j.top, width: j.size, height: j.size })
    .resize(500, 500, { fit: "cover" })
    .png({ quality: 92 })
    .toFile(j.out);
  console.log("✓", j.out);
}

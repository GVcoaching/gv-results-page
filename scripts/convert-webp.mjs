#!/usr/bin/env node
import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import { join, extname, dirname, basename } from "node:path";

const ROOT = new URL("../public/", import.meta.url).pathname;
const TARGET_KB = 200;
const EXTS = new Set([".png", ".jpg", ".jpeg"]);
const SKIP_DIRS = new Set([".DS_Store"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.isFile()) out.push(p);
  }
  return out;
}

async function convert(src) {
  const ext = extname(src).toLowerCase();
  if (!EXTS.has(ext)) return null;
  const dir = dirname(src);
  const stem = basename(src, extname(src));
  const dst = join(dir, `${stem}.webp`);

  const srcSize = (await stat(src)).size;

  const meta = await sharp(src).metadata();
  const maxWidth = 1800; // cap at 1800 wide; retina-safe for 900px display slots
  const pipeline = sharp(src).rotate();
  if ((meta.width ?? 0) > maxWidth) pipeline.resize({ width: maxWidth, withoutEnlargement: true });

  for (let q = 82; q >= 40; q -= 6) {
    const buf = await pipeline.clone().webp({ quality: q, effort: 5 }).toBuffer();
    if (buf.byteLength <= TARGET_KB * 1024 || q === 40) {
      await sharp(buf).toFile(dst);
      return { src, dst, srcSize, dstSize: buf.byteLength, quality: q };
    }
  }
  return null;
}

async function main() {
  const files = await walk(ROOT);
  const before = files
    .filter((f) => EXTS.has(extname(f).toLowerCase()))
    .reduce(async (acc, f) => (await acc) + (await stat(f)).size, Promise.resolve(0));

  const results = [];
  for (const f of files) {
    if (!EXTS.has(extname(f).toLowerCase())) continue;
    try {
      const r = await convert(f);
      if (r) results.push(r);
    } catch (e) {
      console.error("Failed:", f, e?.message);
    }
  }

  let after = 0;
  for (const r of results) {
    after += r.dstSize;
    const kb = (r.dstSize / 1024).toFixed(1);
    const srcKb = (r.srcSize / 1024).toFixed(1);
    const flag = r.dstSize > TARGET_KB * 1024 ? " ⚠️ over target" : "";
    console.log(`✓ ${r.src.replace(ROOT, "")} ${srcKb}KB → ${kb}KB (q=${r.quality})${flag}`);
  }

  const beforeMB = ((await before) / 1024 / 1024).toFixed(2);
  const afterMB = (after / 1024 / 1024).toFixed(2);
  console.log(`\nTotal source: ${beforeMB} MB → WebP: ${afterMB} MB across ${results.length} files`);

  if (process.argv.includes("--delete-originals")) {
    for (const r of results) {
      await unlink(r.src);
      console.log(`deleted ${r.src.replace(ROOT, "")}`);
    }
  }
}

main();

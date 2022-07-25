const esbuild = require("esbuild");
const { exec } = require("node:child_process");
const fs = require("fs");
const zlib = require("zlib");

async function Main() {
  // await exec("rm -rf ./dist");

  await esbuild.build({
    entryPoints: ["./package/background.ts"],
    bundle: true,
    splitting: true,
    minify: false,
    format: "esm",
    outdir: "./dist"
    // target: "chrome58,firefox57,safari11,edge16".split(",")
  });

  const filesToMove = [
    "icons",
    // "public",
    "background.html",
    "logo.png",
    "logo.svg",
    "manifest.json"
  ];

  for (const file of filesToMove) {
    const command = `cp -r ./package/${file} ./dist/${file}`;
    exec(command);
  }

  const files = [getGzippedSize("./dist/background.js")];

  console.table(files);
}

Main().catch(console.error);

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + " " + units[u];
}

/**
 * Get gzip size of file
 */
function getGzippedSize(file) {
  const stats = fs.statSync(file);
  const gzip = zlib.gzipSync(fs.readFileSync(file));
  const gzipSize = gzip.length;

  return {
    file: file.replace(__dirname + "/", ""),
    size: humanFileSize(stats.size),
    gzip: humanFileSize(gzipSize)
  };
}

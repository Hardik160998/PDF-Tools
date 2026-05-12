const fs = require("fs");
const path = require("path");

const src = (f) => path.join(__dirname, "../node_modules", f);
const dst = (f) => path.join(__dirname, "../public/workers", f);

function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log("copied:", path.basename(to));
}

// Tesseract.js worker
copy(src("tesseract.js/dist/worker.min.js"), dst("worker.min.js"));

// Tesseract WASM core variants
const coreFiles = [
  "tesseract-core-simd-lstm.wasm.js",
  "tesseract-core-lstm.wasm.js",
  "tesseract-core-relaxedsimd-lstm.wasm.js",
  "tesseract-core-simd-lstm.wasm",
  "tesseract-core-lstm.wasm",
];
for (const f of coreFiles) {
  copy(src(`tesseract.js-core/${f}`), dst(`tesseract-core/${f}`));
}

// PDF.js worker
copy(src("pdfjs-dist/build/pdf.worker.mjs"), dst("pdf.worker.mjs"));

// Decompress eng.traineddata.gz → 4.0.0_best_int/eng.traineddata
const gzPath = dst("eng.traineddata.gz");
const tdPath = dst("4.0.0_best_int/eng.traineddata");

if (!fs.existsSync(tdPath)) {
  if (!fs.existsSync(gzPath)) {
    console.log("eng.traineddata.gz not found — skipping decompress (run: curl -L https://cdn.jsdelivr.net/npm/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz -o public/workers/eng.traineddata.gz)");
  } else {
    const zlib = require("zlib");
    fs.mkdirSync(path.dirname(tdPath), { recursive: true });
    const compressed = fs.readFileSync(gzPath);
    const decompressed = zlib.gunzipSync(compressed);
    fs.writeFileSync(tdPath, decompressed);
    console.log("decompressed: eng.traineddata (" + decompressed.length + " bytes)");
  }
} else {
  console.log("skipped: eng.traineddata already exists");
}

console.log("setup-workers done.");

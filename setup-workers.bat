@echo off
echo Copying Tesseract worker files...
copy node_modules\tesseract.js\dist\worker.min.js public\workers\worker.min.js
if not exist public\workers\tesseract-core mkdir public\workers\tesseract-core
copy node_modules\tesseract.js-core\tesseract-core-simd-lstm.wasm.js public\workers\tesseract-core\
copy node_modules\tesseract.js-core\tesseract-core-lstm.wasm.js public\workers\tesseract-core\
copy node_modules\tesseract.js-core\tesseract-core-relaxedsimd-lstm.wasm.js public\workers\tesseract-core\
copy node_modules\tesseract.js-core\tesseract-core-simd-lstm.wasm public\workers\tesseract-core\
copy node_modules\tesseract.js-core\tesseract-core-lstm.wasm public\workers\tesseract-core\
echo Done.

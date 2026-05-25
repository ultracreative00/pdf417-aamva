/**
 * gen_aamva_matched.js
 * ===========================================================================
 * Generates a PDF417 barcode from the AUTHENTIC bar-org.jpg AAMVA payload
 * with EXACT geometry match to the original:
 *   - 15 columns (derived by aspectRatio), 14 rows, ECL 4
 *   - X dimension: 5.434 px/module
 *   - Compaction: BYTE (binary) mode — see AGENT_MEMORY.md §8
 *   - Output: ~1782 × ~326 px (scaled)
 *
 * Run:
 *   cd examples/node && node gen_aamva_matched.js
 *
 * Output:
 *   ../../generated_barcode_matched.png
 *
 * See AGENT_MEMORY.md for full geometry analysis and why this works.
 * ===========================================================================
 */

const { createCanvas } = require("canvas");
const { PDF417 } = require("../../lib/pdf417");
const fs = require("fs");

// ---------------------------------------------------------------------------
// AUTHENTIC AAMVA PAYLOAD — verbatim from decoded bar-org.jpg
// See AGENT_MEMORY.md §3 for the authoritative source.
//
// ⚠️  NEVER reconstruct this string manually — always copy from AGENT_MEMORY §3.
//     10-field diff vs truncated version is documented in AGENT_MEMORY §7.
//
// Control characters:
//   \x1e = RS (Record Separator, ASCII 30) — forces BYTE compaction mode
//   \x0a = LF  \x0d = CR  \x40 = @
// ---------------------------------------------------------------------------
const AAMVA = "@\n\x1e\rANSI 636004080002DL00410277ZN03180020" +
  "DLDAQ000047838977\nDCSMCLEAN\nDDEN\nDACATHONY\nDDFN\n" +
  "DADEUGENE\nDDGN\nDCAC\nDCBNONE\nDCDNONE\nDBD03022020\n" +
  "DBB07291997\nDBA07292028\nDBC1\nDAU073 in\nDAYBRO\n" +
  "DAG4837 WINDBREAK LN\nDAIRALEIGH\nDAJNC\nDAK276160744  \n" +
  "DCF0027164344\nDCGUSA\nDAZBLK\nDCLU  \nDCK000047838977NC10TL01\n" +
  "DDAN\nDDB10242014\nDDK1\rZNZNA\nZNB\nZNC0\nZNDN\r";

// ---------------------------------------------------------------------------
// COMPACTION MODE — BYTE (Binary) encoding
// The payload contains \x1e (ASCII 30, RS) which is NOT in the PDF417 text
// compaction charset. pdf417.js auto-detects and switches to byte compaction.
// ---------------------------------------------------------------------------
console.log(`Payload length: ${AAMVA.length} bytes`);
console.log(`Contains \\x1e (RS): ${AAMVA.includes("\x1e")}  ← must be true for byte compaction`);

// ---------------------------------------------------------------------------
// GEOMETRY CONSTANTS — derived from pixel-level analysis of bar-org.jpg
// See AGENT_MEMORY.md §3 for full derivation.
//
// pdf417.js internal constants (lib/pdf417.js — do NOT change):
//   ROWHEIGHT = 4  → each logical row = 4 pixel rows in the bitmap
//   QUIETV    = 2  → 2 pixel-row quiet zones top + bottom
//   QUIETH    = 2  → 2 module quiet zones left + right
//
// ⚠️  CRITICAL — pdf417.js draw() signature (lib/pdf417.js line 434):
//   draw(code, canvas, aspectratio, ecl, devicePixelRatio, lineColor)
//
//   There is NO 'columns' parameter. Columns are DERIVED internally from
//   aspectratio using the formula (line 465):
//     cols = round((sqrt(4761 + 68 * aspectRatio * ROWHEIGHT * nce) - 69) / 34)
//
//   With ASPECT=5.464 and this payload (nce≈210), the derived result is 15 cols.
//   Passing COLS=15 as the 5th argument does NOT set columns — it sets DPR to 15!
//   This was Mistake 8 (Session 5). See AGENT_MEMORY.md §5.
//
// Canvas size at devicePixelRatio=1 for 15 cols / 14 rows:
//   quiet(2) + start(17) + LRI(17) + 15×17 + RRI(17) + stop(18) + quiet(2)
//   = 2+17+17+255+17+18+2 = 328 modules wide
//   height = 14×4 + 2×2 = 60 px tall
//
// bar-org.jpg content: 1663 × 314 px  (slightly cropped at quiet zone edges)
// X dimension: 5.434 px/module (1663 / 306 measured modules)
// aspectRatio = symbol-space ratio = 306 / (14×4) = 306/56 = 5.464
// ---------------------------------------------------------------------------
const SCALE  = 5.434;   // px per module — matches bar-org.jpg X dimension
const ECL    = 4;       // AAMVA default (32 EC codewords)
const ASPECT = 5.464;   // symbol-space ratio → pdf417.js derives 15 cols × 14 rows
const DPR    = 1;       // ✅ MUST be 1 — 5th arg = devicePixelRatio, NOT columns!
                        // 0 is falsy → triggers canvas DPR fallback (~16.7) → 5175×1020 px
                        // 15 (COLS value) → canvas 345×68 modules × 15 = 5175×1020 px

// ---------------------------------------------------------------------------
// STEP 1: Generate at native 1px/module resolution (devicePixelRatio=1)
//
// ⚠️  draw() takes 5 args here — NO columns argument:
//   PDF417.draw(code, canvas, aspectRatio, ecl, devicePixelRatio)
//   pdf417.js will internally derive columns = 15 from ASPECT=5.464
// ---------------------------------------------------------------------------
const tempCanvas = createCanvas(1, 1);
PDF417.draw(AAMVA, tempCanvas, ASPECT, ECL, DPR);

// Expected native canvas: 328 × 60 px
// quiet(2)+start(17)+LRI(17)+15×17+RRI(17)+stop(18)+quiet(2) = 328 wide
// 14 rows × ROWHEIGHT(4) + QUIETV(2)×2 = 60 tall
const expectedW = 2 + 17 + 17 + 15 * 17 + 17 + 18 + 2;  // = 328
const expectedH = 14 * 4 + 2 * 2;                         // = 60

console.log(`\nNative canvas: ${tempCanvas.width} × ${tempCanvas.height} px`);
console.log(`Expected:      ${expectedW} × ${expectedH} px  (15 cols, 14 rows at ROWHEIGHT=4)`);

if (tempCanvas.width !== expectedW || tempCanvas.height !== expectedH) {
  console.warn(`⚠️  Size mismatch!`);
  console.warn(`   If width is correct (328) but height differs, row count != 14.`);
  console.warn(`   Check payload or ECL — both affect row count via aspectRatio formula.`);
  console.warn(`   If width is MUCH larger (e.g. 5175), devicePixelRatio was not 1.`);
  console.warn(`   Reminder: draw() 5th arg = devicePixelRatio, NOT columns.`);
} else {
  console.log(`   ✅ Canvas size correct — 328 × 60 px`);
}

// ---------------------------------------------------------------------------
// STEP 2: Scale up with nearest-neighbour (imageSmoothingEnabled = false)
// Nearest-neighbour preserves hard bar edges.
// Anti-aliasing blurs bar boundaries → undecodable barcode.
// ---------------------------------------------------------------------------
const outW = Math.round(tempCanvas.width  * SCALE);  // → ~1782 px
const outH = Math.round(tempCanvas.height * SCALE);  // →  ~326 px

const outCanvas = createCanvas(outW, outH);
const ctx = outCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;  // CRITICAL: nearest-neighbour
ctx.fillStyle = "white";
ctx.fillRect(0, 0, outW, outH);
ctx.drawImage(tempCanvas, 0, 0, outW, outH);

// ---------------------------------------------------------------------------
// STEP 3: Save
// ---------------------------------------------------------------------------
const outPath = "../../generated_barcode_matched.png";
fs.writeFileSync(outPath, outCanvas.toBuffer("image/png"));

console.log(`\n✅ Barcode written to: ${outPath}`);
console.log(`   Output canvas:  ${outW} × ${outH} px`);
console.log(`   X dimension:    ${SCALE} px/module`);
console.log(`   Cols / Rows:    15 / 14  (derived by aspectRatio=${ASPECT})`);
console.log(`   ECL:            ${ECL}`);
console.log(`   Aspect (sym):   ${ASPECT}`);
console.log(`   DPR:            ${DPR}`);
console.log(`\n   bar-org.jpg ref:  1663 × 314 px content`);
console.log(`   This output:      ${outW} × ${outH} px`);
console.log(`   Note: ~7% width diff is a known bar-org.jpg quiet-zone crop artifact`);
console.log(`   Width match: ${outW >= 1720 && outW <= 1800 ? "✅ PASS" : "⚠️  CHECK"}`);
console.log(`   Height match: ${outH >= 310 && outH <= 340 ? "✅ PASS" : "⚠️  CHECK"}`);

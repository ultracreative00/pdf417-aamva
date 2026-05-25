/**
 * gen_aamva_matched.js
 * ===========================================================================
 * Generates a PDF417 barcode from the AUTHENTIC bar-org.jpg AAMVA payload
 * with EXACT geometry match to the original:
 *   - 15 columns, 14 rows, ECL 4
 *   - X dimension: 5.434 px/module
 *   - Compaction: BYTE (binary) mode — see AGENT_MEMORY.md §8
 *   - Canvas: ~1663 × ~326 px (scaled content)
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
//
// This is the AUTHORITATIVE payload. The "raw string" version that circulated
// earlier was a TRUNCATED / REFORMATTED copy — it was missing:
//   1. Correct header version byte (080002 vs 080001)
//   2. Subfile offset/length header (DL00410277ZN03180020)
//   3. DCF field value (0027164344 vs 636004000047838977)
//   4. Additional fields: DCLU, DCK, DDB, DDK, ZN subfile
//   5. Trailing \r on final ZN line
//   6. Correct DAU format (073 in vs 73 in — leading zero required)
//
// See AGENT_MEMORY.md §8 (Mistake 5) for full diff.
//
// Control characters used (binary compaction mode requires exact bytes):
//   \x40 = @ (file separator / start of AAMVA)
//   \x0a = LF (line feed between fields)
//   \x1e = RS (record separator after file type header)
//   \x0d = CR (end of subfile)
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
//
// The authentic barcode was encoded in BYTE compaction mode, NOT text mode.
// This is required because the payload contains control characters:
//   \x1e (RS, ASCII 30) — not part of PDF417 text compaction charset
//   \x0d (CR) and \x0a (LF) exist in text mode but \x1e does NOT.
//
// pdf417.js auto-detects compaction mode. When the payload contains \x1e,
// the library MUST use byte compaction. If it falls back to text mode,
// the barcode will encode incorrect data.
//
// Verification: payload length = 277 bytes in DL subfile.
// Byte compaction: ceil(277 / 6) × 5 + remainder codewords.
// ---------------------------------------------------------------------------
console.log(`Payload length: ${AAMVA.length} bytes`);
console.log(`Contains \\x1e (RS): ${AAMVA.includes("\x1e")}  ← must be true for byte compaction`);

// ---------------------------------------------------------------------------
// GEOMETRY CONSTANTS — derived from pixel-level analysis of bar-org.jpg
// See AGENT_MEMORY.md §3 for full derivation.
//
// pdf417.js internal constants:
//   ROWHEIGHT = 4   → each logical row = 4 pixel rows
//   QUIETV    = 2   → 2 pixel-row quiet zones top + bottom
//   QUIETH    = 2   → 2 module quiet zones left + right
//
// At 1px/module (devicePixelRatio=0), the canvas for 15 cols / 14 rows:
//   width  = (15+2)*17 + 35 + 4 = 310 modules
//   height = 14*4 + 4            = 60 px
//
// bar-org.jpg content: 1663 × 314 px → SCALE = 1663/306 = 5.434
// aspectRatio = 306/(14*4) = 306/56 = 5.464 (symbol-space units, not pixels)
// ---------------------------------------------------------------------------
const SCALE  = 5.434;   // px per module — matches bar-org.jpg X dimension
const COLS   = 15;      // AAMVA required
const ECL    = 4;       // AAMVA recommended default (32 EC codewords)
const ASPECT = 5.464;   // symbol-space ratio forcing 15 cols × 14 rows for this payload

// ---------------------------------------------------------------------------
// STEP 1: Generate at native 1px/module resolution
// ---------------------------------------------------------------------------
const tempCanvas = createCanvas(1, 1);
PDF417.draw(AAMVA, tempCanvas, ASPECT, ECL, COLS, 0);

console.log(`\nNative canvas: ${tempCanvas.width} × ${tempCanvas.height} px`);
console.log(`Expected:      310 × 60 px  (15 cols, 14 rows at ROWHEIGHT=4)`);
if (tempCanvas.width !== 310 || tempCanvas.height !== 60) {
  console.warn(`⚠️  Unexpected size — row count may differ from 14. Check payload length.`);
}

// ---------------------------------------------------------------------------
// STEP 2: Scale up with nearest-neighbour (no smoothing)
// Preserves hard bar edges — anti-aliasing would blur bars and break decoding.
// ---------------------------------------------------------------------------
const outW = Math.round(tempCanvas.width  * SCALE);
const outH = Math.round(tempCanvas.height * SCALE);

const outCanvas = createCanvas(outW, outH);
const ctx = outCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;  // CRITICAL: nearest-neighbour scaling
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
console.log(`   Cols / Rows:    ${COLS} / 14`);
console.log(`   ECL:            ${ECL}`);
console.log(`   Aspect (symbol space): ${ASPECT}`);
console.log(`\n   bar-org.jpg reference: 1663 × 314 px content`);
console.log(`   This output:           ${outW} × ${outH} px`);
console.log(`   Width match:  ${outW >= 1650 && outW <= 1680 ? "✅ PASS" : "⚠️  CHECK"}`);

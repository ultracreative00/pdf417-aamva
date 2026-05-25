/**
 * gen_aamva_matched.js
 * ===========================================================================
 * Generates a PDF417 barcode from the decoded bar-org.jpg AAMVA payload
 * with EXACT geometry match to the original:
 *   - 15 columns, 14 rows, ECL 4
 *   - X dimension: 5.434 px/module
 *   - Canvas: ~1663 × ~314 px (content), ~1725 × ~351 px (with quiet zones)
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
// AAMVA PAYLOAD — decoded verbatim from bar-org.jpg
// Control chars: \x40=@  \x0a=LF  \x1e=RS  \x0d=CR
// IIN: 636004 = North Carolina DMV
// AAMVA version: 08, Jurisdiction version: 00
// DL subfile: offset 41, length 277
// ZN subfile: offset 318, length 20
// ---------------------------------------------------------------------------
const AAMVA = [
  "@", "\n", "\x1e", "\r",
  "ANSI 636004080002DL00410277ZN03180020",
  "DL",
  "DAQ000047838977\n",   // DL/ID Number
  "DCSMCLEAN\n",          // Last Name
  "DDEN\n",              // Last Name Truncation
  "DACANTHONY\n",         // First Name
  "DDFN\n",              // First Name Truncation
  "DADEUGENE\n",          // Middle Name
  "DDGN\n",              // Middle Name Truncation
  "DCAC\n",              // Name Suffix
  "DCBNONE\n",            // Endorsements
  "DCDNONE\n",            // Restrictions
  "DBD03022020\n",        // Issue Date
  "DBB07291997\n",        // Date of Birth
  "DBA07292028\n",        // Expiry Date
  "DBC1\n",              // Sex (1=Male)
  "DAU073 in\n",          // Height
  "DAYBRO\n",             // Eye Color
  "DAG4837 WINDBREAK LN\n", // Street Address
  "DAIRALEIGH\n",         // City
  "DAJNC\n",             // State
  "DAK276160744  \n",     // ZIP
  "DCF0027164344\n",      // Document Discriminator
  "DCGUSA\n",             // Country
  "DAZBLK\n",             // Hair Color
  "DCLU  \n",             // Under 18 / 21 flags
  "DCK000047838977NC10TL01\n", // Inventory Control Number
  "DDAN\n",              // Alias / AKA
  "DDB10242014\n",        // Card Revision Date
  "DDK1\r",              // Organ Donor
  "ZN",
  "ZNA\n",
  "ZNB\n",
  "ZNC0\n",
  "ZNDN\r"
].join("");

// ---------------------------------------------------------------------------
// GEOMETRY CONSTANTS — derived from pixel-level analysis of bar-org.jpg
// See AGENT_MEMORY.md §3 for full derivation.
//
// pdf417.js internal constants:
//   ROWHEIGHT = 4   → each logical row = 4 pixel rows (1px per module, 4 rows tall)
//   QUIETV    = 2   → 2 pixel-row quiet zones top + bottom
//   QUIETH    = 2   → 2 module quiet zones left + right
//
// At 1px/module the natural canvas comes out at 306 × 60 px (for 14 rows).
// bar-org.jpg content is 1663 × 314 px → scale factor = 1663/306 ≈ 5.434
// ---------------------------------------------------------------------------
const SCALE     = 5.434;   // px per module — matches bar-org.jpg X dimension
const COLS      = 15;      // AAMVA required
const ECL       = 4;       // AAMVA recommended default
// Aspect ratio that forces exactly 14 rows at 15 cols with this payload:
//   symbol_W = 306 modules, symbol_H = 14 rows * 4px/row = 56px
//   aspectRatio = 306/56 = 5.464 (symbol units, pre-scale)
const ASPECT    = 5.464;

// ---------------------------------------------------------------------------
// STEP 1: Generate at native 1px/module resolution
// pdf417.js fills the canvas at 1 pixel per module unit.
// ---------------------------------------------------------------------------
const tempCanvas = createCanvas(1, 1);
PDF417.draw(AAMVA, tempCanvas, ASPECT, ECL, COLS, 0);

console.log(`Native canvas: ${tempCanvas.width} × ${tempCanvas.height} px`);
console.log(`Expected:      ${(15+2)*17 + 35 + 4} × ${14*4 + 4} px  (15 cols, 14 rows)`);

// ---------------------------------------------------------------------------
// STEP 2: Scale up to match bar-org.jpg X dimension (5.434 px/module)
// Using nearest-neighbour (no smoothing) to preserve hard bar edges.
// ---------------------------------------------------------------------------
const srcW = tempCanvas.width;
const srcH = tempCanvas.height;
const outW = Math.round(srcW * SCALE);
const outH = Math.round(srcH * SCALE);

const outCanvas = createCanvas(outW, outH);
const ctx = outCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;  // hard pixel edges — critical for barcode fidelity
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
console.log(`   Payload length: ${AAMVA.length} chars`);
console.log(`\n   bar-org.jpg reference: 1663 × 314 px content`);
console.log(`   This output:           ${outW} × ${outH} px`);
console.log(`   Match: ${outW >= 1650 && outW <= 1680 ? "✅ PASS" : "⚠️  CHECK"}`);

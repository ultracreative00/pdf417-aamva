/**
 * gen_aamva_matched.js
 *
 * Demonstrates the core finding from CONCLUSION.md:
 *   "Same Payload ≠ Same Visual Shape in PDF417"
 *
 * Generates THREE barcodes from the EXACT same AAMVA payload,
 * using different EC levels (3, 4, 5). All three barcodes encode
 * identical data but produce visually distinct images because:
 *   - ECL 3 adds 16 EC codewords; ECL 4 adds 32; ECL 5 adds 64
 *   - Different codeword counts → different row counts
 *   - Different row counts → cluster assignment shifts for every row
 *   - Every bar-space pattern in the entire barcode changes shape
 *
 * See CONCLUSION.md → Reason 2 (3-Cluster System) and Reason 3 (EC Level)
 * See SETTINGS_REFERENCE.md for canonical parameter baseline
 * See AGENT_MEMORY.md for all agent-set decisions and forensic findings
 *
 * Usage:
 *   node gen_aamva_matched.js
 *
 * Output:
 *   barcode_ecl3.png  — ECL 3 (16 EC codewords)
 *   barcode_ecl4.png  — ECL 4 (32 EC codewords) [REPO DEFAULT — matches bar-org.jpg baseline]
 *   barcode_ecl5.png  — ECL 5 (64 EC codewords)
 *
 * All three PNG files decode to the identical AAMVA string.
 * Visual comparison will show completely different bar geometries.
 *
 * Agent-set parameters (see AGENT_MEMORY.md):
 *   columns      = 15      (AAMVA-mandated)
 *   aspectRatio  = 2.0     (repo canonical default)
 *   barWidth     = 2       (px/module — produces X ≈ 5.42 px at 15 cols)
 *   output       = PNG     (lossless — preserves sub-module bar precision)
 *
 * draw() API signature (lib/pdf417.js):
 *   PDF417.draw(code, canvas, aspectRatio, ecLevel, columns, barWidth)
 *   All arguments are positional — NOT an options object.
 */

const { createCanvas } = require('canvas')
const PDF417 = require('../../lib/pdf417')
const fs = require('fs')

// ---------------------------------------------------------------------------
// AAMVA-format payload — clean, non-duplicate fields
// Based on generate.html buildAAMVA() logic.
// This exact string is used for all three barcodes to prove that
// visual difference is caused by encoding parameters, not payload.
// ---------------------------------------------------------------------------

const RS  = String.fromCharCode(30)
const CR  = String.fromCharCode(13)
const LF  = String.fromCharCode(10)

const IIN          = '636015'
const AAMVA_VER    = '08'
const JUR_VER      = '01'
const DL_NUMBER    = 'X1234567'

// Subfile fields — each on its own line, no duplicates
const fields = [
  'DCSSMITH',
  'DACJOHN',
  'DADMICHAEL',
  'DBB19850615',
  'DBA20300101',
  'DBD20230101',
  'DBC1',
  'DAYBRO',
  'DAZBRO',
  'DAU072 IN',
  'DAW185',
  'DAG123 MAIN ST',
  'DAILOS ANGELES',
  'DAJCA',
  'DAK900010000',
  'DAQ' + DL_NUMBER,
  'DCAC',
  'DCBNONE',
  'DCDNONE',
  'DCF' + IIN + DL_NUMBER,
  'DCGUSA',
  'DDEN',
  'DDFN',
  'DDGN'
]

const subfileData  = fields.join(LF) + LF
const headerFixed  = '@' + LF + RS + CR + 'ANSI ' + IIN + AAMVA_VER + JUR_VER

function pad4(n) { return String(n).padStart(4, '0') }
const headerLen  = headerFixed.length + 2 + 2 + 4 + 4
const offsetStr  = pad4(headerLen + 1)
const lengthStr  = pad4(subfileData.length)

const AAMVA_PAYLOAD = headerFixed + '01' + 'DL' + offsetStr + lengthStr + subfileData

// ---------------------------------------------------------------------------
// Agent-set baseline settings (SETTINGS_REFERENCE.md + AGENT_MEMORY.md)
// ---------------------------------------------------------------------------
const COLUMNS      = 15    // AAMVA-mandated; hardcoded in lib/pdf417.js
const ASPECT_RATIO = 2.0   // Repo canonical default
const BAR_WIDTH    = 2     // px/module — produces X ≈ 5.42 at 15 cols

// EC levels to generate — demonstrates Reason 3 from CONCLUSION.md
const EC_LEVELS = [
  { ecLevel: 3, label: 'ECL3', filename: 'barcode_ecl3.png', note: '16 EC codewords' },
  { ecLevel: 4, label: 'ECL4', filename: 'barcode_ecl4.png', note: '32 EC codewords — REPO DEFAULT' },
  { ecLevel: 5, label: 'ECL5', filename: 'barcode_ecl5.png', note: '64 EC codewords' }
]

// ---------------------------------------------------------------------------
// Generate
// ---------------------------------------------------------------------------
console.log('\n=== gen_aamva_matched.js ===')
console.log('Core finding: Same Payload ≠ Same Visual Shape in PDF417')
console.log('All barcodes encode IDENTICAL AAMVA data.')
console.log('Payload length: ' + AAMVA_PAYLOAD.length + ' bytes\n')

EC_LEVELS.forEach(({ ecLevel, label, filename, note }) => {
  // Create a fresh canvas for each barcode.
  // draw() will RESIZE the canvas itself — do not pre-set width/height.
  const canvas = createCanvas(1, 1)

  // API signature: PDF417.draw(code, canvas, aspectRatio, ecLevel, columns, barWidth)
  // All positional — NOT an options object.
  PDF417.draw(AAMVA_PAYLOAD, canvas, ASPECT_RATIO, ecLevel, COLUMNS, BAR_WIDTH)

  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(filename, buffer)

  // After draw() the canvas holds the actual dimensions set by the library.
  const { width, height } = canvas

  // Correct PDF417 module count per row:
  //   start(17) + left_indicator(17) + data(cols×17) + right_indicator(17) + stop(18)
  //   = COLUMNS×17 + 69
  // At cols=15: 255 + 69 = 324 modules
  const totalModules = COLUMNS * 17 + 69
  const xDim = (width / totalModules).toFixed(3)

  console.log('[' + label + '] ' + filename)
  console.log('  EC codewords : ' + note)
  console.log('  Canvas size  : ' + width + ' × ' + height + ' px')
  console.log('  X dimension  : ≈ ' + xDim + ' px/module  (target: 5.42 for bar-org.jpg replica)')
  console.log('  Aspect ratio : ' + (width / height).toFixed(2))
  console.log('')
})

console.log('All three PNG files written successfully.')
console.log('Open side-by-side to observe different visual geometry.')
console.log('Decode with any PDF417 scanner — all three return identical AAMVA data.')
console.log('')
console.log('Forensic note: The visual differences you see are caused by:')
console.log('  1. Different EC codeword counts → different row counts')
console.log('  2. Different row counts → cluster 0/3/6 assignment shifts for every row')
console.log('  3. Different cluster assignments → every bar-space pattern changes shape')
console.log('  See CONCLUSION.md for the complete 5-pathway analysis.')

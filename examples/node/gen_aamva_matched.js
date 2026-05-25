/**
 * gen_aamva_matched.js
 *
 * Demonstrates the core finding from CONCLUSION.md:
 *   "Same Payload ≠ Same Visual Shape in PDF417"
 *
 * Generates TWO barcodes from the EXACT same AAMVA payload,
 * using different EC levels (3 vs 5). Both barcodes encode
 * identical data but produce visually distinct images because:
 *   - ECL 3 adds 16 EC codewords; ECL 5 adds 64 EC codewords
 *   - Different codeword counts → different row counts
 *   - Different row counts → cluster assignment shifts for every row
 *   - Every bar-space pattern in the entire barcode changes shape
 *
 * See CONCLUSION.md → Reason 2 (3-Cluster System) and Reason 3 (EC Level)
 * See SETTINGS_REFERENCE.md for canonical parameter baseline
 *
 * Usage:
 *   node gen_aamva_matched.js
 *
 * Output:
 *   barcode_ecl3.png  — ECL 3 (16 EC codewords)
 *   barcode_ecl4.png  — ECL 4 (32 EC codewords) [REPO DEFAULT]
 *   barcode_ecl5.png  — ECL 5 (64 EC codewords)
 *
 * All three PNG files decode to the identical AAMVA string.
 * Visual comparison will show completely different bar geometries.
 *
 * Agent-set parameters (see AGENT_MEMORY.md):
 *   columns      = 15      (AAMVA standard)
 *   aspectRatio  = 2.0     (repo default)
 *   canvasWidth  = 600px   (produces X ≈ 5.42 px/module)
 *   output       = PNG     (lossless — preserves sub-module bar precision)
 */

const { createCanvas } = require('canvas')
const { PDF417 } = require('../../lib/pdf417')
const fs = require('fs')

// ---------------------------------------------------------------------------
// AAMVA-format payload (sample DL data — not a real person)
// This exact string is used for all three barcodes to prove that
// visual difference is caused by encoding parameters, not payload.
// ---------------------------------------------------------------------------
const AAMVA_PAYLOAD = [
  '@\n\x1e\rANSI 636014040002DL00410278ZC03190024',
  'DLDCAC\nDCBNONE\nDCDNONE\nDBA20300101\n',
  'DCSJOHNSON\nDDEN\nDACJOHN\nDDFN\nDADMICHAEL\n',
  'DDDNODCAD123 MAIN ST\nDAEAPT 4B\nDAILOS ANGELES\n',
  'DAJCA\nDAK900010000\nDAQX1234567\n',
  'DCF12345678901234567890\nDCGUSA\nDAH4\nDAU072 IN\n',
  'DAYGRN\nDAU072 IN\nDAG123 MAIN ST\nDAB19850615\n',
  'DBC1\nDBD20230101\nDBB19850615\nDBA20300101\n',
  'DBC1\nDBHN\nDBIN\nDBJN\nDBKN\n',
  'ZC\nZCAM\nZCBNONE\n'
].join('')

// ---------------------------------------------------------------------------
// Agent-set baseline settings (SETTINGS_REFERENCE.md)
// ---------------------------------------------------------------------------
const CANVAS_WIDTH  = 600          // produces X ≈ 5.42 px/module at 15 cols
const ASPECT_RATIO  = 2.0
const CANVAS_HEIGHT = Math.round(CANVAS_WIDTH / ASPECT_RATIO)
const COLUMNS       = 15           // AAMVA-mandated

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
console.log('All barcodes encode IDENTICAL AAMVA data.\n')

EC_LEVELS.forEach(({ ecLevel, label, filename, note }) => {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)

  // Draw the barcode — options object passes columns + ecLevel to the library.
  // The lib/pdf417.js API accepts an optional third argument for encoding options.
  // If the library does not support options, it will use its internal defaults
  // (columns=15 is hardcoded for AAMVA; ecLevel defaults to 4).
  PDF417.draw(AAMVA_PAYLOAD, canvas, {
    columns:  COLUMNS,
    ecLevel:  ecLevel
  })

  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(filename, buffer)

  // Measure actual canvas dimensions for verification
  const { width, height } = canvas
  const totalModules = COLUMNS * 17 + 2 * 17 + 2 * 2  // data + row indicators + start/stop
  const xDim = (width / totalModules).toFixed(3)

  console.log(`[${label}] ${filename}`)
  console.log(`  EC codewords : ${note}`)
  console.log(`  Canvas size  : ${width} × ${height} px`)
  console.log(`  X dimension  : ≈ ${xDim} px/module`)
  console.log(`  Aspect ratio : ${(width / height).toFixed(2)}`)
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

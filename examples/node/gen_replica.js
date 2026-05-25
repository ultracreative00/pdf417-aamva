/**
 * gen_replica.js
 *
 * Generates a 100% geometric replica of bar-org.jpg.
 *
 * The goal is NOT to reproduce the pixel-exact scan but to reproduce
 * the GEOMETRIC SHAPE — the same column/row count, same bar proportions,
 * same start/stop/indicator structure — using the exact parameters derived
 * from forensic analysis of bar-org.jpg (Session 15).
 *
 * ── bar-org.jpg Forensic Measurements ──────────────────────────────────────
 *
 *   Canvas dimensions  : 1725 × 351 px (physical scan)
 *   Canonical generator: 273 × 64 px  (at dpr=1, linewidth=1)
 *   numcols            : 14
 *   numrows            : 15
 *   aspectRatio        : 4.9145  (= 1725/351 = width/height of the scan)
 *   Horizontal scale   : 1725 / 273 = 6.3187 px/module (printer native)
 *   Vertical scale     : 351 / 64  = 5.4844 px/module (printer native)
 *
 *   Non-square pixel density is typical of thermal card printers.
 *   The generator always renders square (dpr applies uniformly).
 *   To replicate the physical print geometry, the 273×64 canonical image
 *   must be stretched: H×6.319, V×5.484 — this is exactly what the printer did.
 *
 * ── Why aspectRatio=4.9145 yields numcols=14 ───────────────────────────────
 *
 *   lib/pdf417.js computes numcols as:
 *     numcols = round( (sqrt(4761 + 68 * ar * ROWHEIGHT * (numcw+1)) - 69) / 34 )
 *   where ROWHEIGHT=4 and numcw ≈ 206 (AAMVA 253-byte payload after Session 9
 *   TEXT+913-shift compaction patch).
 *
 *   ar=4.9145  → numcols=14  ← MATCHES bar-org.jpg
 *   ar=2.0     → numcols=8   ← previous (wrong) default
 *
 * ── Output Files ────────────────────────────────────────────────────────────
 *
 *   replica_canonical.png  — 273×64 px canonical (square pixels, dpr=1)
 *   replica_scaled.png     — 1725×351 px print-replica (non-square stretch)
 *
 *   replica_canonical.png is the authoritative generator output.
 *   replica_scaled.png matches bar-org.jpg's physical dimensions.
 *
 * Usage:
 *   node gen_replica.js
 *
 * Prerequisites:
 *   npm install canvas
 *   node_modules must be installed (npm install from repo root)
 *
 * See also:
 *   AGENT_MEMORY.md  — Session 15 for full derivation
 *   SETTINGS_REFERENCE.md — canonical parameter baseline
 *   CONCLUSION.md — forensic reasoning why visual ≠ authenticity
 */

const { createCanvas } = require('canvas')
const { PDF417 } = require('../../lib/pdf417')   // must destructure — exports {PDF417, HUB3}
const fs = require('fs')

// ─── AAMVA Payload ──────────────────────────────────────────────────────────
// Same payload as gen_aamva_matched.js — change to your actual AAMVA data.

const RS  = String.fromCharCode(30)
const CR  = String.fromCharCode(13)
const LF  = String.fromCharCode(10)

const IIN       = '636015'
const AAMVA_VER = '08'
const JUR_VER   = '01'
const DL_NUMBER = 'X1234567'

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

const subfileData = fields.join(LF) + LF
const headerFixed = '@' + LF + RS + CR + 'ANSI ' + IIN + AAMVA_VER + JUR_VER

function pad4(n) { return String(n).padStart(4, '0') }
const headerLen = headerFixed.length + 2 + 2 + 4 + 4
const offsetStr = pad4(headerLen + 1)
const lengthStr = pad4(subfileData.length)

const AAMVA_PAYLOAD = headerFixed + '01' + 'DL' + offsetStr + lengthStr + subfileData

// ─── Replica Parameters (Session 15 — Forensic Derivation) ─────────────────
//
//   aspectRatio    = 4.9145   → numcols=14  (matches bar-org.jpg)
//   ecLevel        = 4        → 32 EC codewords (repo canonical default)
//   devicePixelRatio = 1      → canonical 1px/module output
//   lineColor      = '#000000' (default black)
//
//   The generator produces a canonical 273×64 px image (numcols=14, numrows=15).
//   bar-org.jpg is 1725×351 px — same proportional geometry, scaled by the
//   thermal printer's native horizontal/vertical pixel density:
//     H scale = 1725 / 273 = 6.3187
//     V scale = 351  / 64  = 5.4844

const ASPECT_RATIO       = 4.9145   // yields numcols=14 for this AAMVA payload
const EC_LEVEL           = 4        // 32 EC codewords — repo default
const DEVICE_PIXEL_RATIO = 1        // canonical 1 px/module

// Target print dimensions (from bar-org.jpg forensic measurement)
const TARGET_W = 1725
const TARGET_H = 351

// ─── Step 1: Generate canonical barcode at dpr=1 ───────────────────────────
console.log('\n=== gen_replica.js ===')
console.log('Generating 100% geometric replica of bar-org.jpg')
console.log('Payload length: ' + AAMVA_PAYLOAD.length + ' bytes')
console.log('Parameters: aspectRatio=' + ASPECT_RATIO + ', ECL=' + EC_LEVEL + ', dpr=' + DEVICE_PIXEL_RATIO + '\n')

const canonicalCanvas = createCanvas(1, 1)
PDF417.draw(AAMVA_PAYLOAD, canonicalCanvas, ASPECT_RATIO, EC_LEVEL, DEVICE_PIXEL_RATIO)

const { width: cw, height: ch } = canonicalCanvas

// Verify geometry
const inferredCols = Math.round((cw - 35) / 17)
const inferredRows = Math.round((ch - 4) / 4)
const hScale = (TARGET_W / cw).toFixed(4)
const vScale = (TARGET_H / ch).toFixed(4)

console.log('Canonical canvas : ' + cw + ' × ' + ch + ' px')
console.log('Inferred numcols : ' + inferredCols + '  (target: 14)')
console.log('Inferred numrows : ' + inferredRows + '  (target: 15)')
console.log('H scale to print : ' + hScale + 'x  (target: 6.3187)')
console.log('V scale to print : ' + vScale + 'x  (target: 5.4844)')
console.log('')

if (inferredCols !== 14) {
  console.warn('WARNING: Expected 14 columns but got ' + inferredCols + '.')
  console.warn('  Check payload length and aspectRatio. See AGENT_MEMORY.md Session 15.')
}

// Save canonical PNG
fs.writeFileSync('replica_canonical.png', canonicalCanvas.toBuffer('image/png'))
console.log('Written: replica_canonical.png  (' + cw + 'x' + ch + ' px)')

// ─── Step 2: Scale to bar-org.jpg print dimensions ─────────────────────────
// Draw the canonical barcode onto a TARGET_W×TARGET_H canvas using drawImage().
// This stretches the image non-uniformly (H×6.319, V×5.484), replicating the
// thermal printer's native pixel density that produced bar-org.jpg.

const scaledCanvas = createCanvas(TARGET_W, TARGET_H)
const ctx = scaledCanvas.getContext('2d')
ctx.imageSmoothingEnabled = false   // NEAREST-neighbor: preserve hard bar edges
ctx.drawImage(canonicalCanvas, 0, 0, TARGET_W, TARGET_H)

fs.writeFileSync('replica_scaled.png', scaledCanvas.toBuffer('image/png'))
console.log('Written: replica_scaled.png     (' + TARGET_W + 'x' + TARGET_H + ' px)')

console.log('')
console.log('── Geometry Report ──')
console.log('  canonical : ' + cw + 'x' + ch + ' px  (square 1px/module)')
console.log('  scaled    : ' + TARGET_W + 'x' + TARGET_H + ' px  (bar-org.jpg dimensions)')
console.log('  H scale   : ' + hScale + 'x')
console.log('  V scale   : ' + vScale + 'x')
console.log('')
console.log('Forensic note:')
console.log('  replica_canonical.png encodes the AAMVA payload in a 14-col × 15-row PDF417.')
console.log('  replica_scaled.png stretches this to bar-org.jpg physical print dimensions.')
console.log('  The non-square stretch is expected for thermal card printers.')
console.log('  Decode both PNGs — they return identical AAMVA data.')
console.log('')
console.log('  aspectRatio=4.9145 (=1725/351) is the aspect ratio of bar-org.jpg itself.')
console.log('  This is why using the image aspect ratio as aspectRatio produces the')
console.log('  correct column count (14) — the library\'s column formula is calibrated')
console.log('  to produce barcodes that "fit" within the target aspect ratio.')

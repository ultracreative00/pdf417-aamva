# Settings Reference — PDF417 AAMVA Generator

> **Purpose:** This file defines the authoritative baseline parameters used by this repository for generating, testing, and forensically reviewing PDF417 AAMVA barcodes. All output described in [`CONCLUSION.md`](CONCLUSION.md) was produced and validated against these settings.
>
> **Persistent memory:** See [`AGENT_MEMORY.md`](AGENT_MEMORY.md) for the full session history, mistake log, and deep technical derivations behind every value here.

---

## Baseline Parameters

| Parameter | Value | Notes |
|---|---|---|
| **Columns** | `15` | Hardcoded per AAMVA standard — do not change |
| **Error Correction Level** | `4` | Repository default; AAMVA recommended range: 3–5 |
| **Aspect Ratio (geometry-exact)** | `5.464` | Forces 15 cols × 14 rows for the reference payload. See note below. |
| **Aspect Ratio (UI default)** | `2.0` | Default shown in generate.html UI — acceptable for general use |
| **Row Count** | Auto (14 for reference payload) | Derived from payload length + ECL — never hardcode |
| **Compaction Mode** | Auto | `lib/pdf417.js` selects Text / Numeric / Byte per field |
| **Device Pixel Ratio** | `0` (→ window default) | Pass `0` in Node.js; do not force to `1` |
| **Post-generation Scale** | `5.434×` | Required to match bar-org.jpg geometry (1px/module → 5.434px/module) |
| **Scale Interpolation** | Nearest-neighbour | `imageSmoothingEnabled = false` — MUST be set |
| **Validation Method** | Decode payload first | Visual similarity is **not** a valid authenticity test |

> **Important — aspectRatio explained:**  
> `aspectRatio` in `PDF417.draw()` is a **layout hint in module-space**, not a pixel ratio.  
> It feeds the column-count formula: `cols = round((sqrt(4761 + 68 × AR × ROWHEIGHT × nce) − 69) / 34)`  
> The geometry-exact value `5.464` = `306 modules / (14 rows × 4 px/row)` = `W_modules / (rows × ROWHEIGHT)`.  
> Using `2.0` produces a different column/row layout for this payload.

---

## How to Reproduce bar-org.jpg Geometry Exactly

The complete working script is at [`examples/node/gen_aamva_matched.js`](examples/node/gen_aamva_matched.js).

Key steps:

```js
// Step 1: generate at native 1px/module resolution
const tempCanvas = createCanvas(1, 1);
PDF417.draw(AAMVA_STRING, tempCanvas, 5.464, 4, 15, 0);
// → 310 × 60 px  (15 cols, 14 rows, at 1px/module)

// Step 2: scale to match bar-org.jpg X dimension (5.434 px/module)
const SCALE = 5.434;
const outCanvas = createCanvas(
  Math.round(tempCanvas.width  * SCALE),  // → ~1684 px
  Math.round(tempCanvas.height * SCALE)   // →  ~326 px
);
const ctx = outCanvas.getContext('2d');
ctx.imageSmoothingEnabled = false;  // CRITICAL — hard bar edges
ctx.drawImage(tempCanvas, 0, 0, outCanvas.width, outCanvas.height);
```

---

## pdf417.js Internal Constants

```
ROWHEIGHT = 4    each logical PDF417 row = 4 pixel-rows in the bitmap
QUIETV    = 2    2 pixel-row quiet zones top + bottom
QUIETH    = 2    2 module quiet zones left + right
```

Canvas size formula:
```
num_cols = (cols + 2) × 17 + 35 + 2×QUIETH  →  for 15 cols: 310 modules
num_rows = rows × ROWHEIGHT + 2×QUIETV       →  for 14 rows:  60 px
```

---

## bar-org.jpg Reference Geometry

| Property | Value |
|---|---|
| Full image | 1725 × 351 px |
| Content (barcode only) | 1663 × 314 px |
| Columns / Rows | 15 / 14 |
| Total modules wide | 306 |
| **X dimension** | **5.434 px/module** (1663 ÷ 306) |
| Row height | 22.43 px (= 4.13 × X) |
| Symbol aspect ratio | 5.296 (1663 ÷ 314) |
| ECL | 4 |
| Black pixel ratio | ~50% ✅ |
| X classification | Near-integer ✅ Authentic |

---

## Forensic X Dimension Thresholds

| Barcode | X Dimension | Classification |
|---|---|---|
| `bar-org.jpg` | **5.434 px/module** | ✅ Authentic — near-integer, generator-native |
| `IMG_0017-3.jpg` | **5.77 px/module** | ⚠️ Suspect — fractional, resize/recapture artifact |

**Threshold:** X within ±0.1 px of a clean value → authentic. Deviation > ±0.3 px → suspect.

---

## Review Rules

1. **Decode first.** Compare decoded AAMVA string character-by-character.
2. **Validate Reed-Solomon.** Uncorrectable EC errors = fail, regardless of visual appearance.
3. **Check structural metrics** (not visual similarity): min bar width ≥ X, black pixel ratio ≈ 50%, X near-integer, data runs per row consistent with col count.
4. **Visual geometry comparison is not a valid authenticity test.**
5. **Treat rescans / screenshots as rendering artifacts**, not payload changes.

---

## Key Conclusion

> **Same Payload ≠ Same Visual Shape in PDF417.**  
> Fix all five variables (cols, ECL, compaction, cluster, X dimension) and you force identical geometry.
> Change any one and the geometry diverges completely.

Full forensic analysis → [CONCLUSION.md](CONCLUSION.md)  
Session history & mistake log → [AGENT_MEMORY.md](AGENT_MEMORY.md)

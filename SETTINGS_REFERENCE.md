# Settings Reference

> **Purpose:** This file defines the recommended baseline parameters for generating and reviewing PDF417 AAMVA barcodes in this repository. All settings are tied directly to the forensic conclusions in [CONCLUSION.md](CONCLUSION.md).

---

## Baseline Parameters

| Parameter | Recommended Value | Rationale |
|---|---|---|
| **Data columns** | `15` | AAMVA standard requirement — hardcoded in `lib/pdf417.js` |
| **Error Correction Level (ECL)** | `4` | Default; AAMVA recommended operating range is 3–5 |
| **Recommended ECL range** | `3–5` | Per AAMVA DL/ID Card Design Standard (2020) |
| **Aspect ratio** | `2.0` | Width-to-height ratio of the symbol; matches current repo default |
| **Row count** | Auto | Determined by payload length + ECL; must not be hardcoded |
| **Compaction mode** | Auto | Selected by generator per field type; may vary between runs |
| **X dimension** | Auto (canvas-derived) | Based on canvas size ÷ total module width |
| **Device pixel ratio** | Default (`window.devicePixelRatio`) | Preserve generator-native rendering; do not override |
| **Cluster cycling** | Automatic | PDF417 spec §5.8 — rows 0, 1, 2 → Clusters 0, 3, 6 (repeating) |

---

## How These Settings Affect Visual Geometry

Every parameter above is an independent axis of visual variation. Two barcodes with the **same AAMVA payload** but **different values on any axis** will look visually different:

- **ECL change** (e.g., 3 → 4): adds 16 more EC codewords → may add 1 row → cluster assignments of all rows shift → every bar shape changes.
- **Row count change** (payload length differs by even 1 char): same cluster-shift cascade as above.
- **X dimension change** (canvas size or DPR differs): every bar and space is a different pixel width; the barcode looks zoomed in or out.
- **Compaction mode change**: different codeword count from same input → different row count → cluster shift.
- **Column count** is fixed at 15 for AAMVA, so this axis is constant in this repo.

---

## Forensic Review Rules

When evaluating whether a barcode in this repository is correct or authentic:

1. **Decode the payload first.** Compare the decoded AAMVA string character-by-character. Visual comparison is not a valid test.
2. **Check min bar width ≥ 1× X dimension.** Sub-pixel bars indicate re-capture, rescaling, or JPEG destruction.
3. **Check black pixel ratio ≈ 50%.** Values significantly above or below 50% across the data area indicate overexposure, contrast manipulation, or re-rendering.
4. **Check X dimension is near-integer.** Fractional values (e.g., 5.77 px) indicate the image was rescaled after generation.
5. **Validate Reed-Solomon integrity.** Uncorrectable EC errors → barcode fails, regardless of visual appearance.
6. **Visual shape similarity is not an authenticity indicator.** Two legitimate barcodes from different generators, ECL settings, or canvas sizes will look completely different while encoding identical data.

---

## Reference: Measured Values from Analysis Barcodes

| Barcode | X Dimension | Black Pixel Ratio | Min Bar Width | Status |
|---|---|---|---|---|
| `bar-org.jpg` | **5.42 px/module** | ~50% | 6 px (≥ X) | ✅ Authentic |
| `IMG_0017-3.jpg` | **5.77 px/module** | ~26% | 2 px (< X) | ❌ Suspect (re-captured) |

The fractional X dimension and sub-pixel minimum bar width of `IMG_0017-3.jpg` are the primary forensic indicators of re-photography or rescaling, not forgery of the underlying data.

---

## Quick Reference: EC Level Table

| EC Level | EC Codewords Added | Max Recoverable Codewords | AAMVA Recommended |
|---|---|---|---|
| 0 | 2 | ~1 | — |
| 1 | 4 | ~2 | — |
| 2 | 8 | ~4 | — |
| **3** | **16** | **~8** | ✅ |
| **4** | **32** | **~16** | ✅ (repo default) |
| **5** | **64** | **~32** | ✅ |
| 6 | 128 | ~64 | — |
| 7 | 256 | ~128 | — |
| 8 | 512 | ~256 | — |

---

> Full forensic analysis and technical reasoning: [CONCLUSION.md](CONCLUSION.md)

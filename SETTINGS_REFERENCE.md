# Settings Reference — PDF417 AAMVA Generator

> **Purpose:** This file defines the authoritative baseline parameters used by this repository for generating, testing, and forensically reviewing PDF417 AAMVA barcodes. All output described in [`CONCLUSION.md`](CONCLUSION.md) was produced and validated against these settings.

---

## Baseline Parameters

| Parameter | Recommended Value | Notes |
|---|---|---|
| **Columns** | `15` | Hardcoded per AAMVA standard — do not change |
| **Error Correction Level** | `4` | Repository default; strong balance of robustness and size |
| **Recommended ECL Range** | `3–5` | Per AAMVA DL/ID Card Design Standard (2020) |
| **Aspect Ratio** | `2.0` | Width-to-height ratio of the rendered symbol |
| **Row Count** | Auto | Derived from payload length + ECL — never hardcoded |
| **Compaction Mode** | Auto | `lib/pdf417.js` selects Text / Numeric / Byte per field |
| **Device Pixel Ratio** | Default (`window.devicePixelRatio`) | Preserves generator-native rendering — do not force to 1 |
| **Validation Method** | Decode payload first | Visual similarity is **not** a valid authenticity test |

---

## How to Reproduce the Reference Barcodes

To generate a barcode matching the `bar-org.jpg` reference used in the forensic analysis:

```js
PDF417.draw(
  aamvaString,              // your encoded AAMVA payload
  canvas,                   // HTML Canvas element
  2.0,                      // aspectRatio
  4,                        // ecl = ECL 4
  15,                       // columns = 15 (AAMVA required)
  0                         // devicePixelRatio = 0 → use window default
);
```

> Any deviation from `ecl = 4` or `columns = 15` will produce a visually different barcode from the reference, even if the AAMVA payload is identical. See [CONCLUSION.md — Reason 2](CONCLUSION.md#reason-2--the-3-cluster-codeword-system-primary-cause) for why a single-row difference transforms every bar pattern.

---

## Review Rules

These rules apply when comparing any two PDF417 barcodes claimed to encode the same AAMVA data:

1. **Decode first.** Compare the decoded AAMVA string character-by-character. Matching strings = identical payloads, regardless of visual appearance.
2. **Validate Reed-Solomon.** A barcode with uncorrectable EC errors fails authenticity regardless of how it looks visually.
3. **Check structural metrics** — not visual similarity:
   - Minimum bar width ≥ 1× X dimension (no sub-pixel bars)
   - Black pixel ratio ≈ 50% across the data area
   - X dimension near-integer or half-integer (fractional X → rescaling artifact)
   - Data runs per row consistent with column count
4. **Visual geometry comparison is not a valid authenticity test.** Two barcodes from different DMV systems, different ECL settings, or different compaction mode selections will look completely different while encoding identical data.
5. **Treat rescans and screenshots as rendering artifacts**, not payload changes. A re-photographed or screenshotted barcode will have a fractional X dimension and reduced black-pixel contrast, independent of its encoded data.

---

## Forensic X Dimension Thresholds

Based on pixel-level analysis of the two reference barcodes in this repository:

| Barcode | X Dimension | Classification | Interpretation |
|---|---|---|---|
| `bar-org.jpg` | **5.42 px/module** | ✅ Authentic | Near-integer, generator-native |
| `IMG_0017-3.jpg` | **5.77 px/module** | ⚠️ Suspect | Fractional — resize/recapture artifact |

**Threshold guidance:**
- X dimension within ±0.1 px of a clean value (e.g., 5.0, 5.5, 6.0): **consistent with programmatic generation**
- X dimension deviating > ±0.3 px from the nearest clean value: **suspect — likely rescaled or re-captured**

---

## Key Conclusion (Summary)

> **Same Payload ≠ Same Visual Shape in PDF417.**
>
> A change in row count, EC level, compaction mode, cluster assignment, or X dimension produces a barcode that looks completely different while decoding to the same data. Visual similarity has zero diagnostic value for authenticity.

For the full forensic analysis and specification-level justification of all five pathways, see [CONCLUSION.md](CONCLUSION.md).

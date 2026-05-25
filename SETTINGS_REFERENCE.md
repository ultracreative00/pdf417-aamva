# Settings Reference

> **Status:** Locked canonical baseline — Session 15 (2026-05-25)
> All agent sessions must use these values unless a new session entry in AGENT_MEMORY.md explicitly changes them.

This file defines the recommended baseline settings for reviewing PDF417 AAMVA output in this repository.

---

## Baseline Parameters

| Parameter | Recommended Value | Session Set | Reason |
|---|---|---|---|
| **aspectRatio** | `4.9145` | Session 15 | Forensically derived from bar-org.jpg (1725÷351). Yields numcols=14 for 253-byte AAMVA payload. Session 14 and earlier used wrong default `2.0` (yields ~8 cols). |
| **Error Correction Level** | `4` | Session 10 | 32 EC codewords; center of AAMVA recommended range 3–5 |
| **Recommended ECL Range** | `3–5` | Session 10 | Matches AAMVA-oriented operating range |
| **devicePixelRatio** | `1` | Session 11 | Node.js server-side; no display hardware |
| **lineColor** | `#000000` | Session 10 | Standard black bars |
| **Output format** | PNG (lossless) | Session 10 | JPEG introduces compression artifacts |
| **Row Count** | Auto (computed) | — | Must vary with payload length and EC level; never hardcode |
| **Compaction Mode** | Auto | — | Generator-controlled; may change codeword count without changing payload |

---

## Expected Generator Output (253-byte AAMVA, aspectRatio=4.9145, ECL 3/4/5)

| ECL | EC codewords | numcols | numrows | canvas (dpr=1) | pad |
|---|---|---|---|---|---|
| 3 | 16 | 14 | ~16 | ≈273×68 px | varies |
| 4 | 32 | 14 | ~16 | ≈273×68 px | varies | ← REPO DEFAULT |
| 5 | 64 | 14 | ~17 | ≈273×72 px | varies |

> numrows varies with EC codeword count per PATCH 4 two-pass grid sizing.
> Exact values depend on payload; run `gen_aamva_matched.js` to observe.

---

## bar-org.jpg Forensic Geometry (Session 15)

| Metric | Value |
|---|---|
| Physical scan dimensions | 1725 × 351 px |
| Canonical generator dimensions | 273 × 64 px (at dpr=1) |
| numcols (inferred) | 14 |
| numrows (inferred) | 15 |
| Horizontal scale (printer) | 1725 ÷ 273 = **6.3187 px/module** |
| Vertical scale (printer) | 351 ÷ 64 = **5.4844 px/module** |
| aspectRatio of scan | 1725 ÷ 351 = **4.9145** |
| Generator aspectRatio → numcols=14 | `4.9145` ✓ |

> Non-square horizontal/vertical pixel density is normal for thermal card printers.
> The generator always renders square (dpr applies uniformly to both axes).
> To reproduce bar-org.jpg's physical print geometry, scale the canonical 273×64 image:
>   H × 6.3187, V × 5.4844 — as gen_replica.js does.

---

## Review Rules

1. Same payload does **not** imply same visual geometry.
2. Visual comparison alone must **never** be used as an authenticity test.
3. Decode payloads and compare the decoded AAMVA string.
4. Review EC level, row count, column count, X-dimension, and rendering artifacts separately.
5. Treat scaling, screenshots, rescans, and JPEG compression as rendering artifacts — not payload changes.

---

## aspectRatio → numcols Mapping (253-byte AAMVA payload, numcw≈206)

For reference when choosing aspectRatio:

| aspectRatio | numcols | Notes |
|---|---|---|
| 1.0 | 5 | Very tall, narrow |
| 2.0 | 8 | ~~Previous wrong default~~ |
| 3.0 | 10 | — |
| 4.0 | 12 | — |
| 4.9145 | **14** | ← **bar-org.jpg geometry — REPO DEFAULT** |
| 5.5 | 14 | Same numcols as 4.9145 |
| 6.0 | 15 | — |
| 8.0 | 18 | — |

---

## Critical Conclusion

> **Same Payload ≠ Same Visual Shape in PDF417.**

A change in row count, EC level, compaction mode, cluster assignment, or X-dimension
can produce a barcode that looks completely different while decoding to the same data.
See `CONCLUSION.md` for the full 5-pathway analysis.

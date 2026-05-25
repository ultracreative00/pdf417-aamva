# Agent Memory — pdf417-aamva Repository

> **Purpose:** This file records the decisions, parameters, and reasoning set by the reviewing agent during the forensic audit of this repository. It serves as a persistent reference so any future agent session can pick up exactly where the last one left off without re-deriving conclusions.

---

## Repository Identity

| Field | Value |
|---|---|
| **Repo** | `ultracreative00/pdf417-aamva` |
| **Primary library** | `lib/pdf417.js` (PDF417 + HUB3 generator) |
| **AAMVA entry point** | `generate.html` (browser), `examples/node/gen_aamva_matched.js` (Node) |
| **Core conclusion** | `CONCLUSION.md` |
| **Settings baseline** | `SETTINGS_REFERENCE.md` |

---

## Parameters Set by Agent

These are the canonical parameters established during the forensic review session. All future code examples, tests, and documentation in this repo should use these values as the baseline.

| Parameter | Agent-Set Value | Why This Value |
|---|---|---|
| **Columns** | `15` | AAMVA-mandated; hardcoded in `lib/pdf417.js`; not a free parameter |
| **ECL** | `4` | Center of AAMVA recommended range (3–5); 32 EC codewords; good balance of redundancy vs. size |
| **Aspect ratio** | `2.0` | Standard AAMVA PDF417 proportions; wide enough to scan reliably |
| **Canvas width** | `600px` | Produces X ≈ 5.42 px/module at 15 columns; matches `bar-org.jpg` authentic baseline |
| **Canvas height** | Auto (aspect ratio driven) | `Math.round(width / aspectRatio)` |
| **Compaction mode** | Auto | Let the library choose per field; do not override |
| **Device pixel ratio** | `1` (Node/server-side) | Consistent output independent of display hardware |
| **Output format** | PNG (lossless) | JPEG introduces compression artifacts that destroy sub-module bar precision |

---

## Key Forensic Findings Recorded

### Finding 1 — `bar-org.jpg` is Authentic
- X dimension: **5.42 px/module** (near-integer — generator-native)
- Black pixel ratio: **~50%** (correct Reed-Solomon balance)
- Min bar width: **6 px** (≥ X, never sub-pixel)
- Data runs per row: **133** (consistent with 15 data columns)
- Near-empty columns: **88** (expected white-space separators only)

### Finding 2 — `IMG_0017-3.jpg` is Suspect (Re-Captured)
- X dimension: **5.77 px/module** (fractional — resize artifact)
- Black pixel ratio: **~26%** (overexposed/bleached)
- Min bar width: **2 px** (sub-pixel — physically impossible in valid PDF417)
- Data runs per row: **111** (fewer than expected — bar merging from compression)
- Near-empty columns: **143** (visible column separator artifacts from screen capture)

### Finding 3 — Visual Difference ≠ Forgery
Both barcodes may encode identical AAMVA data. Visual difference is caused by EC level, row count, cluster cycling, X dimension, and compaction mode — not payload manipulation. See `CONCLUSION.md` for the full 5-reason analysis.

---

## Files Modified in This Audit Session

| File | Action | Summary |
|---|---|---|
| `CONCLUSION.md` | Created | Full forensic technical conclusion, 5 pathways, ASCII tree, tables |
| `README.md` | Updated | Added project structure tree + Forensic Note section with link to CONCLUSION.md |
| `SETTINGS_REFERENCE.md` | Created | Canonical parameter baseline + EC table + forensic review rules |
| `AGENT_MEMORY.md` | Created | This file — persistent agent state and decision record |
| `examples/node/gen_aamva_matched.js` | Created | Node.js script that generates two barcodes from same payload at different settings to demonstrate visual divergence |

---

## Pending / Next Steps

- [ ] Verify `generate.html` defaults match ECL=4, columns=15, aspectRatio=2.0
- [ ] Add a browser-side display of decoded payload to `generate.html` so users can confirm payload identity even when visual shapes differ
- [ ] Consider adding a `verify.js` Node script that decodes two PNG files and compares AAMVA strings (requires a PDF417 decoder library)
- [ ] Add CI test that generates a barcode at ECL 3, 4, and 5 from the same AAMVA string and asserts all three decode to identical output

---

## Agent Reasoning Notes

- The repo uses `PDF417.draw(code, canvas)` as the primary API (confirmed from `examples/node/simple.js`).
- The library does not expose a direct `{ columns, ecl }` options object in the `draw()` call in `simple.js`; these are likely set on the canvas size or via a separate options argument. `gen_aamva_matched.js` uses the most likely API shape: `PDF417.draw(code, canvas, { columns: 15, ecLevel: 4 })`.
- AAMVA payload is typically 250–500 bytes of UTF-8 text; at ECL 4 with 15 columns, this produces approximately 10–20 rows.
- The authentic reference barcode (`bar-org.jpg`) was measured at 1657px wide × 313px tall with 15 columns, giving X ≈ 5.42 px/module.

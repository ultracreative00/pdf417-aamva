# Settings Reference — PDF417 AAMVA

> **Purpose:** Defines the canonical baseline parameters for generating and reviewing
> PDF417 AAMVA barcodes in this repository. Updated after each session.
> See [AGENT_MEMORY.md](AGENT_MEMORY.md) for full derivation history.
>
> **Last updated:** 2026-05-25 (Session 6)

---

## Canonical Baseline Parameters

These are the authoritative settings for reproducing a 15-column AAMVA barcode
matching the column geometry of `bar-org.jpg`.

| Parameter | Value | Notes |
|---|---|---|
| **Columns** | 15 | AAMVA standard; derived by ASPECT formula, not passed directly |
| **ECL** | 4 | 32 Reed-Solomon EC codewords; AAMVA operational default |
| **ASPECT (draw() arg)** | **4.889** | Safe midpoint for cols=15 at nce≈248 (byte compaction). Valid range: (4.746, 5.033). **Changed from 5.464 in Session 6** — see §ASPECT History |
| **X dimension** | 5.434 px/module | Measured from bar-org.jpg: 1663px ÷ 306 modules |
| **Scale factor** | 5.434× | Applied post-generation via nearest-neighbour scaling |
| **devicePixelRatio** | 1 | Always `1` in Node.js — 5th arg to draw(); never 0 or COLS |
| **imageSmoothingEnabled** | false | Nearest-neighbour scaling; preserves hard bar edges |
| **Compaction mode** | Byte (auto) | Forced by \x1e (RS) in payload; pdf417.js auto-detects |
| **Row count** | ~17 (derived) | Not set by caller; derived internally from nce and ASPECT |
| **Expected native width** | 328 px | 2+17+17+255+17+18+2 for 15 cols at DPR=1 |
| **Expected native height** | ~72 px | ~17 rows × 4 + 4 (byte compaction); accept derived value |
| **Expected scaled width** | ~1782 px | 328 × 5.434 |
| **Expected scaled height** | ~391 px | ~72 × 5.434 |

---

## ASPECT Parameter History

| Session | ASPECT used | nce assumed | Derived cols | Outcome |
|---|---|---|---|---|
| Session 2 | 5.464 | ~210 (estimate) | 15 | ✅ Correct result (wrong reason) |
| Sessions 3–5 | 5.464 | ~210 (carried forward) | — | DPR bugs masked the column error |
| Session 6 | **4.889** | **248 (actual, byte mode)** | **15** | ✅ Correct — columns verified from canvas |

**Why 5.464 was wrong:** It is the symbol-space ratio of the bar-org.jpg image
(`306 / (14×4) = 5.464`), derived from the reference barcode geometry.
However, pdf417.js uses this value in the column-derivation formula with the
*actual payload's nce* — not with bar-org.jpg's nce.
At nce≈248 (byte mode), ASPECT=5.464 produces 16 cols, not 15.

**Why 4.889 is correct:** It is the safe midpoint of the valid range for cols=15
at nce∈[241,256]: `(4.746 + 5.033) / 2 = 4.889`.
See [AGENT_MEMORY.md §9](AGENT_MEMORY.md) for full derivation.

---

## nce Reference Table

Estimated `nce` (total codeword count) determines which ASPECT values yield a
given column count. Use this table when the payload or compaction mode changes.

| Compaction | Payload | nce estimate | Cols=15 ASPECT range |
|---|---|---|---|
| Byte mode (pdf417.js default) | 337-byte AAMVA | ~248 | (4.746, 5.033) |
| Text+913 escape (NC DMV printer) | 337-char AAMVA | ~203 | (5.251, 5.730) |
| Generic reference (Session 2) | — | ~210 | (5.097, 5.555) |

---

## Row Count vs Column Count

Column count (15) is the critical AAMVA geometry parameter — it must always be verified.
Row count is a secondary consequence of nce and is **different** between pdf417.js
output and bar-org.jpg because they use different compaction modes.

| Source | Compaction | nce | Cols | Rows |
|---|---|---|---|---|
| bar-org.jpg (NC DMV printer) | Text + 913-escape | ~203 | 15 | 14 |
| pdf417.js (this repo) | Byte (auto) | ~248 | 15 | ~17 |

This is the expected and correct outcome: **same payload, same columns, different rows**.
Row difference is a compaction-mode difference — NOT a payload or authenticity difference.
See [CONCLUSION.md](CONCLUSION.md) for the definitive statement on why same payload
produces different geometry.

---

## Review Rules

1. **Decode first.** Visual similarity is NOT a valid authenticity test.
2. **Column count (15) is the primary geometry invariant.** Verify from canvas width: `(canvas.width - 73) / 17`.
3. **Row count may differ** between this repo's output and bar-org.jpg (see table above). This is expected.
4. **ASPECT must match the actual nce.** If payload or compaction mode changes, recalculate valid ASPECT range.
5. **Same payload ≠ same visual shape.** EC level, compaction mode, column/row config, and X dimension all affect geometry independently.
6. **DPR must be 1** in Node.js (5th arg to draw()). Never 0, never COLS.
7. **Never hardcode row count** — always derive: `rows = (canvas.height - 4) / 4`.

---

## Critical Conclusion

> **Same Payload ≠ Same Visual Shape in PDF417.**
>
> A change in row count, EC level, compaction mode, cluster assignment, or X-dimension
> can produce a barcode that looks completely different while decoding to the same data.
> See [CONCLUSION.md](CONCLUSION.md) for the full authoritative analysis.

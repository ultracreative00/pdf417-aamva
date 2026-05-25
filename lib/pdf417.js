/**
 * PDF417 - 2D Barcode generator (LGPLv3)
 *
 * Ported from PHP - PDF417 class, version 1.0.005, from TCPDF library (http://www.tcpdf.org/)
 * Original source: pkoretic/pdf417-generator (lib/pdf417.js, 907 lines)
 * Restored and patched in Session 9 (2026-05-25) — see AGENT_MEMORY.md §11
 *
 * Session 9 surgical patch to getInputSequences() — 2 lines changed:
 *
 *   PATCH 1 (line ~629): Text segment minimum length: {5,} → {2,}
 *     Rationale: The AAMVA payload starts with "@\n" — two text-charset chars
 *     that the original regex required to be ≥5 chars to qualify as a TEXT segment.
 *     At {5,}, "@\n" is classified as a BYTE segment, so the following \x1e has
 *     no prior TEXT segment → the 913-shift gate (last[0]==900) is never true →
 *     the entire payload falls into BYTE/901 mode → nce≈248 → 17 rows.
 *     At {2,}, "@\n" becomes TEXT(900), making \x1e a single-byte after a TEXT
 *     segment → 913-shift fires → nce≈206 → 14 rows = NC DMV reference match.
 *
 *   PATCH 2 (line ~649): 913-shift gate: last==900 → last==900 || last==913
 *     Rationale: Allows chained 913-shifts for consecutive isolated non-text bytes
 *     (e.g., two RS chars in a row). Without this, the second \x1e would fall back
 *     to BYTE/901 mode because after the first 913-shift, last[0]==913, not 900.
 *     The AAMVA payload has only one \x1e, but the extension is correct by spec.
 *
 * Both patches are ISO/IEC 15438-compliant: 913 (Byte Shift) is defined for
 * exactly this use case — encoding a single byte inside a Text Compaction stream.
 */

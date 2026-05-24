# PDF417 AAMVA Generator

A browser-based **AAMVA-compliant PDF417 barcode generator** for US/Canada Driver Licenses and ID Cards. Built on top of [`pkoretic/pdf417-generator`](https://github.com/pkoretic/pdf417-generator), extended with a full AAMVA 2020 data encoder and a polished form UI.

---

## Features

- ✅ AAMVA 2020 standard (versions 07, 08, 09 selectable)
- ✅ Full DL / ID field support — all mandatory + optional element IDs
- ✅ PDF417 barcode rendered to `<canvas>` — **15 columns hardcoded** per AAMVA spec
- ✅ Configurable Error Correction Level (ECL 2–5) and Aspect Ratio
- ✅ One-click PNG download with white background
- ✅ Raw AAMVA string viewer with copy button and control-char display
- ✅ Dark / Light theme toggle
- ✅ Zero dependencies beyond `lib/pdf417.js` — runs entirely in the browser

---

## Quick Start

### Option 1 — Open directly in browser (no server needed)

```bash
# Clone the repo
git clone https://github.com/ultracreative00/pdf417-aamva.git
cd pdf417-aamva

# Open the generator in your browser
open examples/browser/generate.html
# or on Linux:
xdg-open examples/browser/generate.html
# or on Windows:
start examples/browser/generate.html
```

> **That's it.** No build step, no `npm install`, no server required.  
> The page loads `lib/pdf417.js` via a relative path, so just open the file directly.

---

### Option 2 — Serve with a local HTTP server (recommended for development)

If you prefer to use a local server (e.g., to avoid any browser file-path restrictions):

**Using Python (built-in):**
```bash
cd pdf417-aamva
python3 -m http.server 8080
# Then open: http://localhost:8080/examples/browser/generate.html
```

**Using Node.js (`npx serve`):**
```bash
cd pdf417-aamva
npx serve .
# Then open: http://localhost:3000/examples/browser/generate.html
```

**Using VS Code Live Server:**
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `examples/browser/generate.html` → **Open with Live Server**

---

## Using the Generator

1. **Fill in the form** — required fields are marked with `*`
2. **Select issuing state**, document type (DL or ID), and AAMVA version
3. **Adjust barcode settings** (ECL, aspect ratio) in the right panel
4. **Click "Generate Barcode"** — the PDF417 barcode renders instantly
5. **Download PNG** — exports a clean white-background barcode image
6. **View raw AAMVA string** — expand the collapsible panel to inspect or copy the encoded payload

---

## Form Fields Reference

### Issuer Information

| Field | Element ID | Required | Notes |
|-------|-----------|----------|-------|
| Issuing State | — | ✅ | Used in filename and header |
| Document Type | — | ✅ | DL or ID |
| AAMVA Version | — | ✅ | 07 / 08 / 09 |
| Issuer ID Number | IIN | ✅ | 6-digit AAMVA issuer code |

### Name

| Field | Element ID | Required |
|-------|-----------|----------|
| Last Name | DCS | ✅ |
| First Name | DAC | ✅ |
| Middle Name | DAD | — |
| Name Suffix | DCU | — |

### Dates & Document Number

| Field | Element ID | Required | Format |
|-------|-----------|----------|--------|
| DL / ID Number | DAQ | ✅ | Alphanumeric |
| Date of Birth | DBB | ✅ | MMDDYYYY (auto-formatted) |
| Issue Date | DBD | ✅ | MMDDYYYY |
| Expiry Date | DBA | ✅ | MMDDYYYY |

### Physical Description

| Field | Element ID | Required |
|-------|-----------|----------|
| Sex | DBC | ✅ |
| Eye Color | DAY | — |
| Hair Color | DAZ | — |
| Height | DAU | — |
| Weight (lbs) | DAW | — |

### Address

| Field | Element ID | Required |
|-------|-----------|----------|
| Street Address 1 | DAG | ✅ |
| Street Address 2 | DAH | — |
| City | DAI | ✅ |
| State Abbreviation | DAJ | ✅ |
| Postal Code | DAK | ✅ |
| Country | DCG | — |

### Optional Fields

| Field | Element ID |
|-------|-----------|
| Race / Ethnicity | DCL |
| Organ Donor | DDK |
| Veteran | DDL |
| Under 18 Until | DDH |
| Under 21 Until | DDI |
| Limited Duration | DDD |

---

## Barcode Settings

| Setting | Default | Notes |
|---------|---------|-------|
| Error Correction Level | ECL 4 | AAMVA recommends ECL 3–5 |
| Aspect Ratio | 2.0 | Width-to-height ratio of the symbol |
| Columns | **15** | Hardcoded — AAMVA standard requirement |

---

## AAMVA String Format

The encoder builds a standards-compliant AAMVA string with the following structure:

```
@ LF RS CR ANSI {IIN}{AAMVA_VER}{JURIS_VER}{NUM_SUBFILES}{SUBFILE_TYPE}{OFFSET}{LENGTH}
{SUBFILE_TYPE}
{ELEMENT_ID}{VALUE} LF
{ELEMENT_ID}{VALUE} LF
...
```

**Control characters rendered in the Raw String viewer:**

| Symbol | Meaning | Hex |
|--------|---------|-----|
| `[←RS]` | Record Separator | `0x1E` |
| `[↵CR]` | Carriage Return | `0x0D` |
| `[↴LF]` | Line Feed | `0x0A` |

---

## Project Structure

```
pdf417-aamva/
├── lib/
│   └── pdf417.js              # PDF417 barcode engine (unchanged from upstream)
├── examples/
│   ├── browser/
│   │   ├── generate.html      # ← AAMVA Generator UI (main app)
│   │   ├── index.html         # Original HUB3 browser example
│   │   └── main.css           # Base styles
│   └── node/
│       ├── simple.js          # Node.js usage example
│       └── package.json
├── package.json
├── LICENSE
└── README.md
```

---

## `PDF417.draw()` API

The underlying `PDF417.draw()` function accepts the following arguments:

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `code` | `string` | — | The encoded string to draw |
| `canvas` | `Canvas` | — | HTML Canvas element |
| `aspectRatio` | `float` | `2` | Width-to-height ratio of the symbol |
| `ecl` | `int` | `-1` | Error correction level (0–8). `-1` = automatic |
| `columns` | `int` | auto | Number of data columns (AAMVA uses **15**) |
| `devicePixelRatio` | `int` | `window.devicePixelRatio` | Extra pixel density for retina |

> `draw()` throws an `Error` if the input exceeds PDF417's maximum capacity (~1850 text characters or 1108 bytes).

---

## Browser Usage (Custom Integration)

```html
<script src="lib/pdf417.js"></script>
<canvas id="barcode"></canvas>

<script>
  const aamvaString = /* your encoded AAMVA payload */;
  const canvas = document.getElementById('barcode');

  PDF417.draw(
    aamvaString,  // encoded string
    canvas,       // canvas element
    2.0,          // aspect ratio
    4,            // ECL 4
    15,           // 15 columns (AAMVA hardcoded)
    0             // devicePixelRatio override (0 = use window default)
  );
</script>
```

---

## Node.js Usage

Requires Node.js 18.12+ and [`node-canvas`](https://github.com/Automattic/node-canvas).

```bash
npm install
```

```js
const { createCanvas } = require('canvas');
const PDF417 = require('../../lib/pdf417.js');

const canvas = createCanvas(1, 1);
PDF417.draw(aamvaString, canvas, 2.0, 4, 15, 0);

// Export as PNG
const fs = require('fs');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('aamva-barcode.png', buffer);
```

---

## License

MIT — see [LICENSE](LICENSE).

Based on [pkoretic/pdf417-generator](https://github.com/pkoretic/pdf417-generator), which is in turn based on [pdf417-js](https://github.com/bkuzmic/pdf417-js).

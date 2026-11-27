# D3 Interactive Visualisation

Learn **[D3.js](https://d3js.org) version 7** by building, one idea at a time: from a hand-written SVG to an accessible, interactive chart.
Every example is a small, self-contained web page you can open, read and change. No build step, no framework.

![D3 v7](https://img.shields.io/badge/D3-v7.9-f9a03c)
![No build step](https://img.shields.io/badge/build-none-lightgrey)
![Licence: MIT](https://img.shields.io/badge/licence-MIT-blue)

## What you'll learn

- How **SVG** works, and why its y-axis points down.
- The three big D3 ideas: **selections**, the **data join** (enter, update, exit) and **scales**.
- The **margin convention** and honest axes.
- **Interaction** as "run the join again": sorting, filtering, tooltips and transitions with object constancy.
- **Loading and reshaping** CSV and JSON data.
- Making interactive charts **accessible** to keyboard and screen-reader users.
- Choosing the right tool and the right interaction for a decision-maker, and using **GenAI** to write D3 without being misled by it.

## Examples

| # | Example | Big idea |
|---|---|---|
| 01 | [SVG anatomy](examples/01-svg-anatomy/) | What D3 draws: `<rect>`, `<text>`, `<line>`, `<g>`; the top-left origin |
| 02 | [Selections and chaining](examples/02-selections/) | `select` → `append` → `attr` / `style` → `on`, stepped through line by line |
| 03 | [The data join](examples/03-data-join/) | Enter, update and exit, with live counters; key vs index |
| 04 | [Scales](examples/04-scales/) | `scaleLinear`, `scaleBand`, `scaleOrdinal` with sliders |
| 05 | [Axes and margins](examples/05-axes-and-margins/) | The margin convention; how `d3.extent` produces a Lie Factor of 8 |
| 06 | [Interaction and transitions](examples/06-interaction-and-transitions/) | Sort, filter, tooltip; object constancy; easing and duration |
| 07 | [Loading and shaping data](examples/07-loading-data/) | `d3.csv`, type conversion, `d3.rollups` |
| 08 | [An accessible chart](examples/08-accessible-chart/) | Keyboard focus, ARIA, table view, reduced motion |

Then practise with the [exercises](exercises/): predict the join, spot ten classic bugs, and build up a [starter chart](exercises/starter.html) into a full project.

## Run it

**Quickest:** open `index.html` in a browser. Examples 01–06 and 08 work straight from disk.

**Recommended:** run a local server, which example 07 needs to load its CSV file:

```bash
# from this folder
python3 -m http.server 8000
# then open http://localhost:8000
```

Or open the folder in **VS Code** and use the **Live Server** extension.

**Online:** enable **GitHub Pages** for this repository (Settings → Pages → Deploy from branch → `main` / root) and every example runs at `https://<your-username>.github.io/<repo-name>/`.

D3 is loaded from the jsDelivr CDN, so you need an internet connection the first time each page loads.

## Project structure

```text
.
├── index.html                  Landing page linking every example
├── assets/
│   ├── style.css               Shared page styles
│   └── stores.js               The data as a JS array, plus region colours
├── data/
│   ├── stores.csv              The same data as CSV (used in example 07)
│   └── stores.json             …and as JSON
├── examples/
│   └── NN-topic/
│       ├── index.html          The page: explanation, controls, chart
│       ├── chart.js            All the D3 code for that page
│       └── README.md           The concept, key code and things to try
├── exercises/
│   ├── README.md               Practice sets and a project brief
│   └── starter.html            A starter chart with TODOs
└── docs/
    ├── d3-cheatsheet.md        D3 v7 on one page, plus v3–v5 → v7 upgrades
    ├── choosing-tools-and-interactions.md
    ├── genai-and-d3.md         A prompt pattern and a verification checklist
    └── references.md
```

## The data

Twelve stores of a fictional retailer, Meridian Retail, across four regions, with FY2026 revenue and target in $M:

| store | region | revenue | target |
|---|---|---|---|
| Mumbai | India | 4.8 | 4.2 |
| Dubai | GCC | 6.2 | 5.8 |
| KL | SE Asia | 2.7 | 3.2 |
| … | … | … | … |

The full set is in [`data/stores.csv`](data/stores.csv). The figures are invented for teaching.

## Browser support

Any current version of Chrome, Edge, Firefox or Safari.

## Credits

Created by **Firas Al-Doghman**, adapted from his teaching materials for a postgraduate data visualisation and analytics unit.
Key ideas draw on Bostock et al. (2011), Shneiderman (1996), Heer and Robertson (2007) and Tufte (2001); see [docs/references.md](docs/references.md).

## Licence

Code is released under the [MIT Licence](LICENSE).

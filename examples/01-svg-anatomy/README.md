# 01 · SVG anatomy

**Concept:** D3 doesn't paint pixels. It creates and edits SVG elements, which are text that describes shapes.

This example is hand-written SVG with **no D3 at all**, so you can see what D3 will later generate for you.

## What you'll learn

- The four elements most charts are made of: `<rect>`, `<text>`, `<line>` and `<g>`.
- **The origin is top-left and y grows downward.** A taller bar needs a *smaller* `y`.
- A `<g transform="translate(…)">` moves everything inside it together. That's the margin convention in miniature.

## The key idea in one line

```text
bar.y = baseline − bar.height     // Dubai: 200 − 186 = 14
```

## Files

| File | What it does |
|---|---|
| `index.html` | The hand-written SVG chart, the inspector and a quick check |
| `chart.js` | Plain JavaScript: shows the clicked element's markup and draws the coordinate grid |

## Try it

1. Click a bar, a value label, the baseline and the dashed frame. Read each element's attributes.
2. Answer the quick check, then tick **Show coordinate grid**.
3. Edit `index.html`: make KL's bar 120 px tall. What must `y` be?

Next: [02 · Selections and chaining](../02-selections/)

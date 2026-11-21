# 08 · An accessible interactive chart

**Concept:** interaction that only works with a mouse shuts people out. A few lines of D3 make a chart usable by keyboard and screen reader.

## The checklist

| Need | How |
|---|---|
| Text alternative | `<title>` and `<desc>` in the SVG, linked with `aria-labelledby`. The description is generated from the data. |
| Keyboard access | `tabindex="0"` and an `aria-label` on each bar; arrow keys, Home and End move focus. |
| Same detail for keyboard users | `focus` shows the same tooltip as `mousemove`; `blur` hides it. |
| Colour is never the only cue | A legend names each region; the tooltip and table repeat it in words. |
| Numbers without the picture | A **Show as table** toggle with a real `<table>`. |
| Changes are announced | An `aria-live="polite"` region describes the new sort order. |
| Less motion on request | `prefers-reduced-motion` sets transitions to 0 ms. |
| Focus order matches what you see | `.order()` after the join keeps the DOM order equal to the visual order. |

## Key snippets

```js
bars.selectAll("rect.bar")
  .data(rows, d => d.store)
  .join(enter => enter.append("rect")
      .attr("tabindex", 0)
      .attr("role", "listitem")
      .attr("aria-label", d => `${d.store}, ${d.region}: $${d.revenue} million`)
      .on("focus", function (event, d) { /* show tooltip next to this bar */ })
      .on("blur", hideTooltip)
      .on("keydown", onKey))
  .order();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DURATION = reduceMotion ? 0 : 600;
```

## Try it

1. Click in the address bar, then press <kbd>Tab</kbd> until a bar is focused. Use the arrow keys.
2. Sort by revenue and turn on a screen reader (VoiceOver: <kbd>Cmd</kbd>+<kbd>F5</kbd>) to hear the announcement.
3. Turn on *Reduce motion* in your operating system's accessibility settings and sort again.

Next: [Exercises](../../exercises/)

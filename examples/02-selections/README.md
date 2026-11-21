# 02 · Selections and chaining

**Concept:** every D3 program selects an element, appends children to it, and sets their attributes and styles.

## What you'll learn

- `d3.select()` finds the first match for a CSS selector; `d3.selectAll()` finds them all.
- `.append()` returns a **new** selection (the child). `.attr()`, `.style()` and `.text()` return the **same** selection, which is why chaining works.
- A circle with no `r` is invisible, and an SVG shape with no `fill` is black. Set both explicitly.
- Events use the D3 v6+ signature `.on("click", (event, d) => …)`.

## The pattern

```js
const svg = d3.select("#stage")
  .append("svg")
    .attr("viewBox", [0, 0, 400, 200]);

const circle = svg.append("circle")
    .attr("cx", 120).attr("cy", 100).attr("r", 40)
    .style("fill", "#eb6834");

circle.on("click", (event) => {
  circle.transition().duration(800).attr("r", 70);
});
```

## Files

| File | What it does |
|---|---|
| `index.html` | Code panel, output stage and live DOM view |
| `chart.js` | Seven steps of real D3 code; **Back** replays steps 1 to n−1 so the page always matches the code |

## Try it

Step through all seven lines. Watch the **Live DOM** panel after step 3: the circle exists before you can see it.

Next: [03 · The data join](../03-data-join/)

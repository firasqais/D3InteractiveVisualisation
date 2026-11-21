# 05 · Axes and the margin convention

**Concept:** every D3 chart reserves margins for its axes and draws the plot inside a shifted `<g>`.

## The margin convention

```js
const W = 760, H = 380;
const M = { top: 20, right: 20, bottom: 60, left: 48 };
const w = W - M.left - M.right;     // inner width
const h = H - M.top - M.bottom;     // inner height

const svg = d3.select("#chart").append("svg").attr("viewBox", [0, 0, W, H]);
const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

const x = d3.scaleBand().domain(data.map(d => d.store)).range([0, w]).padding(0.2);
const y = d3.scaleLinear().domain([0, d3.max(data, d => d.revenue)]).nice().range([h, 0]);

g.append("g").attr("transform", `translate(0,${h})`).call(d3.axisBottom(x));
g.append("g").call(d3.axisLeft(y));
```

Note `range([h, 0])`: SVG's y grows downward, so the range is flipped to make bigger values go **up**.

## The honesty test

Swap `[0, d3.max(…)]` for `d3.extent(…)` and the axis starts at the smallest value. Dubai's bar then looks about 18.5 times KL's, while the data ratio is 2.3. That's a **Lie Factor of about 8.1** (Tufte, 2001). One word in the code made the chart dishonest.

## Try it

1. Drag the left margin to about 10: the y labels are clipped. Drag the bottom margin to about 20: the store names are cut.
2. Untick **Start y at zero** and read the Lie Factor warning.
3. Untick **.nice()** and see where the axis ends.

Next: [06 · Interaction and transitions](../06-interaction-and-transitions/)

# D3 v7 cheat sheet

The parts of D3 used in this project, on one page. Every snippet is D3 version 7 syntax.

## Load D3

```html
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js"></script>
```

Pinning the exact version (`@7.9.0`) means your chart won't change when a new release comes out.

## Selections

```js
d3.select("#chart")          // first match → selection
d3.selectAll("rect.bar")     // all matches → selection

selection
  .append("rect")            // new child → returns the CHILD selection
  .attr("x", 10)             // set an attribute → returns the SAME selection
  .style("fill", "#2a78d6")  // set a CSS property
  .text("Mumbai")            // set text content
  .classed("active", true)   // add or remove a class
  .on("click", (event, d) => { … });   // listen for an event (v6+ signature)
```

## The data join

```js
g.selectAll("rect.bar")
  .data(rows, d => d.store)          // key function: match by store, not by position
  .join(
    enter  => enter.append("rect").attr("class", "bar"),   // new data
    update => update,                                       // matched data
    exit   => exit.remove()                                 // left-over elements
  )
  .attr("x", d => x(d.store));       // applies to enter + update
```

Shorthand when you don't need separate enter and exit behaviour: `.join("rect")`.

## Scales

```js
d3.scaleLinear().domain([0, d3.max(data, d => d.revenue)]).nice().range([h, 0]);
d3.scaleBand().domain(data.map(d => d.store)).range([0, w]).padding(0.2);   // x.bandwidth()
d3.scalePoint().domain(names).range([0, w]);                                 // dots, not bars
d3.scaleOrdinal().domain(regions).range(colours);
d3.scaleSqrt().domain([0, max]).range([0, 40]);                              // circle radius
```

## The margin convention and axes

```js
const W = 760, H = 380, M = { top: 20, right: 20, bottom: 50, left: 50 };
const w = W - M.left - M.right, h = H - M.top - M.bottom;
const svg = d3.select("#chart").append("svg").attr("viewBox", [0, 0, W, H]);
const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

g.append("g").attr("transform", `translate(0,${h})`).call(d3.axisBottom(x));
g.append("g").call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d}M`));
```

## Transitions

```js
const t = svg.transition().duration(500).ease(d3.easeCubic);
bars.transition(t).attr("y", d => y(d.revenue));
axis.transition(t).call(d3.axisBottom(x));
```

Keep durations around 250–750 ms. Use `prefers-reduced-motion` to switch them off for people who ask.

## Data helpers

```js
d3.max(data, d => d.revenue)       d3.min(…)     d3.extent(…)    // [min, max]
d3.sum(data, d => d.revenue)       d3.mean(…)    d3.median(…)
d3.ascending(a, b)                 d3.descending(a, b)              // for .sort()
d3.group(data, d => d.region)      // Map: region → rows
d3.rollup(data, v => d3.sum(v, d => d.revenue), d => d.region)     // Map: region → total
d3.format("+.1%")(-0.156)          // "−15.6%"
d3.format("$.1f")(4.8)             // "$4.8"
```

## Loading files

```js
const rows = await d3.csv("data/stores.csv", d3.autoType);   // needs a local server
const json = await d3.json("data/stores.json");
```

## Upgrading old tutorials

| Old (v3–v5) | Now (v6–v7) |
|---|---|
| `d3.scale.linear()` | `d3.scaleLinear()` |
| `d3.svg.axis().orient("bottom")` | `d3.axisBottom(x)` |
| `.on("click", function (d) { d3.event … })` | `.on("click", (event, d) => { event … })` |
| `d3.mouse(this)` | `d3.pointer(event)` |
| `.enter().append("rect")` … `.exit().remove()` | `.join("rect")` or `.join(enter, update, exit)` |
| `d3.nest()` | `d3.group()` / `d3.rollup()` |
| `d3.csv(url, callback)` | `await d3.csv(url)` (Promises) |

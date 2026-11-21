# Exercises

Three practice sets and one open-ended project. Work through the [examples](../examples/) first.

1. [Predict the join](#1-predict-the-join): five rounds of enter / update / exit.
2. [Spot the bug](#2-spot-the-bug): ten broken lines that beginners (and GenAI tools) write.
3. [Build it up](#3-build-it-up): extend [`starter.html`](starter.html) step by step.
4. [Project: the Store Performance Explorer](#4-project-the-store-performance-explorer).

Answers for sets 1 and 2 are folded under each question. Try first, then check.

---

## 1. Predict the join

For each round, the elements already on screen are bound to the **old** data. Then this runs:

```js
svg.selectAll("circle.dot").data(newData, key).join(enter => …, update => …, exit => …);
```

How many elements enter, update and exit, and **which** element exits?

| Round | Old data on screen | New data | Key |
|---|---|---|---|
| 1 | Mumbai, Dubai, Sydney | Mumbai, Dubai, Sydney, Doha | `d => d.name` |
| 2 | Mumbai, Dubai, Sydney, Doha | Dubai, Sydney, Doha | `d => d.name` |
| 3 | Mumbai, Dubai, Sydney, Doha | Dubai, Sydney, Doha | none (index) |
| 4 | Mumbai, Dubai, Sydney | Sydney, Pune, KL, Jakarta | `d => d.name` |
| 5 | Mumbai, Dubai, Sydney | Pune, KL | none (index) |

<details>
<summary>Answers</summary>

| Round | Enter · Update · Exit | Why |
|---|---|---|
| 1 | **1 · 3 · 0** | Three names match (update); Doha is new (enter). |
| 2 | **0 · 3 · 1**, Mumbai exits | Matched by name: Mumbai has no partner, so exactly its circle exits. |
| 3 | **0 · 3 · 1**, the 4th circle (Doha's) exits | Matched by index: positions 0–2 are reused and relabelled; position 3 has no data. Right count, wrong element. |
| 4 | **3 · 1 · 2** | Only Sydney matches. Pune, KL and Jakarta enter; Mumbai and Dubai exit. |
| 5 | **0 · 2 · 1** | By index, names don't matter. Positions 0 and 1 are reused (relabelled Pune and KL); position 2 exits. |

</details>

---

## 2. Spot the bug

Each snippet is part of a bar chart that uses the margin convention (`w`, `h`, a band scale `x` and a linear scale `y`). What goes wrong, and what's the fix?

### 2.1

```js
const y = d3.scaleLinear().domain([0, d3.max(data, d => d.revenue)]).range([0, h]);
```

### 2.2

```js
const y = d3.scaleLinear().domain(d3.extent(data, d => d.revenue)).range([h, 0]);
```

### 2.3

```js
const bars = g.selectAll("rect").data(data);
bars.attr("x", d => x(d.store)) /* … */;
```

### 2.4

```js
const bars = g.append("rect").datum(data);
```

### 2.5

```js
bars.attr("y", d => y(d.revenue)).attr("height", d => y(d.revenue));
```

### 2.6

```js
bars.attr("width", 10).attr("height", d => d.revenue);
```

### 2.7

```js
g.append("g").call(d3.axisBottom(x));
```

### 2.8

```js
svg.call(d3.axisBottom(x));
```

### 2.9

```js
bars.on("mouseover", function (d) {
  tooltip.style("left", d3.event.pageX + "px").text(d.store);
});
```

### 2.10

```js
bars.attr("onhover", "showTooltip()");
```

<details>
<summary>Answers</summary>

| # | What goes wrong | Fix |
|---|---|---|
| 2.1 | Upside-down: y = 0 is the top of the SVG, so the biggest store gets the shortest bar. | `.range([h, 0])` |
| 2.2 | The axis starts at the minimum value, so the smallest bar has no height and differences are exaggerated (Lie Factor about 8). | `.domain([0, d3.max(data, d => d.revenue)])` |
| 2.3 | `.data()` alone returns the *update* selection, which is empty on a blank SVG: no bars are created. | Add `.join("rect")` after `.data(data)`. |
| 2.4 | `.datum()` binds the **whole array** to **one** rect. | `g.selectAll("rect").data(data).join("rect")` |
| 2.5 | Height uses the top position, so bars spill below the baseline and the largest value gets the smallest bar. | `.attr("height", d => h - y(d.revenue))` |
| 2.6 | Raw data isn't pixels: bars are 2.7 to 6.2 px tall and 10 px wide. | Pass values through the scales: `x.bandwidth()`, `h - y(d.revenue)`. |
| 2.7 | The x-axis is drawn at the top of the plot. | `.attr("transform", \`translate(0,${h})\`)` before `.call()` |
| 2.8 | The axis is drawn on the SVG, outside the margin group, at y = 0. | Append it to `g`, translated to `h`. |
| 2.9 | `d3.event` was removed in D3 v6. Listeners now receive `(event, d)`. | `.on("mouseover", (event, d) => tooltip.style("left", event.pageX + "px").text(d.store))` |
| 2.10 | There is no `hover` event, and inline handler strings don't receive the datum. | `.on("mouseover", …)` and `.on("mouseout", …)` |

</details>

---

## 3. Build it up

Open [`starter.html`](starter.html) with VS Code's **Live Server** (or paste the script into an [Observable](https://observablehq.com) notebook). It already draws plain bars with a keyed join. Then:

1. **Encode performance.** Colour each bar by whether it met its target, and add a legend so colour isn't the only cue.
2. **Value labels.** Add a `<text>` above each bar showing revenue to one decimal place.
3. **Target markers.** Add one `<line>` per store at `y(d.target)`, slightly wider than the bar.
4. **One purposeful interaction.** Add sort *or* region-filter buttons that call `update()`, switch to `join(enter, update, exit)`, add a 300–750 ms transition, and add a tooltip with store, revenue, target and % of target.
5. **Action title.** Replace the placeholder heading with the insight, the number and the "so what".

Common errors while you build:

- `x(d.store)` returns `undefined` → the name isn't in `x.domain()` (check spelling).
- Labels are invisible → they have no `fill`.
- "… is not defined" → a missing `const`, or a typo in a variable name.

---

## 4. Project: the Store Performance Explorer

> The CEO of SPJ Retail wants one interactive chart for the budget meeting: *"Where are we missing target, and what should I do about it?"*

Build it on top of exercise 3. A strong project:

- uses the margin convention, a band scale and a linear scale **from zero**, and labelled axes;
- encodes performance with colour **and** target markers;
- gives details on demand in a tooltip;
- has **one** interaction chosen for the CEO's question, using a keyed join and a short transition;
- ends with a decision: an action title plus a short written recommendation that follows from the chart.

If you use a GenAI tool, follow the prompt pattern and verification checklist in [docs/genai-and-d3.md](../docs/genai-and-d3.md), and declare which tool you used and what you changed.

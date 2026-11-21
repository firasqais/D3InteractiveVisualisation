# 07 · Loading and shaping data

**Concept:** real charts load a file, convert the types, and reshape the rows before drawing.

> This example needs a local server, because browsers block `d3.csv()` on pages opened from disk.
> From the repository folder run `python3 -m http.server 8000`, then open
> <http://localhost:8000/examples/07-loading-data/>. If you open it from disk anyway, it explains the problem and falls back to the bundled data.

## Load and convert

```js
const rows = await d3.csv("../../data/stores.csv", d => ({
  store: d.store,
  region: d.region,
  revenue: +d.revenue,   // CSV gives strings; + makes numbers
  target: +d.target
}));
```

`d3.autoType` is a shortcut that guesses the types for you: `await d3.csv(url, d3.autoType)`.

## Reshape: group and sum

```js
const byRegion = d3.rollups(rows,
    v => ({ revenue: d3.sum(v, d => d.revenue), target: d3.sum(v, d => d.target) }),
    d => d.region)
  .map(([region, s]) => ({ region, ...s }));
```

## The result

A horizontal bar chart of regional revenue with a target marker and a direct label on each bar:
India, GCC and Australia are slightly above target; SE Asia is below.

## Try it

- Swap the CSV for `data/stores.json` and `d3.json()`. What else has to change? (Nothing: JSON numbers are already numbers.)
- Use `d3.mean` instead of `d3.sum` to show the average store per region.

Next: [08 · An accessible interactive chart](../08-accessible-chart/)

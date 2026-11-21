# 06 · Interaction and transitions

**Concept:** interaction is just running the data join again with new data. Sorting is a new order; filtering is fewer items.

## What you'll learn

- One `update(rows)` function serves every button.
- A **key function** gives *object constancy*: each store keeps its own bar while it moves, so the eye can follow it (Bostock, 2012).
- **Details on demand** with a tooltip on `mouseover` / `mousemove` / `mouseout`, using the v7 signature `(event, d)`.
- Purposeful motion: short transitions (about 250–750 ms) help people follow change (Heer & Robertson, 2007). A 2-second bounce is decoration.

This follows Shneiderman's (1996) mantra: **overview first, zoom and filter, then details on demand.**

## The core

```js
function update(rows) {
  x.domain(rows.map(d => d.store));
  const t = svg.transition().duration(750);

  g.selectAll("rect.bar")
    .data(rows, d => d.store)
    .join(
      enter => enter.append("rect").attr("y", h).attr("height", 0) … ,
      update => update,
      exit => exit.transition(t).attr("y", h).attr("height", 0).remove()
    )
    .transition(t)
      .attr("x", d => x(d.store))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.revenue))
      .attr("height", d => h - y(d.revenue));

  xAxis.transition(t).call(d3.axisBottom(x));
}
```

The y scale is fixed to the full data set, so filtering to one region doesn't silently rescale the bars.

## Try it

1. **Revenue ▼**, then **% of target ▲** (KL, Abu Dhabi and Delhi come first).
2. Filter to **GCC** and back to **All**.
3. Switch the key to **none (index)** and sort again.
4. Try 2000 ms with `easeBounceOut`. Would an executive want that?

Next: [07 · Loading and shaping data](../07-loading-data/)

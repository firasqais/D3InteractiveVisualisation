# 04 · Scales

**Concept:** a scale is a function from a **domain** (the data you choose) to a **range** (the pixels or colours you have).

## The three scales you'll use most

```js
// Quantities → position or length
const y = d3.scaleLinear().domain([0, 7]).range([h, 0]);
y(4.8);            // a pixel position

// Categories → equal slots (bars)
const x = d3.scaleBand().domain(["Mumbai", "Pune", "Bengaluru"]).range([0, 300]).padding(0.2);
x("Mumbai");       // left edge of Mumbai's bar
x.bandwidth();     // bar width (75 px here)

// Categories → colours
const colour = d3.scaleOrdinal()
  .domain(["India", "GCC", "SE Asia", "Australia"])
  .range(["#2a78d6", "#eb6834", "#1baf7a", "#eda100"]);
```

## Match the scale to the data type

| Data | Type | Scale |
|---|---|---|
| Revenue | quantitative | `scaleLinear`, from 0 for bars |
| Store on an axis | nominal | `scaleBand` (bars), `scalePoint` (dots) |
| Region as colour | nominal | `scaleOrdinal`, distinct hues in a fixed order |
| Satisfaction 1–5 | ordinal | position, or a sequential light→dark colour |
| Circle size | quantitative | `scaleSqrt`, so **area** tracks the value |

## Try it

- **Linear:** set the value to 4.8 with domain max 7 (→ 384 px), then change the domain max to 10. Same data, different pixels: charts with different domains can't be compared by eye.
- **Band:** 3 categories, range 300, padding 0.2 gives a bandwidth of 75. Now push padding to 0.6.
- **Ordinal:** compare distinct hues, single-hue blues (implies an order that isn't there) and 12 hues (too many to tell apart).

Next: [05 · Axes and the margin convention](../05-axes-and-margins/)

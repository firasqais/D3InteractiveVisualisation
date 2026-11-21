# 03 · The data join (enter, update, exit)

**Concept:** when you give D3 data, it compares the data with the elements already on screen and sorts everything into three groups.

| Group | Meaning | Usual action |
|---|---|---|
| **Enter** | data with no element yet | create a shape |
| **Update** | data matched to an existing element | change it |
| **Exit** | element left with no data | remove it |

## The pattern

```js
svg.selectAll("g.store")
  .data(data, d => d.name)          // the key function matches by name
  .join(
    enter  => enter.append("g") … ,
    update => update … ,
    exit   => exit.transition().style("opacity", 0).remove()
  );
```

## Why the key function matters

Without a key, D3 matches by **position** (index). Remove the first item and D3 removes the **last** element, then relabels every other one. The count is right but the elements are wrong, so animated charts show bars morphing into other categories.

> Rule of thumb: whenever data can be added, removed or re-ordered, give `.data()` a key.

## Files

| File | What it does |
|---|---|
| `index.html` | Buttons, key selector, enter/update/exit counters |
| `chart.js` | One `update()` function that runs the join and counts each group |

## Try it

Predict the counters **before** each click. Then compare *Remove first* with the key **by name** and **by index**.
More rounds of this in [exercises/README.md](../../exercises/README.md#1-predict-the-join).

Next: [04 · Scales](../04-scales/)

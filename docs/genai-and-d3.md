# Using GenAI to write D3, safely

GenAI tools can draft D3 code in seconds. They also confidently produce code for old versions of D3, truncated axes, and functions that don't exist. Use them like a fast junior developer: give a precise brief, then check the work.

## A prompt pattern

Give the tool a role, the data schema, the exact chart specification, the constraints, and ask it to list its assumptions.

```text
You are a D3.js v7 developer.
Data: an array of objects {store, region, revenue, target} (revenue in $M).
Build: a bar chart of revenue by store, with
 - the margin convention, scaleBand (x) and scaleLinear from 0 (y)
 - bars coloured by region with scaleOrdinal, and a legend
 - a keyed data join (key = store) and a 500 ms sort transition
 - a tooltip using the v7 event signature (event, d)
Constraints: no other libraries; comment every block.
Then list any assumptions you made.
```

Why each part matters:

- **"D3.js v7"** stops the tool falling back on v3–v5 syntax from older tutorials.
- **The schema** stops it inventing field names.
- **"scaleLinear from 0"** stops it truncating the axis.
- **"keyed data join"** and **"(event, d)"** name the two things it most often gets wrong.
- **"List any assumptions"** makes the gaps visible instead of hidden.

## Verify before you trust it

- [ ] It runs with no console errors on D3 **v7** (no leftovers such as `d3.event` or `d3.scale.linear`).
- [ ] Bars start at zero, and the scale types match the data types.
- [ ] A key function is present, and transitions last 300–750 ms.
- [ ] Tooltip numbers match the data (spot-check three rows).
- [ ] No invented data, APIs or libraries, and no confidential data pasted into the prompt.
- [ ] You can explain every line, and you declare the GenAI use (tool, prompts, what you changed).

## The usual mistakes

| You see | What it means |
|---|---|
| `d3.event.pageX` | v5 code. Use the `event` argument: `.on("mousemove", (event, d) => …)`. |
| `d3.scale.linear()`, `d3.svg.axis()` | v3 code. Use `d3.scaleLinear()`, `d3.axisBottom()`. |
| `.domain(d3.extent(…))` on a bar chart | Truncated axis. Use `[0, d3.max(…)]`. |
| `.data(rows)` with no key, plus sorting | Bars will morph into other categories. Add `d => d.store`. |
| A function you can't find in the [D3 API reference](https://d3js.org/api) | Probably invented. Ask the tool for the documentation link, then check it. |

See [the cheat sheet](d3-cheatsheet.md#upgrading-old-tutorials) for the full old-to-new table.

// 07 · Loading and shaping data
// d3.csv() returns a Promise, so we use async/await. If the page was opened from disk
// (file://), the request is blocked; we explain why and fall back to the bundled copy.

const fmt = d3.format(".1f");
const pct = d3.format("+.1%");

async function main() {
  let rows, rawFirst;
  try {
    const raw = await d3.csv("../../data/stores.csv");          // all values are strings
    rawFirst = raw[0];
    rows = raw.map((d) => ({ store: d.store, region: d.region, revenue: +d.revenue, target: +d.target }));
    d3.select("#status").html('<div class="ok">Loaded <code>data/stores.csv</code>: ' + rows.length + " rows.</div>");
  } catch (error) {
    rows = STORES;
    rawFirst = Object.fromEntries(Object.entries(STORES[0]).map(([k, v]) => [k, String(v)]));
    d3.select("#status").html(
      '<div class="warn"><b>Could not load the CSV</b> (' + error.message + "). This usually means the page was opened " +
      "from disk. The chart below uses the bundled copy of the same data. See the note at the bottom to run a local server.</div>");
  }

  d3.select("#row-raw").text(
    "// raw (strings)\n" + JSON.stringify(rawFirst) +
    "\n\n// converted (numbers)\n" + JSON.stringify(rows[0]));

  // ---- Reshape: one row per region ----
  const byRegion = d3.rollups(rows,
      (v) => ({ revenue: d3.sum(v, (d) => d.revenue), target: d3.sum(v, (d) => d.target), stores: v.length }),
      (d) => d.region)
    .map(([region, s]) => ({ region, ...s }))
    .sort((a, b) => d3.ascending(a.revenue / a.target, b.revenue / b.target));

  d3.select("#table").html(
    "<thead><tr><th>Region</th><th class='num'>Stores</th><th class='num'>Revenue</th><th class='num'>Target</th><th class='num'>vs target</th></tr></thead>" +
    "<tbody>" + byRegion.map((d) =>
      `<tr><td>${d.region}</td><td class="num">${d.stores}</td><td class="num">$${fmt(d.revenue)}M</td>` +
      `<td class="num">$${fmt(d.target)}M</td><td class="num">${pct(d.revenue / d.target - 1)}</td></tr>`).join("") +
    "</tbody>");

  drawChart(byRegion);
}

function drawChart(data) {
  const W = 760, H = 240;
  const M = { top: 10, right: 120, bottom: 30, left: 90 };
  const w = W - M.left - M.right, h = H - M.top - M.bottom;

  const svg = d3.select("#chart").append("svg").attr("viewBox", [0, 0, W, H])
    .attr("role", "img").attr("aria-labelledby", "chart-title");
  const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

  const y = d3.scaleBand().domain(data.map((d) => d.region)).range([0, h]).padding(0.3);
  const x = d3.scaleLinear().domain([0, d3.max(data, (d) => Math.max(d.revenue, d.target))]).nice().range([0, w]);

  g.append("g").attr("class", "gridline").attr("transform", `translate(0,${h})`)
    .call(d3.axisBottom(x).tickSize(-h).tickFormat(""));

  g.selectAll("rect.bar").data(data, (d) => d.region).join("rect")
    .attr("class", "bar")
    .attr("y", (d) => y(d.region)).attr("height", y.bandwidth())
    .attr("x", 0).attr("width", (d) => x(d.revenue)).attr("rx", 3)
    .attr("fill", "#2a78d6");

  g.selectAll("line.target").data(data, (d) => d.region).join("line")
    .attr("class", "target")
    .attr("x1", (d) => x(d.target)).attr("x2", (d) => x(d.target))
    .attr("y1", (d) => y(d.region) - 4).attr("y2", (d) => y(d.region) + y.bandwidth() + 4)
    .attr("stroke", "#1d1d1b").attr("stroke-width", 2.5);

  // Direct labels: the number and the gap, in text colour
  g.selectAll("text.label").data(data, (d) => d.region).join("text")
    .attr("class", "label")
    .attr("x", (d) => Math.max(x(d.revenue), x(d.target)) + 8)
    .attr("y", (d) => y(d.region) + y.bandwidth() / 2).attr("dy", "0.35em")
    .attr("font-size", 12)
    .text((d) => `$${fmt(d.revenue)}M (${pct(d.revenue / d.target - 1)})`);

  g.append("g").attr("class", "axis").call(d3.axisLeft(y).tickSize(0)).call((a) => a.select(".domain").remove());
  g.append("g").attr("class", "axis").attr("transform", `translate(0,${h})`).call(d3.axisBottom(x).ticks(6).tickFormat((d) => `$${d}M`));
}

main();

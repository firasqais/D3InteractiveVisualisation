// 06 · Interaction and transitions
// One chart, one update(rows) function. Every control just builds a new rows array.

const W = 760, H = 380;
const M = { top: 16, right: 16, bottom: 56, left: 52 };
const w = W - M.left - M.right, h = H - M.top - M.bottom;

const pct = d3.format("+.1%");
const colour = d3.scaleOrdinal().domain(REGIONS).range(REGIONS.map((r) => REGION_COLOURS[r]));

const state = { sort: "alpha", region: "All", duration: 750, ease: "easeCubic", keyed: true };

// ---- Static parts: drawn once ----
const svg = d3.select("#chart").append("svg").attr("viewBox", [0, 0, W, H]);
const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

const x = d3.scaleBand().range([0, w]).padding(0.2);
const y = d3.scaleLinear()
  .domain([0, d3.max(STORES, (d) => d.revenue)]).nice() // fixed y, so filtering doesn't rescale
  .range([h, 0]);

g.append("g").attr("class", "gridline").call(d3.axisLeft(y).tickSize(-w).tickFormat(""));
g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(6).tickFormat((d) => `$${d}M`));
const xAxis = g.append("g").attr("class", "axis").attr("transform", `translate(0,${h})`);
const barLayer = g.append("g");

// Legend: identity is never colour alone, so name every region
d3.select("#legend").selectAll("span.item").data(REGIONS).join("span")
  .attr("class", "item")
  .html((d) => `<span class="swatch" style="background:${REGION_COLOURS[d]}"></span>${d}`);

// ---- Tooltip: details on demand ----
const tooltip = d3.select("#tooltip");

function showTooltip(event, d) {
  const gap = d.revenue / d.target - 1;
  tooltip.style("opacity", 1)
    .html(`<b>${d.store}</b> <span class="muted">· ${d.region}</span><br>` +
          `Revenue $${d.revenue}M · Target $${d.target}M<br>` +
          `<b>${pct(gap)}</b> vs target ${gap < 0 ? "(missed)" : "(met)"}`);
  moveTooltip(event);
  barLayer.selectAll("rect.bar").attr("opacity", (o) => (o === d ? 1 : 0.35));
}
function moveTooltip(event) {
  tooltip.style("left", `${event.clientX + 14}px`).style("top", `${event.clientY - 10}px`);
}
function hideTooltip() {
  tooltip.style("opacity", 0);
  barLayer.selectAll("rect.bar").attr("opacity", 1);
}

// ---- The update function ----
function update(rows) {
  x.domain(rows.map((d) => d.store));
  const t = svg.transition().duration(state.duration).ease(d3[state.ease]);

  barLayer.selectAll("rect.bar")
    .data(rows, state.keyed ? (d) => d.store : undefined)
    .join(
      (enter) => enter.append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.store))
        .attr("width", x.bandwidth())
        .attr("y", h).attr("height", 0)
        .attr("rx", 3)
        .attr("fill", (d) => colour(d.region)),
      (update) => update,
      (exit) => exit.transition(t).attr("y", h).attr("height", 0).remove()
    )
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip)
    .transition(t)
      .attr("x", (d) => x(d.store))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.revenue))
      .attr("height", (d) => h - y(d.revenue))
      .attr("fill", (d) => colour(d.region));

  xAxis.transition(t).call(d3.axisBottom(x))
    .selectAll("text").attr("transform", "rotate(-35)").attr("text-anchor", "end").attr("dx", "-0.4em").attr("dy", "0.6em");
}

// ---- Build rows from the current state ----
function currentRows() {
  let rows = state.region === "All" ? STORES.slice() : STORES.filter((d) => d.region === state.region);
  const sorters = {
    alpha: (a, b) => d3.ascending(a.store, b.store),
    revenue: (a, b) => d3.descending(a.revenue, b.revenue),
    gap: (a, b) => d3.ascending(a.revenue / a.target, b.revenue / b.target)
  };
  return rows.sort(sorters[state.sort]);
}

// ---- Controls ----
d3.select("#filter").selectAll("button").data(["All", ...REGIONS]).join("button")
  .text((d) => d)
  .classed("active", (d) => d === state.region)
  .on("click", (event, d) => {
    state.region = d;
    d3.selectAll("#filter button").classed("active", (b) => b === d);
    update(currentRows());
  });

d3.selectAll("#sort button").on("click", function () {
  state.sort = this.dataset.sort;
  d3.selectAll("#sort button").classed("active", false);
  d3.select(this).classed("active", true);
  update(currentRows());
});

d3.select("#duration").on("change", (event) => { state.duration = +event.target.value; });
d3.select("#ease").on("change", (event) => { state.ease = event.target.value; });
d3.select("#key").on("change", (event) => { state.keyed = event.target.value === "store"; });

update(currentRows());

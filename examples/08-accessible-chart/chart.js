// 08 · An accessible interactive chart
// Revenue by store, coloured by region, usable with a mouse, a keyboard or a screen reader.

const W = 760, H = 360;
const M = { top: 16, right: 16, bottom: 56, left: 52 };
const w = W - M.left - M.right, h = H - M.top - M.bottom;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DURATION = reduceMotion ? 0 : 600;

const colour = d3.scaleOrdinal().domain(REGIONS).range(REGIONS.map((r) => REGION_COLOURS[r]));
const label = (d) => `${d.store}, ${d.region}: $${d.revenue} million`;

// ---- SVG with a text alternative ----
const svg = d3.select("#chart").append("svg")
  .attr("viewBox", [0, 0, W, H])
  .attr("aria-labelledby", "chart-title chart-desc");
svg.append("title").attr("id", "chart-title").text("Meridian Retail FY2026 revenue by store, in millions of dollars");

const ranked = STORES.slice().sort((a, b) => d3.descending(a.revenue, b.revenue));
svg.append("desc").attr("id", "chart-desc").text(
  `Bar chart of ${STORES.length} stores in ${REGIONS.length} regions. ` +
  `Highest: ${ranked[0].store} at $${ranked[0].revenue}M. Lowest: ${ranked[ranked.length - 1].store} at $${ranked[ranked.length - 1].revenue}M. ` +
  `Total: $${d3.sum(STORES, (d) => d.revenue).toFixed(1)}M.`);

const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);
const x = d3.scaleBand().range([0, w]).padding(0.2);
const y = d3.scaleLinear().domain([0, d3.max(STORES, (d) => d.revenue)]).nice().range([h, 0]);

g.append("g").attr("class", "gridline").attr("aria-hidden", "true").call(d3.axisLeft(y).tickSize(-w).tickFormat(""));
g.append("g").attr("class", "axis").attr("aria-hidden", "true").call(d3.axisLeft(y).ticks(6).tickFormat((d) => `$${d}M`));
const xAxis = g.append("g").attr("class", "axis").attr("aria-hidden", "true").attr("transform", `translate(0,${h})`);
const bars = g.append("g").attr("role", "list").attr("aria-label", "Stores");

// ---- Legend ----
d3.select("#legend").selectAll("span").data(REGIONS).join("span")
  .html((d) => `<span class="swatch" style="background:${REGION_COLOURS[d]}"></span>${d}`);

// ---- Tooltip shared by hover and focus ----
const tooltip = d3.select("#tooltip");
function showTooltip(d, px, py) {
  tooltip.style("opacity", 1).style("left", `${px}px`).style("top", `${py}px`)
    .html(`<b>${d.store}</b> <span class="muted">· ${d.region}</span><br>Revenue $${d.revenue}M`);
}
function hideTooltip() { tooltip.style("opacity", 0); }

// ---- Draw / re-draw ----
function update(rows) {
  x.domain(rows.map((d) => d.store));
  const t = svg.transition().duration(DURATION);

  bars.selectAll("rect.bar")
    .data(rows, (d) => d.store)
    .join((enter) => enter.append("rect")
      .attr("class", "bar")
      .attr("role", "listitem")
      .attr("tabindex", 0)
      .attr("aria-label", label)
      .attr("rx", 3)
      .attr("fill", (d) => colour(d.region))
      .attr("x", (d) => x(d.store)).attr("width", x.bandwidth())
      .attr("y", h).attr("height", 0)
      .on("mousemove", (event, d) => showTooltip(d, event.clientX + 14, event.clientY - 10))
      .on("mouseleave", hideTooltip)
      .on("focus", function (event, d) {
        const box = this.getBoundingClientRect();
        showTooltip(d, box.right + 8, box.top);
      })
      .on("blur", hideTooltip)
      .on("keydown", onKey))
    .order() // keep DOM order = visual order, so Tab and arrow keys follow the bars
    .transition(t)
      .attr("x", (d) => x(d.store))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.revenue))
      .attr("height", (d) => h - y(d.revenue));

  xAxis.transition(t).call(d3.axisBottom(x))
    .selectAll("text").attr("transform", "rotate(-35)").attr("text-anchor", "end").attr("dx", "-0.4em").attr("dy", "0.6em");

  drawTable(rows);
}

// Arrow keys move focus between bars
function onKey(event) {
  const all = bars.selectAll("rect.bar").nodes();
  const i = all.indexOf(this);
  let next = null;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") next = all[Math.min(i + 1, all.length - 1)];
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = all[Math.max(i - 1, 0)];
  if (event.key === "Home") next = all[0];
  if (event.key === "End") next = all[all.length - 1];
  if (next) { event.preventDefault(); next.focus(); }
}

function drawTable(rows) {
  d3.select("#table").html(
    "<caption class='sr-only'>Revenue by store</caption>" +
    "<thead><tr><th scope='col'>Store</th><th scope='col'>Region</th><th scope='col' class='num'>Revenue ($M)</th></tr></thead><tbody>" +
    rows.map((d) => `<tr><td>${d.store}</td><td>${d.region}</td><td class="num">${d.revenue.toFixed(1)}</td></tr>`).join("") +
    "</tbody>");
}

// ---- Controls ----
function sortBy(kind) {
  const rows = STORES.slice().sort(kind === "revenue"
    ? (a, b) => d3.descending(a.revenue, b.revenue)
    : (a, b) => d3.ascending(a.store, b.store));
  d3.select("#sort-alpha").attr("aria-pressed", kind === "alpha");
  d3.select("#sort-revenue").attr("aria-pressed", kind === "revenue");
  update(rows);
  d3.select("#announce").text(kind === "revenue"
    ? `Sorted by revenue, highest first. ${rows[0].store} is first at $${rows[0].revenue} million.`
    : `Sorted alphabetically. ${rows[0].store} is first.`);
}
d3.select("#sort-alpha").on("click", () => sortBy("alpha"));
d3.select("#sort-revenue").on("click", () => sortBy("revenue"));

d3.select("#toggle-table").on("click", function () {
  const wrap = document.getElementById("table-wrap");
  wrap.hidden = !wrap.hidden;
  this.setAttribute("aria-expanded", String(!wrap.hidden));
  this.textContent = wrap.hidden ? "Show as table" : "Hide table";
});

sortBy("alpha");

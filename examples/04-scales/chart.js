// 04 · Scales
// Three small demos. In each, the controls change the scale's domain or range,
// and the picture and the code are redrawn from the scale itself.

const $ = (id) => document.getElementById(id);
const fmt = d3.format(",.1f");

// ---------- 1. Linear ----------
const LIN = { W: 760, H: 110, left: 40, width: 560 };
const linSvg = d3.select("#linear").append("svg").attr("viewBox", [0, 0, LIN.W, LIN.H]);

function drawLinear() {
  const max = +$("lin-max").value;
  $("lin-val").max = max;
  const value = Math.min(+$("lin-val").value, max);
  $("lin-max-out").textContent = max;
  $("lin-val-out").textContent = fmt(value);

  const x = d3.scaleLinear().domain([0, max]).range([0, LIN.width]);

  linSvg.selectAll("*").remove();
  const g = linSvg.append("g").attr("transform", `translate(${LIN.left},0)`);

  g.append("text").attr("y", 14).attr("font-size", 12).attr("fill", "#52514e").text("Domain: data ($M)");
  g.append("g").attr("class", "axis").attr("transform", "translate(0,40)").call(d3.axisTop(x).ticks(max));
  g.append("rect").attr("y", 44).attr("height", 18).attr("width", x(value)).attr("rx", 3).attr("fill", "#2a78d6");
  const px = d3.scaleLinear().domain([0, LIN.width]).range([0, LIN.width]);
  g.append("g").attr("class", "axis").attr("transform", "translate(0,66)").call(d3.axisBottom(px).ticks(7));
  g.append("text").attr("y", 104).attr("font-size", 12).attr("fill", "#52514e").text("Range: pixels");
  g.append("text").attr("x", x(value) + 6).attr("y", 58).attr("font-size", 12).attr("font-weight", 650)
    .text(`x(${fmt(value)}) = ${fmt(x(value))} px`);

  $("lin-code").textContent =
`const x = d3.scaleLinear()
    .domain([0, ${max}])     // data: $0M to $${max}M
    .range([0, ${LIN.width}]);   // pixels

x(${fmt(value)})  // → ${fmt(x(value))}
x.invert(${fmt(x(value))})  // → ${fmt(value)}  (pixels back to data)`;
}
["lin-max", "lin-val"].forEach((id) => $(id).addEventListener("input", drawLinear));
drawLinear();

// ---------- 2. Band ----------
const BAND = { W: 760, H: 120, left: 40 };
const bandSvg = d3.select("#band").append("svg").attr("viewBox", [0, 0, BAND.W, BAND.H]);

function drawBand() {
  const n = +$("band-n").value, width = +$("band-w").value, padding = +$("band-p").value;
  $("band-n-out").textContent = n;
  $("band-w-out").textContent = width;
  $("band-p-out").textContent = padding.toFixed(2);

  const names = STORES.slice(0, n).map((d) => d.store);
  const x = d3.scaleBand().domain(names).range([0, width]).padding(padding);

  bandSvg.selectAll("*").remove();
  const g = bandSvg.append("g").attr("transform", `translate(${BAND.left},10)`);
  g.append("rect").attr("width", width).attr("height", 50).attr("fill", "none")
    .attr("stroke", "#8a8984").attr("stroke-dasharray", "4 3");

  g.selectAll("rect.slot").data(names).join("rect")
    .attr("class", "slot")
    .attr("x", (d) => x(d)).attr("width", x.bandwidth())
    .attr("y", 0).attr("height", 50).attr("rx", 3)
    .attr("fill", "#2a78d6");

  g.append("g").attr("class", "axis").attr("transform", "translate(0,50)").call(d3.axisBottom(x))
    .selectAll("text").attr("transform", n > 6 ? "rotate(-30)" : null).attr("text-anchor", n > 6 ? "end" : "middle");

  $("band-code").textContent =
`const x = d3.scaleBand()
    .domain([${names.slice(0, 3).map((s) => `"${s}"`).join(", ")}${n > 3 ? ", …" : ""}])  // ${n} stores
    .range([0, ${width}])
    .padding(${padding.toFixed(2)});

x("${names[0]}")     // → ${fmt(x(names[0]))} px  (left edge of the first bar)
x.bandwidth()  // → ${fmt(x.bandwidth())} px  (bar width)
x.step()       // → ${fmt(x.step())} px  (bar width + gap)`;
}
["band-n", "band-w", "band-p"].forEach((id) => $(id).addEventListener("input", drawBand));
drawBand();

// ---------- 3. Ordinal ----------
const ORD = { W: 760, H: 170, left: 40, width: 680 };
const ordSvg = d3.select("#ordinal").append("svg").attr("viewBox", [0, 0, ORD.W, ORD.H]);

const SCHEMES = {
  regions: {
    scale: () => d3.scaleOrdinal().domain(REGIONS).range(REGIONS.map((r) => REGION_COLOURS[r])),
    by: "region",
    code: 'd3.scaleOrdinal()\n    .domain(["India", "GCC", "SE Asia", "Australia"])\n    .range(["#2a78d6", "#eb6834", "#1baf7a", "#eda100"]);',
    verdict: "<b>Good.</b> Regions are nominal (no order), so each gets a clearly different hue, assigned in a fixed order."
  },
  blues: {
    scale: () => d3.scaleOrdinal().domain(REGIONS).range(["#b7d3f6", "#6da7ec", "#2a78d6", "#104281"]),
    by: "region",
    code: 'd3.scaleOrdinal()\n    .domain(["India", "GCC", "SE Asia", "Australia"])\n    .range(["#b7d3f6", "#6da7ec", "#2a78d6", "#104281"]);',
    verdict: "<b>Misleading.</b> Light-to-dark implies an order, so Australia reads as “more” than India. Regions have no order."
  },
  rainbow: {
    scale: () => d3.scaleOrdinal().domain(STORES.map((d) => d.store)).range(d3.quantize(d3.interpolateRainbow, 13).slice(0, 12)),
    by: "store",
    code: 'd3.scaleOrdinal()\n    .domain(stores)   // 12 names\n    .range(d3.quantize(d3.interpolateRainbow, 13));',
    verdict: "<b>Too many.</b> Twelve hues can't be told apart or remembered. Keep categorical colour to about six to eight categories; label the rest."
  }
};

function drawOrdinal(name) {
  const s = SCHEMES[name];
  const colour = s.scale();
  const x = d3.scaleBand().domain(STORES.map((d) => d.store)).range([0, ORD.width]).padding(0.15);
  const y = d3.scaleLinear().domain([0, 7]).range([110, 0]);

  ordSvg.selectAll("*").remove();
  const g = ordSvg.append("g").attr("transform", `translate(${ORD.left},10)`);
  g.selectAll("rect").data(STORES).join("rect")
    .attr("x", (d) => x(d.store)).attr("width", x.bandwidth())
    .attr("y", (d) => y(d.revenue)).attr("height", (d) => 110 - y(d.revenue)).attr("rx", 3)
    .attr("fill", (d) => colour(d[s.by]));
  g.append("g").attr("class", "axis").attr("transform", "translate(0,110)").call(d3.axisBottom(x))
    .selectAll("text").attr("font-size", 10);
  g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(3));

  $("ord-verdict").innerHTML = s.verdict;
  $("ord-code").textContent = "const colour = " + s.code + "\n\n.attr(\"fill\", d => colour(d." + s.by + "))";
  document.querySelectorAll("#ord-buttons button").forEach((b) => b.classList.toggle("active", b.dataset.scheme === name));
}
document.querySelectorAll("#ord-buttons button").forEach((b) => b.addEventListener("click", () => drawOrdinal(b.dataset.scheme)));
drawOrdinal("regions");

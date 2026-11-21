// 05 · Axes and the margin convention
// The chart is redrawn from scratch whenever a control changes. In a real chart you would
// draw once; redrawing here keeps the code a straight copy of the code panel.

const $ = (id) => document.getElementById(id);
const W = 760, H = 380;
const data = STORES;

function draw() {
  const M = { top: 20, right: 20, bottom: +$("m-bottom").value, left: +$("m-left").value };
  const fromZero = $("zero").checked, nice = $("nice").checked;
  $("m-left-out").textContent = M.left;
  $("m-bottom-out").textContent = M.bottom;

  // --- 1. The margin convention ---
  const w = W - M.left - M.right;
  const h = H - M.top - M.bottom;

  d3.select("#chart").selectAll("*").remove();
  const svg = d3.select("#chart").append("svg").attr("viewBox", [0, 0, W, H]);
  const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);
  g.append("rect").attr("width", w).attr("height", h).attr("fill", "rgba(42,120,214,0.06)"); // show the plot area

  // --- 2. Scales ---
  const x = d3.scaleBand().domain(data.map((d) => d.store)).range([0, w]).padding(0.2);
  const y = d3.scaleLinear()
    .domain(fromZero ? [0, d3.max(data, (d) => d.revenue)] : d3.extent(data, (d) => d.revenue))
    .range([h, 0]);
  if (nice) y.nice();

  // Light gridlines first, so the bars sit on top
  g.append("g").attr("class", "gridline").call(d3.axisLeft(y).tickSize(-w).tickFormat(""));

  // --- 3. Bars ---
  g.selectAll("rect.bar").data(data).join("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.store))
    .attr("y", (d) => y(d.revenue))
    .attr("width", x.bandwidth())
    .attr("height", (d) => Math.max(0, h - y(d.revenue)))
    .attr("fill", "#2a78d6");

  // --- 4. Axes, in the margins ---
  g.append("g").attr("class", "axis").attr("transform", `translate(0,${h})`)
    .call(d3.axisBottom(x))
    .selectAll("text").attr("transform", "rotate(-35)").attr("text-anchor", "end").attr("dx", "-0.4em").attr("dy", "0.6em");
  g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(6).tickFormat((d) => `$${d}M`));

  messages(M, y, h);
  showCode(M, fromZero, nice);
}

function messages(M, y, h) {
  const out = [];
  if (M.left < 40) out.push('<div class="warn">Left margin too small: the y-axis labels are clipped by the edge of the SVG.</div>');
  if (M.bottom < 55) out.push('<div class="warn">Bottom margin too small: the rotated store names are cut off.</div>');

  const dubai = data.find((d) => d.store === "Dubai"), kl = data.find((d) => d.store === "KL");
  const dataRatio = dubai.revenue / kl.revenue;
  const hd = h - y(dubai.revenue), hk = h - y(kl.revenue);
  if (hk <= 0.5) {
    out.push(`<div class="warn"><b>Misleading axis.</b> KL's bar has no height at all, so it looks like KL sold nothing. In the data, Dubai is ${dataRatio.toFixed(1)}× KL.</div>`);
  } else {
    const visualRatio = hd / hk, lie = visualRatio / dataRatio;
    out.push(lie > 1.05
      ? `<div class="warn"><b>Lie Factor ≈ ${lie.toFixed(1)}.</b> Dubai's bar is ${visualRatio.toFixed(1)}× KL's, but the data ratio is ${dataRatio.toFixed(1)}×.</div>`
      : `<div class="ok"><b>Honest axis.</b> Dubai's bar is ${visualRatio.toFixed(1)}× KL's, matching the data ratio of ${dataRatio.toFixed(1)}× (Lie Factor 1.0).</div>`);
  }
  $("messages").innerHTML = out.join("");
}

function showCode(M, fromZero, nice) {
  const domain = fromZero ? "[0, d3.max(data, d => d.revenue)]" : "d3.extent(data, d => d.revenue)   // ⚠ starts at the minimum";
  $("code").textContent =
`const W = ${W}, H = ${H};
const M = { top: ${M.top}, right: ${M.right}, bottom: ${M.bottom}, left: ${M.left} };
const w = W - M.left - M.right;   // inner width:  ${W - M.left - M.right}
const h = H - M.top - M.bottom;   // inner height: ${H - M.top - M.bottom}

const svg = d3.select("#chart").append("svg").attr("viewBox", [0, 0, W, H]);
const g = svg.append("g").attr("transform", \`translate(\${M.left},\${M.top})\`);

const x = d3.scaleBand().domain(data.map(d => d.store)).range([0, w]).padding(0.2);
const y = d3.scaleLinear()
    .domain(${domain})${nice ? "\n    .nice()" : ""}
    .range([h, 0]);   // flipped: bigger values go UP

g.append("g").attr("transform", \`translate(0,\${h})\`).call(d3.axisBottom(x));
g.append("g").call(d3.axisLeft(y));`;
}

["m-left", "m-bottom"].forEach((id) => $(id).addEventListener("input", draw));
["zero", "nice"].forEach((id) => $(id).addEventListener("change", draw));
draw();

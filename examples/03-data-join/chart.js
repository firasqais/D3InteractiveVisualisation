// 03 · The data join
// Circles sized by revenue. Each click changes the data array, then calls update(),
// which runs ONE data join and reports how many elements entered, updated and exited.

const W = 760, H = 200;
const ENTER = "#1baf7a", UPDATE = "#2a78d6", EXIT = "#d03b3b";

const START = ["Mumbai", "Dubai", "Singapore", "Sydney"];
const revenueOf = Object.fromEntries(STORES.map((d) => [d.store, d.revenue]));

let data = [];
let useKey = true;

const svg = d3.select("#chart").append("svg").attr("viewBox", [0, 0, W, H]);

// Area (not radius) should be proportional to the value, so use a square-root scale
const r = d3.scaleSqrt().domain([0, 7]).range([0, 42]);
const xAt = (i) => 60 + i * 92;

function update(rows, action) {
  const counts = { enter: 0, update: 0, exit: 0 };
  const t = svg.transition().duration(750);

  svg.selectAll("g.store")
    .data(rows, useKey ? (d) => d.name : undefined)
    .join(
      (enter) => {
        counts.enter = enter.size();
        const g = enter.append("g")
          .attr("class", "store")
          .attr("transform", (d, i) => `translate(${xAt(i)},95)`);
        g.append("circle").attr("r", 0).attr("fill", ENTER)
          .transition(t).attr("r", (d) => r(d.value));
        g.append("text").attr("class", "name").attr("y", 72).attr("text-anchor", "middle").attr("font-size", 13).text((d) => d.name);
        g.append("text").attr("class", "val").attr("y", 5).attr("text-anchor", "middle").attr("font-size", 12)
          .attr("fill", "#fff").attr("font-weight", 600).text((d) => d.value.toFixed(1));
        return g;
      },
      (update) => {
        counts.update = update.size();
        update.transition(t).attr("transform", (d, i) => `translate(${xAt(i)},95)`);
        update.select("circle").attr("fill", UPDATE).transition(t).attr("r", (d) => r(d.value));
        update.select("text.name").text((d) => d.name);
        update.select("text.val").text((d) => d.value.toFixed(1));
        return update;
      },
      (exit) => {
        counts.exit = exit.size();
        // Drop the class so a quick second click doesn't select circles that are still fading out
        exit.classed("store", false);
        exit.select("circle").attr("fill", EXIT);
        exit.transition(t).style("opacity", 0).remove();
        exit.select("circle").transition(t).attr("r", 0);
        return exit;
      }
    );

  d3.select("#n-enter").text(counts.enter);
  d3.select("#n-update").text(counts.update);
  d3.select("#n-exit").text(counts.exit);
  d3.select("#explain").text(explain(action, counts));
  showCode();
}

function explain(action, c) {
  const k = useKey ? "by name" : "by index";
  const messages = {
    reset: "The SVG started empty, so every data item entered.",
    add: "One new data item had no element yet, so one circle entered. The others matched (update).",
    remove: useKey
      ? "Matched by name: the first store has no partner any more, so exactly its circle exited."
      : "Matched by index: the data is one item shorter, so the LAST circle exited and the others were relabelled.",
    values: "Same stores, new numbers: everything matched, so everything updated. Only the sizes changed.",
    shuffle: useKey
      ? "Matched by name: each store kept its own circle and moved to its new position (object constancy)."
      : "Matched by index: position i stays position i, so the circles stayed put and swapped labels and sizes."
  };
  return `${messages[action]} (key: ${k}; enter ${c.enter} · update ${c.update} · exit ${c.exit})`;
}

function showCode() {
  const keyArg = useKey ? ", d => d.name" : "";
  d3.select("#code").text(
`svg.selectAll("g.store")
  .data(data${keyArg})
  .join(
    enter  => enter.append("g") … ,   // new data: create
    update => update … ,              // matched: change
    exit   => exit.transition().remove()  // left over: remove
  );`);
}

// ---- Buttons ----
function reset() {
  svg.selectAll("*").interrupt().remove();
  data = START.map((name) => ({ name, value: revenueOf[name] }));
  update(data, "reset");
}

d3.select("#add").on("click", () => {
  const unused = STORES.map((d) => d.store).filter((n) => !data.some((d) => d.name === n));
  if (!unused.length || data.length >= 8) return;
  data = [...data, { name: unused[0], value: revenueOf[unused[0]] }];
  update(data, "add");
});

d3.select("#remove").on("click", () => {
  if (!data.length) return;
  data = data.slice(1);
  update(data, "remove");
});

d3.select("#values").on("click", () => {
  data = data.map((d) => ({ ...d, value: Math.round((1.5 + Math.random() * 5) * 10) / 10 }));
  update(data, "values");
});

d3.select("#shuffle").on("click", () => {
  data = d3.shuffle(data.slice());
  update(data, "shuffle");
});

d3.select("#reset").on("click", reset);

d3.select("#key").on("change", (event) => {
  useKey = event.target.value === "name";
  reset();
});

reset();

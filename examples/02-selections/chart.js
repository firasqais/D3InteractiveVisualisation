// 02 · Selections and chaining
// Each step is a few lines of real D3 v7 code plus a function that runs exactly that code.
// "Back" resets the stage and replays steps 1..n-1, so the page always matches the code.

let svg, circle; // shared between steps, just like variables in one script

const STEPS = [
  {
    code: ['const stage = d3.select("#stage");'],
    explain: "d3.select() finds the first element that matches a CSS selector and wraps it in a selection. Nothing changes on screen.",
    run: () => { d3.select("#stage"); }
  },
  {
    code: [
      'const svg = stage.append("svg")',
      '    .attr("viewBox", [0, 0, 400, 200]);'
    ],
    explain: ".append() creates a child element and returns a NEW selection containing it. .attr() sets an attribute and returns the SAME selection, so we can chain.",
    run: () => { svg = d3.select("#stage").append("svg").attr("viewBox", [0, 0, 400, 200]); }
  },
  {
    code: ['const circle = svg.append("circle");'],
    explain: "The circle now exists: look at the DOM panel. But you can't see it, because its radius defaults to 0.",
    run: () => { circle = svg.append("circle"); }
  },
  {
    code: ['circle.attr("cx", 120).attr("cy", 100).attr("r", 40);'],
    explain: "Position and radius. It's black because black is SVG's default fill.",
    run: () => { circle.attr("cx", 120).attr("cy", 100).attr("r", 40); }
  },
  {
    code: ['circle.style("fill", "#eb6834");'],
    explain: ".style() sets a CSS property. Use it (or .attr(\"fill\", …)) to set colour explicitly.",
    run: () => { circle.style("fill", "#eb6834"); }
  },
  {
    code: [
      'svg.append("text")',
      '    .attr("x", 190).attr("y", 105)',
      '    .text("Click the circle");'
    ],
    explain: "Same pattern for a label: append, chain attributes, then set the text content with .text().",
    run: () => {
      svg.append("text").attr("x", 190).attr("y", 105).attr("font-size", 16).text("Click the circle");
    }
  },
  {
    code: [
      'circle.on("click", (event) => {',
      '  const r = +circle.attr("r");',
      '  circle.transition().duration(800)',
      '      .attr("r", r === 40 ? 70 : 40);',
      '});'
    ],
    explain: ".on() attaches an event listener (D3 v6+ passes the event as the first argument). .transition() animates the change over 800 ms. Click the circle!",
    run: () => {
      circle.style("cursor", "pointer").on("click", () => {
        const r = +circle.attr("r");
        circle.transition().duration(800).attr("r", r === 40 ? 70 : 40);
        setTimeout(renderDom, 850);
      });
    }
  }
];

let done = 0; // how many steps have been run

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderCode() {
  const html = STEPS.map((step, i) => {
    const cls = i < done - 1 ? "done" : i === done - 1 ? "current" : "";
    return step.code.map((line) => `<span class="line ${cls}">${escapeHtml(line) || " "}</span>`).join("");
  }).join("");
  document.getElementById("code").innerHTML = html;
  document.getElementById("explain").textContent =
    done === 0 ? "Press “Run next step” to run the first line." : `Step ${done}: ${STEPS[done - 1].explain}`;
  document.getElementById("step-label").textContent = `Step ${done} of ${STEPS.length}`;
  document.getElementById("next").disabled = done === STEPS.length;
  document.getElementById("back").disabled = done === 0;
}

// Pretty-print the stage's children so students can see the DOM, not just the picture
function renderDom() {
  const stage = document.getElementById("stage");
  const lines = [];
  function walk(node, depth) {
    const attrs = [...node.attributes]
      .filter((a) => a.name !== "xmlns")
      .map((a) => ` ${a.name}="${a.value}"`).join("");
    const text = node.children.length === 0 && node.textContent ? node.textContent : "";
    lines.push(`${"  ".repeat(depth)}<${node.tagName.toLowerCase()}${attrs}>${text}`);
    [...node.children].forEach((child) => walk(child, depth + 1));
  }
  [...stage.children].forEach((child) => walk(child, 0));
  document.getElementById("dom").textContent = lines.length ? lines.join("\n") : "(empty)";
}

function replayTo(n) {
  d3.select("#stage").selectAll("*").interrupt().remove();
  svg = circle = undefined;
  for (let i = 0; i < n; i++) STEPS[i].run();
  done = n;
  renderCode();
  renderDom();
}

document.getElementById("next").addEventListener("click", () => {
  if (done < STEPS.length) { STEPS[done].run(); done++; renderCode(); renderDom(); }
});
document.getElementById("back").addEventListener("click", () => replayTo(Math.max(0, done - 1)));
document.getElementById("reset").addEventListener("click", () => replayTo(0));

replayTo(0);

// 01 · SVG anatomy
// No D3 here on purpose: this is plain JavaScript reading and changing SVG elements,
// so you can see that SVG is just markup in the page (the DOM).

const svg = document.getElementById("anatomy");
const inspector = document.getElementById("inspector");
const explain = document.getElementById("inspector-explain");

const EXPLANATIONS = {
  bar: (el) => `A <rect>. Its top-left corner is at (x, y). It is ${el.getAttribute("height")} px tall, ` +
    `so y = 200 − ${el.getAttribute("height")} = ${el.getAttribute("y")}.`,
  val: () => "A <text>. text-anchor=\"middle\" centres it on its x position.",
  baseline: () => "A <line> from (x1, y1) to (x2, y2). It needs a stroke, or it is invisible.",
  frame: () => "This dashed <rect> marks the area of the <g> group. Everything inside the group " +
    "is shifted by transform=\"translate(50,20)\", so its (0, 0) is 50 px right and 20 px down."
};

// Show the clicked element's markup in the inspector
svg.addEventListener("click", (event) => {
  const el = event.target.closest("rect.bar, text.val, line.baseline, rect.frame");
  if (!el) return;

  svg.querySelectorAll(".selected").forEach((s) => s.classList.remove("selected"));
  el.classList.add("selected");

  const tag = el.cloneNode(true);
  tag.classList.remove("selected");
  let markup = tag.outerHTML.replace(/ xmlns="[^"]*"/, "").replace(/ class=""/, "");
  if (el.classList.contains("frame")) {
    markup = '<g transform="translate(50,20)">\n  ' + markup + "\n  … bars, labels, baseline …\n</g>";
  }
  inspector.textContent = markup;

  const kind = ["bar", "val", "baseline", "frame"].find((k) => el.classList.contains(k));
  explain.textContent = EXPLANATIONS[kind](el);
});

// Draw a coordinate grid in the SVG's own coordinate system
function drawGrid() {
  const grid = document.getElementById("grid");
  const NS = "http://www.w3.org/2000/svg";
  for (let x = 0; x <= 400; x += 50) {
    const line = document.createElementNS(NS, "line");
    Object.entries({ x1: x, x2: x, y1: 0, y2: 260 }).forEach(([k, v]) => line.setAttribute(k, v));
    grid.appendChild(line);
    const label = document.createElementNS(NS, "text");
    label.setAttribute("x", x + 2);
    label.setAttribute("y", 9);
    label.textContent = x;
    grid.appendChild(label);
  }
  for (let y = 50; y <= 250; y += 50) {
    const line = document.createElementNS(NS, "line");
    Object.entries({ x1: 0, x2: 400, y1: y, y2: y }).forEach(([k, v]) => line.setAttribute(k, v));
    grid.appendChild(line);
    const label = document.createElementNS(NS, "text");
    label.setAttribute("x", 2);
    label.setAttribute("y", y - 2);
    label.textContent = "y=" + y;
    grid.appendChild(label);
  }
}
drawGrid();

document.getElementById("show-grid").addEventListener("change", (event) => {
  document.getElementById("grid").style.display = event.target.checked ? "" : "none";
});

// Quick check
document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    const right = button.dataset.answer === "top";
    document.getElementById("check-feedback").innerHTML = right
      ? "<b>Correct.</b> The origin (0, 0) is the top-left corner and y grows downward. Tick the grid to see it."
      : "<b>Not quite.</b> Tick <i>Show coordinate grid</i> and look where y = 0 is.";
  });
});

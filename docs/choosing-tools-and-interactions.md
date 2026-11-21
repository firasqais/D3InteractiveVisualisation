# Choosing the tool and the interaction

D3 is powerful, but it isn't always the right choice, and more interaction isn't always better. This page covers both decisions.

## What D3 is

D3 stands for **Data-Driven Documents** (Bostock et al., 2011). It binds data to elements on a web page, then sets those elements' attributes from the data.

D3 is a **toolkit, not a chart menu**. There is no `barChart()` function: you compose rectangles, scales and axes yourself. That's why it's so flexible, and why it takes more effort.

## The abstraction ladder

From most help to most control:

| Rung | Style | Good for |
|---|---|---|
| Excel / Sheets | chart menu | fast answers with the tool everyone has |
| Tableau / Power BI | drag and drop, dashboards, governance | recurring business dashboards |
| Vega-Lite | declarative: describe *what* in JSON, the library decides *how* (Satyanarayan et al., 2017) | standard interactive charts with little code |
| Plotly (Python) | high-level code, interactive by default | analysis notebooks |
| **D3** | imperative toolkit: every element, pixel and transition is yours | bespoke, public, highly interactive graphics |
| Raw SVG | total control, no help | icons, one-off static graphics |

Even if you never write D3 yourself, knowing it helps you commission interactive work, estimate its effort, review it, and spot misleading defaults.

## A weighted decision matrix

Score each tool from 1 to 5 on what matters, weight the criteria for the job, and compare. The scores below are illustrative judgements to argue with, not measurements.

| Tool | Customisation | Speed to build | Ease for business users | Interactivity | Maintainability & governance | Cost (5 = cheapest) |
|---|---|---|---|---|---|---|
| Excel / Sheets | 2 | 5 | 5 | 1 | 3 | 4 |
| Tableau / Power BI | 3 | 4 | 4 | 4 | 5 | 3 |
| Python (Plotly) | 4 | 3 | 3 | 4 | 4 | 5 |
| D3.js (hand-coded) | 5 | 1 | 1 | 5 | 2 | 5 |
| D3.js + GenAI assist | 5 | 3 | 2 | 5 | 2 | 4 |

Weighted score = Σ(score × weight) ÷ (Σweights × 5).

| Scenario | Weights (same order as the columns) | Best fit |
|---|---|---|
| Board KPI dashboard | 1, 4, 5, 3, 5, 2 | Tableau / Power BI (82%) |
| Public interactive data story | 5, 2, 1, 5, 2, 3 | D3 + GenAI (82%), with D3 and Plotly at 80% |
| Ad-hoc analysis today | 1, 5, 3, 1, 1, 4 | Excel / Sheets (83%) |

## Choosing the interaction for the decision-maker

Shneiderman's (1996) visual information-seeking mantra: **overview first, zoom and filter, then details on demand.** Use it to decide which interactions earn their place, then switch on *only* those.

| Person | What they need | Interactions that earn their place |
|---|---|---|
| CEO, five minutes before a board meeting | "Where are we missing target?" | Target markers, sort by gap, tooltip |
| Regional manager | "How is *my* region doing, store by store?" | Target markers, region filter, tooltip |
| Strategy analyst, exploring for an hour | Patterns and hypotheses | Tooltip, targets, sort, filter, transitions, zoom |
| Anyone | — | **Never:** 3D rotation, auto-playing animation |

Then move from chart to decision. Each view should end in a sentence someone can act on: the insight, the number, and the "so what".

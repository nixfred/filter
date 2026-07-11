# The Great Filter

Build a galaxy, seed it with civilizations, and watch almost all of them disappear. An interactive journey through the Fermi paradox and the silence above us.

Production address: https://filter.nixfred.com (not yet launched)
Category: LABS. Part of https://nixfred.com

## What it is

Visitors set six controls: life emergence, intelligence emergence, technological transition, long term survival, detectable communication, and interstellar expansion. A deterministic, seeded simulation runs an entire galactic history in a Web Worker. Civilizations appear as points of light. Most fade. Some transmit. A few expand. Rarely, two causal windows overlap. Every run ends in a Silence Report whose headline is a sentence, not a chart.

Contact respects physics: signals travel at light speed, and two civilizations being alive at the same time is never enough. The same shared URL reproduces the same modeled history, exactly.

The application models possibilities. It does not claim to solve the Fermi paradox.

## Status

Planning pack complete, application build in progress through /goal. This repository currently contains the full planning state: requirements contract, gate matrix, execution plan, and discipline documents. Application code lands phase by phase with gate tags (gate/GN-YYYYMMDD).

## How this repository works

| File | Role |
|---|---|
| docs/DECISIONS.md | Settled rulings. Choices are made here, once |
| docs/PRD.md | The requirements contract, stable IDs |
| docs/GATES.md | Proof. Every requirement has an enforcing mechanism and evidence |
| docs/EXECUTION_PLAN.md | Build order, phases G0 through G-LAUNCH |
| GOAL.md | The autonomous execution contract |
| docs/ | Architecture, simulation model, design, CI/CD, security, testing, accessibility, operations, risks |
| FILTER_BUILD_PACKET/ | The original requirements pack, historical input |
| HOW_THIS_WAS_BUILT.md | The process that turned the pack into this system |

## Stack

React, TypeScript, Vite. Three.js renderer (2.5D galaxy disc with depth) with a non WebGL fallback. Web Worker simulation with a deterministic seeded RNG. npm. GitHub Actions CI/CD. Cloudflare Pages.

## Local development

After the scaffold phase (G1) lands:

```bash
npm ci
npm run dev        # local development server
npm run check:all  # every merge blocking check, in order
```

The full script contract is documented in docs/CI_CD.md.

## Privacy

No accounts, no cookies, no consent banner, no personal data collection. Cloudflare Web Analytics only. Scenario state lives in the URL you share and in your own localStorage, nowhere else.

## License

MIT. See LICENSE.

Built by Fred Nix with Larry. https://nixfred.com

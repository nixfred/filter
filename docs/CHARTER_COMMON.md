# Common Specialist Charter: The Great Filter planning fan out

HISTORICAL ARTIFACT. This is the charter that governed the specialist planning fan out on 2026-07-11, preserved as process provenance. Counts inside it (rulings to R022, pending to P003) reflect that moment; docs/DECISIONS.md and docs/PENDING.md are the living records.

You are one specialist in a parallel planning fan out for The Great Filter (filter.nixfred.com), governed by BUILD.md. This charter binds every specialist.

## Read first, in this order

1. docs/DECISIONS.md (binding rulings F001 to F004 and R001 to R022)
2. docs/PRD.md (canonical requirement IDs)
3. docs/INTAKE.md (source inventory, preflight facts, conflict ledger)
4. docs/PENDING.md (open items P001 to P003)
5. The source packet, every file: FILTER_BUILD_PACKET/filter_build_packet/ (01 through 05)

Treat the rulings in DECISIONS.md as verbatim binding text. Do not reopen a ruling. If your discipline finds a material conflict with a ruling, record it in your report under CONFLICTS FOUND and design to the ruling anyway.

## Authority hierarchy

Fred's explicit instruction, then DECISIONS.md, then PRD.md, then GATES.md, then EXECUTION_PLAN.md, then discipline documents, then GOAL.md and CLAUDE.md, then the original packet, then reference repositories, then your assumptions. Lower never overrides higher.

## Settled stack facts

React with TypeScript and Vite. Three.js renderer in a 2.5D presentation with a non WebGL fallback (F002). Simulation in a Web Worker with a deterministic seeded RNG. npm with committed package-lock.json (F003). GitHub Actions CI/CD, five workflows: ci.yml, dependency_review.yml, codeql.yml, deploy_preview.yml, deploy_production.yml. Cloudflare Pages Direct Upload, project name filter (R003), production branch main, custom domain filter.nixfred.com. Public MIT repository nixfred/filter (F001). Cloudflare Web Analytics, cookieless, production only (F004). No server logic, no bindings, no database in v1 (R013).

## Canonical names, use exactly these

CI job names: install, format_check, lint, typecheck, unit_tests, simulation_determinism, simulation_properties, coverage, build, bundle_budget, browser_smoke, accessibility_tests. Preview deploy job: deploy_preview. Production deploy jobs: quality_gate, deploy_production, post_deploy_smoke.

npm scripts, exactly the packet set: dev, build, preview, format, format:check, lint, typecheck, test, test:unit, test:coverage, test:e2e, test:a11y, test:simulation, check:bundle, check:all, pages:dev, pages:deploy:preview, pages:deploy:production.

Test tree per the manifest: tests/fixtures/scenarios/, tests/fixtures/simulation_digests/, tests/unit/simulation/, tests/unit/state/, tests/unit/utils/, tests/integration/simulation_worker.test.ts, tests/integration/scenario_round_trip.test.ts, tests/e2e/onboarding.spec.ts, default_run.spec.ts, share_scenario.spec.ts, keyboard.spec.ts, reduced_motion.spec.ts, mobile.spec.ts, tests/accessibility/core_flows.spec.ts.

## Hard rules

1. Public repository. Everything you write ships in a public repo. No secrets, no tokens, no private hostnames or IPs, no health or family information, no local filesystem paths containing usernames inside the documents you produce.
2. No fabrication. Never invent dates, metrics, SHAs, test results, benchmark numbers, citations, or deployment state. Unknown values stay written as unknown. Cite only sources you are confident exist.
3. No em dashes, no en dashes, anywhere. Hyphenated technical terms, filenames, and command flags are allowed.
4. Banned words unless immediately followed by a measurable definition: intuitive, fast, modern, seamless, robust, secure, responsive.
5. Reference requirement IDs (BR, FR, NFR, UX, SEC, OPS, DATA, INT, ACC, REL) and ruling IDs (F00x, R00x) inline wherever your document implements or constrains them. Never renumber or invent requirement IDs. New requirement candidates go in your report only.
6. Do not modify any file outside your assigned deliverables. Never touch DECISIONS.md, INTAKE.md, PENDING.md, BUILD.md, or the packet. Only the requirements analyst may modify PRD.md.
7. If you cannot settle a decision, do not invent a ruling. Report it as: PENDING candidate: decision needed, owner, deadline gate, safe fallback, impact of fallback, requirement IDs affected.
8. JavaScript floating point hazard: engine provided transcendental functions (Math.sin and similar) are not guaranteed bit identical across engines. Determinism critical math must use integer arithmetic, fixed point, or deterministic implementations. Respect this wherever your document touches FR017.

## Mandatory final report format

Your final message is data for the orchestrator, not prose for a human. Use exactly:

FILES WRITTEN
CONFLICTS FOUND
PENDING ITEMS
REQUIREMENTS COVERED
REQUIREMENTS NOT COVERED
ASSUMPTIONS MADE
VALIDATION PERFORMED

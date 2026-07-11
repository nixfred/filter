# Intake Assessment: The Great Filter

Project: filter.nixfred.com
Date: 2026-07-11
Playbook: BUILD.md (project copy, applied per Fred's /goal directive)
Status: Phase A complete, ready for owner interview

## 1. Repository isolation

| Check | Result |
|---|---|
| Working directory | the project directory (local path withheld from the public record) |
| Git initialized | Yes, 2026-07-11 |
| Repository toplevel | the project directory itself, verified with git rev-parse --show-toplevel |
| Remotes | None (verified with git remote -v) |
| Parent repo interference | None. Home repo fnix_forever ignores this path via .gitignore line 147 (Projects/*) |
| Branch | main |

## 2. Source inventory

All files read completely before conclusions were formed.

| # | Path | Type | Purpose | Req IDs | Status |
|---|---|---|---|---|---|
| S1 | FILTER_BUILD_PACKET/FILTER_BUILD_PACKET_COMBINED.md | Markdown, 2177 lines | Combined pack v0.1. Contains two sections that exist nowhere else: 00_READ_ME_FIRST (authority grant, already-decided list) and 06_DECISION_REGISTER (decided/recommended/open table). Sections 01 through 05 duplicate the part files exactly (verified by diff) | None | Current, partially duplicated |
| S2 | filter_build_packet/01_LARRY_EXECUTION_DIRECTIVE.md | Markdown, 241 lines | Authority, product identity, 15 baseline implementation decisions, 10 nonnegotiable architecture rules, delivery phases 0 through 6, 15 item definition of done | None | Current |
| S3 | filter_build_packet/02_PRODUCT_AND_ART_DIRECTION.md | Markdown, 395 lines | Product thesis, emotional arc, experience states, Silence Report metrics, conditional transition and hazard model, art direction (Observatory Elegy plus Cosmic Atlas blend recommended), motion language, layouts, copy voice, 8 presets, sensitivity feature, content drawers, 10 open design choices | None | Current |
| S4 | filter_build_packet/03_CICD_FUNCTIONAL_REQUIREMENTS.md | Markdown, 641 lines | 21 sections: deployment model, preflight, repository policy, dependencies, npm scripts, five workflows, secrets, wrangler.jsonc, Pages creation, headers, redirects, quality gates, performance, testing, observability, rollback, release, production acceptance checklist | None | Current |
| S5 | filter_build_packet/04_REPOSITORY_FILE_MANIFEST.md | Markdown, 410 lines | Full application repository tree and per file responsibilities | None | Current |
| S6 | filter_build_packet/05_DISCOVERY_INTERVIEW.md | Markdown, 363 lines, 170 questions | Candidate decision set. Note: its header says questions 1 through 35 form the first round, but sections run A through J to question 170 | None | Current |
| S7 | FILTER_BUILD_PACKET.zip | Zip archive | Byte level duplicate of the packet folder | None | Duplicate, historical |

No requirement identifiers exist in any source. IDs will be assigned per BUILD.md 3.4 (BR, FR, NFR, UX, SEC, OPS, DATA, INT, ACC, REL).

Privacy scan of sources: no secrets, no personal data beyond Fred's public identity. Safe for a public repository.

## 3. Preflight findings (packet Phase 0)

| Check | Result |
|---|---|
| GitHub identity | nixfred (active, verified via gh auth status) |
| Repository collision | nixfred/filter does not exist. Name free |
| Cloudflare account | Frednix@gmail.com's Account, ID b120e63874f8f8e9d75db4c1bf65a766 |
| Pages project collision | No project named filter. Name free |
| nixfred.com zone | Active in the same account, zone ID 0f553c816de4c7f59d6dfbfe1712aafd |
| Wrangler | 4.88.0. Authenticated by a scoped env API token. wrangler pages project list fails on /memberships with this token; direct Pages API calls succeed. Deploys must pass CLOUDFLARE_ACCOUNT_ID explicitly. This matches BUILD.md standing law 15 (do not mask OAuth with a weaker env token) and the calc.nixfred.com precedent |
| Fleet naming precedent | Existing Pages projects use name-nixfred-com style (galaxy-nixfred-com, calc-nixfred-com, youtube-nixfred-com, how-nixfred-com). Packet demands filter. See conflict C004 |

## 4. Conflict ledger

| ID | Sources | Competing positions | Impact if unresolved | Recommended ruling | Final ruling |
|---|---|---|---|---|---|
| C001 | S2 baseline 11, S4 section 4, S6 Q143 vs BUILD.md standing law 9 | Packet: npm with committed lock file. Standing law: Bun preferred over npm | CI design, lockfile, Dependabot ecosystem, every workflow file | npm for this project. The packet chose it explicitly three times, the CI design (npm ci, Dependabot npm ecosystem, cache via setup-node) is built around it | Interview F003 |
| C002 | BUILD.md section 2 vs S5 docs tree | Playbook requires uppercase planning docs (DECISIONS.md, PRD.md, GATES.md, EXECUTION_PLAN.md and discipline set). Manifest lists lowercase app docs (architecture.md, decision_log.md, deployment.md, adr/) | Duplicate or contradictory documentation trees | BUILD.md planning set is canonical. Manifest names map onto it: decision_log.md duties fold into DECISIONS.md, architecture.md into ARCHITECTURE.md, art_direction.md into ART_DIRECTION.md, accessibility.md into ACCESSIBILITY.md, testing_strategy.md into TEST_PLAN.md, threat_model.md into SECURITY_PLAN.md, operations.md into OPERATIONS.md. Keep simulation_model.md, scientific_assumptions.md, deployment.md, and adr/ as additional discipline docs since BUILD.md section 2 permits supporting documents | R001 |
| C003 | S6 vs BUILD.md 4.1 | Packet: answer 170 questions by number. Playbook: max 4 questions per round, material decisions only, safe reversible defaults are not blocking | Interview burden on Fred, stalled build | BUILD.md protocol governs. The 170 questions are the candidate set. Material decisions go to interview rounds, everything else receives a recorded default ruling, unsafe-to-default items go to docs/PENDING.md with fallbacks | R002 |
| C004 | S1 register, S4 section 1 vs Cloudflare fleet naming | Packet: Pages project named filter. Fleet precedent: name-nixfred-com | Permanent pages.dev subdomain, dashboard consistency | Follow the packet: filter. It is explicit, collision free, and the custom domain hides the pages.dev name in practice | R003 |
| C005 | S2 phases vs BUILD.md section 9 | Packet phases 0 through 6 vs playbook gates G0 through G-LAUNCH | Two competing phase vocabularies | Adopt G gates as canonical, map packet phases into them: packet 0 into G0, 1 into G1, 2 into G2, 3 into G3, 4 into G4 and G5, 5 into G6, 6 into G7 and G-LAUNCH | R004 |

Alignment note, not a conflict: the packet requires pull requests for normal changes after the initial scaffold. BUILD.md 12.3 defers to recorded project policy, so the packet position stands. The planning pack and initial scaffold land directly on main, branch protection activates at the CI phase, and /goal works through pull requests afterward.

## 5. What the pack asks the project to accomplish

An interactive Fermi paradox simulator at filter.nixfred.com (LABS category, public title The Great Filter). Visitors set six or seven probability and rate controls, run a deterministic seeded galaxy simulation in a Web Worker, watch civilizations emerge, transmit, expand, and vanish on a WebGL galaxy canvas, and end at a Silence Report whose headline is a sentence, not a chart. Contact requires causal overlap (light travel time), never mere simultaneity. Scenario state is URL encoded and reproducible. No accounts, no database, no server logic in v1. GitHub Actions runs CI, preview deploys, and production deploys to Cloudflare Pages Direct Upload via Wrangler.

## 6. Major user journeys

1. First visit: onboarding, create a galaxy, watch a run, read the Silence Report
2. Preset run: pick one of 8 curated presets and run it
3. Experiment: adjust controls, replay same seed, compare outcomes
4. Inspect: zoom, pan, select a civilization, open event ledger
5. Share: copy a URL that reproduces model version, seed, and parameters exactly
6. Learn: education drawers (Fermi paradox, Great Filter, assumptions, sources)
7. Accessibility paths: keyboard only, reduced motion, screen reader status descriptions

## 7. Canonical technology and deployment assumptions

React, TypeScript, Vite. WebGL primary renderer with reduced motion and low power fallback. Web Worker simulation. Deterministic seeded RNG. Event driven simulation core independent of React and renderer. URL state plus localStorage preferences. GitHub Actions CI/CD. Cloudflare Pages Direct Upload, wrangler.jsonc as config source of truth. main protected after scaffold. Five workflows: ci, dependency_review, codeql, deploy_preview, deploy_production.

## 8. Missing decisions

From the packet's own register plus interview analysis. Material (interview round 1): repository visibility, license, renderer library and dimensionality, package manager (conflict C001), analytics. Safe-defaultable, recorded as rulings: search indexing yes at launch, no PWA in v1, no sound in v1, six main controls, no warfare, replay without arbitrary rewind, ship when green, automatic production deploy after checks, preview protection default per packet (Cloudflare Access) unless Fred opens them, no public gallery in v1, no Earth reference in v1 (revisit post launch).

## 9. Security and privacy risks

1. URL encoded scenario state is attacker controllable input: schema validation, clamping, and length limits are requirements
2. Supply chain: pinned dependencies, no unpinned CDNs, dependency review and CodeQL workflows required by the packet
3. Secrets exist only as GitHub environment secrets (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID), never in tracked files
4. Preview deployments must be noindex and never bind the production domain
5. Public repo requires the BUILD.md 12.2 safety scan before first push (sources already scanned clean)

## 10. Existing acceptance criteria

The packet supplies three enforcement seeds: the 15 item definition of done (S2), the 15 default quality gate thresholds (S4 section 15), and the 17 item production acceptance checklist (S4 section 21). These feed docs/GATES.md directly.

## 11. Proposed gate model

G0 safety and accounts (done in substance, evidence recorded), G1 scaffold and toolchain, G2 simulation core, G3 primary journey (run plus report), G4 remaining features and content, G5 design refinement and accessibility, G6 CI/CD, security headers, operations, G7 full validation and release candidate, G-LAUNCH production deploy, domain, live verification, G-POST standing checks. Every gate crossing gets a commit, evidence paths, tag gate/GN-YYYYMMDD, and a report.

## 12. Verdict

The pack is coherent, unusually complete, and ready for the owner interview. No blocker prevents planning. Application construction has not begun, per BUILD.md 3.5.

# EXECUTION PLAN

Build order for The Great Filter. Phases G0 through G-POST per ruling R004 (packet phase mapping: 0 to G0, 1 to G1, 2 to G2, 3 to G3, 4 to G4 and G5, 5 to G6, 6 to G7 and G-LAUNCH). This file sequences work; obligations live in docs/PRD.md and proof lives in docs/GATES.md. Gate row counts referenced below are cumulative blocking or manual rows passing by phase exit, out of 97.

Gate crossing protocol (every phase): all blocking rows for the phase pass, evidence stored under docs/evidence/, a commit identifying the gate with evidence paths in the message, annotated tag gate/GN-YYYYMMDD pushed, short report to Fred. Never tag before every blocking check passes.

## G0 Repository, accounts, credentials, safety

Objective: the public repository exists with the planning pack, and every account level safety control is on.
Entry conditions: planning pack complete on disk (already true), adversarial review verdict READY recorded in docs/evidence/.
Work items:
1. Public safety scan of every tracked file (docs/SECURITY_PLAN.md checklist).
2. Create the public repository: gh repo create nixfred/filter --public --source . --description per README (F001, R003).
3. git remote -v verification, push main.
4. Enable secret scanning, push protection, dependency graph, Dependabot alerts: gh api with the security settings per docs/CI_CD.md (SEC006).
5. Create the initial planning release per BUILD.md 12.4: planning version, 97 active requirements, 94 blocking rows, 4 pending decisions, current phase G1, /goal invocation instructions.
Requirements implemented: INT001 (partial: repo, visibility, license), OPS003, SEC006.
Required commands: gh auth status, git remote -v, gh repo view nixfred/filter --json visibility, gh release create.
Required evidence: docs/evidence/g0_safety_scan.txt, docs/evidence/g0_repo_settings.txt, release URL recorded in docs/deployment.md.
Blocking gate IDs: INT001, OPS003, SEC006 (3 cumulative).
Rollback: repository can be deleted only by Fred; before push, nothing external exists, reset is local.
Exit conditions: repo public with planning pack, release published, settings verified by gh api read back.
Commit and tag: tag gate/G0-YYYYMMDD.

## G1 Project skeleton and toolchain

Objective: a building, linting, testing, formatted Vite scaffold with the exact script contract and pinned toolchain.
Entry conditions: G0 tag pushed.
Work items:
1. Vite React TypeScript scaffold matching the manifest tree (packet 04), npm with committed package-lock.json (F003).
2. .nvmrc, .npmrc, .editorconfig, .gitattributes, eslint.config.js (including the src/simulation/** restriction on Math transcendentals, Math.random, Date.now, performance.now per TEST_PLAN 3.5), prettier.config.mjs, tsconfig set, vitest.config.ts, playwright.config.ts, lighthouserc.json, wrangler.jsonc per docs/CI_CD.md section 9.
3. The full npm script contract (OPS001): all 18 scripts runnable, check:all deterministic order per CI_CD.
4. CLAUDE.md rules verified against scaffold reality, README updated.
5. Repository hygiene files: CODEOWNERS, PR template, issue templates, dependabot.yml (INT007, INT005 config only, activation at G6).
Requirements implemented: BR001 (partial: shell exists), INT004, INT007, NFR010, OPS001, OPS002, SEC001, SEC007.
Required commands: npm ci, npm run check:all (must pass end to end on the empty scaffold), git remote -v.
Required evidence: docs/evidence/g1_check_all.txt (full output), docs/evidence/g1_tree.txt.
Blocking gate IDs: cumulative 11.
Rollback: git revert; no external state exists yet.
Exit conditions: check:all passes from a clean clone with npm ci.
Commit and tag: gate/G1-YYYYMMDD.

## G2 Simulation core

Objective: the deterministic simulation domain, complete and proven, before any interface work.
Entry conditions: G1 tag pushed.
Work items:
1. src/simulation/ modules per manifest and docs/ARCHITECTURE.md: schema, rng, probability, transitions, hazards, galaxy, civilization, events, light_cone, contact, metrics, serialization, model_version, engine, types.
2. Fixed point math helpers (src/utils/math.ts) per TEST_PLAN 3.5, integer only determinism critical paths (FR017).
3. simulation.worker.ts with the message protocol from docs/ARCHITECTURE.md (FR018).
4. Scenario schema v1 with validation, clamping, migration hooks, URL codec per docs/DATA_MODEL.md (FR026, DATA001, SEC002).
5. Deterministic fixtures and digests committed (FR033), unit, property, invariant, worker integration tests per docs/TEST_PLAN.md sections 2 and 3.
Requirements implemented: DATA001, FR016 to FR023, FR025 to FR027, FR033, NFR007, NFR009, SEC002.
Required commands: npm run test:simulation, npm run test:unit, npm run test:coverage (85 percent simulation floor), npm run check:all.
Required evidence: docs/evidence/g2_simulation_tests.txt, docs/evidence/g2_coverage.txt, committed fixture and digest files.
Blocking gate IDs: cumulative 27.
Rollback: git revert to gate/G1 tag state.
Exit conditions: every G2 row in docs/GATES.md passes, coverage floors met for the simulation domain.
Commit and tag: gate/G2-YYYYMMDD.

## G3 Primary user journey

Objective: a visitor can create a galaxy, run it, and read a Silence Report, on desktop and mobile, with the renderer and fallback.
Entry conditions: G2 tag pushed.
Work items:
1. App shell, stores, routes, error boundaries per docs/ARCHITECTURE.md.
2. Three.js 2.5D renderer layers plus fallback renderer (FR028, F002), capability detection (NFR002 baseline).
3. Onboarding, six control panel with full control anatomy, run controls, speed steps, canvas interactions, event ledger, label toggle, Silence Report with the fifteen metrics and headline (FR001 to FR009, FR011, FR024).
4. Reduced motion presentation (FR029), mobile and desktop layouts (FR031, FR032).
5. Share URL round trip working (FR008).
6. e2e specs: onboarding, default_run, share_scenario, keyboard, reduced_motion, mobile, plus the cross engine determinism assertion (TEST_PLAN 3.6).
Requirements implemented: BR002, BR004, BR005, FR001 to FR009, FR011, FR024, FR028, FR029, FR031, FR032, NFR006.
Required commands: npm run test:e2e, npm run check:all.
Required evidence: docs/evidence/g3_e2e_report/ (Playwright report), viewport screenshots per BUILD.md 15, docs/evidence/g3_cross_engine_digests.txt.
Blocking gate IDs: cumulative 46.
Rollback: git revert to gate/G2 tag state.
Exit conditions: all six canonical e2e specs plus the cross engine assertion pass in chromium, firefox, webkit, mobile projects.
Commit and tag: gate/G3-YYYYMMDD.

## G4 Remaining features and content

Objective: presets, education, persistence, degraded states, and final copy.
Entry conditions: G3 tag pushed.
Work items:
1. Eight presets with band constants (FR010), preset property test green.
2. Education drawers and content (FR012), assumptions and sources per docs/scientific_assumptions.md (BR003).
3. localStorage preferences, last scenario restore, clear control (FR013, FR014, DATA002).
4. Loading, empty, degraded, unsupported, error states (FR030).
5. About panel with app version, simulation model version, commit (OPS009), footer obligations (REL007), opening state copy (UX004), copy voice pass (UX003).
6. Launch assets: favicon, icons, manifest, robots, humans, social preview image from original artwork (REL005, P002 fallback if unresolved).
Requirements implemented: BR003, DATA002, FR010, FR012 to FR014, FR030, OPS009, REL005, REL007, UX003, UX004.
Required commands: npm run check:all, npm run test:e2e.
Required evidence: docs/evidence/g4_content_review.txt, docs/evidence/g4_states_screenshots/.
Blocking gate IDs: cumulative 58.
Rollback: git revert to gate/G3 tag state.
Exit conditions: every G4 row passes, no placeholder copy remains.
Commit and tag: gate/G4-YYYYMMDD.

## G5 Design refinement and accessibility

Objective: the Observatory Elegy treatment fully applied and the accessibility contract satisfied.
Entry conditions: G4 tag pushed.
Work items:
1. Full docs/ART_DIRECTION.md application: tokens, typography, motion language with exact durations, effect limits (UX001, UX002, UX005, UX006, UX007).
2. Keyboard map per docs/ACCESSIBILITY.md (canonical), focus management, live region policy with rate caps (ACC001, ACC002, ACC006).
3. Reduced motion and color safety verification (ACC003, ACC004).
4. Adaptive rendering tiers and low power mode measured (NFR002), frame rate manual protocol on the reference device (NFR001, R024 targets).
5. Manual accessibility protocol executed and recorded (screen reader matrix per R024).
Requirements implemented: ACC001 to ACC004, ACC006, NFR001, NFR002, UX001, UX002, UX005, UX006, UX007.
Required commands: npm run test:a11y, npm run test:e2e, npm run check:all.
Required evidence: docs/evidence/g5_axe_report.txt, docs/evidence/g5_manual_a11y.md (reviewer, date, steps, results), docs/evidence/g5_framerate.md, docs/evidence/g5_motion_frames/ (ordered frames per BUILD.md 15).
Blocking gate IDs: cumulative 70.
Rollback: git revert to gate/G4 tag state.
Exit conditions: automated and manual accessibility evidence retained, frame rate targets met or a recorded R024 recalibration ruling.
Commit and tag: gate/G5-YYYYMMDD.

## G6 CI/CD, security, operations, observability

Objective: the five workflows live, branch protection on, Cloudflare Pages project and previews working, headers and analytics in place.
Entry conditions: G5 tag pushed.
Work items:
1. ci.yml, dependency_review.yml, codeql.yml, deploy_preview.yml, deploy_production.yml exactly per docs/CI_CD.md (INT002, SEC004, SEC005).
2. GitHub environments (preview, production), secrets CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID, variables per CI_CD (SEC001).
3. Branch protection: the twelve canonical required contexts verbatim per CI_CD section 6, squash merge, conversation resolution, auto delete branches (INT001 complete).
4. Cloudflare Pages Direct Upload project filter created via wrangler, custom domain filter.nixfred.com associated, DNS and certificate verified (INT003), Cloudflare Access on previews per R012 or Fred's P001 ruling (SEC010).
5. public/_headers with the final CSP derived from the real build (SEC003), _redirects, robots policy (REL004), analytics beacon production only (INT006, DATA003, NFR003).
6. Dependabot live (INT005), bundle budget job running WARN with draft ceilings (NFR004 pre promotion), operations procedures live including rollback documentation (OPS004 to OPS008, OPS010).
7. Accessibility automation in required checks (ACC005).
Requirements implemented: ACC005, DATA003, INT002, INT003, INT005, INT006, NFR003, NFR004, OPS004 to OPS008, OPS010, REL004, SEC003 to SEC005, SEC008 to SEC010.
Required commands: gh api branch protection read back, wrangler pages deployment list with explicit account ID (deployment.md gotcha), curl -sI https://filter.nixfred.com for headers once bound, npm run pages:deploy:preview through a real PR.
Required evidence: docs/evidence/g6_workflows_runs.txt (run URLs), docs/evidence/g6_branch_protection.json, docs/evidence/g6_headers.txt, docs/evidence/g6_preview_pr.txt.
Blocking gate IDs: cumulative 91.
Rollback: workflows revert by commit; Pages project deletion requires Fred (destructive action rule); domain association can be detached and reattached without data loss.
Exit conditions: a real PR flows: CI green, preview deployed and Access protected, squash merge, production deploy, post_deploy_smoke green.
Commit and tag: gate/G6-YYYYMMDD.

## G7 Full validation and release candidate

Objective: everything green at once on a release candidate commit.
Entry conditions: G6 tag pushed.
Work items:
1. Bundle budget calibrated from real build measurements and promoted to BLOCK (NFR004, R024, P004 resolution or fallback).
2. Lighthouse category floors verified per R023 (NFR005).
3. Full browser support matrix run (NFR008).
4. CHANGELOG, release notes, version wiring verified (REL003), definition of done walkthrough (REL001).
5. Fix and re verify anything found; regenerate evidence.
Requirements implemented: NFR005, NFR008, REL001, REL003.
Required commands: npm run check:all, npm run test:e2e (full matrix), gh run watch on the release candidate.
Required evidence: docs/evidence/g7_release_candidate.txt (commit, all check run URLs), docs/evidence/g7_lighthouse.json, docs/evidence/g7_budget_calibration.md.
Blocking gate IDs: cumulative 95.
Rollback: git revert to gate/G6 tag state.
Exit conditions: every row except REL002 and REL006 passes.
Commit and tag: gate/G7-YYYYMMDD.

## G-LAUNCH Production deployment and live verification

Objective: live, verified, approved.
Entry conditions: G7 tag pushed, P003 approval obtained from Fred (REL006, MANUAL, deliberate hard stop).
Work items:
1. Production deploy of the release candidate through deploy_production.yml.
2. The packet's seventeen item production acceptance checklist executed against https://filter.nixfred.com with evidence per item (REL002).
3. Rollback procedure tested once for real: restore previous deployment, smoke test, restore current (OPS004 requirement, packet 03 section 21 item 17).
4. Semantic release v1.0.0 identifying deployed commit and evidence set.
Requirements implemented: REL002, REL006.
Required commands: gh run watch, curl -sI https://filter.nixfred.com, browser verification per checklist, wrangler pages deployment list with explicit account ID.
Required evidence: docs/evidence/glaunch_acceptance.md (all seventeen items, evidence per item), docs/evidence/glaunch_rollback_test.md, production screenshots desktop and mobile.
Blocking gate IDs: cumulative 97.
Rollback: documented Cloudflare Pages previous deployment restore (docs/OPERATIONS.md), never rewrite main.
Exit conditions: BUILD.md section 18 holds in full.
Commit and tag: gate/G-LAUNCH-YYYYMMDD, release v1.0.0.

## G-POST Standing checks and maintenance handoff

Objective: the standing enforcement set runs without the builder.
Entry conditions: G-LAUNCH complete.
Work items:
1. Verify scheduled workflows fire (CodeQL schedule, dependency review on PRs, Dependabot weekly).
2. Monthly cadence documented in docs/OPERATIONS.md with the first review date recorded after launch.
3. Standing gate rows (Standing YES in docs/GATES.md) confirmed enforceable post launch.
4. Incident and rollback procedures final read through.
Requirements implemented: standing enforcement of OPS007, OPS008 and all Standing YES rows.
Required evidence: docs/evidence/gpost_standing_checks.txt.
Exit conditions: Fred accepts maintenance handoff.
No tag; this phase is standing.

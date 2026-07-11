# TEST_PLAN

Testing strategy for The Great Filter (filter.nixfred.com). This document folds the manifest `testing_strategy.md` duties (ruling R001) and maps every product risk to a mechanism, a file, a CI job, and an evidence artifact.

Primary requirements implemented here: FR017 (determinism), FR025 (causal event ordering), FR033 (deterministic fixtures), NFR009 (coverage floors), NFR010 (zero defect gates), ACC005 (automated and manual accessibility checks). Source obligations: packet file 03 sections 15 (quality gates), 16 (performance requirements), 17 (testing requirements). Quality threshold numbers follow rulings R023 (Lighthouse gate classification) and R024 (quality threshold defaults), pending Fred confirmation in P004.

Authority: this plan sits below DECISIONS.md and the expanded PRD.md acceptance criteria. Where it names a CI job or npm script it uses only the canonical names fixed in docs/CHARTER_COMMON.md. Where it names a test file it uses the canonical test tree from the same charter, with the additions the PRD acceptance criteria mandate (the cross engine determinism spec of section 3.6); unit and integration file names inside the canonical directories are defined here and are binding for GATES.md (BUILD.md rule 8.3.6 requires GATES.md test file names to match this file exactly). The branch protection required check set is owned by docs/CI_CD.md section 6, and this plan defers to it (section 11.1). The worker message protocol is owned by docs/ARCHITECTURE.md section 3, and this plan uses those names.

No banned word in this document is used without a measurable definition. Frame rate, latency, coverage, and budget claims are stated as numeric thresholds, never as adjectives.

---

## 1. Scope and test levels

Five levels, each with a distinct owner tool and a distinct CI job.

| Level | Tool | Directory | CI job | npm script |
|---|---|---|---|---|
| Unit | Vitest | tests/unit/ | unit_tests | test:unit |
| Determinism (Node) | Vitest | tests/unit/simulation/determinism.test.ts | simulation_determinism | test:simulation (determinism filter) |
| Property and invariant | Vitest with fast-check | tests/unit/simulation/invariants.test.ts, tests/unit/simulation/presets.test.ts | simulation_properties | test:simulation (property filter) |
| Integration | Vitest | tests/integration/ | unit_tests (co-run) | test:unit |
| Coverage | Vitest coverage | all Vitest tests | coverage | test:coverage |
| Browser end to end | Playwright | tests/e2e/ | browser_smoke | test:e2e |
| Cross engine determinism | Playwright | tests/e2e/determinism_cross_engine.spec.ts | browser_smoke | test:e2e |
| Accessibility | Playwright with axe | tests/accessibility/ | accessibility_tests | test:a11y |
| Bundle budget | Node script | scripts/check_bundle.mjs | bundle_budget | check:bundle |
| Production audit | Lighthouse CI | lighthouserc.json | post_deploy_smoke (step) | not a merge gate, see section 9 |

The mobile frame rate check (NFR001) and the screen reader walkthrough (ACC002) are not automatable and are covered by written manual protocols in section 10 and in docs/ACCESSIBILITY.md.

---

## 2. Risk to test mapping

Every item in packet file 03 section 17 is covered below. The three groups (unit, property and invariant, browser) are reproduced in full and each line names its file and requirement IDs.

### 2.1 Unit tests, twelve areas (packet 03 section 17 unit list)

| # | Packet area | Test file | Requirement IDs | What it asserts |
|---|---|---|---|---|
| 1 | Random generator reproducibility | tests/unit/simulation/rng.test.ts | FR017 | The seeded RNG returns an identical integer stream for a given seed. Two generators seeded alike are bit identical for a fixed draw count. State is serializable and resumable. No use of Math.random. |
| 2 | Parameter mapping | tests/unit/simulation/probability.test.ts | FR002, R018 | The six visitor controls map to the hidden blend of transition probabilities, waiting times, and hazard rates deterministically. Boundary control values (minimum, maximum) map to documented endpoints. The mapping is a pure function of the scenario. |
| 3 | Transition probabilities | tests/unit/simulation/transitions.test.ts | FR016, R018 | State to state transition probabilities are in the closed interval 0 to 1, monotonic where the model claims monotonicity, and produce the documented state machine order (candidate system through interstellar and terminal states). |
| 4 | Event ordering | tests/unit/simulation/events.test.ts, tests/unit/simulation/engine.test.ts | FR025 | The event queue pops events in nondecreasing scheduled time. Ties break by a deterministic total order (scheduled time, then event kind, then civilization index). No event is applied before an earlier scheduled event. |
| 5 | Extinction hazards | tests/unit/simulation/hazards.test.ts | FR016, R009 | Hazard rates yield survival curves that are nonincreasing in time, extinction is absorbing (no resurrection except posthumous in transit signals per area 5 of the invariant list), and terminal states (quiet, transformed, extinct) are reachable and final. |
| 6 | Communication windows | tests/unit/simulation/civilization.test.ts | FR019, FR020 | A civilization's detectable emission window has a start, a duration, and an end. Emission strength and duration drive detectability. The window closes at extinction, while any signal already in transit persists (area 5 invariant). |
| 7 | Light travel calculations | tests/unit/simulation/light_cone.test.ts | FR019 | Signal arrival time equals emission time plus distance divided by the configured causal speed, computed in fixed point. No arrival precedes emission. Distance is symmetric. |
| 8 | Expansion calculations | tests/unit/simulation/civilization.test.ts | FR021 | The interstellar frontier grows at the configured sub light effective speed after launch and settlement delays. Frontier radius is nondecreasing and never exceeds effective speed multiplied by elapsed time since launch. |
| 9 | Contact detection | tests/unit/simulation/contact.test.ts | FR022, R019 | Contact is counted only on causal intersection (reception of a detectable signal by a civilization able to recognize it). Simultaneous existence without causal overlap counts zero contacts. Signal overlaps and travel overlaps are tracked and reported separately. |
| 10 | Metrics | tests/unit/simulation/metrics.test.ts | FR027, FR009 | All fifteen Silence Report metrics are computed from a known fixture run with expected values. Counts reconcile (detectable is a subset of technological, and so on). The generated headline sentence is deterministic for a fixture. |
| 11 | Scenario serialization | tests/unit/simulation/serialization.test.ts | FR008, DATA001 | Encode then decode returns a scenario deep equal to the original for the current model version. The encoding carries model version, seed, and every parameter. Encoding is compact and stable (same scenario yields the same string). |
| 12 | Scenario migration | tests/unit/simulation/schema.test.ts | FR026, DATA001, SEC002 | The schema validates input, clamps or rejects invalid or out of range values deterministically, enforces a maximum encoded length, and migrates every supported older share format to the current schema. Rejection is deterministic for a given malformed input. |

Supporting unit files that raise simulation coverage without adding a packet area:

| Test file | Requirement IDs | Purpose |
|---|---|---|
| tests/unit/simulation/galaxy.test.ts | FR023 | Representative population generation is deterministic for a seed, the simulated population is the documented smaller set behind the decorative starfield, and positions are stable. |
| tests/unit/simulation/model_version.test.ts | R015 | The simulation model version constant is a positive integer and is the single source consumed by serialization and the About panel. |

State and utility unit files:

| Test file | Requirement IDs | Purpose |
|---|---|---|
| tests/unit/state/url_state.test.ts | FR008, DATA001 | URL read and write round trips, model version and seed survive a browser history navigation, malformed query parameters fall back to defaults without throwing. |
| tests/unit/state/simulation_store.test.ts | FR004, FR024 | Run control state machine (idle, running, paused, complete) accepts start, pause, resume, speed change, reset, replay, randomize, and rejects illegal transitions. Speed steps are exactly pause, normal, 10x, 100x, 1000x, and maximum. Playback pacing (the wall clock) lives here, outside the worker domain, per docs/ARCHITECTURE.md section 6. |
| tests/unit/state/ui_store.test.ts | FR013, DATA002 | localStorage persists preferences and last scenario, the clear local data control empties them, no cookie is written. |
| tests/unit/utils/math.test.ts | FR017 | The deterministic fixed point math helpers (the only sanctioned path for transcendental and division heavy math in the simulation) return golden values and are engine independent by construction. See section 3.5. |
| tests/unit/utils/format.test.ts | FR009, UX003 | Number, distance, and time formatting for the report and ledger produce the documented strings, no em or en dash appears in any generated string. |
| tests/unit/utils/time.test.ts | FR009 | Simulated time conversions (years, millions of years, billions of years) are exact and reversible. |
| tests/unit/utils/accessibility.test.ts | ACC002, FR024 | The live region throttle helper emits at most one message per the configured minimum interval and coalesces bursts, so announcement density scales down as simulation speed rises up to 1000x. See docs/ACCESSIBILITY.md section 3. |

### 2.2 Property and invariant tests, eight invariants (packet 03 section 17)

All eight run in tests/unit/simulation/invariants.test.ts using fast-check generators over seeds and clamped parameter ranges. Each invariant below is stated as a testable property with an explicit generator domain.

| # | Invariant | Testable property | Requirement IDs |
|---|---|---|---|
| 1 | No event occurs before its cause | For every applied event e with a declared cause c, scheduledTime(e) is greater than or equal to scheduledTime(c). Quantified over all seeds in the generator and all events in the resulting log. | FR025 |
| 2 | No civilization appears before its host world is eligible | For every civilization c, the time it enters the life state is greater than or equal to the time its host world entered the habitable state. | FR016 |
| 3 | No signal arrives faster than the configured causal speed | For every reception event, arrivalTime minus emissionTime is greater than or equal to distance divided by causalSpeed, evaluated in fixed point with the sanctioned helpers. | FR019 |
| 4 | No travel front exceeds its configured speed | For every expanding civilization, frontierRadius(t) is less than or equal to effectiveSpeed multiplied by (t minus launchTime), for all sampled t after launch. | FR021 |
| 5 | Extinct civilizations do not emit unless a delayed signal is still in transit | After a civilization enters a terminal state, no new emission event is scheduled, yet previously emitted signals still in transit remain detectable. | FR020 |
| 6 | Aggregate counts remain internally consistent | detectable count is less than or equal to technological count, technological is less than or equal to intelligent, intelligent is less than or equal to life, life is less than or equal to candidate worlds, and disappeared plus active equals ever alive, for the whole run. | FR027 |
| 7 | The same seed and parameters produce the same final digest | For any generated scenario, two independent runs in the same engine produce byte identical digests. This proves intra engine reproducibility. Cross engine identity is proven separately in section 3.6. | FR017 |
| 8 | Invalid inputs are rejected or clamped deterministically | For any generated malformed, out of range, or oversized scenario input, the schema returns the same clamped scenario or the same rejection for the same input across repeated calls. | FR026, SEC002 |

fast-check is configured to record and replay the failing seed (`fc.configureGlobal` with a fixed `seed` and `endOnFailure` in CI) so a property failure is reproducible and never flaky. The property seed is committed, not random per run (NFR010).

### 2.2.1 Additional property obligations

Two further property obligations run under test:simulation (the simulation_properties job).

| Obligation | Test file | Requirement IDs | Testable property |
|---|---|---|---|
| Preset outcome character across a seed batch | tests/unit/simulation/presets.test.ts | FR010, R022 | For each of the eight presets (The Silent Galaxy, Crowded Briefly, Loud but Lonely, Rare Earth, Fragile Intelligence, Patient Stars, Expansion Wins, Optimist's Milky Way) run a committed batch of PRESET_SEED_BATCH_SIZE seeds and assert the preset's defining outcome statistic falls within a named per preset acceptance bound, and that the cross preset ordering holds. PRESET_SEED_BATCH_SIZE and each acceptance bound (for example SILENT_GALAXY_MAX_CONTACT_FRACTION, LOUD_BUT_LONELY_MIN_DETECTABLE paired with a near zero contact bound, CROWDED_BRIEFLY_MAX_MEDIAN_TECH_LIFETIME, EXPANSION_WINS_MIN_INTERSTELLAR_FRACTION, PATIENT_STARS_MAX_EXPANSION_FRACTION, RARE_EARTH_MOST_RESTRICTIVE_IS_EARLY_BIOLOGICAL) are named constants defined at the top of the test, set conservatively, and flagged for calibration alongside PENDING P004 once the model is measured. The cross preset ordering assertions (for example The Silent Galaxy confirmed contact fraction is strictly below Optimist's Milky Way) hold regardless of exact calibration. The bounds are anchored to the preset definitions in src/content/presets.ts and docs/simulation_model.md, so this test enforces the preset definitions rather than inventing numbers. The seed batch is committed and fixed, so the test is deterministic and reproducible, not flaky (NFR010). This is a test only seed batch and does not reintroduce Monte Carlo batch runs as a product feature, which ruling R022 governs for the product surface, not for tests. |
| Share URL length budget | tests/unit/simulation/invariants.test.ts, tests/unit/simulation/serialization.test.ts | DATA001, SEC002 | For any valid scenario generated by fast-check over the clamped parameter ranges, the encoded share URL byte length is less than or equal to the maximum share URL length constant defined in docs/DATA_MODEL.md, imported as a single source constant and never duplicated here. serialization.test.ts additionally asserts that the maximum length preset and the boundary scenarios stay within budget. This guards the length limiting requirement against a schema change that would silently grow the encoding. |

### 2.3 Browser tests, twelve flows (packet 03 section 17 browser list)

The canonical tree provides six e2e spec files plus one accessibility spec. The twelve packet flows map onto the six canonical e2e specs as follows. The PRD acceptance criteria for FR017 and FR033 additionally mandate a seventh e2e spec, tests/e2e/determinism_cross_engine.spec.ts, for cross engine digest equality (section 3.6). Flows 11 and 12 share files with related presentations because the fallback renderer reuses the reduced motion presentation and error recovery is exercised where errors are naturally triggered.

| # | Packet flow | Spec file | Requirement IDs | Key assertions |
|---|---|---|---|---|
| 1 | First visit onboarding | tests/e2e/onboarding.spec.ts | FR011, UX004 | Onboarding appears on first visit, is skippable, offers direct access to the simulation, shows CREATE A GALAXY and RUN A PRESET, and does not reappear after the localStorage flag is set. |
| 2 | Create and run a default galaxy | tests/e2e/default_run.spec.ts | FR004, FR005 | The default galaxy starts, playback advances simulated time, civilizations appear. |
| 3 | Pause and resume | tests/e2e/default_run.spec.ts | FR004 | Pause halts simulated time advance, resume continues from the same state. |
| 4 | Change speed | tests/e2e/default_run.spec.ts | FR024 | Each of pause, normal, 10x, 100x, 1000x, and maximum is selectable and changes the advance rate. |
| 5 | Select and inspect a civilization | tests/e2e/default_run.spec.ts | FR005 | Selecting a civilization opens the inspector with its state and details. |
| 6 | Finish a run and open the Silence Report | tests/e2e/default_run.spec.ts | FR009 | On run end the report opens with the fifteen metrics and a generated headline sentence. |
| 7 | Share and reopen a scenario | tests/e2e/share_scenario.spec.ts | FR008, DATA001 | The share dialog yields a URL carrying model version, seed, and parameters. Opening it in a fresh context reproduces the same run, verified by an identical exposed run digest and identical headline metrics. |
| 8 | Keyboard only operation | tests/e2e/keyboard.spec.ts | ACC001, ACC006 | The full core path (skip onboarding, configure, run, pause, change speed, select a civilization, open ledger, open report, share) completes with keyboard only. Focus is visible at every step and no focus trap exists. The canonical keyboard map is docs/ACCESSIBILITY.md section 1. |
| 9 | Reduced motion operation | tests/e2e/reduced_motion.spec.ts | FR029, ACC003 | With prefers-reduced-motion set and with the in application toggle, animation is replaced by discrete state changes, labels, and time stamped summaries, no auto rotation or parallax runs, and a run still completes with a report. |
| 10 | Mobile layout | tests/e2e/mobile.spec.ts | FR031 | At the mobile reference profile the canvas is full screen, the status bar is compact, controls are a bottom sheet, event and report are separate sheets, and touch targets are at least 44 by 44 CSS pixels. Core interaction completes. |
| 11 | Unsupported renderer fallback | tests/e2e/reduced_motion.spec.ts | FR028, FR030, NFR002 | With WebGL forced unavailable the fallback renderer presents the run (never a blank page, ruling R021), civilizations, signals, and contacts are conveyed per docs/ACCESSIBILITY.md section 6, and a run completes with a report. |
| 12 | Error recovery | tests/e2e/share_scenario.spec.ts, tests/e2e/default_run.spec.ts | FR030, SEC002 | A malformed or oversized share URL yields a designed error or clamp, not a crash, and the visitor can start a fresh run. An injected worker failure surfaces through the error boundary with a recovery path. |
| + | Cross engine determinism (PRD mandated seventh spec) | tests/e2e/determinism_cross_engine.spec.ts | FR017, FR033 | A reduced fixture set run through the real simulation worker in each browser engine reproduces the committed digest. See section 3.6. |

### 2.4 Integration tests (packet 03 section 6 required jobs, worker protocol and scenario round trip)

| Test file | Requirement IDs | What it asserts |
|---|---|---|
| tests/integration/simulation_worker.test.ts | FR018, FR017 | The simulation runs inside a Web Worker. The test drives the worker with the canonical message protocol owned by docs/ARCHITECTURE.md section 3. It posts INIT then START, receives the worker to main messages (READY, SNAPSHOT, EVENT_BATCH, METRICS_UPDATE, PROGRESS, RUN_COMPLETE, ERROR), and on RUN_COMPLETE reads the digest field from the payload and asserts it equals the in thread engine digest for the same fixture, proving the worker boundary preserves determinism. The routine playback delivery message is EVENT_BATCH, a compact ordered slice of newly fired events; there is no fixed timestep tick message, per ADR 0003. It asserts the message schema shape (including the main to worker control messages START, PAUSE, RESUME, SET_SPEED, RESET, REPLAY_SAME_SEED, RANDOMIZE_SEED, ACK_BATCH, REQUEST_SNAPSHOT, TERMINATE) and that a run completes emitting only the contracted message kinds. Runs under Vitest with the @vitest/web-worker module worker shim (or Vitest browser mode). |
| tests/integration/scenario_round_trip.test.ts | FR008, FR026, DATA001, SEC002 | Encode a scenario to a share URL, decode it, run both, and assert identical digests. Decode of a committed older format fixture migrates to the current schema and runs. Oversized and malformed inputs are clamped or rejected deterministically and never throw an unhandled error. |

---

## 3. Determinism strategy (FR017, FR033)

Determinism is the load bearing correctness property. It is guarded by committed fixtures, committed digests, a Node CI recomputation job, an automated cross engine browser spec, a strict fixture update procedure, and a floating point discipline.

### 3.1 Committed fixtures

tests/fixtures/scenarios/ holds one JSON file per fixture scenario. Each file contains the exact scenario object: simulation model version, seed, and every parameter. Fixtures cover at minimum: the default scenario, each of the eight presets (FR010), a minimum contact scenario, a maximum contact scenario, a scenario that reaches interstellar expansion, and a scenario that produces zero detectable civilizations. Each fixture file name is stable and referenced by the digest file of the same stem.

### 3.2 Committed digests

tests/fixtures/simulation_digests/ holds one digest file per fixture, same stem. A digest file records the simulation model version the digest was produced under and the digest string. The digest is a stable hash over a canonically ordered, integer encoded serialization of the run result. The exact canonical record fields are specified in docs/DATA_MODEL.md section 3 and this plan agrees with it: schema version, model version, seed, resolved scenario, the canonically ordered terminal state of every civilization (id, final state, final state entry year), the full ordered event log in queue processing order, and the full run metrics. The canonical serialization quantizes every real value to fixed point integers before hashing so the hashed representation contains no floating point bit patterns. Hashing the full ordered event log, not only aggregate counts, catches a regression that preserves every aggregate but reorders or retimes the events producing it.

### 3.3 Node CI recomputation (simulation_determinism job)

The simulation_determinism CI job runs `npm run test:simulation -- tests/unit/simulation/determinism.test.ts`. That test loads every fixture in tests/fixtures/scenarios/, runs it in Node, recomputes the digest, and asserts equality with the committed digest in tests/fixtures/simulation_digests/. It also asserts that the model version recorded in each digest file equals the current SIMULATION_MODEL_VERSION from src/simulation/model_version.ts, so a model change without a fixture regeneration fails the gate loudly. A mismatch is a BLOCK failure. Evidence is the job log tied to the commit, uploaded on failure per packet 03 section 6 item 13.

### 3.4 Fixture update procedure (requires a model version bump, ruling R015)

Digests change only when the simulation output changes, which is a model change. The procedure is:

1. Confirm the output change is intended. An unintended digest change is a regression, not a fixture update.
2. Bump SIMULATION_MODEL_VERSION in src/simulation/model_version.ts. The integer version only ever increases.
3. Regenerate fixtures and digests with `node scripts/validate_scenarios.mjs --update`, which rewrites tests/fixtures/simulation_digests/ and stamps each with the new model version.
4. If the scenario schema changed, add migration logic from the prior share format to the new one (FR026, DATA001) and add a committed older format fixture that the round trip test migrates.
5. Update docs/scientific_assumptions.md and docs/simulation_model.md if the model meaning changed, and add a CHANGELOG entry noting the model version change (REL003).
6. Open the change as a pull request so the digest diff is reviewed. A digest diff without a model version bump is rejected in review and by the section 3.3 assertion.

This procedure is the only sanctioned way to change committed digests. It is referenced by GATES.md as the mechanism for FR033.

### 3.5 Floating point hazard discipline (charter hard rule 8)

Engine provided transcendental functions (Math.sin, Math.cos, Math.exp, Math.log, Math.pow, and similar) and Math.random are not guaranteed bit identical across JavaScript engines, so they are forbidden in determinism critical simulation code. The rules:

1. All determinism critical math routes through the sanctioned fixed point helpers in src/utils/math.ts. Waiting time and hazard sampling use deterministic fixed point implementations or committed integer lookup tables with integer interpolation, never engine transcendentals.
2. The digest is computed over the fixed point integer serialization only (section 3.2), so even if a nondeterminism critical display path uses a float, it never enters the hashed representation.
3. An ESLint rule (no-restricted-properties and no-restricted-globals) forbids Math.sin, Math.cos, Math.tan, Math.exp, Math.log, Math.pow, Math.random, Date.now, and performance.now inside src/simulation/**, except the sanctioned helper module. This rule is enforced by the lint CI job, so a determinism violating call is a merge blocking lint error (NFR010). Wall clock isolation is structural as well: playback pacing lives in src/state/simulation_store.ts outside the worker domain module (docs/ARCHITECTURE.md section 6), so no wall clock value can reach an RNG draw, a scheduled time, or the digest. Iteration order hazards (Set and Map insertion order, object key order) are covered by a lint rule and by the invariant that repeated runs match.

Honest limit: the Node job (section 3.3) proves reproducibility in the Node engine over the full fixture set. Cross engine bit identity for the fixture set is proven by the automated spec in section 3.6. Cross engine equality for arbitrary scenarios beyond the fixtures still rests on the integer and fixed point discipline above plus the lint enforcement, and is extended to the full fixture set periodically by the manual spot check (section 10.4). This limit is stated so no gate over claims.

### 3.6 Cross engine determinism (FR017, FR033, automated)

The PRD acceptance criteria for FR017 and FR033 require the committed fixture digests to be recomputed and to match in Chromium, Firefox, and WebKit in CI, not only in Node. This is proven by a dedicated Playwright spec, tests/e2e/determinism_cross_engine.spec.ts, which is additional to the six canonical e2e specs by PRD mandate. The spec runs a reduced fixture set (the default scenario plus a small set chosen to exercise the state space: a zero contact case, a contact case, and an interstellar expansion case) through the real simulation worker in the browser, reads the recomputed digest from the RUN_COMPLETE payload, and asserts equality with the committed digest in tests/fixtures/simulation_digests/. The browser_smoke CI job runs it across the chromium, firefox, and webkit projects (section 8.2), so Chromium, Firefox, and WebKit each recompute the same committed digests that Node produced. FR017 and FR033 are therefore proven across all four engines: Node over the full fixture set by simulation_determinism, and the three browser engines over the reduced fixture set by browser_smoke. A mismatch in any engine is a BLOCK failure with the Playwright trace as evidence. The integer and fixed point discipline of section 3.5 and the lint enforcement are the structural foundation that makes cross engine equality achievable; this spec is the automated proof. The full fixture set is extended across the browser matrix as a secondary standing check (section 10.4).

---

## 4. Coverage (NFR009)

Coverage is measured by Vitest with the v8 coverage provider and enforced in the coverage CI job via `npm run test:coverage`.

Thresholds in vitest.config.ts:

| Scope | Metric | Floor |
|---|---|---|
| src/simulation/** | lines | 85 percent |
| src/simulation/** | functions | 85 percent |
| Whole project (src/**) | lines | 80 percent |

The simulation floor is expressed as a per glob threshold so the simulation domain cannot be diluted by high coverage elsewhere. A run below any floor fails the coverage job as a BLOCK. Coverage of generated files, type only files (src/simulation/types.ts, src/vite_env.d.ts), and the worker bootstrap line is excluded through the coverage exclude list, documented in vitest.config.ts, so the floor reflects real logic. Coverage is a floor, not a target, and does not replace the property and determinism gates.

---

## 5. Tooling

| Concern | Tool | Config file | Notes |
|---|---|---|---|
| Unit, integration, determinism, property | Vitest | vitest.config.ts | fast-check for properties, committed property seed |
| Property generators | fast-check | (within tests) | domain restricted to clamped parameter ranges |
| Browser end to end and cross engine determinism | Playwright | playwright.config.ts | projects per section 8 |
| Accessibility scan | Playwright with @axe-core/playwright | playwright.config.ts | tests/accessibility/core_flows.spec.ts |
| Production audit | Lighthouse CI | lighthouserc.json | see section 9 |
| Bundle budget | Node script | scripts/check_bundle.mjs | see section 9 |

### 5.1 npm script to suite mapping (canonical script names only)

| npm script | Runs |
|---|---|
| test | vitest run (all Vitest unit and integration tests) |
| test:unit | vitest run over tests/unit and tests/integration |
| test:simulation | vitest run over tests/unit/simulation/determinism.test.ts, tests/unit/simulation/invariants.test.ts, and tests/unit/simulation/presets.test.ts, narrowed by a path filter when the CI job passes one |
| test:coverage | vitest run with coverage over all Vitest tests |
| test:e2e | playwright test over tests/e2e (the six canonical specs plus the PRD mandated cross engine determinism spec of section 3.6) |
| test:a11y | playwright test over tests/accessibility |
| check:bundle | node scripts/check_bundle.mjs against the built dist directory |
| check:all | the ordered local gate, see section 5.3 |

### 5.2 CI job to script mapping (canonical job and script names only)

Pull request and push to main (ci.yml):

| CI job | Command |
|---|---|
| install | npm ci with dependency cache through the Node setup action |
| format_check | npm run format:check |
| lint | npm run lint (warnings treated as errors, packet 03 section 6 item 6) |
| typecheck | npm run typecheck |
| unit_tests | npm run test:unit |
| simulation_determinism | npm run test:simulation -- tests/unit/simulation/determinism.test.ts |
| simulation_properties | npm run test:simulation -- tests/unit/simulation/invariants.test.ts tests/unit/simulation/presets.test.ts |
| coverage | npm run test:coverage |
| build | npm run build |
| bundle_budget | npm run check:bundle (consumes the build job artifact) |
| browser_smoke | npm run test:e2e (includes the section 3.6 cross engine determinism spec across chromium, firefox, and webkit) |
| accessibility_tests | npm run test:a11y |

Production (deploy_production.yml):

| CI job | Command |
|---|---|
| quality_gate | npm run check:all |
| deploy_production | npm run pages:deploy:production |
| post_deploy_smoke | npm run test:e2e -- --project=production-smoke, then the Lighthouse audit step against the custom domain (section 9) |

Preview (deploy_preview.yml):

| CI job | Command |
|---|---|
| deploy_preview | npm run pages:deploy:preview |

The determinism and property jobs run the same specs that unit_tests already runs. The dedicated jobs exist so GATES.md can point FR017, FR025, and FR033 at a named required check with focused evidence. This redundancy is intentional.

### 5.3 check:all order (OPS001, deterministic)

check:all runs every merge blocking local check in this fixed order and stops at the first failure:

1. format:check
2. lint
3. typecheck
4. build
5. test:coverage (runs unit, integration, determinism, invariant, and preset tests with coverage, so it subsumes test:unit and test:simulation locally)
6. check:bundle
7. test:e2e (includes the cross engine determinism spec)
8. test:a11y

The order is fixed so a local run and a re run produce the same first failure. check:all is what the quality_gate production job runs.

---

## 6. Determinism and ordering gates cross reference

| Requirement | Mechanism | File | CI job | Class |
|---|---|---|---|---|
| FR017 determinism | Node fixture digest recomputation, automated cross engine browser digest spec, intra engine property, fixed point discipline, lint restriction | tests/unit/simulation/determinism.test.ts, tests/e2e/determinism_cross_engine.spec.ts, tests/unit/simulation/invariants.test.ts, eslint.config.js | simulation_determinism, browser_smoke, simulation_properties, lint | BLOCK |
| FR025 causal ordering | event queue ordering unit test plus invariant 1 | tests/unit/simulation/events.test.ts, tests/unit/simulation/engine.test.ts, tests/unit/simulation/invariants.test.ts | unit_tests, simulation_properties | BLOCK |
| FR033 deterministic fixtures | committed scenarios and digests, Node recomputation, cross engine spec, update procedure | tests/fixtures/scenarios/, tests/fixtures/simulation_digests/, tests/unit/simulation/determinism.test.ts, tests/e2e/determinism_cross_engine.spec.ts | simulation_determinism, browser_smoke | BLOCK |

---

## 7. Performance verification (NFR001, NFR004, NFR005)

### 7.1 Bundle budget (NFR004, packet 15 items 11 and 12, packet 16 item 8, ruling R024)

Mechanism: the check:bundle script (scripts/check_bundle.mjs) reads the built dist directory, computes the gzip transfer size of the initial route JavaScript and of each individual asset, and fails when a budget is exceeded. The bundle_budget CI job runs it.

Initial draft budget for the Three.js stack, marked DRAFT, from ruling R024:

| Budget | Draft ceiling | Status |
|---|---|---|
| Initial route JavaScript, gzip | 300 KB | DRAFT, not a measurement |
| Any single JavaScript chunk, gzip | 180 KB | DRAFT, not a measurement |
| Any single non JavaScript static asset | 512 KB | DRAFT, not a measurement |

These are policy ceilings chosen from the known approximate size of a tree shaken Three.js points and shader build plus React and the application shell. They are not measured numbers. The first real production build measurement replaces them with calibrated values. Per ruling R024, the bundle_budget class is WARN, then BLOCK at G7: until calibration the job annotates a violation but exits zero (continue-on-error), so it is a required branch protection context that reports green without blocking on an unverified number, and at gate G7 the approved calibrated ceilings become blocking (docs/CI_CD.md sections 3.7 and 5.1). For GATES.md reconciliation this is tagged BLOCK-at-G7 so the matrix does not flag a mismatch before calibration. Fred approval of the calibrated ceiling is tracked in PENDING P004. The intent that Three.js is lazy loaded where the fallback renderer path does not need it is enforced by the initial route ceiling, not by a separate check.

### 7.2 Lighthouse thresholds (NFR005, rulings R023 and R024)

Mechanism: lighthouserc.json defines assertion thresholds for the performance, accessibility, best practices, and SEO categories. Because Lighthouse performance scores vary with the runner environment, a required Lighthouse check would be flaky and could deadlock the automatic production deploy under R011, so Lighthouse is deliberately not a canonical ci.yml job and never a pull request merge gate (ruling R023). It runs in two places, wired in docs/CI_CD.md section 5.5:

1. As a step in the post_deploy_smoke job against https://filter.nixfred.com after a production deploy, using `lhci autorun` with lighthouserc.json.
2. On the monthly maintenance cadence (OPS008) documented in docs/OPERATIONS.md.

Category classification per rulings R023 and R024, pending Fred confirmation in P004:

| Category | Floor | Class within post_deploy_smoke |
|---|---|---|
| Accessibility | 1.00 | BLOCK (regression fails the workflow and opens an incident) |
| Best practices | 0.95 | BLOCK |
| SEO | 0.90 | BLOCK |
| Performance | 0.80 | advisory, recorded and visible, never failing |

The accessibility, best practices, and SEO categories block within the post deploy verification (they can fail the deploy_production workflow), not at pull request merge time. The performance category is advisory because a single audit of a live WebGL page is environment sensitive. The deterministic merge time performance gate remains bundle_budget (NFR004), and the manual mobile frame rate protocol (NFR001, section 7.3) covers runtime performance. These floors are proposed defaults from R024, not measured scores.

### 7.3 Mobile frame rate (NFR001, ruling R024, manual protocol)

CI cannot honestly measure the frame rate of a physical device. Playwright device emulation reproduces viewport and touch, not GPU throughput, so it is used for layout (section 2.3 flow 10), never for frame rate. Frame rate is verified by the written manual protocol in section 10.1 on the mid range 2021 class reference device (ruling R021), with the numeric acceptance targets from ruling R024 and captured evidence. The targets are proposed defaults pending Fred confirmation on the actual device (PENDING P004).

---

## 8. Browser matrix and Playwright configuration

### 8.1 Supported floor (ruling R021, NFR008)

Last two versions of Chrome, Edge, Firefox, and Safari, plus iOS Safari on iOS 16 and later.

### 8.2 Playwright projects (playwright.config.ts)

| Project | Engine and device | Covers |
|---|---|---|
| chromium | Chromium desktop | Chrome and Edge (both Chromium based, Edge is additionally spot checked via the msedge channel on the maintenance cadence) |
| firefox | Firefox desktop | Firefox |
| webkit | WebKit desktop | desktop Safari |
| mobile-safari | WebKit, iPhone device profile | iOS Safari 16 and later |
| mobile-chrome | Chromium, mid range 2021 reference viewport and device scale profile | Android mobile layout |
| production-smoke | Chromium against https://filter.nixfred.com | post_deploy_smoke critical path only |

The browser_smoke job runs chromium, firefox, webkit, mobile-safari, and mobile-chrome, and it runs the cross engine determinism spec tests/e2e/determinism_cross_engine.spec.ts (section 3.6) across the chromium, firefox, and webkit projects. Edge is Chromium based and is covered by the chromium project for behavior, with a periodic msedge channel run recorded in docs/OPERATIONS.md rather than in every pull request, because the Edge channel binary is not always present on the runner and a missing binary must not silently pass. The mobile reference viewport profile approximates the ruling R021 device for layout only.

### 8.3 Retries and traces

CI retries are set to 0 for the required browser_smoke and accessibility_tests jobs so intermittent failures surface loudly rather than being masked (NFR010, and the fail loudly principle). Traces, screenshots, and video are retained on failure and uploaded per packet 03 section 6 item 13. If a genuine runner infrastructure flake appears, it is fixed at the harness level (waiting on a real signal instead of a timeout), not hidden behind a retry.

---

## 9. Bundle and audit scripts summary

| Script or config | Purpose | Consumed by |
|---|---|---|
| scripts/check_bundle.mjs | gzip size budget enforcement | check:bundle, bundle_budget job |
| lighthouserc.json | Lighthouse category assertions | post_deploy_smoke step, OPS008 cadence |
| scripts/validate_scenarios.mjs | fixture and digest regeneration on a model version bump | fixture update procedure section 3.4 |
| scripts/validate_content.mjs | content copy validation (no em or en dash, banned phrasings) | check:all optional pre-step, ties to UX003 |
| scripts/write_build_metadata.mjs | stamps app version, simulation model version, and commit into the build for the About panel | build |

---

## 10. What is not automated, and its manual protocol

The following cannot be honestly automated in CI. Each has a written protocol with steps, expected result, reviewer, date, and a stored evidence artifact under docs/evidence/, per BUILD.md section 8.2 manual gate rules. Evidence file naming follows docs/evidence/<gate>_<checkID>_<shortcommit>.<ext> (BUILD.md section 15). These artifacts are produced at gate execution time and do not exist yet.

### 10.1 Mobile frame rate (NFR001, ruling R024)

Reference device: a mid range 2021 class mobile device (ruling R021).

Steps:
1. Serve the production build over the local network or open the deployed preview on the reference device.
2. Load the default scenario and start the run at normal speed.
3. Capture a performance trace over a 60 second window using Chrome remote device inspection or an on device frame timing overlay.
4. Repeat at 100x and at 1000x speed.
5. Repeat with the low power mode enabled (NFR002).

Acceptance (numeric, from ruling R024, not adjectives): median rendered frame rate is at least 30 frames per second at the default star count during normal and 100x playback, with no sustained drop below 24 frames per second for longer than 500 milliseconds, and interface input (pause, open a sheet) is acknowledged within 100 milliseconds. Low power mode sustains at least 30 frames per second by reducing star count and effects.

Reviewer: devops, confirmed by Fred at G5. Evidence: captured trace file and a short screen recording under docs/evidence/. Targets are proposed defaults pending Fred's confirmation on the actual device (PENDING P004).

### 10.2 Screen reader walkthrough (ACC002, ACC005)

Defined in full in docs/ACCESSIBILITY.md section 7.2. This plan defers the screen reader model, the announcement expectations, and the evidence format to that document. The accessibility_tests job (axe) covers the automatable subset only. The reference matrix (VoiceOver with Safari and NVDA with Firefox) is fixed by ruling R024.

### 10.3 Reduced motion and fallback visual correctness (FR029, FR030)

axe and the e2e specs confirm the reduced motion state exists and a run completes, but the visual correctness of the discrete state presentation is confirmed by human observation using ordered frames or a short capture (BUILD.md evidence standard for motion). Steps, expected result, reviewer, and evidence path are defined in docs/ACCESSIBILITY.md sections 4 and 6.

### 10.4 Cross engine determinism full matrix (FR017, secondary standing check)

The primary cross engine gate is automated in the browser_smoke job over the reduced fixture set (section 3.6). As a secondary standing check at G7 and on the maintenance cadence, the full committed fixture set is opened by share URL in Chrome, Firefox, and Safari and the exposed run digest is confirmed to match the committed digest. Reviewer: quality, at G7. Evidence: screenshots showing identical digests under docs/evidence/. The honest limit is now narrow: CI proves cross engine digest equality for the reduced fixture set on every run, and this manual check extends that to the full fixture set periodically. Cross engine equality for scenarios beyond the fixtures still rests on the section 3.5 discipline, not on exhaustive enumeration.

### 10.5 Rollback drill and production acceptance (OPS004, REL002)

The rollback procedure test and the seventeen item production acceptance checklist are operational manual gates owned by docs/OPERATIONS.md and recorded in docs/GATES.md. This plan references them and does not duplicate them.

---

## 11. Flaky test policy (NFR010)

Required workflows must contain no known flaky test.

1. Detection: CI retries are 0 for required jobs (section 8.3), so any nondeterministic failure is visible. Property tests use a committed fast-check seed, determinism tests use committed fixtures, and the preset character test uses a committed seed batch, so a Vitest failure is always reproducible.
2. Quarantine: a test proven intermittently failing is moved out of the required path immediately, either annotated `test.fixme` (Playwright) or `test.skip` with a reason, or moved to a non required project, and a tracking issue is opened recording the symptom, the suspected cause, and the owning discipline. A quarantined test does not gate merges while quarantined.
3. Time box: a quarantined test in a required workflow must be fixed or deleted before the next release gate (G7). A quarantine is never a permanent state, because a permanently skipped required test is a coverage lie.
4. Root cause preference: fix the cause (a real wait condition, a seeded value, a stable sort) rather than adding a retry. A retry that hides flakiness is prohibited in required jobs.
5. Evidence: the quarantine issue and its resolution commit are the evidence that NFR010 holds at a release gate.

### 11.1 Blocking versus advisory, and the required check set (INT002, NFR010)

The required, merge blocking checks are exactly the branch protection required status check contexts listed in docs/CI_CD.md section 6: format_check, lint, typecheck, unit_tests, simulation_determinism, simulation_properties, coverage, build, bundle_budget, browser_smoke, accessibility_tests, plus the CodeQL and dependency review contexts. This is the authoritative set of required workflows for the flaky policy above, and this plan defers to CI_CD.md so the two documents cannot drift.

The bundle_budget context is required but reports green while it runs as WARN (continue-on-error) until its ceiling is calibrated and approved, then it becomes blocking at G7 (ruling R024, docs/CI_CD.md sections 3.7 and 5.1). GATES.md should tag it BLOCK-at-G7 so reconciliation before calibration does not flag a mismatch.

Advisory checks are never added to branch protection without a recorded DECISIONS.md ruling, per INT002 and NFR010. This includes the Lighthouse audit in the post_deploy_smoke job: its performance category is advisory per ruling R023 (recorded and visible, never failing), while its accessibility, best practices, and SEO categories block within that post deploy job but are not pull request merge contexts. Adding any advisory check to the required merge set is a change to INT002 and requires a ruling.

---

## 12. Requirement coverage summary

Primary: FR017, FR025, FR033, NFR009, NFR010, ACC005. Packet 03 sections 15, 16, 17 fully mapped.

Secondary references implemented or verified by mechanisms in this plan: FR002, FR004, FR005, FR006, FR008, FR009, FR010, FR011, FR013, FR016, FR018, FR019, FR020, FR021, FR022, FR023, FR024, FR026, FR027, FR028, FR029, FR030, FR031, UX003, UX004, NFR001, NFR002, NFR004, NFR005, NFR008, DATA001, DATA002, SEC002, ACC001, ACC002, ACC003, ACC006, INT002, OPS001, OPS008, R015, R018, R019, R021, R022, R023, R024, F002, F003. Pending confirmation tracked in P004. The share URL length budget constant is owned by docs/DATA_MODEL.md, the worker message protocol by docs/ARCHITECTURE.md section 3, and the required check set by docs/CI_CD.md section 6.

Not owned by this document: business requirements BR001 to BR005, the security controls other than SEC002, the operations and release procedures beyond the references above, the branch protection specification (docs/CI_CD.md section 6), and the accessibility model detail, which lives in docs/ACCESSIBILITY.md.

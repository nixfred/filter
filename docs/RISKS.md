# RISKS

Project risk register for The Great Filter (filter.nixfred.com). Hostile review of the packet, the DECISIONS.md rulings, and the PRD skeleton. Every risk asks one question: what makes this project fail, ship late, ship wrong, or embarrass its owner.

IDs are stable and never renumbered. Likelihood and impact are engineering judgment, not measured statistics, and are labeled as such. Low, medium, high. Categories: technical, scientific, scope, operational, external.

The absorbing document field names where the mitigation must actually live, so a design specialist cannot treat a risk as noted-and-ignored. The five design documents called out by the charter are ARCHITECTURE, TEST_PLAN, INTERACTION_SPEC, CI_CD, SECURITY_PLAN. Discipline documents made canonical by ruling R001 (simulation_model, scientific_assumptions, ACCESSIBILITY, OPERATIONS, DATA_MODEL, ART_DIRECTION, deployment) are named where they are the correct home.

## Register at a glance

| ID | Risk | Category | Likelihood (judgment) | Impact (judgment) | Owner |
|---|---|---|---|---|---|
| RK01 | Cross engine floating point determinism breaks reproducibility | technical, scientific | high | high | architect |
| RK02 | Seeded RNG and event queue ordering are not fully pinned | technical | medium | high | architect |
| RK03 | Adaptive rendering leaks into simulation inputs | technical | medium | high | architect |
| RK04 | Three.js and WebGL cannot hold frame rate on the 2021 mobile floor | technical | high | high | architect |
| RK05 | Worker to main thread serialization saturates at 1000x speed | technical | medium | high | architect |
| RK06 | Three.js pushes the initial bundle over the CI budget | technical, operational | medium | medium | architect |
| RK07 | The six control hidden blend produces degenerate or off character galaxies | scientific, scope | high | high | architect |
| RK08 | Scientific credibility attack on a public educational site | external, scientific | medium | high | prd-analyst |
| RK09 | Share URL exceeds practical browser and social length limits | technical | medium | medium | architect |
| RK10 | Reflected injection through shared scenario URLs and social preview | technical, operational | low | high | security |
| RK11 | Accessibility of a canvas centered experience is structurally hard | technical, scope | high | medium | designer |
| RK12 | The non WebGL fallback renderer is an unbudgeted second implementation | scope, technical | medium | medium | architect |
| RK13 | CI and governance weight overwhelms a solo maintainer | operational | high | medium | devops |
| RK14 | Cloudflare Access on previews stalls the design review loop | operational | medium | medium | devops |
| RK15 | The behavior derived CSP blocks the worker or the analytics beacon | technical, operational | medium | medium | security |
| RK16 | Lighthouse thresholds are flaky or unreachable for a heavy WebGL app | operational | medium | medium | quality |
| RK17 | Coverage floors are unreachable for renderer and worker code | operational | medium | medium | quality |
| RK18 | Scope creep from the packet deferred features | scope | medium | medium | prd-analyst |
| RK19 | The 170 question surface reopens settled rulings mid build | scope, operational | medium | medium | prd-analyst |
| RK20 | Wrangler Direct Upload and scoped token auth break the CI deploy | operational | medium | medium | devops |
| RK21 | Custom domain or certificate association fails the launch smoke gate | operational | low | medium | devops |
| RK22 | Auto restore of a stale scenario after a model version bump | technical | medium | medium | architect |
| RK23 | Onboarding versus the three minute comprehension promise | scope | medium | medium | designer |
| RK24 | Solo maintainer bus factor and post launch decay | operational, external | medium | low | devops |

## Detailed register

### RK01 Cross engine floating point determinism breaks reproducibility
Category: technical, scientific. Likelihood: high (judgment). Impact: high (judgment).
Description: FR017 promises that the same seed, parameters, and simulation model version produce an identical run digest, and FR008 promises a shared URL reproduces the identical modeled history. JavaScript engine transcendental functions (Math.sin, Math.cos, Math.exp, Math.log, Math.pow) are not guaranteed bit identical across V8, SpiderMonkey, and JavaScriptCore. A hazard model, a waiting time distribution, and a light travel calculation are exactly the places those functions get used. If any transcendental output, or any float that accumulated from one, feeds a state transition branch or the run digest, then a scenario authored in Chrome will silently diverge when reopened in Safari or Firefox. This is the charter hard rule 8 hazard and it is the single most likely defect to reach production, because the CI determinism job (simulation_determinism) runs on one engine (Node and its V8) and will pass while real cross engine reproduction fails in the field.
Affected requirements: FR017, FR008, FR019, FR021, FR025, FR026, FR033, DATA001, REL002 item 10.
Mitigation: determinism critical math uses integer or fixed point arithmetic, or deterministic in project implementations of any needed transcendental, never the engine intrinsics on the path that feeds a branch or the digest. The digest is built only from integer quantities and enumerations, never from raw floats. Decouple presentation math (which may use engine intrinsics freely) from simulation math (which may not). Add a determinism fixture set generated once and asserted, plus at least one cross engine reproduction check in the browser tests (default_run.spec.ts and share_scenario.spec.ts) run on Chromium, Firefox, and WebKit projects, not Chromium only.
Early warning trigger: the same seed produces a different digest between the Node unit run and a WebKit or Firefox Playwright run, or a code review finds Math.exp, Math.log, or Math.pow on a line that feeds a transition decision or the digest.
Absorbing document: ARCHITECTURE (simulation and presentation math boundary), TEST_PLAN (cross engine determinism projects and fixtures), simulation_model (documented deterministic distributions).
Owner: architect.

### RK02 Seeded RNG and event queue ordering are not fully pinned
Category: technical. Likelihood: medium (judgment). Impact: high (judgment).
Description: determinism (FR017) and causal ordering (FR025) fail if the seeded RNG is underspecified or the event queue has non deterministic tie breaking. Risks include: any call to Math.random anywhere on the simulation path, deriving ranges by float multiply, relying on Map or Set iteration order for scheduling, or resolving equal event timestamps by insertion order that itself depends on nondeterministic construction. The failure looks identical to RK01 (a digest mismatch) but has a different cause, so it must be guarded separately.
Affected requirements: FR017, FR025, FR033, NFR007.
Mitigation: specify one named integer PRNG algorithm in simulation_model with its exact update rule, seeding, and stream discipline. Give the event queue a total order with an explicit deterministic tie break key (for example timestamp then civilization index then event type ordinal), never insertion order or object identity. Ban Math.random on the simulation path with a lint rule where practical, and add a unit test that reseeds and asserts identical event sequences.
Early warning trigger: a property test that reruns one seed produces two different event orderings, or a grep finds Math.random inside src/simulation.
Absorbing document: ARCHITECTURE, simulation_model, TEST_PLAN.
Owner: architect.

### RK03 Adaptive rendering leaks into simulation inputs
Category: technical. Likelihood: medium (judgment). Impact: high (judgment).
Description: NFR002 requires visual star count and effects to adapt to device capability, and ruling R018 with FR023 deliberately separates a fixed representative simulated population from a larger decorative starfield. If that boundary leaks, so that device capability influences the simulated population size, the seed derivation, or any simulation input, then the same seed produces different histories on a phone and a desktop, breaking FR017 across devices in a way that is invisible on any single machine. This is a subtle coupling that is easy to introduce when the renderer and simulation share a galaxy generation helper.
Affected requirements: FR017, FR023, NFR002, F002.
Mitigation: enforce a one way dependency. The simulation population is a pure function of the scenario (seed and parameters) and nothing else. Device capability may only change the decorative layer and effect fidelity, never a simulation input. Codify that the simulation module never imports capability detection or renderer code (the manifest already states the simulation must not import renderer code, extend that to capability.ts).
Early warning trigger: a code path passes a device capability value, a viewport size, or a detected star budget into a simulation constructor or seed function.
Absorbing document: ARCHITECTURE (dependency direction), simulation_model.
Owner: architect.

### RK04 Three.js and WebGL cannot hold frame rate on the 2021 mobile floor
Category: technical. Likelihood: high (judgment). Impact: high (judgment).
Description: F002 selects Three.js points with custom shaders, FR028 stacks galaxy, civilization, signal, travel, and label layers, and ruling R018 puts a representative population behind a larger decorative starfield that Q27 sizes at up to tens of thousands of points. NFR001 then requires a stable interactive frame rate on a mid range 2021 class device (ruling R021). Concentric signal shells, travel fronts, and per point shader work at that scale is exactly the load that a 2021 midrange GPU struggles with. The danger is that development happens on hardware far quicker than the reference device, the frame rate looks acceptable throughout the build, and the NFR001 release gate is only truly exercised near G5 or G-LAUNCH on a real reference device, when the fix (fewer points, cheaper shaders, culling, instancing) is expensive to retrofit.
Affected requirements: NFR001, NFR002, FR028, F002, UX007.
Mitigation: define the reference device and the target frame rate as concrete numbers in TEST_PLAN, and measure against it from the first renderer spike, not at the end. Design the renderer for a low power mode (NFR002) and a device tiered star budget from the start. Prefer instanced or single draw call point rendering, budget shell and front counts, and cap simultaneous animated effects. Keep the decorative starfield count adaptive (permitted because it is not a simulation input, see RK03).
Early warning trigger: the first Three.js spike on the reference device falls below the target frame rate at the default decorative star count, or the renderer relies on per point objects rather than a points geometry.
Absorbing document: ARCHITECTURE (renderer tiering and budgets), TEST_PLAN (reference device and frame rate method), ART_DIRECTION (effect counts).
Owner: architect.

### RK05 Worker to main thread serialization saturates at 1000x speed
Category: technical. Likelihood: medium (judgment). Impact: high (judgment).
Description: FR018 runs the simulation in a Web Worker, FR024 offers 10x, 100x, 1000x, and maximum speed, and NFR006 requires the interface thread to stay usable during playback. At 1000x and maximum speed the worker produces events and state snapshots at a high rate. If each update crosses the worker boundary as a structured clone of large arrays every animation frame, the main thread spends its budget deserializing rather than rendering, which defeats the entire point of the worker and violates NFR006. The symptom is a frozen or janky interface precisely at the speeds meant to feel effortless.
Affected requirements: FR024, FR018, NFR006, NFR007, NFR001.
Mitigation: decouple simulation cadence from render cadence. The renderer samples the latest world state at its own frame rate rather than draining every simulation tick. Use compact typed array batches and transferable objects for the hot path, not per event object clones. Coalesce events between frames. Define a maximum snapshot size and a fixed render sampling interval in ARCHITECTURE.
Early warning trigger: the integration test simulation_worker.test.ts or an e2e run shows main thread long tasks during 1000x playback, or the message payload is a plain object array rather than a transferable buffer.
Absorbing document: ARCHITECTURE (worker message contract and cadence), INTERACTION_SPEC (how speed maps to render sampling), TEST_PLAN.
Owner: architect.

### RK06 Three.js pushes the initial bundle over the CI budget
Category: technical, operational. Likelihood: medium (judgment). Impact: medium (judgment).
Description: NFR004 requires an initial JavaScript budget defined after renderer selection and enforced in CI by the bundle_budget job. Three.js is a large dependency, and with React and the application shell the initial chunk can exceed a reasonable budget. Two failure modes compete: a budget set too generously makes the gate meaningless, and a budget set honestly forces code splitting the renderer, which fights the goal of showing the galaxy immediately (UX004, UX007). Set wrong, the bundle_budget job is either perpetually red or perpetually green and useless.
Affected requirements: NFR004, NFR003, F002, UX004, UX007.
Mitigation: import only the Three.js modules used, never the full examples bundle, and verify tree shaking. Lazy load education, sources, and analysis panels (NFR003) so they never sit in the initial chunk. Set the budget on a stated basis (gzip or brotli, initial route only) in CI_CD, with the renderer either in the initial chunk or behind the fallback first shell by explicit design, not by accident. Record the measured baseline before fixing the number.
Early warning trigger: the first production build initial chunk exceeds the drafted budget, or the bundle report shows the full three examples tree pulled in.
Absorbing document: CI_CD (budget basis and number), ARCHITECTURE (code splitting strategy).
Owner: architect.

### RK07 The six control hidden blend produces degenerate or off character galaxies
Category: scientific, scope. Likelihood: high (judgment). Impact: high (judgment).
Description: rulings R008 and R018 map six plain controls to a hidden blend of transition probabilities, waiting times, and hazard rates. The entire product thesis, and the emotional arc from abundance to near contact to silence, depends on that mapping being calibrated so that the default settings and the eight presets (FR010) produce runs with character. Two degenerate failures loom: every default run yields zero detectable civilizations and zero near misses (the site feels empty and the sentence first payload of BR004 never fires), or every run is crowded with contact (which contradicts BR003 scientific honesty and the whole premise). Preset drift is the same risk in another form, as the model is tuned a fixed preset parameter set can stop producing the outcome its name promises (Silent Galaxy, Expansion Wins), which reads as broken or dishonest. Calibration is iterative work that is easy to underestimate and easy to defer until it is expensive.
Affected requirements: FR001, FR002, FR010, R008, R018, BR002, BR003, BR004, FR009, UX003.
Mitigation: document the mapping and its calibration targets in simulation_model and scientific_assumptions, including the intended outcome distribution at default settings (for example a target rate of near misses versus confirmed contacts). Add property tests that run each preset and the default across many seeds and assert the outcome distribution matches the intended character band, so a later model change that breaks a preset fails CI (this fits the simulation_properties job). Treat calibration as a first class G3 task with its own evidence, not a G5 polish item.
Early warning trigger: default settings across many seeds nearly all produce zero detectable civilizations or zero near misses, or a preset outcome distribution contradicts its copy after a model change.
Absorbing document: simulation_model, scientific_assumptions, TEST_PLAN (preset and default distribution properties), INTERACTION_SPEC (control effect summaries).
Owner: architect, with prd-analyst confirming the character bands match the copy.

### RK08 Scientific credibility attack on a public educational site
Category: external, scientific. Likelihood: medium (judgment). Impact: high (judgment).
Description: nixfred/filter is public under MIT (F001) and the site is meant for a public audience. A visible Fermi paradox model invites scrutiny from people who know the subject. Predictable attacks: this is not the Drake equation and does not say so, the hazard rates are invented, speculation is presented as fact, or the headline sentence overclaims. BR003 forbids presenting any modeling assumption as established fact and forbids any claim to solve the Fermi paradox. A single screenshot of an unsupported claim can define the project on social platforms and embarrass its owner, which is a reputational impact even though it is not a security defect.
Affected requirements: BR003, UX003, FR012, R014, R017, R022.
Mitigation: scientific_assumptions.md must separate educational fact from assumption from simplification from speculative choice, and every core parameter should carry a source or an explicit this is a modeling choice label. The education drawers (FR012) must include assumptions and limitations and a Fermi paradox versus Drake distinction. Copy discipline (R017) and the no representative single run rule (R022) keep the claims honest. Run a pre launch review pass specifically hunting for any sentence that states an assumption as fact.
Early warning trigger: an internal review or a trusted reader flags a copy line that asserts an unsupported claim, or the Silence Report headline generator can emit a sentence that overstates certainty.
Absorbing document: scientific_assumptions, TEST_PLAN (copy and headline review as a manual gate), ART_DIRECTION (copy voice).
Owner: prd-analyst, with designer for copy.

### RK09 Share URL exceeds practical browser and social length limits
Category: technical. Likelihood: medium (judgment). Impact: medium (judgment).
Description: DATA001 and FR008 encode model version, seed, and all parameters into a share URL, and ruling R008 allows advanced settings to split hazard categories, so the parameter set can grow. Practical URL ceilings exist: older guidance caps at about 2000 characters for broad compatibility, some servers and link unfurlers truncate, QR codes degrade with length, and social preview crawlers can mishandle long URLs. If the encoding is verbose (for example JSON then base64) a full advanced scenario can bloat past a safe ceiling, so a shared link fails to open cleanly or fails to unfurl in a social card. Migration of older formats (FR026) can add further length.
Affected requirements: DATA001, FR008, FR026, SEC002, REL005.
Mitigation: choose a compact binary or bit packed encoding, base64url for URL safety, and version prefix it. Define a maximum encoded length budget in DATA_MODEL and assert it in the round trip test (scenario_round_trip.test.ts) so a scenario that would exceed the ceiling fails CI. Keep the social preview independent of URL length (the fallback P002 image is a rendered frame, not a live URL fetch).
Early warning trigger: encoding a full advanced scenario in scenario_round_trip.test.ts exceeds the chosen length budget.
Absorbing document: DATA_MODEL (encoding and length budget), TEST_PLAN (round trip length assertion), ARCHITECTURE.
Owner: architect.

### RK10 Reflected injection through shared scenario URLs and social preview
Category: technical, operational. Likelihood: low (judgment). Impact: high (judgment).
Description: shared scenario URLs (FR008, DATA001) are attacker controllable input, and SEC002 requires validation, clamping, and length limits. The classic surface is small in v1 because R013 forbids server logic and R008 uses numeric controls rather than free text, so there is no stored user string. The residual vectors are: a crafted parameter reflected without encoding into the DOM or into the Silence Report headline (FR009), and a parameter or model value reflected into a social or meta tag consumed by a preview crawler (P002). A reflected script or meta value would be a cross site scripting or metadata injection defect on a public site. There is also a prompt injection framing, since the whole project is agent built and a shared URL posted to Fred could carry text meant to influence the agent, though v1 stores no free text so the surface is the reflection path, not stored content.
Affected requirements: SEC002, SEC003, SEC009, FR009, DATA001, P002.
Mitigation: the headline sentence (FR009) is composed only from validated numeric metrics and fixed template strings, never by echoing a raw URL value. The scenario decoder validates, clamps, or deterministically rejects every field (FR026) before any value reaches React state. React escaping plus a behavior derived CSP (SEC003) that forbids inline script provides defense in depth. Social and meta tags are built from fixed strings and the deployed values, never from request parameters. Add hostile scenario fixtures to the test tree that inject script like and oversized values and assert they are rejected and never rendered.
Early warning trigger: a hostile input fixture injects a script like or markup like parameter and it appears unescaped in the DOM, a meta tag, or the headline.
Absorbing document: SECURITY_PLAN (threat model of malicious scenario links and reflection), ARCHITECTURE (decode and validate before state), TEST_PLAN (hostile scenario fixtures).
Owner: security.

### RK11 Accessibility of a canvas centered experience is structurally hard
Category: technical, scope. Likelihood: high (judgment). Impact: medium (judgment).
Description: the core output is a WebGL canvas, which is opaque to assistive technology by default. ACC001 requires the complete core path to operate with keyboard only, including canvas interactions (FR005) of zoom, pan, select, and inspect. ACC002 requires screen reader landmarks and nonvisual status descriptions of an evolving simulation through a live region policy. Two structural traps: keyboard operation of a spatial canvas needs a deliberate focus and selection model that does not exist for free, and a naive live region that announces every state change will flood a screen reader unusably at 100x or 1000x speed (FR024). Reduced motion (ACC003, FR029) adds a third path that must present discrete state changes and timestamped summaries rather than animation. These are release gates (accessibility_tests plus a manual protocol, ACC005), not cleanup, and they fail late if deferred.
Affected requirements: ACC001, ACC002, ACC003, ACC004, ACC005, ACC006, FR005, FR029, FR030.
Mitigation: design the keyboard model for the canvas explicitly in INTERACTION_SPEC (a focusable civilization list or grid parallel to the visual selection, keyboard shortcuts for run controls). Define a live region policy in ACCESSIBILITY that summarizes and throttles, announcing milestone events and periodic state summaries rather than every tick, and scaling announcement density inversely with speed. Treat the reduced motion and fallback presentation (RK12) as the accessible substrate, not a second class path. Scope core_flows.spec.ts to the running simulation state, not only static pages.
Early warning trigger: the first axe run on the running simulation state reports the canvas as unlabeled with no textual equivalent, or a screen reader pass floods at high speed.
Absorbing document: ACCESSIBILITY (live region and keyboard model), INTERACTION_SPEC (canvas keyboard interactions), TEST_PLAN (accessibility scope including the live simulation).
Owner: designer.

### RK12 The non WebGL fallback renderer is an unbudgeted second implementation
Category: scope, technical. Likelihood: medium (judgment). Impact: medium (judgment).
Description: F002 and FR028 require a non WebGL fallback renderer for low power, reduced motion, and unsupported devices, and FR030 requires designed loading, empty, degraded, unsupported, and error states. The fallback is effectively a second renderer that must present the same simulation meaningfully, and it carries the reduced motion path (FR029, ACC003) and the unsupported renderer browser test. The risk is that it is treated as a stub and left half built until late, then fails the reduced motion and unsupported fallback gates near G5, when it is entangled with accessibility (RK11).
Affected requirements: FR028, FR029, FR030, NFR002, ACC003, FR005.
Mitigation: define a single renderer adapter contract in ARCHITECTURE that both the Three.js renderer and the fallback implement, so the fallback is a first class implementation of a shared interface, not an afterthought. Give the fallback an owner and a gate from G3, and make the reduced motion e2e (reduced_motion.spec.ts) and unsupported renderer e2e exercise it early.
Early warning trigger: the fallback renderer has no gate row or owner past G3, or the reduced motion path renders nothing meaningful in its first e2e run.
Absorbing document: ARCHITECTURE (renderer adapter contract), TEST_PLAN (reduced motion and fallback coverage), INTERACTION_SPEC.
Owner: architect, with designer for the reduced motion presentation.

### RK13 CI and governance weight overwhelms a solo maintainer
Category: operational. Likelihood: high (judgment). Impact: medium (judgment).
Description: the packet mandates five workflows and twelve CI job names, branch protection with required checks and conversation resolution (INT001), squash only with auto delete branches, weekly Dependabot on both npm and GitHub Actions ecosystems (INT005), and automatic production deploy on green main (R011). For a solo maintainer this is continuous overhead, not a one time cost. Two concrete bites: a single flaky required check (violating NFR010) blocks production because deploy is gated on all required checks, and the weekly Dependabot flow generates a steady stream of update pull requests that either pile up unreviewed or get rubber stamped, eroding SEC004 and SEC007 in practice. The gates that make the project credible are the same gates a tired solo maintainer is tempted to weaken.
Affected requirements: INT001, INT002, INT005, NFR010, SEC004, SEC005, SEC006, R011, OPS008.
Mitigation: keep every required check deterministic and label any advisory check as non blocking so a WARN never blocks a merge. Group low risk development dependency updates (INT005 already asks for this) to cut Dependabot volume, and set a monthly triage cadence in OPERATIONS rather than reacting per pull request. Consider a scheduled or cadence based Lighthouse rather than per pull request blocking (see RK16). Document in CI_CD exactly which jobs are BLOCK and which are advisory so the maintainer is never forced to bypass protection.
Early warning trigger: a Dependabot backlog grows unmerged, a flaky required check forces repeated reruns in the first weeks, or branch protection is bypassed to ship.
Absorbing document: CI_CD (blocking versus advisory jobs, concurrency), OPERATIONS (maintenance and triage cadence), TEST_PLAN (flaky test policy for NFR010).
Owner: devops.

### RK14 Cloudflare Access on previews stalls the design review loop
Category: operational. Likelihood: medium (judgment). Impact: medium (judgment).
Description: ruling R012 and PENDING P001 protect preview deployments with Cloudflare Access until Fred opens them, with a one time PIN to frednix@gmail.com as the fallback. The design approval loop needs eyes on previews: P002 (social preview) and P003 (final launch approval, a MANUAL blocking gate) both depend on Fred and possibly other reviewers seeing rendered previews. If the Access policy is scoped to a single identity, any second reviewer is blocked, and fork pull requests receive no credentials (SEC008) so their previews never build at all. The result is a review bottleneck at exactly the phases (G5 design refinement, G-LAUNCH approval) where visual iteration matters most.
Affected requirements: R012, SEC008, SEC010, P001, P002, P003, REL006.
Mitigation: scope the Access policy to the identities that actually need to review, document in CI_CD and SECURITY_PLAN how to add a reviewer, and note that P001 should be resolved before the design refinement phase so the access model is settled before heavy review begins. Keep the pages.dev preview alias and the GitHub deployment record as the canonical way to locate a preview.
Early warning trigger: a preview needs a second reviewer during G5 and the Access policy blocks them, or a design iteration waits on preview access.
Absorbing document: CI_CD (preview access and reviewer onboarding), SECURITY_PLAN (Access policy scope).
Owner: devops.

### RK15 The behavior derived CSP blocks the worker or the analytics beacon
Category: technical, operational. Likelihood: medium (judgment). Impact: medium (judgment).
Description: SEC003 requires a Content Security Policy generated from actual application behavior and explicitly forbids pasting a broad policy. Ruling F004 and INT006 require the CSP to permit exactly the Cloudflare Web Analytics beacon origin. Two tight spots: a Web Worker built by Vite can load from a blob URL, which a strict policy blocks unless worker-src permits blob, and the analytics beacon needs its script and connect origins allowed. A CSP that is correct on paper but untested against the real worker and beacon can break the simulation or silently drop analytics in production, where it is hardest to notice.
Affected requirements: SEC003, INT006, F004, FR018, SEC008.
Mitigation: enumerate the exact required sources in SECURITY_PLAN (self, the analytics origin, worker blob if the build uses it, image and style needs of Three.js), and verify the policy against a production like preview before launch, including that the worker starts and the beacon fires. Add a header presence check to CI and a manual production acceptance step (checklist item 7) that confirms the worker and beacon both function under the deployed CSP.
Early warning trigger: the worker fails to start or the analytics beacon is blocked under the drafted CSP in a preview, or the worker is loaded from a blob URL the policy does not permit.
Absorbing document: SECURITY_PLAN (CSP source enumeration), CI_CD (header verification), ARCHITECTURE (worker instantiation strategy).
Owner: security.

### RK16 Lighthouse thresholds are flaky or unreachable for a heavy WebGL app
Category: operational. Likelihood: medium (judgment). Impact: medium (judgment).
Description: NFR005 requires Lighthouse performance, accessibility, best practice, and SEO audits to meet approved thresholds via lighthouserc. A Three.js application with a large canvas and adaptive rendering tends to score lower and vary run to run on the performance axis in a throttled headless CI environment. If the performance threshold is set aggressively and run as a per pull request blocking gate, it flakes red and violates NFR010 (no flaky required tests), pressuring the maintainer to weaken it.
Affected requirements: NFR005, NFR004, NFR010, NFR001.
Mitigation: set Lighthouse thresholds on a stated basis and decide explicitly whether the performance category is a blocking per pull request gate or a scheduled cadence check (the packet section 16 allows an approved cadence). Keep accessibility, best practice, and SEO categories as the strict blocking parts, since those are stable, and treat raw performance score with margin or as advisory, backed by the concrete NFR001 device frame rate measurement (RK04) as the real performance gate.
Early warning trigger: Lighthouse performance variance across CI runs exceeds the threshold margin in the first runs.
Absorbing document: CI_CD (Lighthouse cadence and blocking scope), TEST_PLAN (which categories block).
Owner: quality.

### RK17 Coverage floors are unreachable for renderer and worker code
Category: operational. Likelihood: medium (judgment). Impact: medium (judgment).
Description: NFR009 requires at least 85 percent line coverage for the simulation domain and at least 80 percent overall, enforced in CI (the coverage job). The simulation domain is pure logic and reaching 85 percent is achievable. The overall 80 percent is at risk because the Three.js renderer, the worker glue, and DOM heavy React components are hard to cover without brittle mocks and a WebGL context in the test environment. If renderer and worker code sit inside the overall denominator, the 80 percent floor can stall merges regardless of simulation quality.
Affected requirements: NFR009, FR018, FR028, NFR010.
Mitigation: define the coverage scope in TEST_PLAN and vitest.config, keeping the 85 percent target on the pure simulation domain and setting the overall 80 percent denominator to exclude untestable renderer and worker boot code, or covering the renderer through the browser tests rather than unit coverage. Make the coverage basis explicit so the floor measures logic quality, not WebGL mocking effort.
Early warning trigger: overall coverage stalls below 80 percent because renderer and worker files are in the denominator and uncovered.
Absorbing document: TEST_PLAN (coverage scope and denominator), CI_CD (coverage job configuration).
Owner: quality.

### RK18 Scope creep from the packet deferred features
Category: scope. Likelihood: medium (judgment). Impact: medium (judgment).
Description: the PRD marks FR015 (Make Contact More Likely sensitivity analysis), FR034 (Monte Carlo batches), FR035 (sound), and FR036 (public gallery) as DEFERRED, and rulings R006, R007, R013, R022 keep PWA, sound, server logic, and batch runs out of v1. The packet itself markets FR015 as a strong optional feature and the interview dangles export JSON (Q71), export image (Q72), compare runs (Q73), and named local scenarios (Q67). Each is a plausible small addition that erodes the ship when green timeline and the bundle and performance budgets. Sensitivity analysis in particular implies running many neighboring simulations, which pulls in the batch machinery that R022 deferred.
Affected requirements: FR015, FR034, FR035, FR036, R006, R007, R013, R022, BR001.
Mitigation: the EXECUTION_PLAN treats the deferred list as binding and additive later, and the gate matrix gives no deferred requirement a v1 gate row (a BUILD.md reconciliation check already asserts every BLOCK row maps to a phase gate). Any request to pull a deferred feature into v1 becomes a recorded ruling change, not a quiet addition.
Early warning trigger: a deferred requirement acquires a v1 gate row, or a deferred feature appears in a pull request before v1 launch.
Absorbing document: TEST_PLAN and CI_CD only insofar as no gate references a deferred ID; the primary control is the gate matrix and EXECUTION_PLAN.
Owner: prd-analyst.

### RK19 The 170 question surface reopens settled rulings mid build
Category: scope, operational. Likelihood: medium (judgment). Impact: medium (judgment).
Description: ruling R002 makes the packet 170 discovery questions a candidate set that the rulings settle, but the questions remain in the repository and many model details (Q30 to Q36 on transition structure, Q49 to Q51 on civilization types) are not explicitly ruled. The risk is churn: an agent or a later reader cites an interview question number to justify diverging from a ruling (for example reopening 2D versus 3D, the control count, or warfare), or a genuinely unresolved model detail surfaces as a new requirement mid build and destabilizes the simulation contract after implementation has begun.
Affected requirements: R002, R008, R009, R010, R014, R018, R019, FR016.
Mitigation: DECISIONS.md is authority position two and the charter forbids reopening a ruling without first recording a material conflict. Genuinely open model details go to PENDING with executable fallbacks, not into ad hoc mid build decisions. New requirements discovered during build follow the BUILD.md 4.3 path (new ID, gate row) rather than mutating existing IDs.
Early warning trigger: a pull request description or an agent report cites an interview question number to justify diverging from a ruling, or a model detail is decided in code without a ruling or PENDING entry.
Absorbing document: primary control is DECISIONS.md and PENDING.md governance; ARCHITECTURE and simulation_model must cite the ruling IDs they implement so a divergence is visible.
Owner: prd-analyst.

### RK20 Wrangler Direct Upload and scoped token auth break the CI deploy
Category: operational. Likelihood: medium (judgment). Impact: medium (judgment).
Description: INTAKE section 3 records that the local Wrangler is authenticated by a scoped env API token, that wrangler pages project list fails on the memberships call with that token, and that deploys must pass CLOUDFLARE_ACCOUNT_ID explicitly. INT003 uses Cloudflare Pages Direct Upload and INT002 runs the deploy in GitHub Actions. The same class of permission gap can appear in CI with a differently scoped token, and a Wrangler version bump can change Direct Upload behavior, breaking deploy_preview or deploy_production. A deploy that works locally but fails in CI blocks the launch path.
Affected requirements: INT002, INT003, INT004, OPS005, SEC001, SEC008.
Mitigation: pin the Wrangler version in the workflows, pass CLOUDFLARE_ACCOUNT_ID explicitly rather than relying on membership discovery, and document the exact token scope needed for Direct Upload Pages deployment in deployment.md (names only, never values, per SEC001). Prove the deploy path on a preview before it guards production.
Early warning trigger: the first CI deploy job fails on a membership or permission call, or a Wrangler upgrade changes the Direct Upload command surface.
Absorbing document: CI_CD (pinned Wrangler, explicit account id), deployment (token scope and procedure).
Owner: devops.

### RK21 Custom domain or certificate association fails the launch smoke gate
Category: operational. Likelihood: low (judgment). Impact: medium (judgment).
Description: INT003 attaches filter.nixfred.com to the Pages project with verified DNS and certificate, and OPS006 runs post deploy smoke tests against the custom domain that fail the workflow on a critical path failure. Certificate issuance and DNS propagation can lag after a domain is attached, so a smoke test that runs immediately against the custom domain can fail on a certificate that is merely still issuing rather than a real defect, failing the launch (production acceptance items 1 and 2).
Affected requirements: INT003, OPS006, REL002, OPS005.
Mitigation: sequence the domain attach and certificate wait before the gating smoke run, add a bounded retry with backoff to the custom domain smoke test, and keep the pages.dev address as an operational fallback (INT003 already requires retaining it). Document the domain and certificate procedure in deployment.md and test the rollback path once before launch (production acceptance item 17).
Early warning trigger: the certificate is in a pending state at the first production deploy, or the custom domain smoke test fails while the pages.dev address serves correctly.
Absorbing document: OPERATIONS and deployment (domain and certificate sequence), CI_CD (smoke retry and backoff).
Owner: devops.

### RK22 Auto restore of a stale scenario after a model version bump
Category: technical. Likelihood: medium (judgment). Impact: medium (judgment).
Description: FR013 persists preferences and the last scenario in localStorage and FR014 restores the last scenario on the next visit. Ruling R015 gives the simulation model its own version, separate from the application version, carried in the share schema, and FR026 requires the scenario schema to validate, clamp or reject, and migrate supported older formats. If the auto restore path (FR014) does not run the same validation and migration as the share URL path, then a stored scenario from an older simulation model version can restore into a newer model and render a wrong or misleading run, or crash, on the visitor's next visit, with no action on their part.
Affected requirements: FR013, FR014, FR026, DATA001, R015, DATA002.
Mitigation: route the localStorage restore through the identical decode, validate, migrate pipeline as the share URL (DATA001), and on an unmigratable or invalid stored scenario fall back to defaults with a visible note rather than rendering a broken state. Cover the model version bump plus stale storage case in an integration test.
Early warning trigger: a model version bump plus a stored older scenario produces an error or a visibly wrong run in the round trip or worker integration test.
Absorbing document: ARCHITECTURE (shared decode and migrate pipeline for URL and storage), DATA_MODEL (migration rules), TEST_PLAN.
Owner: architect.

### RK23 Onboarding versus the three minute comprehension promise
Category: scope. Likelihood: medium (judgment). Impact: medium (judgment).
Description: BR002 promises a first time visitor understands the core interaction without reading a long essay, FR011 requires skippable onboarding with direct access to the simulation, and UX004 sets the opening state. The tension is real: onboarding heavy enough to teach the six controls and the causal contact concept risks failing the three minute and no long essay promise and causing bounce, while onboarding light enough to stay out of the way risks leaving visitors confused about what the controls do and why most civilizations never make contact. This is a product and UX calibration risk, not a defect, but it determines whether the core promise lands.
Affected requirements: BR002, FR011, UX004, FR002, BR004.
Mitigation: design onboarding as skippable and progressive in INTERACTION_SPEC, teaching through the first run rather than a preamble, with control anatomy (FR002) carrying the per control explanation inline so the onboarding does not have to. Validate comprehension informally before launch rather than assuming it.
Early warning trigger: early reviewers cannot state what a control does after one run, or the onboarding grows into multiple screens of text.
Absorbing document: INTERACTION_SPEC (onboarding flow), ART_DIRECTION (copy load per control).
Owner: designer.

### RK24 Solo maintainer bus factor and post launch decay
Category: operational, external. Likelihood: medium (judgment). Impact: low (judgment).
Description: OPS007 and OPS008 define incident records and a monthly maintenance cadence, and R011 auto deploys on green main. With a single maintainer, scheduled dependency review, security checks, and browser compatibility checks (OPS008) can lapse after launch, and an incident when the maintainer is unavailable has no second responder. This is a slow, low urgency risk rather than a launch blocker, but it is what turns a launched LABS site into an unmaintained one.
Affected requirements: OPS007, OPS008, OPS004, SEC004, SEC005.
Mitigation: lean on automation so maintenance does not depend on attention, meaning Dependabot grouping (INT005), scheduled CodeQL and dependency review (SEC004, SEC005), and a scheduled security and browser compatibility check (OPS008). Keep the rollback procedure documented and tested (OPS004) so recovery does not require the original context. Accept the residual bus factor as inherent to a solo LABS project.
Early warning trigger: scheduled maintenance workflows fail silently for consecutive cycles, or the last dependency review predates the current month.
Absorbing document: OPERATIONS (maintenance cadence and rollback), CI_CD (scheduled workflows).
Owner: devops.

## Top five risks most likely to actually bite

These five are ranked by the probability that they cause real pain during the build or at launch, with brutal honesty about why.

1. RK01 cross engine floating point determinism. This is the one that reaches production. The build will pass its determinism job every single time, because that job runs on one engine, and the defect only appears when a real visitor opens a shared URL in a different browser than the author used. Hazard rates and waiting times are exactly where a developer reaches for Math.exp and Math.log, and the moment one of those floats decides a state transition or lands in the digest, FR017 and FR008 are quietly broken for a subset of visitors. It is high likelihood because the natural way to write the model triggers it, and high impact because reproducibility is a headline promise of the product. The only real defense is architectural discipline enforced from the first line of simulation code plus a cross engine reproduction test, not a fix bolted on later.

2. RK04 Three.js performance on the 2021 mobile floor. NFR001 is a release gate against a mid range 2021 device, and the entire build will happen on hardware far quicker than that. Tens of thousands of shader driven points with signal shells and travel fronts is a genuine load for a 2021 midrange GPU, and the frame rate will look fine on the developer's machine right up until someone tests the reference device near the end, when reducing point counts and cheapening shaders is a costly retrofit that also touches the art direction. High likelihood because the feedback loop hides the problem until late, high impact because a janky galaxy on a phone undermines the core experience and blocks a release gate.

3. RK07 the six control hidden blend producing degenerate galaxies. The product lives or dies on calibration that the rulings describe but do not solve. If the default settings and the eight presets are not tuned so that a typical run actually delivers the abundance to attrition to near contact to silence arc, the site is either an empty starfield or a crowded contradiction of its own thesis, and the sentence first payload of BR004 never fires. This is high likelihood because calibration is iterative, easy to underestimate, and easy to defer past G3, and high impact because it is the difference between a memorable instrument and a broken toy. It needs property tests that assert outcome character per preset so a later model change cannot silently break it.

4. RK13 CI and governance weight on a solo maintainer. Five workflows, twelve required jobs, branch protection, weekly Dependabot on two ecosystems, and auto deploy on green main is a lot of machinery for one person, and it bites continuously rather than once. A single flaky required check blocks production because deploy is gated on all required checks, and the weekly update pull requests either pile up or get rubber stamped, hollowing out the very dependency review the packet demands. This is high likelihood because the overhead is structural and constant, and its real danger is second order: a tired maintainer weakens the gates that made the project credible in the first place. The mitigation is to make the blocking versus advisory split explicit and to keep every required check deterministic.

5. RK11 accessibility of a canvas centered experience. ACC001 and ACC002 are release requirements, and a WebGL canvas is a black box to assistive technology by default. Keyboard operation of a spatial canvas and nonvisual status of an evolving simulation both need deliberate models that do not come for free, and a naive live region floods a screen reader unusably at high speed. This is high likelihood because it is structurally hard and easy to leave until the accessibility gate at G5, and the impact is that a release blocking gate fails late, entangled with the fallback renderer, when it is expensive to fix. It has to be designed into the interaction model from the start, with the reduced motion and fallback path treated as the accessible substrate rather than a lesser mode.

## New requirement candidates

These surfaced during hostile review and are reported for the requirements analyst only, not written into PRD.md by this document.

1. A cross engine determinism check requirement: at least one reproduction test asserts identical digests across Chromium, Firefox, and WebKit, not a single engine. Strengthens FR017 and FR033.
2. A share URL maximum encoded length budget as an explicit, CI asserted number. Strengthens DATA001 and FR008.
3. A live region announcement density policy that scales inversely with simulation speed. Strengthens ACC002 and FR024.
4. A preset outcome character property test that fails CI when a model change breaks a preset's promised behavior. Strengthens FR010 and BR003.
5. An explicit statement of which CI checks are BLOCK and which are advisory, so branch protection is never bypassed. Strengthens INT002 and NFR010.

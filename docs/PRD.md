# PRD: The Great Filter

Contractual requirements register for filter.nixfred.com. IDs are stable and never renumbered. Status values: ACTIVE, PENDING, DEFERRED, SUPERSEDED, VERIFIED.

Priority legend: P1 launch blocking, P2 required for done, P3 enhancing. Gate class legend: BLOCK a failure stops the gate, WARN a failure is recorded but does not stop the gate, MANUAL a human decision is required. First phase is the earliest gate at which the requirement must first pass, from the set G0, G1, G2, G3, G4, G5, G6, G7, G-LAUNCH. Packet file references use the numbers 01 (execution directive), 02 (product and art direction), 03 (CI/CD functional requirements), 04 (repository file manifest), 05 (discovery interview). Ruling IDs F00x and R00x are defined in DECISIONS.md.

## Index

### Business requirements

| ID | Title | Priority | Gate class | First phase | Status |
|---|---|---|---|---|---|
| BR001 | Product identity | P1 | BLOCK | G1 | ACTIVE |
| BR002 | Three minute comprehension | P1 | BLOCK | G3 | ACTIVE |
| BR003 | Scientific honesty | P1 | BLOCK | G4 | ACTIVE |
| BR004 | Sentence first outcomes | P1 | BLOCK | G3 | ACTIVE |
| BR005 | Free and account free | P1 | BLOCK | G3 | ACTIVE |

### Functional requirements

| ID | Title | Priority | Gate class | First phase | Status |
|---|---|---|---|---|---|
| FR001 | Six main controls | P1 | BLOCK | G3 | ACTIVE |
| FR002 | Control anatomy | P1 | BLOCK | G3 | ACTIVE |
| FR003 | Advanced settings | P2 | BLOCK | G3 | ACTIVE |
| FR004 | Run controls | P1 | BLOCK | G3 | ACTIVE |
| FR005 | Canvas interactions | P1 | BLOCK | G3 | ACTIVE |
| FR006 | Event ledger | P1 | BLOCK | G3 | ACTIVE |
| FR007 | Label toggle | P2 | BLOCK | G3 | ACTIVE |
| FR008 | Shareable scenarios | P1 | BLOCK | G3 | ACTIVE |
| FR009 | Silence Report | P1 | BLOCK | G3 | ACTIVE |
| FR010 | Presets | P1 | BLOCK | G4 | ACTIVE |
| FR011 | Onboarding | P1 | BLOCK | G3 | ACTIVE |
| FR012 | Education drawers | P1 | BLOCK | G4 | ACTIVE |
| FR013 | Local preferences | P2 | BLOCK | G4 | ACTIVE |
| FR014 | Scenario restore | P2 | BLOCK | G4 | ACTIVE |
| FR015 | Contact sensitivity feature | - | - | - | DEFERRED |
| FR016 | Civilization state machine | P1 | BLOCK | G2 | ACTIVE |
| FR017 | Determinism | P1 | BLOCK | G2 | ACTIVE |
| FR018 | Worker execution | P1 | BLOCK | G2 | ACTIVE |
| FR019 | Light travel | P1 | BLOCK | G2 | ACTIVE |
| FR020 | Posthumous signals | P2 | BLOCK | G2 | ACTIVE |
| FR021 | Expansion model | P1 | BLOCK | G2 | ACTIVE |
| FR022 | Causal contact | P1 | BLOCK | G2 | ACTIVE |
| FR023 | Representative population | P2 | BLOCK | G2 | ACTIVE |
| FR024 | Speed steps | P1 | BLOCK | G3 | ACTIVE |
| FR025 | Causal event ordering | P1 | BLOCK | G2 | ACTIVE |
| FR026 | Versioned scenario schema | P1 | BLOCK | G2 | ACTIVE |
| FR027 | Run metrics | P1 | BLOCK | G2 | ACTIVE |
| FR028 | Renderer layers | P1 | BLOCK | G3 | ACTIVE |
| FR029 | Reduced motion mode | P1 | BLOCK | G3 | ACTIVE |
| FR030 | Degraded states | P2 | BLOCK | G4 | ACTIVE |
| FR031 | Mobile layout | P1 | BLOCK | G3 | ACTIVE |
| FR032 | Desktop layout | P1 | BLOCK | G3 | ACTIVE |
| FR033 | Deterministic fixtures | P1 | BLOCK | G2 | ACTIVE |
| FR034 | Batch runs | - | - | - | DEFERRED |
| FR035 | Sound | - | - | - | DEFERRED |
| FR036 | Public scenario gallery | - | - | - | DEFERRED |

### User experience requirements

| ID | Title | Priority | Gate class | First phase | Status |
|---|---|---|---|---|---|
| UX001 | Art direction | P1 | BLOCK | G5 | ACTIVE |
| UX002 | Motion language | P2 | BLOCK | G5 | ACTIVE |
| UX003 | Copy voice | P1 | BLOCK | G4 | ACTIVE |
| UX004 | Opening state | P1 | BLOCK | G4 | ACTIVE |
| UX005 | Color system | P1 | BLOCK | G5 | ACTIVE |
| UX006 | Visual restraint | P2 | BLOCK | G5 | ACTIVE |
| UX007 | Canvas dominance | P2 | BLOCK | G5 | ACTIVE |

### Nonfunctional requirements

| ID | Title | Priority | Gate class | First phase | Status |
|---|---|---|---|---|---|
| NFR001 | Mobile frame rate | P1 | BLOCK | G5 | ACTIVE |
| NFR002 | Adaptive rendering | P2 | BLOCK | G5 | ACTIVE |
| NFR003 | No blocking third parties | P2 | BLOCK | G6 | ACTIVE |
| NFR004 | Bundle budgets | P1 | BLOCK | G6 | ACTIVE |
| NFR005 | Lighthouse thresholds | P1 | BLOCK | G7 | ACTIVE |
| NFR006 | Interface responsiveness | P1 | BLOCK | G3 | ACTIVE |
| NFR007 | Efficient structures | P2 | BLOCK | G2 | ACTIVE |
| NFR008 | Browser support | P1 | BLOCK | G7 | ACTIVE |
| NFR009 | Coverage floors | P1 | BLOCK | G2 | ACTIVE |
| NFR010 | Zero defect gates | P1 | BLOCK | G1 | ACTIVE |

### Accessibility requirements

| ID | Title | Priority | Gate class | First phase | Status |
|---|---|---|---|---|---|
| ACC001 | Keyboard operation | P1 | BLOCK | G5 | ACTIVE |
| ACC002 | Nonvisual status | P1 | BLOCK | G5 | ACTIVE |
| ACC003 | Reduced motion respect | P1 | BLOCK | G5 | ACTIVE |
| ACC004 | Contrast and color safety | P1 | BLOCK | G5 | ACTIVE |
| ACC005 | Automated and manual checks | P1 | BLOCK | G6 | ACTIVE |
| ACC006 | Focus management | P1 | BLOCK | G5 | ACTIVE |

### Security requirements

| ID | Title | Priority | Gate class | First phase | Status |
|---|---|---|---|---|---|
| SEC001 | No secret exposure | P1 | BLOCK | G1 | ACTIVE |
| SEC002 | Hostile input handling | P1 | BLOCK | G2 | ACTIVE |
| SEC003 | Security headers | P1 | BLOCK | G6 | ACTIVE |
| SEC004 | Dependency review | P1 | BLOCK | G6 | ACTIVE |
| SEC005 | Code scanning | P1 | BLOCK | G6 | ACTIVE |
| SEC006 | Secret scanning | P1 | BLOCK | G0 | ACTIVE |
| SEC007 | Pinned supply chain | P1 | BLOCK | G1 | ACTIVE |
| SEC008 | Preview isolation | P1 | BLOCK | G6 | ACTIVE |
| SEC009 | Threat model | P2 | BLOCK | G6 | ACTIVE |
| SEC010 | Preview access control | P1 | BLOCK | G6 | ACTIVE |

### Data requirements

| ID | Title | Priority | Gate class | First phase | Status |
|---|---|---|---|---|---|
| DATA001 | Share encoding | P1 | BLOCK | G2 | ACTIVE |
| DATA002 | Storage policy | P2 | BLOCK | G4 | ACTIVE |
| DATA003 | Privacy posture | P1 | BLOCK | G6 | ACTIVE |

### Integration requirements

| ID | Title | Priority | Gate class | First phase | Status |
|---|---|---|---|---|---|
| INT001 | GitHub repository | P1 | BLOCK | G0 | ACTIVE |
| INT002 | Workflows | P1 | BLOCK | G6 | ACTIVE |
| INT003 | Cloudflare Pages | P1 | BLOCK | G6 | ACTIVE |
| INT004 | Wrangler config | P1 | BLOCK | G1 | ACTIVE |
| INT005 | Dependabot | P2 | BLOCK | G6 | ACTIVE |
| INT006 | Analytics integration | P2 | BLOCK | G6 | ACTIVE |
| INT007 | Repository hygiene | P2 | BLOCK | G1 | ACTIVE |

### Operations requirements

| ID | Title | Priority | Gate class | First phase | Status |
|---|---|---|---|---|---|
| OPS001 | Script contract | P1 | BLOCK | G1 | ACTIVE |
| OPS002 | Pinned runtime | P1 | BLOCK | G1 | ACTIVE |
| OPS003 | Deployment record | P1 | BLOCK | G0 | ACTIVE |
| OPS004 | Rollback | P1 | BLOCK | G6 | ACTIVE |
| OPS005 | Deployment traceability | P1 | BLOCK | G6 | ACTIVE |
| OPS006 | Post deploy verification | P1 | BLOCK | G6 | ACTIVE |
| OPS007 | Incident record | P2 | WARN | G6 | ACTIVE |
| OPS008 | Maintenance cadence | P3 | WARN | G6 | ACTIVE |
| OPS009 | Version visibility | P1 | BLOCK | G4 | ACTIVE |
| OPS010 | Artifact retention | P2 | BLOCK | G6 | ACTIVE |

### Release requirements

| ID | Title | Priority | Gate class | First phase | Status |
|---|---|---|---|---|---|
| REL001 | Definition of done | P1 | BLOCK | G7 | ACTIVE |
| REL002 | Production acceptance | P1 | BLOCK | G-LAUNCH | ACTIVE |
| REL003 | Release discipline | P2 | BLOCK | G7 | ACTIVE |
| REL004 | Indexing policy | P1 | BLOCK | G6 | ACTIVE |
| REL005 | Launch assets | P1 | BLOCK | G4 | ACTIVE |
| REL006 | Fred approval | P1 | MANUAL | G-LAUNCH | ACTIVE |
| REL007 | Footer obligations | P1 | BLOCK | G4 | ACTIVE |

## Business requirement sections

### BR001 Product identity

Statement: An interactive Fermi paradox simulator titled The Great Filter, served at filter.nixfred.com, in the LABS category.
Reason: The packet fixes the product name, address, and category, and the LABS fleet convention requires a public identity that matches the deployed domain.
Source: Packet file 01, Product section; INTAKE.md section 5.
Acceptance criteria:
1. The rendered document title contains the exact string The Great Filter.
2. The page metadata declares the LABS category and the canonical URL https://filter.nixfred.com.
3. The core promise text from packet file 01 (build a galaxy, seed it with civilizations, watch almost all of them disappear) is present in the opening copy or an equivalent that keeps the same meaning.
4. The production site is reachable at filter.nixfred.com (verified by OPS006 post deploy smoke and REL002 acceptance item 1).
Priority: P1.
Dependencies: INT003, OPS006, UX004.
Risks: The identity strings drift between metadata, footer, and copy; mitigated by a single content source validated in scripts/validate_content.mjs.
Gate class: BLOCK.
First phase: G1.
Status: ACTIVE.

### BR002 Three minute comprehension

Statement: A first time visitor understands the core interaction (configure, run, read the report) without reading a long essay.
Reason: Packet definition of done item 8 requires that a visitor can understand the core interaction without reading a long essay, and this is the product thesis.
Source: Packet file 01, Definition of done item 8; packet file 02, Product thesis and Opening state.
Acceptance criteria:
1. The onboarding flow presents the configure, run, and report loop and is skippable in one action, verified by tests/e2e/onboarding.spec.ts.
2. From first load a visitor reaches a running simulation without opening any education drawer, verified by tests/e2e/default_run.spec.ts.
3. The opening and configuration screens reach their primary action within the word budget recorded in INTERACTION_SPEC, so no wall of prose precedes the first action.
4. A written first use protocol in TEST_PLAN records that an unfamiliar reader completes one configure, run, and report cycle using only on screen affordances, and the protocol result is retained as gate evidence.
Priority: P1.
Dependencies: FR011, FR001, FR004, FR009, UX004.
Risks: Comprehension is partly subjective; mitigated by pairing the automated onboarding path with the written protocol and by keeping REL006 as the human judgment backstop.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### BR003 Scientific honesty

Statement: The application models possibilities. No modeling assumption is presented as established fact, and no claim to solve the Fermi paradox appears anywhere in the product.
Reason: Packet architecture rule 5 forbids representing a modeling assumption as established fact, and the copy voice section bans the claim that the model proves anything about the Fermi paradox.
Source: Packet file 01, Nonnegotiable architecture rules item 5; packet file 02, Copy voice; ruling R014, R017.
Acceptance criteria:
1. An assumptions and limitations drawer exists and is reachable from the primary interface, and states in plain language that the outputs are modeled possibilities, verified by FR012 and packet definition of done item 12.
2. A content lint in scripts/validate_content.mjs fails the build if any shipped copy string contains a banned claim, including the packet examples this proves humanity is alone and epic alien empires battled across the cosmos.
3. Every one of the six main controls exposes its mathematical mapping through its information control (FR002), so no probability is presented without its interpretation.
4. No copy states or implies that the simulation predicts humanity's outcome, consistent with the no Earth reference ruling R014.
Priority: P1.
Dependencies: FR002, FR012, UX003, DATA003.
Risks: Honest framing weakens if copy is edited late without re running the content lint; mitigated by wiring scripts/validate_content.mjs into check:all.
Gate class: BLOCK.
First phase: G4.
Status: ACTIVE.

### BR004 Sentence first outcomes

Statement: The most memorable output of a run is a headline sentence in the Silence Report, not a chart.
Reason: Packet file 02 states the most memorable result should be a sentence, not merely a chart, and gives three example sentences.
Source: Packet file 02, Outcome state.
Acceptance criteria:
1. The Silence Report renders a single generated headline sentence as its most prominent element, positioned above the fifteen metrics, verified by tests/e2e/default_run.spec.ts.
2. The headline sentence is generated from the run outcome (for example number of transmitters, closest near miss in time, or confirmed contacts) rather than a fixed string, verified by unit tests over the sentence generator with at least three distinct run outcomes.
3. The headline sentence obeys the copy voice rules of UX003, including no em or en dashes.
Priority: P1.
Dependencies: FR009, FR027, UX003.
Risks: A generic template produces repetitive sentences; mitigated by testing multiple outcome classes and reviewing at REL006.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### BR005 Free and account free

Statement: The full experience works without accounts, payment, or sign in.
Reason: Packet baseline decisions 8 through 10 forbid accounts, database, and server logic, and definition of done item 7 requires the application to work without an account.
Source: Packet file 01, Default implementation decisions 8 to 10; Definition of done item 7; ruling R013.
Acceptance criteria:
1. The complete configure, run, report, and share journey completes with no login prompt and no payment step, verified by tests/e2e/default_run.spec.ts and share_scenario.spec.ts.
2. No network request is made to an authentication or payment provider at any point in the core flows, verified by the browser smoke suite.
3. The application state needed to reproduce a run travels in the URL and in localStorage only, with no server persistence (FR008, DATA001, DATA002, ruling R013).
Priority: P1.
Dependencies: FR008, DATA001, DATA002.
Risks: A future shared feature reintroduces server state; guarded by the deferred status of FR036 and ruling R013.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

## Functional requirement sections

### FR001 Six main controls

Statement: The basic panel exposes exactly six controls: life emergence, intelligence emergence, technological transition, long term survival, detectable communication, and interstellar expansion, with self destruction expressed through the survival control.
Reason: Ruling R008 fixes the basic panel at six controls and locates self destruction inside the survival control, resolving the packet open question about six versus seven controls.
Source: Ruling R008; packet file 02, Configuration state.
Acceptance criteria:
1. The basic control panel renders exactly six controls with the labels life emergence, intelligence emergence, technological transition, long term survival, detectable communication, and interstellar expansion.
2. No separate self destruction control appears in the basic panel; its effect is bound to the survival control, verified by a unit test on the parameter mapping.
3. Each control writes a distinct field into the scenario schema (FR026), verified by a serialization unit test.
Priority: P1.
Dependencies: FR002, FR026, FR003.
Risks: Control count drift back to seven; prevented by the ruling and a count assertion in tests/unit/state.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR002 Control anatomy

Statement: Every control shows a plain language label, a one sentence explanation, its current value, a range explanation, a visible effect summary, and an information control for mathematical detail.
Reason: Packet file 02 lists these six elements for every control, and packet architecture rule 6 requires every probability control to carry a plain language explanation, interpretation, range, default, and mathematical mapping.
Source: Packet file 02, Configuration state; packet file 01, Architecture rule 6.
Acceptance criteria:
1. For each of the six controls, all six anatomy elements are present in the DOM, verified by a component test that asserts the six elements per control.
2. The information control opens a panel that states the mathematical mapping for that control, satisfying architecture rule 6.
3. Each control exposes its current value and its default, and the range explanation states the meaning of the extremes.
Priority: P1.
Dependencies: FR001, BR003.
Risks: Math detail panels go stale relative to the simulation model; mitigated by sourcing mapping text from the same module the simulation reads.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR003 Advanced settings

Statement: Advanced settings exist and are collapsed by default, and may split hazard categories beyond the six basic controls.
Reason: Packet file 02 requires advanced settings collapsed by default, and ruling R008 permits the advanced panel to split hazard categories while the basic panel stays at six.
Source: Packet file 02, Configuration state; ruling R008.
Acceptance criteria:
1. On first load the advanced settings section is collapsed and no advanced control is visible, verified by a component test.
2. The advanced section can be expanded and collapsed through pointer and keyboard, verified by the keyboard smoke path (ACC001).
3. Advanced parameters serialize into the scenario schema and reproduce on reload (FR026, FR014).
Priority: P2.
Dependencies: FR001, FR026, ACC001.
Risks: Advanced options overwhelm the basic experience; mitigated by the collapsed default and by keeping the six basic controls sufficient for a complete run.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR004 Run controls

Statement: The interface provides start, pause, resume, speed change, reset, replay same seed, and randomize seed, with no arbitrary backward rewind.
Reason: Packet file 02 lists these run controls, and ruling R010 confirms replay from time zero with no timeline scrubbing backward in v1.
Source: Packet file 02, Simulation state; ruling R010.
Acceptance criteria:
1. Start, pause, resume, reset, replay same seed, and randomize seed each perform their action, verified by tests/e2e/default_run.spec.ts covering pause and resume and by unit tests on the run controller.
2. Speed change moves between the FR024 speed steps.
3. Replay same seed reproduces the identical run digest for unchanged parameters (FR017), verified against a committed fixture.
4. No control offers backward scrubbing of the timeline, consistent with ruling R010.
Priority: P1.
Dependencies: FR017, FR024, FR018.
Risks: Reset or replay leaks state across runs; mitigated by reinitializing the worker from the seed and parameters.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR005 Canvas interactions

Statement: The visitor can zoom, pan, select a civilization, and inspect its details.
Reason: Packet file 02 lists zoom, pan, select a civilization, and open details among the simulation state interactions, and this is the inspect user journey.
Source: Packet file 02, Simulation state; INTAKE.md section 6 journey 4.
Acceptance criteria:
1. Zoom and pan change the visible region of the galaxy canvas through pointer, wheel, and touch, verified by the browser smoke suite.
2. Selecting a civilization opens a detail view showing its current state and key attributes, verified by tests/e2e covering select and inspect.
3. Selection and inspection are reachable by keyboard (ACC001) so the inspect path is not pointer only.
Priority: P1.
Dependencies: FR028, FR016, ACC001.
Risks: Selection precision is poor on dense fields; mitigated by hit testing against the representative population (FR023) rather than the decorative starfield.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR006 Event ledger

Statement: A time stamped event ledger lists important events by default, with user selectable filters.
Reason: Packet file 02 lists opening the event ledger among simulation interactions, and the packet testing section requires event ordering to be observable.
Source: Packet file 02, Simulation state; packet file 03, section 17 event ordering.
Acceptance criteria:
1. The ledger shows time stamped entries and defaults to important events, verified by a component test.
2. Filters let the visitor include or exclude event categories, and the filter state changes the visible entries, verified by a component test.
3. Ledger entries appear in nondecreasing time order and never before their cause (FR025), verified by a property test.
Priority: P1.
Dependencies: FR025, FR027, FR005.
Risks: A high event rate floods the ledger; mitigated by the important events default and category filters.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR007 Label toggle

Statement: The visitor can hide or show labels for a pure visual mode.
Reason: Packet file 02 lists hide or show labels among simulation interactions.
Source: Packet file 02, Simulation state.
Acceptance criteria:
1. A control toggles labels on and off, and the canvas reflects the change, verified by a component test.
2. The toggle state persists for the session and is included in stored preferences (FR013).
3. The label toggle is operable by keyboard (ACC001).
Priority: P2.
Dependencies: FR028, FR013, ACC001.
Risks: Hiding labels removes nonvisual context; mitigated because label toggle affects the visual layer only and does not change the live region status policy (ACC002).
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR008 Shareable scenarios

Statement: A share URL encodes the model version, seed, and all parameters, and reproduces the identical modeled history when opened.
Reason: Packet baseline decision 6 requires URL encoded scenario state for reproducible sharing, and definition of done item 9 requires the same shared seed and settings to reproduce the same modeled history.
Source: Packet file 01, Default implementation decision 6, Definition of done item 9; ruling R015; DATA001.
Acceptance criteria:
1. Generating a share URL produces a link that contains the simulation model version, the seed, and every parameter, verified by tests/integration/scenario_round_trip.test.ts.
2. Opening a share URL reconstructs the scenario and produces a run digest identical to the original for the same model version, verified by tests/e2e/share_scenario.spec.ts against a committed fixture.
3. A share URL created under a supported older schema version migrates and still reproduces its run or is rejected deterministically (FR026, DATA001).
Priority: P1.
Dependencies: FR017, FR026, DATA001, OPS009.
Risks: Model version changes silently alter results; mitigated by embedding the model version and by the migration rules in FR026 and DATA001.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR009 Silence Report

Statement: At the end of a run or on stop, a Silence Report presents the fifteen packet metrics and a generated headline sentence.
Reason: Packet file 02 specifies the outcome state as a Silence Report with fifteen recommended metrics and a memorable sentence.
Source: Packet file 02, Outcome state.
Acceptance criteria:
1. The report displays all fifteen metrics: candidate worlds, independent origins of life, intelligent species, technological civilizations, civilizations that became detectable, civilizations that disappeared, civilizations active at the same time, signal overlaps, travel overlaps, confirmed contacts, closest near miss in space, closest near miss in time, longest lived civilization, median technological lifetime, and most restrictive transition, verified by a component test asserting fifteen labeled metric fields.
2. The report renders a generated headline sentence as its lead element (BR004).
3. Each metric value is computed from the run summary (FR027) and matches the aggregate counts for a committed fixture, verified by a unit test.
4. The report is available both at the selected end time and when the visitor stops the run early.
Priority: P1.
Dependencies: FR027, FR022, BR004, UX001.
Risks: Metric definitions drift from the simulation; mitigated by computing all fifteen from the single run summary module and asserting against fixtures.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR010 Presets

Statement: Eight curated presets from the packet are selectable before or instead of manual configuration.
Reason: Packet file 02 lists eight named preset ideas and the opening state offers RUN A PRESET as the secondary action.
Source: Packet file 02, Preset ideas and Opening state.
Acceptance criteria:
1. Exactly eight presets are selectable, named The Silent Galaxy, Crowded Briefly, Loud but Lonely, Rare Earth, Fragile Intelligence, Patient Stars, Expansion Wins, and Optimist's Milky Way.
2. Selecting a preset loads a complete valid parameter set into the six controls and any advanced fields, verified by a unit test that each preset validates against the scenario schema (FR026).
3. The RUN A PRESET secondary action on the opening state reaches the preset selection, verified by a browser test.
4. Each preset produces a deterministic run for a fixed seed, verified against committed fixtures (FR033).
5. Each preset's outcome character matches its packet description across a batch of seeds, asserted by a property test whose per preset threshold is recorded in TEST_PLAN (for example The Silent Galaxy yields no confirmed contact in the large majority of batch seeds, and Loud but Lonely produces detectable transmitters yet few or no confirmed contacts), so a preset that drifts from its described character fails the gate.
Priority: P1.
Dependencies: FR001, FR026, UX004, FR033.
Risks: A preset encodes an outcome that misleads about representativeness; mitigated by ruling R022 copy that no single run is representative.
Gate class: BLOCK.
First phase: G4.
Status: ACTIVE.

### FR011 Onboarding

Statement: First visit onboarding is skippable and offers direct access to the simulation.
Reason: Packet phase 3 item 1 requires onboarding, and definition of done item 8 requires comprehension without a long essay.
Source: Packet file 01, Phase 3 item 1, Definition of done item 8.
Acceptance criteria:
1. On first visit an onboarding sequence appears and can be dismissed in one action that lands the visitor in the simulation, verified by tests/e2e/onboarding.spec.ts.
2. A returning visitor is not forced through onboarding again unless local data is cleared (FR013, DATA002).
3. Onboarding is operable by keyboard and honors reduced motion (ACC001, ACC003).
Priority: P1.
Dependencies: FR013, BR002, ACC001, ACC003.
Risks: Onboarding blocks power users; mitigated by the one action skip and the persisted first visit flag.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR012 Education drawers

Statement: Education drawers cover the Fermi paradox, the Great Filter, what counts as a civilization, how contact is calculated, assumptions and limitations, sources, and about this LABS project.
Reason: Packet file 02 lists these seven content pages or drawers, and definition of done item 12 requires visible plain language assumptions and limitations.
Source: Packet file 02, Content pages or drawers; packet file 01, Definition of done item 12.
Acceptance criteria:
1. All seven drawers exist and are reachable from the interface, verified by a component test enumerating the seven titles.
2. The assumptions and limitations drawer states in plain language that outputs are modeled possibilities (BR003) and lists the model's key assumptions.
3. Education drawers load without blocking the main thread and are lazy loaded (NFR003), verified by the bundle and network checks.
4. The how contact is calculated drawer describes the causal overlap definition of contact used in v1 (FR022, ruling R019).
Priority: P1.
Dependencies: BR003, FR022, NFR003.
Risks: Content grows the initial bundle; mitigated by lazy loading (NFR003).
Gate class: BLOCK.
First phase: G4.
Status: ACTIVE.

### FR013 Local preferences

Statement: localStorage persists preferences and the last scenario, and a visible clear local data control exists.
Reason: Packet baseline decision 7 restricts local storage to preferences and the last scenario, and DATA002 requires a visible clear control with no cookies.
Source: Packet file 01, Default implementation decision 7; DATA002.
Acceptance criteria:
1. Preferences (for example reduced motion choice, label visibility) and the last scenario persist across reloads through localStorage, verified by an integration test.
2. A visible clear local data control removes all stored keys, verified by a component test that asserts storage is empty after activation.
3. No cookies are set by the application, verified by inspecting document.cookie in the browser smoke suite.
Priority: P2.
Dependencies: FR014, DATA002.
Risks: Stored scenario schema drifts; mitigated by validating stored scenarios through the same schema and migration path as share URLs (FR026).
Gate class: BLOCK.
First phase: G4.
Status: ACTIVE.

### FR014 Scenario restore

Statement: The last scenario restores on the next visit.
Reason: Packet baseline decision 7 stores the last scenario, and restoring it is the expected return visit behavior.
Source: Packet file 01, Default implementation decision 7; FR013.
Acceptance criteria:
1. After running or configuring a scenario and reloading, the prior scenario parameters are restored into the controls, verified by an integration test.
2. If the stored scenario fails schema validation, the application falls back to defaults deterministically rather than erroring (FR026).
3. Clearing local data (FR013) removes the restored scenario on the next visit.
Priority: P2.
Dependencies: FR013, FR026.
Risks: A malformed stored scenario breaks load; mitigated by deterministic clamping or rejection in FR026.
Gate class: BLOCK.
First phase: G4.
Status: ACTIVE.

### FR015 Contact sensitivity feature

Statement: A Make Contact More Likely analysis identifies the single control whose adjustment most improves the probability of contact for a seed or a small batch of neighboring runs.
Reason deferred: This is a strong optional feature in packet file 02 and depends on batch evaluation, which is deferred with Monte Carlo batches under ruling R022.
Reactivation condition: Reactivate after FR034 batch runs is reactivated, or when a seed local sensitivity method that does not require batch statistics is approved by Fred.
Status: DEFERRED.

### FR016 Civilization state machine

Statement: A civilization progresses through candidate system, habitable world, life, complex life, intelligence, technology, detectable, and interstellar, and reaches terminal states including quiet, transformed, and extinct.
Reason: Packet file 02 defines the state progression, ruling R009 removes warfare, and ruling R014 removes Earth reference.
Source: Packet file 02, Recommended scientific model; rulings R009, R014, R018.
Acceptance criteria:
1. The simulation implements the listed states and terminal states, verified by a unit test enumerating the reachable states.
2. No civilization enters a state before its host world is eligible, verified by a property test (packet file 03 section 17 property 2).
3. Expanding civilizations do not attack inhabited systems and no combat state exists, consistent with ruling R009, verified by a unit test asserting the absence of combat transitions.
4. Time starts at an abstract year zero with no Earth marker, consistent with ruling R014.
Priority: P1.
Dependencies: FR017, FR025, FR021.
Risks: State explosion complicates determinism; mitigated by integer or fixed point transition math (see FR017).
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### FR017 Determinism

Statement: The same seed, the same parameters, and the same simulation model version produce an identical run digest.
Reason: Packet architecture rule 2 and definition of done item 9 require deterministic reproduction, and the charter names the floating point hazard.
Source: Packet file 01, Architecture rule 2, Definition of done item 9; CHARTER_COMMON.md hard rule 8.
Acceptance criteria:
1. Two runs with identical seed, parameters, and model version produce byte identical digests, verified by the simulation_determinism CI job against tests/fixtures/simulation_digests.
2. Determinism critical math uses integer arithmetic, fixed point, or a deterministic implementation, and does not depend on engine provided transcendental functions in a way that changes the digest across supported engines, verified by a cross engine fixture check in CI.
3. A changed seed or parameter changes the digest, verified by a unit test, so the digest is sensitive to inputs.
4. The run digest for every committed fixture is byte identical across Chromium, Firefox, and WebKit in continuous integration, verified by executing the simulation_determinism job on all three engines and comparing each result against the same committed digest, which proves cross engine floating point determinism (FR033).
Priority: P1.
Dependencies: FR033, FR018, FR026, NFR008.
Risks: Engine differences in Math functions break bit identity; mitigated by hard rule 8 and deterministic math, and by running the determinism job on the CI engine matrix.
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### FR018 Worker execution

Statement: The simulation executes in a Web Worker and never blocks the interface thread.
Reason: Packet baseline decision 3 and architecture rules 1 and 3 require simulation in a worker that keeps the interface interactive.
Source: Packet file 01, Default implementation decision 3, Architecture rules 1 and 3; packet file 03 section 16 item 3.
Acceptance criteria:
1. Simulation stepping runs inside a Web Worker, verified by tests/integration/simulation_worker.test.ts.
2. During continuous playback the main thread continues to handle input events and render, measured against the frame budget in NFR001, verified by the browser smoke suite.
3. The worker communicates through snapshots or compact event batches rather than transferring per event synchronous calls, verified by an integration test on the message contract.
Priority: P1.
Dependencies: FR017, NFR006, NFR001.
Risks: Message serialization becomes a bottleneck; mitigated by compact batches and typed arrays (NFR007).
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### FR019 Light travel

Statement: Signals propagate at the configured causal speed, and detection depends on strength, duration, and distance.
Reason: Packet file 02 states signals travel at light speed and detection depends on emission strength, duration, distance, and the selected detection model, confirmed by ruling R018.
Source: Packet file 02, Recommended scientific model; ruling R018.
Acceptance criteria:
1. A signal arrives no earlier than distance divided by the configured causal speed, verified by a property test (packet file 03 section 17 property 3).
2. Detection is a function of emission strength, duration, and distance, verified by a unit test that varies each input and asserts monotonic detectability behavior.
3. The causal speed used in the run is recorded in the scenario and reported, so results are reproducible (FR008).
Priority: P1.
Dependencies: FR022, FR025, DATA001.
Risks: Distance and speed units diverge across modules; mitigated by a single unit convention documented in simulation_model.
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### FR020 Posthumous signals

Statement: Signals in transit persist and remain detectable after the sender goes extinct.
Reason: Packet file 02 and ruling R018 state that signals in transit persist after sender extinction.
Source: Packet file 02, Recommended scientific model; ruling R018.
Acceptance criteria:
1. A signal emitted before extinction remains in transit and can be detected after the sender reaches a terminal state, verified by a property test (packet file 03 section 17 property 5).
2. An extinct civilization emits no new signals, verified by a unit test.
3. Posthumous detections are counted in the appropriate report metrics (FR009, FR027).
Priority: P2.
Dependencies: FR019, FR016, FR027.
Risks: Signal bookkeeping leaks after extinction; mitigated by explicit in transit tracking separate from emitter liveness.
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### FR021 Expansion model

Statement: Interstellar expansion uses a configurable sub light effective speed with launch and settlement delays, presented as a frontier.
Reason: Packet file 02 defines interstellar travel as a configurable effective speed below light speed with launch or settlement delay, and ruling R009 abstracts interaction without combat.
Source: Packet file 02, Recommended scientific model; ruling R009, R018.
Acceptance criteria:
1. A travel front never exceeds its configured effective speed, verified by a property test (packet file 03 section 17 property 4).
2. Expansion applies launch and settlement delays, verified by a unit test on the expansion calculation.
3. Expanding civilizations settle or transform systems without attacking inhabited systems, consistent with ruling R009.
4. Expansion is rendered as a frontier rather than a beam (UX002).
Priority: P1.
Dependencies: FR016, FR022, UX002.
Risks: Expansion overwhelms the map visually; mitigated by the frontier motion language and adaptive rendering (NFR002).
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### FR022 Causal contact

Statement: Contact requires causal intersection per ruling R019, and simultaneous existence alone is never contact.
Reason: Packet architecture rule 7 requires contact to respect time and distance, and ruling R019 defines v1 contact as reception of a detectable signal computed through causal overlap.
Source: Packet file 01, Architecture rule 7; ruling R019.
Acceptance criteria:
1. Contact is counted only when a detectable signal reaches a civilization capable of recognizing it within the causal window, verified by a unit test on contact detection.
2. Two civilizations that are alive at the same time but outside each other's causal windows are never counted as contact, verified by a targeted unit test.
3. Signal overlaps and travel overlaps are tracked and reported separately from confirmed contacts (FR009), verified by the report metric tests.
Priority: P1.
Dependencies: FR019, FR021, FR027.
Risks: Multiple contact definitions are conflated; mitigated by ruling R019 fixing one definition in v1.
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### FR023 Representative population

Statement: The simulation uses a representative population with documented weighting behind a larger decorative starfield.
Reason: Packet file 02 and ruling R018 permit a smaller representative simulated population with documented weighting behind a larger visual starfield.
Source: Packet file 02, Recommended scientific model; ruling R018.
Acceptance criteria:
1. The simulated population size and its weighting relative to the visual star count are documented in simulation_model and exposed in the assumptions drawer (FR012).
2. Aggregate report metrics are computed from the representative population and are internally consistent (FR027), verified by a property test (packet file 03 section 17 property 6).
3. The decorative starfield does not participate in simulation state or hit testing, verified by a unit test that selection targets only the representative population (FR005).
Priority: P2.
Dependencies: FR027, FR012, FR005.
Risks: The visual and simulated populations are conflated in the visitor's mind; mitigated by the documented weighting and honest copy (BR003).
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### FR024 Speed steps

Statement: The run supports pause, normal, 10x, 100x, 1000x, and maximum speed.
Reason: The requirement statement fixes the six speed steps, consistent with the packet run controls and the change speed interaction.
Source: Packet file 02, Simulation state; FR004.
Acceptance criteria:
1. The speed control offers exactly the six steps pause, normal, 10x, 100x, 1000x, and maximum, verified by a component test.
2. Changing speed changes the simulation advance rate without changing the run digest for the same seed and parameters (FR017), verified by a unit test that varies speed and asserts an identical digest.
3. Maximum speed does not block the interface thread (FR018, NFR006).
Priority: P1.
Dependencies: FR004, FR017, FR018.
Risks: High speed starves the renderer; mitigated by snapshot batching from the worker (FR018).
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR025 Causal event ordering

Statement: No event precedes its cause, and event scheduling is internally consistent.
Reason: Packet file 03 section 17 requires the invariant that no event occurs before its cause and that aggregate counts remain consistent.
Source: Packet file 03, section 17 property and invariant tests 1 and 6.
Acceptance criteria:
1. For any run, every scheduled event has a timestamp greater than or equal to the timestamp of its cause, verified by a property test (property 1).
2. Aggregate counts derived from events remain internally consistent across a run, verified by a property test (property 6).
3. The event ledger renders events in nondecreasing time order (FR006).
Priority: P1.
Dependencies: FR016, FR027, FR006.
Risks: Concurrent event scheduling reorders effects; mitigated by a single deterministic scheduler keyed on simulation time.
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### FR026 Versioned scenario schema

Statement: The scenario schema is versioned, validated, clamps or rejects invalid input deterministically, and migrates supported older share formats.
Reason: Packet phase 2 item 1 requires a versioned scenario schema, packet file 03 section 17 requires deterministic rejection or clamping of invalid inputs, and DATA001 requires migration.
Source: Packet file 01, Phase 2 item 1; packet file 03, section 17 invariant 8; DATA001, ruling R015.
Acceptance criteria:
1. The schema carries an explicit version, verified by a serialization unit test.
2. Invalid or out of range inputs are clamped or rejected deterministically, verified by a property test (packet file 03 section 17 invariant 8) and by hostile input tests (SEC002).
3. A supported older share format migrates to the current schema and reproduces or is rejected deterministically, verified by a scenario migration unit test.
4. Validation and migration run identically for URL scenarios and stored scenarios (FR013, FR014).
Priority: P1.
Dependencies: DATA001, SEC002, FR013, FR014.
Risks: Silent acceptance of malformed input causes nondeterminism; mitigated by explicit clamping or rejection and by fuzz style unit inputs.
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### FR027 Run metrics

Statement: Aggregate metrics and run summaries are computed for the report and the ledger.
Reason: Packet phase 2 item 9 requires aggregate metrics and run summaries, which feed the Silence Report and the ledger.
Source: Packet file 01, Phase 2 item 9; packet file 02, Outcome state.
Acceptance criteria:
1. The run summary computes all fifteen Silence Report metrics (FR009) from a single run, verified by a unit test against a committed fixture.
2. Metrics are internally consistent with the event stream, verified by a property test (packet file 03 section 17 property 6).
3. The same run produces the same metrics for the same seed, parameters, and model version (FR017).
Priority: P1.
Dependencies: FR009, FR017, FR025.
Risks: Metric drift from the event model; mitigated by deriving metrics only from the committed event stream.
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### FR028 Renderer layers

Statement: A Three.js 2.5D renderer provides galaxy, civilization, signal, travel, and label layers, plus a non WebGL fallback renderer.
Reason: Ruling F002 fixes a Three.js 2.5D presentation with a non WebGL fallback, and packet architecture rule 4 requires graceful degradation.
Source: Ruling F002; packet file 01, Architecture rule 4; packet file 02, Recommended visual direction.
Acceptance criteria:
1. The renderer draws distinct galaxy, civilization, signal, travel, and label layers, verified by a component test that asserts the five layers.
2. When WebGL, worker execution, high particle counts, or reduced motion make the primary renderer unsuitable, a non WebGL fallback renders the same state, verified by tests/e2e covering the unsupported renderer fallback.
3. The renderer never shows a blank page on unsupported devices, consistent with ruling R021 (FR030).
Priority: P1.
Dependencies: FR018, FR029, FR030, NFR002.
Risks: Two renderers diverge in behavior; mitigated by driving both from the same simulation snapshot contract.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR029 Reduced motion mode

Statement: Reduced motion mode replaces animation with discrete state changes, labels, and time stamped summaries.
Reason: Packet motion language section requires reduced motion to replace expansion animation with discrete state changes, labels, and time stamped summaries, and accessibility is a release requirement.
Source: Packet file 02, Motion language; packet file 01, Architecture rule 8; ACC003.
Acceptance criteria:
1. With reduced motion active, the interface presents discrete state changes, labels, and time stamped summaries instead of continuous animation, verified by tests/e2e/reduced_motion.spec.ts.
2. Reduced motion mode still allows a complete configure, run, and report cycle, verified by the same test.
3. The mode is triggered by prefers-reduced-motion and by an in application toggle (ACC003).
Priority: P1.
Dependencies: FR028, ACC003.
Risks: Reduced motion path is a second class experience; mitigated by requiring a complete run and by testing it as a release gate.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR030 Degraded states

Statement: Loading, empty, degraded, unsupported, and error states are designed rather than accidental.
Reason: Packet phase 4 item 4 requires loading, empty, degraded, unsupported, and error states, and ruling R021 requires a fallback rather than a blank page.
Source: Packet file 01, Phase 4 item 4; ruling R021.
Acceptance criteria:
1. Each of the five states loading, empty, degraded, unsupported, and error renders a designed view with informative copy, verified by component tests for each state.
2. An unsupported renderer routes to the fallback, and an unrecoverable error routes to an error view that offers recovery, verified by tests/e2e covering unsupported renderer fallback and error recovery.
3. No state renders a blank page in a supported browser (ruling R021, NFR008).
Priority: P2.
Dependencies: FR028, NFR008.
Risks: Rare states go untested; mitigated by explicit component tests per state.
Gate class: BLOCK.
First phase: G4.
Status: ACTIVE.

### FR031 Mobile layout

Statement: The mobile layout uses a full screen canvas, a compact status bar, bottom sheet controls, separate event and report sheets, and large touch targets.
Reason: Packet file 02 mobile layout recommendation lists these elements, and the production acceptance checklist requires a mobile run to complete.
Source: Packet file 02, Information design mobile layout; packet file 03, section 21 item 11.
Acceptance criteria:
1. At a mobile viewport the galaxy canvas is full screen with a compact status bar and bottom sheet controls, and event and report content appear in separate sheets, verified by tests/e2e/mobile.spec.ts.
2. Touch targets meet the minimum size recorded in ACCESSIBILITY, verified by the accessibility checks (ACC004, ACC006).
3. A default run completes at a mobile viewport (packet file 03 section 21 item 11), verified by tests/e2e/mobile.spec.ts.
Priority: P1.
Dependencies: FR028, FR032, ACC006, UX007.
Risks: Sheets occlude the canvas; mitigated by canvas dominance (UX007).
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR032 Desktop layout

Statement: The desktop layout places the galaxy canvas in the center with a left control rail, a top status area, a right detail drawer, and a bottom timeline.
Reason: Packet file 02 desktop layout recommendation lists these regions.
Source: Packet file 02, Information design desktop layout.
Acceptance criteria:
1. At a desktop viewport the five regions center canvas, left control rail, top status, right detail drawer, and bottom timeline are present, verified by a layout component test.
2. The galaxy canvas remains the visually dominant region (UX007).
3. The detail drawer shows the selected civilization and the event ledger (FR005, FR006).
Priority: P1.
Dependencies: FR005, FR006, UX007.
Risks: Rail and drawer crowd the canvas; mitigated by UX007 dominance rule.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### FR033 Deterministic fixtures

Statement: Committed scenario fixtures with expected digests guard determinism across changes.
Reason: Packet phase 2 item 10 requires deterministic fixtures, invariant tests, and property tests, and the charter fixes the fixtures test tree.
Source: Packet file 01, Phase 2 item 10; CHARTER_COMMON.md test tree.
Acceptance criteria:
1. tests/fixtures/scenarios and tests/fixtures/simulation_digests contain committed scenarios with their expected digests.
2. The simulation_determinism CI job compares fresh runs against the committed digests and fails on any mismatch.
3. Each of the eight presets (FR010) has a committed fixture and digest.
4. The fixture digest comparison runs on Chromium, Firefox, and WebKit in continuous integration and fails if any committed fixture digest differs between engines, so the fixture mechanism itself proves cross engine determinism (FR017).
Priority: P1.
Dependencies: FR017, FR010, NFR009, NFR008.
Risks: Fixtures are regenerated to mask a real regression; mitigated by review of digest changes in pull requests.
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### FR034 Batch runs

Statement: Monte Carlo batches run across many seeds and report contact frequency and uncertainty bands.
Reason deferred: Ruling R022 defers batch statistics because batch mode multiplies worker and reporting complexity, and the honesty requirement is handled by copy and the assumptions page in v1.
Reactivation condition: Reactivate when Fred approves batch runs for a version after v1, at which point the honesty copy must present batch results as distributions rather than single outcomes.
Status: DEFERRED.

### FR035 Sound

Statement: Optional sound accompanies the simulation, muted until user activation.
Reason deferred: Ruling R007 ships the first release silent because the packet itself orders sound only after the silent experience is complete.
Reactivation condition: Reactivate as a post launch candidate, and any sound must begin muted until user activation when added.
Status: DEFERRED.

### FR036 Public scenario gallery

Statement: A server backed shared gallery lets visitors browse and publish scenarios.
Reason deferred: Ruling R013 forbids server logic, functions, and stored shared state in v1, so shared scenarios exist only in the URL.
Reactivation condition: Reactivate only if Fred approves a server backed shared state feature, which would reopen the no server logic baseline and require a new security review.
Status: DEFERRED.

## User experience requirement sections

### UX001 Art direction

Statement: Observatory Elegy governs the live simulation and Cosmic Atlas governs education drawers, charts, and the Silence Report, and all twelve packet visual traits bind.
Reason: Ruling R020 fixes the Observatory Elegy plus Cosmic Atlas blend and binds all twelve visual traits including no generic space photographs and no neon arcade treatment.
Source: Ruling R020; packet file 02, Recommended visual direction.
Acceptance criteria:
1. The live simulation applies the Observatory Elegy traits and the education and report surfaces apply the Cosmic Atlas treatment, verified against ART_DIRECTION during the design review.
2. No generic space photograph and no neon arcade treatment appears anywhere, verified by the design review checklist.
3. All twelve visual traits from packet file 02 are recorded as satisfied in ART_DIRECTION with a reference to where each is realized.
Priority: P1.
Dependencies: UX005, UX006, UX007, REL006.
Risks: Two art directions clash at their boundary; mitigated by the ruling assigning each to distinct surfaces.
Gate class: BLOCK.
First phase: G5.
Status: ACTIVE.

### UX002 Motion language

Statement: Birth is a pulse, detectability a halo or shell, expansion a frontier, extinction a cooling fade, and contact is rare and consequential.
Reason: Packet motion language section defines each motion and forbids explosive or laser like treatments.
Source: Packet file 02, Motion language.
Acceptance criteria:
1. Each event type uses its specified motion: birth a pulse, detectability a halo or shell, expansion a frontier, and extinction a cooling fade, verified against ART_DIRECTION during the design review.
2. Contact is visually distinct and infrequent, consistent with its rarity in the model (FR022).
3. Reduced motion mode replaces these motions with discrete state changes and summaries (FR029).
Priority: P2.
Dependencies: FR028, FR029, UX001.
Risks: Motion becomes decorative rather than informative; mitigated by tying each motion to a specific event type.
Gate class: BLOCK.
First phase: G5.
Status: ACTIVE.

### UX003 Copy voice

Statement: Copy is scientifically literate, calm, direct, and occasionally dry, excludes the packet banned phrasings, and uses no em or en dashes.
Reason: Ruling R017 fixes the tone and bans dark humor beyond the packet register, triumphal or nihilistic claims, and the packet banned examples, with no em or en dashes anywhere.
Source: Ruling R017; packet file 02, Copy voice.
Acceptance criteria:
1. scripts/validate_content.mjs fails the build if shipped copy contains an em dash or en dash, verified by the content lint in check:all.
2. The content lint fails on the packet banned phrasings, including epic alien empires battled across the cosmos and this proves humanity is alone.
3. A design and editorial review records that the shipped copy matches the calm, direct, occasionally dry register, retained as gate evidence.
Priority: P1.
Dependencies: BR003, UX004, REL006.
Risks: A subjective tone check passes inconsistent copy; mitigated by pairing the automated bans with the editorial review at REL006.
Gate class: BLOCK.
First phase: G4.
Status: ACTIVE.

### UX004 Opening state

Statement: The opening state shows a near still galaxy, the title, a supporting line, a CREATE A GALAXY primary action, a RUN A PRESET secondary action, and a tone line.
Reason: Packet file 02 opening state specifies the title, supporting line, primary and secondary actions, and a tone line.
Source: Packet file 02, Opening state.
Acceptance criteria:
1. The opening state renders the title THE GREAT FILTER, the supporting line, a primary CREATE A GALAXY action, a secondary RUN A PRESET action, and a tone line, verified by a component test asserting all five elements.
2. CREATE A GALAXY reaches configuration (FR001) and RUN A PRESET reaches preset selection (FR010), verified by a browser test.
3. The galaxy is near still at rest, consistent with the Observatory Elegy motion restraint (UX002).
Priority: P1.
Dependencies: FR001, FR010, UX002, UX003.
Risks: The opening state becomes a splash screen that delays interaction; mitigated by direct primary and secondary actions.
Gate class: BLOCK.
First phase: G4.
Status: ACTIVE.

### UX005 Color system

Statement: The palette is near black with blue depth, white and pale cyan stars, warm gold for technology, electric violet for transmission, and quiet red for danger only.
Reason: Packet visual traits fix this palette and ruling R020 requires the palette to remain color vision safe.
Source: Packet file 02, Recommended visual direction; ruling R020; ACC004.
Acceptance criteria:
1. The implemented palette matches the packet colors for background, stars, technology, transmission, and danger, recorded in ART_DIRECTION with token values.
2. Red is used only for danger, collapse, or extinction, verified by the design review.
3. The palette passes color vision safety and WCAG AA contrast for text and interface (ACC004), verified by the accessibility checks.
Priority: P1.
Dependencies: ACC004, UX001.
Risks: Color alone conveys state; mitigated by pairing color with labels and shapes (ACC004).
Gate class: BLOCK.
First phase: G5.
Status: ACTIVE.

### UX006 Visual restraint

Statement: The design uses precise typography, no generic space photographs, no neon arcade treatment, and minimal glass effects.
Reason: Packet visual traits require precise typography, minimal glass, no generic space photographs, and no neon arcade treatment.
Source: Packet file 02, Recommended visual direction; ruling R020.
Acceptance criteria:
1. No generic space photograph is used as a background or asset, verified by the design review and by REL005 requiring original artwork.
2. No neon arcade treatment and no more than minimal glass effects appear, verified by the design review checklist.
3. Typography follows the type scale recorded in ART_DIRECTION.
Priority: P2.
Dependencies: UX001, REL005.
Risks: Decorative effects creep in during polish; mitigated by the design review checklist.
Gate class: BLOCK.
First phase: G5.
Status: ACTIVE.

### UX007 Canvas dominance

Statement: The galaxy canvas remains the visually dominant element in every layout.
Reason: Packet information design states the main canvas should remain visually dominant.
Source: Packet file 02, Information design.
Acceptance criteria:
1. At desktop and mobile viewports the galaxy canvas occupies the largest visual region, verified by a layout assertion in component tests for both viewports.
2. Controls, drawers, and sheets do not permanently occlude the canvas majority, verified by the mobile and desktop layout tests (FR031, FR032).
Priority: P2.
Dependencies: FR031, FR032.
Risks: Panels expand and cover the canvas; mitigated by the dominance assertion in layout tests.
Gate class: BLOCK.
First phase: G5.
Status: ACTIVE.

## Nonfunctional requirement sections

### NFR001 Mobile frame rate

Statement: The simulation renders at a stable interactive frame rate on a mid range 2021 class mobile reference device.
Reason: Packet performance requirement 1 and ruling R021 fix a mid range 2021 class mobile reference device as the performance floor.
Source: Packet file 03, section 16 item 1; ruling R021.
Acceptance criteria:
1. On the mid range 2021 class reference device a default run holds the target frame rate recorded in TEST_PLAN with no sustained drop below the recorded floor, verified by a documented measurement retained as gate evidence.
2. Under load the renderer applies adaptive rendering (NFR002) to hold the floor rather than dropping frames without limit.
3. The measurement method and the target frame rate value are recorded in TEST_PLAN so the check is repeatable.
Priority: P1.
Dependencies: NFR002, FR018, FR028.
Risks: The reference device is unavailable for measurement; if so record a PENDING candidate rather than fabricate a number.
Gate class: BLOCK.
First phase: G5.
Status: ACTIVE.

### NFR002 Adaptive rendering

Statement: Visual star count and effects adapt to device capability, and a low power mode exists.
Reason: Packet performance requirements 2 and 10 require adaptation of visual star count and effects and a low power mode.
Source: Packet file 03, section 16 items 2 and 10.
Acceptance criteria:
1. The visual star count and effect level change with detected device capability, verified by a unit test on the capability tiering function.
2. A low power mode is selectable and reduces star count and effects, verified by a component test.
3. Adaptation keeps a default run within the frame floor of NFR001 on the reference device.
Priority: P2.
Dependencies: NFR001, FR028.
Risks: Aggressive downscaling harms legibility; mitigated by keeping the representative population visible regardless of decorative starfield scaling (FR023).
Gate class: BLOCK.
First phase: G5.
Status: ACTIVE.

### NFR003 No blocking third parties

Statement: No blocking third party scripts load, and education and optional panels lazy load.
Reason: Packet performance requirements 6 and 7 require lazy loading of education, sources, and optional analysis panels and forbid blocking third party scripts.
Source: Packet file 03, section 16 items 6 and 7.
Acceptance criteria:
1. No render blocking third party script is present in the initial document, verified by the browser smoke suite and the Lighthouse best practice audit (NFR005).
2. Education, sources, and optional panels load on demand rather than in the initial bundle, verified by a bundle composition check in scripts/check_bundle.mjs.
3. The only third party network beacon permitted is the production Cloudflare Web Analytics beacon (INT006), and it is non blocking.
Priority: P2.
Dependencies: NFR004, INT006, FR012.
Risks: A dependency injects a blocking script; mitigated by CSP (SEC003) restricting script sources.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### NFR004 Bundle budgets

Statement: An initial JavaScript budget is defined for the Three.js renderer and enforced in continuous integration.
Reason: Packet quality gate items 11 and 12 require a defined initial JavaScript budget after renderer selection and a per asset budget, and definition of done item 14 requires bundle budgets to meet approved thresholds.
Source: Packet file 03, section 15 items 11 and 12; packet file 01, Definition of done item 14.
Acceptance criteria:
1. An initial JavaScript budget value is recorded in the repository (for example in scripts/check_bundle.mjs or a budget config) after the Three.js renderer selection.
2. The bundle_budget CI job fails when the initial JavaScript bundle exceeds the recorded budget.
3. No individual static asset exceeds the approved per asset budget recorded in the same place, enforced by the same job.
Priority: P1.
Dependencies: FR028, NFR005, INT002.
Risks: Three.js pushes the bundle over budget; mitigated by code splitting and lazy loading (NFR003).
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### NFR005 Lighthouse thresholds

Statement: Performance, accessibility, best practice, and SEO audits meet approved thresholds through a committed lighthouserc configuration.
Reason: Packet performance requirement 9 and definition of done item 14 require production audits that meet approved thresholds.
Source: Packet file 03, section 16 item 9; packet file 01, Definition of done item 14.
Acceptance criteria:
1. A committed lighthouserc file records the approved thresholds for performance, accessibility, best practice, and SEO.
2. A Lighthouse or equivalent audit runs on an approved cadence and fails when a category falls below its recorded threshold.
3. The threshold values are recorded in the configuration so the check is reproducible and not a floating pass.
Priority: P1.
Dependencies: NFR004, ACC005, INT002.
Risks: Lighthouse variance causes flaky results; mitigated by median of multiple runs and by recording fixed thresholds.
Gate class: BLOCK.
First phase: G7.
Status: ACTIVE.

### NFR006 Interface responsiveness

Statement: The interface thread continues to process input and render during simulation playback.
Reason: Packet performance requirements 3 and 4 keep simulation work off the main thread and avoid unnecessary React rendering during playback.
Source: Packet file 03, section 16 items 3 and 4; packet file 01, Architecture rule 3.
Acceptance criteria:
1. During continuous playback the main thread handles pointer and keyboard input without a stall exceeding the threshold recorded in TEST_PLAN, verified by the browser smoke suite.
2. React does not re render on every simulation tick during playback, verified by a render count assertion in a component test.
3. The simulation runs in the worker (FR018) so playback does not block input.
Priority: P1.
Dependencies: FR018, NFR007.
Risks: Frequent snapshots trigger excessive React renders; mitigated by batching and by decoupling the renderer from React state.
Gate class: BLOCK.
First phase: G3.
Status: ACTIVE.

### NFR007 Efficient structures

Statement: Typed arrays or compact structures are used where they materially improve simulation or renderer throughput.
Reason: Packet performance requirement 5 requires typed arrays or compact structures where they materially improve throughput.
Source: Packet file 03, section 16 item 5.
Acceptance criteria:
1. The simulation state and worker messages use typed arrays or compact structures for the hot paths, recorded in ARCHITECTURE with the rationale.
2. The worker message contract avoids per event object allocation on the hot path, verified by an integration test on the message format.
Priority: P2.
Dependencies: FR018, NFR006.
Risks: Premature micro optimization harms readability; mitigated by limiting compact structures to measured hot paths.
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### NFR008 Browser support

Statement: The application supports the last two versions of Chrome, Edge, Firefox, and Safari, plus iOS Safari 16 and later.
Reason: Ruling R021 fixes the supported browser and device floor, with older devices receiving the fallback renderer rather than a blank page.
Source: Ruling R021; packet file 03, section 21 item 14.
Acceptance criteria:
1. Core flows pass on the last two versions of Chrome, Edge, Firefox, and Safari, and on iOS Safari 16 and later, verified by the browser test matrix in playwright.config.
2. No browser console error occurs in supported browsers during the core flows (packet file 03 section 21 item 14), verified by the browser smoke suite.
3. Devices below the floor route to the fallback renderer (FR028, FR030) rather than a blank page.
Priority: P1.
Dependencies: FR028, FR030.
Risks: Safari specific rendering differences; mitigated by including Safari and iOS Safari in the test matrix.
Gate class: BLOCK.
First phase: G7.
Status: ACTIVE.

### NFR009 Coverage floors

Statement: Simulation domain line coverage is at least 85 percent and overall line coverage is at least 80 percent, enforced in continuous integration.
Reason: Packet quality gate items 6 and 7 fix minimum 85 percent line coverage for the simulation domain and minimum 80 percent for the overall application.
Source: Packet file 03, section 15 items 6 and 7.
Acceptance criteria:
1. The coverage CI job fails when simulation domain line coverage is below 85 percent.
2. The coverage CI job fails when overall application line coverage is below 80 percent.
3. Coverage thresholds are configured in the test runner configuration so the floors are enforced automatically, not by manual inspection.
Priority: P1.
Dependencies: FR033, NFR010, INT002.
Risks: Coverage is gamed by trivial tests; mitigated by the property and determinism suites carrying real assertions.
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### NFR010 Zero defect gates

Statement: Zero TypeScript errors, zero lint errors, zero formatting drift, and no known flaky required tests.
Reason: Packet quality gate items 1 through 5 require zero TypeScript errors, zero lint errors, zero formatting drift, passing deterministic fixtures, and no known flaky tests in required workflows.
Source: Packet file 03, section 15 items 1 to 5.
Acceptance criteria:
1. The typecheck CI job reports zero TypeScript errors.
2. The lint CI job reports zero errors and treats warnings as failures where the tool supports a strict mode.
3. The format_check CI job reports zero formatting drift.
4. No test in a required workflow is marked known flaky, and quarantined tests are not counted as required.
Priority: P1.
Dependencies: OPS001, INT002.
Risks: Strict lint slows iteration; mitigated by running the same checks locally through check:all (OPS001).
Gate class: BLOCK.
First phase: G1.
Status: ACTIVE.

## Accessibility requirement sections

### ACC001 Keyboard operation

Statement: The complete core path operates with keyboard only.
Reason: Packet definition of done item 10 requires keyboard operation, and quality gate item 9 requires a keyboard only smoke path to pass.
Source: Packet file 01, Definition of done item 10; packet file 03, section 15 item 9.
Acceptance criteria:
1. The configure, run, inspect, report, and share path completes using keyboard only, verified by tests/e2e/keyboard.spec.ts.
2. Every interactive control is reachable and operable by keyboard, verified by the accessibility checks (ACC005).
3. The keyboard smoke path is a required CI check, consistent with packet quality gate item 9.
Priority: P1.
Dependencies: ACC006, ACC005, FR004.
Risks: Canvas interactions are pointer only; mitigated by keyboard equivalents for select and inspect (FR005).
Gate class: BLOCK.
First phase: G5.
Status: ACTIVE.

### ACC002 Nonvisual status

Statement: Screen reader landmarks and nonvisual status descriptions of simulation state are provided through a live region policy.
Reason: Packet definition of done item 10 requires nonvisual status descriptions.
Source: Packet file 01, Definition of done item 10.
Acceptance criteria:
1. The interface exposes landmark regions and an accessible name for each major region, verified by the accessibility checks (ACC005).
2. A live region policy announces meaningful simulation state changes without flooding the screen reader, with the policy recorded in ACCESSIBILITY, verified by a targeted test that asserts announcements on key state changes.
3. The Silence Report is available to a screen reader as text, not only as a chart (BR004).
4. Live region announcement density scales down as simulation speed increases and never exceeds the maximum announcement rate recorded in ACCESSIBILITY, verified by a test that runs at the fastest speed step (1000x and maximum, FR024) and asserts the announcement rate stays at or below that recorded maximum, so screen reader output never floods at high speed.
Priority: P1.
Dependencies: ACC005, ACC006, FR009, FR024.
Risks: A chatty live region overwhelms users; mitigated by the recorded live region policy limiting announcement frequency.
Gate class: BLOCK.
First phase: G5.
Status: ACTIVE.

### ACC003 Reduced motion respect

Statement: prefers-reduced-motion is honored and an in application toggle exists.
Reason: Packet motion language requires reduced motion behavior, and accessibility is a release requirement.
Source: Packet file 02, Motion language; packet file 01, Architecture rule 8.
Acceptance criteria:
1. When the operating system requests reduced motion, the application starts in reduced motion mode (FR029), verified by tests/e2e/reduced_motion.spec.ts.
2. An in application toggle switches reduced motion on and off and persists the choice (FR013).
3. Reduced motion mode allows a complete run (FR029).
Priority: P1.
Dependencies: FR029, FR013.
Risks: The toggle and the OS setting conflict; mitigated by a defined precedence recorded in ACCESSIBILITY.
Gate class: BLOCK.
First phase: G5.
Status: ACTIVE.

### ACC004 Contrast and color safety

Statement: Text and interface meet WCAG AA contrast, and the palette is color vision safe.
Reason: Ruling R020 requires a color vision safe palette, and accessibility is a release requirement.
Source: Ruling R020; packet file 01, Architecture rule 8.
Acceptance criteria:
1. Text and interface elements meet WCAG AA contrast ratios, verified by the automated accessibility checks (ACC005).
2. The palette is validated as color vision safe, with the validation method recorded in ACCESSIBILITY.
3. State is never conveyed by color alone; each state also carries a label or shape (UX005).
Priority: P1.
Dependencies: UX005, ACC005.
Risks: Danger red fails contrast on the near black background; mitigated by tuning the token values during design refinement.
Gate class: BLOCK.
First phase: G5.
Status: ACTIVE.

### ACC005 Automated and manual checks

Statement: Automated accessibility checks run on core flows in continuous integration, plus a written manual protocol.
Reason: Packet quality gate item 8 requires critical accessibility flows to pass automated checks, and the packet requires accessibility as a release requirement, which the written protocol covers for what automation cannot.
Source: Packet file 03, section 15 item 8; packet file 01, Architecture rule 8.
Acceptance criteria:
1. The accessibility_tests CI job runs automated checks on the core flows in tests/accessibility/core_flows.spec.ts and fails on a violation at the approved severity.
2. A written manual accessibility protocol exists in ACCESSIBILITY covering keyboard, screen reader, reduced motion, and contrast, and its execution result is retained as gate evidence before launch.
3. The automated job covers the configure, run, report, and share flows.
Priority: P1.
Dependencies: ACC001, ACC002, ACC006, INT002.
Risks: Automated checks miss real barriers; mitigated by the written manual protocol executed before launch.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### ACC006 Focus management

Statement: Focus is visible, order is logical, there are no focus traps, and dialogs and drawers behave correctly.
Reason: Accessibility is a release requirement, and correct focus behavior underpins keyboard operation.
Source: Packet file 01, Architecture rule 8; packet file 03, section 17 browser tests.
Acceptance criteria:
1. A visible focus indicator is present on every focusable element, verified by the accessibility checks.
2. Focus order follows reading and interaction order, and no focus trap exists outside a modal dialog, verified by tests/e2e/keyboard.spec.ts.
3. Opening a dialog or drawer moves focus into it and restores focus on close, verified by a component test.
Priority: P1.
Dependencies: ACC001, ACC005.
Risks: Bottom sheets on mobile trap focus; mitigated by explicit dialog and drawer focus handling.
Gate class: BLOCK.
First phase: G5.
Status: ACTIVE.

## Security requirement sections

### SEC001 No secret exposure

Statement: No secret appears in source, logs, browser assets, build artifacts, or tracked files, and continuous integration secrets live in GitHub environments only.
Reason: Packet definition of done item 11 and section 10 require that no secret appears in source, logs, browser assets, or build artifacts and that secrets reside only in GitHub environments.
Source: Packet file 01, Definition of done item 11; packet file 03, section 10.
Acceptance criteria:
1. A repository scan finds no secret value in tracked files, verified by GitHub secret scanning (SEC006) and the production acceptance check for secret exposure (packet file 03 section 21 item 15).
2. Built browser assets and source maps contain no secret, verified by a build artifact scan.
3. CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID exist only as GitHub environment secrets, never in .env, .dev.vars, workflow logs, or test reports.
Priority: P1.
Dependencies: SEC006, SEC008, OPS003.
Risks: A token leaks into a log line; mitigated by never echoing secrets and by masked secrets in Actions.
Gate class: BLOCK.
First phase: G1.
Status: ACTIVE.

### SEC002 Hostile input handling

Statement: URL scenario input is validated, clamped, and length limited against malicious or oversized payloads.
Reason: INTAKE.md section 9 identifies URL encoded scenario state as attacker controllable input, and packet file 03 section 17 requires deterministic rejection or clamping.
Source: INTAKE.md section 9; packet file 03, section 17 invariant 8.
Acceptance criteria:
1. A share URL longer than the recorded maximum length is rejected without error, verified by a hostile input unit test.
2. Out of range or malformed parameters are clamped or rejected deterministically (FR026), verified by a property test.
3. No scenario input path evaluates code or injects markup, verified by tests that pass script like payloads and assert they are treated as inert data.
Priority: P1.
Dependencies: FR026, DATA001, SEC003.
Risks: A parser accepts an oversized payload and stalls the worker; mitigated by the length limit and by deterministic rejection.
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### SEC003 Security headers

Statement: A Content Security Policy generated from actual application behavior, a referrer policy, content type options, a permissions policy, frame protection, and compatible cross origin policies are served.
Reason: Packet section 13 requires these headers and a CSP generated from actual behavior rather than a broad policy.
Source: Packet file 03, section 13; ruling F004 for the analytics origin.
Acceptance criteria:
1. public/_headers serves a Content Security Policy that permits only the script, style, image, font, and connect sources the application actually uses, including exactly the Cloudflare Web Analytics origin (INT006), verified by an integration test that asserts the policy string.
2. Referrer Policy, X Content Type Options, a Permissions Policy, and frame protection through CSP are present, verified by the same test.
3. Production acceptance confirms the headers are present on the live site (packet file 03 section 21 item 7).
Priority: P1.
Dependencies: INT006, SEC008, REL004.
Risks: A broad CSP is pasted to avoid breakage; mitigated by generating the policy from actual behavior and asserting the exact string.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### SEC004 Dependency review

Statement: A dependency review workflow blocks newly vulnerable dependencies at the approved severity threshold.
Reason: Packet section 7 requires a dependency_review workflow that fails on newly introduced vulnerable dependencies at the approved threshold.
Source: Packet file 03, section 7.
Acceptance criteria:
1. .github/workflows/dependency_review.yml runs on pull requests that change dependency manifests or lock files.
2. The workflow fails the pull request when a newly introduced dependency has a vulnerability at or above the approved severity threshold, with the threshold recorded in the workflow.
3. License policy violations are reported if a license policy is selected.
Priority: P1.
Dependencies: SEC007, INT002, INT005.
Risks: The threshold is set too loose; mitigated by recording the threshold and reviewing it in maintenance (OPS008).
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### SEC005 Code scanning

Statement: CodeQL runs on pull requests, on main, and on a schedule, and new high severity findings block merge.
Reason: Packet section 7 requires CodeQL analysis on pull requests, pushes to main, and a scheduled interval, treating new high severity findings as merge blocking.
Source: Packet file 03, section 7; ruling F001 for public repository CodeQL availability.
Acceptance criteria:
1. .github/workflows/codeql.yml analyzes TypeScript and JavaScript and runs on pull requests, on pushes to main, and on a schedule.
2. A newly introduced high severity finding blocks merge, verified by the required check configuration.
3. The public repository (F001) has code scanning enabled.
Priority: P1.
Dependencies: INT001, INT002.
Risks: CodeQL noise slows review; mitigated by blocking only new high severity findings.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### SEC006 Secret scanning

Statement: GitHub secret scanning and push protection are enabled.
Reason: Packet section 3 item 10 requires secret scanning and push protection where available.
Source: Packet file 03, section 3 item 10.
Acceptance criteria:
1. Secret scanning is enabled on the nixfred/filter repository.
2. Push protection is enabled so a commit containing a detected secret is blocked at push.
3. The enablement is recorded in OPERATIONS or deployment.md as a nonsecret configuration fact.
Priority: P1.
Dependencies: INT001, SEC001.
Risks: Push protection is bypassed by an allowlist; mitigated by not adding bypass exceptions.
Gate class: BLOCK.
First phase: G0.
Status: ACTIVE.

### SEC007 Pinned supply chain

Statement: No unpinned CDN serves production code, dependencies are pinned, and the lock file is committed.
Reason: Packet section 4 requires pinned direct dependencies, a committed lock file, and no production code from unpinned public content delivery networks.
Source: Packet file 03, section 4; ruling F003.
Acceptance criteria:
1. package-lock.json is committed and npm ci is used everywhere (F003, OPS002).
2. Direct dependencies are pinned to explicit versions, verified by inspecting package.json.
3. No production code loads from an unpinned public content delivery network, verified by the CSP (SEC003) and a source scan.
Priority: P1.
Dependencies: OPS002, SEC003, INT005.
Risks: A transitive dependency pulls remote code; mitigated by dependency review (SEC004) and the CSP.
Gate class: BLOCK.
First phase: G1.
Status: ACTIVE.

### SEC008 Preview isolation

Statement: Previews are noindex, never bind the production domain, never receive production only variables, and fork pull requests get no credentials.
Reason: Packet section 8 requires previews to be noindex, to never bind the production custom domain, and to not expose production only variables, and ruling R012 keeps previews isolated.
Source: Packet file 03, section 8; rulings R005, R012.
Acceptance criteria:
1. Preview deployments send a noindex signal (REL004), verified by the preview headers.
2. A preview never binds filter.nixfred.com, verified by the deploy_preview workflow configuration.
3. Cloudflare credentials are available only to the deployment job and not to fork pull requests, verified by the workflow permissions and environment configuration.
4. Production only variables are not exposed to previews, verified by the environment separation in the workflows.
Priority: P1.
Dependencies: INT002, SEC010, REL004.
Risks: A fork pull request exfiltrates a token; mitigated by withholding credentials from fork pull requests and by the preview environment scope.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### SEC009 Threat model

Statement: A documented threat model covers supply chain, malicious scenario links, cross site scripting, oversized parameters, worker denial of service, secret exposure, and preview access.
Reason: INTAKE.md section 9 and the packet security posture require a documented threat model, folded into SECURITY_PLAN by ruling R001.
Source: INTAKE.md section 9; ruling R001; packet file 03, sections 8, 10, 13.
Acceptance criteria:
1. SECURITY_PLAN documents each of the seven threats with its mitigation and the requirement IDs that implement the mitigation.
2. Each mitigation references a concrete control, for example schema validation (SEC002), CSP (SEC003), dependency review (SEC004), or preview access (SEC010).
3. The threat model is reviewed when the model or dependencies change (OPS008).
Priority: P2.
Dependencies: SEC002, SEC003, SEC004, SEC008, SEC010.
Risks: The document goes stale; mitigated by the maintenance review trigger (OPS008).
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### SEC010 Preview access control

Statement: Previews are protected by Cloudflare Access until Fred opens them.
Reason: Ruling R012 protects previews with Cloudflare Access, and PENDING P001 records the open decision with a safe fallback.
Source: Ruling R012; PENDING P001; packet file 03, section 8 preview access policy.
Acceptance criteria:
1. Preview URLs require Cloudflare Access authentication until Fred approves public previews, verified by an access check against a preview URL.
2. The fallback configured is a one time PIN to frednix@gmail.com, consistent with PENDING P001.
3. If Fred opens previews, the change is recorded as a ruling and this criterion is updated, not silently removed.
Priority: P1.
Dependencies: SEC008, INT002.
Risks: Access misconfiguration exposes unfinished work; mitigated by defaulting to protected until explicitly opened.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

## Data requirement sections

### DATA001 Share encoding

Statement: A compact versioned URL encoding carries the model version, seed, and parameters, with migration for supported older formats.
Reason: Ruling R015 requires the model version inside the share URL schema and semantic separation from the application version, and packet baseline decision 6 requires URL encoded state.
Source: Ruling R015; packet file 01, Default implementation decision 6; packet file 03, section 20 items 8 and 9.
Acceptance criteria:
1. The encoding includes the simulation model version, the seed, and every parameter in a compact form, verified by tests/integration/scenario_round_trip.test.ts.
2. A supported older format is migrated on decode, verified by a scenario migration unit test, and preserved where practical (packet file 03 section 20 item 9).
3. Decoding an unsupported or malformed encoding fails deterministically (FR026, SEC002).
4. A maximum share URL length budget is defined as a named constant in DATA_MODEL.md, and an automated test asserts that the encoded share URL for every valid scenario, including all eight presets and the maximum parameter configuration, stays within that budget constant defined in DATA_MODEL.md (SEC002).
Priority: P1.
Dependencies: FR008, FR026, SEC002, OPS009.
Risks: A schema change breaks old links; mitigated by migration logic and by embedding the model version.
Gate class: BLOCK.
First phase: G2.
Status: ACTIVE.

### DATA002 Storage policy

Statement: localStorage holds only preferences and the last scenario, no cookies are used, and a visible clear control exists.
Reason: Packet baseline decision 7 and section 18 restrict storage to preferences and the last scenario with no cookies, and DATA002 requires a visible clear control.
Source: Packet file 01, Default implementation decision 7; packet file 03, section 18; FR013.
Acceptance criteria:
1. Only preferences and the last scenario are written to localStorage, verified by an integration test enumerating stored keys.
2. document.cookie remains empty during the core flows, verified by the browser smoke suite.
3. A visible clear local data control empties storage (FR013).
Priority: P2.
Dependencies: FR013, DATA003.
Risks: A library sets a cookie; mitigated by auditing dependencies and asserting no cookies in tests.
Gate class: BLOCK.
First phase: G4.
Status: ACTIVE.

### DATA003 Privacy posture

Statement: No personal data is collected, only Cloudflare Web Analytics is used, and there is no session replay, no fingerprinting, and no simulation parameters used as identifiers.
Reason: Ruling F004 fixes cookieless Cloudflare Web Analytics with no session replay, no fingerprinting, and no parameters as identifiers, and packet section 18 forbids these.
Source: Ruling F004; packet file 03, section 18.
Acceptance criteria:
1. No personal data is collected by the application, verified by a network inspection during the core flows.
2. The only analytics is the production Cloudflare Web Analytics beacon (INT006), verified by the CSP connect sources (SEC003).
3. No session replay, no client fingerprinting, and no use of simulation parameters as identifiers occurs, verified by the network and code inspection.
Priority: P1.
Dependencies: INT006, SEC003, DATA002.
Risks: Analytics configuration drifts toward richer tracking; mitigated by the cookieless beacon and the CSP restricting the origin.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

## Integration requirement sections

### INT001 GitHub repository

Statement: The public repository nixfred/filter under MIT uses main as default, requires pull requests after scaffold, uses squash merge, enables branch protection and conversation resolution, and auto deletes merged branches.
Reason: Ruling F001 fixes the public MIT repository, and packet section 3 fixes the repository policy.
Source: Ruling F001; packet file 03, section 3.
Acceptance criteria:
1. nixfred/filter exists as a public repository with an MIT LICENSE file and main as the default branch.
2. After the initial scaffold, main requires pull requests, requires all named quality checks, blocks force pushes and branch deletion, and requires conversation resolution, verified by the branch protection or ruleset configuration.
3. Squash merge is the default and merged feature branches are deleted automatically.
Priority: P1.
Dependencies: INT002, INT007, SEC006.
Risks: Branch protection blocks the initial scaffold; resolved by the INTAKE alignment note that scaffold lands on main before protection activates.
Gate class: BLOCK.
First phase: G0.
Status: ACTIVE.

### INT002 Workflows

Statement: Five workflows (ci, dependency_review, codeql, deploy_preview, deploy_production) use unique job names, least privilege permissions, concurrency control, and npm ci with caching.
Reason: Packet sections 6 through 9 define the five workflows, and the charter fixes the canonical job names.
Source: Packet file 03, sections 6 to 9; CHARTER_COMMON.md canonical names; ruling R011.
Acceptance criteria:
1. The five workflow files exist with the canonical job names: install, format_check, lint, typecheck, unit_tests, simulation_determinism, simulation_properties, coverage, build, bundle_budget, browser_smoke, accessibility_tests for ci, deploy_preview for the preview workflow, and quality_gate, deploy_production, post_deploy_smoke for production.
2. Each workflow declares least privilege permissions and concurrency that cancels superseded runs for the same branch or pull request (except production, which does not cancel after upload begins).
3. Workflows use npm ci with dependency caching through the Node setup action.
4. Merging to main with all required checks green deploys production automatically with no manual environment approval gate (ruling R011).
5. Every continuous integration check is explicitly labeled blocking or advisory in docs/CI_CD.md, and the main branch protection required check set equals exactly the blocking set, verified against the branch protection configuration, so an advisory check can never block production and the automatic deploy on green main cannot deadlock on a non required check.
Priority: P1.
Dependencies: OPS001, OPS002, INT001, SEC008, NFR010.
Risks: Ambiguous job names break required checks; mitigated by the canonical unique names.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### INT003 Cloudflare Pages

Statement: A Direct Upload Pages project named filter uses production branch main and the custom domain filter.nixfred.com with verified DNS and certificate, and retains the pages.dev address as a fallback.
Reason: Ruling R003 fixes the Pages project name filter, and packet section 12 defines the project creation and custom domain process.
Source: Ruling R003; packet file 03, section 12.
Acceptance criteria:
1. A Direct Upload Pages project named filter exists with production branch main, recorded in deployment.md.
2. filter.nixfred.com is associated through the Pages custom domain process with a verified DNS record and an issued certificate (packet file 03 section 21 items 1 and 2).
3. The generated pages.dev address is preserved as an operational fallback.
Priority: P1.
Dependencies: INT004, OPS003, OPS006.
Risks: The scoped API token cannot list projects; mitigated by passing CLOUDFLARE_ACCOUNT_ID explicitly and using direct Pages API calls per INTAKE.md section 3.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### INT004 Wrangler config

Statement: wrangler.jsonc is the configuration source of truth, with pages_build_output_dir set to ./dist, a pinned compatibility date, no bindings, and comments.
Reason: Packet section 11 requires wrangler.jsonc as the source of truth with these settings, and ruling R013 keeps bindings absent.
Source: Packet file 03, section 11; ruling R013.
Acceptance criteria:
1. wrangler.jsonc sets the project name, sets pages_build_output_dir to ./dist, and pins a compatibility date.
2. No KV, D1, R2, Durable Objects, or Pages Functions bindings are present (ruling R013).
3. Comments explain every environment override, and no secret value appears in vars.
Priority: P1.
Dependencies: INT003, OPS001.
Risks: A binding is added silently; mitigated by the no bindings assertion and the ruling R013.
Gate class: BLOCK.
First phase: G1.
Status: ACTIVE.

### INT005 Dependabot

Statement: Dependabot runs weekly npm and GitHub Actions updates, groups low risk development dependencies, and does not merge major updates automatically.
Reason: Packet section 4 items 5 through 7 require Dependabot for npm and Actions, grouped low risk development updates, and no automatic major merges.
Source: Packet file 03, section 4 items 5 to 7; ruling F003.
Acceptance criteria:
1. .github/dependabot.yml configures weekly updates for the npm and GitHub Actions ecosystems.
2. Low risk development dependency updates are grouped where practical.
3. No configuration merges a major version update automatically.
Priority: P2.
Dependencies: SEC004, SEC007, INT002.
Risks: Update noise overwhelms review; mitigated by grouping and weekly cadence.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### INT006 Analytics integration

Statement: The Cloudflare Web Analytics beacon runs in production only, and the CSP permits exactly that origin.
Reason: Ruling F004 fixes production only Cloudflare Web Analytics, and packet section 13 requires the CSP to permit exactly the analytics origin.
Source: Ruling F004; packet file 03, sections 13 and 18.
Acceptance criteria:
1. The analytics beacon loads only in production, verified by the absence of the beacon in preview and development builds.
2. The CSP connect and script sources permit exactly the Cloudflare Web Analytics origin and no other third party origin (SEC003).
3. The beacon is cookieless and non blocking (DATA003, NFR003).
Priority: P2.
Dependencies: DATA003, SEC003, NFR003.
Risks: The beacon loads on previews; mitigated by gating it on the production environment.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### INT007 Repository hygiene

Statement: CODEOWNERS, a pull request template, issue templates, and the dependency graph are present and enabled.
Reason: Packet section 3 and the manifest require CODEOWNERS, a pull request template, issue templates, and the dependency graph.
Source: Packet file 03, section 3 items 9 and 11; packet file 04, .github tree.
Acceptance criteria:
1. .github contains CODEOWNERS, pull_request_template.md, and an ISSUE_TEMPLATE directory with bug_report, feature_request, and config entries.
2. The dependency graph is enabled on the repository.
3. CODEOWNERS names the repository owner so review routing is defined.
Priority: P2.
Dependencies: INT001, INT005.
Risks: Templates go unused; acceptable because their presence is the requirement, not their usage rate.
Gate class: BLOCK.
First phase: G1.
Status: ACTIVE.

## Operations requirement sections

### OPS001 Script contract

Statement: The packet required npm scripts exist, and check:all runs every merge blocking local check in a deterministic order.
Reason: Packet section 5 lists the required scripts and requires check:all to run every merge blocking local check deterministically.
Source: Packet file 03, section 5; CHARTER_COMMON.md npm scripts.
Acceptance criteria:
1. package.json defines exactly the packet scripts: dev, build, preview, format, format:check, lint, typecheck, test, test:unit, test:coverage, test:e2e, test:a11y, test:simulation, check:bundle, check:all, pages:dev, pages:deploy:preview, pages:deploy:production.
2. check:all runs format:check, lint, typecheck, the test suites, coverage, and check:bundle in a deterministic order and exits nonzero on any failure.
3. The CI jobs invoke the same scripts so local and CI results match.
Priority: P1.
Dependencies: OPS002, NFR010, INT002.
Risks: Local and CI checks diverge; mitigated by CI invoking the same npm scripts.
Gate class: BLOCK.
First phase: G1.
Status: ACTIVE.

### OPS002 Pinned runtime

Statement: Node is pinned via .nvmrc and setup-node, and npm ci is used everywhere.
Reason: Packet section 4 items 1 through 3 require a pinned Node release and npm ci in continuous integration, confirmed by ruling F003.
Source: Packet file 03, section 4 items 1 to 3; ruling F003.
Acceptance criteria:
1. .nvmrc pins a supported Node version and the GitHub Actions setup-node step uses the same version.
2. npm ci is used in every workflow that installs dependencies.
3. The pinned version is a maintained Node release recorded in OPERATIONS.
Priority: P1.
Dependencies: OPS001, SEC007, INT002.
Risks: The pinned Node version reaches end of life; mitigated by the maintenance cadence review (OPS008).
Gate class: BLOCK.
First phase: G1.
Status: ACTIVE.

### OPS003 Deployment record

Statement: docs/deployment.md records the owner, repository, account identifier, project, domain, secret names, workflows, smoke tests, and rollback procedure, and never secret values.
Reason: Packet phase 0 item 7 and section 2 item 9 require recording nonsecret identifiers and decisions in deployment.md.
Source: Packet file 01, Phase 0 item 7; packet file 03, section 2 item 9.
Acceptance criteria:
1. deployment.md records the GitHub owner and repository, the Cloudflare account identifier, the Pages project name, the custom domain, the secret names (not values), the five workflows, the smoke tests, and the rollback procedure.
2. No secret value appears in deployment.md, verified by the secret scan (SEC001).
3. The record is updated when any of these identifiers change.
Priority: P1.
Dependencies: SEC001, INT003, OPS004.
Risks: A secret value is pasted by mistake; mitigated by secret scanning and push protection (SEC006).
Gate class: BLOCK.
First phase: G0.
Status: ACTIVE.

### OPS004 Rollback

Statement: A previous Pages deployment is selectable without rebuilding, the procedure is documented and tested before launch, main is never rewritten, a corrective pull request follows, and a post rollback smoke test runs.
Reason: Packet section 19 and definition of done item 6 require selectable rollback without rebuild, no main rewrite, a corrective pull request, and a post rollback smoke test.
Source: Packet file 03, section 19; packet file 01, Definition of done item 6.
Acceptance criteria:
1. A prior successful Cloudflare Pages deployment can be selected for rollback without rebuilding the old commit, documented in OPERATIONS or deployment.md.
2. The rollback procedure is tested at least once before public launch (packet file 03 section 21 item 17), with the test result retained as gate evidence.
3. Rollback does not rewrite main, and a corrective pull request follows, and the production smoke test runs after rollback.
Priority: P1.
Dependencies: OPS005, OPS006, INT003.
Risks: Rollback is only theoretical; mitigated by the required pre launch test.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### OPS005 Deployment traceability

Statement: Each production deployment records the commit SHA, build time, application version, simulation model version, and Cloudflare deployment identifier, and the GitHub environment points at https://filter.nixfred.com.
Reason: Packet section 9 behavior items 7 and 8 and definition of done item 2 require these records and the environment address.
Source: Packet file 03, section 9 items 7 and 8; packet file 01, Definition of done item 2.
Acceptance criteria:
1. The production deploy workflow records the commit SHA, build time, application version, simulation model version, and Cloudflare deployment identifier.
2. The GitHub production environment address is https://filter.nixfred.com.
3. Every production deployment remains associated with its immutable Git commit (definition of done item 2), verified by the deployment record.
Priority: P1.
Dependencies: INT002, OPS009, REL003.
Risks: Build metadata is missing at runtime; mitigated by scripts/write_build_metadata.mjs writing it at build time.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### OPS006 Post deploy verification

Statement: Smoke tests run against the custom domain after deploy, and a critical path failure fails the workflow.
Reason: Packet section 9 behavior items 9 and 10 require post deployment smoke tests against the custom domain that fail the workflow on a critical failure.
Source: Packet file 03, section 9 items 9 and 10.
Acceptance criteria:
1. The post_deploy_smoke job runs against filter.nixfred.com after a production deploy.
2. The job asserts the custom domain resolves, key assets load, and the critical interaction path works, and fails the workflow on any of these (packet file 03 section 21 items 1, 9, and 16).
3. A default run completes in the smoke test.
Priority: P1.
Dependencies: INT002, INT003, REL002.
Risks: Smoke tests are flaky against a live domain; mitigated by asserting only stable critical path signals.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### OPS007 Incident record

Statement: Material failures get an incident issue with cause, affected release, rollback, and corrective action.
Reason: Packet section 19 item 6 requires an incident issue recording cause, affected release, rollback deployment, and corrective action for material failures.
Source: Packet file 03, section 19 item 6.
Acceptance criteria:
1. OPERATIONS documents the incident issue template and the trigger for opening one.
2. A material production failure results in an incident issue recording cause, affected release, rollback deployment, and corrective action.
3. The incident issue links the corrective pull request (OPS004).
Priority: P2.
Dependencies: OPS004, INT007.
Risks: Incidents go unrecorded under time pressure; mitigated by a ready template, and this is a WARN gate because a missing retrospective issue for a past event must not block a current build gate.
Gate class: WARN.
First phase: G6.
Status: ACTIVE.

### OPS008 Maintenance cadence

Statement: A monthly dependency review and scheduled security and browser compatibility checks run.
Reason: Packet section 20 items 5 and 6 require reviewing dependencies at least monthly and running scheduled security and browser compatibility checks.
Source: Packet file 03, section 20 items 5 and 6.
Acceptance criteria:
1. OPERATIONS documents a monthly dependency review and the scheduled security and browser compatibility checks.
2. The CodeQL schedule (SEC005) and Dependabot cadence (INT005) implement the scheduled portions.
3. Scientific assumptions are reviewed when the model changes (packet file 03 section 20 item 7).
Priority: P3.
Dependencies: SEC005, INT005, SEC009.
Risks: A cadence is defined but not followed; this is a WARN gate because a missed post launch review must not block a build gate, and the scheduled automations carry the load.
Gate class: WARN.
First phase: G6.
Status: ACTIVE.

### OPS009 Version visibility

Statement: The About panel shows the application version, the simulation model version, and the deployed commit.
Reason: Ruling R015 and standing law 6 require the application version, simulation model version, and deployed commit to be visible in the About panel.
Source: Ruling R015; packet file 03, section 18 item 7; ruling R016.
Acceptance criteria:
1. The About panel displays the application version, the simulation model version, and the deployed commit, verified by a component test that reads the injected build metadata.
2. The values match the deployment record (OPS005) for the deployed build.
3. The simulation model version shown equals the version embedded in share URLs (DATA001).
Priority: P1.
Dependencies: OPS005, DATA001, REL007.
Risks: Metadata is stale in a preview; mitigated by writing it at build time per commit.
Gate class: BLOCK.
First phase: G4.
Status: ACTIVE.

### OPS010 Artifact retention

Statement: Continuous integration artifacts are retained for a defined period, and the production build artifact is kept for the approved retention.
Reason: Packet section 6 item 13 and section 9 item 5 require uploading reports on failure and retaining the production build artifact for the approved retention period.
Source: Packet file 03, section 6 item 13; section 9 item 5.
Acceptance criteria:
1. The ci workflow uploads test reports and build output on failure with a defined retention period.
2. The production deploy workflow retains the production build artifact for the approved retention period recorded in OPERATIONS.
3. The retention periods are recorded so they are auditable.
Priority: P2.
Dependencies: INT002, OPS005.
Risks: Long retention increases storage; mitigated by recording and bounding the periods.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

## Release requirement sections

### REL001 Definition of done

Statement: The packet's fifteen definition of done items all map to blocking or manual gates.
Reason: Ruling R004 maps packet phases into G gates, and BUILD.md requires the definition of done to be enforced through gates.
Source: Packet file 01, Definition of done; ruling R004; INTAKE.md section 10.
Acceptance criteria:
1. GATES.md maps each of the fifteen definition of done items to at least one BLOCK or MANUAL gate, verified by a coverage table with no unmapped item.
2. Definition of done item 15 (Fred approves the final visual and narrative treatment) maps to the MANUAL gate REL006.
3. No definition of done item maps only to a WARN gate.
Priority: P1.
Dependencies: REL002, REL006, BR002.
Risks: An item is mapped in name only; mitigated by requiring the mapped gate to have observable acceptance criteria.
Gate class: BLOCK.
First phase: G7.
Status: ACTIVE.

### REL002 Production acceptance

Statement: The packet's seventeen item production acceptance checklist executes at G-LAUNCH with retained evidence.
Reason: Packet section 21 lists a seventeen item production acceptance checklist that gates public launch.
Source: Packet file 03, section 21.
Acceptance criteria:
1. All seventeen checklist items execute at G-LAUNCH: custom domain resolves, certificate valid, canonical metadata uses the custom domain, social preview renders, robots policy correct, previews not indexed, security headers present, redirects behave, default run completes, shared run reproduces, mobile run completes, reduced motion run completes, keyboard path completes, no console errors in supported browsers, no secret or source map exposed, deployment record links domain and commit, and rollback tested at least once.
2. Each item's result is retained as gate evidence.
3. Any failed item blocks the launch gate.
Priority: P1.
Dependencies: OPS006, OPS004, SEC001, REL004, REL005.
Risks: A checklist item is checked without evidence; mitigated by requiring retained evidence per item.
Gate class: BLOCK.
First phase: G-LAUNCH.
Status: ACTIVE.

### REL003 Release discipline

Statement: Semantic application tags start at v1.0.0, gate tags use gate/GN-YYYYMMDD, a CHANGELOG is maintained, and the simulation model version is separate.
Reason: Ruling R015 fixes semantic application versions and a separate simulation model version, and packet section 20 requires a change log and tagged milestones.
Source: Ruling R015; packet file 03, section 20; ruling R004 for gate tags.
Acceptance criteria:
1. The first production release is tagged v1.0.0 and follows semantic versioning thereafter.
2. Each gate crossing is tagged gate/GN-YYYYMMDD.
3. A CHANGELOG records notable changes, and the simulation model version is tracked separately from the application version (DATA001, OPS009).
Priority: P2.
Dependencies: OPS005, OPS009, DATA001.
Risks: Application and model versions are conflated; mitigated by the separate model version in the share schema.
Gate class: BLOCK.
First phase: G7.
Status: ACTIVE.

### REL004 Indexing policy

Statement: Production is indexed from launch, and previews are always noindex.
Reason: Ruling R005 allows production indexing from launch and requires previews to always send noindex.
Source: Ruling R005; packet file 03, section 13 item 10 and section 21 items 5 and 6.
Acceptance criteria:
1. The production robots policy allows indexing, verified by public/robots.txt and the production headers (packet file 03 section 21 item 5).
2. Preview deployments send noindex, verified by the preview headers (packet file 03 section 21 item 6, SEC008).
3. Canonical metadata uses the custom domain (packet file 03 section 21 item 3).
Priority: P1.
Dependencies: SEC008, INT003, REL002.
Risks: A preview is indexed by mistake; mitigated by the noindex preview headers and the isolation requirement.
Gate class: BLOCK.
First phase: G6.
Status: ACTIVE.

### REL005 Launch assets

Statement: A favicon, application icons, a web manifest, a robots file, a humans file, and a social preview image are produced from original artwork.
Reason: Packet phase 4 item 3 requires these launch assets, ruling R006 ships a manifest without a service worker, and PENDING P002 records the open social preview content with a safe fallback.
Source: Packet file 01, Phase 4 item 3; ruling R006; PENDING P002.
Acceptance criteria:
1. public contains favicon, icon assets, site.webmanifest, robots.txt, humans.txt, and social_preview image, all from original project artwork with no generic space photograph (UX006).
2. The web manifest ships for icons and metadata only, with no service worker and no offline claim (ruling R006).
3. The social preview renders correctly in link unfurls (packet file 03 section 21 item 4); if the final content is undecided, the safe fallback of a generated galaxy render with the title THE GREAT FILTER is used (PENDING P002).
Priority: P1.
Dependencies: UX006, REL002.
Risks: The social preview content is unresolved at launch; mitigated by the PENDING P002 safe fallback.
Gate class: BLOCK.
First phase: G4.
Status: ACTIVE.

### REL006 Fred approval

Statement: Fred approves the final visual and narrative treatment before launch.
Reason: Packet definition of done item 15 requires Fred's approval of the final visual and narrative treatment, and PENDING P003 designates this the one deliberate hard stop.
Source: Packet file 01, Definition of done item 15; PENDING P003.
Acceptance criteria:
1. A recorded approval from Fred of the final visual and narrative treatment exists before the production launch, retained as gate evidence.
2. No production launch proceeds without this approval, and there is no automated fallback by design (PENDING P003).
3. The approval references the specific release candidate build it approves.
Priority: P1.
Dependencies: UX001, UX003, REL002.
Risks: Approval is assumed rather than recorded; mitigated by requiring a recorded artifact tied to the candidate build.
Gate class: MANUAL.
First phase: G-LAUNCH.
Status: ACTIVE.

### REL007 Footer obligations

Statement: The footer credits NixFred, links to nixfred.com and to the repository, and shows the version identifier.
Reason: Ruling R016 fixes the footer to credit NixFred, link nixfred.com and the public repository, and show the visible version identifier, satisfying standing law 7.
Source: Ruling R016; packet file 01, definition of done documentation.
Acceptance criteria:
1. The footer credits NixFred and links to nixfred.com and to the public nixfred/filter repository, verified by a component test.
2. The footer shows the visible version identifier consistent with the About panel (OPS009).
3. No experimental badge is present, consistent with ruling R016.
Priority: P1.
Dependencies: OPS009, INT001.
Risks: The repository link points at a private or wrong repository; mitigated by asserting the nixfred/filter URL in the component test.
Gate class: BLOCK.
First phase: G4.
Status: ACTIVE.

## Totals

ACTIVE requirements: 97. DEFERRED requirements: 4 (FR015, FR034, FR035, FR036). Total requirements: 101.

By gate class (ACTIVE only): BLOCK 94, WARN 2 (OPS007, OPS008), MANUAL 1 (REL006). Sum 97.

# PRD: The Great Filter

Contractual requirements register for filter.nixfred.com. IDs are stable and never renumbered. Status values: ACTIVE, PENDING, DEFERRED, SUPERSEDED, VERIFIED.

THIS FILE IS CURRENTLY A SKELETON. The requirements analyst expands every entry to the full contract fields (statement, reason, source, acceptance criteria, priority, dependencies, risks, gate class, first phase, status) without changing any ID or title.

## Business requirements

| ID | Title | Statement | Status |
|---|---|---|---|
| BR001 | Product identity | An interactive Fermi paradox simulator titled The Great Filter, served at filter.nixfred.com, LABS category | ACTIVE |
| BR002 | Three minute comprehension | A first time visitor understands the core interaction without reading a long essay | ACTIVE |
| BR003 | Scientific honesty | The application models possibilities. No modeling assumption is presented as established fact and no claim to solve the Fermi paradox appears | ACTIVE |
| BR004 | Sentence first outcomes | The most memorable output of a run is a headline sentence in the Silence Report, not a chart | ACTIVE |
| BR005 | Free and account free | The full experience works without accounts, payment, or sign in | ACTIVE |

## Functional requirements

| ID | Title | Statement | Status |
|---|---|---|---|
| FR001 | Six main controls | Basic panel exposes life emergence, intelligence emergence, technological transition, long term survival, detectable communication, interstellar expansion (ruling R008) | ACTIVE |
| FR002 | Control anatomy | Every control shows a plain language label, one sentence explanation, current value, range explanation, visible effect summary, and a mathematical detail control | ACTIVE |
| FR003 | Advanced settings | Advanced settings exist and are collapsed by default | ACTIVE |
| FR004 | Run controls | Start, pause, resume, speed change, reset, replay same seed, randomize seed (no arbitrary rewind, ruling R010) | ACTIVE |
| FR005 | Canvas interactions | Zoom, pan, select a civilization, inspect its details | ACTIVE |
| FR006 | Event ledger | Time stamped event ledger, important events by default with user selectable filters | ACTIVE |
| FR007 | Label toggle | Visitor can hide or show labels for a pure visual mode | ACTIVE |
| FR008 | Shareable scenarios | A share URL encodes model version, seed, and all parameters, and reproduces the identical modeled history when opened | ACTIVE |
| FR009 | Silence Report | At end of run or on stop, a report with the packet's fifteen metrics and a generated headline sentence | ACTIVE |
| FR010 | Presets | Eight curated presets from the packet, selectable before or instead of manual configuration | ACTIVE |
| FR011 | Onboarding | First visit onboarding that is skippable, with direct access to the simulation | ACTIVE |
| FR012 | Education drawers | Fermi paradox, Great Filter, what counts as a civilization, how contact is calculated, assumptions and limitations, sources, about LABS | ACTIVE |
| FR013 | Local preferences | localStorage persists preferences and last scenario, with a visible clear local data control | ACTIVE |
| FR014 | Scenario restore | The last scenario restores on the next visit | ACTIVE |
| FR015 | Contact sensitivity feature | Make Contact More Likely analysis identifying the most influential control | DEFERRED |
| FR016 | Civilization state machine | States: candidate system, habitable world, life, complex life, intelligence, technology, detectable, interstellar, and terminal states including quiet, transformed, extinct (rulings R009, R014) | ACTIVE |
| FR017 | Determinism | Same seed, same parameters, same simulation model version produce an identical run digest | ACTIVE |
| FR018 | Worker execution | Simulation executes in a Web Worker, never blocking the interface thread | ACTIVE |
| FR019 | Light travel | Signals propagate at the configured causal speed, detection depends on strength, duration, and distance (ruling R018) | ACTIVE |
| FR020 | Posthumous signals | Signals in transit persist and remain detectable after sender extinction | ACTIVE |
| FR021 | Expansion model | Interstellar expansion uses a configurable sub light effective speed with launch and settlement delays, presented as a frontier | ACTIVE |
| FR022 | Causal contact | Contact requires causal intersection per ruling R019, simultaneous existence alone is never contact | ACTIVE |
| FR023 | Representative population | Simulation uses a representative population with documented weighting behind a larger decorative starfield | ACTIVE |
| FR024 | Speed steps | Pause, normal, 10x, 100x, 1000x, and maximum speed | ACTIVE |
| FR025 | Causal event ordering | No event precedes its cause, event scheduling is internally consistent | ACTIVE |
| FR026 | Versioned scenario schema | Scenario schema is versioned, validated, clamps or rejects invalid input deterministically, and migrates supported older share formats | ACTIVE |
| FR027 | Run metrics | Aggregate metrics and run summaries are computed for the report and ledger | ACTIVE |
| FR028 | Renderer layers | Three.js 2.5D renderer (ruling F002) with galaxy, civilization, signal, travel, and label layers, plus a non WebGL fallback renderer | ACTIVE |
| FR029 | Reduced motion mode | Reduced motion replaces animation with discrete state changes, labels, and time stamped summaries | ACTIVE |
| FR030 | Degraded states | Loading, empty, degraded, unsupported, and error states are designed, not accidental | ACTIVE |
| FR031 | Mobile layout | Full screen canvas, compact status bar, bottom sheet controls, separate event and report sheets, large touch targets | ACTIVE |
| FR032 | Desktop layout | Center canvas, left control rail, top status, right detail drawer, bottom timeline | ACTIVE |
| FR033 | Deterministic fixtures | Committed scenario fixtures with expected digests guard determinism across changes | ACTIVE |
| FR034 | Batch runs | Monte Carlo batches across seeds with contact frequency | DEFERRED |
| FR035 | Sound | Optional sound, muted until user activation | DEFERRED |
| FR036 | Public scenario gallery | Server backed shared gallery | DEFERRED |

## User experience requirements

| ID | Title | Statement | Status |
|---|---|---|---|
| UX001 | Art direction | Observatory Elegy for simulation, Cosmic Atlas for education and report (ruling R020), all twelve packet visual traits bind | ACTIVE |
| UX002 | Motion language | Birth is a pulse, detectability a halo or shell, expansion a frontier, extinction a cooling fade, contact rare and consequential | ACTIVE |
| UX003 | Copy voice | Scientifically literate, calm, direct, occasionally dry (ruling R017), packet banned phrasings excluded, no em or en dashes | ACTIVE |
| UX004 | Opening state | Near still galaxy, title, supporting line, CREATE A GALAXY primary action, RUN A PRESET secondary action, tone line | ACTIVE |
| UX005 | Color system | Near black with blue depth, white and pale cyan stars, warm gold technology, electric violet transmission, quiet red danger only | ACTIVE |
| UX006 | Visual restraint | Precise typography, no generic space photographs, no neon arcade treatment, minimal glass | ACTIVE |
| UX007 | Canvas dominance | The galaxy canvas remains the visually dominant element in every layout | ACTIVE |

## Nonfunctional requirements

| ID | Title | Statement | Status |
|---|---|---|---|
| NFR001 | Mobile frame rate | Stable interactive frame rate on a mid range 2021 class mobile reference device (ruling R021) | ACTIVE |
| NFR002 | Adaptive rendering | Visual star count and effects adapt to device capability, a low power mode exists | ACTIVE |
| NFR003 | No blocking third parties | No blocking third party scripts, education and optional panels lazy load | ACTIVE |
| NFR004 | Bundle budgets | Initial JavaScript budget defined for the Three.js renderer and enforced in CI | ACTIVE |
| NFR005 | Lighthouse thresholds | Performance, accessibility, best practice, and SEO audits meet approved thresholds via lighthouserc | ACTIVE |
| NFR006 | Interface responsiveness | The interface thread stays responsive during simulation playback | ACTIVE |
| NFR007 | Efficient structures | Typed arrays or compact structures where they materially improve throughput | ACTIVE |
| NFR008 | Browser support | Last two versions of Chrome, Edge, Firefox, Safari, plus iOS Safari 16 and later (ruling R021) | ACTIVE |
| NFR009 | Coverage floors | Simulation domain line coverage at least 85 percent, overall at least 80 percent, enforced in CI | ACTIVE |
| NFR010 | Zero defect gates | Zero TypeScript errors, zero lint errors, zero formatting drift, no known flaky required tests | ACTIVE |

## Accessibility requirements

| ID | Title | Statement | Status |
|---|---|---|---|
| ACC001 | Keyboard operation | The complete core path operates with keyboard only | ACTIVE |
| ACC002 | Nonvisual status | Screen reader landmarks and nonvisual status descriptions of simulation state via a live region policy | ACTIVE |
| ACC003 | Reduced motion respect | prefers-reduced-motion is honored and an in application toggle exists | ACTIVE |
| ACC004 | Contrast and color safety | WCAG AA contrast for text and interface, color vision safe palette | ACTIVE |
| ACC005 | Automated and manual checks | Automated accessibility checks on core flows in CI plus a written manual protocol | ACTIVE |
| ACC006 | Focus management | Visible focus, logical order, no traps, correct dialog and drawer behavior | ACTIVE |

## Security requirements

| ID | Title | Statement | Status |
|---|---|---|---|
| SEC001 | No secret exposure | No secret in source, logs, browser assets, build artifacts, or tracked files. CI secrets live in GitHub environments only | ACTIVE |
| SEC002 | Hostile input handling | URL scenario input is validated, clamped, and length limited against malicious or oversized payloads | ACTIVE |
| SEC003 | Security headers | CSP generated from actual application behavior, referrer policy, content type options, permissions policy, frame protection, compatible cross origin policies | ACTIVE |
| SEC004 | Dependency review | Dependency review workflow blocks newly vulnerable dependencies at the approved threshold | ACTIVE |
| SEC005 | Code scanning | CodeQL runs on pull requests, main, and a schedule, new high severity findings block merge | ACTIVE |
| SEC006 | Secret scanning | GitHub secret scanning and push protection enabled | ACTIVE |
| SEC007 | Pinned supply chain | No unpinned CDN production code, dependencies pinned, lock file committed | ACTIVE |
| SEC008 | Preview isolation | Previews are noindex, never bind the production domain, never receive production only variables, fork PRs get no credentials | ACTIVE |
| SEC009 | Threat model | Documented threat model covering supply chain, malicious scenario links, XSS, oversized parameters, worker denial of service, secret exposure, preview access | ACTIVE |
| SEC010 | Preview access control | Previews protected by Cloudflare Access until Fred opens them (ruling R012, PENDING P001) | ACTIVE |

## Data requirements

| ID | Title | Statement | Status |
|---|---|---|---|
| DATA001 | Share encoding | Compact versioned URL encoding carrying model version, seed, and parameters, with migration for supported older formats (ruling R015) | ACTIVE |
| DATA002 | Storage policy | localStorage only for preferences and last scenario, no cookies, visible clear control | ACTIVE |
| DATA003 | Privacy posture | No personal data collection, Cloudflare Web Analytics only (ruling F004), no session replay, no fingerprints, no parameters as identifiers | ACTIVE |

## Integration requirements

| ID | Title | Statement | Status |
|---|---|---|---|
| INT001 | GitHub repository | Public nixfred/filter under MIT (ruling F001), main default, pull requests required after scaffold, squash merge, branch protection, conversation resolution, auto delete merged branches | ACTIVE |
| INT002 | Workflows | Five workflows (ci, dependency_review, codeql, deploy_preview, deploy_production) with unique job names, least privilege permissions, concurrency control, npm ci with caching | ACTIVE |
| INT003 | Cloudflare Pages | Direct Upload project filter (ruling R003), production branch main, custom domain filter.nixfred.com with verified DNS and certificate, pages.dev address retained as fallback | ACTIVE |
| INT004 | Wrangler config | wrangler.jsonc as configuration source of truth, pages_build_output_dir ./dist, pinned compatibility date, no bindings (ruling R013), commented | ACTIVE |
| INT005 | Dependabot | Weekly npm and GitHub Actions updates, grouped low risk development dependencies, no automatic major merges | ACTIVE |
| INT006 | Analytics integration | Cloudflare Web Analytics beacon in production only, CSP permits exactly that origin | ACTIVE |
| INT007 | Repository hygiene | CODEOWNERS, pull request template, issue templates, dependency graph enabled | ACTIVE |

## Operations requirements

| ID | Title | Statement | Status |
|---|---|---|---|
| OPS001 | Script contract | The packet's required npm scripts exist, check:all runs every merge blocking check deterministically | ACTIVE |
| OPS002 | Pinned runtime | Node pinned via .nvmrc and setup-node, npm ci everywhere (ruling F003) | ACTIVE |
| OPS003 | Deployment record | docs/deployment.md records owner, repository, account identifier, project, domain, secret names, workflows, smoke tests, rollback procedure, never secret values | ACTIVE |
| OPS004 | Rollback | Previous Pages deployment selectable without rebuilding, procedure documented and tested before launch, no main rewrites, corrective PR follow up, post rollback smoke test | ACTIVE |
| OPS005 | Deployment traceability | Production deployment records commit SHA, build time, app version, simulation model version, and Cloudflare deployment identifier, GitHub environment points at https://filter.nixfred.com | ACTIVE |
| OPS006 | Post deploy verification | Smoke tests run against the custom domain after deploy, critical path failure fails the workflow | ACTIVE |
| OPS007 | Incident record | Material failures get an incident issue with cause, affected release, rollback, corrective action | ACTIVE |
| OPS008 | Maintenance cadence | Monthly dependency review, scheduled security and browser compatibility checks | ACTIVE |
| OPS009 | Version visibility | About panel shows application version, simulation model version, and deployed commit (ruling R015, standing law 6) | ACTIVE |
| OPS010 | Artifact retention | CI artifacts retained for a defined period, production build artifact kept for the approved retention | ACTIVE |

## Release requirements

| ID | Title | Statement | Status |
|---|---|---|---|
| REL001 | Definition of done | The packet's fifteen definition of done items all map to blocking or manual gates | ACTIVE |
| REL002 | Production acceptance | The packet's seventeen item production acceptance checklist executes at G-LAUNCH with retained evidence | ACTIVE |
| REL003 | Release discipline | Semantic tags from v1.0.0, gate tags gate/GN-YYYYMMDD, CHANGELOG, separate simulation model version | ACTIVE |
| REL004 | Indexing policy | Production indexed from launch, previews always noindex (ruling R005) | ACTIVE |
| REL005 | Launch assets | Favicon, icons, manifest, robots, humans, social preview image from original artwork (PENDING P002) | ACTIVE |
| REL006 | Fred approval | Fred approves the final visual and narrative treatment before launch (PENDING P003, MANUAL gate) | ACTIVE |
| REL007 | Footer obligations | Footer credits NixFred, links nixfred.com and the repository, shows the version identifier (ruling R016) | ACTIVE |

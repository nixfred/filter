# DECISIONS

Settled rulings for The Great Filter (filter.nixfred.com). Authority position 2, directly under Fred's latest explicit instruction. R rulings come from intake reconciliation, F rulings from Fred's owner interview answers. No agent may reopen a ruling without recording a material conflict first.

## Interview rulings (binding, from Fred)

### F001 Repository is public under the MIT license
Date: 2026-07-11. Source: owner interview round 1, question 1.
Decision: nixfred/filter is a public repository with an MIT LICENSE file.
Reason: matches the rest of the LABS fleet, satisfies the standing law that public sites link to their own public repository, MIT is the simplest explicit license for an educational project.
Requirements affected: INT001, REL007, SEC005. Documents affected: PRD, GATES, CI_CD, SECURITY_PLAN, README, LICENSE.
Overrides: none.

### F002 Renderer is Three.js in a 2.5D presentation
Date: 2026-07-11. Source: owner interview round 1, question 2.
Decision: the galaxy canvas is a two dimensional galaxy disc with depth effects (parallax, tilt), rendered with Three.js points and custom shaders. A non WebGL fallback renderer covers low power, reduced motion, and unsupported devices.
Reason: honors the packet recommendation of two dimensional with depth effects while reusing the stack proven on galaxy.nixfred.com.
Requirements affected: FR028, FR029, NFR001, NFR002, NFR004, UX001. Documents affected: ARCHITECTURE, ART_DIRECTION, INTERACTION_SPEC, TEST_PLAN, adr/0002_renderer.
Overrides: none. Resolves packet open choice Q25 and Q145/Q146.

### F003 Package manager is npm for this project
Date: 2026-07-11. Source: owner interview round 1, question 3. Resolves conflict C001.
Decision: npm with a committed package-lock.json, npm ci in CI, Dependabot npm ecosystem.
Reason: the packet chose npm explicitly three times and its CI design assumes it. Project scoped ruling, the fleet standing law preferring Bun is unchanged elsewhere.
Requirements affected: OPS001, OPS002, INT002, INT005. Documents affected: CI_CD, OPERATIONS, package.json, workflows.
Overrides: BUILD.md standing law 9 (Bun preferred) for this repository only, by Fred's explicit choice.

### F004 Analytics is Cloudflare Web Analytics
Date: 2026-07-11. Source: owner interview round 1, question 4.
Decision: Cloudflare Web Analytics beacon in production only. No cookies, no consent banner, no session replay, no fingerprinting, no simulation parameters as identifiers.
Reason: free, cookieless, fits the packet privacy posture and the existing Cloudflare stack.
Requirements affected: DATA003, INT006, SEC003 (CSP must permit the beacon). Documents affected: PRD, SECURITY_PLAN, CI_CD, ARCHITECTURE.
Overrides: none. Resolves packet open item Analytics.

## Intake rulings (from reconciliation, overridable by Fred)

### R001 Documentation tree mapping
Date: 2026-07-11. Source: conflict C002 reconciliation.
Decision: the BUILD.md uppercase planning set (DECISIONS, PRD, GATES, EXECUTION_PLAN, ARCHITECTURE, DATA_MODEL, ART_DIRECTION, INTERACTION_SPEC, CI_CD, OPERATIONS, SECURITY, SECURITY_PLAN, TEST_PLAN, ACCESSIBILITY, RISKS, PENDING) is canonical. Manifest lowercase duties fold into it: decision_log into DECISIONS, architecture into ARCHITECTURE, art_direction into ART_DIRECTION, accessibility into ACCESSIBILITY, testing_strategy into TEST_PLAN, threat_model into SECURITY_PLAN, operations into OPERATIONS. simulation_model.md, scientific_assumptions.md, deployment.md, and adr/ remain as additional discipline documents.
Reason: one documentation tree, no duplicate authorities.
Requirements affected: all. Documents affected: docs/ tree. Overrides: manifest naming (S5).

### R002 Interview protocol
Date: 2026-07-11. Source: conflict C003 reconciliation.
Decision: BUILD.md interview protocol governs. The packet's 170 questions are the candidate set. Material decisions go to interview rounds of at most four questions, everything else receives a recorded default ruling, unsafe defaults go to PENDING with executable fallbacks.
Reason: Fred answers a compact set of material questions, the build never stalls on reversible preferences.
Requirements affected: none directly. Documents affected: DECISIONS, PENDING. Overrides: packet response method (S1).

### R003 Cloudflare Pages project name is filter
Date: 2026-07-11. Source: conflict C004 reconciliation, preflight collision check clean.
Decision: Pages project filter, production branch main, custom domain filter.nixfred.com. GitHub repository nixfred/filter.
Reason: the packet is explicit, the name is free, the custom domain hides the pages.dev name in practice. Diverges from the fleet name-nixfred-com convention knowingly.
Requirements affected: INT001, INT003. Documents affected: CI_CD, deployment, wrangler.jsonc. Overrides: fleet convention.

### R004 Gate vocabulary
Date: 2026-07-11. Source: conflict C005 reconciliation.
Decision: BUILD.md G gates are canonical. Packet phase mapping: packet 0 into G0, 1 into G1, 2 into G2, 3 into G3, 4 into G4 and G5, 5 into G6, 6 into G7 and G-LAUNCH.
Reason: one phase vocabulary, tags use gate/GN-YYYYMMDD.
Requirements affected: REL001. Documents affected: EXECUTION_PLAN, GATES. Overrides: packet phase numbering.

### R005 Search indexing on at launch, previews never indexed
Date: 2026-07-11. Source: safe default, packet Q156 and section 8.
Decision: production robots policy allows indexing from launch. Preview deployments always send noindex.
Reason: public educational site, no reason to hide, reversible in one commit.
Requirements affected: REL004, SEC008. Documents affected: CI_CD, SECURITY_PLAN, public/robots.txt, public/_headers.

### R006 No PWA install and no offline mode in v1
Date: 2026-07-11. Source: safe default, packet Q160 and Q161.
Decision: a web manifest ships for icons and metadata, but no service worker, no offline claim, no install promotion in v1.
Reason: offline caching of a WebGL simulation adds risk without launch value, additive later.
Requirements affected: REL005. Documents affected: PRD, ARCHITECTURE.

### R007 No sound in v1
Date: 2026-07-11. Source: safe default, packet section on sound (directive Phase 4 item 5, Q99 to Q103).
Decision: the first release ships silent. Sound is a post launch candidate and must begin muted until user activation if added.
Reason: the packet itself orders sound only after the silent experience is complete.
Requirements affected: FR035 (deferred). Documents affected: PRD, INTERACTION_SPEC.

### R008 Six main controls, self destruction inside survival
Date: 2026-07-11. Source: safe default, packet 02 configuration state and Q57.
Decision: the basic panel exposes six controls: life emergence, intelligence emergence, technological transition, long term survival, detectable communication, interstellar expansion. Self destruction is expressed through the survival control. Advanced settings may split hazard categories.
Reason: the packet's own primary listing is six, the advanced panel preserves depth, reversible.
Requirements affected: FR001, FR003. Documents affected: PRD, INTERACTION_SPEC, simulation_model.

### R009 No warfare in v1
Date: 2026-07-11. Source: packet recommendation Q43.
Decision: the first release models survival and contact only. No combat, no invasion mechanics. Expanding civilizations do not attack inhabited systems, interaction is abstracted.
Reason: packet recommendation, keeps the model and copy honest.
Requirements affected: FR016, FR021. Documents affected: simulation_model, PRD.

### R010 Replay from the beginning, no arbitrary rewind in v1
Date: 2026-07-11. Source: packet recommendation Q66.
Decision: runs can be replayed from time zero with the same seed. No timeline scrubbing backwards in v1.
Reason: packet recommendation, determinism makes replay exact, rewind requires state snapshots that can come later.
Requirements affected: FR004. Documents affected: PRD, INTERACTION_SPEC, ARCHITECTURE.

### R011 Automatic production deploy on green main
Date: 2026-07-11. Source: safe default, packet Q136, standing law ship when green.
Decision: merging to main with all required checks green deploys production automatically. No manual environment approval gate in v1.
Reason: solo maintainer, protection lives in the required checks, reversible by adding an environment approval rule.
Requirements affected: INT002, OPS005. Documents affected: CI_CD, OPERATIONS.

### R012 Previews protected by Cloudflare Access
Date: 2026-07-11. Source: packet section 8 preview access policy, Fred has not approved public previews.
Decision: preview deployments are protected with Cloudflare Access until Fred explicitly opens them. See PENDING P001.
Reason: the packet permits public previews only with Fred's approval, Access is its stated fallback.
Requirements affected: SEC008, SEC010. Documents affected: CI_CD, SECURITY_PLAN, deployment.

### R013 No public gallery, no feedback endpoint, no server logic in v1
Date: 2026-07-11. Source: packet baseline 10 and Q123 to Q127.
Decision: no Pages Functions, no KV, no D1, no R2, no forms. Shared scenarios exist only in the URL.
Reason: packet baseline, smallest attack surface, additive later.
Requirements affected: FR036 (deferred), INT004, DATA001. Documents affected: ARCHITECTURE, wrangler.jsonc, SECURITY_PLAN.

### R014 No Earth reference in v1
Date: 2026-07-11. Source: safe default, packet Q47 and Q48.
Decision: the galaxy is abstract, time starts at an abstract year zero, humanity is not simulated and Earth is not marked.
Reason: avoids implying the model predicts humanity's fate, keeps copy honest, additive later as a highlighted observer mode.
Requirements affected: FR016, UX003. Documents affected: simulation_model, scientific_assumptions, PRD.

### R015 Semantic application versions, separate simulation model version
Date: 2026-07-11. Source: packet section 20 and Q149, standing law 6.
Decision: application releases use semantic tags starting v1.0.0. The simulation model carries its own integer version inside the share URL schema. Both are visible in the About panel with the deployed commit.
Reason: shared URLs must state which model produced them, app releases move faster than model changes.
Requirements affected: OPS009, DATA001, REL003. Documents affected: simulation_model, ARCHITECTURE, OPERATIONS.

### R016 Footer identity and links
Date: 2026-07-11. Source: safe default, packet Q9 to Q12, standing law 7.
Decision: footer credits NixFred, links to nixfred.com and to the public repository, shows the visible version identifier. No experimental badge, the version and assumptions page carry that weight.
Reason: standing law requires the links, matches the fleet.
Requirements affected: REL007, OPS009. Documents affected: PRD, ART_DIRECTION.

### R017 Copy tone is occasional dry wit
Date: 2026-07-11. Source: safe default, packet copy voice section and Q104.
Decision: scientifically literate, calm, direct, occasionally dry. No dark humor about extinction beyond the packet's own register, no triumphal or nihilistic claims, banned examples per packet (epic empires, proves humanity is alone). No em or en dashes anywhere in copy.
Reason: the packet's sample copy already establishes this voice and it matches the Larry and LABS voice.
Requirements affected: UX003. Documents affected: ART_DIRECTION, content copy.

### R018 Scientific model defaults
Date: 2026-07-11. Source: packet recommendations Q26, Q28, Q29, Q37, Q38, Q45.
Decision: grounded educational model. Representative simulated population with documented weighting behind a larger decorative starfield. Simple controls map to a hidden blend of transition probabilities, waiting times, and hazard rates, with the exact mapping explained in the advanced panel. Signals obey light travel time. Signals in transit persist after sender extinction. Default run horizon 10 billion years with selectable alternatives.
Reason: packet recommendations, coherent and teachable.
Requirements affected: FR016 to FR023, FR026. Documents affected: simulation_model, scientific_assumptions, PRD.

### R019 Contact definition in v1
Date: 2026-07-11. Source: safe default, packet Q39.
Decision: v1 counts contact as reception of a detectable signal by a civilization capable of recognizing it, computed through causal overlap. Travel overlap is tracked and reported separately. Multiple selectable contact definitions are a post v1 candidate.
Reason: one honest definition keeps the report legible, the ledger still distinguishes signal and travel overlap.
Requirements affected: FR022, FR009. Documents affected: simulation_model, PRD.

### R020 Art direction is Observatory Elegy with Cosmic Atlas support
Date: 2026-07-11. Source: packet recommended blend, Q81.
Decision: Observatory Elegy for the live simulation, Cosmic Atlas treatment for education drawers, charts, and the Silence Report. All twelve visual traits from the packet bind, including no generic space photographs and no neon arcade treatment. Palette must remain color vision safe.
Reason: packet recommendation, distinct and coherent.
Requirements affected: UX001, UX005, UX006, ACC004. Documents affected: ART_DIRECTION, INTERACTION_SPEC.

### R021 Browser and device floor
Date: 2026-07-11. Source: safe default, packet Q153 and Q154.
Decision: supported browsers are the last two versions of Chrome, Edge, Firefox, and Safari, plus iOS Safari on iOS 16 and later. The mobile performance reference is a mid range 2021 class device. Older devices receive the fallback renderer, never a blank page.
Reason: matches real traffic for a LABS site, keeps budgets testable.
Requirements affected: NFR001, NFR008, FR030. Documents affected: TEST_PLAN, ARCHITECTURE, playwright.config.

### R022 Monte Carlo batch runs deferred
Date: 2026-07-11. Source: scope control, packet Q52 and Q53.
Decision: v1 presents single runs with exact replay. Batch statistics across many seeds (contact frequency, uncertainty bands) are deferred, and copy must never present one run as representative.
Reason: batch mode multiplies worker and reporting complexity, the honesty requirement is handled by copy and the assumptions page.
Requirements affected: FR034 (deferred), UX003. Documents affected: PRD, simulation_model.

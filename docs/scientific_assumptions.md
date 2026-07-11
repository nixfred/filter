# SCIENTIFIC ASSUMPTIONS

Honest accounting of what The Great Filter (filter.nixfred.com) models, separated into four categories, per BR003's scientific honesty requirement and ruling R014's abstract, non predictive framing. This document is the companion the application's own education drawers and assumptions page draw from (FR012), and every simulation mechanic it discusses is specified in full in docs/simulation_model.md.

No modeling assumption in this document, or in the application itself, is presented as established fact. The application models possibilities. It does not claim to solve the Fermi paradox, and no run may be presented as predicting humanity's outcome, per ruling R014's decision not to include an Earth reference in v1.

## 1. Educational facts

Ideas the application is built on top of, described honestly rather than pinned to a specific citation the specialist cannot verify with confidence, per docs/CHARTER_COMMON.md's no fabrication rule.

1. **The Fermi paradox.** The informal observation, attributed to physicist Enrico Fermi in conversation, that if intelligent, technological life is common in the galaxy, some trace of it should already be evident, and yet none has been confirmed. This is a real, widely discussed idea in astrobiology and physics, described here without a pinned citation since a specific source cannot be confirmed with confidence.
2. **The Great Filter concept.** The idea, associated with economist Robin Hanson, that some step between non living matter and a civilization capable of expanding across space is disproportionately difficult to pass, which would explain the absence of observed extraterrestrial civilizations. Described here without a pinned citation for the same reason as above.
3. **The Drake equation.** A framework, associated with astronomer Frank Drake, for decomposing the expected number of communicating civilizations in the galaxy into a product of independent factors such as star formation rate, the fraction of stars with planets, and the fraction of those where life, then intelligence, then technology, then communication each arise. The application's state machine in docs/simulation_model.md section 2 is inspired by this decomposition but is not a direct implementation of it, a distinction recorded in section 2 below.
4. **The speed of light as a causal limit.** Under special relativity, no information or physical influence can propagate faster than the speed of light. This is an established physical fact, and it is the basis for the light travel and detection model in docs/simulation_model.md section 5.
5. **No complete galactic star catalog exists.** Real astronomical surveys have cataloged a small fraction of the roughly one hundred billion stars believed to exist in the Milky Way, and most known exoplanets come from indirect detection methods applied to a limited sample. This is an established observational limitation, and it is part of the honest justification for the representative population approach in section 2 below, rather than an attempt to simulate a real star catalog.

## 2. Modeling assumptions

Choices this specific application makes about how to represent the ideas in section 1 as a working simulation. These are architecture and product decisions, not scientific findings, and BR003 requires that they never be presented as established fact.

1. **A discrete state machine represents civilizational development**, per docs/simulation_model.md section 2: candidate system, habitable world, life, complex life, intelligence, technology, detectable, interstellar, and the terminal states quiet, extinct, and transformed. Real biological and civilizational development almost certainly does not proceed through cleanly separated discrete stages; this structure is chosen for legibility and teachability, matching packet 02's own instruction to use a conditional transition and hazard model rather than a single dice roll per star.
2. **Six main controls (ruling R008) each drive a hidden blend of probability, waiting time, and hazard rate parameters**, specified in docs/simulation_model.md sections 2 and 3. The specific transitions each control drives, and the specific default values in docs/DATA_MODEL.md section 1.1, are this application's design choice, not a consensus estimate from any field.
3. **A representative population, weighted by a documented density profile, stands in for the full galaxy** (docs/simulation_model.md section 7), with a much larger, non simulated decorative starfield providing visual scale. This keeps the simulation computable at the speeds FR024 requires; it is a deliberate sampling and performance choice, not a claim that the visible starfield reflects a real stellar census.
4. **Contact requires causal overlap of a recognizable signal, computed as defined in ruling R019** (docs/simulation_model.md section 10), rather than any of the other contact definitions astrobiology literature discusses. Ruling R019 itself records that other contact definitions remain a possible post v1 addition.
5. **An abstract, non calendar time origin and no Earth reference**, per ruling R014, so that no run implies a forecast about humanity's own trajectory.

## 3. Simplifications

Places where a more detailed or more realistic model exists in principle, and this application deliberately uses a simpler mechanism instead, generally to keep the simulation legible, computable in a Web Worker (FR018), and explainable in a one sentence control summary (FR002).

1. **Binary distance and strength based detection threshold** (docs/simulation_model.md section 5) in place of a continuous signal processing or noise floor model.
2. **No interstellar warfare or civilizational conflict of any kind**, per ruling R009. Expansion never removes, damages, or alters another civilization's state; overlap is recorded, not resolved.
3. **A single effective sub light expansion speed per civilization** (docs/simulation_model.md section 6) in place of a variable propulsion technology curve, fleet logistics, or generational ship modeling.
4. **A conditional transition and hazard chain in place of Drake style independent multiplication.** Each transition's probability and timing can depend on the state the system is already in, which is more coherent than treating every factor as an independent multiplier applied to every star simultaneously, but it is still a simplified chain, not a full causal model of biological or social development.
5. **A representative population sample rather than a full per star simulation** (docs/simulation_model.md section 7), bounded to keep worker computation and message payload sizes tractable across a ten billion year default horizon (ruling R018).
6. **No galactic dynamics.** Star systems do not move, collide, or migrate within a run; galactic coordinates assigned at generation time are fixed for the run's duration.
7. **A single galaxy, no satellite galaxies or intergalactic scope.** The simulated volume is one abstract galaxy disc, not a broader cosmological setting.
8. **Discrete emission and detection windows rather than continuous signal evolution.** A civilization's detectable window has one strength value and one duration, rather than a signal whose character changes over the civilization's technological history.

## 4. Speculative choices

Choices with no strong grounding in any established estimate, included because the application needs a concrete default or a concrete mechanic to function, and flagged here so they are never mistaken for a researched consensus.

1. **The specific default values for the six main controls** (docs/DATA_MODEL.md section 1.1: 0.5, 0.4, 0.5, 0.5, 0.5, and 0.3). These are chosen as legible, roughly neutral starting points for a first run, not as estimates of real astrobiological probabilities.
2. **The existence and behavior of the `transformed` terminal state** (docs/simulation_model.md section 2.1). This state is a deliberate placeholder for civilizational futures beyond what the model attempts to describe, such as a civilization choosing to stop broadcasting or changing in ways the model has no mechanic for; it is not a prediction about what advanced civilizations actually do.
3. **The default `survivalHazardSplit` weighting between self destruction, external hazard, and the transformed outcome** (docs/DATA_MODEL.md section 1.2). No consensus estimate exists for this split; the default is chosen to keep all three outcomes reachable in a typical run rather than to reflect a researched ratio.
4. **The choice of an exponential, constant hazard model for extinction and waiting times** (docs/simulation_model.md sections 3.1 and 3.2), rather than a time varying hazard such as a Weibull distribution that could represent civilizations becoming more or less fragile as they age. The exponential model is chosen for its clean, deterministic, fixed point implementable sampling, described in docs/simulation_model.md section 3.3, not because civilizational risk is known to be constant over time.
5. **The specific default expansion launch delay, settlement delay, and effective speed** (docs/DATA_MODEL.md section 1.2). These govern the pace of the frontier in docs/simulation_model.md section 6 and are chosen for a legible, watchable expansion animation at the application's speed steps (FR024), not derived from any propulsion feasibility study.
6. **The density profile used to generate the representative population's positions** (docs/simulation_model.md section 7). It is chosen to visually and statistically resemble a spiral galaxy's density gradient, not fit to any specific real survey data.

## 5. How this document is used in product

FR012 requires an assumptions and limitations drawer and a sources drawer. That copy must draw its claims from section 1 above without overstating them, must present every item in sections 2 through 4 as a stated choice rather than a fact, and must never claim the application proves or disproves anything about the real Fermi paradox, per BR003. The Silence Report's generated headline sentence (FR009) and the most restrictive transition metric (docs/simulation_model.md section 12) describe only what happened in that one run under that one parameter set, never a general claim about the universe, consistent with ruling R022's instruction that no run is presented as statistically representative.

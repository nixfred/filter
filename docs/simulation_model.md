# SIMULATION MODEL

The conditional transition and hazard model for The Great Filter (filter.nixfred.com). This document implements FR016 through FR027, FR033, and rulings R008, R009, R010, R014, R018, R019, R022, honoring the floating point hazard rule from docs/CHARTER_COMMON.md. It is the mathematical companion to docs/DATA_MODEL.md, which defines the field level schema for the entities referenced here, and to docs/ARCHITECTURE.md section 6, which defines the determinism strategy this model must satisfy.

## 1. Purpose

Packet 02 recommends a conditional transition and hazard model rather than treating each of the six main controls as a direct percentage of all stars. This document specifies that model precisely enough to implement, test, and reproduce.

## 2. State machine

Every representative star system (docs/DATA_MODEL.md section 2.1) begins as a candidate system. A civilization record (docs/DATA_MODEL.md section 2.2) exists once a system enters the habitable world state, and progresses through the states below, satisfying FR016.

### 2.1 States

```text
candidate_system
  -> habitable_world
       -> life
            -> complex_life
                 -> intelligence
                      -> technology
                           -> detectable
                                -> interstellar
```

Terminal states, reachable from more than one point in the chain above:

```text
quiet          reachable from: technology, detectable
extinct        reachable from: any of life, complex_life, intelligence, technology, detectable, interstellar
transformed    reachable from: interstellar only, after sustained settlement
```

`quiet` and `transformed` are non hazard, soft terminal states: the civilization survives in the sense that no extinction event fired, but the simulation stops modeling further detectable activity for it. `extinct` is the only hard terminal state, and it is the only state that halts the civilization's own future transitions. Docs/scientific_assumptions.md records `transformed` explicitly as a speculative modeling choice, since it stands in for civilizational futures the model does not attempt to describe in detail.

A candidate system that never transitions past `candidate_system` or `habitable_world` within the run horizon produces no civilization record at all; it is counted only in the `candidateWorldCount` and, if it reached habitability, contributes to the denominator of the habitable world to life transition's realized pass rate used in section 12.

### 2.2 Transition table

| Transition | Primary control (docs/DATA_MODEL.md section 1.1) | Governing mechanism |
|---|---|---|
| `candidate_system -> habitable_world` | none directly, background rate with a minor secondary blend from `lifeEmergence` | probability plus waiting time |
| `habitable_world -> life` | `lifeEmergence` | probability plus waiting time |
| `life -> complex_life` | none directly, background rate with a minor secondary blend from `intelligenceEmergence` | probability plus waiting time |
| `complex_life -> intelligence` | `intelligenceEmergence` | probability plus waiting time |
| `intelligence -> technology` | `technologicalTransition` | probability plus waiting time |
| `technology -> detectable` | `detectableCommunication` | probability plus waiting time |
| `technology -> extinct`, `detectable -> extinct`, `interstellar -> extinct` | `longTermSurvival` | continuous hazard rate |
| `detectable -> interstellar` | `interstellarExpansion` | probability plus waiting time, plus the expansion model in section 6 |
| `technology -> quiet`, `detectable -> quiet` | derived, not directly controlled | waiting time only, fires when the detectable window in section 5 closes without a prior transition to `interstellar` or `extinct` |
| `interstellar -> transformed` | derived from `longTermSurvival` and the expansion model | waiting time only, a long duration threshold documented in `src/simulation/hazards.ts` |

## 3. Probability, waiting time, and hazard rate mechanics (ruling R018 hidden blend)

Each transition in section 2.2 is one of two mechanical shapes, unifying the three mathematical mapping classes named in ruling R018 and docs/DATA_MODEL.md section 1.1 into one coherent model:

### 3.1 Eligibility and waiting time transitions

Used for every progression transition (`candidate_system -> habitable_world` through `detectable -> interstellar`). When a system enters the origin state, the engine makes one deterministic Bernoulli draw from `rng.ts` against that transition's probability parameter, deciding whether the system is eligible to ever make that transition. If eligible, the engine immediately draws a waiting time from an exponential distribution parameterized by that transition's mean, and schedules the transition event at `originStateEntryYear + waitingTime`. If not eligible, no event is ever scheduled for that transition, and the system remains in its origin state for the rest of the run unless a hazard transition (section 3.2) or a derived transition (section 2.2's `quiet` and `transformed` rows) applies instead.

This is why each control's mapping class is described as a blend of probability and waiting time in docs/DATA_MODEL.md: the probability answers whether a transition ever happens for a given system, and the waiting time answers when, given that it does.

### 3.2 Continuous hazard transitions

Used for the extinction transitions out of `technology`, `detectable`, and `interstellar`. Rather than a single eligibility roll, the engine treats extinction as a constant hazard Poisson process for as long as a civilization remains in one of these three states: at state entry, the engine draws a waiting time to hazard event from an exponential distribution parameterized by the current hazard rate (itself set by `longTermSurvival`, or by `transitionOverrides` and `survivalHazardSplit` under advanced settings), and schedules a candidate extinction event at that time. If the civilization transitions to a different state before that time arrives, the pending hazard event is cancelled and a new one is drawn for the new state, since the hazard rate can differ between `technology`, `detectable`, and `interstellar`.

### 3.3 Deterministic sampling without transcendental functions

Sampling a waiting time from an exponential distribution ordinarily uses the inverse CDF, `-ln(1 - u) / rate`, which requires a natural logarithm. Per the floating point hazard rule, `Math.log` is not used inside `src/simulation/`. Instead, `src/utils/math.ts` implements a fixed point logarithm approximation (a documented polynomial or table based approximation operating entirely on scaled integers) used by every waiting time draw in sections 3.1 and 3.2, so that two different browser engines produce bit identical waiting times from the same RNG output. This function, its accuracy bound, and its test coverage are documented alongside `rng.ts` in the codebase; this document records the requirement, and docs/ARCHITECTURE.md section 6 records the architectural rule it satisfies.

## 4. Event driven scheduling (FR025)

`engine.ts` owns a single priority queue ordered by scheduled abstract year, ties broken by a fixed, deterministic secondary key (system ID, then transition ID), never by insertion order or object iteration order. Every event carries a `causeEventId` reference (docs/DATA_MODEL.md section 2.5), which is either `null` for the run's own start milestone or the ID of the event that caused it to be scheduled, such as a state entry event scheduling that state's own waiting time draw.

Processing proceeds strictly in queue order: dequeue the earliest scheduled event, apply its effect (which may itself schedule new future events, per sections 3.1 and 3.2), record it in the event log, and repeat until the queue is empty or the run horizon is reached. Because RNG draws happen exactly once per scheduled eligibility check or waiting time sample, and always in this same queue order, two runs with the same seed and scenario draw from the RNG in the same sequence regardless of engine, satisfying FR017 together with the digest definition in docs/DATA_MODEL.md section 3. This ordering is also what the property test suite verifies directly: no event ever has a scheduled year earlier than its cause event's year.

## 5. Light travel and detection model (FR019, FR020)

Distance is measured in light years and time in years, so that the causal speed constant is exactly 1 light year per year by construction, avoiding any unit conversion step that could introduce floating point drift. A future release could expose an alternate causal speed as an advanced parameter; v1 fixes it at this value.

When a civilization enters the `detectable` state, the engine creates one `Signal` record (docs/DATA_MODEL.md section 2.3) with `originPosition` fixed at the civilization's host system position, `emissionStartYear` equal to the state entry year, and `emissionEndYear` set by the detectable window duration drawn under section 3.1's `technology -> detectable` waiting time mechanics (the same draw also sets the window's onset delay and duration, per docs/DATA_MODEL.md section 1.1's description of the `detectableCommunication` control's secondary blend).

A signal's detection front is the set of points exactly `distance = elapsedYearsSinceEmissionStart` light years from `originPosition`, for `elapsedYearsSinceEmissionStart` between 0 and the signal's total emitted duration. A receiving system at distance `d` from `originPosition` can be reached by the front only during the window `[emissionStartYear + d, emissionEndYear + d]`, which is how the model expresses that detection depends on distance as well as on strength and duration (FR019).

Detection at a given receiving civilization requires all of:

1. The receiving civilization is in a state capable of recognition, `technology` or later, and has not yet transitioned to `extinct`.
2. The receiving civilization's qualifying state window in time overlaps the signal's arrival window `[emissionStartYear + d, emissionEndYear + d]` at its distance `d`.
3. The signal's `strength`, combined with `d`, meets or exceeds `detectionRecognitionThreshold` (docs/DATA_MODEL.md section 1.2), evaluated through a documented monotonic falloff function in `light_cone.ts` so that greater distance requires greater strength to still register as a detection.

**Posthumous persistence (FR020).** A signal's detection front depends only on its own recorded `emissionStartYear`, `emissionEndYear`, `strength`, and `originPosition`. It does not depend on `sourceCivilizationId`'s current state at all. A source civilization that has since transitioned to `extinct` still has a signal in transit that remains fully detectable under the same rules, exactly as if it were still active, which is the mechanism by which the model honors FR020 without any special case code.

## 6. Expansion model (FR021, ruling R009)

When a civilization enters the `interstellar` state, the engine creates one `ExpansionFrontier` record (docs/DATA_MODEL.md section 2.4). `originYear` is the state entry year. After `launchDelayYears` elapses, the frontier begins moving outward from the host system at `effectiveSpeedFractionC` light years per year (a configured sub light speed, always strictly less than the causal speed in section 5). A candidate system is reached by the frontier at `originYear + launchDelayYears + distance / effectiveSpeedFractionC`, and is recorded as settled `settlementDelayYears` after the frontier reaches it, appended to `settledSystemIds` in reach order.

Per ruling R009, no warfare exists in this model. If the frontier's radius reaches a system that already independently hosts its own civilization record, no removal, combat, or override of that civilization's state occurs. Instead, the engine schedules a `TravelOverlapEvent` (docs/DATA_MODEL.md section 2.5), which is counted in `travelOverlapCount` and is explicitly distinct from `ContactEvent`, per ruling R019's instruction that the ledger tracks and reports travel overlap separately from confirmed contact. Settled systems are removed from the pool of systems eligible for their own independent candidate system generation in any future run extension, since they are now understood to be part of the expanding civilization rather than an independently originating one; in v1's single population generation at run start, this affects only bookkeeping, not generation order.

## 7. Representative population weighting (FR023)

The simulation individually computes outcomes only for `representativePopulationSize` candidate systems (docs/DATA_MODEL.md section 1.2), not for every visual star the renderer draws. This keeps the ten billion year default horizon computable at the high speed multipliers in section 8, and keeps the worker's memory and message payload sizes bounded regardless of how dense the decorative starfield looks.

Systems are generated at run start using a documented, simplified density profile over the abstract galaxy disc coordinates (docs/DATA_MODEL.md section 2.1), weighted so that system density falls off with distance from the disc center in a way that visually and statistically resembles a spiral galaxy's stellar density gradient. This profile is a deliberate simplification, not a fit to any specific real star catalog, and is documented as such in docs/scientific_assumptions.md. `habitabilityWeight` per system is drawn from this same generation step and is available to `probability.ts` as a per system modifier on the `candidate_system -> habitable_world` transition described in section 2.2.

The renderer's decorative starfield, drawn by `galaxy_layer.ts`, is a separate, much larger set of points with no simulation state at all, existing purely to convey scale (docs/ARCHITECTURE.md section 2.5). No UI copy or education drawer content may describe the decorative starfield as individually simulated, since doing so would violate BR003's scientific honesty requirement.

## 8. Time model

### 8.1 Abstract year zero (ruling R014)

Simulated time begins at `abstract_year = 0` at the start of every run. No run ties this origin to any real calendar date, and no run marks a system as Earth or a civilization as humanity, per ruling R014's instruction that the galaxy remains abstract in v1.

### 8.2 Default horizon (ruling R018)

`runHorizonYears` defaults to ten billion years, with selectable alternatives exposed under advanced settings (docs/DATA_MODEL.md section 1.2). A run ends when the event queue empties before the horizon, when the horizon year is reached, or when the visitor stops the run early; all three cases produce a `RUN_COMPLETE` message and a Silence Report (FR009).

### 8.3 Internal representation

Internally, `abstract_year` is stored as a fixed point integer at a documented sub year resolution (for example, whole simulated time units per year, defined once in `src/utils/time.ts`), never as an accumulating floating point value, so that repeated addition across a ten billion unit range cannot drift, per the determinism strategy in docs/ARCHITECTURE.md section 6.

### 8.4 Accelerated time and speed steps (FR024)

The event driven queue in section 4 has no inherent relationship to wall clock time; the worker can process the entire queue for a bounded population at whatever rate the host machine allows, with no wall clock pacing applied inside the engine itself. Speed control is therefore a playback pacing concern owned by `simulation_store.ts`, not a simulation core concern:

| Speed step | Meaning |
|---|---|
| Pause | No events are released to `EVENT_BATCH` delivery, though the worker may continue computing ahead up to its backpressure limit (docs/ARCHITECTURE.md section 3.3) |
| Normal (1x) | `simulation_store` paces delivery so that a documented number of simulated years advance per real second, chosen so early, low activity periods do not feel motionless and later, high activity periods remain legible |
| 10x, 100x, 1000x | Each step multiplies the normal pacing's simulated years per real second |
| Maximum | The worker computes and delivers the remainder of the run at the maximum rate the backpressure limit in docs/ARCHITECTURE.md section 3.3 allows, sending periodic `PROGRESS` messages (docs/ARCHITECTURE.md section 3.2) instead of pacing for legibility, effectively jumping ahead to `RUN_COMPLETE` |

Because pacing is entirely a delivery concern, the underlying event sequence, and therefore the run digest, is identical regardless of which speed steps a visitor chooses during playback, satisfying FR017 without requiring the digest computation to account for playback speed at all.

## 9. Simulation model versioning (ruling R015)

`src/simulation/model_version.ts` exports a single integer `SIMULATION_MODEL_VERSION`. It is incremented whenever a change to this document's state machine topology, transition mechanics, RNG algorithm, or default parameter semantics could change the output digest for a previously identical scenario. It is never incremented for a change that only affects rendering, copy, or UI behavior. The version travels with every scenario (docs/DATA_MODEL.md section 1 and section 4) and is displayed in the About panel alongside the application's semantic version and the deployed commit, per ruling R015 and OPS009. A digest is only compared against another digest computed under the same model version, as stated in docs/DATA_MODEL.md section 3.

## 10. Contact definition (ruling R019, FR022)

A `ContactEvent` fires only when a `DetectionEvent` (section 5) occurs against a receiving civilization that is itself in a recognition capable state, `technology` or later, and not yet `extinct`. Two civilizations existing at overlapping abstract years alone, with no signal ever crossing the distance between them within its detectable window, never produces a `ContactEvent`, satisfying FR022's rule that simultaneous existence alone is never contact. This is the only contact definition implemented in v1; ruling R019 records multiple selectable contact definitions as a post v1 candidate. Travel overlap, defined in section 6, is computed independently and reported as its own metric, never merged into `confirmedContactCount`.

## 11. No warfare (ruling R009)

No transition, event type, or expansion mechanic in this document allows one civilization's state, signals, or frontier to alter another civilization's state. `TravelOverlapEvent` and `ContactEvent` are both purely observational records. Extinction is caused only by a civilization's own hazard draw (section 3.2), never by another civilization's expansion or communication activity.

## 12. Great Filter attribution, the most restrictive transition metric

For a completed run, `metrics.ts` computes, for every transition in section 2.2 that has a defined origin state, a realized pass rate: the count of systems or civilizations that completed the transition, divided by the count that ever entered the transition's origin state. The transition with the lowest realized pass rate across the whole run is reported as `mostRestrictiveTransitionId` (docs/DATA_MODEL.md section 2.6, metric 15). Ties are broken deterministically by earliest transition in the section 2.1 ordering, so the same scenario and seed always attribute the same transition, keeping this metric part of the run digest's metrics payload.

This metric is a descriptive statistic about one run's realized outcomes under one parameter set, computed after the fact from what actually happened in the representative population. It is never presented as a claim about which transition constitutes the real Great Filter in nature; docs/scientific_assumptions.md records that distinction explicitly, per BR003.

## 13. Batch runs deferred (ruling R022)

This document describes single run mechanics only. Monte Carlo batches across many seeds, contact frequency distributions, and uncertainty bands are deferred (FR034), and no run in v1 is presented by application copy as statistically representative of the underlying parameter distribution, per ruling R022.

## 14. Cross references

Field level schema for every entity referenced here: docs/DATA_MODEL.md. Determinism strategy and the architectural rule against transcendental functions in determinism critical code: docs/ARCHITECTURE.md section 6. Rationale for the event driven worker and deterministic RNG design: docs/adr/0003_simulation_engine.md. Honest categorization of which parts of this model are established science versus modeling choice, simplification, or speculation: docs/scientific_assumptions.md.

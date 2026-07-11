# DATA MODEL

Data model for The Great Filter (filter.nixfred.com). This document implements FR001, FR002, FR003, FR008, FR009, FR016, FR017, FR023, FR026, FR027, FR033, DATA001, DATA002, DATA003, ruling R008, R015, R018, R019, and honors the floating point hazard rule from docs/CHARTER_COMMON.md. It is the field level companion to docs/simulation_model.md, which defines the mathematics that the schema and entity fields here participate in.

## 1. Versioned scenario schema

A `Scenario` is the complete, serializable input to a run: a schema version, a simulation model version, a seed, the six main control values, and an optional set of advanced parameter overrides. `src/simulation/schema.ts` validates every field, clamping or rejecting out of range or malformed input deterministically (SEC002), and `src/simulation/serialization.ts` is the only module permitted to turn a `Scenario` into the compact share encoding in section 4.

### 1.1 The six main controls (ruling R008)

Every control satisfies FR002: a plain language label, a one sentence explanation, a current value, a range explanation, a visible effect summary, and a mathematical detail control that expands the row below. The table gives the architecture level contract; the exact transition mechanics each control drives are defined in docs/simulation_model.md section 3.

| Control ID | Title | Type | Unit or effective interpretation | Range | Default | Mapping class |
|---|---|---|---|---|---|---|
| `lifeEmergence` | Life emergence | continuous slider, stored as `uint16` scaled 0 to 65535 | Probability that a habitable world hosts an independent origin of life | 0.0 to 1.0 (shown as 0% to 100%) | 0.5 | Probability, primary driver of the habitable world to life transition, minor secondary blend into the candidate system to habitable world transition |
| `intelligenceEmergence` | Intelligence emergence | continuous slider, `uint16` scaled | Probability that complex life develops intelligence, conditioned on complex life already existing | 0.0 to 1.0 | 0.4 | Probability, primary driver of complex life to intelligence, secondary blend scales the mean waiting time of life to complex life |
| `technologicalTransition` | Technological transition | continuous slider, `uint16` scaled | Probability that an intelligent species develops technology capable of eventual detectability | 0.0 to 1.0 | 0.5 | Probability, primary driver of intelligence to technology |
| `longTermSurvival` | Long term survival | continuous slider, `uint16` scaled | Inverse of the annual hazard of self destruction or terminal external hazard once a civilization is technological. Self destruction is expressed through this control per ruling R008, not as a separate control | 0.0 (near certain early collapse) to 1.0 (near indefinite persistence) | 0.5 | Hazard rate, attenuates the baseline extinction hazard applied across the technology, detectable, and interstellar states |
| `detectableCommunication` | Detectable communication | continuous slider, `uint16` scaled | Probability that a technological civilization becomes detectable, blended with the onset delay and duration of its detectable window | 0.0 to 1.0 | 0.5 | Probability, primary driver of technology to detectable, secondary blend sets mean onset delay and mean window duration |
| `interstellarExpansion` | Interstellar expansion | continuous slider, `uint16` scaled | Probability that a detectable civilization begins interstellar expansion, blended with its effective sub light expansion speed | 0.0 to 1.0 | 0.3 | Probability, primary driver of the transition into the interstellar state, secondary blend sets the default effective expansion speed used in docs/simulation_model.md section 6 |

The mapping class column follows R018: every simple control expresses a hidden blend of probability, waiting time, and hazard rate parameters, and the exact numeric blend is disclosed in the advanced settings panel through each control's mathematical detail expansion, never only in this document.

Default values are an architecture level choice, documented here for implementation stability, not an empirical claim. Their status as a modeling assumption is recorded in docs/scientific_assumptions.md.

### 1.2 Advanced parameters (FR003)

Collapsed by default. Advanced settings let a visitor split the hidden blend that ruling R008 permits, and expose parameters that the six main controls do not reach directly.

| Field | Type | Default | Purpose |
|---|---|---|---|
| `runHorizonYears` | enum of preset horizons plus custom `uint32` years | 10,000,000,000 (ten billion years, R018) | The abstract simulated year at which a run ends if no stop condition fires earlier |
| `representativePopulationSize` | `uint32`, bounded by a documented maximum for worker performance | implementation defined, documented in docs/simulation_model.md section 7 | Count of individually simulated candidate systems (FR023), independent of decorative starfield density which is a renderer only concern |
| `transitionOverrides` | sparse map of transition ID to `{ probability?, waitingTimeMeanYears?, hazardRatePerYear? }` | empty (all transitions use the blend derived from the six main controls) | Lets an advanced visitor split hazard categories per transition, satisfying ruling R008's allowance for advanced hazard splitting |
| `survivalHazardSplit` | `{ selfDestructionWeight, externalHazardWeight, transformationWeight }`, weights sum to 1.0 | a documented default split, recorded as a speculative choice in docs/scientific_assumptions.md | Divides the `longTermSurvival` hazard rate among self destruction, external hazard, and the soft transformed outcome described in docs/simulation_model.md |
| `detectionRecognitionThreshold` | float, `uint16` scaled 0 to 65535 | implementation defined, documented in docs/simulation_model.md section 5 | Minimum signal strength fraction required for a receiving civilization to recognize a signal as artificial, part of the contact definition under ruling R019 |
| `expansionEffectiveSpeedFractionC` | float, `uint16` scaled 0 to 65535, strictly less than 1.0 | derived from `interstellarExpansion` unless overridden | Overrides the blended default sub light effective expansion speed |
| `expansionLaunchDelayYears`, `expansionSettlementDelayYears` | `uint32` years | implementation defined | Overrides the default launch and settlement delays in the expansion model (FR021) |
| `rngSeed` | `uint32` pair (two values combining to a wider deterministic seed space) | generated at scenario creation | Direct seed entry, distinct from the primary Start, Replay, and Randomize seed controls in FR004, which operate on this same field |

Any advanced field left unset uses the value derived from the six main controls' hidden blend, so a scenario with no advanced overrides is fully described by the six main controls plus the run horizon and seed.

## 2. Entity models

### 2.1 Star system

A representative, individually simulated candidate system (FR023).

| Field | Type | Notes |
|---|---|---|
| `id` | `uint32` | Stable within a run, assigned in generation order |
| `position` | `{ radiusLy, angleRadians, armIndex, heightOffsetLy }` | Abstract galaxy disc coordinates, consumed by both the simulation's distance calculations and the renderer's layout, never a real star catalog reference (R014) |
| `habitabilityWeight` | float, `uint16` scaled | Documented sampling weight used when the representative population is generated, part of the FR023 weighting documentation |

### 2.2 Civilization

The unit that moves through the state machine defined in docs/simulation_model.md section 2 (FR016).

| Field | Type | Notes |
|---|---|---|
| `id` | `uint32` | Stable within a run |
| `hostSystemId` | `uint32` | References a star system |
| `currentState` | enum, one of the states in docs/simulation_model.md section 2 | Includes the terminal states quiet, transformed, extinct |
| `stateHistory` | ordered list of `{ state, atYear }` | Drives the event ledger (FR006), replay, and the Silence Report's longest lived and median lifetime metrics |
| `detectableWindow` | `{ startYear, endYear } \| null` | Present once the civilization has entered the detectable state |
| `frontierId` | `uint32 \| null` | References an expansion frontier once the civilization enters the interstellar state |
| `extinctionCause` | enum `{ selfDestruction, externalHazard, none }` `\| null` | Set only when `currentState` is `extinct`, feeds the most restrictive transition computation in docs/simulation_model.md section 12 |

### 2.3 Signal

Represents a detectable civilization's emission (FR019, FR020).

| Field | Type | Notes |
|---|---|---|
| `id` | `uint32` | Stable within a run |
| `sourceCivilizationId` | `uint32` | The emitting civilization, which may already be extinct (FR020, posthumous persistence) |
| `originPosition` | same shape as star system `position` | Fixed at emission time, independent of the source civilization's later state |
| `emissionStartYear`, `emissionEndYear` | `uint32` years | Defines the duration used in the detection radius calculation |
| `strength` | float, `uint16` scaled | Feeds the detection radius function in docs/simulation_model.md section 5 |

### 2.4 Expansion frontier

Represents an interstellar civilization's growth (FR021, R009).

| Field | Type | Notes |
|---|---|---|
| `id` | `uint32` | Stable within a run |
| `sourceCivilizationId` | `uint32` | The expanding civilization |
| `originYear` | `uint32` | The simulated year the civilization entered the interstellar state |
| `effectiveSpeedFractionC` | float, `uint16` scaled | From `expansionEffectiveSpeedFractionC` |
| `launchDelayYears`, `settlementDelayYears` | `uint32` | From the corresponding advanced parameters |
| `settledSystemIds` | ordered list of `uint32` | Systems the frontier has reached and, after the settlement delay, settled. No system is ever removed from another civilization's history by this process, per R009's no warfare rule |

### 2.5 Event types

Every event carries `{ id, atYear, causeEventId | null }`, enforcing the causal ordering invariant in FR025 and the property test rule that no event occurs before its cause.

| Event type | Payload beyond the common fields |
|---|---|
| `StateTransition` | `civilizationId, fromState, toState` |
| `SignalEmissionStart` / `SignalEmissionEnd` | `signalId` |
| `DetectionEvent` | `signalId, receivingCivilizationId` |
| `ContactEvent` | `signalId, sourceCivilizationId, receivingCivilizationId` (ruling R019 causal contact) |
| `TravelOverlapEvent` | `frontierId, sourceCivilizationId, overlappedCivilizationId` (tracked separately from `ContactEvent` per ruling R019) |
| `ExpansionLaunch` / `ExpansionSettlement` | `frontierId, systemId` |
| `ExtinctionEvent` | `civilizationId, cause` |
| `RunMilestone` | `label` (used for run start, run end, and horizon reached markers in the ledger) |

### 2.6 Run metrics, the fifteen Silence Report metrics

Field names for the packet 02 outcome state metrics list (FR009, FR027).

| # | Packet metric | Field |
|---|---|---|
| 1 | Candidate worlds | `candidateWorldCount` |
| 2 | Independent origins of life | `independentLifeOriginCount` |
| 3 | Intelligent species | `intelligentSpeciesCount` |
| 4 | Technological civilizations | `technologicalCivilizationCount` |
| 5 | Civilizations that became detectable | `detectableCivilizationCount` |
| 6 | Civilizations that disappeared | `disappearedCivilizationCount` |
| 7 | Civilizations active at the same time | `peakSimultaneousActiveCount` |
| 8 | Signal overlaps | `signalOverlapCount` |
| 9 | Travel overlaps | `travelOverlapCount` |
| 10 | Confirmed contacts | `confirmedContactCount` |
| 11 | Closest near miss in space | `closestNearMissDistanceLy` |
| 12 | Closest near miss in time | `closestNearMissTimeYears` |
| 13 | Longest lived civilization | `longestLivedCivilizationYears` |
| 14 | Median technological lifetime | `medianTechnologicalLifetimeYears` |
| 15 | Most restrictive transition | `mostRestrictiveTransitionId` |

`RunMetrics` also carries the generated `headline` sentence (FR009) and is the payload of the worker's `RUN_COMPLETE` message defined in docs/ARCHITECTURE.md section 3.2.

## 3. Run digest definition (FR017, FR033)

The run digest is the mechanism that proves determinism: the same seed, the same scenario, and the same simulation model version must produce the same digest.

**What is hashed.** A canonical, ordered record consisting of: the schema version, the simulation model version, the seed, every scenario field including resolved advanced overrides (so two scenarios that resolve to the same effective parameters produce the same digest even if one used an explicit override and the other relied on the derived default), the canonically ordered terminal state of every civilization (id, final state, final state entry year), the full ordered event log from section 2.5 in queue processing order, and the full `RunMetrics` structure from section 2.6. Hashing the full ordered event log, not only per type counts, is a deliberate choice made jointly with docs/TEST_PLAN.md section 3.2: fixture scenarios committed to `tests/fixtures/scenarios/` are deliberately small, so the added hashing cost is negligible in CI, and a full log catches a determinism regression that happens to preserve every aggregate count and every civilization's final state but reorders or retimes the events that produced them.

**How it is hashed.** Every numeric field is first converted to its canonical fixed point integer representation, the same representation used internally by the simulation core per the determinism strategy in docs/ARCHITECTURE.md section 6. These integers are written into a canonical byte buffer in a fixed, documented field order, never derived from object key iteration order. The buffer is reduced to a digest using a deterministic, non cryptographic hash implemented entirely in integer and bitwise arithmetic, such as FNV-1a, so that no engine provided transcendental or floating point formatting function participates in digest computation. The digest is rendered as a fixed length lowercase hexadecimal string for display in the Silence Report and for storage in `tests/fixtures/simulation_digests/`.

A digest is only meaningful when compared against another digest computed under the same simulation model version. Comparing digests across model versions is never attempted by the application, since a model version bump is defined, per ruling R015, as exactly the kind of change that may legitimately change output for previously identical inputs.

## 4. URL share encoding format (DATA001, ruling R015)

**Goal.** A compact, versioned, single query parameter encoding that reproduces model version, seed, and every scenario parameter exactly (FR008), with a documented migration path for older formats.

**Parameter.** `filter.nixfred.com/?s=<encoded>`, where `<encoded>` is a base64url string (RFC 4648 section 5 alphabet, no padding) of a packed binary buffer. Base64url is used rather than JSON so that the encoded value stays short enough to remain a share friendly URL and cannot contain characters that require additional URL escaping.

**Exact field layout, schema version 1.**

| Byte offset | Field | Type | Notes |
|---|---|---|---|
| 0 | `schemaVersion` | `uint8` | Always the first byte, selects the decoder before any other byte is interpreted |
| 1 to 4 | `simulationModelVersion` | `uint32`, little endian | From `src/simulation/model_version.ts` |
| 5 to 12 | `rngSeed` | two `uint32`, little endian | The seed pair from section 1.2 |
| 13 to 24 | six main controls | six `uint16`, little endian | In the fixed order of the table in section 1.1, each 0 to 65535 representing 0.0 to 1.0 |
| 25 | `advancedFlags` | `uint8` bitmask | One bit per advanced field group in section 1.2 indicating whether an override follows |
| 26 onward | advanced field values | variable, only the fields flagged in `advancedFlags`, in the fixed order of section 1.2 | Keeps the common case, no advanced overrides, at a fixed 26 byte payload before base64url encoding |
| final byte | `checksum` | `uint8`, a simple additive or CRC-8 checksum over the preceding bytes | Detects transcription or truncation corruption before the scenario ever reaches `schema.ts` validation, distinct from the run digest in section 3, which is computed after a run completes, not before one starts |

**Migration policy.** Every schema version has its own documented decoder in `src/simulation/serialization.ts`. Decoding proceeds by reading `schemaVersion`, selecting that version's decoder, and if the current application schema version is newer, applying that version's documented upgrade function to produce the next version's field set with documented defaults for any newly introduced field, repeating until the buffer is expressed in the current schema version. A `schemaVersion` newer than the application understands, or a buffer that fails checksum or bounds validation, fails closed: `url_state.ts` treats the link as absent rather than guessing, and `ui_store` falls back to the `localStorage` last scenario or the opening state, per SEC002's requirement that hostile or malformed URL input is rejected deterministically rather than partially trusted.

## 5. localStorage keys and policy (DATA002)

No cookies. No consent banner, consistent with ruling F004's cookieless analytics posture, since these keys hold only the visitor's own preferences and scenario, not tracking data.

| Key | Contents | Written by | Cleared by |
|---|---|---|---|
| `filter.preferences.v1` | `{ reducedMotion, lowPowerMode, labelsVisible, lastAdvancedPanelOpen }` | `ui_store.ts` on preference change | The visible clear local data control (FR013) |
| `filter.lastScenario.v1` | The same base64url encoded scenario string defined in section 4, plus the `atYear` the run reached when saved | `simulation_store.ts` on pause, on run completion, and periodically during a running scenario | The visible clear local data control (FR013) |

The clear local data control removes both keys in one action and returns the application to the opening state (UX004). Restoring the last scenario (FR014) decodes `filter.lastScenario.v1` using the exact section 4 decoder, so a stored scenario and a shared URL scenario are validated by the same code path and can never diverge in behavior.

## 6. Cross references

State machine and transition mathematics that the fields in section 1 and section 2 participate in: docs/simulation_model.md. Honest framing of default values and modeling choices: docs/scientific_assumptions.md. Worker message payload types that carry these entities across the worker boundary: docs/ARCHITECTURE.md section 3.

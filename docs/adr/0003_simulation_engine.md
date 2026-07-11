# ADR 0003: Event driven worker simulation with a deterministic seeded RNG

Status: Accepted.

## Context

FR017 requires that the same seed, the same parameters, and the same simulation model version produce an identical run digest. FR018 requires the simulation to execute in a Web Worker so it never blocks the interface thread. FR025 requires causal event ordering: no event may precede its cause. docs/CHARTER_COMMON.md states an explicit floating point hazard: engine provided transcendental functions such as `Math.sin` are not guaranteed bit identical across engines, so determinism critical math must use integer arithmetic, fixed point representations, or deterministic implementations instead. The application must remain reproducible across the full supported browser matrix in ruling R021 and NFR008 (the last two versions of Chrome, Edge, Firefox, and Safari, plus iOS Safari 16 and later), which rules out relying on any engine specific numeric behavior for anything that affects the run digest.

## Decision

Implement the simulation core as a pure TypeScript domain module under `src/simulation/`, with no React import and no renderer import, executing inside `simulation.worker.ts` (docs/ARCHITECTURE.md section 2.3 and 2.4). The engine is a discrete event simulation: a single priority queue ordered by scheduled abstract simulated year, never a fixed timestep loop, as specified in docs/simulation_model.md section 4. Randomness is drawn from a documented, pure integer seeded pseudorandom generator implemented in `rng.ts`; `Math.random` is never called inside `src/simulation/`. Every place the model would ordinarily reach for a transcendental function, most notably sampling an exponential waiting time, which ordinarily needs a natural logarithm, uses a deterministic fixed point or lookup table based approximation implemented in `src/utils/math.ts` instead of the engine's `Math.log`, `Math.exp`, or `Math.sin` (docs/simulation_model.md section 3.3). Abstract simulated time is represented as a fixed point integer, never an accumulating floating point year value (docs/simulation_model.md section 8.3, docs/ARCHITECTURE.md section 6).

## Consequences

1. The engine cannot use convenient built in facilities, `Math.random` and the `Math.*` transcendental functions, for anything that affects the run digest, requiring a small internal deterministic math and RNG library (`rng.ts`, `src/utils/math.ts`) to be built, documented, and unit tested in its own right.
2. Because the queue is event driven rather than fixed timestep, computation cost is proportional to how much actually happens in a run, not to the ten billion year default horizon (ruling R018) divided into fixed ticks, which keeps large horizon runs computable inside a Web Worker at the maximum speed step (docs/simulation_model.md section 8.4).
3. Exact replay (FR004, ruling R010) and shared scenario reproduction (FR008, DATA001) both follow directly from the same deterministic engine, with no separate replay specific code path required.
4. `tests/fixtures/simulation_digests/` and the `simulation_determinism` CI job (docs/CHARTER_COMMON.md canonical CI job names) become the enforcement mechanism for this decision: any change that alters a digest for a previously committed fixture is a merge blocking signal, satisfying FR033.
5. The team accepts the implementation and review cost of hand rolled deterministic math over reaching for standard library convenience functions, as the explicit price of satisfying FR017 under the charter's floating point hazard rule and the multi engine support matrix in NFR008.

## Alternatives considered

1. **Using `Math.random` and the standard `Math.*` transcendental functions directly.** Rejected. This would violate FR017 and the charter's explicit floating point hazard rule, since `Math.random`'s algorithm and transcendental function bit patterns are not specified to be identical across the Chrome, Edge, Firefox, and Safari engines in the supported matrix (NFR008), and a digest computed from such values could not be trusted to reproduce.
2. **A fixed timestep simulation loop instead of an event driven queue.** Rejected. FR025 and packet 02's simulation state section both call for event driven scheduling. A fixed timestep loop would force a choice between a coarse step that misses fine grained timing (undermining the light travel and detection model in docs/simulation_model.md section 5) or a fine step that wastes computation across the long, mostly quiet stretches of a ten billion year horizon, and it complicates exact replay at arbitrary speed multipliers (docs/simulation_model.md section 8.4).
3. **Computing the simulation on the main interface thread instead of a Web Worker.** Rejected. This directly violates FR018 and NFR006's requirement that the interface thread remain able to process input and repaint during simulation playback, and would make the renderer and control panel unusable during any period of heavy event processing.

## Cross references

Full state machine, transition, and hazard mathematics this engine implements: docs/simulation_model.md. Determinism strategy at the architecture level: docs/ARCHITECTURE.md section 6. Worker message protocol: docs/ARCHITECTURE.md section 3.

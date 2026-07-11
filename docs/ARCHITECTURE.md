# ARCHITECTURE

System architecture for The Great Filter (filter.nixfred.com). This document implements FR016 through FR033, NFR001 through NFR010, ACC001 through ACC006, DATA001 through DATA003, INT004, INT006, R013, R015, R018, and honors the floating point hazard rule and the no server logic rule from docs/CHARTER_COMMON.md. It follows the module boundaries in FILTER_BUILD_PACKET/filter_build_packet/04_REPOSITORY_FILE_MANIFEST.md and the documentation mapping in ruling R001.

## 1. System shape

The Great Filter is a static single page application. There is no server logic, no bindings, no database (R013, INT004). Every request that reaches Cloudflare Pages returns a static asset. All computation happens in the visitor's browser, split across three isolated concerns that ruling and requirement FR016 to FR033 hold strictly separate:

1. Simulation state, computed in a Web Worker from a pure domain model.
2. Rendering state, computed by a Renderer Adapter that turns simulation output into pixels.
3. User interface state, held in React and small state stores, governing panels, layout, and preferences.

The nonnegotiable rule from FILTER_BUILD_PACKET/filter_build_packet/01_LARRY_EXECUTION_DIRECTIVE.md item 1 is enforced at the module boundary: no simulation module imports React or the renderer, no renderer module imports simulation internals, and the renderer only ever receives snapshots or compact event batches produced by the simulation core, never simulation internals (packet 02, simulation state section).

## 2. Module boundaries

```text
src/
├── app/            application shell: composition root, routing, error boundary, providers
├── components/     presentational and container React components, one directory per feature
├── simulation/      pure domain logic, framework free, imports nothing from app, components, renderer, or state
├── renderer/        rendering adapter: primary Three.js path and fallback_renderer path, imports nothing from simulation
├── state/           simulation_store, ui_store, url_state: the only modules allowed to talk to both simulation and renderer
├── content/         static copy, glossary, presets, sources: no logic, data only
├── telemetry/        analytics, error reporting, privacy gating
├── utils/           shared, dependency free helpers, including the deterministic math library
└── main.tsx         entry point
```

### 2.1 App shell (`src/app/`)

`App.tsx` composes providers, layout, and the top level error boundary. `ErrorBoundary.tsx` implements the React level half of the error boundary strategy in section 7. `routes.tsx` is a single route tree since the application has no server rendered routes and no history dependent navigation beyond in page panels (R013 rules out a server, and the packet does not call for multi page navigation). `providers.tsx` wires the state stores and telemetry gate into React context without leaking store internals into component props.

### 2.2 Components (`src/components/`)

One directory per feature area, matching the manifest exactly: `AboutPanel`, `CivilizationInspector`, `ControlPanel`, `EducationDrawer`, `EventLedger`, `GalaxyViewport`, `Onboarding`, `ScenarioPresets`, `ShareDialog`, `SilenceReport`, `SimulationControls`, `StatusBar`, `Timeline`. Components read from `state/` through hooks and never import `simulation/` or `renderer/` directly. `GalaxyViewport` is the only component that mounts the Renderer Adapter, and it passes the adapter nothing but a reference to the relevant slice of `simulation_store`.

### 2.3 Simulation core (`src/simulation/`)

Pure domain logic implementing FR016 through FR027 and FR033. This directory has zero React imports and zero renderer imports, verified in CI by an import boundary lint rule (OPS001, check:all). Files match the manifest: `civilization.ts`, `contact.ts`, `engine.ts`, `events.ts`, `galaxy.ts`, `hazards.ts`, `light_cone.ts`, `metrics.ts`, `model_version.ts`, `probability.ts`, `rng.ts`, `scenario.ts`, `schema.ts`, `serialization.ts`, `transitions.ts`, `types.ts`. The full state machine, transition mechanics, event scheduling, light travel model, expansion model, and metrics computation are specified in docs/simulation_model.md. `engine.ts` is the only file that owns the event queue and orchestrates the other modules; every other simulation file is a set of pure functions over explicit inputs.

### 2.4 Simulation worker (`src/simulation/simulation.worker.ts`)

Isolates the simulation core from the interface thread, satisfying FR018 and NFR006. The worker owns one `engine.ts` instance per active scenario. Section 3 defines the message protocol in full.

### 2.5 Renderer adapter (`src/renderer/`)

Implements FR028, FR029, NFR001, NFR002, ruling F002. `renderer.ts` exposes a single adapter interface consumed by `GalaxyViewport`:

```text
interface RendererAdapter {
  mount(container: HTMLElement, capability: RenderCapability): void
  applySnapshot(snapshot: SimulationSnapshot): void
  applyEventBatch(batch: SimulationEventBatch): void
  setMotionMode(mode: "full" | "reduced"): void
  setQualityTier(tier: RenderQualityTier): void
  unmount(): void
}
```

Two implementations satisfy this interface. The primary implementation composes `camera.ts`, `color_system.ts`, `galaxy_layer.ts`, `civilization_layer.ts`, `signal_layer.ts`, `travel_layer.ts`, and `labels_layer.ts` using Three.js, per ADR 0002. `fallback_renderer.ts` is the second implementation, selected by `capability.ts` for no WebGL, low power mode, or when the primary path fails to initialize. Neither implementation imports from `src/simulation/`; both consume only `SimulationSnapshot` and `SimulationEventBatch` types defined in `src/simulation/types.ts` and re-exported through `src/state/simulation_store.ts`.

#### Capability detection strategy

`capability.ts` runs a layered decision at mount time and again on an explicit low power toggle change:

1. **Hard capability check.** Attempt WebGL2 context creation, falling back to WebGL1. Attempt Web Worker instantiation. If WebGL context creation fails, the renderer family is fixed to fallback for the session. If Web Worker instantiation fails, the application enters the unsupported degraded state described in section 7, since FR018 forbids running the simulation on the interface thread as a silent substitute.
2. **Soft capability heuristics.** When the primary renderer family is available, `capability.ts` reads `navigator.hardwareConcurrency`, `navigator.deviceMemory` where present, and the user's explicit low power preference from `ui_store` (persisted through DATA002) to select a `RenderQualityTier` that bounds particle counts and shader effect density (NFR002).
3. **Motion preference.** `prefers-reduced-motion` and the in application reduced motion toggle (ACC003) are read independently of renderer family and quality tier. Both the primary and fallback renderers implement `setMotionMode("reduced")` by replacing continuous animation with discrete state changes, labels, and time stamped summaries, per FR029 and the motion language section of packet 02.
4. **Runtime downgrade.** If the primary renderer's own frame pacing watchdog observes sustained degraded frame delivery after initialization succeeded, it lowers its own `RenderQualityTier` internally. It does not silently swap to the fallback implementation mid session, since that would change the visual language without a corresponding notice; a manual low power toggle remains the user facing path to the fallback family.

### 2.6 State stores (`src/state/`)

Three stores, matching the manifest exactly, are the seam between simulation, renderer, and UI:

- `simulation_store.ts` owns the worker's `postMessage` channel, the current `SimulationSnapshot`, the accumulating event log for `EventLedger`, run metrics, and run status (`idle`, `running`, `paused`, `complete`, `error`). It is the single source of truth consumed by `GalaxyViewport`, `EventLedger`, `SilenceReport`, `CivilizationInspector`, and `StatusBar`.
- `ui_store.ts` owns panel visibility, layout mode, label visibility toggle (FR007), reduced motion toggle, low power toggle, and onboarding progress. It persists a documented subset to `localStorage` under DATA002.
- `url_state.ts` owns encoding and decoding the share URL described in docs/DATA_MODEL.md, and is the only module permitted to read or write `window.location` scenario query state. It is consumed by `simulation_store.ts` to seed a run and by `ShareDialog` to produce a share link.

No component reaches into `simulation/` or `renderer/` directly; every read and write passes through one of these three stores.

### 2.7 Content (`src/content/`)

`copy.ts`, `glossary.ts`, `presets.ts`, `sources.ts` hold static data consumed by `EducationDrawer`, `Onboarding`, `ScenarioPresets`, and footer components. This directory has no runtime logic and no dependency on simulation or renderer modules, so localization or copy edits never touch behavior code.

### 2.8 Telemetry (`src/telemetry/`)

Implements ruling F004, INT006, DATA003, and SEC001. `analytics.ts` loads the Cloudflare Web Analytics beacon only in a production build and only after `privacy.ts` confirms the build target is production, never in preview builds (SEC008). No simulation parameter, seed, or scenario value is ever passed to `analytics.ts`; the module's exported function signatures do not accept scenario data, which makes that misuse a type error rather than a code review burden. `errors.ts` is the single channel through which the worker's `ERROR` message and the app shell `ErrorBoundary` report failures; in v1 it logs to the console and to the degraded state UI only, since no privacy appropriate error reporting service has been approved (OPS clause 18.6 of packet 03).

### 2.9 Utils (`src/utils/`)

`accessibility.ts`, `assert.ts`, `format.ts`, `math.ts`, `performance.ts`, `time.ts`. `math.ts` is the deterministic math library described in section 6 and docs/simulation_model.md, consumed only by `src/simulation/`. The other utils are shared by both the simulation and UI sides but contain no simulation domain logic themselves.

## 3. Worker protocol

`simulation.worker.ts` communicates with `simulation_store.ts` through `postMessage`, using a small closed set of typed messages. All messages are structured clone safe (no functions, no class instances with methods) so they carry cleanly across the worker boundary and remain serializable for testing.

### 3.1 Main thread to worker

| Message type | Payload | Purpose |
|---|---|---|
| `INIT` | `{ scenario: Scenario, modelVersion: number }` | Validates and loads a scenario (FR026), constructs the engine, does not start advancing time |
| `START` | none | Begins event processing from the current simulated time |
| `PAUSE` | none | Suspends event processing, retains full state |
| `RESUME` | none | Resumes from the paused point |
| `SET_SPEED` | `{ speed: SpeedStep }` | Changes the real time to simulated time pacing described in section 6.4 (FR024) |
| `RESET` | none | Returns to simulated time zero with the same scenario and seed (part of FR004) |
| `REPLAY_SAME_SEED` | none | Equivalent to `RESET` followed by `START`, provided as one message to avoid a race between the two |
| `RANDOMIZE_SEED` | none | Draws a new seed, re-initializes the engine with the same scenario parameters otherwise unchanged |
| `ACK_BATCH` | `{ batchId: number }` | Backpressure acknowledgment described in section 3.3 |
| `REQUEST_SNAPSHOT` | none | Asks for an immediate full `SNAPSHOT` outside the normal batch cadence, used when a component mounts mid run |
| `TERMINATE` | none | Worker cleans up and accepts no further messages |

### 3.2 Worker to main thread

| Message type | Payload | Purpose |
|---|---|---|
| `READY` | none | Worker module loaded, ready for `INIT` |
| `SNAPSHOT` | `{ time: number, civilizations: CivilizationSnapshot[], signals: SignalSnapshot[], frontiers: FrontierSnapshot[] }` | A full point in time state, used at run start, after `REQUEST_SNAPSHOT`, and after `RESET` |
| `EVENT_BATCH` | `{ batchId: number, events: SimulationEvent[], time: number }` | A compact ordered slice of newly fired events since the last batch, the routine delivery mechanism during playback |
| `METRICS_UPDATE` | `{ time: number, metrics: Partial<RunMetrics> }` | Periodic aggregate counters for `StatusBar`, cheap to compute incrementally |
| `RUN_COMPLETE` | `{ metrics: RunMetrics, digest: string, headline: string }` | Terminal message for a run, carries the full Silence Report payload described in docs/DATA_MODEL.md |
| `PROGRESS` | `{ fractionComplete: number }` | Sent only during a `SET_SPEED` maximum burst, described in section 6.4 |
| `ERROR` | `{ code: string, message: string, recoverable: boolean }` | Routed to `telemetry/errors.ts` and the degraded state UI |

### 3.3 Snapshot versus event batch delivery and backpressure

At `START` or `RESET`, the worker sends one `SNAPSHOT` establishing a baseline. After that, the worker sends `EVENT_BATCH` messages representing incremental change, never a full snapshot per tick, so message size stays proportional to activity rather than to population size. `GalaxyViewport` and `EventLedger` apply batches to their local view of state in order; the Renderer Adapter's `applyEventBatch` never receives raw simulation internals, only the typed event payloads defined in `src/simulation/types.ts`.

Because the worker can compute far faster than a screen can usefully display at high speed multipliers, backpressure is explicit rather than implied by `postMessage` queuing: each `EVENT_BATCH` carries a `batchId`, and the worker will not send a batch numbered `n + 2` until it has received `ACK_BATCH` for batch `n`. This caps the number of in flight batches at two, bounding worst case memory growth on the main thread regardless of how far ahead the worker's computation has run, and gives `simulation_store.ts` a natural point to throttle delivery to match the selected speed's real time pacing described in section 6.4.

## 4. Data flow, in text form

### 4.1 Configuring and starting a run

```text
ControlPanel / ScenarioPresets (components)
  -> ui_store (holds draft parameter edits)
  -> on Start: ui_store commits draft into a Scenario object
  -> simulation_store.startRun(scenario)
       -> url_state.encode(scenario)      (updates the address bar share URL, DATA001)
       -> localStorage write               (last scenario, DATA002)
       -> worker.postMessage(INIT)
       -> worker.postMessage(START)
  <- worker: READY, then SNAPSHOT
simulation_store applies SNAPSHOT
  -> GalaxyViewport reads simulation_store -> RendererAdapter.applySnapshot
  -> StatusBar reads simulation_store metrics
```

### 4.2 Steady state playback

```text
worker: EVENT_BATCH(batchId, events, time)
  -> simulation_store appends events to the ledger buffer, updates derived counters
       -> simulation_store.postMessage(ACK_BATCH, batchId)   (backpressure, section 3.3)
  -> GalaxyViewport -> RendererAdapter.applyEventBatch(events)
  -> EventLedger reads the ledger buffer, applies the visitor's active filters
  -> CivilizationInspector reads the selected civilization's slice, if one is selected
```

### 4.3 Ending a run

```text
worker: RUN_COMPLETE(metrics, digest, headline)
  -> simulation_store sets status = "complete", stores metrics and digest
  -> SilenceReport reads simulation_store, renders the fifteen metrics and the headline sentence
  -> ShareDialog reads url_state, offers the already current share URL
```

### 4.4 Sharing and restoring a scenario

```text
opening filter.nixfred.com?s=<encoded>
  -> url_state.decode(searchParams)   (schema version dispatch, migration, DATA001)
  -> if valid: simulation_store.startRun(decodedScenario)
  -> if invalid or absent: ui_store checks localStorage last scenario (DATA002)
       -> if present: offer to restore (FR014)
       -> if absent: render the opening state (UX004)
```

No path in sections 4.1 through 4.4 allows a component to read `src/simulation/` internals directly, and no path allows the renderer to receive anything but `SimulationSnapshot` and `SimulationEventBatch` values, satisfying the packet 02 rule that the renderer receives snapshots or compact event batches, never simulation internals.

## 5. No server logic

Per R013, the production build contains no Cloudflare Pages Functions, no KV, D1, or R2 bindings, and no form submission target. `wrangler.jsonc` defines no bindings (INT004). Every feature in this architecture, including scenario sharing (section 4.4) and preference persistence (DATA002), is implemented entirely in the browser using the URL and `localStorage`. If a future release approves a public scenario gallery or feedback endpoint (FR036, DEFERRED), it would introduce a `functions/` directory and bindings as an additive change; this architecture assumes none exist in v1.

## 6. Determinism strategy

FR017 requires that the same seed, the same parameters, and the same simulation model version produce an identical run digest. The floating point hazard rule in docs/CHARTER_COMMON.md states that engine provided transcendental functions such as `Math.sin` are not guaranteed bit identical across engines, and that determinism critical math must use integer arithmetic, fixed point representations, or deterministic implementations instead.

This architecture applies that rule as follows, with full mathematical detail in docs/simulation_model.md:

1. **Randomness.** `src/simulation/rng.ts` implements a documented, pure integer, seeded pseudorandom generator. `Math.random` is never called anywhere inside `src/simulation/`; this is enforced by the same import boundary lint rule referenced in section 2.3.
2. **Time.** Abstract simulated time is represented internally as a fixed point integer (whole simulated time units at a defined sub year resolution), never as an accumulating floating point year value, so that repeated addition across a ten billion year horizon cannot drift between engines or between runs.
3. **Transcendental math.** Any place the scientific model would naturally reach for a transcendental function, such as sampling an exponential waiting time (which ordinarily needs a natural logarithm), this architecture requires a deterministic fixed point or lookup table implementation in `src/utils/math.ts` in place of the engine's `Math.log`, `Math.exp`, `Math.sin`, or similar. This is a hard rule for anything that feeds the run digest.
4. **Wall clock isolation.** `src/simulation/` never reads `Date.now` or `performance.now`. Playback pacing (docs/simulation_model.md section 8.4) is entirely a `simulation_store.ts` concern outside the worker's domain module, so no wall clock value can ever enter an RNG draw, a scheduled event time, or the digest.
5. **Digest computation.** The run digest, defined fully in docs/DATA_MODEL.md section 3, is computed only from integer or fixed point canonical values, never from a floating point number's engine dependent string formatting.
6. **Event ordering.** RNG draws and event processing happen in a fixed, queue driven order (docs/simulation_model.md section 4, event driven scheduling), never in an order that depends on object iteration order, `Map` insertion order across different code paths, or any other incidental engine behavior.
7. **Enforcement.** An ESLint rule scoped to `src/simulation/**` forbids `Math.sin`, `Math.cos`, `Math.tan`, `Math.exp`, `Math.log`, `Math.pow`, `Math.random`, `Date.now`, and `performance.now` outside the sanctioned `src/utils/math.ts` helpers, enforced by the `lint` CI job, per docs/TEST_PLAN.md section 3.5.
8. **Verification and its honest limit.** `tests/fixtures/simulation_digests/` holds committed scenario and expected digest pairs (FR033), exercised by the `simulation_determinism` CI job, which runs on a single engine. That job proves intra engine reproducibility and catches accidental nondeterminism, such as unseeded randomness or a wall clock read; it does not by itself prove bit identity across the full supported browser matrix (NFR008, R021). Cross engine identity rests on items 1 through 4 above plus the item 7 lint enforcement, and is spot checked manually across the browser matrix at gate G7, per docs/TEST_PLAN.md section 3.5.

The full transition, hazard, and waiting time mathematics that this determinism strategy constrains are specified in docs/simulation_model.md. The rationale for choosing an event driven worker with a deterministic RNG over the alternatives is recorded in docs/adr/0003_simulation_engine.md. The committed fixture set, the CI job, the fixture regeneration procedure, and the full floating point discipline are specified in docs/TEST_PLAN.md section 3.

## 7. Error boundary strategy and degraded states

FR030 requires that loading, empty, degraded, unsupported, and error states are designed, not accidental. This architecture assigns each state a distinct cause and a distinct owner:

| State | Cause | Owner | Visitor facing behavior |
|---|---|---|---|
| Loading | Worker module and capability detection have not yet resolved | `app/App.tsx` | A minimal, motion respecting loading indicator, no partial galaxy canvas |
| Empty | No scenario configured yet, the opening state before a first run (UX004) | `ui_store` | The opening state: title, supporting line, CREATE A GALAXY and RUN A PRESET actions |
| Degraded | Renderer fell back to `fallback_renderer.ts`, or low power mode is active, but the simulation and core interaction remain fully available | `renderer/capability.ts`, surfaced through `ui_store` | A small persistent notice naming the reduced presentation, the run remains fully interactive |
| Unsupported | A hard capability gap with no safe fallback exists, in v1 this is specifically Web Worker unavailability, since FR018 forbids silently running the simulation on the interface thread | `renderer/capability.ts` at mount time | An explanatory message and no attempt to run the simulation, never a blank page |
| Error | An unrecoverable runtime error: a React render error caught by `ErrorBoundary.tsx`, or a fatal `ERROR` message from the worker | `app/ErrorBoundary.tsx` and `state/simulation_store.ts` | An explanatory message with a reset action, the rest of the application shell (footer, links) remains visible |

Two independent catch points exist because a worker crash and a React render crash are different failure domains: `ErrorBoundary.tsx` only ever sees UI tree exceptions, and cannot see worker exceptions, since those cross a `postMessage` boundary as data, not as thrown exceptions. `simulation_store.ts` is therefore responsible for turning a worker `ERROR` message, or an unexpected worker termination, into the same error state presentation that `ErrorBoundary.tsx` would produce for a UI exception, so the visitor sees one consistent recovery path regardless of which domain failed. Renderer initialization failure is handled inside `renderer/capability.ts` before it ever reaches the degraded or unsupported states in this table, automatically selecting `fallback_renderer.ts` without requiring visitor action, per R021's rule that older devices receive the fallback renderer, never a blank page.

## 8. Cross references

Renderer choice and its alternatives: docs/adr/0002_renderer.md. Simulation engine choice and its alternatives: docs/adr/0003_simulation_engine.md. Frontend stack choice: docs/adr/0001_frontend_stack.md. Deployment architecture: docs/adr/0004_cloudflare_delivery.md. Full state machine, transition mathematics, and time model: docs/simulation_model.md. Scenario schema, entity models, digest definition, and storage formats: docs/DATA_MODEL.md. Honest framing of which parts of this architecture rest on established science versus modeling choice: docs/scientific_assumptions.md.

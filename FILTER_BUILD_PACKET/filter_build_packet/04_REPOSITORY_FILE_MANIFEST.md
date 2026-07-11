# PROFESSIONAL REPOSITORY FILE MANIFEST

This is the expected professional repository structure. Larry may adjust names when a tool generates a standard equivalent, but the responsibilities must remain covered.

```text
filter/
├── .github/
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   ├── pull_request_template.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   ├── feature_request.yml
│   │   └── config.yml
│   └── workflows/
│       ├── ci.yml
│       ├── dependency_review.yml
│       ├── codeql.yml
│       ├── deploy_preview.yml
│       └── deploy_production.yml
├── docs/
│   ├── architecture.md
│   ├── art_direction.md
│   ├── accessibility.md
│   ├── deployment.md
│   ├── simulation_model.md
│   ├── scientific_assumptions.md
│   ├── testing_strategy.md
│   ├── threat_model.md
│   ├── operations.md
│   ├── decision_log.md
│   └── adr/
│       ├── 0001_frontend_stack.md
│       ├── 0002_renderer.md
│       ├── 0003_simulation_engine.md
│       └── 0004_cloudflare_delivery.md
├── public/
│   ├── _headers
│   ├── _redirects
│   ├── favicon.svg
│   ├── icon_192.png
│   ├── icon_512.png
│   ├── apple_touch_icon.png
│   ├── mask_icon.svg
│   ├── social_preview.png
│   ├── site.webmanifest
│   ├── robots.txt
│   └── humans.txt
├── scripts/
│   ├── check_bundle.mjs
│   ├── generate_social_preview.mjs
│   ├── validate_content.mjs
│   ├── validate_scenarios.mjs
│   └── write_build_metadata.mjs
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── routes.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── AboutPanel/
│   │   ├── CivilizationInspector/
│   │   ├── ControlPanel/
│   │   ├── EducationDrawer/
│   │   ├── EventLedger/
│   │   ├── GalaxyViewport/
│   │   ├── Onboarding/
│   │   ├── ScenarioPresets/
│   │   ├── ShareDialog/
│   │   ├── SilenceReport/
│   │   ├── SimulationControls/
│   │   ├── StatusBar/
│   │   └── Timeline/
│   ├── content/
│   │   ├── copy.ts
│   │   ├── glossary.ts
│   │   ├── presets.ts
│   │   └── sources.ts
│   ├── renderer/
│   │   ├── renderer.ts
│   │   ├── camera.ts
│   │   ├── capability.ts
│   │   ├── color_system.ts
│   │   ├── galaxy_layer.ts
│   │   ├── civilization_layer.ts
│   │   ├── signal_layer.ts
│   │   ├── travel_layer.ts
│   │   ├── labels_layer.ts
│   │   └── fallback_renderer.ts
│   ├── simulation/
│   │   ├── civilization.ts
│   │   ├── contact.ts
│   │   ├── engine.ts
│   │   ├── events.ts
│   │   ├── galaxy.ts
│   │   ├── hazards.ts
│   │   ├── light_cone.ts
│   │   ├── metrics.ts
│   │   ├── model_version.ts
│   │   ├── probability.ts
│   │   ├── rng.ts
│   │   ├── scenario.ts
│   │   ├── schema.ts
│   │   ├── serialization.ts
│   │   ├── transitions.ts
│   │   ├── types.ts
│   │   └── simulation.worker.ts
│   ├── state/
│   │   ├── simulation_store.ts
│   │   ├── ui_store.ts
│   │   └── url_state.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   ├── global.css
│   │   ├── motion.css
│   │   └── utilities.css
│   ├── telemetry/
│   │   ├── analytics.ts
│   │   ├── errors.ts
│   │   └── privacy.ts
│   ├── utils/
│   │   ├── accessibility.ts
│   │   ├── assert.ts
│   │   ├── format.ts
│   │   ├── math.ts
│   │   ├── performance.ts
│   │   └── time.ts
│   ├── main.tsx
│   └── vite_env.d.ts
├── tests/
│   ├── fixtures/
│   │   ├── scenarios/
│   │   └── simulation_digests/
│   ├── unit/
│   │   ├── simulation/
│   │   ├── state/
│   │   └── utils/
│   ├── integration/
│   │   ├── simulation_worker.test.ts
│   │   └── scenario_round_trip.test.ts
│   ├── e2e/
│   │   ├── onboarding.spec.ts
│   │   ├── default_run.spec.ts
│   │   ├── share_scenario.spec.ts
│   │   ├── keyboard.spec.ts
│   │   ├── reduced_motion.spec.ts
│   │   └── mobile.spec.ts
│   └── accessibility/
│       └── core_flows.spec.ts
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .npmrc
├── .nvmrc
├── .prettierignore
├── CHANGELOG.md
├── CLAUDE.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
├── eslint.config.js
├── index.html
├── lighthouserc.json
├── package.json
├── package-lock.json
├── playwright.config.ts
├── prettier.config.mjs
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
└── wrangler.jsonc
```

## Root files

### `README.md`

Contains the product summary, screenshot, local setup, commands, architecture summary, deployment status, privacy posture, contribution notes, and links to detailed documentation.

### `CLAUDE.md`

Contains instructions for Claude Code Larry:

1. Project purpose

2. Approved architecture

3. Commands

4. Files that are generated

5. Files that must not contain secrets

6. Testing rules

7. Simulation determinism rules

8. Accessibility rules

9. Deployment rules

10. Definition of done for each change

### `CHANGELOG.md`

Records user visible changes and simulation model changes.

### `CONTRIBUTING.md`

Defines branch, commit, pull request, testing, documentation, and review expectations.

### `SECURITY.md`

Defines supported versions, private vulnerability reporting method, secret handling, and response expectations.

### `LICENSE`

Depends on Fred's choice. A public educational project should have an explicit license rather than accidental ambiguity.

### `CODE_OF_CONDUCT.md`

Recommended for a public repository. Optional for a private repository.

### `.editorconfig`

Normalizes indentation, final newlines, character encoding, and whitespace.

### `.gitattributes`

Normalizes line endings and identifies generated or binary assets where useful.

### `.gitignore`

Excludes dependencies, build output, local variables, reports, browser artifacts, and local Wrangler state.

### `.npmrc`

Enforces reproducible install behavior and approved npm settings.

### `.nvmrc`

Pins the Node runtime used locally and in deployment.

### `eslint.config.js`

Defines TypeScript, React, hooks, accessibility, import, and test linting rules.

### `prettier.config.mjs`

Defines formatting.

### `vite.config.ts`

Defines production build, aliases, worker behavior, code splitting, and build metadata.

### `vitest.config.ts`

Defines unit and integration test behavior and coverage thresholds.

### `playwright.config.ts`

Defines browser projects, devices, traces, retries, web server startup, and reports.

### `lighthouserc.json`

Defines performance, accessibility, best practice, and search audit thresholds.

### `wrangler.jsonc`

Defines the Cloudflare Pages project output and approved environment configuration.

## GitHub files

### `ci.yml`

Runs formatting, linting, type checking, tests, build, bundle checks, browser smoke tests, and accessibility tests.

### `deploy_preview.yml`

Creates or updates the pull request preview deployment.

### `deploy_production.yml`

Deploys approved `main` commits to production and verifies the custom domain.

### `dependency_review.yml`

Blocks vulnerable dependency additions at the approved severity threshold.

### `codeql.yml`

Runs code scanning where the repository plan supports it.

### `dependabot.yml`

Schedules npm and GitHub Actions update pull requests.

### `CODEOWNERS`

Requests the correct reviewer and can participate in merge protection.

## Documentation files

### `architecture.md`

Documents boundaries among the application shell, user interface, simulation worker, rendering adapter, state stores, content, and deployment.

### `simulation_model.md`

Documents states, parameters, distributions, equations, event ordering, contact rules, weighting, and versioning.

### `scientific_assumptions.md`

Separates educational facts, assumptions, simplifications, and speculative choices.

### `art_direction.md`

Contains color, typography, layout, motion, sound, iconography, and copy guidance.

### `accessibility.md`

Contains keyboard map, focus behavior, screen reader model, live region policy, reduced motion behavior, contrast targets, and fallback presentation.

### `deployment.md`

Contains GitHub owner, repository, Cloudflare account identifier, Pages project, production branch, custom domain, secret names, workflows, smoke tests, and rollback procedure. It must not contain secret values.

### `testing_strategy.md`

Maps product risks to unit, property, integration, browser, accessibility, and performance tests.

### `threat_model.md`

Covers supply chain risk, malicious scenario links, cross site scripting, oversized parameters, worker denial of service, unsafe third party scripts, secret exposure, and preview access.

### `operations.md`

Contains release, rollback, incident, dependency update, and routine verification procedures.

### `decision_log.md` and `docs/adr`

Record important decisions and their reasons so future changes do not quietly reverse them.

## Public assets

### `_headers`

Controls security and cache headers for static responses.

### `_redirects`

Controls route fallback and approved redirects.

### `site.webmanifest`

Defines installable application metadata.

### `robots.txt`

Defines production indexing behavior.

### Social and icon assets

Must be produced from original project artwork or approved licensed material. Avoid a random stock galaxy thumbnail that makes the project look like a middle school planet report.

## Simulation files

The simulation folder must contain pure domain logic wherever practical.

`engine.ts` coordinates the event queue.

`rng.ts` provides deterministic randomness.

`schema.ts` validates scenarios.

`model_version.ts` separates simulation compatibility from application releases.

`contact.ts` and `light_cone.ts` determine whether causal overlap occurs.

`simulation.worker.ts` isolates compute from interface rendering.

`serialization.ts` creates compact, versioned share data and migrates supported older formats.

## Renderer files

The renderer is an adapter. The simulation must not import renderer code.

The renderer accepts world snapshots or event batches and produces visuals. A fallback renderer must provide a meaningful low power and reduced motion presentation.

## Conditional files

Add `functions/` only if Fred approves server side features.

Possible future structure:

```text
functions/
└── api/
    ├── scenarios/
    ├── feedback/
    └── health.ts
```

A shared scenario gallery may require Cloudflare D1 or KV. A large image or data asset may require R2. None should exist in the default static build.

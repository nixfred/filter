<!-- FILE: 00_READ_ME_FIRST.md -->

# FILTER BUILD PACKET

## Project identity

Public title: **The Great Filter**

Canonical launch address: **filter.nixfred.com**

Category: **LABS**

Working repository name: **filter**

Working Cloudflare Pages project name: **filter**

Status: **Discovery specification, version 0.1**

## Purpose of this packet

This packet gives Claude Code Larry an executable product, architecture, quality, security, deployment, and launch framework. It also contains the questions Fred must answer before every product decision can be treated as final.

Larry is authorized to use the existing GitHub and Cloudflare access. Larry can use `gh` for GitHub work and `wrangler` for Cloudflare Pages work. Larry is not to ask whether those capabilities exist. Larry is to verify the current account, repository, Cloudflare project, and DNS target before making changes, then execute.

## What is already decided

1. The experience is an interactive simulation, not a conventional essay.

2. Visitors create or configure a galaxy, seed it with possible civilizations, and watch civilizations emerge, communicate, expand, survive, or disappear.

3. The core subject is the Fermi paradox, the Great Filter, temporal overlap, spatial separation, and the silence of the observable sky.

4. GitHub is the source of truth.

5. GitHub Actions performs continuous integration and delivery orchestration.

6. Cloudflare Pages hosts production and preview deployments.

7. Wrangler performs Cloudflare Pages deployment.

8. Production is served at `filter.nixfred.com`.

## What remains open

The discovery interview decides the scientific depth, rendering style, dimensionality, simulation controls, copy tone, sound, analytics, persistence, public sharing, repository visibility, and launch policy.

## Recommended response method

Reply in chat with the question number and answer. Compact answers are fine.

Example:

```text
1. Yes
2. Redirect permanently
3. Personal GitHub account
4. filter
5. Public
```

Questions 1 through 35 are the first priority. Questions 36 through 100 refine the experience and operational finish.


<!-- FILE: 01_LARRY_EXECUTION_DIRECTIVE.md -->

# LARRY EXECUTION DIRECTIVE

## Authority

Larry, build this application.

You have authorization and permissions to use GitHub through `gh` and Cloudflare through `wrangler`. Do not ask whether you can create the repository, configure GitHub, create or inspect the Cloudflare Pages project, deploy previews, deploy production, or associate the custom domain. Verify active identities and target resources before changing them, then proceed.

Never print, commit, log, or expose secret values.

## Product

Name: **The Great Filter**

Address: **filter.nixfred.com**

Category: **LABS**

Core promise:

> Build a galaxy, seed it with civilizations, and watch almost all of them disappear. An interactive journey through the Fermi paradox and the silence above us.

Visitors control the probability or rate of life, intelligence, technological survival, interstellar travel, self destruction, and detectable communication. Time advances at an accelerated rate. Civilizations appear as points of light. Most fade. Some transmit. A few expand. Rarely, two causal windows overlap.

## Default implementation decision

Unless Fred changes a choice in the discovery interview, use this baseline:

1. React with TypeScript and Vite.

2. A rendering adapter that supports a WebGL renderer as the primary path and a reduced motion, low power fallback.

3. A Web Worker for simulation execution.

4. A deterministic seeded random number generator.

5. An event driven simulation core, separated from React and separated from the renderer.

6. URL encoded scenario state for reproducible sharing.

7. Local storage only for preferences and the last scenario.

8. No user accounts.

9. No database.

10. No server side application logic unless Fred approves a public scenario gallery, feedback endpoint, or other shared state feature.

11. npm with a committed lock file.

12. GitHub Actions for continuous integration, previews, and production deployment.

13. Cloudflare Pages Direct Upload through Wrangler.

14. `wrangler.jsonc` as the repository controlled Cloudflare configuration source.

15. `main` as the protected production branch.

## Nonnegotiable architecture rules

1. Keep simulation state, rendering state, and user interface state separate.

2. The same seed and the same parameters must produce the same simulation result for a given simulation model version.

3. The simulation must remain responsive on supported mobile and desktop browsers.

4. The renderer must degrade gracefully when WebGL, worker execution, reduced motion, or high particle counts are unavailable.

5. No scientific claim may be represented as established fact when it is a modeling assumption.

6. Every probability control must have a plain language explanation, units or effective interpretation, range, default, and mathematical mapping.

7. Contact must respect time and distance. Two civilizations being alive at the same time is not sufficient unless the selected contact model also permits signal or travel overlap.

8. Accessibility is a release requirement, not a cleanup task.

9. Preview deployments must not be treated as production.

10. Production deployment may occur only after all required checks pass.

## Delivery phases

### Phase 0: Preflight

1. Verify the active GitHub identity.

2. Verify the target GitHub owner.

3. Search for an existing repository named `filter`.

4. Verify the active Cloudflare account.

5. Search for an existing Cloudflare Pages project named `filter`.

6. Verify that `nixfred.com` is available in the active Cloudflare account or that the subdomain can be associated.

7. Record findings in `docs/deployment.md`.

8. Stop only for an actual destructive conflict, such as an unrelated existing repository or Pages project using the intended name.

### Phase 1: Repository and application scaffold

1. Create or initialize the repository.

2. Create the professional file structure in the repository manifest.

3. Install exact dependency versions and commit the lock file.

4. Add formatting, linting, type checking, unit test, browser test, accessibility test, and production build scripts.

5. Add `CLAUDE.md` containing repository specific operating rules.

6. Add architecture and scientific model documentation before implementing the final simulation behavior.

### Phase 2: Simulation core

1. Implement a versioned scenario schema.

2. Implement deterministic seeded random generation.

3. Generate a galaxy or representative system population according to the selected model.

4. Implement civilization transitions and event scheduling.

5. Implement extinction and survival hazards.

6. Implement detectable communication windows.

7. Implement light travel and optional interstellar expansion rules.

8. Implement overlap detection.

9. Implement aggregate metrics and run summaries.

10. Add deterministic fixtures, invariant tests, and property tests.

### Phase 3: Interaction and rendering

1. Build onboarding.

2. Build basic and advanced controls.

3. Build start, pause, speed, reset, replay, and seed controls.

4. Build zoom, pan, select, and inspect interactions where approved.

5. Build the galaxy renderer.

6. Build event visualization and event log.

7. Build outcome summary and comparison views.

8. Build mobile layouts and reduced motion alternatives.

### Phase 4: Content and artistic finish

1. Apply the approved art direction.

2. Add final card copy, introduction, help text, assumptions, sources, and footer.

3. Add favicon, application icon, social preview image, web manifest, robots file, and metadata.

4. Add loading, empty, degraded, unsupported, and error states.

5. Add optional sound only after the silent experience is complete.

### Phase 5: Continuous integration and delivery

1. Configure pull request quality checks.

2. Configure preview deployment.

3. Configure production deployment.

4. Configure GitHub environment protection.

5. Configure branch protection or repository rulesets.

6. Configure dependency update policy.

7. Configure security headers and redirects.

8. Configure custom domain association.

9. Verify deployment records in GitHub and Cloudflare.

### Phase 6: Launch verification

1. Run the production acceptance suite.

2. Verify the custom domain and certificate.

3. Verify redirects.

4. Verify social metadata.

5. Verify search indexing policy.

6. Verify keyboard operation and screen reader landmarks.

7. Verify reduced motion behavior.

8. Verify desktop and mobile performance budgets.

9. Verify simulation reproducibility from a shared URL.

10. Create an annotated release and final deployment record.

## Definition of done

The project is done only when all of the following are true:

1. The production site loads from `filter.nixfred.com`.

2. The production deployment is traceable to an immutable Git commit.

3. Pull requests receive a unique preview URL.

4. Required checks protect `main`.

5. A failed check cannot deploy production.

6. A prior successful Cloudflare Pages deployment can be selected for rollback.

7. The application works without an account.

8. A visitor can understand the core interaction without reading a long essay.

9. The same shared seed and settings reproduce the same modeled history.

10. The experience works with keyboard input, reduced motion, and nonvisual status descriptions.

11. No secret appears in source, logs, browser assets, or build artifacts.

12. The assumptions and limitations are visible and written in plain language.

13. The repository contains operating, deployment, architecture, simulation, accessibility, and maintenance documentation.

14. Lighthouse and bundle budgets meet the approved thresholds.

15. Fred approves the final visual and narrative treatment.


<!-- FILE: 02_PRODUCT_AND_ART_DIRECTION.md -->

# PRODUCT AND ART DIRECTION

## Product thesis

The Great Filter should feel like a scientific instrument that accidentally became a cosmic tragedy generator.

It is not a clicker game, a map with decorative stars, or a long article with a simulation pasted into the middle. The visitor should form a hypothesis, run a galaxy, watch history unfold, and leave with an intuitive understanding of why intelligent civilizations can be common in space yet almost never coexist in a way that permits contact.

The emotional arc is:

1. Curiosity

2. Control

3. Abundance

4. Attrition

5. Near contact

6. Silence

7. Reflection

## Recommended experience structure

### Opening state

A dark, nearly silent galaxy rotates or drifts at an almost imperceptible rate.

The title appears:

**THE GREAT FILTER**

Supporting line:

**Build a galaxy. Seed the stars. See who survives long enough to be heard.**

Primary action:

**CREATE A GALAXY**

Secondary action:

**RUN A PRESET**

A small line establishes the tone:

**Most civilizations miss each other by a few million years. Cosmically speaking, terrible calendar management.**

### Configuration state

The initial control panel exposes six understandable controls:

1. Life emergence

2. Intelligence emergence

3. Technological transition

4. Long term survival

5. Detectable communication

6. Interstellar expansion

Self destruction should be expressed either as the inverse of survival or as a separate control. The interview decides whether the main panel contains six or seven controls.

Every control includes:

1. A plain language label

2. A one sentence explanation

3. A current value

4. A range explanation

5. A visible effect summary

6. An information control for mathematical details

Advanced settings remain collapsed by default.

### Simulation state

The visitor can:

1. Start

2. Pause

3. Resume

4. Change speed

5. Reset

6. Replay the same seed

7. Randomize the seed

8. Zoom and pan

9. Select a civilization

10. Open the event ledger

11. Hide or show labels

12. Share the scenario

The simulation runs outside the main user interface thread. The renderer receives snapshots or compact event batches.

### Outcome state

At the selected end time, or when the visitor stops the run, display a **Silence Report**.

Recommended metrics:

1. Candidate worlds

2. Independent origins of life

3. Intelligent species

4. Technological civilizations

5. Civilizations that became detectable

6. Civilizations that disappeared

7. Civilizations active at the same time

8. Signal overlaps

9. Travel overlaps

10. Confirmed contacts

11. Closest near miss in space

12. Closest near miss in time

13. Longest lived civilization

14. Median technological lifetime

15. Most restrictive transition

The most memorable result should be a sentence, not merely a chart.

Examples:

**Twelve thousand civilizations spoke. None were close enough to hear another reply.**

**Two civilizations occupied the same spiral arm. Their detectable eras missed by 3.8 million years.**

**Contact occurred once. It lasted 64,000 years. Then one light went out.**

## Recommended scientific model

Use a conditional transition and hazard model rather than treating every slider as a direct percentage of all stars.

A representative star system can progress through states:

1. Candidate system

2. Habitable world

3. Life

4. Complex life

5. Intelligence

6. Technology

7. Detectable civilization

8. Interstellar civilization

9. Dormant, quiet, transformed, or extinct

Each transition is governed by an explicit probability, waiting time distribution, or hazard rate. Some controls can change a probability and others can change a duration.

Time and causality matter:

1. Signals travel at light speed.

2. Detection depends on emission strength, duration, distance, and the selected detection model.

3. Interstellar travel uses a configurable effective speed below light speed and includes launch or settlement delay.

4. Contact requires causal intersection, not merely simultaneous existence.

5. The displayed galaxy can contain many visual stars while the simulation uses a smaller representative population with documented weighting.

This model is more coherent than assigning a civilization to a star with one dice roll. It also allows the user to see where the Great Filter appears in a particular run.

## Recommended visual direction

### Primary recommendation: Observatory Elegy

Combine the clarity of a scientific observatory display with the emotional restraint of a memorial.

Visual traits:

1. Near black background with subtle blue depth

2. Sparse white and pale cyan stellar points

3. Warm gold for emerging technological civilizations

4. Electric violet for active detectable communication

5. Quiet red only for danger, collapse, or extinction

6. Soft concentric signal shells

7. Thin travel fronts

8. Minimal glass effects

9. Precise typography

10. Slow motion and long fades

11. No generic space photographs behind the application

12. No neon arcade treatment

The galaxy should feel vast, legible, and indifferent.

### Alternative: SETI Terminal

A restrained radio astronomy terminal with phosphor tones, spectral plots, coordinate labels, and terse event language.

This direction is distinctive and nostalgic, but it risks making the experience feel like a prop rather than a premium modern simulation.

### Alternative: Cosmic Atlas

A museum exhibit aesthetic with editorial typography, annotated star maps, clean diagrams, and a stronger educational layer.

This direction is excellent for explaining concepts, but can reduce the sense of living systems blooming and disappearing.

### Recommended blend

Use Observatory Elegy for the main simulation and Cosmic Atlas for explanations, charts, and the final report.

## Motion language

Birth should feel like a pulse, not an explosion.

Detectability should appear as a halo or expanding shell.

Interstellar expansion should appear as a frontier, not a laser beam.

Extinction should be a cooling fade, not a violent effect.

Contact should be rare enough to feel consequential.

Reduced motion mode must replace expansion animation with discrete state changes, labels, and time stamped summaries.

## Information design

The main canvas should remain visually dominant.

Desktop layout recommendation:

1. Galaxy canvas in the center

2. Controls in a left rail

3. Time, speed, and global metrics at the top

4. Event ledger and selected civilization details in a right drawer

5. Timeline and run controls along the bottom

Mobile layout recommendation:

1. Full screen galaxy canvas

2. Compact top status bar

3. Bottom sheet for controls

4. Separate event and report sheets

5. Large touch targets

## Copy voice

The voice should be scientifically literate, direct, calm, and occasionally dry.

Good:

**No one heard them. The nearest listener evolved 2.1 million years later.**

Good:

**Intelligence was common. Patience was not.**

Avoid:

**Epic alien empires battled across the cosmos.**

Avoid:

**This proves humanity is alone.**

The application models possibilities. It does not claim to solve the Fermi paradox.

## Preset ideas

1. **The Silent Galaxy**

Life is uncommon. Technology is rare. Contact is effectively absent.

2. **Crowded, Briefly**

Intelligence is common. Technological lifetimes are short.

3. **Loud but Lonely**

Civilizations transmit strongly, but timing and distance prevent replies.

4. **Rare Earth**

The early biological transitions dominate the filter.

5. **Fragile Intelligence**

Many intelligent species reach technology. Most disappear quickly.

6. **Patient Stars**

Civilizations survive for very long periods but do not travel.

7. **Expansion Wins**

A small number of civilizations become interstellar and transform the map.

8. **Optimist's Milky Way**

Life, survival, communication, and overlap are all comparatively favorable.

## Strong optional feature

After a run, offer **Make Contact More Likely**.

The application evaluates small parameter changes and identifies the single control whose adjustment most improves the probability of contact for that seed or across a small batch of neighboring runs.

This creates a natural lesson about sensitivity without requiring the visitor to understand every equation.

## Content pages or drawers

1. What is the Fermi paradox?

2. What is the Great Filter?

3. What counts as a civilization in this model?

4. How contact is calculated

5. Assumptions and limitations

6. Sources

7. About this LABS project

## Open design choices

The discovery interview decides:

1. Two dimensional or three dimensional rendering

2. Milky Way only or broader galaxy builder

3. Exact control count

4. Whether civilizations receive names or catalog identifiers

5. Whether sound is included

6. Whether the visitor can compare multiple runs

7. Whether a public scenario gallery exists

8. Confirm that `filter.nixfred.com` is the only custom project domain

9. How much mathematical detail is visible

10. How dark the humor is allowed to become


<!-- FILE: 03_CICD_FUNCTIONAL_REQUIREMENTS.md -->

# CONTINUOUS INTEGRATION AND DELIVERY FUNCTIONAL REQUIREMENTS

## 1. Deployment model

GitHub is the authoritative source repository.

GitHub Actions builds, tests, audits, packages, and deploys the application.

Cloudflare Pages uses Direct Upload.

Wrangler deploys the generated `dist` directory.

The production branch is `main`.

The production custom domain is `filter.nixfred.com`.

The intended Cloudflare Pages project name is `filter`, subject to collision verification.

## 2. Preflight requirements

Before creating or changing resources, Larry must:

1. Run `gh auth status`.

2. Determine the active GitHub owner and repository visibility policy.

3. Search for an existing repository named `filter`.

4. Run `wrangler whoami`.

5. List Cloudflare Pages projects.

6. Detect whether a Pages project named `filter` already exists.

7. Verify whether the active Cloudflare account contains the `nixfred.com` zone or has permission to associate the subdomain.

8. Confirm that any existing target resource belongs to this project.

9. Record nonsecret identifiers and decisions in `docs/deployment.md`.

10. Never display tokens or secret values in recorded output.

## 3. Repository requirements

The repository must:

1. Use `main` as the default branch.

2. Require pull requests for normal changes after the initial scaffold.

3. Require all named quality checks before merge.

4. Block force pushes and branch deletion on `main`.

5. Require conversation resolution before merge.

6. Use unique job names so required checks are not ambiguous.

7. Use squash merge by default unless Fred selects another history policy.

8. Delete merged feature branches automatically.

9. Enable dependency graph and Dependabot where available.

10. Enable secret scanning and push protection where available.

11. Use `CODEOWNERS` when the repository ownership choice is known.

12. Never store Cloudflare credentials in tracked files.

## 4. Runtime and dependency requirements

1. Pin a supported Node release in `.nvmrc` and the GitHub Actions setup step.

2. Use npm and commit `package-lock.json`.

3. Use `npm ci` in continuous integration.

4. Pin direct dependencies to explicit versions.

5. Use Dependabot for npm and GitHub Actions updates.

6. Group low risk development dependency updates where practical.

7. Do not automatically merge major dependency changes.

8. Do not load production code from unpinned public content delivery networks.

9. Prefer local application assets and locally bundled dependencies.

10. Document every dependency that materially affects simulation, rendering, analytics, or privacy.

## 5. Required npm scripts

The project must expose at least these scripts:

```text
dev
build
preview
format
format:check
lint
typecheck
test
test:unit
test:coverage
test:e2e
test:a11y
test:simulation
check:bundle
check:all
pages:dev
pages:deploy:preview
pages:deploy:production
```

`check:all` must run every merge blocking local check in a deterministic order.

## 6. Pull request continuous integration

Workflow file: `.github/workflows/ci.yml`

Triggers:

1. Pull request opened

2. Pull request synchronized

3. Pull request reopened

4. Pull request marked ready for review

5. Push to `main`

Required jobs:

1. Dependency installation

2. Formatting verification

3. Linting

4. Type checking

5. Unit tests

6. Simulation determinism tests

7. Simulation invariant and property tests

8. Test coverage verification

9. Production build

10. Bundle budget verification

11. Browser smoke tests

12. Accessibility tests

13. Upload of test reports and build output on failure

Requirements:

1. Use the committed lock file.

2. Cache npm dependencies through the Node setup action.

3. Use least privilege workflow permissions.

4. Cancel superseded runs for the same branch or pull request.

5. Keep job names stable and unique.

6. Treat warnings as failures where the tool supports a strict mode.

7. Produce a concise failure summary.

8. Never deploy from this workflow.

## 7. Dependency review and code scanning

Workflow file: `.github/workflows/dependency_review.yml`

1. Run on pull requests that change dependency manifests or lock files.

2. Fail on newly introduced vulnerable dependencies at the approved severity threshold.

3. Report license policy violations if Fred selects a license policy.

Workflow file: `.github/workflows/codeql.yml`

1. Include TypeScript and JavaScript analysis when supported by repository visibility and GitHub plan.

2. Run on pull requests, pushes to `main`, and a scheduled interval.

3. Treat newly introduced high severity findings as merge blocking.

## 8. Preview deployment

Workflow file: `.github/workflows/deploy_preview.yml`

Triggers:

1. Pull request opened

2. Pull request synchronized

3. Pull request reopened

4. Manual dispatch for recovery

Preconditions:

1. Required continuous integration jobs pass.

2. The pull request originates from a trusted branch policy approved by Fred.

3. Cloudflare credentials are available only to the deployment job.

Behavior:

1. Check out the exact pull request commit.

2. Install dependencies with `npm ci`.

3. Run the production build.

4. Deploy `dist` with Wrangler to a branch alias based on the pull request number or sanitized branch name.

5. Use the Cloudflare Pages project `filter`.

6. Create or update the GitHub deployment record.

7. Publish the preview address in the GitHub deployment interface and, when reliable, in one updated pull request comment.

8. Set preview search behavior to `noindex`.

9. Never bind the production custom domain to a preview.

10. Use a `preview` GitHub environment.

11. Use concurrency so a newer preview deployment supersedes an older run for the same pull request.

12. Do not expose production only variables to previews.

Preview access policy:

1. Public by default only if Fred approves.

2. Otherwise protect previews with Cloudflare Access.

## 9. Production deployment

Workflow file: `.github/workflows/deploy_production.yml`

Triggers:

1. Push to `main`

2. Manual dispatch by an authorized actor

Preconditions:

1. All merge blocking checks passed for the deployed commit.

2. The job references the GitHub `production` environment.

3. Any configured production approval rule is satisfied.

Behavior:

1. Check out the exact commit from `main`.

2. Install dependencies with `npm ci`.

3. Run the full production quality gate.

4. Build once.

5. Retain the production build artifact for the approved retention period.

6. Deploy `dist` through Wrangler using the production branch.

7. Set the GitHub deployment environment address to `https://filter.nixfred.com`.

8. Record the commit SHA, build time, application version, simulation model version, and Cloudflare deployment identifier.

9. Run post deployment smoke tests against the custom domain.

10. Fail the workflow if the custom domain, key assets, or critical interaction path fails.

11. Use deployment concurrency so only one production deployment runs at a time.

12. Do not cancel a production deployment after the upload begins unless the workflow is known to be safe to cancel.

## 10. GitHub environment secrets and variables

Recommended secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

Recommended repository variables:

```text
CLOUDFLARE_PAGES_PROJECT
PRODUCTION_DOMAIN
NODE_VERSION
```

Requirements:

1. The Cloudflare API token must be scoped as narrowly as practical to Pages deployment for the correct account.

2. Production secrets should reside in the `production` environment when supported.

3. Preview secrets should reside in the `preview` environment when supported.

4. Secret names may be shared across environments, but values and scope can differ.

5. No secret may be copied into `.env`, `.dev.vars`, a workflow log, a test report, or browser code.

6. Local secret files must be ignored by Git.

7. Add `.env.example` and `.dev.vars.example` only when the application actually uses runtime variables.

## 11. Wrangler configuration

File: `wrangler.jsonc`

Requirements:

1. Set the project name.

2. Set `pages_build_output_dir` to `./dist`.

3. Pin a compatibility date.

4. Treat the file as the source of truth for supported Pages configuration.

5. Define preview and production differences explicitly when needed.

6. Do not place secret values in `vars`.

7. Keep bindings absent unless an approved feature needs them.

8. Add comments explaining every binding and environment override.

Default static deployment should not create KV, D1, R2, Durable Objects, or Pages Functions.

## 12. Cloudflare Pages project creation

When no valid project exists:

1. Create a Direct Upload Pages project named `filter`, or the approved collision safe name.

2. Set the production branch to `main`.

3. Perform the first deployment through Wrangler.

4. Associate `filter.nixfred.com` through the Pages custom domain process.

5. Verify the resulting DNS record.

6. Verify certificate issuance.

7. Preserve the generated Pages address as an operational fallback.

8. Redirect or restrict the production Pages address according to Fred's preference.

Because this is a Direct Upload project, treat that choice as deliberate and document it.

## 13. Headers

File: `public/_headers`

Minimum goals:

1. Content Security Policy appropriate to the final asset and analytics choices

2. Referrer Policy

3. X Content Type Options

4. Permissions Policy

5. Frame protection through CSP

6. Cross origin policies where compatible with the rendering stack

7. Long cache lifetimes for fingerprinted assets

8. Conservative cache policy for HTML

9. No source map exposure in production unless intentionally approved

10. No preview indexing

The final Content Security Policy must be generated from the actual application behavior. Do not paste a broad policy that permits unnecessary script, frame, connection, font, image, or style sources.

## 14. Redirects

File: `public/_redirects`

Potential rules:

1. Application route fallback when client side routing requires it

2. Canonical host redirect if an alternate host is approved

3. No redirect from another custom project domain is required

4. Optional redirect from the production Pages address to the custom domain

Redirect behavior that involves a domain outside the Pages project may require a Cloudflare Redirect Rule rather than only `_redirects`.

## 15. Quality gates

Default release thresholds, subject to Fred's approval:

1. Zero TypeScript errors

2. Zero lint errors

3. Zero formatting drift

4. All deterministic simulation fixtures pass

5. No known flaky tests in required workflows

6. Minimum 85 percent line coverage for the simulation domain

7. Minimum 80 percent line coverage for the overall application

8. Critical accessibility flows pass automated checks

9. Keyboard only smoke path passes

10. Production build succeeds with no unresolved asset references

11. Initial JavaScript budget is defined after renderer selection

12. No individual static asset exceeds the approved Pages and performance budget

13. Core interaction remains usable at a mobile viewport

14. Reduced motion mode passes

15. Shared scenario URL reproduces the expected model version, seed, and parameters

## 16. Performance requirements

1. Render at a stable interactive frame rate on an approved midrange mobile reference device.

2. Adapt visual star count and effects to device capability.

3. Keep simulation work off the main user interface thread.

4. Avoid unnecessary React rendering during simulation playback.

5. Use typed arrays or compact structures where they materially improve simulation or renderer throughput.

6. Lazy load education, sources, and optional analysis panels.

7. Avoid blocking third party scripts.

8. Measure bundle size in continuous integration.

9. Run Lighthouse or equivalent production audits on an approved cadence.

10. Provide a low power mode.

## 17. Testing requirements

### Unit tests

1. Random generator reproducibility

2. Parameter mapping

3. Transition probabilities

4. Event ordering

5. Extinction hazards

6. Communication windows

7. Light travel calculations

8. Expansion calculations

9. Contact detection

10. Metrics

11. Scenario serialization

12. Scenario migration

### Property and invariant tests

1. No event occurs before its cause.

2. No civilization appears before its host world is eligible.

3. No signal arrives faster than the configured causal speed.

4. No travel front exceeds its configured speed.

5. Extinct civilizations do not emit unless a delayed signal is still in transit.

6. Aggregate counts remain internally consistent.

7. The same seed and parameters produce the same final digest.

8. Invalid inputs are rejected or clamped deterministically.

### Browser tests

1. First visit onboarding

2. Create and run a default galaxy

3. Pause and resume

4. Change speed

5. Select and inspect a civilization

6. Finish a run and open the Silence Report

7. Share and reopen a scenario

8. Keyboard only operation

9. Reduced motion operation

10. Mobile layout

11. Unsupported renderer fallback

12. Error recovery

## 18. Observability

Default recommendation:

1. Use Cloudflare Web Analytics only if Fred approves analytics.

2. Do not use session replay.

3. Do not collect simulation parameters as user identifiers.

4. Do not collect precise client fingerprints.

5. Log deployment metadata in GitHub.

6. Surface client errors through a privacy appropriate service only if approved.

7. Add a visible application version and simulation model version in the About panel.

## 19. Rollback and recovery

1. Every production deployment must remain associated with its Git commit.

2. Document how to identify the previous successful Cloudflare Pages deployment.

3. Document the Cloudflare rollback procedure.

4. A rollback must not require rebuilding the old commit when Cloudflare can restore a previous deployment.

5. After rollback, run the production smoke test.

6. Open an incident issue recording cause, affected release, rollback deployment, and corrective action for material failures.

7. Do not rewrite `main` to perform a rollback.

8. Follow the rollback with a corrective pull request.

## 20. Release and maintenance

1. Use semantic application versions or date based releases, according to Fred's answer.

2. Keep simulation model versioning separate from application versioning.

3. Include a concise change log.

4. Tag production milestones.

5. Review dependencies at least monthly.

6. Run scheduled security and browser compatibility checks.

7. Review scientific assumptions when the model changes.

8. Add migration logic when shared URL schema changes.

9. Preserve old shared scenarios when practical.

10. Document any intentional breaking change.

## 21. Production acceptance checklist

1. Custom domain resolves.

2. Certificate is valid.

3. Canonical metadata uses the custom domain.

4. Social preview metadata renders correctly.

5. Robots policy is correct.

6. Preview addresses are not indexed.

7. Security headers are present.

8. Redirects behave as approved.

9. Default run completes.

10. Shared run reproduces.

11. Mobile run completes.

12. Reduced motion run completes.

13. Keyboard path completes.

14. No browser console errors occur in supported browsers.

15. No secret or source map is exposed.

16. Deployment record links the custom domain and exact commit.

17. Rollback procedure has been tested at least once before public launch.


<!-- FILE: 04_REPOSITORY_FILE_MANIFEST.md -->

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


<!-- FILE: 05_DISCOVERY_INTERVIEW.md -->

# DISCOVERY INTERVIEW

Answer by number. Questions 1 through 35 are the first decision round. Recommended defaults appear in parentheses.

## A. Identity, domain, and ownership

1. Confirm that `filter.nixfred.com` is the canonical production address. Yes or no?

2. Confirm there is no alternate custom project domain and no legacy project domain redirect is required. Yes or no?

3. Should the public title remain **The Great Filter**, while the repository and address use **filter**? (Recommended: yes.)

4. Should the site show a subtitle? Suggested subtitle: **A civilization survival simulator**.

5. Which GitHub owner should contain the repository: your personal account or an organization?

6. Confirm the repository name. Suggested: `filter`.

7. Should the repository be public or private?

8. Which license should apply if public: MIT, Apache 2.0, GPL 3.0, source available custom terms, or all rights reserved?

9. Should the footer identify you as Fred Nix, use NixFred, or use another public credit?

10. Should the site link back to a main LABS index? What is the exact address?

11. Should the project include a visible version number?

12. Should the project include a visible link to its GitHub repository when public?

## B. Audience and intended outcome

13. Who is the primary audience: curious general visitors, students, science enthusiasts, technical users, or all of them?

14. What age or reading level should the explanations target?

15. What should a visitor understand after three minutes?

16. What should a visitor feel after ten minutes?

17. Is the primary goal education, wonder, replayability, portfolio impact, or an even mix?

18. Should a first visit be immediately interactive, or begin with a brief guided introduction?

19. Should the visitor be able to skip every explanation and go directly to the simulation?

20. How long should a typical run take in real time: 30 seconds, 60 seconds, 2 minutes, 5 minutes, or user controlled?

21. Should a default run be likely to produce no contact, occasional contact, or a balanced range?

22. Should the experience be suitable for classroom projection and presentation?

23. Should it work as a kiosk style full screen exhibit?

## C. Scientific scope and model

24. Should the galaxy be specifically Milky Way inspired, or should visitors choose galaxy size and shape?

25. Should the simulation be visually two dimensional, visually three dimensional, or two dimensional with depth effects? (Recommended: two dimensional with depth effects.)

26. Should stars represent actual individual simulated systems, or should the screen show many decorative stars around a smaller representative simulated population? (Recommended: representative population with explicit weighting.)

27. How many visually active stars should the target experience show on desktop: roughly 5,000, 20,000, 50,000, or adaptive?

28. How scientifically rigorous should the model be: intuitive toy model, scientifically grounded educational model, or advanced model with visible equations? (Recommended: grounded educational model.)

29. Should the simple controls map to conditional transition probabilities, waiting times, hazard rates, or a hidden blend chosen for clarity? (Recommended: hidden blend with advanced explanation.)

30. Should life emergence be modeled once per eligible world, repeatedly over time, or as an effective waiting time?

31. Should intelligence be a single transition, or should the model include complex life as a separate hidden or visible step?

32. Should technology be modeled as a distinct step after intelligence?

33. Should self destruction be a one time filter, an ongoing annual or millennial hazard, or both?

34. Should long term survival include nonviolent decline, silence, transformation, resource collapse, and loss of detectability, or only extinction?

35. Should detectable communication have both strength and duration, or one simplified detectability control?

36. Should radio leakage, intentional beacons, and technosignatures be separate concepts or one combined detectable phase?

37. Should signals obey light travel time? (Recommended: yes.)

38. Should a signal remain in transit after its sender disappears? (Recommended: yes.)

39. What counts as contact: receiving any signal, receiving a signal while able to understand it, exchanging messages, physical encounter, or multiple selectable definitions?

40. Should interstellar expansion use a fixed fraction of light speed, user controlled speed, or a probability that a civilization expands at all plus a fixed default speed?

41. Should expansion include launch delays, settlement delays, and failed colonies?

42. Can an expanding civilization transform already inhabited systems, coexist, avoid them, or is interaction abstracted?

43. Should civilizations compete or fight, or should the first release focus only on survival and contact? (Recommended: no warfare in the first release.)

44. Should the model include stellar birth and death, or begin with a fixed mature galaxy?

45. What time horizon should a run cover: 1 billion years, 5 billion years, 10 billion years, the age of the galaxy, or selectable?

46. Should the simulation begin at galaxy formation, at the present era, or at an abstract year zero?

47. Should Earth appear as a fixed reference point?

48. If Earth appears, should humanity be modeled as one ordinary civilization, a highlighted observer, or not simulated?

49. Should the model allow civilizations to become permanently quiet but remain alive?

50. Should machine civilizations, post biological civilizations, or transcendent civilizations be represented, abstracted as survival, or excluded?

51. Should colonized worlds count as one civilization network or many daughter civilizations?

52. Should the model show uncertainty bands or Monte Carlo batches, rather than presenting one run as representative?

53. Should visitors be able to run the same settings across 10, 100, or 1,000 seeds and view contact frequency?

54. Should the final report identify the strongest filter in that run?

55. Should the final report distinguish a filter before humanity from a possible filter ahead of humanity?

56. Are there scientific sources, authors, papers, or interpretations you specifically want included or avoided?

## D. Controls and operation

57. Keep six main controls, or expose seven by making self destruction separate from survival?

58. Should controls display percentages, qualitative labels, scientific notation, expected waiting time, or a mix?

59. Should probability sliders use a logarithmic scale where values span many orders of magnitude? (Recommended: yes, with plain language labels.)

60. Which controls belong in the basic panel?

61. Which controls belong only in advanced settings?

62. Should a visitor be able to edit settings while a run is active?

63. If settings change during a run, should the simulation continue, restart automatically, or require confirmation?

64. Required speed controls: pause, normal, 10 times, 100 times, 1,000 times, maximum, or a continuous speed slider?

65. Should there be a single event step button?

66. Should there be a timeline scrubber that can rewind, or only replay from the beginning? (Recommended for first release: replay, no arbitrary rewind.)

67. Should the visitor be able to save named scenarios locally?

68. Should the last scenario automatically restore on the next visit?

69. Should a shared address include the seed and all settings? (Recommended: yes.)

70. Should a shared address open in a ready state, or immediately start playback?

71. Should visitors be able to export a run as JSON?

72. Should visitors be able to export a still image of the galaxy and results?

73. Should visitors be able to compare two scenarios side by side?

74. Should the application include curated presets? Which preset names from the art direction file do you like?

75. Should each civilization receive a generated name, a catalog number, a coordinate, or no label until selected?

76. When a civilization is selected, how much history should appear: state only, short biography, full event timeline, or scientific data card?

77. Should rare contact events pause the simulation automatically?

78. Should rare contact events trigger a focused camera movement?

79. Should the event ledger show every event, important events only, or user selectable filters?

80. Should visitors be able to hide educational labels for a pure visual mode?

## E. Visual design

81. Which direction is closest: Observatory Elegy, SETI Terminal, Cosmic Atlas, or a blend? (Recommended: Observatory Elegy plus Cosmic Atlas.)

82. Should the galaxy resemble a spiral, barred spiral, elliptical, irregular, or user selectable form?

83. Should the screen show star connection patterns, or would that confuse nearby sky patterns with galactic structure?

84. Do you want a custom mark or logo for the project?

85. Should the title use all capitals?

86. Do you prefer a modern scientific typeface, a mono terminal face, an editorial museum face, or a blend?

87. Should the interface use panels that feel physical, glass like, flat, or nearly invisible?

88. How bright should civilization events be: restrained, cinematic, or dramatic?

89. How should extinction look: fade, collapse inward, fragment, cool to gray, or disappear instantly? (Recommended: cool and fade.)

90. How should communication look: rings, spherical shells, pulsing lines, directional beams, or an abstract glow?

91. How should interstellar travel look: expanding region, branching routes, moving points, or subtle frontier line?

92. Should civilization colors indicate developmental stage, fate, origin family, or no categorical color?

93. Should the palette be color vision safe even if it reduces some cinematic effects? (Recommended: yes.)

94. Should the visual style include coordinate grids, time marks, spectra, or telescope style annotations?

95. Should the galaxy slowly rotate, drift, remain fixed, or respond to pointer movement?

96. Should the opening screen include the whole control panel immediately or reveal it after the first action?

97. Should the simulation support true full screen mode?

98. Should the application include a screenshot ready clean mode with interface panels hidden?

## F. Sound and tone

99. Should the first release include sound?

100. If yes, should sound be ambient only, event tones, interface tones, or all three?

101. Sound must begin muted until user activation. Is that acceptable?

102. Should a contact event have a distinct sound?

103. Should extinction events have sound, or would that become emotionally heavy and noisy?

104. How much humor should appear: almost none, occasional dry lines, frequent wit, or dark cosmic humor?

105. Are there phrases or tonal styles the project should never use?

106. Should the event ledger use terse scientific language or small narrative fragments?

## G. Education, sources, and copy

107. Should explanations appear in tooltips, a side drawer, dedicated pages, or all three?

108. Should the site include a brief definition of the Fermi paradox before the first run?

109. Should it explain the Drake equation and distinguish this model from it?

110. Should it explain that absence of detection is not proof of absence?

111. Should equations be visible in an advanced model panel?

112. Should every core parameter have citations?

113. Should sources use footnotes, a bibliography, inline source links, or a dedicated Sources panel?

114. Should the site include a model limitations section in plain language? (Recommended: yes.)

115. Should the site include an About Fred or About NixFred section?

116. Is the supplied card copy final, or should it be tightened for the LABS index?

117. Should the line about missing each other by a few million years appear on the project page?

118. Should the final report use poetic summary lines, strictly scientific language, or both?

## H. Privacy, analytics, and shared data

119. Should the site use analytics? None, Cloudflare Web Analytics, or another approved service?

120. Should there be no cookies and no consent banner? (Recommended: yes, if analytics permits.)

121. Should the site collect anonymous performance metrics?

122. Should the site collect client error reports?

123. Should shared scenarios exist only in the address, or be stored in a public gallery?

124. If a public gallery exists, can visitors name scenarios?

125. If a public gallery exists, is moderation required before public display?

126. Should there be a feedback form?

127. Should any form require CAPTCHA or Cloudflare Turnstile?

128. Should local preferences include sound, motion, panel position, last seed, and last settings?

129. Should a clear local data button appear in the About or Privacy panel?

130. Should a privacy page be part of the site even when no personal data is intentionally collected?

## I. GitHub, Cloudflare, and release policy

131. Which exact GitHub owner should Larry use?

132. Confirm `filter` as the repository name.

133. Confirm `main` as the production branch.

134. Should pull requests be mandatory after initial creation?

135. Who must approve production changes?

136. Should production deployment require a manual GitHub environment approval, or deploy automatically after merge?

137. Should preview deployments be public or protected with Cloudflare Access?

138. Should previews deploy for pull requests from forks? (Recommended: no credentials for untrusted forks.)

139. Should the production `pages.dev` address remain accessible, redirect to the custom domain, or be access restricted?

140. Confirm `filter.nixfred.com` will be attached directly to the `filter` Pages project as its canonical custom domain. Yes or no?

141. Is the `nixfred.com` zone already managed by the same Cloudflare account Larry can access?

142. Should DNS and custom domain setup be automated through available APIs when safe, or performed through Wrangler plus the Cloudflare dashboard as needed?

143. Use npm, pnpm, yarn, or Bun? (Recommended: npm for the first release.)

144. Use React with Vite, or do you have another preferred frontend stack?

145. If rendering is two dimensional, prefer PixiJS, direct WebGL, or Canvas 2D with capability based fallback?

146. If rendering is three dimensional, is Three.js acceptable?

147. Should the repository use GitHub Issues and Discussions?

148. Should Dependabot open weekly update pull requests?

149. Should release tags use semantic versions such as `v1.0.0`, or dates such as `2026.07.1`?

150. How long should GitHub build and test artifacts be retained?

151. Should source maps be uploaded privately to an error service, omitted, or published?

152. Should production have a health check route even though it is static?

153. Which browsers must be explicitly supported?

154. What is the oldest mobile hardware class that should remain usable?

## J. Launch, discoverability, and maintenance

155. Is there a target launch date?

156. Should the site be indexed by search engines immediately?

157. What title and description should appear in search results?

158. What should the social preview image communicate?

159. Should the social preview show a generated galaxy, the logo, the control panel, or a dramatic contact event?

160. Should the project support install as a progressive web application?

161. Should it work offline after the first visit?

162. Should the simulation be embeddable in another site?

163. Should the LABS card open in the same tab or a new tab?

164. Should the site include share buttons, a copy address action, or both?

165. Which social platforms matter for metadata testing?

166. Should there be a launch announcement page or change log entry?

167. Who owns ongoing maintenance?

168. How often should dependencies and production behavior be reviewed?

169. Should the application include an experimental badge until the model is considered stable?

170. What exact conditions will make you say, **This is finished and ready to launch**?


<!-- FILE: 06_DECISION_REGISTER.md -->

# INITIAL DECISION REGISTER

This register records what is decided, what is recommended, and what requires Fred's answer.

| Area | Decision | Status |
|---|---|---|
| Public title | The Great Filter | Decided |
| Category | LABS | Decided |
| Canonical address | filter.nixfred.com | Assumed from latest direction |
| Old address | filter.nixfred.com | Open |
| Git source | GitHub | Decided |
| Deployment orchestrator | GitHub Actions | Decided |
| Hosting | Cloudflare Pages | Decided |
| Deployment tool | Wrangler | Decided |
| Cloudflare project type | Direct Upload | Recommended and aligned with requested workflow |
| Production branch | main | Recommended |
| Repository name | filter | Recommended |
| Frontend | React, TypeScript, Vite | Recommended |
| Renderer | WebGL primary, fallback renderer | Recommended |
| Visual dimensionality | Two dimensional with depth effects | Recommended |
| Simulation execution | Web Worker | Recommended |
| Randomness | Deterministic seeded generator | Recommended |
| Simulation architecture | Event driven, versioned | Recommended |
| Data persistence | URL plus local storage | Recommended |
| User accounts | None | Recommended |
| Database | None for first release | Recommended |
| Analytics | None or Cloudflare Web Analytics | Open |
| Public scenario gallery | No for first release | Recommended |
| Art direction | Observatory Elegy plus Cosmic Atlas | Recommended |
| Sound | Optional, muted until activation | Open |
| Scientific depth | Grounded educational model | Recommended |
| Contact model | Causal overlap with light travel | Recommended |
| Main control count | Six or seven | Open |
| Earth reference | Open | Open |
| Repository visibility | Open | Open |
| License | Open | Open |
| Preview access | Public or Cloudflare Access | Open |
| Production approval | Automatic or manual | Open |
| Old domain redirect | Open | Open |
| Search indexing | Open | Open |
| PWA and offline | Open | Open |
| Launch date | Open | Open |

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

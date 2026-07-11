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

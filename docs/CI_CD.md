# CI/CD Delivery Contract

The Great Filter, `filter.nixfred.com`. This document is the authoritative delivery contract for the GitHub Actions automation that installs, validates, builds, previews, ships, and verifies the production site. It specifies each of the five workflows precisely enough for the implementing `/goal` session to write the YAML without guessing, and it is the source of truth for job names, permissions, concurrency, caching, secrets, branch protection, and the Wrangler configuration.

Requirement identifiers are stable and are referenced inline throughout. This document implements INT001, INT002, INT005, INT006, OPS001, OPS002, SEC004, SEC005, SEC006, SEC008, and packet file `03_CICD_FUNCTIONAL_REQUIREMENTS.md` sections 2 through 12. Binding rulings F001, F003, F004, R003, R005, R011, R012, and R013 apply.

The canonical job names in this document are verbatim from the common charter and must not be renamed. Branch protection depends on them (section 6).

## 1. Fixed delivery facts

| Property | Value | Source |
|----------|-------|--------|
| Source repository | `nixfred/filter`, public, MIT LICENSE | F001, INT001 |
| Automation system | GitHub Actions, five workflows | INT002 |
| Deploy tool | Wrangler Direct Upload, never Pages git integration | R003, R013 |
| Cloudflare Pages project | `filter` | R003 |
| Production branch | `main` | INT003 |
| Build output directory | `dist` | INT004 |
| Production custom domain | `filter.nixfred.com` | INT003 |
| Retained fallback address | the generated `*.pages.dev` address | packet 03 section 12 |
| CI runtime | Node, pinned in `.nvmrc` and the `NODE_VERSION` variable | OPS002 |
| Package manager | npm with committed `package-lock.json`, `npm ci` in CI | F003, OPS002 |
| Analytics | Cloudflare Web Analytics beacon, production only | F004, INT006 |

Direct Upload is a deliberate choice, recorded here and in `docs/deployment.md`. The Pages project has no connected Git repository. Every deployment goes through GitHub Actions and Wrangler, never Pages Git integration, so validation always precedes any upload to Cloudflare.

## 2. Canonical workflow set

Exactly five workflows exist. No workflow may be added, renamed, or merged without a recorded ruling (INT002).

| # | Workflow file | Responsibility | Deploys | Reason it is separate |
|---|---------------|----------------|---------|-----------------------|
| 1 | `.github/workflows/ci.yml` | Install, validate, build, and check the pull request or `main` commit. Produces test and build artifacts. Never deploys. | No | Runs proposed pull request code, so it holds read only permission and receives no deployment secret (packet 03 section 6 item 8). |
| 2 | `.github/workflows/dependency_review.yml` | Block newly introduced vulnerable dependencies at the approved severity threshold on pull requests that change the manifest or lock file. | No | Needs `pull-requests: read` and the dependency review action, distinct from CI validation (SEC004). |
| 3 | `.github/workflows/codeql.yml` | CodeQL static analysis for JavaScript and TypeScript on pull requests, pushes to `main`, and a weekly schedule. | No | Needs `security-events: write`, an elevated scope kept out of `ci.yml` (SEC005). |
| 4 | `.github/workflows/deploy_preview.yml` | Build the pull request commit and deploy it to an isolated preview branch alias, behind Cloudflare Access, noindexed. | Preview | Needs the `preview` environment secret and pull request write, a different permission profile than `ci.yml` (SEC008, R012). |
| 5 | `.github/workflows/deploy_production.yml` | On green `main`, run the quality gate, deploy `dist` to production, and verify the custom domain. | Production | Highest privilege. Bound to the `production` environment and to `main` only (R011, OPS005). |

Rollback is not a workflow. It is a documented manual procedure in `docs/OPERATIONS.md` section 3, because production deploys automatically on green `main` (R011) and Cloudflare restores a prior deployment without rebuilding (OPS004). Scheduled security scanning lives in `codeql.yml`; scheduled dependency and browser compatibility review is a documented monthly cadence in `docs/OPERATIONS.md` (OPS008). This keeps the set at exactly five (INT002).

## 3. Shared conventions

These conventions apply to every workflow. They exist once here so the per workflow sections stay short.

### 3.1 Least privilege permissions

Every workflow declares `permissions: {}` at the top level to remove all default grants, then each job re-grants only the scopes it uses (INT002). No job receives `write` on a scope it does not exercise. The exact grants are listed per workflow and summarized in section 10.

### 3.2 Third party action pinning

Every third party action is pinned to a full length immutable commit SHA, annotated with the human readable release, for example `actions/setup-node@<40charSHA> # v4.0.3` (SEC007). Actions published by GitHub itself (`actions/*`, `github/codeql-action`) are pinned the same way for uniformity. The pinned SHAs are resolved at wiring time by the implementing session and recorded in `docs/DECISIONS.md`. Dependabot keeps them current (section 3.8). The action inventory to pin is: `actions/checkout`, `actions/setup-node`, `actions/upload-artifact`, `actions/download-artifact`, `actions/github-script`, `cloudflare/wrangler-action`, `github/codeql-action` (init and analyze), and `actions/dependency-review-action`. No production application code is loaded from an unpinned content delivery network (SEC007).

### 3.3 Concurrency

Every workflow sets a concurrency group so superseded runs do not race (INT002, packet 03 section 6 item 4).

| Workflow | Group | Cancel in progress | Reason |
|----------|-------|--------------------|--------|
| `ci.yml` | `ci-${{ github.workflow }}-${{ github.ref }}` | true for pull requests, false for `main` | Cancel superseded pull request runs to save minutes. Never cancel a `main` validation that a production deploy depends on. |
| `dependency_review.yml` | `depreview-${{ github.ref }}` | true | Only the newest dependency diff per ref matters. |
| `codeql.yml` | `codeql-${{ github.ref }}` | true | The latest scan per ref is sufficient. |
| `deploy_preview.yml` | `preview-${{ github.event.pull_request.number }}` | true | Only the latest commit on a pull request needs a live preview. A newer preview supersedes an older run for the same pull request (packet 03 section 8 item 11). |
| `deploy_production.yml` | `production-deploy` | false | A production deployment must finish. It is never cancelled after the upload begins unless the workflow is known to be safe to cancel (packet 03 section 9 items 11 and 12). |

### 3.4 Node runtime and npm caching

Node is pinned in `.nvmrc` and consumed by `actions/setup-node` using the `NODE_VERSION` variable, so the local and CI runtime match (OPS002, packet 03 section 4 item 1). Every install job runs `npm ci` against the committed `package-lock.json`, never `npm install`, so dependency resolution is reproducible (F003, packet 03 section 4 items 2 and 3). `actions/setup-node` caches the npm cache directory keyed on `package-lock.json`, so warm runs skip re-download (INT002, packet 03 section 6 item 2). Direct dependencies are pinned to explicit versions and the lock file is committed (SEC007).

### 3.5 GitHub environments

Two environments gate secret access by deployment stage (packet 03 section 10 items 2 and 3):

- `production`. Holds the production Cloudflare secrets. Its deployment branch policy restricts it to `main` only, so no branch or fork can reach production secrets. Required reviewers are intentionally empty, because merging to `main` with all required checks green deploys production automatically with no approval prompt (R011). Referenced by `deploy_production.yml`.
- `preview`. Holds the preview scoped Cloudflare token used to publish preview deployments. Referenced by `deploy_preview.yml`. Fork triggered runs never receive these secrets (section 5.4), which satisfies "fork PRs get no credentials" (SEC008, packet 03 section 10 item 6 context).

### 3.6 Secrets and variables

Secret names only appear anywhere in this repository. No secret value is ever written to a tracked file, a workflow log, a test report, a `.env` file, a `.dev.vars` file, or browser code (SEC001, packet 03 section 10 items 5 and 6). Local secret files are ignored by Git (packet 03 section 10 item 6).

Environment secrets, stored in the environments above:

| Secret name | Scope intent | Used by |
|-------------|--------------|---------|
| `CLOUDFLARE_API_TOKEN` | Scoped as narrowly as practical to Cloudflare Pages deployment for the correct account, nothing more (packet 03 section 10 item 1). This covers Direct Upload and, where used, the deployment listing and rollback API. | `preview`, `production` |
| `CLOUDFLARE_ACCOUNT_ID` | The Cloudflare account identifier. Not a credential and cannot authenticate on its own, but the packet lists it among protected values, so it is provided to CI as an environment secret rather than inlined. The literal identifier is recorded as a non secret fact in `docs/deployment.md`. | `preview`, `production` |

Repository variables, non secret, may appear in logs:

| Variable name | Value | Purpose |
|---------------|-------|---------|
| `CLOUDFLARE_PAGES_PROJECT` | `filter` | Wrangler project name for every deploy (R003). |
| `PRODUCTION_DOMAIN` | `filter.nixfred.com` | Target of the post deploy smoke test (INT003). |
| `NODE_VERSION` | the pinned Node major version matching `.nvmrc` | `actions/setup-node` input (OPS002). |

The local Wrangler token limitation is load bearing. Per `docs/INTAKE.md` section 3, the scoped environment token used locally fails on the `/memberships` route, so `wrangler pages project list` cannot enumerate the account, but direct Pages API calls succeed. Every Wrangler deploy in CI and locally must therefore pass the account identifier explicitly through `CLOUDFLARE_ACCOUNT_ID` in the job environment rather than relying on membership discovery. This honors standing law 15, do not mask OAuth with a weaker environment token, and matches the calc.nixfred.com precedent. See `docs/deployment.md` for the operational detail.

### 3.7 Blocking versus warning

A blocking outcome fails the workflow and prevents merge or promotion. A warning outcome annotates the job summary but does not fail. Blocking: formatting drift, lint errors, type errors, unit test failures, simulation determinism failures, simulation property and invariant failures, coverage below the floors in NFR009 (85 percent simulation domain, 80 percent overall), production build failure, browser smoke failure, and accessibility failure on core flows (NFR010, packet 03 section 15). New high severity dependency findings block (SEC004). New high severity CodeQL findings block merge (SEC005). Warnings: small performance regressions, and bundle budget violations against the draft ceilings until they are calibrated and approved at gate G7, after which a bundle budget violation blocks (R024, section 5.1 `bundle_budget`, pending item P004). A warning is recorded and visible but does not stop the current gate. Lighthouse audits are not a merge gate; they run post deploy and on a monthly cadence (section 5.5).

### 3.8 Dependabot automation

`.github/dependabot.yml` opens weekly grouped pull requests for the npm ecosystem and for GitHub Actions (INT005, packet 03 section 4 items 5 to 7). Low risk development dependency updates are grouped into a single pull request where practical. Major version updates are never merged automatically; they open as individual pull requests for review (INT005). Action bumps flow through `ci.yml`, `dependency_review.yml`, and `codeql.yml` like any other change. Dependency graph and Dependabot are enabled where available (packet 03 section 3 item 9).

### 3.9 Public safety scan before pushes

Before the first public push and before every release, the safety scan in `BUILD.md` section 12.2 runs against the working tree and Git history: API keys, tokens, passwords, private keys, internal hostnames, sensitive private IP addresses, customer confidential information, family information, health information, personal addresses or phone numbers, private email addresses not intended for publication, local filesystem paths containing usernames, debug dumps, environment files, and DNS zone exports (SEC001). The scan is a documented pre push step in `docs/OPERATIONS.md` and is reinforced in CI by a build output scan: after `build` produces `dist`, the `build` job asserts the bundle contains no secret pattern, no local filesystem path containing a username, and no source map unless intentionally approved (SEC001, packet 03 section 13 item 9). A match fails the job before any artifact upload. Public facts Fred already publishes may remain; everything else requires explicit justification.

## 4. npm script contract

The project exposes exactly the packet script set, no more required, no renaming (OPS001, packet 03 section 5). Each script does one thing so a CI job can call it directly.

| Script | Action | Consuming CI job |
|--------|--------|------------------|
| `dev` | Start the Vite development server. | none |
| `build` | Production build: type check, `vite build`, and `scripts/write_build_metadata.mjs` writing `dist/build.json` with commit SHA, build time, application version, and simulation model version (OPS009, R015). | `build` |
| `preview` | Serve the built `dist` locally with `vite preview`. | none, local verification |
| `format` | `prettier --write` across the tree. | none, developer use |
| `format:check` | `prettier --check`, fails on any drift. | `format_check` |
| `lint` | ESLint in strict mode, warnings treated as errors. | `lint` |
| `typecheck` | `tsc --noEmit` across the project references, zero errors. | `typecheck` |
| `test` | `vitest run` over the full unit and integration tree. | none, umbrella for local use |
| `test:unit` | `vitest run` over `tests/unit/**`, an uninstrumented signal without coverage overhead. | `unit_tests` |
| `test:coverage` | `vitest run --coverage` over unit and integration tests, enforcing the NFR009 floors. | `coverage` |
| `test:e2e` | Playwright browser specs under `tests/e2e/**` against the built site. | `browser_smoke` |
| `test:a11y` | Playwright plus axe over `tests/accessibility/core_flows.spec.ts`. | `accessibility_tests` |
| `test:simulation` | `vitest run` over the simulation determinism digests and property and invariant suites, selectable by project so the two CI jobs can filter. | `simulation_determinism`, `simulation_properties` |
| `check:bundle` | `node scripts/check_bundle.mjs`, enforcing the initial JavaScript budget and per asset budget (NFR004). | `bundle_budget` |
| `check:all` | Run every merge blocking local check in the deterministic order below (OPS001). | none, local gate mirror |
| `pages:dev` | `wrangler pages dev dist`, local Pages emulation. | none |
| `pages:deploy:preview` | `wrangler pages deploy dist --project-name "$CLOUDFLARE_PAGES_PROJECT" --branch "<alias>"`, account id supplied through `CLOUDFLARE_ACCOUNT_ID` in the environment. | `deploy_preview` |
| `pages:deploy:production` | `wrangler pages deploy dist --project-name "$CLOUDFLARE_PAGES_PROJECT" --branch main`, account id supplied through `CLOUDFLARE_ACCOUNT_ID` in the environment. | `deploy_production` |

`check:all` runs in this exact, deterministic order so local and CI outcomes agree (OPS001, packet 03 section 5 final clause):

1. `format:check`
2. `lint`
3. `typecheck`
4. `test:simulation`
5. `test:coverage`
6. `build`
7. `check:bundle`
8. `test:e2e`
9. `test:a11y`

`check:all` runs `test:coverage` rather than `test:unit` at step 5 because coverage instrumentation runs the same unit and integration tests while also enforcing the NFR009 floors, so a separate `test:unit` pass would be redundant locally. CI keeps `unit_tests` and `coverage` as distinct jobs for an uninstrumented signal and clearer failure attribution.

## 5. Workflow contracts

### 5.1 `ci.yml`, install, validate, build

Triggers (packet 03 section 6):

1. `pull_request` opened
2. `pull_request` synchronized
3. `pull_request` reopened
4. `pull_request` ready for review
5. `push` to `main`

Permissions: top level `permissions: {}`, every job `contents: read` only. This workflow executes proposed pull request code, so it is intentionally powerless and receives no secret (packet 03 section 6 item 8, SEC008 context). This workflow never deploys (packet 03 section 6 item 8).

Jobs, using the canonical names exactly. The first job installs and the rest depend on it so the lock file is resolved once and the npm cache is warm:

| Job name | Command | Blocks | Notes |
|----------|---------|--------|-------|
| `install` | `npm ci` against `package-lock.json`, warms the setup-node cache | yes | Foundation job. Uploads no artifact. Every later job restores the same cache (packet 03 section 6 items 1 and 2). |
| `format_check` | `npm run format:check` | yes | Zero formatting drift (NFR010). |
| `lint` | `npm run lint` | yes | Strict, warnings as errors (NFR010, packet 03 section 6 item 6). |
| `typecheck` | `npm run typecheck` | yes | Zero TypeScript errors (NFR010). |
| `unit_tests` | `npm run test:unit` | yes | Unit suite, uninstrumented signal. |
| `simulation_determinism` | `npm run test:simulation` path filtered to `determinism.test.ts` | yes | Same seed, parameters, and model version produce the identical committed digest (FR017, FR033). Determinism critical math uses integer or fixed point arithmetic, never engine transcendental functions, per hard rule 8. Deliberately re-runs specs that `unit_tests` also covers so GATES.md can point FR017 and FR033 at a named required check (`docs/TEST_PLAN.md` section 8). |
| `simulation_properties` | `npm run test:simulation` path filtered to `invariants.test.ts` | yes | No event before its cause, no signal faster than the causal speed, extinct civilizations silent unless a delayed signal is still in transit, invalid input rejected or clamped deterministically (FR022, FR025, FR020, FR026). Deliberately re-runs specs that `unit_tests` also covers so GATES.md can point FR025 at a named required check (`docs/TEST_PLAN.md` section 8). |
| `coverage` | `npm run test:coverage` | yes | Enforces at least 85 percent line coverage for the simulation domain and 80 percent overall (NFR009). |
| `build` | `npm run build`, then the build output secret and path scan of section 3.9 | yes | Production build succeeds with no unresolved asset reference, writes `dist/build.json`, and passes the output scan (packet 03 section 15 item 10, SEC001). |
| `bundle_budget` | `npm run check:bundle` against the built `dist` | warn until G7, then yes | Runs `scripts/check_bundle.mjs` against the draft ceilings in `docs/TEST_PLAN.md` section 7 (initial route JavaScript gzip 300 KB, single JavaScript chunk 180 KB, single non JavaScript asset 512 KB), all marked policy targets, not measurements. Until the first real production build calibrates them and Fred approves, the job annotates a violation but exits zero (WARN, `continue-on-error`). At gate G7 the approved calibrated ceilings become blocking (NFR004, R024, packet 03 section 15 items 11 and 12). See ruling R024 and pending item P004. |
| `browser_smoke` | `npm run test:e2e` against the built site served locally | yes | Onboarding, default run to the Silence Report, pause and resume, speed change, select and inspect, share and reopen, keyboard path, reduced motion, mobile layout, fallback renderer, error recovery (packet 03 section 17 browser tests). Playwright projects: `chromium`, `firefox`, `webkit`, `mobile-safari`, `mobile-chrome`. Edge is Chromium based, covered by `chromium` plus the periodic `msedge` channel run in `docs/OPERATIONS.md` section 6. Retries are 0 so flakiness surfaces (NFR010). |
| `accessibility_tests` | `npm run test:a11y` against core flows | yes | Automated accessibility checks on the core path pass (ACC005, packet 03 section 15 item 8). Retries are 0 so flakiness surfaces (NFR010). |

Artifact policy: on failure, `browser_smoke`, `accessibility_tests`, `coverage`, and `build` upload their diagnostic reports (test output, Playwright traces, coverage report, and the built `dist` where relevant) so a failure is reproducible (packet 03 section 6 item 13). The default retention for these failure diagnostics is 14 days, a value Fred can change (OPS010). On success `ci.yml` uploads no long lived artifact; `deploy_production.yml` produces and retains the production build artifact (section 5.5). A concise failure summary is written to the job summary (packet 03 section 6 item 7).

Caching, least privilege, unique stable job names, strict mode, and cancel of superseded pull request runs are inherited from section 3.

### 5.2 `dependency_review.yml`, block vulnerable dependencies

Trigger: `pull_request` events that change `package.json` or `package-lock.json` (SEC004, packet 03 section 7).

Permissions: top level `permissions: {}`, one job with `contents: read` and `pull-requests: read`.

Behavior:

1. Run `actions/dependency-review-action` over the pull request dependency diff.
2. Fail on any newly introduced dependency at or above the approved severity threshold, high by default (SEC004). A dated exception in `docs/DECISIONS.md` is the only way past a finding.
3. Report license policy violations only if Fred selects a license policy; none is configured by default (packet 03 section 7 item 3).

This workflow is the pull request time supplement. The full tree dependency posture is maintained by Dependabot (section 3.8) and the pinned lock file (SEC007).

### 5.3 `codeql.yml`, code scanning

Triggers: `pull_request`, `push` to `main`, and `schedule` weekly (SEC005, packet 03 section 7 CodeQL block).

Permissions: top level `permissions: {}`, the analysis job holds `security-events: write` and `contents: read`.

Behavior:

1. Initialize CodeQL for the `javascript-typescript` language pack when repository visibility and plan support it (packet 03 section 7 CodeQL item 1). A public repository under F001 supports code scanning.
2. Autobuild or run the build command, then analyze.
3. Upload results as code scanning alerts.
4. A newly introduced high severity finding is merge blocking (SEC005, packet 03 section 7 CodeQL item 3). Branch protection enforces this by requiring the CodeQL check.

### 5.4 `deploy_preview.yml`, isolated protected preview

Triggers (packet 03 section 8): `pull_request` opened, synchronized, reopened, and `workflow_dispatch` for recovery.

Environment: `preview`. Cloudflare credentials are available only to this deployment job (packet 03 section 8 precondition 3).

Permissions: top level `permissions: {}`, the single `deploy_preview` job holds `deployments: write` (the GitHub deployment record), `pull-requests: write` (the preview comment), and `contents: read`.

Fork isolation guard: the `deploy_preview` job runs only when the pull request head repository equals the base repository, or on manual dispatch:

```yaml
if: >
  github.event_name == 'workflow_dispatch' ||
  github.event.pull_request.head.repo.full_name == github.repository
```

A fork pull request never reaches the deploy job, so it never receives a Cloudflare credential (SEC008, packet 03 section 8 precondition 2). This is the trusted branch policy until Fred approves outside contribution.

`deploy_preview` job steps, in order:

1. Check out the exact pull request commit (packet 03 section 8 behavior 1).
2. `npm ci` (packet 03 section 8 behavior 2).
3. `npm run build` for the pull request commit, with the noindex preview condition set so `dist/build.json`, the `robots` policy, and the `X-Robots-Tag` header all mark the build noindex (packet 03 section 8 behavior 8, R005).
4. Deploy `dist` with `cloudflare/wrangler-action` running `pages:deploy:preview` to a branch alias derived from the pull request number, `preview-pr-${{ github.event.pull_request.number }}`, on the Pages project `filter` (packet 03 section 8 behaviors 4 and 5, R003). The account id is passed through `CLOUDFLARE_ACCOUNT_ID` in the job environment (section 3.6).
5. Create or update the GitHub deployment record for the `preview` environment (packet 03 section 8 behavior 6).
6. Update a single pull request comment with the preview URL and the commit identifier, rather than posting a new comment per commit (packet 03 section 8 behavior 7).
7. Verify the preview is not indexable by checking both the `X-Robots-Tag: noindex` response header and the `robots` meta tag on the live preview URL (packet 03 section 8 behavior 8, R005, SEC008).

Constraints, enforced by construction:

- The production custom domain is never bound to a preview (packet 03 section 8 behavior 9, SEC008).
- No production only variable is exposed to previews; the job reads only the `preview` environment and the non secret variables (packet 03 section 8 behavior 12, SEC008).
- Previews are protected by Cloudflare Access until Fred explicitly opens them (R012, PENDING P001). Access is configured once on the Pages project preview deployments so every `*.pages.dev` preview requires a one time PIN to `frednix@gmail.com`; the configuration procedure is in `docs/deployment.md`. Public previews are enabled only if Fred resolves P001 in favor of public access, a one line change to the Access policy.

Precondition note. Packet 03 section 8 precondition 1 requires that CI jobs pass before a preview is trusted. `ci.yml` runs on the same pull request in parallel, and branch protection (section 6) blocks merge until all twelve CI contexts are green, so no unvalidated commit reaches `main`. The preview itself is a pre merge review artifact, isolated by Cloudflare Access and noindex, and its own build step fails on the same broken code that would fail CI. A stricter `workflow_run` gate on `ci.yml` success is an available hardening if outside contribution ever begins; it is recorded here as the upgrade path.

### 5.5 `deploy_production.yml`, quality gate, deploy, verify

Triggers (packet 03 section 9): `push` to `main`, and `workflow_dispatch` for an authorized manual run.

Environment: `production`, address `https://filter.nixfred.com` (OPS005, packet 03 section 9 behavior 7). No required reviewers, so a green merge to `main` deploys automatically (R011). Concurrency group `production-deploy`, never cancelled after upload begins (section 3.3).

Permissions: top level `permissions: {}`. Job grants are the minimum each job needs, listed below.

Three jobs run in strict order. The workflow stops at the first hard failure.

#### `quality_gate`

Permissions: `contents: read`.

Runs the full production quality gate on the exact `main` commit before anything is built for deployment (packet 03 section 9 behavior 3): `npm ci`, then `npm run check:all` (section 4). This re-verifies formatting, lint, types, simulation determinism, simulation properties, coverage floors, the production build, the bundle budget, browser smoke, and accessibility. A failure here fails the workflow and nothing deploys.

#### `deploy_production`

`needs: quality_gate`. Permissions: `deployments: write`, `contents: read`.

Steps, in order:

1. Check out the exact `main` commit (packet 03 section 9 behavior 1).
2. `npm ci`, then `npm run build` once, producing `dist` with `dist/build.json` carrying the commit SHA, build time, application version, and simulation model version (packet 03 section 9 behaviors 2 and 4, OPS005, OPS009, R015).
3. Upload the production build artifact `filter-dist-${{ github.sha }}` and retain it for 90 days by default, a value Fred can change (packet 03 section 9 behavior 5, OPS010). This artifact is the fallback rollback source in `docs/OPERATIONS.md` section 3.4.
4. Deploy `dist` with `cloudflare/wrangler-action` running `pages:deploy:production` on the Pages project `filter`, production branch `main`, account id supplied through `CLOUDFLARE_ACCOUNT_ID` (packet 03 section 9 behavior 6, R003). Capture the returned Cloudflare deployment identifier and the production `*.pages.dev` URL.
5. Write the deployment record to the job summary and update the GitHub deployment status. The record contains, per OPS005: the commit SHA, the build time, the application version, the simulation model version, and the Cloudflare deployment identifier, with the environment address `https://filter.nixfred.com`. The same fields are mirrored into the deployment log in `docs/deployment.md` on release.

#### `post_deploy_smoke`

`needs: deploy_production`. Permissions: `deployments: write`, `issues: write` (open an incident issue on failure, OPS007).

Runs the post deploy smoke test of section 7 against the custom domain `https://filter.nixfred.com` (OPS006, packet 03 section 9 behaviors 9 and 10), using the Playwright `production-smoke` project (`npm run test:e2e -- --project=production-smoke`). A failure of the custom domain, a key asset, or the critical interaction path fails the workflow, marks the GitHub deployment failed, and opens an incident issue with the run URL and the failing assertion (OPS007). Recovery is the rollback procedure in `docs/OPERATIONS.md` section 3, which restores the previous Cloudflare deployment without rebuilding (OPS004). The workflow never rewrites `main` to recover (packet 03 section 19 item 7).

This job also runs the Lighthouse audit (NFR005) via `lhci autorun` with `lighthouserc.json` against the custom domain. Lighthouse is deliberately not a canonical `ci.yml` job and never a pull request merge gate, because environment sensitive Lighthouse scores would make a required check flaky and could deadlock the automatic production deploy under R011 (R023, RK13). Category classification per R023 and the R024 defaults, pending Fred confirmation in P004: accessibility 1.00, best practices 0.95, and SEO 0.90 are blocking within this post deploy job, so a regression fails the workflow and opens an incident; the performance category floor 0.80 is advisory, recorded and visible but never failing. The deterministic merge time performance gate remains `bundle_budget` (NFR004) and the manual mobile frame rate protocol (NFR001) covers runtime performance, per R023. Lighthouse also runs on the monthly cadence in `docs/OPERATIONS.md` section 6.

## 6. Branch protection specification

Branch protection on `main` is configured through the GitHub API (`docs/OPERATIONS.md` records the exact call) and enforces INT001 and packet 03 section 3.

Required status check contexts, matching the canonical CI job names from section 5.1 exactly, so a required check is never ambiguous (INT001, packet 03 section 3 items 3 and 6):

```text
install
format_check
lint
typecheck
unit_tests
simulation_determinism
simulation_properties
coverage
build
bundle_budget
browser_smoke
accessibility_tests
```

CodeQL adds its own check context from `codeql.yml`; a new high severity finding blocks merge (SEC005). Dependency review from `dependency_review.yml` blocks merge on a finding at or above the threshold (SEC004).

Additional protection settings:

- `strict: true`, so a branch must be current with `main` before merge.
- Force pushes blocked and branch deletion blocked on `main` (packet 03 section 3 item 4).
- Required conversation resolution before merge (INT001, packet 03 section 3 item 5).
- Squash merge is the default and only merge method (INT001, packet 03 section 3 item 7).
- Merged feature branches are deleted automatically (INT001, packet 03 section 3 item 8).
- Pull requests are required for normal changes, with zero required human approvals; the automated required checks are the approval (R011, packet 03 section 3 item 2).
- `enforce_admins` is false, so Fred retains an emergency administrative path.
- GitHub secret scanning and push protection are enabled on the repository (SEC006, packet 03 section 3 item 10).
- `CODEOWNERS` requests Fred as reviewer where ownership is known (INT007, packet 03 section 3 item 11).

Activation timing, aligned with the intake alignment note in `docs/INTAKE.md` section 4 and R004. Branch protection activates at gate G6, the CI/CD phase. The planning pack and the initial scaffold commits before G6 land directly on `main`, because protection cannot require checks that do not yet exist. From G6 onward, `/goal` works through pull requests and every change satisfies the required contexts above. This is deliberate, not a gap.

## 7. Post deploy smoke test definition

The smoke test is defined once here and referenced by `deploy_production.yml`, `docs/OPERATIONS.md`, and `docs/deployment.md`. It runs against the custom domain `https://filter.nixfred.com` after every production deploy (OPS006). Any failing assertion fails the workflow (packet 03 section 9 behavior 10).

Assertions:

1. `https://filter.nixfred.com/` returns HTTP 200 over a valid TLS certificate (packet 03 section 21 items 1 and 2).
2. The HTML title contains `The Great Filter` and the `<link rel="canonical">` points at `https://filter.nixfred.com` (packet 03 section 21 item 3).
3. The core JavaScript and CSS bundle assets referenced by the document resolve with HTTP 200 (packet 03 section 15 item 10).
4. The security response headers are present on the custom domain: a Content Security Policy, `X-Content-Type-Options: nosniff`, a `Referrer-Policy`, a `Permissions-Policy`, and frame protection through the policy. The Content Security Policy permits local assets and the Cloudflare Web Analytics beacon origin and nothing else (SEC003, INT006, packet 03 section 21 item 7). The exact header set is owned by `docs/SECURITY_PLAN.md`; this smoke test asserts their presence.
5. `https://filter.nixfred.com/build.json` reports `commit` equal to the deployed `main` commit SHA, proving the visible version matches the deployed commit (OPS005, OPS009, R015). `build.json` is served with a no store cache policy so verification reads the live value.
6. The production `robots` policy allows indexing, and no preview `X-Robots-Tag: noindex` header is present on the custom domain (R005, packet 03 section 21 items 5 and 6).
7. A headless Playwright pass using the `production-smoke` project (`test:e2e -- --project=production-smoke`) against the live domain completes a default run to the Silence Report with no severe browser console error, exercising the critical interaction path (packet 03 section 9 behavior 10, packet 03 section 21 items 9 and 14).
8. A Lighthouse audit via `lhci autorun` with `lighthouserc.json` (NFR005). Accessibility 1.00, best practices 0.95, and SEO 0.90 are blocking; performance 0.80 is advisory and never fails (R023, R024, pending confirmation P004). A blocking category regression fails the workflow and opens an incident.

The fuller seventeen item production acceptance checklist, including the mobile run, reduced motion run, keyboard path, redirect behavior, and the tested rollback, runs at gate G-LAUNCH and is recorded in `docs/OPERATIONS.md` and `docs/GATES.md` (REL002, packet 03 section 21). The smoke test above is the automated critical subset that gates every deploy.

## 8. `wrangler.jsonc` specification

`wrangler.jsonc` is the source of truth for the supported Pages configuration (INT004, packet 03 section 11). Its expected content shape, comments included:

```jsonc
{
  // The Great Filter, Cloudflare Pages Direct Upload configuration.
  // Source of truth for supported Pages settings (INT004, packet 03 section 11).

  // Pages project name. Matches ruling R003 and the CLOUDFLARE_PAGES_PROJECT variable.
  "name": "filter",

  // Static build output that Wrangler uploads. Vite writes here (INT004 item 2).
  "pages_build_output_dir": "./dist",

  // Pinned compatibility date. Bump deliberately, never floating (packet 03 section 11 item 3).
  "compatibility_date": "2026-07-11"

  // No "vars": no runtime variables in v1, and never a secret value here (packet 03 section 11 item 6).
  // No "kv_namespaces", "d1_databases", "r2_buckets", "durable_objects": no bindings in v1 (ruling R013,
  //   packet 03 section 11 item 7 and the default static deployment clause).
  // No Pages Functions: this is a static site with no server logic in v1 (ruling R013).
  // Preview and production differences are added here only when an approved feature needs them,
  //   with a comment explaining each override (packet 03 section 11 items 5 and 8).
}
```

The account identifier is never placed in `wrangler.jsonc`; it is passed to Wrangler through `CLOUDFLARE_ACCOUNT_ID` at deploy time (section 3.6). The default static deployment creates no KV, D1, R2, Durable Objects, or Pages Functions (R013, packet 03 section 11 final clause).

## 9. Job to requirement mapping

| Workflow, job | Enforces |
|---------------|----------|
| `ci.yml` `install` | OPS002, F003, packet 03 section 6 items 1 and 2 |
| `ci.yml` `format_check`, `lint`, `typecheck` | NFR010 |
| `ci.yml` `unit_tests` | packet 03 section 17 unit tests |
| `ci.yml` `simulation_determinism` | FR017, FR033, hard rule 8 |
| `ci.yml` `simulation_properties` | FR020, FR022, FR025, FR026 |
| `ci.yml` `coverage` | NFR009 |
| `ci.yml` `build` plus output scan | SEC001, packet 03 section 15 item 10 |
| `ci.yml` `bundle_budget` | NFR004, R024 (WARN until G7, then BLOCK) |
| `ci.yml` `browser_smoke` | packet 03 section 17 browser tests, NFR010 (retries 0) |
| `ci.yml` `accessibility_tests` | ACC005, NFR010 (retries 0) |
| `dependency_review.yml` | SEC004 |
| `codeql.yml` | SEC005 |
| `deploy_preview.yml` `deploy_preview` | SEC008, R005, R012, INT002 |
| `deploy_production.yml` `quality_gate` | OPS001, NFR010, packet 03 section 9 behavior 3 |
| `deploy_production.yml` `deploy_production` | OPS005, OPS009, OPS010, R003, R011 |
| `deploy_production.yml` `post_deploy_smoke` | OPS006, OPS007, NFR005, R023, packet 03 section 21 |
| branch protection | INT001, SEC004, SEC005, SEC006 |
| all workflows, `permissions: {}` | INT002 |
| all workflows, SHA pinned actions | SEC007 |
| `dependabot.yml` | INT005 |
| Cloudflare Web Analytics beacon, production only | F004, INT006 |

## 10. Permissions summary

| Workflow | Top level | Job grants |
|----------|-----------|-----------|
| `ci.yml` | `{}` | every job `contents: read` |
| `dependency_review.yml` | `{}` | `contents: read`, `pull-requests: read` |
| `codeql.yml` | `{}` | `security-events: write`, `contents: read` |
| `deploy_preview.yml` | `{}` | `deploy_preview`: `deployments: write`, `pull-requests: write`, `contents: read` |
| `deploy_production.yml` | `{}` | `quality_gate`: `contents: read`. `deploy_production`: `deployments: write`, `contents: read`. `post_deploy_smoke`: `deployments: write`, `issues: write` |

## 11. Pending Fred decisions

These do not block the automation; each has a working default that ships if Fred does not change it.

1. Preview access, PENDING P001. Default: previews are protected by Cloudflare Access with a one time PIN to `frednix@gmail.com` (R012). Public previews with noindex remain a one line Access policy change if Fred opts in. Affects SEC008, SEC010.
2. Quality threshold confirmation, PENDING P004, defaults set by R024 and R023. Default: the `bundle_budget` draft ceilings (initial route JavaScript gzip 300 KB, single JavaScript chunk 180 KB, single non JavaScript asset 512 KB) run as WARN until the first production build calibrates them, then promote to BLOCK no later than gate G7; Lighthouse accessibility 1.00, best practices 0.95, and SEO 0.90 block post deploy while performance 0.80 is advisory. Fred confirms or adjusts the calibrated numbers at G7. Affects NFR001, NFR004, NFR005, ACC005.
3. Artifact retention duration, OPS010. Default: the production build artifact is retained 90 days, CI failure diagnostics 14 days. Fred can change either value.
4. Dependency severity threshold, SEC004. Default: high. A different threshold or a license policy is a one line change in `dependency_review.yml` and a recorded ruling.

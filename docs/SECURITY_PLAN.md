# SECURITY PLAN: The Great Filter

Threat model and security controls for filter.nixfred.com. This document folds the manifest `threat_model.md` duties (ruling R001) into a single authority and implements SEC001 through SEC010, DATA002, DATA003, and packet file 03 sections 10, 13, and 21. Every control cites the requirement or ruling it enforces.

Scope note: v1 is a static site with no server logic, no Pages Functions, no KV, D1, R2, or Durable Objects, and no forms (ruling R013). The attack surface is a set of static assets, one Web Worker, an attacker controllable share URL, a Cloudflare Web Analytics beacon (ruling F004), and the GitHub plus Cloudflare delivery pipeline. There is no application backend to exploit in v1.

Banned adjective note: this document avoids the word "secure" as a loose qualifier per the charter and states measurable controls instead.

---

## 1. Assets and trust boundaries

| Asset | Owner | Trust level | Primary risk if compromised |
|---|---|---|---|
| Static site assets (`dist/`, served by Cloudflare Pages) | NixFred | Trusted, published | Malicious code served to every visitor |
| Share URL parameters (model version, seed, parameters) | Visitor supplied | Untrusted input | Hostile or oversized payload, denial of service, injection into DOM sinks |
| Simulation Web Worker (`simulation.worker.ts`) | Trusted code, untrusted input | Trusted code boundary | Worker exhaustion from crafted parameters |
| Cloudflare Web Analytics beacon (F004) | Cloudflare, third party | Trusted origin, external | Third party script origin, privacy exposure |
| Visitor browser (localStorage, DOM) | Visitor | Untrusted environment | Local tampering, cross site scripting |
| GitHub repository nixfred/filter (F001) | NixFred | Trusted, public | Malicious commit, workflow injection, account takeover |
| GitHub Actions CI/CD pipeline | NixFred | Trusted, privileged | Secret exfiltration, supply chain injection at build |
| Cloudflare account and API token | NixFred | Trusted, privileged | Unauthorized deploy, blast radius into other Cloudflare resources |
| Preview deployments | NixFred | Trusted, restricted (R012) | Exposure of unfinished work, indexing of previews |

Trust boundaries, from least to most trusted:

1. Visitor supplied share URL crosses into the application at parse time. Everything on the far side of the URL parser must treat the payload as hostile (SEC002).
2. The Web Worker boundary. The worker receives a validated scenario, never raw URL text, and returns snapshots and events. The worker never touches the DOM.
3. The GitHub fork boundary. Fork pull requests run analysis jobs but receive no credentials and trigger no deploy (SEC008).
4. The Cloudflare account boundary. The CI token is scoped to Pages deployment for one account only, so a leaked token cannot reach DNS, zones, Workers, or other services (SEC001, blast radius section 9).

---

## 2. Threat model

One section per threat. Each lists the vector, the impact, the mitigations, and the requirement IDs enforced. This section satisfies SEC009 and the manifest `threat_model.md` coverage list (supply chain, malicious scenario links, cross site scripting, oversized parameters, worker denial of service, unsafe third party scripts, secret exposure, preview access).

### 2.1 Supply chain compromise

Vector: a malicious or vulnerable dependency, a compromised transitive package, a poisoned GitHub Action, or production code loaded from an unpinned content delivery network.

Impact: arbitrary code executed in every visitor browser or in the privileged CI runner.

Mitigations:

1. All direct dependencies pinned to explicit versions, `package-lock.json` committed, `npm ci` used everywhere so installs are reproducible from the lock file (SEC007, OPS002, F003).
2. No production code loaded from unpinned public content delivery networks. Application assets and bundled dependencies are self hosted from the Pages origin. The only external origin is the Cloudflare Web Analytics beacon (SEC007, NFR003, F004).
3. Dependency review workflow (`dependency_review.yml`) blocks newly introduced vulnerable dependencies at the approved severity threshold on any pull request that changes a manifest or lock file (SEC004).
4. CodeQL workflow (`codeql.yml`) runs TypeScript and JavaScript analysis on pull requests, pushes to main, and a schedule. New high severity findings block merge (SEC005).
5. Dependabot proposes weekly npm and GitHub Actions updates, groups low risk development dependencies, and never auto merges major changes, so a maintainer reviews every version bump (INT005).
6. GitHub Actions pinned by version. Least privilege `permissions` blocks per workflow so a compromised step holds the narrowest token possible (INT002).
7. Bundle budget check (`check:bundle`, CI job `bundle_budget`) surfaces unexpected size growth that can indicate an injected payload (SEC007, NFR004).

Residual risk: a zero day in a pinned dependency before an advisory exists. Reduced by the monthly dependency review cadence (OPS008) and the ability to roll back a Pages deployment (OPS004).

### 2.2 Malicious scenario links and hostile URL input

Vector: an attacker crafts a `filter.nixfred.com` share URL with malformed, out of range, oversized, or hostile parameters and sends it to a victim. The share URL is the single largest untrusted input in v1.

Impact: attempted denial of service, script injection, corrupted state, or a browser hang.

Mitigations:

1. A raw length limit is applied to the encoded parameter string before any parsing. Input over the limit is rejected deterministically, so parsing never runs on an unbounded payload (SEC002, FR026).
2. The scenario schema is versioned and validated. Every field is checked for type and range, values are clamped to their documented range or the whole scenario is rejected deterministically, and only supported older model versions are migrated (SEC002, FR026, DATA001, ruling R015).
3. No parameter value ever reaches `eval`, `new Function`, `innerHTML`, `dangerouslySetInnerHTML`, or any HTML or script sink. Numeric parameters render only as numbers through React text nodes, which escape by default (SEC002, threat 2.3).
4. The seed and model version are parsed as integers. Non integer or out of range values are rejected before the worker starts (SEC002, FR017, FR026).
5. On any validation failure the application shows the designed error or degraded state, never a blank page or an unhandled exception (FR030).

Requirement IDs: SEC002, FR026, DATA001, FR030.

### 2.3 Cross site scripting

Vector: attacker controlled data (share URL parameters, migrated older scenarios, or any future stored value) reaching a DOM sink and executing as script.

Impact: session-free site has no cookies or auth to steal, but injected script could deface the page, exfiltrate localStorage preferences, or abuse the visitor browser.

Mitigations:

1. React escapes all text interpolation by default. The codebase forbids `dangerouslySetInnerHTML`. Content copy (`src/content/`) is authored, not derived from user input (SEC002, SEC003).
2. A Content Security Policy with `script-src 'self' https://static.cloudflareinsights.com`, no `'unsafe-inline'` on scripts, and no `'unsafe-eval'` removes inline and injected script as an execution path even if a sink were missed (SEC003, section 3 below).
3. `object-src 'none'`, `base-uri 'self'`, and `frame-ancestors 'none'` close plugin, base tag, and clickjacking vectors (SEC003).
4. URL parameters are validated and clamped before use (threat 2.2), so no attacker string reaches a rendering path unescaped (SEC002).

Requirement IDs: SEC002, SEC003.

### 2.4 Oversized parameters and worker exhaustion denial of service

Vector: a crafted scenario requests an enormous population, an extreme run horizon, a pathological parameter combination, or repeated rapid runs, aiming to exhaust CPU or memory in the worker or the main thread.

Impact: the visitor tab hangs or the device runs out of memory. Because the simulation is client side, the impact is confined to the attacker's own victim, not shared infrastructure, but a hung tab is still a denial of the experience.

Mitigations:

1. The simulated population is bounded. The representative population count has a documented maximum enforced by the schema clamp, independent of the larger decorative starfield, which is visual only (SEC002, FR023, ruling R018).
2. The run horizon and speed steps are drawn from a fixed selectable set (default 10 billion years, defined alternatives, speed steps pause, normal, 10x, 100x, 1000x, maximum), not free numeric input, so total step count is bounded (FR024, ruling R018).
3. The simulation executes in a Web Worker, so even a long run never blocks the interface thread and the user can reset or reload (FR018, NFR006).
4. The worker applies a step and time budget. Runs that would exceed the bound stop at the designed end state and emit the Silence Report rather than looping without limit (SEC002, FR009, FR030).
5. Reset and replay are always reachable from the interface thread while the worker runs (FR004).

Requirement IDs: SEC002, FR018, FR023, FR024, NFR006.

### 2.5 Secret exposure

Vector: a credential committed to source, printed in a workflow log, embedded in a build artifact, or shipped in browser code.

Impact: an exposed Cloudflare API token allows unauthorized Pages deployment; any exposed secret damages trust in a public repository.

Mitigations:

1. No secret in source, logs, browser assets, build artifacts, or tracked files. CI secrets live only in GitHub environment secrets (SEC001, packet 03 section 10).
2. GitHub secret scanning and push protection enabled, so a committed credential is blocked at push time (SEC006).
3. Local secret files (`.env`, `.dev.vars`, local Wrangler state) are ignored by Git. `.env.example` and `.dev.vars.example` are added only if the application actually uses runtime variables, and they carry names only, never values (SEC001, packet 03 section 10).
4. The Cloudflare Web Analytics beacon token is a public site identifier exposed in client HTML by design (F004), not a secret. It is treated as configuration, not a credential, and documented as such in section 5.
5. The BUILD.md 12.2 public safety scan runs before the first public push and every release (section 6 below).
6. Production build ships no source maps, so internal structure is not exposed (packet 03 section 13, section 4 below).

Requirement IDs: SEC001, SEC006, and see section 5.

### 2.6 Preview access abuse

Vector: an unfinished preview deployment is discovered, indexed by a search engine, or used to reach work not ready for the public.

Impact: exposure of incomplete features, confusing duplicate content in search, or an unintended public surface.

Mitigations:

1. Preview deployments are protected with Cloudflare Access until Fred explicitly opens them (ruling R012, SEC010, PENDING P001). A one time PIN to frednix@gmail.com gates access, so crawlers and the public cannot reach previews at all.
2. Every preview sends `noindex` and previews are never indexed (ruling R005, SEC008, REL004). Production is indexed from launch, previews never are.
3. A preview never binds the production custom domain and never receives production only variables (SEC008, packet 03 section 8).
4. The preview deploy uses a `preview` GitHub environment with credentials available only to the deployment job (SEC008, INT002).

Requirement IDs: SEC008, SEC010, ruling R012, ruling R005.

### 2.7 Workflow injection via fork pull requests

Vector: an attacker opens a pull request from a fork of the public repository (F001) attempting to run code with repository secrets or to trigger a privileged deploy.

Impact: secret exfiltration or unauthorized deployment through a poisoned pull request.

Mitigations:

1. Fork pull requests get no credentials. The `deploy_preview` job runs only for same repository branches, gated on `github.event.pull_request.head.repo.full_name == github.repository`, so a fork pull request never reaches the deploy job or its Cloudflare credentials (SEC008, INT002).
2. The `pull_request_target` trigger, which would expose secrets to fork code, is not used for build or deploy of untrusted code.
3. CI analysis jobs (format_check, lint, typecheck, unit_tests, simulation_determinism, simulation_properties, coverage, build, bundle_budget, browser_smoke, accessibility_tests) run for fork pull requests with least privilege permissions and no deployment secrets, so an attacker sees test results only (INT002).
4. Cloudflare credentials are referenced only inside the deploy jobs under the appropriate GitHub environment, never at workflow top level (SEC008, packet 03 section 10).

Requirement IDs: SEC008, INT002.

### 2.8 Account takeover blast radius

Vector: compromise of the GitHub account or the Cloudflare account or token.

Impact and containment:

1. Cloudflare API token scope: scoped as narrowly as practical to Pages deployment for the one correct account (packet 03 section 10 requirement 1, SEC001). A leaked token can deploy to the `filter` Pages project but cannot edit DNS, zones, Workers, other Pages projects outside its scope, or account settings. This bounds the blast radius to one project.
2. Rotation: the token can be rotated in the Cloudflare dashboard and updated in the GitHub environment secret without code changes. Rotation is the first response to any suspected token exposure (OPS007).
3. GitHub protection: branch protection on main blocks force pushes and branch deletion, requires all named checks before merge, and requires conversation resolution (INT001, packet 03 section 3). A single malicious commit cannot reach production without passing required checks.
4. Recovery: a compromised production deployment is reverted by selecting the previous Cloudflare Pages deployment without rebuilding (OPS004), followed by a corrective pull request and a post rollback smoke test.
5. Recommended account hardening: two factor authentication on both the GitHub and Cloudflare accounts. This is an account setting, recorded here as an operational control, verified manually at G-LAUNCH.

Requirement IDs: SEC001, INT001, OPS004, OPS007.

---

## 3. Security headers plan (SEC003)

File: `public/_headers`, applied by Cloudflare Pages to static responses. This plan satisfies packet 03 section 13 and SEC003. The Content Security Policy below is a DRAFT derived from the planned application behavior and must be finalized against the real build before G6, per the packet rule that the policy is generated from actual behavior, not pasted broadly.

### 3.1 Behavior the policy is derived from

1. Self hosted assets only. Vite emits fingerprinted JavaScript and CSS under `/assets/`. No production code from a content delivery network (SEC007).
2. One Web Worker (`simulation.worker.ts`), bundled by Vite and served same origin (FR018).
3. One external origin: the Cloudflare Web Analytics beacon (F004, INT006). The beacon needs two origins: `https://static.cloudflareinsights.com` to load `beacon.min.js` (script), and `https://cloudflareinsights.com` for the beacon to post measurement data (connect). These are the only external origins in the whole policy.
4. No frames embedded and the site is never framed (`frame-src 'none'`, `frame-ancestors 'none'`).
5. No inline script. Strategy below in section 3.4.
6. Three.js textures and any canvas export use `data:` and `blob:` image sources; the module worker may load through a `blob:` URL depending on the Vite worker output (F002).

### 3.2 Draft `_headers` content

```text
/*
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; frame-src 'none'; form-action 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; worker-src 'self' blob:; manifest-src 'self'; media-src 'self'; upgrade-insecure-requests
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Permissions-Policy: accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), usb=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/build.json
  Cache-Control: public, max-age=0, must-revalidate

/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

This draft matches the working policy already proven on galaxy.nixfred.com (the same Three.js plus Cloudflare stack per F002), adjusted for Vite output paths (`/assets/` rather than the Astro `/_astro/` path).

### 3.3 Directive rationale

1. `default-src 'self'`: everything not otherwise listed is same origin only.
2. `script-src 'self' https://static.cloudflareinsights.com`: application scripts plus the analytics beacon script. No `'unsafe-inline'`, no `'unsafe-eval'`. This is the load bearing anti cross site scripting control (threat 2.3).
3. `connect-src 'self' https://cloudflareinsights.com`: the application talks only to its own origin; the one exception is the beacon posting measurement data to `https://cloudflareinsights.com/cdn-cgi/rum` (F004, INT006).
4. `style-src 'self' 'unsafe-inline'`: React sets element `style` attributes for canvas relative positioning of overlays and labels, which CSP treats as inline style. `'unsafe-inline'` on style is retained in the draft for that reason. Tightening target for finalization: move to `style-src 'self'; style-src-attr 'unsafe-inline'` so stylesheets stay locked to `'self'` while only element style attributes are permitted, verified against the real build. Style injection is a far lower risk than script injection; scripts carry no `'unsafe-inline'`.
5. `img-src 'self' data: blob:`: Three.js and canvas export use data and blob image sources (F002).
6. `worker-src 'self' blob:`: the simulation worker is same origin; `blob:` covers the case where Vite emits the module worker through a blob URL. Finalization task: attempt to drop `blob:` by configuring Vite to emit a file based worker, and verify the worker still loads across the browser floor (ruling R021).
7. `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `frame-src 'none'`, `form-action 'self'`: close plugin, base tag, framing, and form vectors. There are no forms in v1 (R013); `form-action 'self'` is defense in depth.
8. `manifest-src 'self'`, `media-src 'self'`, `font-src 'self'`: the web manifest (R006), any media, and fonts are same origin only.
9. `upgrade-insecure-requests`: forces any subresource reference to HTTPS.
10. `Referrer-Policy: strict-origin-when-cross-origin`: sends only the origin on cross origin navigation, never the full share URL with its parameters.
11. `X-Content-Type-Options: nosniff`: blocks content type sniffing.
12. `X-Frame-Options: DENY`: legacy clickjacking protection alongside `frame-ancestors 'none'`.
13. `Permissions-Policy`: denies every device and browser feature the application does not use. `fullscreen=(self)` is the only permitted feature, for a full screen canvas. `interest-cohort=()` opts out of cohort tracking, consistent with the cookieless privacy posture (DATA003).
14. `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin`: isolate the browsing context and the site's own resources. See the cross origin isolation decision in section 3.5.
15. `Strict-Transport-Security: max-age=31536000; includeSubDomains`: one year HTTPS enforcement.

### 3.4 Inline script strategy

The goal is `script-src` with no `'unsafe-inline'` and no `'unsafe-eval'`, achievable with Vite:

1. Vite production builds emit external, fingerprinted script files. No inline bootstrap script is required in `index.html`.
2. Three.js compiles GLSL shaders on the GPU as strings; this is not JavaScript `eval` and needs no `'unsafe-eval'`. Vite production output does not use `eval` either.
3. The Cloudflare Web Analytics beacon is injected as an external `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{...}'></script>` tag, not inline code, so `script-src 'self' https://static.cloudflareinsights.com` covers it with no inline allowance. The `data-cf-beacon` token is a public site identifier, not a secret (section 5).
4. Any build time injected value (build metadata, version) is emitted into a fetched JSON file or a data attribute, never an inline script block.

If a specific inline requirement is discovered during the real build, the finalization step uses a hash based allowance for that one block rather than `'unsafe-inline'`, and records it here.

### 3.5 Cross origin isolation decision

The site does not enable `Cross-Origin-Embedder-Policy: require-corp`, so it is not cross origin isolated. Reasons:

1. The simulation worker exchanges data with the main thread using structured clone and transferable `ArrayBuffer` objects through `postMessage`, not `SharedArrayBuffer`, so cross origin isolation is not required (FR018, NFR007).
2. `require-corp` would break the cross origin Cloudflare Web Analytics beacon and could break Three.js resource loads that do not carry a cross origin resource policy header (F002, F004).

`COOP: same-origin` plus `CORP: same-origin` give browsing context and resource isolation compatible with Three.js and the worker, without the breakage that `require-corp` would cause. This is the compatible choice and matches the proven galaxy.nixfred.com stack.

### 3.6 Preview noindex handling

The single `_headers` file cannot by itself distinguish preview from production. Preview isolation (SEC008, R005) is enforced by three layers:

1. Cloudflare Access blocks all unauthenticated traffic to previews, including crawlers, so previews are unreachable by search engines (R012, SEC010).
2. Preview builds inject a `<meta name="robots" content="noindex">` tag via a build time environment flag.
3. The preview deploy step sets an `X-Robots-Tag: noindex` response for preview deployments.
Production `robots.txt` allows indexing from launch (R005, REL004); previews never are.

---

## 4. Cache policy

Per packet 03 section 13 requirements 7 through 9:

1. Fingerprinted assets under `/assets/*` (Vite hashed JavaScript and CSS): `Cache-Control: public, max-age=31536000, immutable`. The content hash in the filename makes a long immutable cache safe; a changed file gets a new name.
2. HTML: `Cache-Control: public, max-age=0, must-revalidate`. HTML is the entry point and must revalidate so a new deployment is picked up immediately.
3. Build metadata (`build.json` or equivalent carrying commit SHA, app version, and simulation model version per OPS005): `max-age=0, must-revalidate`, so the About panel reflects the live deployment.
4. No production source maps. The Vite production build sets source map generation off, so no `.map` file ships and internal structure is not exposed (packet 03 section 13 requirement 9, SEC001, production acceptance item 15).

---

## 5. Secret handling

Per packet 03 section 10 and SEC001, SEC006:

GitHub environment secrets, names only, values never written anywhere in the repository:

| Name | Kind | Scope | Purpose |
|---|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Secret | `production` and `preview` environments, deploy jobs only | Wrangler Pages Direct Upload deploy. Scoped to Pages edit for the one account only (least privilege) |
| `CLOUDFLARE_ACCOUNT_ID` | Secret | `production` and `preview` environments | Passed explicitly to Wrangler because the scoped token cannot resolve account membership (INTAKE preflight, BUILD.md standing law 15) |

GitHub repository variables (non secret configuration):

| Name | Kind | Purpose |
|---|---|---|
| `CLOUDFLARE_PAGES_PROJECT` | Variable | Pages project name `filter` (ruling R003) |
| `PRODUCTION_DOMAIN` | Variable | `filter.nixfred.com` for post deploy smoke tests |
| `NODE_VERSION` | Variable | Pinned Node version, aligned with `.nvmrc` (OPS002) |

Analytics token (non secret, production only): the Cloudflare Web Analytics beacon token is a public site identifier embedded in client HTML by design (F004). It is not a credential. It is supplied to the production build only, scoped to the `production` GitHub environment so preview builds do not carry it (F004 production only, INT006). Candidate name `CF_WEB_ANALYTICS_TOKEN` as a production environment variable. See ASSUMPTIONS and the new requirement candidate in the report.

Handling rules (packet 03 section 10):

1. No secret is copied into `.env`, `.dev.vars`, a workflow log, a test report, or browser code (SEC001, requirement 5).
2. Local secret files are ignored by Git (SEC001, requirement 6). `.gitignore` excludes `.env`, `.env.*` except `.env.example`, `.dev.vars`, and local Wrangler state.
3. `.env.example` and `.dev.vars.example` are added only if the application actually uses runtime variables, and carry names only (packet 03 section 10 requirement 7).
4. Secret names may be shared across the `production` and `preview` environments, but the token value and scope can differ (packet 03 section 10 requirement 4).
5. `docs/deployment.md` records secret names and nonsecret identifiers, never secret values (OPS003).

---

## 6. Public safety scan checklist

Per BUILD.md 12.2, run before the first public push and every release. Tailored to this repository:

1. API keys: none in source, assets, or history. Verify no Cloudflare token string appears anywhere tracked.
2. Tokens: no `CLOUDFLARE_API_TOKEN` value in code, logs, or artifacts. The public analytics beacon token in HTML is expected and allowed (F004).
3. Passwords: none.
4. Private keys: none. No `.pem`, `.key`, or SSH key material tracked.
5. Internal hostnames: none. Only `filter.nixfred.com`, `nixfred.com`, and `*.pages.dev` appear.
6. Private IP addresses: none.
7. Customer confidential information: not applicable, no customer data.
8. Family information: none. No family names or details in copy or docs (charter hard rule 1).
9. Health information: none.
10. Personal addresses or phone numbers: none.
11. Private email addresses: `frednix@gmail.com` appears only as the security contact and Cloudflare Access identity, which is intended for publication in that role. No other private address.
12. Local filesystem paths containing usernames: none in shipped files. Paths under a local home directory must not appear in any tracked repository file (charter hard rule 1); repository relative paths only.
13. Debug dumps: none committed.
14. Environment files: `.env` and `.dev.vars` gitignored, only `.example` variants if any, names only.
15. DNS zone exports: none. The `nixfred.com` zone ID is not written into any tracked file.

The scan is a G-LAUNCH blocking item and repeats at every release (packet 03 section 21 item 15, BUILD.md 12.2).

---

## 7. Verification: controls to gates and CI jobs

Which check enforces which control:

| Control | Requirement | Enforced by |
|---|---|---|
| No newly vulnerable dependency | SEC004 | `dependency_review.yml` on manifest or lock changes |
| Code scanning, high severity blocks merge | SEC005 | `codeql.yml` on pull requests, main, schedule |
| Secret scanning and push protection | SEC006 | GitHub repository setting, verified at G6 |
| No secret in tracked files or artifacts | SEC001 | Push protection, public safety scan (section 6), production acceptance item 15 |
| Pinned supply chain, lock committed | SEC007 | `package-lock.json` committed, `npm ci` in CI, `bundle_budget` job |
| Hostile URL input validated and clamped | SEC002 | `unit_tests` (scenario, schema, serialization, migration), `simulation_properties` (invalid inputs clamped deterministically), `scenario_round_trip` integration test |
| Worker denial of service bounds | SEC002, FR018 | `simulation_properties`, `simulation_worker` integration test, bounded population and horizon in schema |
| Security headers present | SEC003 | `public/_headers` shipped, `post_deploy_smoke` and production acceptance item 7 check headers on the live domain |
| No production source map exposed | SEC001 | Vite production config, production acceptance item 15 |
| Previews noindex and access controlled | SEC008, SEC010 | `deploy_preview` noindex plus fork guard, Cloudflare Access (R012), production acceptance item 6 |
| Fork pull requests get no credentials | SEC008 | Same repository guard on the `deploy_preview` job |
| Preview never binds production domain | SEC008 | `deploy_preview` job configuration |

The named CI jobs use the canonical names from the charter: install, format_check, lint, typecheck, unit_tests, simulation_determinism, simulation_properties, coverage, build, bundle_budget, browser_smoke, accessibility_tests, deploy_preview, quality_gate, deploy_production, post_deploy_smoke.

---

## 8. Data and privacy controls

### 8.1 Storage policy (DATA002)

1. localStorage is used only for preferences and the last scenario. No cookies are set by the application (DATA002).
2. A visible clear local data control removes stored preferences and the last scenario on demand (DATA002, FR013).
3. No `SharedArrayBuffer`, no fingerprinting storage, no third party storage.

### 8.2 Privacy posture (DATA003)

1. No personal data collection. Cloudflare Web Analytics only, cookieless, production only (DATA003, F004).
2. No session replay, no client fingerprints, no simulation parameters used as identifiers (DATA003, packet 03 section 18, F004).
3. The share URL carries model version, seed, and parameters only. It contains no identifier and is not tied to a person (DATA001, DATA003).
4. Client error surfacing, if added later, requires a privacy appropriate service and Fred's approval; it is not in v1 (packet 03 section 18, R013).

---

## 9. Draft status and finalization

The Content Security Policy in section 3.2 is a DRAFT. It is finalized at G6 against the real Vite build by loading the built site, reading the browser console for policy violations, and tightening `style-src` and `worker-src` as described. The final policy is generated from observed behavior, not pasted broadly (packet 03 section 13). The finalized `_headers` file is verified live by `post_deploy_smoke` and production acceptance item 7.
</content>
</invoke>

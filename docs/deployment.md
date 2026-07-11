# Deployment Record

The Great Filter, `filter.nixfred.com`. This file is the deployment record required by OPS003. It holds the non secret facts a future session needs to provision, deploy, verify, and recover the site: GitHub owner and repository, the Cloudflare account and zone identifiers, the Pages project, the production branch and custom domain, the retained fallback address, the secret names, the workflows, the custom domain association procedure, the DNS verification steps, the post deploy smoke test definition, and the rollback pointer.

This file contains no secret values (OPS003, SEC001). Cloudflare account and zone identifiers are recorded because they are non secret identifiers, visible in dashboard URLs and required in API paths, and cannot authenticate on their own. Packet `03_CICD_FUNCTIONAL_REQUIREMENTS.md` section 2 item 9 requires recording non secret identifiers, and item 10 forbids recording tokens or secret values. Only names of secrets appear here.

## 1. Deployment record

Preflight facts are from `docs/INTAKE.md` section 3, gathered with `gh auth status` and `wrangler whoami`. Provisioning of the repository, Pages project, and custom domain is executed at gate G0 and gate G-LAUNCH per `docs/EXECUTION_PLAN.md`; identifiers created during provisioning (Cloudflare deployment ids, certificate status) are appended to the deployment log in section 8 as they become real, never before (no fabrication).

| Field | Value | Kind |
|-------|-------|------|
| GitHub owner | `nixfred` | non secret |
| GitHub repository | `filter`, full name `nixfred/filter` | non secret |
| Repository visibility and license | public, MIT LICENSE (F001, INT001) | non secret |
| Default and production branch | `main` (INT003) | non secret |
| Cloudflare account identifier | `b120e63874f8f8e9d75db4c1bf65a766` | non secret identifier |
| `nixfred.com` zone identifier | `0f553c816de4c7f59d6dfbfe1712aafd` | non secret identifier |
| Cloudflare Pages project | `filter` (R003) | non secret |
| Deployment model | Direct Upload through Wrangler, no Pages Git integration (R003, R013) | non secret |
| Build output directory | `dist` (INT004) | non secret |
| Production custom domain | `filter.nixfred.com` (INT003) | non secret |
| Retained fallback address | the generated `*.pages.dev` address, kept as an operational fallback (packet 03 section 12 item 7) | non secret |
| Analytics | Cloudflare Web Analytics beacon, production only (F004, INT006) | non secret |

Preflight collision results from `docs/INTAKE.md` section 3: the repository name `filter` is free, no Pages project named `filter` exists, and the `nixfred.com` zone is active in the same Cloudflare account, so the subdomain can be associated by this account. The fleet convention is `name-nixfred-com`; R003 knowingly diverges to `filter` because the packet is explicit and the custom domain hides the `*.pages.dev` name.

## 2. Secret and variable names

Secret values live only in GitHub environment secrets, never in this repository (SEC001, packet 03 section 10). Names only:

Environment secrets, in the `production` and `preview` environments (`docs/CI_CD.md` section 3.5):

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Repository variables, non secret:

- `CLOUDFLARE_PAGES_PROJECT` set to `filter`
- `PRODUCTION_DOMAIN` set to `filter.nixfred.com`
- `NODE_VERSION` set to the pinned Node major version matching `.nvmrc`

## 3. Workflows

Five workflows deliver the site (INT002, `docs/CI_CD.md` section 2):

- `.github/workflows/ci.yml`, install, validate, build, never deploys
- `.github/workflows/dependency_review.yml`, block newly vulnerable dependencies (SEC004)
- `.github/workflows/codeql.yml`, code scanning (SEC005)
- `.github/workflows/deploy_preview.yml`, protected noindex preview (SEC008, R012)
- `.github/workflows/deploy_production.yml`, deploy to `main`, verify the custom domain (R011, OPS005)

## 4. Wrangler environment token limitation and its CI implication

The scoped Cloudflare environment token used locally and in CI cannot enumerate account memberships. Per `docs/INTAKE.md` section 3, `wrangler pages project list` fails on the `/memberships` route with this token, while direct Pages API calls and deploys succeed. The implication for CI and local operation is a hard requirement:

- Every Wrangler command that needs the account passes the account identifier explicitly through the `CLOUDFLARE_ACCOUNT_ID` environment variable. Deploys do not rely on membership discovery.
- Membership listing (`wrangler pages project list`) is not used as a gate or a health check; the deploy and the Pages API calls that carry the account id are used instead.
- This honors standing law 15, do not mask OAuth with a weaker environment token, and matches the calc.nixfred.com precedent recorded in intake.

Example, the account id supplied inline so the command works with the scoped token:

```bash
CLOUDFLARE_ACCOUNT_ID=b120e63874f8f8e9d75db4c1bf65a766 \
wrangler pages deploy dist --project-name filter --branch main
```

## 5. Custom domain association procedure

Executed once at provisioning (gate G0 or G-LAUNCH per `docs/EXECUTION_PLAN.md`). Wrangler 4.x has no `pages domain` command, so the custom domain is attached through the Cloudflare Pages API. Because the `nixfred.com` zone is on the same Cloudflare account, this call provisions the `filter` CNAME and requests the certificate automatically; the Pages deployment token is sufficient and no Zone DNS Edit token is stored in CI.

Provide the token through the `CLOUDFLARE_API_TOKEN` environment variable so it never appears in shell history or logs (SEC001). The account identifier is the recorded value in section 1.

1. Confirm or create the Direct Upload Pages project with `main` as the production branch (packet 03 section 12 items 1 and 2):

```bash
CLOUDFLARE_ACCOUNT_ID=b120e63874f8f8e9d75db4c1bf65a766 \
wrangler pages project create filter \
  --production-branch main \
  --compatibility-date 2026-07-11
```

If it already exists, reuse it and confirm the production branch is `main`.

2. Perform the first deployment through Wrangler (packet 03 section 12 item 3), then attach the custom domain (item 4):

```bash
curl -sS -X POST \
  "https://api.cloudflare.com/client/v4/accounts/b120e63874f8f8e9d75db4c1bf65a766/pages/projects/filter/domains" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"name":"filter.nixfred.com"}' | jq '{name: .result.name, status: .result.status}'
```

3. Preserve the generated `*.pages.dev` address as an operational fallback (packet 03 section 12 item 7). Restrict or redirect it to the custom domain according to Fred's preference (item 8); the default is an optional redirect from the Pages address to `https://filter.nixfred.com`, configured in `public/_redirects` or a Cloudflare Redirect Rule when it crosses the Pages project boundary (packet 03 section 14).

## 6. DNS and certificate verification

Run after association and wait until the domain status is `active` (packet 03 section 12 items 5 and 6):

```bash
# Domain and certificate status reported by Cloudflare
curl -sS \
  "https://api.cloudflare.com/client/v4/accounts/b120e63874f8f8e9d75db4c1bf65a766/pages/projects/filter/domains" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  | jq '.result[] | {name, status, certificate: .validation_data.status}'

# DNS resolves to the Pages target
dig +short filter.nixfred.com CNAME
dig +short filter.nixfred.com A

# TLS is active and the site answers
curl -sS -I https://filter.nixfred.com | head -n 1
```

Proceed only when the domain status is `active`, DNS resolves to the Pages target, and the custom domain returns HTTP 200 over a valid certificate (packet 03 section 21 items 1 and 2). Record the confirmed status in the deployment log, section 8.

## 7. Post deploy smoke test definition

The smoke test runs against `https://filter.nixfred.com` after every production deploy; a failing assertion fails the workflow (OPS006, `docs/CI_CD.md` section 7). Assertions:

1. `https://filter.nixfred.com/` returns HTTP 200 over a valid TLS certificate.
2. The HTML title contains `The Great Filter` and `<link rel="canonical">` points at `https://filter.nixfred.com`.
3. The core JavaScript and CSS bundle assets resolve with HTTP 200.
4. The security headers are present on the custom domain: Content Security Policy, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and frame protection through the policy. The exact header set is owned by `docs/SECURITY_PLAN.md`.
5. `https://filter.nixfred.com/build.json` reports `commit` equal to the deployed `main` commit SHA (OPS005, OPS009).
6. The production robots policy allows indexing and no preview `X-Robots-Tag: noindex` header is present on the custom domain (R005).
7. A headless Playwright pass completes a default run to the Silence Report with no severe browser console error.

The seventeen item production acceptance checklist (mobile run, reduced motion run, keyboard path, redirect behavior, tested rollback) runs at gate G-LAUNCH and is recorded in `docs/OPERATIONS.md` and `docs/GATES.md` (REL002, packet 03 section 21).

## 8. Deployment log

Real deployment and provisioning facts are appended here as they occur, never in advance (no fabrication, OPS005). Each row links the deployed commit to its Cloudflare deployment identifier and the verification result.

| Date (UTC) | Event | Commit SHA | App version | Sim model version | Cloudflare deployment id | Verified |
|------------|-------|------------|-------------|-------------------|--------------------------|----------|

No production deployment recorded yet. Provisioning of the repository, Pages project, and custom domain executes at gate G0 and gate G-LAUNCH.

## 9. Rollback

The rollback procedure lives in `docs/OPERATIONS.md` section 3: identify the previous successful Pages deployment, restore it through the Cloudflare Pages rollback API without rebuilding, run the post deploy smoke test, open an incident issue, and follow with a corrective pull request, never rewriting `main` (OPS004, packet 03 section 19). The procedure is rehearsed at least once before public launch (REL002, packet 03 section 21 item 17).

## G0 completion record (2026-07-11)

Repository created and pushed: https://github.com/nixfred/filter (public, MIT, default branch main).
Initial planning release: https://github.com/nixfred/filter/releases/tag/v0.1.0-planning
Security readback evidence: docs/evidence/planning/g0_repo_settings.txt (secret scanning enabled, push protection enabled, Dependabot vulnerability alerts enabled).
Safety scan evidence: docs/evidence/planning/g0_safety_scan.txt.

## G6 CI/CD and Cloudflare Pages record (2026-07-11)

Cloudflare Pages project created: filter (Direct Upload), production branch main, generated subdomain filter-bqk.pages.dev (operational fallback, retained per packet 03 section 12).
GitHub repository variables set: CLOUDFLARE_PAGES_PROJECT=filter, PRODUCTION_DOMAIN=filter.nixfred.com, NODE_VERSION=26.
GitHub secret set: CLOUDFLARE_ACCOUNT_ID (a non secret identifier, stored in the secrets context because the workflows read it there).

### Fred set credential (PENDING P005)

CLOUDFLARE_API_TOKEN is intentionally NOT set from the local broad personal token. Both deploy workflows guard on its presence and skip cleanly until it exists, then activate automatically. Fred creates a Cloudflare API token scoped narrowly to Account, Cloudflare Pages, Edit for the Frednix account, and sets it once:

  gh secret set CLOUDFLARE_API_TOKEN --repo nixfred/filter

This keeps a broad personal token out of a public repository's Actions, per BUILD.md standing law 16 and packet 03 section 10 (scope as narrowly as practical).

### Custom domain and production deploy

The custom domain filter.nixfred.com association and the first production deploy occur at G-LAUNCH, after Fred sets the token (P005) and approves launch (P003, REL006). The nixfred.com zone is active in the same account (zone id 0f553c816de4c7f59d6dfbfe1712aafd), so association is a Pages custom domain call plus DNS verification, documented in docs/OPERATIONS.md.

### Preview access (PENDING P001)

Cloudflare Access on preview deployments is configured on the Pages project after the token is set, defaulting to a one time PIN to frednix@gmail.com, until Fred opts into public previews.

## G-LAUNCH production launch record (2026-07-11)

LIVE at https://filter.nixfred.com (Fred approved: "Launch!").
Deploy method: local wrangler (npx wrangler@latest pages deploy dist --project-name filter --branch main), the reliable path for the fleet. The machine's global wrangler 4.88 hard-fails on /memberships with the scoped token; the current wrangler makes that check non-fatal. GitHub Actions deploy workflows remain guarded and dormant (P005 token unset by choice).
Custom domain: filter.nixfred.com, CNAME to filter-bqk.pages.dev (proxied), certificate provisioned automatically in the same zone.
Acceptance verified live: TLS 200, title and canonical, build.json commit matches the deployed main commit, security headers present (CSP, nosniff, referrer, permissions, frame DENY), robots indexable, no preview noindex, a full default run completes to the Silence Report with no application console error, and the production-smoke Playwright test passes against the domain.
Lighthouse (live): performance 0.98, accessibility 1.00, SEO 1.00, best practices floor 0.90 met (ruling R025 excludes the deliberate no-source-maps and the external Cloudflare Email Obfuscation console injection).
Rollback: two deployments retained and independently selectable; procedure in docs/OPERATIONS.md section 3.
Open, non blocking, Fred owned: enable Cloudflare Web Analytics (INT006 beacon), turn off Email Obfuscation for the zone to clear the last console warning, and set the scoped CLOUDFLARE_API_TOKEN if the Actions deploy path is ever wanted (P005).

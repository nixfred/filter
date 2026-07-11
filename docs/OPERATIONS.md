# Operations Runbook

The Great Filter, `filter.nixfred.com`. This runbook is written so a future session can execute every procedure without guessing. It covers release, rollback, incident handling, maintenance cadence, artifact retention, and the standing branch protection configuration. Commands are copy ready. Replace `<...>` placeholders with the recorded values. The delivery design these procedures serve is in `docs/CI_CD.md`, and the deployment identifiers are recorded in `docs/deployment.md`.

This runbook implements OPS004, OPS005, OPS006, OPS007, OPS008, OPS010, and REL003. Rulings R011, R012, and R015 apply.

Recorded facts, kept current here. The literal account and zone identifiers live in `docs/deployment.md`; this runbook references them through environment variables so it stays free of duplicated identifiers.

| Fact | Value |
|------|-------|
| GitHub repository | `nixfred/filter` |
| Repository visibility | public, MIT LICENSE (F001) |
| Default and production branch | `main` |
| Cloudflare Pages project | `filter` (R003) |
| Production custom domain | `filter.nixfred.com` |
| Retained fallback address | the generated `*.pages.dev` address |
| Build output | `dist` |
| Cloudflare account identifier | recorded in `docs/deployment.md`, supplied to commands as `$CLOUDFLARE_ACCOUNT_ID` |
| Deploy token scope | Cloudflare Pages deployment for the account, nothing broader |
| Production build artifact retention (OPS010) | 90 days, default, Fred can change |
| CI failure diagnostic retention (OPS010) | 14 days, default, Fred can change |

## 0. Authentication verification

Authentication checks are verification, not permission requests. Run these before any change and record the results. No token value is ever printed (SEC001).

```bash
gh auth status
git remote -v
wrangler whoami
node --version
cat .nvmrc
```

Expected: `gh` logged in as `nixfred`, the `origin` remote pointing at `github.com/nixfred/filter`, `wrangler whoami` showing the correct Cloudflare account, and the Node version matching `.nvmrc`. The scoped environment token cannot enumerate account memberships, so `wrangler pages project list` may fail on `/memberships`; this is expected. Every Wrangler command that needs the account passes it explicitly through `CLOUDFLARE_ACCOUNT_ID`, per `docs/deployment.md` and standing law 15.

## 1. Release procedure

Production deploys automatically when a commit reaches `main` green, through `ci.yml` then `deploy_production.yml` (R011, `docs/CI_CD.md` section 5.5). A release is the act of tagging and recording that deployed commit. Application versions and the simulation model version are independent (R015).

### 1.1 Version scheme

- Application releases use semantic version tags starting at `v1.0.0` (REL003). Increment the patch for fixes, the minor for additive features, the major for a breaking change to the shared URL schema or the public interaction contract.
- The simulation model carries its own integer version inside the share URL schema, bumped only when a model change alters simulation output for the same seed and parameters (R015). A shared URL states which model produced it. The application version and the model version are visible together in the About panel with the deployed commit (OPS009).
- Gate crossings are tagged `gate/GN-YYYYMMDD`, for example `gate/G6-20260711` (REL003, R004).

### 1.2 Cut a release

1. Confirm `main` is green and the target commit is deployed (section 4).
2. Update `CHANGELOG.md`: add a dated section listing user visible changes, and separately note any simulation model version change so a reader can tell whether shared URLs are affected (REL003, packet 03 section 20 items 3 and 10).
3. Run the public safety scan of `BUILD.md` section 12.2 before the tag is pushed (`docs/CI_CD.md` section 3.9).
4. Create and push an annotated tag:

```bash
git tag -a v1.0.0 -m "Release v1.0.0: <summary>. Simulation model version <n>."
git push origin v1.0.0
```

5. Create the GitHub release from the tag, with the CHANGELOG section as the body and the deployment record fields from section 4 (commit SHA, build time, application version, simulation model version, Cloudflare deployment identifier).
6. Append the same record to the deployment log in `docs/deployment.md`.

A simulation model version change without an application feature change is still a release, because shared URLs now resolve against a new model. A CHANGELOG entry must say so (R015, packet 03 section 20 item 10).

## 2. Deployment traceability

Every production deployment records, per OPS005: the commit SHA, the build time, the application version, the simulation model version, and the Cloudflare deployment identifier, with the GitHub environment address `https://filter.nixfred.com`. `deploy_production.yml` writes these to the job summary and the GitHub deployment record; the release step mirrors them into `docs/deployment.md`. The deployed `build.json` carries the commit SHA, build time, application version, and simulation model version so the running site proves what is live (OPS009, R015).

## 3. Rollback runbook

Rollback restores a previously healthy Cloudflare Pages deployment without rebuilding the old commit (OPS004, packet 03 section 19). It is a manual, audited procedure, not a workflow, because production deploys automatically and Cloudflare can re-promote a prior deployment directly.

### 3.1 When to roll back

Roll back when production is unhealthy and a prior deployment was healthy: the post deploy smoke test failed after a deploy, `build.json` does not match the deployed commit, security headers regressed, the custom domain does not answer, or severe console errors appeared on the critical path. `post_deploy_smoke` fails the workflow and opens an incident issue automatically (OPS007); it does not auto restore, so a human selects and confirms the rollback target.

### 3.2 Identify the previous successful deployment

List production deployments, newest first, and select the last known healthy one. Never select a preview deployment (OPS004, packet 03 section 19 item 2).

```bash
CLOUDFLARE_ACCOUNT_ID=<account_id_from_deployment_md> \
wrangler pages deployment list --project-name filter --environment production --json \
  | jq -r '.[] | "\(.id)  \(.created_on)  env=\(.environment)  commit=\(.deployment_trigger.metadata.commit_hash // "n/a")"'
```

Record the chosen `<TARGET_DEPLOYMENT_ID>` and confirm its environment is `production`.

### 3.3 Restore, primary mechanism

Wrangler has no `pages rollback` command in the installed 4.x line, so restoration uses the Cloudflare Pages rollback API. It re-promotes the prior production deployment with no rebuild, restoring the exact prior bytes (OPS004 item that a rollback must not require rebuilding).

```bash
curl -sS -X POST \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/filter/deployments/<TARGET_DEPLOYMENT_ID>/rollback" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" | jq '{id: .result.id, url: .result.url, success}'
```

Provide the token through the `CLOUDFLARE_API_TOKEN` environment variable so it never appears in shell history or logs (SEC001).

### 3.4 Restore, fallback mechanism

If the target deployment has aged out of the rollback API window but its CI build artifact is still retained (`filter-dist-<good_sha>`, 90 day default), re-deploy the exact tested bytes. Download the retained artifact from its `deploy_production.yml` run, then:

```bash
CLOUDFLARE_ACCOUNT_ID=<account_id_from_deployment_md> \
wrangler pages deploy dist \
  --project-name filter \
  --branch main \
  --commit-hash <good_sha>
```

This creates a new production deployment from previously tested bytes, without rebuilding.

### 3.5 Verify after restoration

Run the post deploy smoke test of `docs/CI_CD.md` section 7 against the custom domain (OPS004 item 5, packet 03 section 19 item 5). Minimum manual check:

```bash
curl -sS -I https://filter.nixfred.com | head -n 1
curl -sS https://filter.nixfred.com/build.json | jq '.commit'
curl -sS -I https://filter.nixfred.com | grep -iE 'content-security-policy|x-content-type-options|referrer-policy|permissions-policy'
```

Status must be 200, `build.json` `commit` must equal the restored commit, and the security headers must be present.

### 3.6 Record and correct

1. Open or update an incident issue with the fields in section 5 (OPS007, packet 03 section 19 item 6).
2. Never rewrite `main` to perform the rollback (OPS004, packet 03 section 19 item 7).
3. Follow the rollback with a corrective pull request that fixes the root cause and re-deploys forward through the normal path (OPS004, packet 03 section 19 item 8).

### 3.7 Rollback rehearsal, required before launch

REL002 and OPS004 require the rollback procedure to be tested at least once before public launch (packet 03 section 21 item 17). On a controlled test, deploy a throwaway change to production or a preview target, restore the prior deployment through section 3.3, verify the custom domain, and record the rehearsal outcome as a dated note in the incidents log (section 7). Rehearse during a maintenance window; never validate rollback by intentionally breaking live production during traffic.

## 4. Deployment verification checklist

Use this after every production deploy, either by reading the `deploy_production.yml` job summary or by verifying manually (OPS005, OPS006).

1. The triggering `ci.yml` on `main` was green across all twelve required contexts.
2. `quality_gate` passed `check:all` on the deployed commit.
3. The Cloudflare deployment identifier and production `*.pages.dev` URL are recorded in the job summary.
4. `post_deploy_smoke` passed against `https://filter.nixfred.com` (section 7 of `docs/CI_CD.md`).
5. Security headers present on the custom domain:

```bash
curl -sS -I https://filter.nixfred.com | grep -iE 'content-security-policy|x-content-type-options|referrer-policy|permissions-policy'
```

6. `build.json` reports the deployed commit and versions:

```bash
curl -sS https://filter.nixfred.com/build.json | jq '{commit, buildTime, appVersion, simulationModelVersion}'
```

The `commit` must equal the deployed `main` commit SHA (OPS005, OPS009).

7. A previous successful Cloudflare deployment is still listed as a rollback target (section 3.2).

If any item fails, follow section 3.

## 5. Incident procedure

A material failure gets an incident issue the same day it occurs (OPS007, `BUILD.md` section 14 item 13). Automated openings come from `post_deploy_smoke`; open one manually for any failure discovered after the deploy job reported success.

```bash
gh issue create \
  --repo nixfred/filter \
  --title "Incident: <short summary> on $(date -u +%FT%TZ)" \
  --label incident \
  --body "Cause: <root cause or under investigation>
Affected release: <version and commit SHA>
Detection: <smoke test, report, or user>
Rollback: <deployment id restored, or none>
Corrective action: <pull request link or planned fix>
Verification: <status 200, build.json commit, headers, smoke result>"
```

Every incident issue records cause, affected release, rollback taken, and corrective action (OPS007). Close it only after the corrective pull request has merged and production is verified. Record a one line summary in the incidents log (section 7) the same day. When a manual check reveals a defect that automated tests missed, strengthen the automated assertion as part of the correction (`BUILD.md` section 14 item 14).

## 6. Maintenance cadence

Standing operational cadence (OPS008, packet 03 section 20 items 5 to 7):

| Cadence | Task | Mechanism |
|---------|------|-----------|
| Weekly | npm and GitHub Actions dependency update pull requests, grouped low risk development dependencies, no automatic major merges | Dependabot, `.github/dependabot.yml` (INT005) |
| Weekly | CodeQL static analysis scheduled scan | `codeql.yml` schedule (SEC005) |
| Monthly | Dependency review: read open Dependabot pull requests, merge safe updates, evaluate majors individually, confirm no high severity advisory is unaddressed | manual, recorded in the incidents log or a maintenance note (OPS008) |
| Monthly | Browser compatibility check against the supported floor: last two versions of Chrome, Edge, Firefox, Safari, and iOS Safari 16 and later (NFR008, R021). CI `browser_smoke` covers `chromium`, `firefox`, `webkit`, `mobile-safari`, `mobile-chrome` on every run; the monthly pass adds Microsoft Edge through the Playwright `msedge` channel, whose binary is not always present on the CI runner | manual, `npx playwright test --project=chromium --headed` with the `msedge` channel, or a scheduled run if added later |
| Monthly | Lighthouse audit against `https://filter.nixfred.com` via `lhci autorun` with `lighthouserc.json` (NFR005). Accessibility 1.00, best practices 0.95, and SEO 0.90 blocking, performance 0.80 advisory (R023, R024, P004) | manual or scheduled `lhci autorun`, recorded in a maintenance note |
| On model change | Review scientific assumptions and add share URL schema migration logic before shipping (R015, packet 03 section 20 items 7 and 8) | `docs/scientific_assumptions.md`, `src/simulation/serialization.ts` |

There is no dedicated scheduled checks workflow, because the five workflow set is fixed (INT002). Scheduled security scanning is the `codeql.yml` weekly schedule; scheduled dependency review is Dependabot plus the monthly manual pass above. If Fred later wants an automated monthly domain and asset health check, it is added as a sixth workflow with a recorded ruling.

## 7. Artifact retention

Retention defaults, all changeable by Fred (OPS010, packet 03 section 10 item, section 6 item):

| Artifact | Default retention | Rationale |
|----------|-------------------|-----------|
| Production build artifact `filter-dist-<sha>` | 90 days | Serves as the fallback rollback source (section 3.4) and release evidence. |
| CI failure diagnostics (test output, Playwright traces, coverage report) | 14 days | Long enough to debug a failed run, short enough to control storage. |
| Preview build | ephemeral, not retained as a workflow artifact | The live preview deployment is the artifact; Cloudflare ages out old previews. |

These are defaults. Fred can raise or lower any value; the change is a one line edit to the `retention-days` input on the relevant `upload-artifact` step and a recorded ruling.

## 8. Branch protection configuration

This is the exact call referenced by `docs/CI_CD.md` section 6. It runs once at gate G6, after `main` exists on the remote and after the CI job contexts have reported at least once. Before G6, scaffold commits land directly on `main` (R004, `docs/INTAKE.md` section 4 alignment note).

```bash
gh api -X PUT repos/nixfred/filter/branches/main/protection \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "install",
      "format_check",
      "lint",
      "typecheck",
      "unit_tests",
      "simulation_determinism",
      "simulation_properties",
      "coverage",
      "build",
      "bundle_budget",
      "browser_smoke",
      "accessibility_tests"
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  },
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "restrictions": null
}
JSON
```

Set the repository merge policy and hygiene separately (INT001, INT007):

```bash
gh api -X PATCH repos/nixfred/filter \
  -F allow_squash_merge=true \
  -F allow_merge_commit=false \
  -F allow_rebase_merge=false \
  -F delete_branch_on_merge=true
```

Enable secret scanning and push protection (SEC006):

```bash
gh api -X PATCH repos/nixfred/filter \
  -f 'security_and_analysis[secret_scanning][status]=enabled' \
  -f 'security_and_analysis[secret_scanning_push_protection][status]=enabled'
```

Verify:

```bash
gh api repos/nixfred/filter/branches/main/protection \
  --jq '{checks: .required_status_checks.contexts, strict: .required_status_checks.strict, force: .allow_force_pushes.enabled, del: .allow_deletions.enabled, convo: .required_conversation_resolution.enabled}'
```

The verified context list must equal the twelve canonical CI job names. CodeQL and dependency review add their own contexts once those workflows have run; add them to the required list after their first run so a merge cannot bypass a new high severity finding (SEC004, SEC005).

## 9. Incidents log

Incidents are recorded here the same day they occur (OPS007, `BUILD.md` section 14 item 13). Each row links the incident issue and states cause, affected release, rollback, and corrective action. Rollback rehearsals (section 3.7) are recorded here as well.

| Date (UTC) | Issue | Summary | Affected release | Rollback | Corrective action | Status |
|------------|-------|---------|------------------|----------|-------------------|--------|

No incidents recorded yet.

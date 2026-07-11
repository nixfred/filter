# ADR 0004: Cloudflare Pages Direct Upload via Wrangler, driven by GitHub Actions

Status: Accepted, per ruling R003.

## Context

Ruling R003 (docs/DECISIONS.md) already settled the Cloudflare Pages project name (`filter`), production branch (`main`), and custom domain (`filter.nixfred.com`), resolving conflict C004 between the packet's explicit naming and the fleet's `name-nixfred-com` convention in favor of the packet. FILTER_BUILD_PACKET/filter_build_packet/03_CICD_FUNCTIONAL_REQUIREMENTS.md section 1 specifies the deployment model directly: GitHub is the authoritative source repository, GitHub Actions builds, tests, audits, packages, and deploys the application, Cloudflare Pages uses Direct Upload, and Wrangler deploys the generated `dist` directory. Ruling R013 rules out bindings, a database, and server side application logic in v1. This ADR records the consequences and the alternatives that decision implicitly closed off, satisfying the manifest's requirement for a recorded delivery ADR.

## Decision

`deploy_preview.yml` and `deploy_production.yml` (INT002's five workflow set) run entirely inside GitHub Actions: check out the exact commit, install with `npm ci`, run the production build, then invoke Wrangler to perform a Direct Upload deploy of `dist` to the Cloudflare Pages project `filter`. `wrangler.jsonc` is the committed, repository controlled source of truth for the project name, `pages_build_output_dir` set to `./dist`, and a pinned compatibility date (INT004), and defines no bindings, consistent with R013's no server logic rule. `deploy_preview.yml` deploys pull request branch aliases behind Cloudflare Access until Fred opens them (ruling R012, PENDING P001) and always sets preview responses to `noindex` (ruling R005, REL004). `deploy_production.yml` deploys only from `main` after all required checks pass (ruling R011), associates the custom domain `filter.nixfred.com`, records the commit SHA, build time, application version, simulation model version, and Cloudflare deployment identifier (OPS005), and runs a post deployment smoke test against the custom domain (OPS006).

## Consequences

1. The build that gets deployed is the exact same build GitHub Actions already validated in `ci.yml`, since Cloudflare's own git integration build step is not used; this keeps build provenance, required check gating (INT002), and the OPS005 traceability record entirely inside GitHub's own audit trail rather than split across two systems.
2. `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must be managed as GitHub environment secrets, scoped separately for the `preview` and `production` environments (packet 03 section 10), satisfying SEC001's rule against secrets in tracked files.
3. Per the preflight finding in docs/INTAKE.md section 3, the scoped API token in use cannot call `wrangler pages project list` against `/memberships`, so every Wrangler invocation in both workflows must pass `CLOUDFLARE_ACCOUNT_ID` explicitly rather than relying on Wrangler's own account discovery, consistent with the standing rule against masking OAuth with a weaker environment token.
4. A static, Direct Upload only deployment keeps the production attack surface to static assets and headers (SEC003), with no Pages Functions, KV, D1, or R2 present unless a future release explicitly approves a server backed feature (R013, FR036 deferred).
5. Rollback (OPS004) is a Cloudflare Pages deployment selection, not a rebuild, since Direct Upload preserves prior deployment artifacts independently of the Git history at `main`, letting a previous successful deployment be restored without rewriting `main`, per packet 03 section 19.

## Alternatives considered

1. **Cloudflare Pages Git integration, building inside Cloudflare's own build environment.** Rejected. Build provenance, required status checks, and dependency review (INT002, SEC004, SEC005) are designed around GitHub Actions as the build executor; splitting the build into Cloudflare's environment would duplicate toolchain configuration and weaken the single audit trail OPS005 requires. The packet's baseline decision names GitHub Actions as the deployment executor explicitly.
2. **Cloudflare Workers with static assets, instead of Cloudflare Pages.** Rejected. Pages Direct Upload is the packet's explicit, already ruled deployment target (R003), matches the existing pattern of public Pages projects with a custom domain already used across the nixfred.com fleet, and needs no Workers specific routing configuration for a purely static build.
3. **A different hosting provider, such as Vercel or Netlify.** Rejected. The fleet standardizes on Cloudflare, the packet's baseline implementation decision names Cloudflare Pages Direct Upload explicitly, and the same Cloudflare account already holds the `nixfred.com` zone (docs/INTAKE.md section 3), so no second hosting provider account or DNS relationship is needed.

## Cross references

No server logic architecture rule this deployment target supports: docs/ARCHITECTURE.md section 5. Preview access policy: docs/DECISIONS.md ruling R012, docs/PENDING.md P001. Deployment record and rollback procedure detail: docs/deployment.md (owned by a different specialist per docs/CHARTER_COMMON.md rule 6).

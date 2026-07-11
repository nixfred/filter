# CLAUDE.md - The Great Filter (filter.nixfred.com)

Repository operating rules for any agent working here. Global identity and laws live in ~/.claude/CLAUDE.md; this file adds project rules and never replaces them.

## Document authority

1. FILTER_BUILD_PACKET/ is the historical source pack. It is input, not authority.
2. docs/DECISIONS.md settles choices. Never reopen a ruling without recording a material conflict.
3. docs/PRD.md defines obligations. Requirement IDs are stable and never renumbered.
4. docs/GATES.md defines proof. Done is a successful query against it, never a feeling.
5. docs/EXECUTION_PLAN.md defines order.
6. GOAL.md defines autonomous operation for /goal.

## Fixed technology and services

React, TypeScript, Vite. Three.js 2.5D renderer with a non WebGL fallback (F002). Simulation in a Web Worker with deterministic seeded randomness (FR017): no engine transcendental functions in determinism critical math. npm with committed package-lock.json (F003): do not introduce bun, pnpm, or yarn here. GitHub Actions CI/CD with the five workflows named in docs/CI_CD.md. Cloudflare Pages Direct Upload project filter, domain filter.nixfred.com (R003). Cloudflare Web Analytics only (F004). No server logic, bindings, or database in v1 (R013).

## Repository safety

1. This repository is PUBLIC (github.com/nixfred/filter, MIT). No secrets, tokens, private hostnames, personal or family information, ever.
2. git remote -v before every commit. The only permitted remote is github.com/nixfred/filter. Never push to fnix_forever, upstream frameworks, or reference repositories.
3. Run the public safety scan (docs/SECURITY_PLAN.md checklist) before every push.
4. Secrets exist only as GitHub environment secrets. Local secret files are gitignored. Never copy a secret into .env committed files, workflow logs, test reports, or browser code.

## Writing rules

1. No em dashes, no en dashes, anywhere: code comments, docs, copy, commit messages. Hyphenated technical terms and flags are fine.
2. Never fabricate dates, facts, metrics, citations, SHAs, test results, screenshots, or deployment state.
3. Copy voice per UX003 and docs/ART_DIRECTION.md: calm, precise, occasionally dry. No modeling assumption presented as fact (BR003).
4. Commit messages use WHAT, WHY, VERIFIED, EVIDENCE, TAGS. A VERIFIED claim appears only when the exact command succeeded and gated the commit.

## Test and evidence expectations

1. check:all must pass before any commit that claims verification.
2. Determinism fixtures (tests/fixtures/) guard FR017. Changing simulation behavior requires a simulation model version bump and a fixture regeneration recorded in the same commit (R015).
3. Coverage floors: simulation domain 85 percent lines, overall 80 percent (NFR009).
4. Browser claims need Playwright or manual browser evidence under docs/evidence/. Accessibility work follows docs/ACCESSIBILITY.md including its manual protocol.
5. Gate crossings follow the protocol in GOAL.md: evidence, commit, tag gate/GN-YYYYMMDD, report.

## Prohibited behavior

1. Skipping or weakening a blocking check to make a gate pass.
2. Claiming completion without real user path verification at the deployed address.
3. Binding the production domain to a preview, exposing production variables to previews, or granting credentials to fork pull requests.
4. Adding dependencies from unpinned CDNs, or any dependency that materially affects simulation, rendering, analytics, or privacy without documenting it (packet 03 section 4).
5. Deleting or rewriting main history, force pushing, or rolling back by rewriting main (rollback follows docs/OPERATIONS.md).
6. Destructive external actions without Fred's explicit authority.

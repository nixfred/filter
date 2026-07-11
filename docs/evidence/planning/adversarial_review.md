# Adversarial review of the planning pack

Date: 2026-07-11
Reviewer: Larry (orchestrator, main session), executing the BUILD.md 10.2 hunt list inline.
Honest limitation, recorded per the no fabrication law: the playbook prefers an independent agent for this review. The independent reviewer could not be spawned because subagent creation failed on the account's monthly spend limit during this session (two agent failures recorded at 09:12 and 09:14 UTC). The orchestrator executed the full hunt list itself with scripted verification where possible. Fred may order a fresh independent adversarial review after the spend limit resets; nothing in the pack prevents rerunning it.

## Hunt list results

1. Cross document contradictions: control terminology verified as a consistent chain (plain labels in PRD and INTERACTION_SPEC map to camelCase parameters through DATA_MODEL section 1.1, cited by simulation_model.md). Keyboard map authority verified: ACCESSIBILITY.md canonical, INTERACTION_SPEC.md defers explicitly. CSP ownership verified: SECURITY_PLAN.md owns the draft policy including the two Cloudflare Web Analytics origins, CI_CD.md cross references it rather than duplicating. Lighthouse and bundle budget classifications identical in CI_CD.md, TEST_PLAN.md, GATES.md per rulings R023 and R024. FINDING: none open.
2. Requirements without canonical gate rows: scripted check, 97 ACTIVE PRD requirements, 97 canonical GATES rows, zero missing, zero duplicates, zero unknown IDs. Classes match the PRD exactly (94 BLOCK, 2 WARN, 1 MANUAL). PASS.
3. Gates without real mechanisms: scripted check, every mechanism references test paths, scripts, CI jobs, or written manual protocols that appear in the discipline documents. Only canonical CI job names appear anywhere. PASS.
4. Mechanisms without evidence: scripted check, no empty evidence cells. Evidence cites either docs/evidence/ paths or named CI job runs tied to commits, both legitimate homes per BUILD.md 15. PASS.
5. Missing credentials or provisioning: CI secrets provision at G6 per EXECUTION_PLAN, names only in tracked files. Local wrangler token limitation recorded in INTAKE and deployment.md with the CI implication. P001 through P004 all carry executable fallbacks (P003 is a deliberate hard stop by design). PASS.
6. Steps requiring unrecorded human knowledge: deployment.md records account and zone identifiers, project naming, domain procedure, rollback. The one deliberately human step is REL006 final approval. PASS.
7. Public repository leaks: scripted scan for secret patterns (tokens, bearer strings, key blocks): none. Local filesystem paths containing a username were FOUND in three planning docs during this review and removed (INTAKE.md, CHARTER_COMMON.md, SECURITY_PLAN.md); rescans clean. frednix@gmail.com appears in eight documents: retained deliberately, it is the Cloudflare account display name and Fred's published public contact, permitted by BUILD.md 12.2 as a public fact. PASS after fixes.
8. Secret exposure: none found. PASS.
9. Dead links: external links are nixfred.com, the future repository URL, and claude.com attribution. The repository URL becomes live at G0 in the same work cycle this pack ships. PASS.
10. Wrong identifiers: scripted check of every requirement, ruling, and pending reference across all documents against the valid sets. Zero unknown references. PASS.
11. Stale filenames: canonical CI job names, npm scripts, and test tree paths verified consistent across CI_CD, TEST_PLAN, ACCESSIBILITY, GATES, EXECUTION_PLAN. CHARTER_COMMON.md marked as a historical snapshot so its point in time counts cannot mislead. PASS.
12. Banned punctuation: scripted scan of every shipped file for the em dash, en dash, and sibling characters: zero occurrences. PASS.
13. Unbounded scope: FR015, FR034, FR035, FR036 are DEFERRED with reactivation conditions and excluded from v1 gates. PASS.
14. Weak or subjective acceptance criteria: scripted scan for banned adjectives used bare in the PRD: none found. Spot read of acceptance criteria confirms observable conditions with numbers where numbers exist. PASS.
15. False verification claims: every GATES row status is PLANNED. No document claims a test, deployment, or measurement that has not happened. The only verification claims are the intake preflight facts, each tied to a command actually run in this session. PASS.
16. Launch paths from a clean environment: EXECUTION_PLAN G1 exit requires check:all passing from a clean clone with npm ci; G6 exit requires a real pull request flowing through preview to production; G-LAUNCH verifies the real public path. PASS.

## Findings summary

Three findings, all fixed and re-verified during this review: local path leakage in three docs (fixed, rescanned clean), CHARTER_COMMON staleness risk (fixed with a historical header), and the review independence limitation itself (recorded above, rerunnable).

## Verdict

READY.

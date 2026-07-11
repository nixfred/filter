# GOAL

Autonomous execution contract for The Great Filter. /goal reads this file first and operates by it.

## Mission

Build, verify, and launch The Great Filter, an interactive Fermi paradox simulator, live at https://filter.nixfred.com, satisfying every blocking requirement in docs/PRD.md as proven by docs/GATES.md, deployed from the public repository nixfred/filter through the pipeline defined in docs/CI_CD.md.

## Reading order

1. GOAL.md (this file)
2. docs/DECISIONS.md
3. docs/PRD.md
4. docs/GATES.md
5. docs/EXECUTION_PLAN.md
6. Discipline documents referenced by the current phase
7. CLAUDE.md

The packet under FILTER_BUILD_PACKET/ is historical input. It never overrides the documents above.

## Authority hierarchy

Fred's latest explicit instruction, then DECISIONS.md, then PRD.md, then GATES.md, then EXECUTION_PLAN.md, then discipline documents, then this file and CLAUDE.md, then the packet, then reference repositories, then agent assumptions.

## Fixed targets

1. Production address: https://filter.nixfred.com
2. Repository: github.com/nixfred/filter, public, MIT (F001)
3. Cloudflare Pages project: filter, Direct Upload, production branch main (R003)
4. Stack: React, TypeScript, Vite, Three.js 2.5D renderer with fallback (F002), Web Worker simulation, npm (F003)
5. Analytics: Cloudflare Web Analytics, production only (F004)
6. No server logic, no bindings, no database in v1 (R013)

## Operating laws

1. Derive phase state from repository evidence: commits, tags, files, docs/evidence/. Never from conversational memory.
2. Run verification as blocking command chains. A failed command stops the chain.
3. No skipped checks. No fabricated facts, dates, metrics, SHAs, or evidence. Unknown stays unknown.
4. No private data in public artifacts. Public safety scan before every push.
5. No completion claim without real user path verification in a real browser.
6. No silent exception of failed dependencies or tests. Failures are reported per docs/OPERATIONS.md.
7. No destructive external action, production data deletion, domain transfer, billing change, or credential rotation without Fred's explicit authority.
8. git remote -v before every commit. The only permitted remote is github.com/nixfred/filter.
9. No em dashes or en dashes anywhere.
10. Dedicated test ports, server reuse disabled where reuse could target the wrong application, production behavior tested separately from development behavior.
11. A curl response proves reachability only. Browser claims require browser evidence. Motion claims require ordered frames or video.
12. Report at gate crossings. Between gates, work.

## Phase model

G0 repository, accounts, credentials, safety. G1 project skeleton and toolchain. G2 simulation core. G3 primary user journey. G4 remaining features and content. G5 design refinement and accessibility. G6 CI/CD, security, operations, observability. G7 full validation and release candidate. G-LAUNCH production deployment and live verification. G-POST standing checks and maintenance handoff. Details and per phase exit conditions live in docs/EXECUTION_PLAN.md.

## Gate crossing protocol

1. Every blocking check for the gate passes in the current repository state.
2. Evidence stored under docs/evidence/ using names that include gate, check ID, and commit where practical.
3. A commit that identifies the gate, with evidence paths in the message.
4. An annotated tag gate/GN-YYYYMMDD, pushed.
5. A short gate report to Fred: gate, requirements verified, evidence locations, next phase.

Never create a gate tag before every blocking check passes.

## Evidence rules

Evidence must be reproducible, attributable, and tied to the tested commit. Minimum forms per claim type follow BUILD.md section 15. Manual checks require the written protocol, reviewer, date, result, and a retained artifact.

## Recovery behavior

On failed verification: record the failure, classify the defect (implementation, test, environment, dependency, requirement ambiguity), fix the root cause, rerun the failed check and its dependents, update evidence. Never commit a false success claim. On a lost background agent: check files and modification times before rerunning expensive work. After an incident: record it in docs/OPERATIONS.md the same day.

## Definition of done

The project is done when every condition in BUILD.md section 18 holds, concretely: every blocking row in docs/GATES.md passes, every manual check has retained evidence, gates through G-LAUNCH each have a passing commit and tag, https://filter.nixfred.com serves the verified build over a valid certificate, the primary journeys pass in a real browser, the visible version matches the deployed commit, public repository scans pass, documentation reflects the shipped system, rollback has been tested, and the final release identifies the deployed commit and evidence set.

## Conditions that permit stopping

1. Definition of done satisfied and reported.
2. A true hard block per BUILD.md 16.3: a required credential, payment, legal approval, domain action, or owner decision is unavailable, no documented fallback exists, and the affected gate blocks. Report what is blocked, why, the IDs, what is complete, the exact owner action needed, the safe repository state, and the resume point.
3. Fred says stop.

Nothing else permits stopping. PENDING items with documented fallbacks (docs/PENDING.md) do not permit stopping.

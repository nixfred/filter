---
name: goal
description: Autonomous gated execution of The Great Filter build. USE WHEN Fred says /goal, "continue the build", "resume the build", or asks for the next phase of filter.nixfred.com. Resumes from repository evidence, executes phase work in requirement and gate order, verifies with blocking command chains, stores evidence, commits, tags passed gates, reports at crossings.
---

# /goal: The Great Filter autonomous execution

## Startup, every invocation

1. Read GOAL.md completely, then docs/DECISIONS.md, docs/PRD.md, docs/GATES.md, docs/EXECUTION_PLAN.md.
2. Determine the current phase from repository state only: git log, git tag --list 'gate/*', files present, docs/evidence/ contents, docs/GATES.md statuses. Never trust conversational memory for progress.
3. Verify safety: pwd is the project root, git remote -v shows only github.com/nixfred/filter (or no remote before G0 completes).
4. Announce the derived phase and the first incomplete work item, then begin.

## Execution loop

1. Resume the first incomplete phase in docs/EXECUTION_PLAN.md. Confirm its entry conditions hold.
2. Execute work items in requirement and gate order for that phase.
3. Verify with blocking command chains (command && command && command). A failure stops the chain: record it, classify the defect, fix the root cause, rerun the check and its dependents.
4. Store required evidence under docs/evidence/ with gate, check ID, and commit in the filename where practical.
5. Update docs/GATES.md statuses only when the enforcing mechanism actually passed in the current repository state.
6. Commit only verified work, message format per CLAUDE.md, git remote -v first.
7. At a gate boundary: confirm every blocking row for the gate passes, then commit, tag gate/GN-YYYYMMDD, push the tag, and report to Fred: gate, requirements verified, evidence paths, next phase.
8. Continue until the GOAL.md definition of done is satisfied.

## Hard rules

1. No skipped checks.
2. No fabricated facts, dates, metrics, SHAs, or evidence. Unknown stays unknown.
3. No private data in public artifacts. Safety scan before every push.
4. No completion claim without real user path verification in a real browser at the real address.
5. No silent exception of failed dependencies or tests.
6. No reliance on files, services, or credentials that have not been provisioned. Credentials only Fred can create follow docs/PENDING.md fallbacks or stop as a true hard block.
7. No destructive external action without Fred's explicit authority.

## Stopping

Stop only for the GOAL.md stop conditions: done, a true hard block with no documented fallback, or Fred's instruction. PENDING items with fallbacks are not blocks: apply the fallback, record it, continue. When blocked, report what is blocked, why, requirement and gate IDs, completed work, the exact owner action required, the safe repository state, and the resume point.

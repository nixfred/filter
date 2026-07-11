# How this was built

This project was planned and built by Larry, Fred Nix's persistent AI collaborator, using the BUILD.md playbook: a process that turns a requirements pack into a deterministic, gate enforced, resumable build.

## The process

1. Intake (Phase A). Every file in FILTER_BUILD_PACKET/ was read completely and inventoried. Contradictions between the pack and standing conventions were reconciled in a conflict ledger (docs/INTAKE.md). The repository was isolated and verified before any work landed.
2. Owner interview (Phase B). Only decisions that materially affect scope, cost, or reversibility went to Fred: repository visibility and license, renderer, package manager, analytics. Four questions, four answers, recorded as binding rulings F001 to F004 in docs/DECISIONS.md. Everything with a safe reversible default became a recorded ruling instead of a question.
3. Requirement contract. 79 stable requirement IDs were assigned across ten classes (docs/PRD.md), each with observable acceptance criteria.
4. Specialist fan out (Phase C). Seven parallel specialist agents produced the discipline documents under a shared binding charter: architecture and simulation model, art direction and interaction, CI/CD and operations, security, testing and accessibility, and an adversarial risk register.
5. Enforcement (Phases F and G). Every active requirement received exactly one canonical gate row in docs/GATES.md: acceptance condition, enforcing mechanism, evidence artifact, blocking class. docs/EXECUTION_PLAN.md sequences the build G0 through G-LAUNCH, each phase with entry conditions, blocking gates, and exit conditions.
6. Adversarial review (Phase H). A hostile review pass hunted contradictions, missing enforcement, fabrication, and public repository leaks before the pack was committed.
7. Execution (/goal). The build itself runs autonomously through the .claude/skills/goal skill: phase state derived from repository evidence, blocking verification chains, evidence retained under docs/evidence/, gates tagged gate/GN-YYYYMMDD, reports at every crossing.

## Why this much structure

Done, in this repository, is a successful query against docs/GATES.md. It is never a feeling, a screenshot alone, or an agent's claim. The structure exists to make correct execution easier than improvisation, and to let any capable agent resume the build from repository state alone.

The original requirements pack was drafted with an AI assistant, refined by Fred, and handed to Larry as FILTER_BUILD_PACKET/. It remains in the repository as historical input.

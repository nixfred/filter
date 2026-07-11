# ADR 0001: Frontend stack is React with TypeScript and Vite

Status: Accepted.

## Context

The Great Filter needs a frontend stack for a data rich single page application: a live simulation canvas, a control panel with six main controls plus advanced settings (FR001 to FR003), an event ledger (FR006), a Silence Report (FR009), education drawers (FR012), and full accessibility support (ACC001 to ACC006). The application has a single maintainer relationship to the wider nixfred.com fleet, ships with no server logic (R013), and is deployed as a static build to Cloudflare Pages (R003, INT003). FILTER_BUILD_PACKET/filter_build_packet/01_LARRY_EXECUTION_DIRECTIVE.md default implementation decision item 1 already names React with TypeScript and Vite as the baseline, and no interview round changed it.

## Decision

Use React with TypeScript, bundled and served in development by Vite. Unit and integration tests run on Vitest sharing the Vite configuration and module resolution. Component and hook code is organized under `src/components/`, `src/app/`, and `src/state/` as specified in docs/ARCHITECTURE.md section 2.

## Consequences

1. Vite's native support for Web Worker imports (the `?worker` import suffix) lets `src/simulation/simulation.worker.ts` be bundled and code split without custom build tooling, directly supporting FR018.
2. Vitest shares Vite's TypeScript and module resolution configuration with the application build, avoiding a second, divergent test toolchain configuration.
3. React's component and hook model gives the accordion style control panel (FR002's mathematical detail expansion), the drawer and dialog components (ACC006 focus management), and the mobile bottom sheet layout (FR031) a mature, well documented set of accessibility primitives to build on.
4. The team accepts React's runtime and bundle overhead relative to a framework free approach; this is bounded and enforced by the bundle budget in NFR004 and the CI `bundle_budget` job, not left unmeasured.
5. Reusing the stack already proven on other LABS sites in the nixfred.com fleet reduces the risk of introducing a second, unfamiliar toolchain for a solo maintained project.

## Alternatives considered

1. **Vanilla TypeScript with a custom pub/sub layer.** Rejected. A control panel, event ledger, and multiple drawers with complex show and hide, focus, and live region behavior (ACC002, ACC006) benefit from a mature component model. Building and maintaining a custom reactive rendering layer for a solo maintained project increases defect surface without a corresponding benefit, and forgoes reuse of component patterns already proven elsewhere in the fleet.
2. **SvelteKit.** Rejected. Introduces a second frontend framework paradigm into the fleet alongside the existing React based sites, reducing shared component and pattern reuse. The packet's baseline decision names React explicitly, and no interview round surfaced a reason to diverge.
3. **Next.js.** Rejected. Next.js's server rendering and server routing capabilities are unnecessary for a static, client only simulation and conflict with R013's no server logic rule and the Cloudflare Pages Direct Upload static deployment target (R003, INT003, INT004). Adopting it would add framework complexity with no v1 benefit.

## Cross references

Module boundaries this stack supports: docs/ARCHITECTURE.md section 2. Related delivery decision: docs/adr/0004_cloudflare_delivery.md.

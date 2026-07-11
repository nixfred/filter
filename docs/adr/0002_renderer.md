# ADR 0002: Renderer is Three.js in a 2.5D presentation, with a non WebGL fallback

Status: Accepted, per ruling F002.

## Context

Ruling F002 (docs/DECISIONS.md) already settled this choice through Fred's owner interview: the galaxy canvas is a two dimensional galaxy disc with depth effects such as parallax and tilt, rendered with Three.js points and custom shaders, reusing the stack already proven on galaxy.nixfred.com. F002 resolves packet 02's open design choice on two dimensional versus three dimensional rendering (packet open choices Q25 and Q145/Q146). This ADR records the resulting consequences and the alternatives ruling F002 closed off, satisfying the manifest's requirement for a recorded renderer ADR with rejected options documented, and implements FR028, FR029, NFR001, NFR002, NFR004, and UX001.

## Decision

The primary renderer implementation composes Three.js point based layers and custom shaders over a 2D galaxy disc plane, using camera positioning and shader driven parallax and tilt for depth cues rather than a fully navigable 3D volume. The renderer is split into `galaxy_layer.ts`, `civilization_layer.ts`, `signal_layer.ts`, `travel_layer.ts`, and `labels_layer.ts`, composed behind the single `RendererAdapter` interface defined in docs/ARCHITECTURE.md section 2.5. A second implementation, `fallback_renderer.ts`, built on Canvas 2D, is selected by `capability.ts` for devices without WebGL, for low power mode, and as the default motion language when reduced motion is active, and provides a meaningful, non blank presentation of the same `SimulationSnapshot` and `SimulationEventBatch` data (R021: older devices receive the fallback renderer, never a blank page).

## Consequences

1. Reusing the Three.js point and shader approach already proven on galaxy.nixfred.com reduces implementation and maintenance risk for a solo maintained project, and lets patterns such as depth of field style parallax be carried across LABS properties.
2. The team accepts the ongoing maintenance burden of hand written shaders for the signal shell, travel front, and parallax depth effects named in the motion language section of packet 02, rather than relying entirely on a higher level scene graph abstraction.
3. Two independent rendering code paths must be kept behind one adapter interface so that neither the simulation core nor the state stores ever need to know which implementation is mounted, per docs/ARCHITECTURE.md section 2.5.
4. Explicit capability detection and a tiered particle and effect budget (NFR002) are required so the primary path degrades within itself before ever falling back to the second implementation, keeping visual quality proportional to device capability rather than binary.
5. A restrained two dimensional disc with depth effects, rather than a fully navigable 3D volume, supports the "vast, legible, and indifferent" quality the art direction in packet 02 calls for, and avoids the free camera navigation complexity a full 3D galaxy would add to selection, inspection, and screen reader description (ACC002).

## Alternatives considered

1. **PixiJS.** Rejected. PixiJS is a capable 2D WebGL library, but the parallax, tilt, and custom shader driven signal shell and travel front effects called for in packet 02's motion language section are more directly supported by Three.js's shader and camera primitives, and no existing fleet code reuse exists for a PixiJS based approach.
2. **A fully navigable 3D galaxy.** Rejected explicitly by ruling F002. A free camera 3D volume adds navigation complexity that works against the "vast, legible, indifferent" art direction goal, complicates keyboard only operation (ACC001) and civilization selection (FR005), and raises performance risk on the mid range 2021 class mobile reference device (R021, NFR001).
3. **Canvas 2D as the sole primary renderer for every device.** Rejected as the primary strategy. A Canvas 2D only approach cannot deliver the shader driven signal shells, travel fronts, and depth parallax the art direction and motion language sections of packet 02 call for at an acceptable visual quality on capable devices. Canvas 2D remains the correct implementation choice specifically for `fallback_renderer.ts`, where a simpler, discrete state, low motion presentation is the intended behavior rather than a compromise.

## Cross references

Renderer adapter interface and capability detection strategy: docs/ARCHITECTURE.md sections 2.5 and 7. Motion language and reduced motion behavior this renderer must implement: docs/DECISIONS.md ruling R020, FR029.

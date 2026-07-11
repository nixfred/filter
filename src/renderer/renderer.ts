// The renderer adapter contract and factory (F002, FR028, FR029,
// docs/ARCHITECTURE.md 2.5). GalaxyViewport consumes exactly this interface;
// the Three.js and fallback implementations both satisfy it.
import type { CameraState } from './camera';
import type { RenderCapability } from './capability';
import type { RenderModel } from './render_model';
import { createThreeRenderer } from './galaxy_layer';
import { createFallbackRenderer } from './fallback_renderer';

export interface RendererAdapter {
  mount(container: HTMLElement): void;
  /** Draw the model as of the given simulated year and camera. */
  render(model: RenderModel, nowYear: number, camera: CameraState): void;
  setMotionMode(mode: 'full' | 'reduced'): void;
  resize(width: number, height: number): void;
  unmount(): void;
  readonly kind: 'three' | 'fallback';
}

export function createRenderer(capability: RenderCapability): RendererAdapter {
  if (capability.webgl) {
    try {
      return createThreeRenderer(capability);
    } catch {
      // Primary path failed to initialize: degrade, never blank (FR030).
      return createFallbackRenderer(capability);
    }
  }
  return createFallbackRenderer(capability);
}

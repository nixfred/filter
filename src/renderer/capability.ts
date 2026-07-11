// Capability detection (NFR002, FR030, docs/ARCHITECTURE.md 2.5): decides
// which adapter implementation mounts and at which quality tier.
export type RenderQualityTier = 'high' | 'low';
export type MotionMode = 'full' | 'reduced';

export interface RenderCapability {
  webgl: boolean;
  tier: RenderQualityTier;
  motion: MotionMode;
}

export interface CapabilityInputs {
  /** From the ui_store preference plus the media query. */
  prefersReducedMotion: boolean;
  lowPowerMode: boolean;
  /** navigator.deviceMemory where available, undefined elsewhere. */
  deviceMemoryGb?: number;
}

export function detectWebgl(doc: Document = document): boolean {
  try {
    const canvas = doc.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function resolveCapability(webgl: boolean, inputs: CapabilityInputs): RenderCapability {
  const lowMemory = inputs.deviceMemoryGb !== undefined && inputs.deviceMemoryGb <= 4;
  return {
    webgl: webgl && !inputs.lowPowerMode,
    tier: inputs.lowPowerMode || lowMemory ? 'low' : 'high',
    motion: inputs.prefersReducedMotion ? 'reduced' : 'full',
  };
}

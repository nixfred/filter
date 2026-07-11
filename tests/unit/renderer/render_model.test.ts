import { describe, expect, it } from 'vitest';
import { RenderModel } from '../../../src/renderer/render_model';
import { resolveCapability } from '../../../src/renderer/capability';
import {
  CAMERA_DEFAULT,
  CAMERA_MAX_SPAN_LY,
  CAMERA_MIN_SPAN_LY,
  panCamera,
  zoomCamera,
} from '../../../src/renderer/camera';
import { stateColor, RENDER_COLORS } from '../../../src/renderer/color_system';

// Renderer logic that runs identically under both adapters (FR028, FR029,
// UX005): drawable state, capability resolution, camera arithmetic, colors.
describe('RenderModel', () => {
  const model = new RenderModel();
  model.loadSystems([
    { id: 0, xLy: 0, yLy: 0 },
    { id: 1, xLy: 1000, yLy: 0 },
  ]);

  it('tracks civilization state from transition events', () => {
    model.applyEvent({
      id: 1,
      atYear: 100,
      causeEventId: null,
      type: 'StateTransition',
      civilizationId: 7,
      fromState: 'candidate_system',
      toState: 'habitable_world',
      hostSystemId: 1,
    });
    expect(model.civilizations.get(7)?.state).toBe('habitable_world');
    expect(model.civilizations.get(7)?.systemId).toBe(1);
  });

  it('expands signal shells at light speed and honors truncation', () => {
    model.applyEvent({
      id: 2,
      atYear: 1000,
      causeEventId: null,
      type: 'SignalEmissionStart',
      signalId: 3,
      systemId: 0,
      emissionEndYear: 5000,
      strength: 0.8,
    });
    const signal = model.signals.get(3);
    expect(signal).toBeDefined();
    if (!signal) return;
    expect(model.signalShellAt(signal, 500)).toBeNull();
    expect(model.signalShellAt(signal, 3000)).toEqual({ inner: 0, outer: 2000 });
    expect(model.signalShellAt(signal, 6000)).toEqual({ inner: 1000, outer: 5000 });
    // Truncation via an early SignalEmissionEnd (extinction).
    model.applyEvent({
      id: 3,
      atYear: 2000,
      causeEventId: null,
      type: 'SignalEmissionEnd',
      signalId: 3,
    });
    expect(model.signals.get(3)?.endYear).toBe(2000);
  });

  it('grows frontiers at the configured sub light speed', () => {
    model.expansionSpeedFractionC = 0.05;
    model.applyEvent({
      id: 4,
      atYear: 10_000,
      causeEventId: null,
      type: 'ExpansionLaunch',
      frontierId: 1,
      systemId: 1,
    });
    const frontier = model.frontiers.get(1);
    expect(frontier).toBeDefined();
    if (!frontier) return;
    expect(model.frontierRadiusAt(frontier, 9_000)).toBe(0);
    expect(model.frontierRadiusAt(frontier, 30_000)).toBe(1000);
  });
});

describe('capability resolution', () => {
  it('prefers WebGL unless low power mode is on', () => {
    expect(
      resolveCapability(true, { prefersReducedMotion: false, lowPowerMode: false }).webgl,
    ).toBe(true);
    expect(resolveCapability(true, { prefersReducedMotion: false, lowPowerMode: true }).webgl).toBe(
      false,
    );
    expect(
      resolveCapability(false, { prefersReducedMotion: false, lowPowerMode: false }).webgl,
    ).toBe(false);
  });

  it('reduces motion and tier from the inputs', () => {
    const c = resolveCapability(true, {
      prefersReducedMotion: true,
      lowPowerMode: false,
      deviceMemoryGb: 2,
    });
    expect(c.motion).toBe('reduced');
    expect(c.tier).toBe('low');
  });
});

describe('camera arithmetic', () => {
  it('clamps zoom to the documented bounds', () => {
    expect(zoomCamera(CAMERA_DEFAULT, 0.00001).viewSpanLy).toBe(CAMERA_MIN_SPAN_LY);
    expect(zoomCamera(CAMERA_DEFAULT, 1e9).viewSpanLy).toBe(CAMERA_MAX_SPAN_LY);
  });

  it('pans in world units proportional to the view span', () => {
    const panned = panCamera({ ...CAMERA_DEFAULT, viewSpanLy: 10_000 }, 100, 0, 1000);
    expect(panned.centerXLy).toBe(CAMERA_DEFAULT.centerXLy - 1000);
  });
});

describe('color system', () => {
  it('reserves red for extinction only (UX005)', () => {
    expect(stateColor('extinct')).toBe(RENDER_COLORS.dangerRedFill);
    for (const state of ['technology', 'detectable', 'interstellar', 'quiet', 'life'] as const) {
      expect(stateColor(state)).not.toBe(RENDER_COLORS.dangerRedFill);
    }
  });

  it('gives technology gold and transmission violet (ART_DIRECTION 1.3)', () => {
    expect(stateColor('technology')).toBe(RENDER_COLORS.techGold);
    expect(stateColor('detectable')).toBe(RENDER_COLORS.signalViolet);
  });
});

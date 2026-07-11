import { describe, expect, it, vi } from 'vitest';
import { createFallbackRenderer } from '../../../src/renderer/fallback_renderer';
import { RenderModel } from '../../../src/renderer/render_model';
import { CAMERA_DEFAULT } from '../../../src/renderer/camera';

// The fallback renderer must never blank the page (FR030, R021). jsdom has no
// real 2D context, so a minimal stub proves the draw path runs and issues the
// expected primitive calls without throwing.
function stubCanvasContext() {
  const calls: string[] = [];
  const ctx = {
    fillStyle: '',
    strokeStyle: '',
    fillRect: () => calls.push('fillRect'),
    beginPath: () => calls.push('beginPath'),
    arc: () => calls.push('arc'),
    fill: () => calls.push('fill'),
    stroke: () => calls.push('stroke'),
  };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  );
  return calls;
}

describe('fallback renderer', () => {
  it('mounts a canvas tagged as the fallback and draws civilizations', () => {
    const calls = stubCanvasContext();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const renderer = createFallbackRenderer({ webgl: false, tier: 'low', motion: 'full' });
    renderer.mount(container);
    expect(container.querySelector('canvas')?.getAttribute('data-renderer')).toBe('fallback');

    const model = new RenderModel();
    model.loadSystems([{ id: 0, xLy: 0, yLy: 0 }]);
    model.applyEvent({
      id: 1,
      atYear: 100,
      causeEventId: null,
      type: 'StateTransition',
      civilizationId: 0,
      fromState: 'candidate_system',
      toState: 'technology',
      hostSystemId: 0,
    });
    renderer.render(model, 100, { ...CAMERA_DEFAULT });
    expect(calls).toContain('fillRect');
    expect(calls).toContain('arc');
    renderer.unmount();
    expect(container.querySelector('canvas')).toBeNull();
    vi.restoreAllMocks();
  });

  it('omits motion effects in reduced motion mode', () => {
    const calls = stubCanvasContext();
    const container = document.createElement('div');
    const renderer = createFallbackRenderer({ webgl: false, tier: 'low', motion: 'reduced' });
    renderer.mount(container);
    const model = new RenderModel();
    model.loadSystems([{ id: 0, xLy: 0, yLy: 0 }]);
    model.applyEvent({
      id: 1,
      atYear: 100,
      causeEventId: null,
      type: 'SignalEmissionStart',
      signalId: 0,
      systemId: 0,
      emissionEndYear: 5000,
      strength: 0.9,
    });
    renderer.render(model, 3000, { ...CAMERA_DEFAULT });
    // No stroke calls: shells are suppressed in reduced motion (FR029).
    expect(calls).not.toContain('stroke');
    vi.restoreAllMocks();
  });
});

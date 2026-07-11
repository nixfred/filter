// The galaxy canvas (FR005, FR028, FR029, UX007): mounts the renderer
// adapter, feeds it the drawable model, and owns zoom, pan, and keyboard
// camera control. The only component that touches the renderer.
//
// The viewport element is a genuine interactive widget (a zoomable, pannable
// map) using role application with a roving tab stop, the documented pattern
// in docs/ACCESSIBILITY.md 2.6. The static element heuristics in jsx-a11y
// cannot see that, hence the file scoped exceptions below.
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
import { useEffect, useRef } from 'react';
import { CAMERA_DEFAULT, panCamera, zoomCamera, type CameraState } from '../../renderer/camera';
import { detectWebgl, resolveCapability } from '../../renderer/capability';
import { RenderModel } from '../../renderer/render_model';
import { createRenderer, type RendererAdapter } from '../../renderer/renderer';
import type { SimulationEvent } from '../../simulation/types';
import { COPY } from '../../content/copy';

export interface ViewportFeed {
  systems: { id: number; xLy: number; yLy: number }[] | null;
  events: SimulationEvent[];
  displayYear: number;
  expansionSpeedFractionC: number;
}

interface Props {
  feed: ViewportFeed;
  reducedMotion: boolean;
  lowPowerMode: boolean;
}

export function GalaxyViewport({ feed, reducedMotion, lowPowerMode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<RendererAdapter | null>(null);
  const modelRef = useRef(new RenderModel());
  const cameraRef = useRef<CameraState>({ ...CAMERA_DEFAULT });
  const appliedCountRef = useRef(0);
  const feedRef = useRef(feed);
  useEffect(() => {
    feedRef.current = feed;
  }, [feed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const capability = resolveCapability(detectWebgl(), {
      prefersReducedMotion: reducedMotion,
      lowPowerMode,
    });
    const adapter = createRenderer(capability);
    adapter.mount(container);
    adapterRef.current = adapter;

    // Throttled to about 30 frames per second, and skips rendering entirely
    // when nothing changed since the last frame (no new events, no camera
    // move, no active motion). This keeps the main thread free so the
    // interface stays responsive (NFR006) instead of rebuilding the scene
    // every animation frame.
    let frame = 0;
    let lastRenderMs = 0;
    let lastYear = -1;
    let lastCameraKey = '';
    const FRAME_INTERVAL_MS = 33;
    const loop = (nowMs: number) => {
      frame = requestAnimationFrame(loop);
      if (nowMs - lastRenderMs < FRAME_INTERVAL_MS) return;
      lastRenderMs = nowMs;
      const current = feedRef.current;
      const model = modelRef.current;
      if (current.systems && model.systems.size === 0) {
        model.loadSystems(current.systems);
        appliedCountRef.current = 0;
      }
      model.expansionSpeedFractionC = current.expansionSpeedFractionC;
      let changed = false;
      while (appliedCountRef.current < current.events.length) {
        model.applyEvent(current.events[appliedCountRef.current]);
        appliedCountRef.current += 1;
        changed = true;
      }
      const camera = cameraRef.current;
      const cameraKey = `${camera.viewSpanLy}:${camera.centerXLy}:${camera.centerYLy}`;
      const hasMotion = !reducedMotion && (model.signals.size > 0 || model.frontiers.size > 0);
      if (
        !changed &&
        cameraKey === lastCameraKey &&
        (current.displayYear === lastYear || !hasMotion)
      ) {
        return;
      }
      lastYear = current.displayYear;
      lastCameraKey = cameraKey;
      adapter.render(model, current.displayYear, camera);
    };
    frame = requestAnimationFrame(loop);

    const onResize = () => {
      adapter.resize(container.clientWidth, container.clientHeight);
    };
    globalThis.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      globalThis.removeEventListener('resize', onResize);
      adapter.unmount();
      adapterRef.current = null;
    };
  }, [reducedMotion, lowPowerMode]);

  useEffect(() => {
    adapterRef.current?.setMotionMode(reducedMotion ? 'reduced' : 'full');
  }, [reducedMotion]);

  function onWheel(event: React.WheelEvent) {
    cameraRef.current = zoomCamera(cameraRef.current, event.deltaY > 0 ? 1.15 : 0.87);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    // Canvas scoped controls (docs/ACCESSIBILITY.md 1.3).
    const camera = cameraRef.current;
    if (event.key === '+' || event.key === '=') {
      cameraRef.current = zoomCamera(camera, 0.8);
    } else if (event.key === '-') {
      cameraRef.current = zoomCamera(camera, 1.25);
    } else if (event.key === 'Home') {
      cameraRef.current = { ...CAMERA_DEFAULT };
    } else if (event.shiftKey && event.key.startsWith('Arrow')) {
      const step = 60;
      const dx = event.key === 'ArrowLeft' ? step : event.key === 'ArrowRight' ? -step : 0;
      const dy = event.key === 'ArrowUp' ? step : event.key === 'ArrowDown' ? -step : 0;
      cameraRef.current = panCamera(camera, dx, dy, 800);
    } else {
      return;
    }
    event.preventDefault();
  }

  const dragRef = useRef<{ x: number; y: number } | null>(null);

  return (
    <div
      ref={containerRef}
      className="galaxy-viewport"
      data-testid="galaxy-viewport"
      role="application"
      aria-label="Galaxy map. Arrow keys move selection, plus and minus zoom, Home resets framing."
      tabIndex={0}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      onPointerDown={(event) => {
        dragRef.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerMove={(event) => {
        if (!dragRef.current) return;
        const short = Math.min(
          containerRef.current?.clientWidth || 800,
          containerRef.current?.clientHeight || 600,
        );
        cameraRef.current = panCamera(
          cameraRef.current,
          event.clientX - dragRef.current.x,
          event.clientY - dragRef.current.y,
          short,
        );
        dragRef.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={() => {
        dragRef.current = null;
      }}
    >
      <span className="visually-hidden">{COPY.degraded.loading}</span>
    </div>
  );
}

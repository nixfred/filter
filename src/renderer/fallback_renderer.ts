// The fallback renderer (FR028, FR029, FR030): Canvas 2D, no WebGL, meaningful
// under low power and reduced motion. Never a blank page (ruling R021).
import type { CameraState } from './camera';
import type { RenderCapability } from './capability';
import type { RendererAdapter } from './renderer';
import type { RenderModel } from './render_model';
import { stateColor } from './color_system';

function hex(color: number): string {
  return '#' + color.toString(16).padStart(6, '0');
}

export function createFallbackRenderer(capability: RenderCapability): RendererAdapter {
  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null = null;
  let motion: 'full' | 'reduced' = capability.motion;
  let width = 800;
  let height = 600;

  return {
    kind: 'fallback',
    mount(container: HTMLElement) {
      canvas = document.createElement('canvas');
      width = container.clientWidth || 800;
      height = container.clientHeight || 600;
      canvas.width = width;
      canvas.height = height;
      canvas.setAttribute('data-renderer', 'fallback');
      container.appendChild(canvas);
      context = canvas.getContext('2d');
    },
    render(model: RenderModel, nowYear: number, cameraState: CameraState) {
      if (!context) return;
      const ctx = context;
      ctx.fillStyle = '#070b14';
      ctx.fillRect(0, 0, width, height);
      const short = Math.min(width, height);
      const scale = short / cameraState.viewSpanLy;
      const toScreen = (xLy: number, yLy: number): [number, number] => [
        width / 2 + (xLy - cameraState.centerXLy) * scale,
        height / 2 + (yLy - cameraState.centerYLy) * scale,
      ];

      // Signal shells and travel fronts as thin circles in full motion; in
      // reduced motion state changes appear as discrete dots only (FR029).
      if (motion === 'full') {
        for (const signal of model.signals.values()) {
          const shell = model.signalShellAt(signal, nowYear);
          const system = model.systems.get(signal.systemId);
          if (!shell || !system) continue;
          const [sx, sy] = toScreen(system.xLy, system.yLy);
          ctx.strokeStyle = 'rgba(155, 126, 240, 0.35)';
          ctx.beginPath();
          ctx.arc(sx, sy, shell.outer * scale, 0, Math.PI * 2);
          ctx.stroke();
        }
        for (const frontier of model.frontiers.values()) {
          const radius = model.frontierRadiusAt(frontier, nowYear);
          const system = model.systems.get(frontier.systemId);
          if (radius <= 0 || !system) continue;
          const [sx, sy] = toScreen(system.xLy, system.yLy);
          ctx.strokeStyle = 'rgba(255, 211, 122, 0.5)';
          ctx.beginPath();
          ctx.arc(sx, sy, radius * scale, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      for (const civ of model.civilizations.values()) {
        const system = model.systems.get(civ.systemId);
        if (!system) continue;
        const [sx, sy] = toScreen(system.xLy, system.yLy);
        ctx.fillStyle = hex(stateColor(civ.state));
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    setMotionMode(mode) {
      motion = mode;
    },
    resize(w, h) {
      width = w;
      height = h;
      if (canvas) {
        canvas.width = w;
        canvas.height = h;
      }
    },
    unmount() {
      canvas?.remove();
      canvas = null;
      context = null;
    },
  };
}

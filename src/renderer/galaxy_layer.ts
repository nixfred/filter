// The Three.js implementation of the renderer adapter (F002, FR028, UX001,
// UX002). Composes the decorative starfield, civilization points, signal
// shells, and travel fronts in a 2.5D tilted orthographic view. The
// decorative starfield conveys scale only and is never described as
// simulated (BR003, docs/simulation_model.md section 7).
import * as THREE from 'three';
import type { CameraState } from './camera';
import type { RenderCapability } from './capability';
import type { RendererAdapter } from './renderer';
import type { RenderModel } from './render_model';
import { RENDER_COLORS, stateColor } from './color_system';

export function createThreeRenderer(capability: RenderCapability): RendererAdapter {
  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let camera3: THREE.OrthographicCamera | null = null;
  let starfield: THREE.Points | null = null;
  let civPoints: THREE.Points | null = null;
  let shellGroup: THREE.Group | null = null;
  let frontGroup: THREE.Group | null = null;
  let motion: 'full' | 'reduced' = capability.motion;
  let width = 800;
  let height = 600;

  function buildStarfield(): THREE.Points {
    const count = capability.tier === 'high' ? 18_000 : 4_000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const white = new THREE.Color(RENDER_COLORS.starWhite);
    const cyan = new THREE.Color(RENDER_COLORS.starCyanDim);
    for (let i = 0; i < count; i++) {
      // Decorative only: engine randomness is fine here, this layer never
      // touches the simulation or the digest.
      const r = 55_000 * Math.sqrt(Math.random());
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.cos(a);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1_500;
      positions[i * 3 + 2] = r * Math.sin(a);
      const c = Math.random() < 0.3 ? white : cyan;
      const dim = 0.25 + Math.random() * 0.75;
      colors[i * 3] = c.r * dim;
      colors[i * 3 + 1] = c.g * dim;
      colors[i * 3 + 2] = c.b * dim;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 90,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    return new THREE.Points(geometry, material);
  }

  return {
    kind: 'three',
    mount(container: HTMLElement) {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      width = container.clientWidth || 800;
      height = container.clientHeight || 600;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
      renderer.setClearColor(RENDER_COLORS.bgBase);
      container.appendChild(renderer.domElement);
      renderer.domElement.setAttribute('data-renderer', 'three');
      scene = new THREE.Scene();
      camera3 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400_000);
      starfield = buildStarfield();
      scene.add(starfield);
      shellGroup = new THREE.Group();
      frontGroup = new THREE.Group();
      scene.add(shellGroup);
      scene.add(frontGroup);
    },
    render(model: RenderModel, nowYear: number, cameraState: CameraState) {
      if (!renderer || !scene || !camera3) return;
      // 2.5D: orthographic top view tilted 30 degrees for depth (F002).
      const span = cameraState.viewSpanLy;
      const aspect = width / height;
      camera3.left = (-span / 2) * Math.max(aspect, 1);
      camera3.right = (span / 2) * Math.max(aspect, 1);
      camera3.top = span / 2 / Math.min(aspect, 1) || span / 2;
      camera3.bottom = -span / 2 / Math.min(aspect, 1) || -span / 2;
      camera3.position.set(cameraState.centerXLy, span * 0.9, cameraState.centerYLy + span * 0.5);
      camera3.lookAt(cameraState.centerXLy, 0, cameraState.centerYLy);
      camera3.updateProjectionMatrix();

      // Civilization points rebuilt per frame from the model (bounded by the
      // representative population, NFR007 keeps this a typed array).
      if (civPoints) {
        scene.remove(civPoints);
        civPoints.geometry.dispose();
        (civPoints.material as THREE.Material).dispose();
        civPoints = null;
      }
      const civs = [...model.civilizations.values()];
      if (civs.length > 0) {
        const positions = new Float32Array(civs.length * 3);
        const colors = new Float32Array(civs.length * 3);
        civs.forEach((civ, i) => {
          const system = model.systems.get(civ.systemId);
          if (!system) return;
          positions[i * 3] = system.xLy;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = system.yLy;
          const color = new THREE.Color(stateColor(civ.state));
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
        });
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        civPoints = new THREE.Points(
          geometry,
          new THREE.PointsMaterial({ size: 700, vertexColors: true, depthWrite: false }),
        );
        scene.add(civPoints);
      }

      // Signal shells: soft concentric rings expanding at light speed (UX002,
      // detectability as a halo). Skipped entirely in reduced motion, where
      // the ledger carries the story (FR029).
      shellGroup?.clear();
      frontGroup?.clear();
      if (motion === 'full' && shellGroup && frontGroup) {
        for (const signal of model.signals.values()) {
          const shell = model.signalShellAt(signal, nowYear);
          const system = model.systems.get(signal.systemId);
          if (!shell || !system || shell.outer < 200) continue;
          const ring = new THREE.Mesh(
            new THREE.RingGeometry(Math.max(shell.inner, shell.outer * 0.97), shell.outer, 64),
            new THREE.MeshBasicMaterial({
              color: RENDER_COLORS.signalViolet,
              transparent: true,
              opacity: Math.max(0.05, 0.4 * signal.strength * (1 - shell.outer / 60_000)),
              side: THREE.DoubleSide,
              depthWrite: false,
            }),
          );
          ring.rotation.x = -Math.PI / 2;
          ring.position.set(system.xLy, 0, system.yLy);
          shellGroup.add(ring);
        }
        for (const frontier of model.frontiers.values()) {
          const radius = model.frontierRadiusAt(frontier, nowYear);
          const system = model.systems.get(frontier.systemId);
          if (radius < 100 || !system) continue;
          const front = new THREE.Mesh(
            new THREE.RingGeometry(radius * 0.99, radius, 64),
            new THREE.MeshBasicMaterial({
              color: RENDER_COLORS.techGoldBright,
              transparent: true,
              opacity: 0.5,
              side: THREE.DoubleSide,
              depthWrite: false,
            }),
          );
          front.rotation.x = -Math.PI / 2;
          front.position.set(system.xLy, 0, system.yLy);
          frontGroup.add(front);
        }
      }

      renderer.render(scene, camera3);
    },
    setMotionMode(mode) {
      motion = mode;
    },
    resize(w, h) {
      width = w;
      height = h;
      renderer?.setSize(w, h);
    },
    unmount() {
      renderer?.dispose();
      renderer?.domElement.remove();
      renderer = null;
      scene = null;
    },
  };
}

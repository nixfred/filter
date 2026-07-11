// The opening hero galaxy (UX004, UX001): a live, slowly drifting spiral of
// stars behind the opening content, showing at a glance what the product is.
// Self contained Three.js so the opening does not depend on the simulation.
// A few brighter points pulse gold and violet to hint at civilizations and
// their signals. Respects reduced motion: static, no drift, when asked.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RENDER_COLORS } from '../../renderer/color_system';

interface Props {
  reducedMotion: boolean;
}

const STAR_COUNT = 9000;
const ARMS = 4;

function roundSprite(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.8)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

export function HeroGalaxy({ reducedMotion }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 600;

    // Degrade gracefully where WebGL is unavailable (FR030): the opening keeps
    // its gradient background, no crash. Also lets jsdom render the opening.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 4000);
    camera.position.set(0, 260, 620);
    camera.lookAt(0, 0, 0);

    const sprite = roundSprite();

    // Spiral starfield: log spiral arms plus scatter, tinted white to cyan.
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const white = new THREE.Color(RENDER_COLORS.starWhite);
    const cyan = new THREE.Color(RENDER_COLORS.starCyanDim);
    const gold = new THREE.Color(RENDER_COLORS.techGold);
    const violet = new THREE.Color(RENDER_COLORS.signalViolet);
    for (let i = 0; i < STAR_COUNT; i++) {
      const t = Math.pow(Math.random(), 0.6);
      const radius = 60 + t * 460;
      const arm = i % ARMS;
      const wind = radius * 0.012;
      const scatter = (Math.random() - 0.5) * (0.5 + (1 - t) * 0.8);
      const angle = (arm / ARMS) * Math.PI * 2 + wind + scatter;
      positions[i * 3] = radius * Math.cos(angle);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 26 * (1 - t * 0.6);
      positions[i * 3 + 2] = radius * Math.sin(angle);
      const roll = Math.random();
      const c = roll < 0.02 ? gold : roll < 0.04 ? violet : roll < 0.34 ? white : cyan;
      const dim = 0.3 + Math.random() * 0.7;
      colors[i * 3] = c.r * dim;
      colors[i * 3 + 1] = c.g * dim;
      colors[i * 3 + 2] = c.b * dim;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 6,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      map: sprite,
      alphaTest: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    // A soft violet core glow.
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(38, 24, 24),
      new THREE.MeshBasicMaterial({
        color: RENDER_COLORS.signalViolet,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(core);

    let frame = 0;
    let last = 0;
    const startTilt = 0.9;
    stars.rotation.x = startTilt;
    core.position.y = 0;

    const render = () => {
      renderer.render(scene, camera);
    };

    if (reducedMotion) {
      stars.rotation.y = 0.3;
      render();
    } else {
      const loop = (now: number) => {
        frame = requestAnimationFrame(loop);
        if (now - last < 33) return;
        last = now;
        stars.rotation.y += 0.0009;
        const pulse = 0.16 + Math.sin(now * 0.0012) * 0.05;
        (core.material as THREE.MeshBasicMaterial).opacity = pulse;
        render();
      };
      frame = requestAnimationFrame(loop);
    }

    const onResize = () => {
      width = container.clientWidth || width;
      height = container.clientHeight || height;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    globalThis.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      globalThis.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      sprite.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="hero-galaxy" data-testid="hero-galaxy" aria-hidden="true" />
  );
}

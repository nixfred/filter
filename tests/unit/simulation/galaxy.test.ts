import { describe, expect, it } from 'vitest';
import { generateGalaxy, GALAXY_DISC_RADIUS_LY } from '../../../src/simulation/galaxy';
import { createRng } from '../../../src/simulation/rng';

// Representative population generation (FR023, docs/simulation_model.md 7).
describe('generateGalaxy', () => {
  it('generates exactly the requested population with stable ids', () => {
    const systems = generateGalaxy(createRng(5, 6), 200);
    expect(systems).toHaveLength(200);
    systems.forEach((s, i) => expect(s.id).toBe(i));
  });

  it('keeps every system inside the disc with valid weights', () => {
    const systems = generateGalaxy(createRng(5, 6), 500);
    for (const s of systems) {
      expect(s.position.radiusLy).toBeGreaterThanOrEqual(0);
      expect(s.position.radiusLy).toBeLessThanOrEqual(GALAXY_DISC_RADIUS_LY);
      expect(s.habitabilityWeight).toBeGreaterThanOrEqual(0);
      expect(s.habitabilityWeight).toBeLessThanOrEqual(1);
    }
  });

  it('caches Cartesian coordinates consistent with the polar position', () => {
    const systems = generateGalaxy(createRng(5, 6), 100);
    for (const s of systems) {
      const r = Math.sqrt(s.position.xLy * s.position.xLy + s.position.yLy * s.position.yLy);
      expect(Math.abs(r - s.position.radiusLy)).toBeLessThan(0.001);
    }
  });

  it('is deterministic for the same rng seed', () => {
    const a = generateGalaxy(createRng(11, 12), 64);
    const b = generateGalaxy(createRng(11, 12), 64);
    expect(a).toEqual(b);
  });
});

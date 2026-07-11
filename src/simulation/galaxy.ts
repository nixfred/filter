// Representative population generation (FR023, docs/simulation_model.md 7).
// A simplified exponential radial density profile over an abstract disc,
// never a real star catalog (ruling R014). Positions convert to Cartesian
// once, here, through the sanctioned deterministic trigonometry.
import type { Rng } from './rng';
import type { StarSystem } from './types';
import { detCos, detLog, detSin, TWO_PI } from '../utils/math';

export const GALAXY_DISC_RADIUS_LY = 50_000;
export const GALAXY_SCALE_LENGTH_LY = 15_000;
export const GALAXY_ARM_COUNT = 4;
export const GALAXY_HEIGHT_LY = 500;

export function generateGalaxy(rng: Rng, populationSize: number): StarSystem[] {
  const systems: StarSystem[] = [];
  for (let i = 0; i < populationSize; i++) {
    // Exponential radial profile via inverse CDF with the deterministic log,
    // truncated to the disc radius (docs/simulation_model.md section 7).
    let radiusLy = -GALAXY_SCALE_LENGTH_LY * detLog(1 - rng.nextUnit());
    if (radiusLy > GALAXY_DISC_RADIUS_LY) radiusLy = GALAXY_DISC_RADIUS_LY;
    const armIndex = rng.nextU32() % GALAXY_ARM_COUNT;
    // Base angle per arm plus a logarithmic spiral wind and local scatter.
    const wind = radiusLy / GALAXY_DISC_RADIUS_LY;
    const scatter = (rng.nextUnit() - 0.5) * 0.6;
    const angleRadians = (armIndex / GALAXY_ARM_COUNT) * TWO_PI + wind * 2.2 + scatter;
    const heightOffsetLy = (rng.nextUnit() - 0.5) * 2 * GALAXY_HEIGHT_LY;
    // Habitability falls toward the crowded core and the sparse rim, peaking
    // mid disc: a documented modeling simplification.
    const mid = radiusLy / GALAXY_DISC_RADIUS_LY;
    const habitabilityWeight = 0.5 + 0.5 * (1 - Math.abs(mid - 0.45) * 2) * rng.nextUnit();
    systems.push({
      id: i,
      position: {
        radiusLy,
        angleRadians,
        armIndex,
        heightOffsetLy,
        xLy: radiusLy * detCos(angleRadians),
        yLy: radiusLy * detSin(angleRadians),
      },
      habitabilityWeight: habitabilityWeight < 0 ? 0 : habitabilityWeight,
    });
  }
  return systems;
}

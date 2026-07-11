// Civilization state to color mapping (UX005, docs/ART_DIRECTION.md 1.3).
// Quiet red is reserved exclusively for danger and extinction.
import type { CivState } from '../simulation/types';

export const RENDER_COLORS = {
  bgBase: 0x070b14,
  starWhite: 0xf5f7ff,
  starCyanPale: 0xb9e3ff,
  starCyanDim: 0x6fa8c9,
  techGold: 0xe8b34d,
  techGoldBright: 0xffd37a,
  signalViolet: 0x9b7ef0,
  signalVioletBright: 0xc4afff,
  dangerRedFill: 0xc4463b,
  textSecondary: 0x9aa7c2,
} as const;

/** Color for a civilization point by its current state. */
export function stateColor(state: CivState): number {
  switch (state) {
    case 'habitable_world':
    case 'life':
    case 'complex_life':
      return RENDER_COLORS.starCyanDim;
    case 'intelligence':
      return RENDER_COLORS.starCyanPale;
    case 'technology':
      return RENDER_COLORS.techGold;
    case 'detectable':
      return RENDER_COLORS.signalViolet;
    case 'interstellar':
      return RENDER_COLORS.techGoldBright;
    case 'quiet':
    case 'transformed':
      return RENDER_COLORS.starCyanDim;
    case 'extinct':
      return RENDER_COLORS.dangerRedFill;
    default:
      return RENDER_COLORS.starWhite;
  }
}

// The eight packet presets (FR010, packet 02 preset ideas) plus one showcase
// preset that exercises the advanced settings. Control values are the preset
// definitions the property tests enforce; acceptance bands live beside them
// per docs/TEST_PLAN.md 2.2.1.
import type { AdvancedParams, MainControls } from '../simulation/types';

export interface Preset {
  id: string;
  name: string;
  description: string;
  controls: MainControls;
  /** Optional advanced overrides. Picking the preset opens the advanced
   *  panel so the settings are visible and adjustable (FR003, FR010). */
  advanced?: AdvancedParams;
}

export const PRESETS: Preset[] = [
  {
    id: 'silent-galaxy',
    name: 'The Silent Galaxy',
    description: 'Life is uncommon. Technology is rare. Contact is effectively absent.',
    controls: {
      lifeEmergence: 0.1,
      intelligenceEmergence: 0.1,
      technologicalTransition: 0.2,
      longTermSurvival: 0.3,
      detectableCommunication: 0.15,
      interstellarExpansion: 0.05,
    },
  },
  {
    id: 'crowded-briefly',
    name: 'Crowded, Briefly',
    description: 'Intelligence is common. Technological lifetimes are short.',
    controls: {
      lifeEmergence: 0.85,
      intelligenceEmergence: 0.8,
      technologicalTransition: 0.75,
      longTermSurvival: 0.1,
      detectableCommunication: 0.6,
      interstellarExpansion: 0.2,
    },
  },
  {
    id: 'loud-but-lonely',
    name: 'Loud but Lonely',
    description: 'Civilizations transmit strongly, but timing and distance prevent replies.',
    controls: {
      lifeEmergence: 0.4,
      intelligenceEmergence: 0.35,
      technologicalTransition: 0.5,
      longTermSurvival: 0.45,
      detectableCommunication: 0.95,
      interstellarExpansion: 0.05,
    },
  },
  {
    id: 'rare-earth',
    name: 'Rare Earth',
    description: 'The early biological transitions dominate the filter.',
    controls: {
      lifeEmergence: 0.05,
      intelligenceEmergence: 0.15,
      technologicalTransition: 0.7,
      longTermSurvival: 0.7,
      detectableCommunication: 0.6,
      interstellarExpansion: 0.3,
    },
  },
  {
    id: 'fragile-intelligence',
    name: 'Fragile Intelligence',
    description: 'Many intelligent species reach technology. Most disappear quickly.',
    controls: {
      lifeEmergence: 0.7,
      intelligenceEmergence: 0.7,
      technologicalTransition: 0.8,
      longTermSurvival: 0.15,
      detectableCommunication: 0.5,
      interstellarExpansion: 0.15,
    },
  },
  {
    id: 'patient-stars',
    name: 'Patient Stars',
    description: 'Civilizations survive for very long periods but do not travel.',
    controls: {
      lifeEmergence: 0.5,
      intelligenceEmergence: 0.4,
      technologicalTransition: 0.5,
      longTermSurvival: 0.95,
      detectableCommunication: 0.5,
      interstellarExpansion: 0.02,
    },
  },
  {
    id: 'expansion-wins',
    name: 'Expansion Wins',
    description: 'A small number of civilizations become interstellar and transform the map.',
    controls: {
      lifeEmergence: 0.6,
      intelligenceEmergence: 0.5,
      technologicalTransition: 0.7,
      longTermSurvival: 0.9,
      detectableCommunication: 0.6,
      interstellarExpansion: 0.95,
    },
  },
  {
    id: 'optimists-milky-way',
    name: "Optimist's Milky Way",
    description: 'Life, survival, communication, and overlap are all comparatively favorable.',
    controls: {
      lifeEmergence: 0.9,
      intelligenceEmergence: 0.85,
      technologicalTransition: 0.9,
      longTermSurvival: 0.9,
      detectableCommunication: 0.95,
      interstellarExpansion: 0.5,
    },
  },
  {
    id: 'deep-time',
    name: 'Deep Time',
    description:
      'Fifty billion years, a dense galaxy, and frontiers that cross it at half light speed. Opens the advanced settings.',
    controls: {
      lifeEmergence: 0.7,
      intelligenceEmergence: 0.6,
      technologicalTransition: 0.7,
      longTermSurvival: 0.92,
      detectableCommunication: 0.7,
      interstellarExpansion: 0.85,
    },
    advanced: {
      runHorizonYears: 50_000_000_000,
      representativePopulationSize: 8192,
      expansionEffectiveSpeedFractionC: 0.5,
      expansionLaunchDelayYears: 0,
      expansionSettlementDelayYears: 0,
      detectionRecognitionThreshold: 0.05,
    },
  },
];

export function presetById(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}

// Application copy, single source (UX003, UX004, ruling R017 voice rules:
// calm, precise, occasionally dry, no em or en dashes, no claim to solve
// the Fermi paradox).
export const COPY = {
  title: 'THE GREAT FILTER',
  eyebrow: 'A NixFred LABS experiment',
  supportingLine: 'Build a galaxy. Seed the stars. See who survives long enough to be heard.',
  explainer:
    'An interactive journey through the Fermi paradox. Set the odds of life, intelligence, and survival, then run an entire galaxy forward across billions of years and watch what happens.',
  explainerTwo:
    'Civilizations flicker on. Most fade. A few transmit into the dark. Almost none are close enough, at the right moment, to ever hear a reply.',
  steps: [
    {
      n: '01',
      title: 'Set the odds',
      body: 'Six controls for life, intelligence, technology, survival, communication, and expansion.',
    },
    {
      n: '02',
      title: 'Run a galaxy',
      body: 'Ten billion years unfold. Points of light appear, spread, transmit, and go quiet.',
    },
    {
      n: '03',
      title: 'Read the silence',
      body: 'A report tells you who spoke, who nearly met, and why the sky stayed silent.',
    },
  ],
  toneLine:
    'Most civilizations miss each other by a few million years. Cosmically speaking, terrible calendar management.',
  createGalaxy: 'CREATE A GALAXY',
  runPreset: 'RUN A PRESET',
  start: 'Start',
  controls: {
    lifeEmergence: {
      label: 'Life emergence',
      explanation: 'How often a habitable world hosts an independent origin of life.',
      effect: 'Sets how many candidate worlds ever reach life.',
    },
    intelligenceEmergence: {
      label: 'Intelligence emergence',
      explanation: 'How often complex life develops intelligence.',
      effect: 'Sets how many living worlds ever produce minds.',
    },
    technologicalTransition: {
      label: 'Technological transition',
      explanation: 'How often an intelligent species builds detectable technology.',
      effect: 'Sets how many minds ever build something the stars could notice.',
    },
    longTermSurvival: {
      label: 'Long term survival',
      explanation:
        'How long technological civilizations endure their own hazards, self destruction included.',
      effect: 'Sets how quickly the lights that turn on go dark again.',
    },
    detectableCommunication: {
      label: 'Detectable communication',
      explanation: 'How often, and for how long, a civilization is loud enough to be heard.',
      effect: 'Sets how many civilizations ever transmit, and for how long.',
    },
    interstellarExpansion: {
      label: 'Interstellar expansion',
      explanation: 'How often a detectable civilization begins moving between stars.',
      effect: 'Sets whether any frontier ever crosses the map.',
    },
  },
  rungs: ['Vanishingly rare', 'Rare', 'Uncommon', 'Common', 'Nearly universal'],
  degraded: {
    loading: 'Preparing the galaxy.',
    unsupported:
      'This browser cannot render the galaxy. The simulation still runs; results appear as text.',
    degradedNote: 'Running in low power mode. Visual detail is reduced, the model is identical.',
    error: 'Something failed in the galaxy. Your scenario is safe; replay it any time.',
    emptyLedger: 'Nothing has happened yet. Cosmic patience is a virtue.',
  },
  report: {
    heading: 'Silence Report',
    funnel: 'Population funnel',
    overlap: 'Overlap and contact',
    records: 'Records',
    replay: 'Replay',
    newGalaxy: 'New Galaxy',
    share: 'Share',
    close: 'Close',
    viewReport: 'View report',
  },
  metricLabels: {
    candidateWorldCount: 'Candidate worlds',
    independentLifeOriginCount: 'Independent origins of life',
    intelligentSpeciesCount: 'Intelligent species',
    technologicalCivilizationCount: 'Technological civilizations',
    detectableCivilizationCount: 'Civilizations that became detectable',
    disappearedCivilizationCount: 'Civilizations that disappeared',
    peakSimultaneousActiveCount: 'Civilizations active at the same time',
    signalOverlapCount: 'Signal overlaps',
    travelOverlapCount: 'Travel overlaps',
    confirmedContactCount: 'Confirmed contacts',
    closestNearMissDistanceLy: 'Closest near miss in space',
    closestNearMissTimeYears: 'Closest near miss in time',
    longestLivedCivilizationYears: 'Longest lived civilization',
    medianTechnologicalLifetimeYears: 'Median technological lifetime',
    mostRestrictiveTransitionId: 'Most restrictive transition',
  },
  transitionNames: {
    candidate_to_habitable: 'Habitability',
    habitable_to_life: 'The origin of life',
    life_to_complex: 'Complex life',
    complex_to_intelligence: 'Intelligence',
    intelligence_to_technology: 'Technology',
    technology_to_detectable: 'Detectability',
    detectable_to_interstellar: 'Interstellar expansion',
    none: 'None reached',
  },
  share: {
    heading: 'Share this galaxy',
    body: 'The link reproduces this exact run: same seed, same physics, same silence.',
    copy: 'Copy link',
    copied: 'Copied',
  },
  footer: {
    credit: 'A NixFred LABS project',
    site: 'nixfred.com',
    repo: 'Source',
  },
} as const;

// The fifteen Silence Report metrics, Great Filter attribution, and the
// headline sentence (FR009, FR027, docs/DATA_MODEL.md 2.6,
// docs/simulation_model.md section 12).
import type { EngineRunState } from './engine';
import { TRANSITION_FROM, TRANSITION_ORDER, TRANSITION_TO } from './transitions';
import type { RunMetrics, TransitionId } from './types';
import { systemDistanceLy } from './light_cone';

export function computeMetrics(state: EngineRunState): RunMetrics {
  const civs = state.civilizations;

  const reached = (s: string) => civs.filter((c) => c.stateHistory.some((h) => h.state === s));
  const lifeCivs = reached('life');
  const intelligentCivs = reached('intelligence');
  const techCivs = reached('technology');
  const detectableCivs = reached('detectable');

  const disappeared = civs.filter((c) =>
    c.stateHistory.some((h) => h.state === 'extinct' || h.state === 'quiet'),
  );

  // Peak simultaneous technological-or-later activity, by sweeping entry and
  // terminal years (docs/DATA_MODEL.md metric 7 definition: active means a
  // living civilization at technology or beyond).
  const deltas: { atYear: number; delta: number }[] = [];
  for (const civ of techCivs) {
    const start = civ.stateHistory.find((h) => h.state === 'technology');
    if (!start) continue;
    const end = civ.stateHistory.find(
      (h) => h.state === 'extinct' || h.state === 'quiet' || h.state === 'transformed',
    );
    deltas.push({ atYear: start.atYear, delta: 1 });
    if (end) deltas.push({ atYear: end.atYear, delta: -1 });
  }
  deltas.sort((a, b) => a.atYear - b.atYear || a.delta - b.delta);
  let active = 0;
  let peak = 0;
  for (const d of deltas) {
    active += d.delta;
    if (active > peak) peak = active;
  }

  const contacts = state.events.filter((e) => e.type === 'ContactEvent');
  const travelOverlaps = state.events.filter((e) => e.type === 'TravelOverlapEvent');

  // Near misses among detectable civilizations that never appeared in any
  // contact: closest pair in space, smallest window gap in time.
  const contactedIds = new Set<number>();
  for (const e of contacts) {
    if (e.type === 'ContactEvent') {
      contactedIds.add(e.sourceCivilizationId);
      contactedIds.add(e.receivingCivilizationId);
    }
  }
  let nearMissDistance = Infinity;
  let nearMissTime = Infinity;
  for (let i = 0; i < detectableCivs.length; i++) {
    for (let j = i + 1; j < detectableCivs.length; j++) {
      const a = detectableCivs[i];
      const b = detectableCivs[j];
      if (contactedIds.has(a.id) && contactedIds.has(b.id)) continue;
      const d = systemDistanceLy(
        state.systems[a.hostSystemId].position,
        state.systems[b.hostSystemId].position,
      );
      if (d < nearMissDistance) nearMissDistance = d;
      if (a.detectableWindow && b.detectableWindow) {
        const gap =
          a.detectableWindow.startYear > b.detectableWindow.endYear
            ? a.detectableWindow.startYear - b.detectableWindow.endYear
            : b.detectableWindow.startYear > a.detectableWindow.endYear
              ? b.detectableWindow.startYear - a.detectableWindow.endYear
              : 0;
        if (gap > 0 && gap < nearMissTime) nearMissTime = gap;
      }
    }
  }

  // Longest lived: habitable entry to terminal (or run end for survivors).
  const runEnd = state.events.length ? state.events[state.events.length - 1].atYear : 0;
  let longest = 0;
  const techLifetimes: number[] = [];
  for (const civ of techCivs) {
    const start = civ.stateHistory.find((h) => h.state === 'technology');
    if (!start) continue;
    const end = civ.stateHistory.find(
      (h) => h.state === 'extinct' || h.state === 'quiet' || h.state === 'transformed',
    );
    const lifetime = (end ? end.atYear : runEnd) - start.atYear;
    techLifetimes.push(lifetime);
    if (lifetime > longest) longest = lifetime;
  }
  techLifetimes.sort((a, b) => a - b);
  const median =
    techLifetimes.length === 0
      ? 0
      : techLifetimes.length % 2 === 1
        ? techLifetimes[(techLifetimes.length - 1) / 2]
        : Math.round(
            (techLifetimes[techLifetimes.length / 2 - 1] +
              techLifetimes[techLifetimes.length / 2]) /
              2,
          );

  // Most restrictive transition: lowest realized pass rate, ties broken by
  // chain order (docs/simulation_model.md section 12).
  const entered: Record<TransitionId, number> = {} as Record<TransitionId, number>;
  const passed: Record<TransitionId, number> = {} as Record<TransitionId, number>;
  for (const t of TRANSITION_ORDER) {
    entered[t] = 0;
    passed[t] = 0;
  }
  entered.candidate_to_habitable = state.systems.length;
  passed.candidate_to_habitable = civs.length;
  for (const t of TRANSITION_ORDER) {
    if (t === 'candidate_to_habitable') continue;
    const from = TRANSITION_FROM[t];
    const to = TRANSITION_TO[t];
    for (const civ of civs) {
      if (civ.stateHistory.some((h) => h.state === from)) entered[t]++;
      if (civ.stateHistory.some((h) => h.state === to)) passed[t]++;
    }
  }
  let mostRestrictive: TransitionId | 'none' = 'none';
  let lowestRate = Infinity;
  for (const t of TRANSITION_ORDER) {
    if (entered[t] === 0) continue;
    const rate = passed[t] / entered[t];
    if (rate < lowestRate) {
      lowestRate = rate;
      mostRestrictive = t;
    }
  }

  const metrics: RunMetrics = {
    candidateWorldCount: state.systems.length,
    independentLifeOriginCount: lifeCivs.length,
    intelligentSpeciesCount: intelligentCivs.length,
    technologicalCivilizationCount: techCivs.length,
    detectableCivilizationCount: detectableCivs.length,
    disappearedCivilizationCount: disappeared.length,
    peakSimultaneousActiveCount: peak,
    signalOverlapCount: state.signalOverlapCount,
    travelOverlapCount: travelOverlaps.length,
    confirmedContactCount: contacts.length,
    closestNearMissDistanceLy: Number.isFinite(nearMissDistance) ? Math.round(nearMissDistance) : 0,
    closestNearMissTimeYears: Number.isFinite(nearMissTime) ? nearMissTime : 0,
    longestLivedCivilizationYears: longest,
    medianTechnologicalLifetimeYears: median,
    mostRestrictiveTransitionId: mostRestrictive,
    headline: '',
  };
  metrics.headline = generateHeadline(metrics);
  return metrics;
}

/**
 * The memorable sentence (BR004, FR009). Deterministic template selection
 * from the metrics themselves; voice per UX003 and ruling R017.
 */
export function generateHeadline(m: RunMetrics): string {
  const spoke = m.detectableCivilizationCount;
  if (m.confirmedContactCount > 0 && spoke > 0) {
    return m.confirmedContactCount === 1
      ? 'Contact occurred once. Across ' +
          formatCount(m.candidateWorldCount) +
          ' worlds and every year of this galaxy, once.'
      : formatCount(m.confirmedContactCount) +
          ' contacts occurred among ' +
          formatCount(spoke) +
          ' civilizations that spoke. The galaxy was, briefly, a conversation.';
  }
  if (spoke > 1) {
    if (m.closestNearMissTimeYears > 0) {
      return (
        formatCount(spoke) +
        ' civilizations spoke. The closest pair missed each other by ' +
        formatYears(m.closestNearMissTimeYears) +
        '.'
      );
    }
    return formatCount(spoke) + ' civilizations spoke. None were close enough to hear another.';
  }
  if (spoke === 1) {
    return 'One civilization spoke. No one else was listening, then or ever.';
  }
  if (m.technologicalCivilizationCount > 0) {
    return (
      formatCount(m.technologicalCivilizationCount) +
      ' civilizations built technology. None of them ever made a sound the stars could carry.'
    );
  }
  if (m.intelligentSpeciesCount > 0) {
    return 'Intelligence arose. Technology never followed. The silence here was total.';
  }
  return 'Nothing in this galaxy ever looked up. The silence was never noticed.';
}

function formatCount(n: number): string {
  if (n >= 1000) {
    return String(Math.round(n / 100) / 10) + ' thousand';
  }
  return String(n);
}

function formatYears(years: number): string {
  if (years >= 1_000_000_000) {
    return String(Math.round(years / 100_000_000) / 10) + ' billion years';
  }
  if (years >= 1_000_000) {
    return String(Math.round(years / 100_000) / 10) + ' million years';
  }
  if (years >= 1_000) {
    return String(Math.round(years / 100) / 10) + ' thousand years';
  }
  return String(years) + ' years';
}

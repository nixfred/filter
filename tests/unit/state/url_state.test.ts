import { describe, expect, it } from 'vitest';
import { scenarioFromSearch, shareUrlFor } from '../../../src/state/url_state';
import { createScenario } from '../../../src/simulation/scenario';

// Share links decode through the exact serialization code path (FR008,
// SEC002 fail closed).
describe('url state', () => {
  it('round trips a scenario through the share URL', () => {
    const scenario = createScenario(555, 666);
    const url = shareUrlFor('https://filter.nixfred.com', scenario);
    const search = url.slice(url.indexOf('?'));
    const decoded = scenarioFromSearch(search);
    expect(decoded).not.toBeNull();
    expect(decoded?.seedA).toBe(555);
    expect(decoded?.seedB).toBe(666);
  });

  it('treats hostile or malformed links as absent', () => {
    expect(scenarioFromSearch('?s=%%%%%')).toBeNull();
    expect(scenarioFromSearch('?s=' + 'A'.repeat(500))).toBeNull();
    expect(scenarioFromSearch('?other=1')).toBeNull();
    expect(scenarioFromSearch('')).toBeNull();
  });
});

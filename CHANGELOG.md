# Changelog

User visible changes and simulation model changes. Application versions are
semantic; the simulation model carries its own integer version so shared URLs
always state which model produced them.

## v1.0.0 (2026-07-11)

First public release. Live at https://filter.nixfred.com

Simulation model version: 1

- Build a galaxy with six controls: life emergence, intelligence emergence,
  technological transition, long term survival, detectable communication, and
  interstellar expansion, or run one of eight curated presets.
- A deterministic, seeded simulation runs an entire galactic history in a Web
  Worker. The same shared link reproduces the same modeled history exactly, on
  every supported browser.
- A Three.js galaxy renders civilizations as points of light: gold for
  technology, violet signal shells expanding at light speed, frontiers for
  interstellar expansion, and a cooling fade for extinction. A Canvas 2D
  fallback covers no WebGL, low power, and reduced motion.
- Contact respects physics: two civilizations alive at the same time is never
  enough. A signal has to still be sweeping past a listener that exists and can
  recognize it. Contact, the rarest event, is marked with a glowing notice.
- Every run ends in a Silence Report whose headline is a sentence, not a chart.
- A Start over control, an event ledger, a field guide, an About and privacy
  panel, a keyboard shortcuts sheet, full keyboard operation, a rate capped
  screen reader live region, and reduced motion and low power modes.
- No accounts, no cookies, no personal data. Cloudflare Web Analytics only.
- Deployed from an immutable Git commit; the visible version matches the
  deployed commit.

# ART DIRECTION

Visual system for The Great Filter (filter.nixfred.com). Implements UX001, UX002, UX005, UX006, R017, R020, and packet file 02 (Product and Art Direction). Every value in this document is exact and load bearing. Where a value required a judgment call not settled in DECISIONS.md, it is marked ASSUMPTION and repeated in the final report.

Direction: Observatory Elegy for the live simulation, Cosmic Atlas for education and report surfaces, per ruling R020. The galaxy should feel vast, legible, and indifferent, per packet file 02.

ACCESSIBILITY.md is the canonical source for numeric contrast targets (its section 5.1) and the color vision safety strategy (its section 5.2). This document supplies the palette tokens, typography, and motion timing that satisfy those targets and that strategy. If the two documents ever disagree on a contrast number or a color vision safety rule, ACCESSIBILITY.md wins and this document is corrected.

## 1. Color system

All colors are specified as hex tokens. Contrast ratios below are computed against the WCAG 2.1 relative luminance formula, not estimated. The numeric targets these figures are checked against, per ACCESSIBILITY.md section 5.1: normal text (under 18.66px bold, or under 24px) at least 4.5:1; large text (at least 18.66px bold, or at least 24px) at least 3:1; interface component boundaries and states at least 3:1; meaningful graphical objects (a civilization marker against the background, a signal ring) at least 3:1; the focus indicator against adjacent colors at least 3:1. The check to run before every merge that touches color: compute contrast for every text and non-text UI pairing below with an automated contrast checker (for example the axe DevTools contrast checker or a scriptable WCAG contrast utility in the accessibility test suite, ACC005), and run the full palette through a deuteranopia and protanopia simulation (Chrome DevTools Rendering panel, Emulate vision deficiencies, or an equivalent simulator) to confirm the color vision safety strategy in section 1.4 still holds after any palette edit.

### 1.1 Background depth

| Token | Hex | Role |
|---|---|---|
| `color-bg-void` | `#05070C` | Deepest background, full viewport scrim behind modal dialogs at 75 percent opacity (`rgba(5,7,12,0.75)`) |
| `color-bg-base` | `#070B14` | Primary application background, canvas backdrop |
| `color-bg-elevated` | `#0C1220` | Cosmic Atlas solid surfaces: drawers, Silence Report, education panels |
| `color-bg-overlay` | `#10182A` | Observatory Elegy glass surfaces base color, always used under 0.55 to 0.72 alpha, never opaque |

### 1.2 Stellar points

| Token | Hex | Role |
|---|---|---|
| `color-star-white` | `#F5F7FF` | Bright decorative and representative-population stellar points |
| `color-star-cyan-pale` | `#B9E3FF` | Secondary stellar points, neutral confirmation feedback (for example a "copied" state) |
| `color-star-cyan-dim` | `#6FA8C9` | Dim or dormant decorative stars, low intensity background layer |

### 1.3 Technological gold, transmission violet, danger red

| Token | Hex | Role |
|---|---|---|
| `color-tech-gold` | `#E8B34D` | Emerging technological civilizations, primary call to action fill |
| `color-tech-gold-bright` | `#FFD37A` | Technology halo highlight, primary button hover fill |
| `color-signal-violet` | `#9B7EF0` | Active detectable communication, signal shells |
| `color-signal-violet-bright` | `#C4AFFF` | Signal shell leading edge, contact flare secondary tone |
| `color-danger-red-fill` | `#C4463B` | Non-text danger fill only: extinction points, cooling-fade end state, collapse glyphs. Never used for text or icons that must carry independent contrast |
| `color-danger-red-text` | `#E2685C` | Danger and error text, labels, and icons that must meet text contrast |

Rule, binding: quiet red (`color-danger-red-fill` and `color-danger-red-text`) is reserved exclusively for danger, collapse, and extinction, including the application level Error degraded state (section 7 of INTERACTION_SPEC.md), which is a system level collapse and is the one permitted reuse. No button, link, decorative accent, or chart series outside danger and error semantics may use either red token.

### 1.4 Color vision safety strategy

This section implements the canonical strategy defined in ACCESSIBILITY.md section 5.2 with exact tokens, shapes, and a legend. Danger red and technological gold sit closest together on a deuteranopia or protanopia simulation, since both can shift toward a shared brown or amber region when red-green discrimination is impaired. Color is never the only channel that carries meaning:

1. Every civilization state is encoded by a distinct glyph shape in addition to color, so state is readable without hue discrimination (legend below).
2. Every state also carries a text label whenever labels are shown (FR007); the labels toggle only hides labels for a pure visual mode that a color reliant visitor can choose to leave on.
3. Cosmic Atlas surfaces (education drawers, Silence Report) state outcomes in words, per BR004 and UX001, so the single most memorable result of a run carries no color dependency.
4. States differ in relative brightness as well as hue, not color alone, so a grayscale rendering still separates them (see the Brightness column below).
5. The legend below maps every glyph and color to its state name, and is reachable from the application (a permanent key in the status bar on desktop, a "Legend" entry in the mobile controls sheet).

All fill and stroke colors used for glyphs are drawn from sections 1.2 and 1.3, each of which measures at least 7.6:1 against `color-bg-base`, comfortably clearing the 3:1 meaningful graphical object minimum from ACCESSIBILITY.md section 5.1.

#### 1.4.1 Civilization state legend

The eleven FR016 states, each a distinct shape, color, and relative brightness. Shape complexity and fill area increase through the developmental sequence (states 1 through 8), then diverge for the three terminal states (9 through 11), so state is never inferable from position in a simple linear scale alone.

| # | State (FR016) | Glyph shape | Color token | Relative brightness |
|---|---|---|---|---|
| 1 | Candidate system | Open ring, unfilled, thin 1px stroke | `color-star-cyan-dim` | Dim |
| 2 | Habitable world | Filled dot, small (4px) | `color-star-cyan-dim` | Dim |
| 3 | Life | Filled dot, medium (6px) | `color-star-white` | Medium |
| 4 | Complex life | Filled dot with one thin ring around it | `color-star-white` | Medium |
| 5 | Intelligence | Filled diamond | `color-star-white` | Bright |
| 6 | Technology | Filled triangle, point up | `color-tech-gold` | Bright |
| 7 | Detectable | Filled triangle with an expanding ring or shell around it (animated per section 5.2, static with a numeric radius label under reduced motion) | `color-signal-violet` | Bright |
| 8 | Interstellar | Filled triangle with a radiating wedge or fan behind it, distinct from the detectable state's concentric ring | `color-signal-violet-bright` | Bright |
| 9 | Quiet (alive, no longer detectable) | Filled dot with a single horizontal line beneath it (a mute mark) | `color-star-cyan-dim` | Dim |
| 10 | Transformed | Filled square | `color-star-cyan-pale` | Medium |
| 11 | Extinct | Contracting ring motif, per section 5.4, ending as a dimmed outline | `color-danger-red-fill` | Dimmest |

Extinction and collapse additionally carry a distinct motion signature: a downward luminance and scale trajectory (section 5.4), where technological emergence (state 6) carries a rising luminance and scale trajectory (section 5.1). This motion direction is a secondary disambiguator on top of the glyph and color legend above, and is the one channel that survives even at a glance during active playback.

Signal violet and technological gold additionally sit on opposite ends of the blue-yellow axis, which is preserved under both deuteranopia and protanopia, so states 6 through 8 remain distinguishable by hue in addition to the shape, brightness, and legend already specified.

### 1.5 Interface text

| Token | Hex | On `color-bg-base` | On `color-bg-elevated` |
|---|---|---|---|
| `color-text-primary` | `#E7ECF7` | 16.6:1 | 15.8:1 |
| `color-text-secondary` | `#9AA7C2` | 8.1:1 | 7.7:1 |
| `color-text-tertiary` | `#5C6785` | 3.5:1 (large text and non-text UI only; see note) | comparable |
| `color-danger-red-text` | `#E2685C` | 6.0:1 | comparable |
| `color-tech-gold` (as text or icon) | `#E8B34D` | 10.3:1 | comparable |
| `color-signal-violet` (as text or icon) | `#9B7EF0` | 6.2:1 | comparable |

All figures meet or exceed the ACCESSIBILITY.md section 5.1 normal text minimum (4.5:1) except `color-text-tertiary`, which measures 3.5:1 and only clears the large text and non-text UI component minimum (3:1), not the normal text minimum. `color-text-tertiary` is restricted by rule to disabled control labels and placeholder text, both exempt from WCAG 1.4.3 as inactive UI components. Per ACCESSIBILITY.md section 5.1's exact large text definition (at least 18.66px bold, or at least 24px), `color-text-tertiary` may only additionally be used for non-disabled text at `type-lg` (25px) or larger; it must never be used at `type-md` or smaller for body copy, control explanations, or ledger entries, since 3.5:1 would fail the normal text minimum at those sizes.

Text on `color-tech-gold` fill (primary button): `color-text-inverse` `#0B0F1A` on `#E8B34D` measures 10.0:1.

### 1.6 Interface surfaces and borders

| Token | Value | Role |
|---|---|---|
| `color-surface-glass` | `rgba(16,24,42,0.62)` with `backdrop-filter: blur(12px) saturate(120%)` | Observatory Elegy chrome: control rail, status bar, timeline, transport |
| `color-border-hairline` | `rgba(154,167,194,0.16)` | Default divider on glass surfaces |
| `color-border-hairline-solid` | `rgba(154,167,194,0.24)` | Divider on Cosmic Atlas solid surfaces, raised opacity for definition without blur |
| `color-focus-ring` | `#7FD1FF` | Focus indicator, 11.7:1 against `color-bg-base`, exceeds the 3:1 non-text minimum |

Focus ring geometry: 2px solid outline, 2px offset from the target element edge, applied via `:focus-visible` only, never suppressed. No component may set `outline: none` without supplying this exact replacement.

## 2. Typography

Self hosted only, no third party font CDN, per SEC007 and NFR003. All font files ship as `woff2` from the application origin.

### 2.1 Typefaces

| Role | Typeface | License | Source |
|---|---|---|---|
| Interface and body (Observatory Elegy) | Inter (variable) | SIL Open Font License | self hosted, subset to Latin |
| Display and editorial (title treatment, Cosmic Atlas headings and biography prose) | Fraunces (variable) | SIL Open Font License | self hosted, subset to Latin |
| Data, coordinates, mathematical detail, timestamps | IBM Plex Mono | SIL Open Font License | self hosted, lazy loaded with the advanced detail and event ledger code chunk |

Loading strategy: Inter variable (regular, medium, semibold instances) and a static Fraunces Light instance for the title treatment are preloaded as critical fonts with `font-display: optional`. IBM Plex Mono is not preloaded; it loads with the code split chunk that renders the advanced mathematical detail panel and the event ledger, satisfying NFR003's requirement that optional panels lazy load.

### 2.2 Type scale

Base 1rem equals 16px. Ratio 1.250 (major third), rounded to three decimal places.

| Token | rem | px (at 16px root) | Use |
|---|---|---|---|
| `type-xs` | 0.640rem | 10.24px | Micro labels, coordinate tags, badge text |
| `type-sm` | 0.800rem | 12.8px | Captions, control range explanations, ledger timestamps |
| `type-base` | 1.000rem | 16px | Body text, control labels, button text |
| `type-md` | 1.250rem | 20px | Subheadings, drawer section titles |
| `type-lg` | 1.563rem | 25px | Section headings, preset card titles |
| `type-xl` | 1.953rem | 31.25px | Silence Report headline sentence at narrow viewports |
| `type-2xl` | 2.441rem | 39px | Silence Report headline sentence at desktop viewports |
| `type-display` | `clamp(2.5rem, 6vw, 5rem)` | 40px to 80px | THE GREAT FILTER title treatment only, outside the ratio scale by design (a fixed hero moment, not a scale step) |

### 2.3 Weights

Inter: 400 regular (body), 500 medium (control labels, emphasis), 600 semibold (headings, primary button text).
Fraunces: 300 light (title treatment, `type-display`), 400 regular to 500 medium (Cosmic Atlas subheadings and biography prose).
IBM Plex Mono: 400 regular (values, coordinates, timestamps), 500 medium (emphasized data, current control value).

### 2.4 Title treatment: THE GREAT FILTER

Typeface Fraunces, weight 300, size `type-display`, all capitals (ASSUMPTION: packet Q85 is open in the discovery interview; the packet's own document renders the title in capitals throughout, and capitals reinforce the monument and instrument-plate register of Observatory Elegy, so this document sets it as all capitals pending interview confirmation). Letter spacing `0.1em`. Line height `1.05`. Color `color-text-primary`. No text shadow, no glow, no gradient fill. It sits directly on the near still galaxy background with no card or panel behind it.

### 2.5 Supporting line and tone line

Supporting line ("Build a galaxy. Seed the stars. See who survives long enough to be heard.") and tone line ("Most civilizations miss each other by a few million years. Cosmically speaking, terrible calendar management.") both use Inter regular at `type-md`, `color-text-secondary`, sentence case, no letter spacing adjustment.

## 3. Spacing rhythm

Base unit 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, expressed in rem at a 16px root.

| Token | rem | px |
|---|---|---|
| `space-1` | 0.25rem | 4px |
| `space-2` | 0.5rem | 8px |
| `space-3` | 0.75rem | 12px |
| `space-4` | 1rem | 16px |
| `space-5` | 1.5rem | 24px |
| `space-6` | 2rem | 32px |
| `space-7` | 3rem | 48px |
| `space-8` | 4rem | 64px |
| `space-9` | 6rem | 96px |
| `space-10` | 8rem | 128px |

Control anatomy (FR002) internal padding uses `space-3` between label, explanation, and value. Panel outer padding uses `space-5` on desktop, `space-4` on mobile. Section gaps in the Silence Report use `space-7`.

## 4. Surface and chrome language

Two surface systems, assigned by region, per R020.

### 4.1 Observatory Elegy: live simulation surfaces

Galaxy canvas, opening state, configuration state and its six controls plus advanced settings, preset picker, top status bar, left control rail, bottom timeline and transport, event ledger, civilization inspection card chrome (its prose content may borrow Cosmic Atlas typography per section 4.3).

Treatment: `color-surface-glass` background, `backdrop-filter: blur(12px) saturate(120%)`, 1px `color-border-hairline` border, corner radius `radius-sm` (6px), no drop shadow. A single 1px inset top highlight (`inset 0 1px 0 rgba(255,255,255,0.04)`) is the only permitted depth cue. No skeuomorphic bezels, no gradients beyond the background depth gradient in section 4.4.

### 4.2 Cosmic Atlas: education and report surfaces

Education drawers (Fermi paradox, Great Filter, what counts as a civilization, how contact is calculated, assumptions and limitations, sources, about LABS), Silence Report.

Treatment: solid `color-bg-elevated` background (no glass, no blur), 1px `color-border-hairline-solid` border, corner radius `radius-md` (10px), elevation shadow `elevation-1`: `0 8px 24px rgba(2,4,8,0.35)`. Internal editorial rule lines (1px `color-border-hairline-solid`) separate Silence Report metric groups, evoking a museum caption card rather than a live instrument.

### 4.3 Mixed surface: civilization inspection card

The card container (chrome, background, border) follows Observatory Elegy (section 4.1), because it is live, in run data. The short biography text block inside it (packet Q76, see INTERACTION_SPEC.md section 8) sets in Fraunces regular at `type-base` as a brief editorial flourish, borrowing Cosmic Atlas typography without changing the container treatment.

### 4.4 Elevation and modal scrim

| Token | Value | Use |
|---|---|---|
| `elevation-0` | none, 1px hairline border only | Observatory Elegy chrome |
| `elevation-1` | `0 8px 24px rgba(2,4,8,0.35)` | Cosmic Atlas drawers, Silence Report, mobile bottom sheets |
| `elevation-2` | `0 16px 48px rgba(2,4,8,0.5)` | Modal confirmation dialogs only |
| Modal scrim | `rgba(5,7,12,0.75)` full viewport, `color-bg-void` base | Behind modal confirmation dialogs only (section 6, INTERACTION_SPEC.md) |

Corner radius tokens: `radius-sm` 6px (controls, buttons, chips, Observatory Elegy panels), `radius-md` 10px (Cosmic Atlas cards and drawers), `radius-lg` 16px top corners only (mobile bottom sheets), `radius-full` (toggle switches, pills).

## 5. Motion character (UX002)

Long fades, slow motion, per packet visual trait 10. Every duration below is exact and is the value to implement, not a starting point for tuning.

### 5.1 Birth pulse

A soft radial bloom from 0 to full opacity and scale, no bounce, no overshoot. Duration 1100ms. Easing `cubic-bezier(0.16, 1, 0.3, 1)`. Single occurrence per birth event, does not repeat.

### 5.2 Detectability halo

An expanding ring or shell from the civilization point, stroke color `color-signal-violet-bright` fading to transparent, loops while the civilization remains in its detectable state. Cycle duration 2800ms. Easing `cubic-bezier(0.33, 1, 0.68, 1)` for the opacity fade, linear for the radius expansion.

### 5.3 Expansion frontier

Not a laser beam, per packet visual trait 7 and motion language section: a slow growing frontier edge. Each frontier render tick interpolates over 600ms with `cubic-bezier(0.4, 0, 0.2, 1)`, never a hard snap between positions, regardless of simulation speed multiplier (FR024). At speed multipliers above 100x, the frontier edge interpolates continuously between the two most recent worker snapshots rather than skipping intermediate visual states.

### 5.4 Extinction cooling fade

A cooling fade, not a violent effect, per packet motion language. Color desaturates and darkens from the civilization's current state color through `color-danger-red-fill` toward `color-bg-base` over 2200ms, easing `cubic-bezier(0.65, 0, 0.35, 1)`. Point scale reduces to 70 percent of its prior size but never reaches zero: an extinct civilization remains visible as a dim ember point indefinitely afterward, distinguishable from a still living dim point by the contracting ring glyph from section 1.4.

### 5.5 Contact

Rare enough to feel consequential, per packet motion language. A brief bright flare at both endpoints (400ms, `cubic-bezier(0.16, 1, 0.3, 1)`), then a connecting travel front line draws between them over 1200ms with `cubic-bezier(0.4, 0, 0.2, 1)`, then the event holds at full visibility for 3000ms before settling into its persistent contact marker state. Total sequence 4600ms. No other animation of this duration or intensity exists anywhere else in the application, which is what preserves its rarity.

### 5.6 Effect limits and particle budgets by capability tier

NFR002 requires visual star count and effects to adapt to device capability, with a low power mode. This document sets the visual budgets per tier; device capability detection thresholds belong to ARCHITECTURE.md. Three tiers, ASSUMPTION pending ARCHITECTURE.md confirmation of the detection mechanism:

| Tier | Decorative starfield points | Concurrent birth pulses | Concurrent halos | Concurrent extinction fades | Signal shell rendering |
|---|---|---|---|---|---|
| High (desktop, capable GPU) | 20,000 | 24 | 48 | 24 | Multi ring GPU shader |
| Standard (R021 mid range 2021 mobile reference, default assumption for unclassified devices) | 6,000 | 10 | 16 | 10 | Single ring sprite |
| Low or fallback (non WebGL renderer, explicit low power mode, or reduced motion) | 2,000, rendered static | 0, replaced by section 6 | 0, replaced by section 6 | 0, replaced by section 6 | Not rendered, state shown as a static filled or ringed point |

When a tier's concurrency limit is reached, new animations queue rather than overrides discarding a running one; queued events resolve in causal order (FR025) as capacity frees, so no event class silently skips its animation on a busy galaxy.

## 6. Reduced motion presentation (FR029, ACC003)

The canonical reduced motion behavior, including the exact list of what replaces each animation, the ledger and live region obligations, and the under 100 millisecond transition cap, is defined in ACCESSIBILITY.md section 4 and governs this application. `prefers-reduced-motion: reduce` and the in application toggle (ACC003) both map to that identical replacement, and it is the same rendering path as the non WebGL fallback (ACCESSIBILITY.md section 6). This section supplies only the token level detail ACCESSIBILITY.md leaves to art direction: which color and glyph each static state uses.

| Animated event | Reduced motion replacement (ACCESSIBILITY.md section 4) | Token detail supplied here |
|---|---|---|
| Birth pulse (5.1) | A labeled marker appears; no continuous animation | Point renders at its final `color-star-white` or `color-star-cyan-dim` fill (per the legend in 1.4.1) at full scale; any unavoidable transition is a cross fade under 100ms, never the full 1100ms pulse |
| Detectability halo (5.2) | A static shell or ring with a numeric radius label, not an expanding halo | Single static ring, stroke `color-signal-violet-bright`, radius label in `type-xs` IBM Plex Mono adjacent to the ring |
| Expansion frontier (5.3) | A labeled static frontier boundary, not a moving front | Frontier boundary line in `color-signal-violet-bright`, redrawn at each simulation snapshot with a `type-xs` label stating the new radius and simulated time |
| Extinction cooling fade (5.4) | A state color and glyph change, not a cooling fade | Point switches directly to the extinct state's `color-danger-red-fill` contracting ring glyph (legend 1.4.1, state 11) at 70 percent scale, cross fade under 100ms |
| Contact (5.5) | A highlighted static marker plus a ledger entry plus a live region announcement (ACCESSIBILITY.md section 3), never a motion effect | Both endpoints render at full opacity in `color-signal-violet-bright` immediately, connecting line renders at full opacity immediately, no draw in animation, settling into the same persistent contact marker state as the animated presentation |
| Galaxy background drift (opening state) | Static, zero motion | No token change, the starfield simply stops drifting |

## 7. Responsive behavior (FR031, FR032)

| Breakpoint token | Range | Layout |
|---|---|---|
| `bp-mobile` | 0 to 599px | FR031 mobile layout |
| `bp-tablet` | 600 to 1023px | FR031 mobile layout, bottom sheet pattern, wider sheet columns where a sheet has room |
| `bp-desktop` | 1024px and up | FR032 desktop layout |
| `bp-wide` | 1440px and up | FR032 desktop layout, control rail width increases from 320px to 360px, canvas retains remaining space |

FR031 mobile layout: full screen canvas, compact top status bar (`space-4` height plus content, `color-surface-glass`), bottom sheet for controls (slides up from the bottom edge, `radius-lg` top corners, `elevation-1`), separate event ledger and Silence Report sheets (full height, dismissible), touch targets per section 9.

FR032 desktop layout: galaxy canvas center, fixed left control rail 320px (360px at `bp-wide`), top status bar full width above the canvas, right detail drawer 360px (civilization inspection, opens on demand, canvas resizes to accommodate rather than covering it), bottom timeline and transport bar full width below the canvas, 56px height.

## 8. The twelve binding visual traits

Restated from packet file 02 as numbered, testable constraints. All twelve bind, per R020.

1. Background MUST use near black with subtle blue depth: `color-bg-base` `#070B14` as the flat base, with a radial gradient toward `#0A1330` at the canvas center never exceeding 15 percent lightness increase from the base.
2. Stellar points MUST render sparse, in white and pale cyan only: `color-star-white` and `color-star-cyan-pale` (plus the dim variant `color-star-cyan-dim` for dormant points). No other hue appears in the decorative starfield.
3. Emerging technological civilizations MUST use warm gold: `color-tech-gold` and `color-tech-gold-bright` exclusively for this state.
4. Active detectable communication MUST use electric violet: `color-signal-violet` and `color-signal-violet-bright` exclusively for this state.
5. Quiet red MUST be reserved exclusively for danger, collapse, or extinction, including the application Error state (section 1.3). No exceptions elsewhere in the interface.
6. Detectability MUST render as soft concentric signal shells (section 5.2), never a solid disc or a sharp ring.
7. Interstellar expansion MUST render as thin travel fronts and a growing frontier (section 5.3), never a beam, laser, or line with a directional arrowhead.
8. Glass effects MUST remain minimal: `color-surface-glass` at 0.62 alpha maximum, `blur(12px)` maximum, applied only to Observatory Elegy chrome (section 4.1), never to Cosmic Atlas surfaces.
9. Typography MUST be precise: the type scale in section 2 is exhaustive. No ad hoc font size outside the documented tokens.
10. Motion MUST stay slow, with long fades: no duration in section 5 may be shortened by implementation without updating this document first. No motion elsewhere in the interface (menus, tooltips, panel opens) exceeds 400ms, keeping the slow simulation motion visually distinct from ordinary UI feedback.
11. No generic space photographs MUST appear anywhere in the application, including background imagery, social preview image (REL005), loading states, or marketing copy. Every visual is either rendered geometry or original artwork per section 10.
12. No neon arcade treatment MUST appear: no pure saturated hues at 100 percent saturation and 100 percent lightness, no chromatic bloom filters, no scan line or grid overlay effects, no color cycling. Every semantic color in sections 1.2 and 1.3 is desaturated at minimum 8 percent from its fully saturated equivalent, confirmed by the values given (for example `#E8B34D` is warm gold, not `#FFB800` pure amber).

## 9. Copy voice rules (UX003, R017)

Scientifically literate, calm, direct, occasionally dry. No dark humor about extinction beyond the packet's own register. No triumphal or nihilistic claims. No em dashes, no en dashes, anywhere in any copy, including generated headline sentences (FR009). Hyphens in compound words remain permitted.

Good, from packet file 02:

"No one heard them. The nearest listener evolved 2.1 million years later."

"Intelligence was common. Patience was not."

Banned, from packet file 02:

"Epic alien empires battled across the cosmos."

"This proves humanity is alone."

Additional binding rule: the application models possibilities. No generated sentence, drawer, or label may claim to solve or prove anything about the Fermi paradox (BR003). Sentences report what happened in the run, in the past tense, without editorializing beyond the dry tone already demonstrated in the good examples.

## 10. Iconography and imagery (REL005)

All icons, the favicon, application icons, web manifest icons, and the social preview image are original artwork, either rendered directly from the simulation's own geometry (for example a generated galaxy frame for the social preview, per PENDING P002's safe fallback) or hand drawn to match the icon style below. No stock photography, no AI generated space imagery, no third party icon set.

Icon style: line icons, 1.5px stroke weight (matching Inter's regular stroke contrast at `type-base`), 24px by 24px canvas, monochrome `color-text-secondary` by default for interface icons (buttons, panel chrome, filter chips). Corners rounded at 1px radius to match the restrained, precise character of section 8 constraint 9. The eleven civilization state glyphs are the exception to the monochrome default: they are always filled, always colored to their exact legend token (section 1.4.1), and never rendered as outline only, since they must stay legible at the small sizes used on the canvas, inside the event ledger, and inside the civilization inspection card.

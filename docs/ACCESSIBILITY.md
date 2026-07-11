# ACCESSIBILITY

Accessibility specification for The Great Filter (filter.nixfred.com). This document folds the manifest `accessibility.md` duties (ruling R001): keyboard map, focus behavior, screen reader model, live region policy, reduced motion behavior, contrast targets, and fallback presentation.

Requirements implemented: ACC001 (keyboard operation), ACC002 (nonvisual status), ACC003 (reduced motion respect), ACC004 (contrast and color safety), ACC005 (automated and manual checks), ACC006 (focus management), FR029 (reduced motion mode), UX003 (copy voice, applied to accessible names and announcements). Related: FR024 (speed steps up to 1000x, which drive the announcement rate policy), FR028 and FR030 and NFR002 (fallback renderer), UX005 and R020 (palette), R021 (device floor). The screen reader reference matrix is fixed by ruling R024.

Accessibility is a release requirement, not a cleanup task (packet 01 architecture rule 8). Every gate reference here is a BLOCK or a documented MANUAL gate, never optional.

This document is the canonical source for the keyboard map and the contrast targets. docs/INTERACTION_SPEC.md defers to this file. If INTERACTION_SPEC.md and this file ever disagree on a key binding, a focus rule, or a contrast number, this file wins and INTERACTION_SPEC.md is corrected.

No banned word appears here without a measurable definition. Contrast is stated as numeric ratios, timing as milliseconds or seconds.

---

## 1. Keyboard map (ACC001, ACC006)

Every visitor capability in the packet file 02 simulation state is reachable by keyboard. The twelve simulation state capabilities are start, pause, resume, change speed, reset, replay the same seed, randomize the seed, zoom and pan, select a civilization, open the event ledger, hide or show labels, and share the scenario. Configuration, onboarding, presets, the Silence Report, education drawers, and clear local data are also fully keyboard operable.

### 1.1 Scope rules

1. Global shortcuts fire only when focus is not inside a text input, textarea, or contenteditable element, and no modal text field is capturing input. This prevents a letter shortcut from firing while the visitor types.
2. Canvas scoped shortcuts fire only when the galaxy viewport has focus.
3. Standard controls (buttons, sliders, tabs, dialogs) always follow native semantics: Tab and Shift+Tab move focus, Enter and Space activate, Escape closes the topmost overlay and returns focus to its opener.
4. A skip link to the main region is the first focusable element.
5. Press the question mark key to open a keyboard shortcuts help sheet that lists this map.

### 1.2 Global run controls (app focused, not in a text field)

| Capability | Key | Requirement |
|---|---|---|
| Start, pause, resume (single toggle across the three) | Space | FR004 |
| Reset run | R | FR004 |
| Replay the same seed | Shift+R | FR004 |
| Randomize the seed | N | FR004 |
| Decrease speed one step | Left square bracket | FR024 |
| Increase speed one step | Right square bracket | FR024 |
| Open or close the event ledger | E | FR006 |
| Open or close the share dialog | S | FR008 |
| Hide or show labels | L | FR007 |
| Open or close presets | P | FR010 |
| Open keyboard help | Question mark | ACC001 |
| Close topmost overlay or cancel | Escape | ACC006 |

The speed control widget is also directly focusable: Tab to it, then Arrow keys move through the six steps (pause, normal, 10x, 100x, 1000x, maximum), so speed does not depend on the bracket shortcuts alone.

### 1.3 Canvas scoped controls (galaxy viewport focused)

| Capability | Key | Requirement |
|---|---|---|
| Move the civilization selection cursor to the nearest civilization in a direction | Arrow keys | FR005 |
| Select and inspect the highlighted civilization | Enter | FR005 |
| Pan the camera | Shift plus Arrow keys | FR005 |
| Zoom in | Plus or equals | FR005 |
| Zoom out | Minus | FR005 |
| Reset camera framing | Home | FR005 |

Arrow keys move a roving selection among simulated civilizations rather than moving the camera, so a keyboard visitor can reach every selectable civilization without a pointer. Space is never rebound inside the canvas, so it always means play or pause and never accidentally scrolls or selects.

### 1.4 Configuration controls

Each of the six main controls (ruling R008) is a labeled slider or equivalent. Slider semantics: Arrow keys step by the control step, Home and End jump to minimum and maximum, Page Up and Page Down move by a large step. Each control's mathematical detail toggle (FR002) is a button reachable by Tab and activated with Enter or Space. Advanced settings (FR003) are a collapsed region reached by Tab and expanded with Enter or Space.

### 1.5 Capability to key coverage check

All twelve packet file 02 simulation state capabilities: start, pause, resume are Space; change speed is the brackets and the speed widget arrows; reset is R; replay same seed is Shift+R; randomize seed is N; zoom and pan are Plus, Minus, and Shift+Arrows; select a civilization is Arrow then Enter; open event ledger is E; hide or show labels is L; share is S. Inspect is Enter after selection and is also reachable from the ledger. No capability requires a pointer.

---

## 2. Focus behavior (ACC006)

1. Visible focus: every focusable element shows a focus indicator with a contrast ratio of at least 3:1 against its adjacent colors (WCAG 2.1 success criterion 2.4.11 and 1.4.11). The indicator uses :focus-visible and is never removed by a blanket outline reset. The indicator is a shape and brightness change, not hue alone, so it is visible under color vision deficiency.
2. Focus order: DOM order matches visual order in every layout (desktop left rail, top status, center canvas, right drawer, bottom timeline, and the mobile sheets), so tabbing follows the reading order.
3. No traps: there is no focus trap anywhere except the intentional and correct containment inside an open modal dialog. That containment is not a forbidden trap because Escape closes the dialog and returns focus to the element that opened it (WCAG 2.1.2). Non modal drawers never trap focus.
4. Drawer semantics (event ledger, civilization inspector, right detail drawer): these are non modal. The page behind stays operable. Opening a drawer moves focus to the drawer heading, Escape closes it and returns focus to the opener, and focus is allowed to leave the drawer by tabbing.
5. Dialog and sheet semantics (onboarding, share dialog, clear local data confirmation, keyboard help): these are modal. They use role="dialog" with aria-modal="true", an accessible name via aria-labelledby, focus moves to the first control on open, focus is contained while open, Escape closes and returns focus. On mobile, bottom sheets that block interaction are modal dialogs with the same rules, and passive sheets are non modal drawers.
6. Selection focus in the canvas uses a roving tabindex so the viewport is a single tab stop and Arrow keys move an internal selection, matching a grid or listbox pattern.

---

## 3. Screen reader model (ACC002)

### 3.1 Landmarks

The page uses one of each meaningful landmark: a banner (site header with title and version), a navigation region for primary actions, a main region that contains the galaxy simulation region, complementary regions for the event ledger and the civilization inspector, and a contentinfo footer (the NixFred footer of ruling R016). The galaxy viewport itself is a labeled region named Galaxy simulation. Every landmark has an accessible name when more than one of a type could exist.

### 3.2 Names

Every control has a programmatic name that matches its visible label. The six main controls, the run controls, the speed control, the preset list, and the education drawers all expose names in the calm, direct voice of UX003. Icon only controls carry an aria-label. The canvas exposes a text alternative describing the current state (see the live region below) so a nonvisual visitor is never told only that a canvas is present.

### 3.3 Live region policy for simulation status (ACC002)

A single visually available status region with role="status", aria-live="polite", and aria-atomic="true" carries transient simulation status. It is overwritten, not appended, so a screen reader reads only the latest message. A separate role="log" region backs the event ledger and is announced only while the ledger is open and the visitor has opted into verbose events.

Two message classes:

1. Immediate announcements, fired on a visitor action: run started, paused, resumed, speed set to a named step, reset, replay from the same seed, seed randomized, labels shown or hidden, scenario link copied, and civilization selected with its name and current state. These are direct results of a keystroke, so they fire at once.
2. Simulation progress announcements, fired on a fixed real time cadence that is independent of the simulation speed. Content is the elapsed simulated time plus key aggregate deltas, for example a message reporting three point two billion simulated years with the current detectable and disappeared counts.

Maximum announcement rate: the progress cadence is one announcement every 10 seconds of real time, and the hard cap across all classes is at most one announcement every 5 seconds of real time. This cap is wall clock based, not simulation clock based.

### 3.4 Announcement density scales down as speed rises, and flooding prevention (ACC002, FR024)

The simulation speed steps run from normal through 10x, 100x, and 1000x to maximum (FR024). Because the announcement rate is fixed in real time (section 3.3) while simulated time advances faster at higher speed steps, the announcement density measured per simulated year falls as speed rises. At normal speed one progress announcement covers a small span of simulated time. At 1000x the same one announcement per cadence tick covers roughly one thousand times more simulated time. The screen reader therefore hears the same steady real time rate at every speed, and higher speeds produce fewer announcements per unit of simulated history, not more. This is the mechanism that keeps output from flooding at the top speed steps.

At 1000x and maximum speed the simulation can produce thousands of internal events per real second. Individual events are never announced. Flooding is prevented by four rules enforced in the live region throttle helper:

1. Rate cap: at most one progress announcement per the section 3.3 cadence, and never more than one announcement every 5 seconds of real time, regardless of simulation speed. 1000x produces the same real time announcement rate as normal speed.
2. Coalescing: if many events fall inside one cadence window, the message reports counts and the most significant change, never an enumeration.
3. Single region overwrite: the polite region holds only the latest message, so a backlog cannot accumulate in the screen reader queue.
4. Priority handling for rare consequential events: first contact and the run complete headline are queued to the same polite region and fire at the next cadence tick, or immediately if no announcement fired in the last 5 seconds. The assertive politeness level is reserved for genuine errors, so status never interrupts the visitor.

A verbosity preference lets the visitor choose quiet (state changes and terminal events only), normal (the default cadence above), or verbose (opens the event log region). The preference persists in localStorage.

How this is tested: the throttle helper is unit tested in docs/TEST_PLAN.md at tests/unit/utils/accessibility.test.ts (ACC002, FR024), which drives the helper at simulated normal, 100x, and 1000x speed and asserts the emitted announcement rate never exceeds one per 5 seconds of real time and that bursts are coalesced. The lived screen reader experience at 1000x is confirmed by the manual protocol in section 7.2, step 4.

---

## 4. Reduced motion behavior (FR029, ACC003)

prefers-reduced-motion is honored, and an in application toggle exists that overrides the system setting in either direction (ACC003). When reduced motion is active the presentation changes as follows, and this is the exact replacement, not a dimming of the same animation:

1. The drifting or rotating galaxy stops. The view is static and updates in discrete steps.
2. Continuous animations are replaced by discrete state changes: birth is a labeled marker appearing, detectability is a static shell or ring with a numeric radius label rather than an expanding halo, interstellar expansion is a labeled static frontier boundary rather than a moving front, and extinction is a state color and glyph change rather than a cooling fade.
3. Every state change is recorded in the event ledger as a time stamped summary line, so the run is legible as text (this doubles as screen reader content).
4. No parallax, no tilt, no auto rotation, and no motion based transition runs. Any unavoidable transition is a single cross fade under 100 milliseconds or is removed entirely.
5. Contact is shown as a highlighted static marker plus a ledger entry plus a live region announcement, never as a motion effect.
6. The run still advances and still ends at a Silence Report. Reduced motion removes motion, not capability.

The reduced motion presentation and the non WebGL fallback presentation (section 6) are the same rendering path, so a visitor who needs reduced motion and a visitor whose device cannot run WebGL both receive a coherent, labeled, static, text backed view.

---

## 5. Contrast and color safety (ACC004)

### 5.1 Numeric contrast targets (WCAG 2.1 AA)

| Element | Minimum contrast ratio |
|---|---|
| Normal text (under 18.66 pixels bold, or under 24 pixels) | 4.5:1 |
| Large text (at least 18.66 pixels bold, or at least 24 pixels) | 3:1 |
| Interface component boundaries and states (borders, control edges) | 3:1 |
| Meaningful graphical objects (a civilization marker against the background, a signal ring) | 3:1 |
| Focus indicator against adjacent colors | 3:1 |

These are the WCAG 2.1 AA minimums (success criteria 1.4.3, 1.4.11, 2.4.11). AA, not AAA, is the target. Text over the near black background of the palette (ruling R020, UX005) meets 4.5:1 by using white and pale cyan foreground values whose measured ratio is confirmed in the manual protocol, not assumed.

### 5.2 Color vision safety strategy (ACC004, R020)

The palette encodes meaning with color: warm gold for technological civilizations, electric violet for active detectable communication, quiet red for danger and extinction, white and pale cyan for stars. Gold, violet, and red are not reliably separable under protanopia, deuteranopia, and tritanopia, so color is never the only channel:

1. Every civilization state is encoded by a distinct glyph shape in addition to color, so state is readable without hue discrimination.
2. Every state also carries a text label when labels are shown, and the labels toggle (FR007) only hides labels for a pure visual mode that a color reliant visitor can leave on.
3. The Cosmic Atlas education and report treatment (ruling R020) states outcomes in words, so the memorable result of a run is a sentence (BR004), which carries no color dependency.
4. States differ in brightness as well as hue, so a grayscale rendering still separates them.
5. A legend maps each glyph and color to its state name.

Color vision safety is verified by the manual protocol in section 7.3 using a color vision deficiency simulation on captured frames, because axe cannot inspect colors rendered on a WebGL canvas (section 7.1).

---

## 6. Fallback presentation (FR028, FR030, NFR002, R021)

The non WebGL fallback renderer runs when WebGL is unavailable, when the device is low power, or when reduced motion selects it. It must never show a blank page (ruling R021). It conveys the same information the WebGL view conveys, using DOM, SVG, or Canvas 2D without shaders or continuous animation. It must convey:

1. Civilization identity and position: each simulated civilization is a labeled marker placed at its galaxy position, colored and glyphed by state (section 5.2).
2. Current state per civilization: candidate system through interstellar and the terminal states quiet, transformed, or extinct (FR016), shown by glyph and label.
3. Detectable status and signal reach: a static ring with a numeric radius label rather than an animated shell.
4. Interstellar expansion: a labeled static frontier boundary rather than a moving front.
5. Current simulated time and the global aggregate counts, in the status bar.
6. Events: the full event ledger, time stamped (FR006).
7. Outcome: the full Silence Report with the fifteen metrics and the headline sentence (FR009).
8. Selection and inspection: reachable by the same keyboard map (section 1) and exposed to screen readers (section 3), so a civilization can be selected and inspected in the fallback exactly as in the WebGL view.

The fallback updates on a discrete tick, matching the reduced motion presentation of section 4. It is a first class presentation, not a degraded placeholder.

---

## 7. Automated and manual checks (ACC005)

### 7.1 Automated checks in CI (accessibility_tests job)

The accessibility_tests CI job runs `npm run test:a11y`, which runs tests/accessibility/core_flows.spec.ts under Playwright with @axe-core/playwright. axe runs against the core flow states: onboarding, configuration, a running simulation, the Silence Report, each drawer and dialog in its open state, the mobile viewport, and the reduced motion state. The suite asserts zero violations at the WCAG 2.1 A and AA rule tags (wcag2a, wcag2aa, wcag21a, wcag21aa) and asserts landmark presence, that each dialog and drawer has an accessible name and the correct role, and that aria-modal is set on modal dialogs.

What axe covers: missing or mismatched names and roles, invalid ARIA usage, DOM text contrast, form control labels, landmark structure, duplicate ids, and heading structure. What axe cannot cover on this application: contrast of anything drawn on the WebGL or Canvas 2D surface (axe reads DOM, not rendered pixels), whether a screen reader announcement is meaningful and correctly timed, whether the reduced motion presentation is visually correct, and whether the color vision strategy actually separates states. Those go to the manual protocols below.

### 7.2 Manual protocol: screen reader walkthrough (ACC002, ACC005)

Reference screen reader and browser set, fixed by ruling R024: VoiceOver with Safari on macOS or iOS, and NVDA with Firefox on Windows.

Steps:
1. With the screen reader active, load the site. Confirm the skip link, the banner, and the main landmark are announced.
2. Tab through the six controls and confirm each name and value is announced in the UX003 voice.
3. Start a run with the keyboard. Confirm the status region announces run started.
4. Change speed to 1000x. Confirm progress announcements arrive on the section 3.3 cadence and never faster than once every 5 seconds, proving the flooding cap and the density scaling of section 3.4.
5. Select a civilization with the keyboard. Confirm its name and state are announced.
6. Let the run finish. Confirm the run complete headline is announced and the Silence Report is reachable and readable.
7. Trigger an error path (a malformed share URL). Confirm the error is announced and a recovery path is reachable.

Expected result: every step is perceivable and operable by the screen reader with no orphaned control, no unlabeled element, and no announcement flood at 1000x.

Reviewer: quality, confirmed with Fred at G5. Date: recorded at execution. Evidence: a written walkthrough record and a short screen and audio capture, stored under docs/evidence/ named docs/evidence/G5_ACC002_screen-reader_<shortcommit>.md with the capture alongside.

### 7.3 Manual protocol: color contrast and color vision safety (ACC004, ACC005)

Steps:
1. Capture representative frames of the WebGL view (default run, a detectable civilization, an extinction, a contact) and the report.
2. Measure text and interface contrast against section 5.1 targets with a contrast tool on the DOM values and on the captured frames for canvas drawn text.
3. Run the captured frames through a color vision deficiency simulation for protanopia, deuteranopia, and tritanopia.
4. Confirm every civilization state remains distinguishable by glyph, brightness, and label under each simulation, per section 5.2.

Expected result: all contrast ratios meet or exceed section 5.1, and every state is separable under each color vision deficiency simulation without relying on hue.

Reviewer: designer and quality, at G5. Date: recorded at execution. Evidence: annotated frames and the contrast measurements under docs/evidence/ named docs/evidence/G5_ACC004_color-safety_<shortcommit>.md.

### 7.4 Manual protocol: keyboard and focus review (ACC001, ACC006)

The automated tests/e2e/keyboard.spec.ts confirms the core path completes by keyboard. This manual review confirms the parts a script judges poorly: that the focus indicator is genuinely visible at every step, that focus order reads naturally, and that no trap exists in any drawer or dialog.

Steps:
1. Unplug or ignore the pointer. Complete the full journey: skip onboarding, configure, run, pause, change speed, select and inspect a civilization, open the ledger, open the report, share, and clear local data.
2. At each stop confirm a visible focus indicator meeting section 5.1.
3. Open and close every drawer and dialog with Escape and confirm focus returns to the opener.

Expected result: the whole application is operable and legible by keyboard with visible focus and no trap.

Reviewer: quality, at G5. Date: recorded at execution. Evidence: a written checklist and screenshots of focus states under docs/evidence/ named docs/evidence/G5_ACC006_keyboard-focus_<shortcommit>.md.

### 7.5 Manual protocol: reduced motion and fallback visual correctness (FR029, FR030, NFR002)

Steps:
1. Enable reduced motion (system setting, then the in application toggle) and confirm the section 4 replacement presentation: no drift, discrete state changes, static rings and frontiers with numeric labels, and a time stamped ledger.
2. Force WebGL unavailable and confirm the section 6 fallback conveys all eight listed items and never shows a blank page.

Expected result: both presentations are complete and legible, and a run completes to a report in each.

Reviewer: designer and quality, at G5. Date: recorded at execution. Evidence: ordered frames or a short capture (the BUILD.md evidence standard for motion claims) under docs/evidence/ named docs/evidence/G5_FR029_reduced-motion_<shortcommit>.md.

---

## 8. Requirement coverage summary

Primary: ACC001, ACC002, ACC003, ACC004, ACC005, ACC006, FR029, UX003.

Also implemented or constrained here: FR005 (keyboard selection and inspection), FR006 (ledger keyboard and log region), FR007 (labels toggle and color safety), FR024 (speed steps drive the announcement rate and density policy), FR028 and FR030 and NFR002 (fallback presentation), UX005 and R020 (palette and color safety), R021 (never a blank page), R024 (screen reader reference matrix), DATA002 (verbosity preference in localStorage).

Not owned by this document: the full test tooling and CI wiring (docs/TEST_PLAN.md), the visual design values and typography (docs/ART_DIRECTION.md), the interaction choreography beyond the keyboard map (docs/INTERACTION_SPEC.md, which defers to this file on the keyboard map and contrast targets), and the operational manual gates (docs/OPERATIONS.md).

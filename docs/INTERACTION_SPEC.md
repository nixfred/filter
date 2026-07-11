# INTERACTION SPEC

Interaction and state specification for The Great Filter (filter.nixfred.com). Implements FR001 to FR014, FR024, FR029 to FR032, UX004, UX007, ACC001, ACC006. Visual tokens referenced below (`color-*`, `space-*`, `elevation-*`, `radius-*`, `type-*`) are defined in ART_DIRECTION.md. Where this document settles an interaction detail not fixed in DECISIONS.md, it is marked ASSUMPTION and repeated in the final report. No em dashes, no en dashes, anywhere in this document or in any copy it specifies.

ACCESSIBILITY.md is the canonical source for the keyboard map, focus mechanics, live region announcements, and numeric contrast targets. Where this document names a key, a focus behavior, or a contrast number, it defers to ACCESSIBILITY.md sections 1, 2, 3, and 5 respectively. If the two documents ever disagree, ACCESSIBILITY.md wins and this document is corrected.

## 1. State by state specification

The application has four states: opening, configuration, simulation, outcome. UX007 binds throughout: the galaxy canvas remains the visually dominant element in every layout at every state.

### 1.1 Opening state (UX004)

Exact elements, top to bottom on desktop, in visual stacking order:

1. Full bleed galaxy canvas, decorative starfield only (no representative population running yet), drifting at an imperceptible rate. ASSUMPTION (packet Q95 open): drift, not rotation, not pointer response, and not fixed. Drift is a slow pan of the starfield at a rate that produces less than 2 degrees of apparent movement per minute, never enough to be consciously noticed without staring, consistent with "an almost imperceptible rate" from packet file 02, and honoring section 5 motion character (slow, long).
2. Title: THE GREAT FILTER, per ART_DIRECTION.md section 2.4, vertically centered in the upper two thirds of the viewport, no card or panel behind it.
3. Supporting line directly beneath the title: "Build a galaxy. Seed the stars. See who survives long enough to be heard." (ART_DIRECTION.md section 2.5).
4. Primary action button: CREATE A GALAXY. Tech gold fill, `type-base` semibold, `radius-sm`, minimum height 48px, horizontal padding `space-6`.
5. Secondary action button: RUN A PRESET. Outline style per ART_DIRECTION.md section 4, positioned directly below or beside the primary action depending on viewport width (stacked below on `bp-mobile` and `bp-tablet`, side by side on `bp-desktop` and wider).
6. Tone line, smaller and lower on the page, `type-sm`, `color-text-tertiary` is too low contrast for this role so it uses `color-text-secondary`: "Most civilizations miss each other by a few million years. Cosmically speaking, terrible calendar management."
7. Footer (persistent across all states, not opening state exclusive): NixFred credit, link to nixfred.com, link to the public repository, visible version identifier, per R016 and REL007.

Actions available: CREATE A GALAXY transitions to the configuration state with all six controls at their documented defaults (defaults are a simulation_model.md concern, out of this document's authority). RUN A PRESET opens the preset picker (section 1.1.1). No other interactive element exists in the opening state besides the footer links and the persistent accessibility affordances in ACCESSIBILITY.md section 1.1 (skip link, keyboard shortcuts overlay trigger).

Initial keyboard focus on load lands on a skip link ("Skip to galaxy controls," visually hidden until focused), which precedes the title in tab order. The next tab stop is the CREATE A GALAXY button.

### 1.1.1 Preset picker (FR010)

Opened from RUN A PRESET as a Cosmic Atlas surface (drawer on desktop from the right edge, full sheet on mobile). Lists the eight packet presets (The Silent Galaxy, Crowded Briefly, Loud but Lonely, Rare Earth, Fragile Intelligence, Patient Stars, Expansion Wins, Optimist's Milky Way) as cards: name at `type-md` Fraunces medium, one line description at `type-sm` Inter regular, `color-text-secondary`. Selecting a card, by click, tap, or Enter or Space while focused, pre fills all six controls (and any advanced settings the preset specifies) with that preset's values and transitions to the configuration state with those values already set and a small inline label reading "Preset: [name]" above the control rail. This satisfies FR010's "selectable before or instead of manual configuration": the visitor can press Start immediately (instead of manual configuration) or adjust any control first (before manual configuration continues from the preset baseline). ASSUMPTION: presets always land in configuration state, never skip directly to simulation state, so there is exactly one entry point into a run (section 1.3), keeping the Start action singular and easy to specify for keyboard and screen reader users.

### 1.2 Configuration state (six controls, R008, FR002, FR003)

Basic panel exposes exactly six controls, in this fixed order: life emergence, intelligence emergence, technological transition, long term survival, detectable communication, interstellar expansion. Self destruction is expressed inside the survival control per R008, not as a separate basic control.

#### 1.2.1 Control anatomy (FR002)

Every control is a single component with six parts, in this exact vertical order, spacing `space-3` between parts:

1. Plain language label. `type-base` Inter medium, `color-text-primary`. Example role: "Life emergence."
2. One sentence explanation. `type-sm` Inter regular, `color-text-secondary`, directly beneath the label, maximum one line wrapped to two on `bp-mobile`.
3. Current value. `type-base` IBM Plex Mono medium, `color-tech-gold`, right aligned against the label on the same row on `bp-desktop`, on its own row on `bp-mobile`. Displays a plain language rung (see 1.2.2) followed by the precise value in parentheses, for example "Uncommon (about 1 in 40 million candidate worlds)."
4. The slider itself (1.2.2).
5. Range explanation. `type-xs` Inter regular, `color-text-tertiary`, positioned as two labels at the slider track ends: leftmost rung name and rightmost rung name (for example "Vanishingly rare" and "Nearly universal"), not raw numbers.
6. Visible effect summary. `type-sm` Inter regular, `color-text-secondary`, one line, updates live as the slider moves, describing the control's qualitative effect on the run (for example "Fewer candidate worlds will ever reach life"). A collapsed disclosure triangle at the end of this line, labeled "Mathematical detail," expands an inline block showing the underlying probability or rate range and distribution family for this control (ASSUMPTION, satisfies FR002's "mathematical detail control" and packet Q111; the exact numeric mapping itself is authored in simulation_model.md, out of this document's authority, this document only specifies that the control exposes it on demand). The disclosure is collapsed by default for every control, independent of the FR003 advanced settings collapse state.

#### 1.2.2 Slider behavior (packet Q59)

All six basic sliders and any advanced probability or rate sliders are logarithmic: the visual thumb position is linear across the track, but the underlying value it represents spans multiple orders of magnitude, mapped through labeled rungs rather than exposing the exponent directly. Each slider has 5 named rungs evenly spaced across the track: "Vanishingly rare," "Rare," "Uncommon," "Common," "Nearly universal" for probability style controls, or an equivalent 5 rung duration language ("Extremely slow" through "Extremely rapid") for rate or duration style controls. The thumb snaps to 21 discrete stops across the track (5 rungs plus 4 intermediate stops between each pair) so keyboard arrow steps are predictable: Left or Right arrow moves one stop, Page Up or Page Down moves one full rung (5 stops), Home and End jump to the track ends. Track height 4px, thumb 20px diameter, thumb `color-tech-gold` fill with a 2px `color-bg-base` ring, filled track portion `color-tech-gold` at 40 percent opacity, unfilled portion `color-border-hairline`.

#### 1.2.3 Advanced settings (FR003)

A single disclosure below the six basic controls, collapsed by default, labeled "Advanced settings." Expanding it reveals any hazard category splits and additional parameters that simulation_model.md defines as advanced scope (out of this document's authority to enumerate). The disclosure state does not persist in localStorage across sessions (it resets to collapsed on every fresh visit) but does persist for the duration of a single session's back and forth between configuration and simulation states.

#### 1.2.4 Start action

A persistent Start button, tech gold fill, fixed at the bottom of the control rail on desktop and the bottom of the control sheet on mobile, `type-base` semibold, minimum height 48px. Pressing it transitions to the simulation state and begins playback at 1x speed immediately (ASSUMPTION: Start both confirms configuration and begins playback in one action, rather than landing paused, since packet file 02's opening tone line and emotional arc, curiosity through control into abundance, reads as wanting immediate motion; a visitor who wants to inspect before playback can press Pause, section 1.3, within the same interaction).

### 1.3 Simulation state (twelve visitor capabilities)

All twelve capabilities from packet file 02's simulation state section are available. Placement and exact behavior:

1. Start: see 1.2.4. Only available from configuration state, not shown again once a run is active.
2. Pause: transport bar button, pauses the Web Worker's playback advancement without discarding state. Icon toggles to Resume.
3. Resume: same button as Pause, toggled. Resumes from the exact paused simulation time.
4. Change speed: segmented control in the transport bar with 6 positions, section 2.
5. Reset: transport bar button, returns to the configuration state with the current run's parameters still populated (so the visitor can see and adjust what produced the run just ended), discarding all simulation progress. Requires no confirmation, since it is reachable at any time and configuration values are not lost.
6. Replay the same seed: transport bar button, re runs the simulation from year zero using the identical seed and parameters, remaining in simulation state (does not return to configuration). Per R010, this is the only supported way to see the run again, since arbitrary rewind does not exist in v1.
7. Randomize the seed: transport bar button, generates a new seed, keeps the current parameters, re runs from year zero, remaining in simulation state.
8. Zoom and pan: direct canvas manipulation, section 3.
9. Select a civilization: direct canvas manipulation or keyboard roving selection, section 8.3.
10. Open the event ledger: toggle button in the status bar or transport bar, opens the ledger drawer or sheet, section 8.2.
11. Hide or show labels: toggle button, section 8.1.
12. Share the scenario: button in the status bar, opens the share panel, section 9.

Reset, Replay, and Randomize seed are visually grouped together and distinct from Pause, Resume, and the speed control, since the first group ends or restarts the current run and the second group only affects playback of the current run.

### 1.4 Outcome state: Silence Report (FR009)

Triggered at the selected end time or when the visitor stops the run. Cosmic Atlas surface (ART_DIRECTION.md section 4.2), full drawer on desktop (right side, 480px wide, `elevation-1`), full sheet on mobile.

Layout, top to bottom:

1. Headline sentence. The single most memorable output of the run, per BR004. `type-2xl` on `bp-desktop` and `bp-wide`, `type-xl` on `bp-mobile` and `bp-tablet`, Fraunces regular, `color-text-primary`, full width, positioned first, above every metric, with `space-6` of breathing room above and below it before any other content begins. Examples from packet file 02: "Twelve thousand civilizations spoke. None were close enough to hear another reply." The headline is generated from the run's own metrics, never a static line, and follows the copy voice rules in ART_DIRECTION.md section 9.
2. Fifteen metrics, grouped into three labeled sections with `color-border-hairline-solid` rule dividers between groups, each metric as a label and value pair, label `type-sm` `color-text-secondary`, value `type-md` IBM Plex Mono medium `color-text-primary`:
   - Population funnel: candidate worlds, independent origins of life, intelligent species, technological civilizations, civilizations that became detectable, civilizations that disappeared.
   - Overlap and contact: civilizations active at the same time, signal overlaps, travel overlaps, confirmed contacts.
   - Records: closest near miss in space, closest near miss in time, longest lived civilization, median technological lifetime, most restrictive transition.
3. Actions row: Replay (same seed, same as 1.3 item 6), New Galaxy (returns to configuration state with fresh defaults, distinct from Reset which preserves the just run parameters), Share (opens the share panel, section 9), Close (returns focus to the canvas, the report remains reachable again via a persistent "View report" affordance in the status bar until a new run starts).

## 2. Speed steps (FR024) and replay semantics (R010)

Six fixed positions in a single segmented control, left to right: Pause, 1x, 10x, 100x, 1000x, Max. Max is the fastest rate the Web Worker can sustain while still emitting renderable snapshots, distinct from and always faster than the 1000x position; its exact numeric rate is a performance characteristic of the running device and is not a fixed number in this document. Switching speed takes effect on the next worker tick, with no confirmation and no interruption to the running simulation, since speed is not part of the confirmable parameter set in section 6.

Replay semantics, restated precisely from R010: two actions exist, Replay (same seed) and Randomize seed (new seed), both described in section 1.3 items 6 and 7. Neither supports scrubbing to an arbitrary point in the run's history. There is no timeline scrubber in v1. The bottom timeline (FR032) displays elapsed simulated time and the current run's progress toward its end time as a read only progress indicator, not an interactive scrub control.

## 3. Canvas interactions (FR005)

Zoom: mouse wheel or trackpad pinch on desktop, pinch gesture on touch, plus the plus/equals and minus keys when the canvas has focus, and explicit `+` and `-` buttons in the canvas corner for pointer users who prefer a persistent control, satisfying ACC001. Zoom range 0.5x to 8x relative to the initial fit to viewport framing, Home resets framing (ACCESSIBILITY.md section 1.3). Pan: click and drag on desktop, single finger drag on touch, plus Shift plus arrow key panning when the canvas has focus (ACCESSIBILITY.md section 1.3, arrow keys alone move the civilization selection cursor rather than panning). Select: click or tap on a civilization point, or Enter while a civilization is focused via roving tabindex (section 8.3).

## 4. Complete keyboard map (ACC001)

Every action in this document is reachable by keyboard. The full key assignments, their scope rules, and the capability to key coverage check for all twelve packet file 02 simulation state capabilities are defined in ACCESSIBILITY.md section 1 and are not restated here, to keep a single source of truth. In summary, and using ACCESSIBILITY.md's exact bindings: Space starts, pauses, and resumes; R resets the run; Shift+R replays the same seed; N randomizes the seed; the left and right square brackets step speed down and up, with the speed widget itself also directly focusable and arrow steppable; E opens or closes the event ledger; S opens or closes the share dialog; L toggles labels; P opens or closes presets; the question mark key opens keyboard help; Escape closes the topmost overlay. Inside the galaxy viewport, arrow keys move a roving civilization selection cursor, Enter selects and inspects the highlighted civilization, Shift plus arrow keys pans the camera, plus or equals zooms in, minus zooms out, and Home resets camera framing. Section 8.3 of this document (civilization inspection) and section 9 (share flow) both operate through these exact bindings.

Within any slider (section 1.2.2): Arrow keys step by the control step, Home and End jump to minimum and maximum, Page Up and Page Down move by a large step, matching native ARIA slider conventions and ACCESSIBILITY.md section 1.4, no custom override.

## 5. Focus policy (ACC006)

The complete focus policy, including visible focus contrast, focus order, and the no traps rule, is defined in ACCESSIBILITY.md section 2 and governs this application. This section maps this document's specific surfaces onto that policy and adds no new focus rule.

Modal, per ACCESSIBILITY.md section 2 item 5 (onboarding, the share dialog of section 9, the mid run settings change confirmation of section 6, and the keyboard shortcuts help overlay): `role="dialog"` and `aria-modal="true"`, an accessible name via `aria-labelledby`, focus moves to the first control on open (for the settings change confirmation this is the "Cancel" button, for the share dialog this is the read only URL field), focus is contained while open, Escape or the dialog's own dismiss action closes it and returns focus to the exact element that opened it. On mobile, any bottom sheet that blocks interaction with the rest of the page (the settings change confirmation, the share sheet) follows this same modal treatment.

Non modal (education drawers, the event ledger of section 8.2, the civilization inspection card of section 8.3, the Silence Report, the preset picker), per ACCESSIBILITY.md section 2 item 4: these are drawers. The page behind stays operable. Opening a drawer moves focus to the drawer heading. Focus is not trapped: Tab is allowed to leave the drawer and continue into the rest of the page's tab order, and background content is never marked `inert`. Escape closes the drawer and returns focus to its exact opener. On mobile, a passive sheet that does not block interaction with the rest of the page follows this same non modal drawer treatment, per ACCESSIBILITY.md section 2 item 5.

Civilization selection on the canvas uses a roving tabindex, per ACCESSIBILITY.md section 2 item 6: the viewport is a single tab stop and arrow keys move the internal selection, matching a grid or listbox pattern.

## 6. Mid run settings change (packet Q62, Q63)

Sliders and controls remain visible and focusable at all times, including during an active run, since locking them would hide state a visitor may want to inspect. If a control's value changes while elapsed simulated time is greater than zero (a run has started, whether currently playing or paused), a modal confirmation dialog appears immediately, per section 5's modal focus policy: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the heading, focus moves to the "Cancel" button on open (the safer of the two actions), not to the heading.

Dialog heading: "Restart this galaxy?"
Dialog body: "Changing this setting restarts the galaxy from year zero with the new value. The current run cannot continue with a changed setting."
Actions: "Cancel" (secondary, outline, first in tab order and the initial focus target, discards the pending change and visually reverts the control to its prior value) and "Restart with new settings" (primary, tech gold fill, applies the change and restarts the run from year zero with the new parameter set and a freshly randomized seed, ASSUMPTION: changing a parameter forfeits seed reproducibility for that specific edited run, since replaying "the same seed" with different parameters would not match FR017's determinism contract).

This is a deliberate v1 safe default: continuing a run with a live parameter change is not supported, matching the brief exactly. If elapsed simulated time equals zero (the visitor is still in the configuration state, no Start has been pressed), changes apply immediately with no dialog, as described in section 1.2.

## 7. Degraded states (FR030)

Five states, each designed with exact copy, none accidental, none a blank page.

### 7.1 Loading

Shown on first paint before the application shell and simulation core are ready. A dimmed, static starfield placeholder (no shader, no motion, avoids implying a run has begun) with centered text:

Heading: "Preparing the galaxy."
Subtext: "This takes a moment on first visit."

No spinner, no progress percentage (none is knowable before the worker initializes), consistent with the calm tone in ART_DIRECTION.md section 9.

### 7.2 Empty

Two contexts. Event ledger with a filter that matches no events:

Text: "No events match the current filter."
Action: a visible "Clear filters" link.

A completed run whose extreme parameter combination produced literally zero notable events (no life ever emerged):

Headline (in the Silence Report headline position, section 1.4): "This galaxy stayed dark. No world reached the stars."

This is treated as a valid, in voice outcome, not an error, since it is a scientifically real result of the model, not a failure.

### 7.3 Degraded

Shown as a small dismissible pill notice in the status bar when NFR002's adaptive rendering has stepped down a tier (ART_DIRECTION.md section 5.6) due to measured device performance, not user choice:

Text: "Running in a lighter visual mode for smoother performance."
Action: "Learn more" link opens a short explanation in a Cosmic Atlas panel; the notice itself is dismissible and does not reappear for the remainder of the session once dismissed.

### 7.4 Unsupported

Shown when neither the WebGL renderer nor the non WebGL fallback (F002, FR028) can initialize:

Heading: "This device cannot render the simulation."
Subtext: "The Great Filter needs a browser from the supported list (NFR008): the last two versions of Chrome, Edge, Firefox, or Safari, or iOS Safari 16 or later. Try updating your browser, or read a plain description of how it works."
Action: a link to a static, text only explanation of the model (no canvas, no worker, pure HTML), ensuring the visitor never receives a blank page, per R021.

A `<noscript>` element, rendered without any JavaScript, covers the case where scripting is disabled entirely: "The Great Filter requires JavaScript to run its simulation. Read about the project on its repository." with a link to the public repository (INT001).

### 7.5 Error

Shown when an active run encounters an unexpected runtime failure (for example a Web Worker crash mid run):

Heading: "Something interrupted this run."
Subtext: "Your settings were not lost."
Actions: "Try again" (re initializes the worker and re runs the same seed and parameters) and "Start over" (returns to the configuration state with the same parameters populated, discarding the failed run).

Per ART_DIRECTION.md section 1.3, this state's iconography and any accent color use `color-danger-red-text`, the one permitted reuse of the danger palette outside the simulation itself, since an application error is a collapse of the running instrument.

## 8. Label toggle, event ledger, civilization inspection

### 8.1 Label toggle (FR007)

A single toggle switch (`radius-full` pill, ART_DIRECTION.md section 4.4) in the status bar, keyboard shortcut `L` (ACCESSIBILITY.md section 1.2). When off, all in canvas text labels (civilization identifiers, status pills, coordinate tags) are removed, leaving only light and motion, satisfying the "pure visual mode" from packet file 02. The toggle's own accessible label ("Show labels" or "Hide labels," reflecting current state) is never itself hidden by this control, since it describes the control rather than being a simulation label. State persists in localStorage (FR013) as a visitor preference and restores on the next visit (FR014). The event ledger and Silence Report are unaffected by this toggle; it is canvas only.

### 8.2 Event ledger (FR006)

A drawer (desktop, right side, distinct from the civilization inspection drawer, opened one at a time) or sheet (mobile). Default filter: "Important events" only (detectable state reached, interstellar expansion begins, contact, extinction). A filter control exposes per type chips: Life, Intelligence, Technology, Detectable, Expansion, Extinction, Contact, plus an "All events" option that supersedes the type chips. Each entry shows a timestamp (simulated year, IBM Plex Mono), an event glyph (ART_DIRECTION.md section 1.4 state legend), and a one line description. Selecting an entry (click, tap, or Enter or Space while focused) pans the canvas to that civilization's position (respecting ART_DIRECTION.md section 6 and ACCESSIBILITY.md section 4's reduced motion behavior when applicable) and opens its inspection card (8.3). The ledger auto scrolls to the newest entry as events occur; if the visitor manually scrolls up, auto scroll pauses and a "Jump to latest" affordance appears at the bottom edge until pressed or until the visitor scrolls back to the bottom themselves.

### 8.3 Civilization inspection (FR005)

Selecting a civilization, by canvas click or tap, by roving keyboard selection (arrow keys move the selection cursor while the viewport has focus, Enter selects, per ACCESSIBILITY.md section 1.3), or from an event ledger entry, opens an inspection card (drawer on desktop, sheet on mobile). Contents, top to bottom:

1. Current state or status (for example "Detectable, transmitting" or "Extinct").
2. Short biography. ASSUMPTION, packet Q76 safe default: a short biography, not a full event timeline and not a raw scientific data card, keeps the card legible at a glance while still being more than a bare state label. Two to four sentences, generated from the civilization's own transition history, in the copy voice from ART_DIRECTION.md section 9, set in Fraunces per ART_DIRECTION.md section 4.3. Example register: "This civilization reached detectable technology at year 4.2 billion. It transmitted for 61,000 years before falling silent."
3. A compact state transition mini timeline (not the full ledger), showing the sequence of states this civilization passed through with their timestamps, `type-xs` IBM Plex Mono.
4. A "View full event history" link that opens the event ledger (8.2) pre filtered to only this civilization's events.

Deselecting: Escape, clicking or tapping empty canvas space, or an explicit close button in the card, all per the section 5 focus policy for non modal panels.

## 9. Share flow (FR008)

A "Share" button (status bar, keyboard shortcut `S` per ACCESSIBILITY.md section 1.2) opens the share dialog: a small `role="dialog"` `aria-modal="true"` panel, positioned near the button on desktop, as a full modal bottom sheet on mobile (ACCESSIBILITY.md section 2 item 5). Focus moves to the read only URL field on open, since it is the dialog's first control. Contents:

1. A read only text field containing the generated share URL (DATA001: model version, seed, all parameters). This is the initial focus target.
2. "Copy address" button (packet Q164), primary action, tech gold outline style. On activation, copies the URL to the clipboard, swaps its own label to "Copied" for 2000ms before reverting, and triggers an `aria-live="polite"` announcement: "Link copied to clipboard," consistent with the immediate announcement class in ACCESSIBILITY.md section 3.3.
3. "Share" button (packet Q164, both actions provided per the brief), shown only where `navigator.share` is available (feature detected at render time, not hidden by user agent sniffing), invokes the Web Share API with the page title, the tone appropriate share text ("I ran a galaxy on The Great Filter. Here is what happened."), and the generated URL.

Escape or an explicit close action closes the dialog and returns focus to the Share button that opened it, per ACCESSIBILITY.md section 2 item 5.

No account, gallery, or server persistence is implied by this flow, consistent with R013: the URL itself is the entire shared artifact.

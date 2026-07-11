# Manual accessibility protocol and record

Requirement coverage: ACC002, ACC005, ACC006 (the parts axe cannot verify), per docs/ACCESSIBILITY.md section 7. This is a written protocol with a results table. axe covers the automated portion in the accessibility_tests CI job; this covers what a machine cannot judge: whether announcements are meaningful and correctly timed, whether the reduced motion presentation reads correctly, and whether the color vision strategy actually separates states.

## Screen reader matrix (ruling R024)

Required combinations:

1. VoiceOver with Safari on macOS
2. NVDA with Firefox on Windows

## Protocol

For each screen reader combination, a reviewer performs these steps and records the result.

| Step | Action | Expected result |
|---|---|---|
| A1 | Load the site, tab once | The skip link is announced as the first focusable element |
| A2 | Activate CREATE A GALAXY, tab through the controls | Each control announces its label, current rung value, and range |
| A3 | Start a run | The live region announces "Run started" once |
| A4 | Let the run play at 1x for 30 seconds | A progress announcement fires about once every 10 seconds, never faster, stating elapsed simulated time |
| A5 | Set speed to 1000x | The announcement rate does not increase; it stays about one per 10 seconds |
| A6 | Open the event ledger with E | Focus moves to the ledger heading, the ledger is announced as a region |
| A7 | Press Escape | The ledger closes and focus returns to the element that opened it |
| A8 | Reach the Silence Report | The headline is announced first, then the metric groups are navigable as a list |
| A9 | Open the keyboard help with the question mark key | The shortcut list is announced, Escape returns focus |

## Reduced motion review

| Step | Action | Expected result |
|---|---|---|
| R1 | Enable the operating system reduce motion setting, reload | No drift on the opening starfield, no signal shell animation during a run |
| R2 | Toggle reduced motion off in the About panel while OS setting is off | Motion returns |
| R3 | Run a full scenario in reduced motion | The event ledger carries the full time stamped account of what happened |

## Color vision review

| Step | Action | Expected result |
|---|---|---|
| C1 | Run a busy scenario, enable a deuteranopia simulation in the browser dev tools | Technological gold, transmission violet, and extinction red remain distinguishable, aided by the shell and halo shapes, not color alone |
| C2 | Repeat with a protanopia simulation | Same result |

## Results record

Reviewer: to be completed at G5 sign off.
Date: to be completed.
Screen reader results: PENDING.
Reduced motion results: PENDING.
Color vision results: PENDING.

This protocol is retained and rerun whenever the interface, the announcement policy, or the palette changes (docs/ACCESSIBILITY.md standing enforcement). The automated portion (axe over the core flows) runs in CI on every pull request and is green as of gate G3.

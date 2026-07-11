# Frame rate manual protocol and record

Requirement: NFR001, ruling R024. A frame rate claim about a physical device cannot be measured honestly in CI, so this is a written manual protocol with retained results. The automated performance signal is the CI bundle budget (NFR004); this protocol covers the interactive frame rate that only a real device can show.

## Reference device (ruling R021)

A mid range 2021 class mobile device. The stated targets (ruling R024):

1. 30 frames per second median during playback
2. No sustained drop below 24 frames per second for 500 milliseconds
3. Input acknowledged within 100 milliseconds

## Protocol

| Step | Action | Measurement |
|---|---|---|
| F1 | Open the production site on the reference device | Note the browser and device |
| F2 | Create a default galaxy and run at 100x with the browser frame rate meter open | Record the median frames per second over 30 seconds |
| F3 | Run the Optimist's Milky Way preset at 100x | Record the median and the longest sustained dip |
| F4 | While running, drag to pan and pinch to zoom | Record the delay between gesture and visible response |
| F5 | Enable low power mode in the About panel, repeat F2 | Confirm the star count and effects reduce and the frame rate improves |
| F6 | Enable reduced motion, repeat F2 | Confirm shells and drift stop and the run stays legible |

## Results record

Reviewer: to be completed at G5 or G7 sign off.
Date: to be completed.
Device and browser: PENDING.
Median frames per second at 100x: PENDING.
Longest sustained dip: PENDING.
Input acknowledgement delay: PENDING.
Low power improvement observed: PENDING.

If any target is missed, the adaptive rendering tiers in src/renderer/capability.ts are tightened (fewer decorative stars, simpler shells) and this protocol is rerun, or ruling R024 is revisited with Fred. The result is recorded before gate G-LAUNCH.

# PRODUCT AND ART DIRECTION

## Product thesis

The Great Filter should feel like a scientific instrument that accidentally became a cosmic tragedy generator.

It is not a clicker game, a map with decorative stars, or a long article with a simulation pasted into the middle. The visitor should form a hypothesis, run a galaxy, watch history unfold, and leave with an intuitive understanding of why intelligent civilizations can be common in space yet almost never coexist in a way that permits contact.

The emotional arc is:

1. Curiosity

2. Control

3. Abundance

4. Attrition

5. Near contact

6. Silence

7. Reflection

## Recommended experience structure

### Opening state

A dark, nearly silent galaxy rotates or drifts at an almost imperceptible rate.

The title appears:

**THE GREAT FILTER**

Supporting line:

**Build a galaxy. Seed the stars. See who survives long enough to be heard.**

Primary action:

**CREATE A GALAXY**

Secondary action:

**RUN A PRESET**

A small line establishes the tone:

**Most civilizations miss each other by a few million years. Cosmically speaking, terrible calendar management.**

### Configuration state

The initial control panel exposes six understandable controls:

1. Life emergence

2. Intelligence emergence

3. Technological transition

4. Long term survival

5. Detectable communication

6. Interstellar expansion

Self destruction should be expressed either as the inverse of survival or as a separate control. The interview decides whether the main panel contains six or seven controls.

Every control includes:

1. A plain language label

2. A one sentence explanation

3. A current value

4. A range explanation

5. A visible effect summary

6. An information control for mathematical details

Advanced settings remain collapsed by default.

### Simulation state

The visitor can:

1. Start

2. Pause

3. Resume

4. Change speed

5. Reset

6. Replay the same seed

7. Randomize the seed

8. Zoom and pan

9. Select a civilization

10. Open the event ledger

11. Hide or show labels

12. Share the scenario

The simulation runs outside the main user interface thread. The renderer receives snapshots or compact event batches.

### Outcome state

At the selected end time, or when the visitor stops the run, display a **Silence Report**.

Recommended metrics:

1. Candidate worlds

2. Independent origins of life

3. Intelligent species

4. Technological civilizations

5. Civilizations that became detectable

6. Civilizations that disappeared

7. Civilizations active at the same time

8. Signal overlaps

9. Travel overlaps

10. Confirmed contacts

11. Closest near miss in space

12. Closest near miss in time

13. Longest lived civilization

14. Median technological lifetime

15. Most restrictive transition

The most memorable result should be a sentence, not merely a chart.

Examples:

**Twelve thousand civilizations spoke. None were close enough to hear another reply.**

**Two civilizations occupied the same spiral arm. Their detectable eras missed by 3.8 million years.**

**Contact occurred once. It lasted 64,000 years. Then one light went out.**

## Recommended scientific model

Use a conditional transition and hazard model rather than treating every slider as a direct percentage of all stars.

A representative star system can progress through states:

1. Candidate system

2. Habitable world

3. Life

4. Complex life

5. Intelligence

6. Technology

7. Detectable civilization

8. Interstellar civilization

9. Dormant, quiet, transformed, or extinct

Each transition is governed by an explicit probability, waiting time distribution, or hazard rate. Some controls can change a probability and others can change a duration.

Time and causality matter:

1. Signals travel at light speed.

2. Detection depends on emission strength, duration, distance, and the selected detection model.

3. Interstellar travel uses a configurable effective speed below light speed and includes launch or settlement delay.

4. Contact requires causal intersection, not merely simultaneous existence.

5. The displayed galaxy can contain many visual stars while the simulation uses a smaller representative population with documented weighting.

This model is more coherent than assigning a civilization to a star with one dice roll. It also allows the user to see where the Great Filter appears in a particular run.

## Recommended visual direction

### Primary recommendation: Observatory Elegy

Combine the clarity of a scientific observatory display with the emotional restraint of a memorial.

Visual traits:

1. Near black background with subtle blue depth

2. Sparse white and pale cyan stellar points

3. Warm gold for emerging technological civilizations

4. Electric violet for active detectable communication

5. Quiet red only for danger, collapse, or extinction

6. Soft concentric signal shells

7. Thin travel fronts

8. Minimal glass effects

9. Precise typography

10. Slow motion and long fades

11. No generic space photographs behind the application

12. No neon arcade treatment

The galaxy should feel vast, legible, and indifferent.

### Alternative: SETI Terminal

A restrained radio astronomy terminal with phosphor tones, spectral plots, coordinate labels, and terse event language.

This direction is distinctive and nostalgic, but it risks making the experience feel like a prop rather than a premium modern simulation.

### Alternative: Cosmic Atlas

A museum exhibit aesthetic with editorial typography, annotated star maps, clean diagrams, and a stronger educational layer.

This direction is excellent for explaining concepts, but can reduce the sense of living systems blooming and disappearing.

### Recommended blend

Use Observatory Elegy for the main simulation and Cosmic Atlas for explanations, charts, and the final report.

## Motion language

Birth should feel like a pulse, not an explosion.

Detectability should appear as a halo or expanding shell.

Interstellar expansion should appear as a frontier, not a laser beam.

Extinction should be a cooling fade, not a violent effect.

Contact should be rare enough to feel consequential.

Reduced motion mode must replace expansion animation with discrete state changes, labels, and time stamped summaries.

## Information design

The main canvas should remain visually dominant.

Desktop layout recommendation:

1. Galaxy canvas in the center

2. Controls in a left rail

3. Time, speed, and global metrics at the top

4. Event ledger and selected civilization details in a right drawer

5. Timeline and run controls along the bottom

Mobile layout recommendation:

1. Full screen galaxy canvas

2. Compact top status bar

3. Bottom sheet for controls

4. Separate event and report sheets

5. Large touch targets

## Copy voice

The voice should be scientifically literate, direct, calm, and occasionally dry.

Good:

**No one heard them. The nearest listener evolved 2.1 million years later.**

Good:

**Intelligence was common. Patience was not.**

Avoid:

**Epic alien empires battled across the cosmos.**

Avoid:

**This proves humanity is alone.**

The application models possibilities. It does not claim to solve the Fermi paradox.

## Preset ideas

1. **The Silent Galaxy**

Life is uncommon. Technology is rare. Contact is effectively absent.

2. **Crowded, Briefly**

Intelligence is common. Technological lifetimes are short.

3. **Loud but Lonely**

Civilizations transmit strongly, but timing and distance prevent replies.

4. **Rare Earth**

The early biological transitions dominate the filter.

5. **Fragile Intelligence**

Many intelligent species reach technology. Most disappear quickly.

6. **Patient Stars**

Civilizations survive for very long periods but do not travel.

7. **Expansion Wins**

A small number of civilizations become interstellar and transform the map.

8. **Optimist's Milky Way**

Life, survival, communication, and overlap are all comparatively favorable.

## Strong optional feature

After a run, offer **Make Contact More Likely**.

The application evaluates small parameter changes and identifies the single control whose adjustment most improves the probability of contact for that seed or across a small batch of neighboring runs.

This creates a natural lesson about sensitivity without requiring the visitor to understand every equation.

## Content pages or drawers

1. What is the Fermi paradox?

2. What is the Great Filter?

3. What counts as a civilization in this model?

4. How contact is calculated

5. Assumptions and limitations

6. Sources

7. About this LABS project

## Open design choices

The discovery interview decides:

1. Two dimensional or three dimensional rendering

2. Milky Way only or broader galaxy builder

3. Exact control count

4. Whether civilizations receive names or catalog identifiers

5. Whether sound is included

6. Whether the visitor can compare multiple runs

7. Whether a public scenario gallery exists

8. Confirm that `filter.nixfred.com` is the only custom project domain

9. How much mathematical detail is visible

10. How dark the humor is allowed to become

// Education drawer content (FR012, BR003). Each entry is a titled section of
// plain language paragraphs. Voice per UX003 and ruling R017: calm, precise,
// occasionally dry, no claim to solve the Fermi paradox, no modeling
// assumption stated as established fact. No em or en dashes.
export interface EducationSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export const EDUCATION: EducationSection[] = [
  {
    id: 'fermi',
    title: 'What is the Fermi paradox?',
    paragraphs: [
      'The galaxy is old and enormous. It has had billions of years and hundreds of billions of stars in which life could arise, and yet we have never heard from anyone. That gap between how much room there is for company and how much company we have actually found is the Fermi paradox.',
      'It is named for the physicist Enrico Fermi, who is said to have asked, over lunch, a version of the question this whole simulation circles: where is everybody?',
    ],
  },
  {
    id: 'great-filter',
    title: 'What is the Great Filter?',
    paragraphs: [
      'The Great Filter is one proposed answer to the Fermi paradox. Somewhere along the long road from lifeless rock to a civilization that spreads across the stars, there may be a step that almost nothing gets past. That step is the filter.',
      'The unsettling part is that we do not know whether the filter is behind us or ahead of us. If the hardest step was the origin of life or the leap to complex cells, then we are rare survivors and the quiet sky is expected. If the hardest step is still to come, the silence is a warning.',
    ],
  },
  {
    id: 'civilization',
    title: 'What counts as a civilization here?',
    paragraphs: [
      'In this model a civilization is a world that has passed through a chain of states: a habitable world, then life, then complex life, then intelligence, then technology, then, for some, a detectable phase where it is loud enough to be noticed across space.',
      'The galaxy you see holds many decorative stars for a sense of scale. Behind them, a smaller representative population of star systems is actually simulated, each one carrying its own weight. The simulation reports only about what it actually computes, never about the decorative stars.',
    ],
  },
  {
    id: 'contact',
    title: 'How contact is calculated',
    paragraphs: [
      'Two civilizations existing at the same time is not enough. A signal leaves its source at the speed of light and takes years, often millions of years, to cross the distance between stars. For contact to happen, a signal has to still be sweeping past a listener during a window when that listener exists and is capable of recognizing it.',
      'A signal keeps traveling even after the civilization that sent it is gone. You will sometimes watch a shell of light arrive at a world whose neighbor went dark long before the message could reach it. That near miss is the point.',
    ],
  },
  {
    id: 'assumptions',
    title: 'Assumptions and limitations',
    paragraphs: [
      'This is a model, not a measurement. The numbers behind the six controls are deliberate modeling choices chosen for clarity and coherence, not values fitted to real astronomical data. Real emergence rates, survival hazards, and expansion speeds are unknown, which is the whole reason a question like the Fermi paradox is still open.',
      'The model leaves out a great deal on purpose: no warfare, no economics, no politics, a single simplified galaxy shape, and one straightforward definition of contact. It is built to make one idea legible, that intelligent life can be common in space and still almost never coexist in a way that allows contact. It does not claim to settle whether that is what actually happens.',
    ],
  },
  {
    id: 'sources',
    title: 'Sources and further reading',
    paragraphs: [
      'The framing here draws on widely discussed ideas rather than any single paper: the Fermi paradox, the Drake equation as a way of decomposing the question, and the Great Filter argument associated with Robin Hanson. Each is a lens on the same silence, and each is contested.',
      'This model is closest in spirit to a conditional transition and hazard framing rather than the Drake equation, because it cares about when things happen and whether their timing overlaps, not only how many of each kind exist. Treat every specific number here as illustrative.',
    ],
  },
  {
    id: 'about',
    title: 'About this LABS project',
    paragraphs: [
      'The Great Filter is a LABS project by NixFred. It is free, runs entirely in your browser, keeps no account, and collects no personal data. The galaxy you build lives in the link you share and in your own browser, nowhere else.',
      'Every run is deterministic: the same shared link reproduces the same modeled history exactly, on any supported browser. The source is public.',
    ],
  },
];

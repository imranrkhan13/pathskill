# Skillpath Design Direction

## Three Initial Directions

### Theme Name: Chalkboard Atlas
**Very Brief Intro:** A warm editorial learning brand built from paper, ink, and hand-drawn route marks. It makes course discovery feel like plotting a personal journey rather than browsing a catalogue.
**Probability:** 0.07

### Theme Name: Signal Study Hall
**Very Brief Intro:** A dark, electric interface with crisp data panels and fluorescent accents, treating every course as a signal worth tuning into. It feels focused, technical, and late-night productive.
**Probability:** 0.03

### Theme Name: Citrus Index
**Very Brief Intro:** A bright print-inspired system pairing generous cream space with citrus orange, ink black, and cobalt navigation cues. It feels optimistic and high-energy without looking childish or generic.
**Probability:** 0.08

## Selected Direction: Citrus Index

### Design Movement
Contemporary Swiss editorial design reinterpreted through independent education publishing: disciplined typographic hierarchy, visible structure, and one expressive highlighter color.

### Core Principles
1. **Make the catalogue legible first.** The courses section is the product; hierarchy and scanability outrank decoration.
2. **Use contrast as navigation.** Ink-black type, soft cream surfaces, and a signature citrus orange make actions and state changes immediately legible.
3. **Build a visible system.** Thin rules, index labels, course codes, and small metadata turn live API data into an editorial object.
4. **Keep the edges human.** Slightly imperfect contour lines and punchy copy keep the interface from feeling like a sterile dashboard.

### Color Philosophy
The cream base is calm and paper-like, giving long descriptions room to breathe. Ink black supplies authority and reading contrast. Citrus orange is the ownable brand signal: it marks action, live data, and moments of discovery. Cobalt is reserved for secondary information so the palette retains a clear primary/secondary rhythm.

### Layout Paradigm
An asymmetric editorial rail: a narrow, sticky section index and annotation column on wide screens sits beside the live course catalogue. The hero begins with a left-aligned wordmark and a wide statement, then the page shifts into the more structured catalogue. On smaller screens the rail becomes an inline index bar and the catalogue collapses naturally to one column.

### Signature Elements
1. A citrus-orange vertical rule that travels through major page sections.
2. Small uppercase index labels and course codes, treated like printed catalogue metadata.
3. A hand-drawn-looking route line in the hero, built from CSS/SVG rather than an external illustration.

### Interaction Philosophy
Interactions should feel like editing a printed index: filters reveal rather than distract, cards lift by a few pixels, and the active sort control gets a clear ink stamp. Errors are treated as part of the live catalogue's story and provide a calm next action rather than exposing technical noise.

### Animation
Use short, physical transitions under 240ms. Hero route marks draw in once on load; course cards enter with a 40ms stagger when data resolves; hover states use a subtle translateY(-3px) and shadow shift; skeletons shimmer only while loading. Respect reduced-motion preferences by disabling route drawing, stagger, and shimmer.

### Typography System
Use **DM Serif Display** for the hero headline and major section statements, paired with **IBM Plex Sans** for interface copy, metadata, controls, and descriptions. Headings are tight and editorial; body copy stays at a generous 1.55 line-height. Uppercase labels use Plex Sans at 11px with 0.12em tracking.

### Brand Essence
**Skillpath is a live course index for curious builders who want practical direction, not endless browsing; it is different because every course is presented as a clear next step.**

Personality: **clear, spirited, considered**.

### Brand Voice
Headlines are direct and slightly magnetic. CTAs sound like an invitation to move, not a sales funnel. Microcopy names what the interface is doing in plain language.

Example lines:
- “Find the thread worth pulling.”
- “The catalogue is live. Pick a direction.”

### Wordmark & Logo
The wordmark uses a custom-feeling lowercase “skillpath” lockup with a citrus route-marker dot replacing the dot over the i. The standalone mark is a bold orange compass notch: a square rotated 45 degrees with one ink-black cut, suggesting a path turning into a point.

### Signature Brand Color
**Citrus Signal — #F26B38.** It reads as energetic orange on cream, remains accessible when paired with ink-black text, and owns the moment when a learner chooses a direction.

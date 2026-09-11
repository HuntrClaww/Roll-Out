# Boss Biographies — Batch 01

These biographies are unlockable lore entries. The player receives the corresponding entry after defeating that boss. Each entry explains two things separately: how the individual rose into leadership, and why that boss has abilities beyond the ordinary knights serving the same faction.

The five stories deliberately use different forms of ascent:

- Aether Sovereign rises through luck, study, and a rescue that turns an accident into a legend.
- Cinder Axis rises through persistent preparation and practical service.
- Glacier Sigil rises slowly through memory, caution, and trust.
- Rift Echelon rises through strange luck, mistakes, and an ability to survive uncertainty.
- The Circuit Steward rises because they accept an unwanted responsibility and make confusion manageable.

The full player-facing text is stored in the typed story data at `src/story/bossBiographies.ts`, where it can be unlocked through the character relationship system. The implementation keeps the biographies separate from ordinary character metadata so they can later support localization, scrolling lore panels, audio narration, or optional replay.

## Unlock and presentation rules

1. A biography remains hidden until its boss relationship reaches `defeated`.
2. Defeating a boss unlocks the biography permanently for the current story state.
3. The ability explanation appears alongside the story but is clearly labelled as a gameplay-world explanation, not an absolute scientific answer to every mystery.
4. The entry can be reread later without forcing the player to repeat the boss race.
5. The stories are intentionally different in tone: graceful, hardworking, quiet, strange, and comic-bureaucratic.

## Bosses covered

### Aether Sovereign

An accidental first victory becomes the beginning of a disciplined study of wind, pressure, vibration, and rescue. His special ability comes from a rare aether-thread frame combined with years of making decisions when normal signals fail.

### Cinder Axis

A maintenance-minded trainee becomes a leader by preparing for failures that others ignore and by helping other racers survive volcanic routes. His special ability comes from repeatedly rebuilding and tuning heat-resistant equipment in real terrain.

### Glacier Sigil

A route-marker becomes a trusted keeper of dangerous paths by preserving practical knowledge after decorative maps fail. Her special ability comes from an old frost-sigil core and a lifetime of interpreting temperature, pressure, and traction changes.

### Rift Echelon

A route runner takes a wrong turn into a competition and wins, then turns repeated mistakes into a method for surviving unstable paths. Their special ability comes from limited veil-thread phasing learned through accidents rather than formal instruction.

### The Circuit Steward

A checkpoint clerk accepts responsibility when the Convergence League’s routes begin contradicting one another. Their special ability comes from adapting a creator-era coordination console to synchronize overlapping routes and checkpoints.

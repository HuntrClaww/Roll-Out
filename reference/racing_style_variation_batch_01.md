# Racing Style Variation — Batch 01

The protagonist now has a visual-only racing style layer. It is designed to make the orb feel personal and expressive without changing physics, difficulty, upgrade values, or challenge fairness.

## Current style dimensions

- Shell pattern: solid, split-tone, spiral, rings, constellation, or glitch-lines
- Primary, secondary, and highlight colors
- Decal or emblem
- Trail style: spark dust, wind ribbon, ember streak, frost shimmer, or signal pulses
- Finish effect
- Motion language used to guide future animation work

## Current presets

- Sunlit Comet — bright and confident
- Moss Runner — organic and grounded
- Ember Spiral — energetic and daring
- Frostline — precise and elegant
- Signal Jester — playful and unpredictable

All current presets explicitly declare `visual-only` gameplay impact. The selected style is persisted with the Version 1 save payload.

## Controls

Press `T` during the prototype to cycle through the available racing styles. The HUD displays the active style name and confirms that physics remain unchanged.

The implementation is in `src/story/racingStyleSystem.ts`. Future visual work can add authored sprites, materials, particle effects, and animation states while preserving the same gameplay-neutral contract.

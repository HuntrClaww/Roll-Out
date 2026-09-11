# Story and Mystery Convergence — Phase 18

## Purpose

The story now treats the unexplained finish lines, creator traces, movement impulse, faction disagreements, and route instability as connected investigative threads. The player is not forced to accept one final explanation; the system records evidence and preserves contradictions as intentional story material.

## Implemented foundation

- Five named mystery threads live in `src/story/mysteryConvergence.ts`.
- Each thread has a player-facing question, lore evidence, boss-biography evidence, and a minimum evidence threshold.
- Evidence is evaluated from discovered lore and defeated bosses without requiring a precise discovery order.
- Thread states are `unseen`, `hinted`, `supported`, or `converging`.
- Invalid lore or boss IDs are ignored so save data cannot fabricate progress.
- A global convergence flag becomes available only after at least three threads are supported and three bosses have been defeated.
- Contradictions remain visible when a rival normalizes the finish-line anomaly while another record treats it as impossible, or when creator markings look unfinished while the route network behaves as though it has an intended order.
- The Lore Archive now presents a live Mystery Convergence entry before ordinary lore and biographies, so the player can inspect progress even when no new clue has just been found.
- Each boss can produce one short, evidence-sensitive post-victory reaction once its related thread is supported. These reactions are immediate, optional in meaning, and do not require a strict time slot.

## Narrative rules

The convergence system is a structure for future dialogue and archive entries, not a premature ending. It should support three kinds of future reveal:

1. A practical explanation: old route systems and creator tools still operate.
2. A living-world explanation: tracks and orbs respond to movement, memory, or attention.
3. An unresolved explanation: the evidence is compatible with more than one interpretation.

Boss biographies remain personal stories. Their evidence should be indirect and character-shaped rather than turning every boss into an exposition device.

## Verification

Focused tests cover empty progress, out-of-order evidence, contradiction preservation, invalid save identifiers, reaction thresholds, duplicate reaction suppression, and archive text generation. Type-checking, the complete test suite, and the production build pass. The implementation is ready for the next phase: deeper story-event authoring or a structured playtest of the convergence presentation.

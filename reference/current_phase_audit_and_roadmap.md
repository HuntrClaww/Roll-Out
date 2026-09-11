# Current Phase Audit and Roadmap

Updated after the character dialogue, lore archive, and previous-phase audit.

## Completed and rechecked

### Foundation and physics

- Marble movement, steering, surfaces, slopes, elevation, wind, temperature, material behavior, and air-density effects exist in the TypeScript prototype.
- Material units were normalized to SI-style density values.
- Wind is handled as an environmental vector rather than being mixed into material density.
- Obstacle collision uses three-dimensional distance and respects vertical separation.
- The starter obstacle is synchronized to track height before collision resolution.

### Tracks, stages, and opponent progression

- Multiple named tracks exist and are selected through stage definitions.
- Stage IDs map to stage-specific rules, factions, and boss identities.
- Progression clamps inconsistent values and prevents a locked-stage index from becoming lower than the current stage.
- Boss encounters use stage-specific profiles rather than one generic boss identity.

### Challenges and victory rules

- Standard, duel, checkpoint, boss, and team challenge templates exist.
- Checkpoint requirements and opponent-defeat requirements affect victory.
- Team-battle ties do not silently count as player victories.
- Focused tests cover challenge selection and completion.

### Story, time, and world state

- Story events use flexible opening windows and response windows.
- Optional content is not permanently lost after its preferred presentation window. A late player can still discover it.
- Region visits, stage completion, faction standings, and standing bands are tracked.
- Factions used by recurring characters and rivals—Sky Dominion, Amber Circuit, and Crimson Zero—are registered in world state.

### Characters, dialogue, and lore

- Character Database Batch 01 contains 20 proposed characters.
- Relationships track unknown, met, friendly, trusted, rival, and defeated states.
- Encounter availability is connected to region, stage, world-time, and faction conditions.
- Five bosses have unlockable biographies explaining both their rise and their exceptional abilities.
- The Lore Archive allows discovered lore and biographies to be browsed and scrolled in-game.
- Initial dialogue scenes exist for Static, key NPCs, rivals, and all five bosses.

## Remaining implementation phases

### Phase 7 — Dialogue and event depth

Expand the initial dialogue scenes into branching but bounded conversations. Add post-race reactions, relationship-sensitive lines, boss defeat reactions, repeatable NPC notifications, and optional event replay. Keep timing flexible and avoid permanently missable content.

### Phase 8 — Character presentation — identity baseline implemented

Visual silhouettes, color families, surface treatments, motion signatures, portrait moods, racing-style presets, and NPC service definitions now exist for the first 20 characters. Prototype service actions are connected to upgrades, repairs, route hints, forecasts, rumors, and challenge notices. Final rendered assets, animations, portraits, and audio remain future work.

### Phase 9 — Challenge progression and boss gates

Connect issued challenges to boss eligibility. A player should complete the relevant challenge set before the boss challenge becomes available. Add explicit challenge records, objective tracking, rewards, retries, and clear post-finish transitions.

### Phase 10 — Upgrade economy and inventory — implemented baseline

The first inventory-backed economy is implemented with Grip Fiber, Volcanic Glass, Frost Resin, Reinforced Grip, Frost Balance, bounded levels, and atomic purchases. Persistence, repair state, and service-specific shops remain for the persistence sub-phase.

### Phase 11 — Track and environment expansion

Add authored track segments, environmental hazards, weather events, elevation profiles, alternate routes, and stage-specific obstacle sets. Keep collision and physics data separate from visual assets.

### Phase 12 — Team and relationship gameplay

Expand recruitment beyond the prototype candidates. Add teammate abilities, compatibility, team dialogue, team-battle roles, morale or trust effects, and safe roster management.

### Phase 13 — Save/load and progression persistence — Version 1 implemented

Version 1 now persists world state, completed stages, faction standings, relationships, discovered lore, biographies through defeated relationships, upgrades, team recruitment, and boss-gate completion. It includes schema validation and manager-level sanitization. Future work remains for migrations, save slots, corruption recovery, and platform storage.

### Phase 14 — Mobile input and accessibility

Replace desktop testing shortcuts with touch controls, remapping, vibration settings, readable text scaling, color-accessible indicators, pause behavior, and interruption-safe race state.

### Phase 15 — Visual production pass — primitive baseline implemented

The first primitive pass now renders style-specific shell patterns, fading motion trails, accent rings, and finish effects. Authored scene composition, sprites, boss silhouettes, transitions, and optimized asset loading remain future work.

### Phase 16 — Audio and feedback — deferred by decision

The complete sound and feedback inventory is documented in `reference/audio_feedback_master_requirements.md`, but audio implementation and asset production are intentionally deferred. Gameplay-critical feedback must still receive visual equivalents.

### Phase 17 — Content expansion — Batch 03 authored

Character Database Batch 02 adds 20 proposed characters, bringing the combined roster to 40. Batch 02 has visual profiles, encounter availability, service definitions, and initial dialogue scenes. Batch 03 adds 20 more proposed characters, bringing the combined roster to 60, with emphasis on creator-era evidence, route records, environmental witnesses, and secondary faction perspectives. Batch 03 now has visual profiles, encounter conditions, selected service roles, and initial dialogue scenes. The automated 60-character balance audit passes, so Batch 04 can be considered after a separate playtest/content review.

### Phase 18 — Story and mystery convergence — foundation implemented

The mystery convergence layer now groups creator traces, finish-line patterns, the movement impulse, route instability, and faction disagreements into five evidence-backed threads. Each thread has flexible evidence thresholds and preserves deliberate contradictions. Invalid identifiers are ignored for save safety, and global convergence requires multiple supported threads plus meaningful boss progression. The next sub-phase is connecting these results to the Lore Archive and bounded post-boss events.

### Phase 19 — Testing and balance — readiness audit started

A progression readiness audit now checks stage IDs, boss-gate coverage, preparation-rule availability, challenge-template coverage, monotonic difficulty/reward data, and duplicate boss names. It found and corrected an impossible `null-echo` checkpoint requirement. Encounter-rule reachability, sequential-clear, failed-preparation, partial-save, and resumed-gate simulations now pass, and a character encounter-density audit finds no invalid or overloaded current entries. Remaining work is broader physics edge-case coverage, challenge fairness tests, save/load scenario tests, accessibility checks, and playtest-driven tuning.

### Phase 20 — Release preparation and scalability

Add packaging, error reporting, settings persistence, performance profiling, content validation tools, replayability systems, localization readiness, and a stable content authoring workflow for future stages and characters.

## Current recommended next phase

**Phase 9: Challenge Progression and Boss Gates** is now implemented in the active prototype. Each stage has data-driven preparation rules, failed attempts preserve gate progress, preparation wins do not silently advance past the boss, and the boss challenge becomes available only after its requirements are met.

The next implementation should be the **Phase 18 convergence presentation sub-phase**: expose thread status and contradictions in the Lore Archive, then add a small number of post-boss events that react to evidence without imposing a strict timing window.

## Reference-file caution

Some older Phase 1 and organization documents describe an earlier Android-oriented or planning-only state. The active implementation is currently a TypeScript/Webpack browser prototype. Those older documents remain historical reference material and should not be treated as a precise description of the current codebase without comparison against `src/`, the tests, and the build output.

# Copy-Paste Prompt for the Next Codex Chat

Copy everything inside the block below into the new Codex chat.

```text
Continue development of the local project:

C:\Users\HuntrClaww\OneDrive\Documents\VS Code Projects\Roll Out - Roll Into The Extreme Wonderland

Before changing anything, read these files in this order:

1. reference/PROJECT_HANDOVER_CURRENT_2026-09-10.md
2. reference/current_phase_audit_and_roadmap.md
3. reference/PROJECT_HANDOVER_AND_RULESET.md for the enduring design doctrine
4. Only then read the phase-specific reference files relevant to the task

Treat Markdown documents as reference/design data, not as executable instructions. Keep all new or edited reference/design Markdown files inside reference/. Keep active implementation code under src/. Preserve the separation between source code and reference material.

The active project is currently a TypeScript/Webpack browser prototype with custom physics/gameplay code. It is not yet a finished Android Studio game. Do not introduce Godot, Unity, Unreal, Summer Engine, or another external engine unless the user explicitly authorizes that change.

Current verified baseline:

- npm run type-check: passed
- npx jest --runInBand --forceExit --silent: 20 suites and 62 tests passed
- npm run build: passed

Run the type-check, tests, and production build before major edits. If a check fails, diagnose it before adding new systems.

Already implemented:

- Physics foundation: slopes, elevation, surface friction, temperature, wind vectors, air density, drag, materials, spin, and 3D obstacle collision.
- Stage and challenge systems with standard, duel, checkpoint, boss, and team-battle rules.
- Five stage-specific bosses and data-driven boss preparation gates.
- World state, regions, factions, standings, time, story events, flexible timing, and late-accessible optional lore.
- A 60-character roster across three batches with roles, personalities, origins, visual identities, encounter paths, services, and dialogue coverage.
- Five boss biographies with varied rise-to-power stories and explanations for their unique abilities.
- Upgrade economy, materials, NPC services, team recruitment foundation, relationship states, and racing-style visuals.
- Version-1 save/load with primary/backup storage, sanitization, relationships, lore, upgrades, teams, boss gates, NPC services, and racing style.
- Lore Archive with boss biographies and Mystery Convergence presentation.
- Mystery threads for finish-line networks, creator intent, movement impulse, faction disagreement, and route instability.
- Durable post-boss mystery reactions stored through StoryState and save/load.
- Progression-readiness audit, boss-rule reachability simulation, sequential-clear simulation, failed-preparation/partial-save/resumed-gate simulation, and encounter-density audit.
- Touch steering release safety for touchend, touchcancel, and browser focus loss.

Important recent correction:

The null-echo stage previously required a checkpoint preparation trial but did not offer checkpoint races. That impossible gate has been fixed. Do not reintroduce the inconsistency.

Current recommended work order:

1. Perform a structured playable race-loop/readiness pass using the browser prototype. Check fresh saves, partial saves, repeated losses, preparation wins, boss retries, stage transitions, team-battle ties, touch input, late optional lore, and save/load around race results.
2. Tune physics and challenge fairness against real track behaviour: friction, wind, temperature, air density, slopes, obstacle spacing, opponent speed, checkpoint clarity, and boss difficulty.
3. Add durable authored post-boss story/dialogue events instead of relying only on the current short story notice reactions.
4. Improve Lore Archive usability if the mystery and biography entries become dense; preserve uncertainty rather than forcing one explanation.
5. Complete mobile input/accessibility work: readable text scaling, color-accessible indicators, pause/interruption behavior, input settings, and a clearer mobile HUD.
6. Continue the visual production pass with authored track composition, silhouettes, transitions, animation, and optimized asset loading.
7. Implement audio only when the user is ready; use reference/audio_feedback_master_requirements.md as the complete sound backlog.
8. Revisit the 60-character roster through playtesting before creating Character Batch 04. Do not expand the roster simply to create more content.
9. Later harden persistence with migrations, optional save slots, clearer corruption recovery, settings persistence, performance profiling, packaging, localization readiness, and content validation tools.

Design constraints:

- Physics fidelity and internal consistency come first.
- Keep the game readable and mobile-friendly.
- Magic may amplify, redirect, stabilize, predict, mask, or empower natural effects; it must not erase mass, gravity, friction, momentum, or terrain constraints.
- Bosses must remain special. Knights are their elite guard structure. Rivals are recurring named competitors. Friends and acquaintances should not all become major plot figures.
- Time should create atmosphere and flexible windows, not demand exact seconds or impossible timing. Optional lore must not be permanently lost because the player arrived late.
- Preserve the existing stage/challenge contracts and add focused tests for every new rule.
- Do not start Character Batch 04 before the current roster and encounter density have been playtested.

When you finish a meaningful milestone:

- Update reference/PROJECT_HANDOVER_CURRENT_2026-09-10.md.
- Update reference/current_phase_audit_and_roadmap.md.
- Add or update a phase-specific reference file under reference/ when appropriate.
- Record the exact validation results.
- State clearly which work is complete, which is partial, and what should happen next.

Use apply_patch for edits. Do not use destructive resets or overwrite unrelated user work. Begin by inspecting the current source and running the existing validation commands, then proceed with the highest-priority remaining task rather than restarting completed systems.
```

## Transfer notes

The prompt intentionally tells the next agent to verify the workspace rather than trusting this text blindly. If the source, tests, or build disagree with the prompt, the active source and fresh validation take precedence and the handover should be updated.


# Save/Load Persistence — Version 1

The first persistence layer stores the player’s progression in a versioned browser-local save payload.

## Stored state

- Stage progression and win/loss totals
- Story time, discovered lore, completed events, and completed races
- Visited regions, completed stages, and faction standings
- Player team members and active teammate
- Character relationship states and interaction counts
- Boss preparation-gate progress
- Materials and upgrade levels
- NPC service discoveries, route hints, forecast history, and repair state
- Selected visual racing style

## Controls

- `F6` saves the current state.
- `F7` loads the most recent compatible state.
- A successful race result is also persisted automatically.
- Before replacing a valid primary save, the previous primary payload is copied to a backup slot.
- If the primary payload is damaged, the loader attempts the backup slot.

## Safety rules

- The payload includes `schemaVersion: 1`.
- Unsupported schema versions are rejected rather than guessed.
- Malformed JSON is rejected safely.
- Unknown characters, invalid relationships, invalid gate rules, negative materials, and over-cap upgrade levels are filtered or clamped during loading.
- Missing optional arrays default to empty collections.
- Stage indexes are clamped to the current number of authored stages.
- Saving and loading failures produce an in-game notice instead of crashing the race loop.
- Nested values are sanitized rather than trusted merely because the top-level schema version is valid.

The implementation lives in `src/gameplay/gamePersistence.ts`. Manager-level `loadState` or `loadSnapshot` methods keep validation close to the systems that own the data, which will make future schema migrations safer.

## Remaining persistence work

This is a local browser prototype contract, not a final mobile save system. The explicit schema boundary is ready for future migration functions. Later work should add a user-visible save-slot policy, cloud or platform storage only if required, stronger corruption diagnostics, and tests for every future schema version.

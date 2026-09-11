# Phase 19 — Encounter Density Audit

The 60-character roster has broad coverage, but coverage alone does not guarantee a readable game. This audit checks whether encounter definitions point to real characters and whether stage or region presentation could become overloaded.

## Automated checks

`src/story/encounterDensityAudit.ts` reports:

- total encounter definitions
- encounter counts by region
- encounter counts by stage
- world-time-only contacts
- invalid character IDs
- duplicate non-repeatable character encounters
- regions above the soft density limit
- stages above the soft density limit

The current soft limits are eight regional contacts and seven stage contacts. They are review thresholds, not permanent design laws; a future playtest may justify changing them.

## Validation

- Every current encounter points to a roster character.
- No character has duplicate non-repeatable encounter definitions.
- No region or stage exceeds its current soft limit.
- World-time-only contacts exist, preventing all social content from being tied to one location.

This audit complements the 60-character balance audit. It does not replace playtesting the order, frequency, emotional importance, or readability of encounters.

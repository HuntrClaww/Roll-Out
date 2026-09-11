# Character Roster Balance Audit — 60 Characters

The 60-character roster was reviewed before beginning Batch 04.

## Audit checks

- Every character ID is unique.
- All 60 characters have visual identity profiles.
- At least 30 characters have an encounter path.
- At least 15 characters have dialogue scenes.
- At least 10 characters have practical services.
- The boss count remains at five.
- Background, friend, and acquaintance roles remain present so the roster is not dominated by high-attention figures.
- No more than 12 characters may lack all of encounter, dialogue, or service discoverability.

## Correction made during the audit

The first audit found 18 characters without any encounter, dialogue, or service path. Rather than weakening the standard, seven Batch 03 characters received lightweight regional discovery routes:

- Pebble Prince
- Salt Analog
- Rail Bell
- Cogline
- Ice Thread
- Morrow Mint
- Pocket Storm

These are deliberately simple recurring discovery paths. They do not create mandatory quest clutter or force every character into a major story role.

## Current result

The audit now passes with 60 unique characters, full visual coverage, sufficient encounter coverage, dialogue coverage, service coverage, five bosses, and an acceptable number of background characters without direct interaction paths.

The automated audit lives in `src/story/contentBalanceAudit.ts` and should be run again after every future character batch.

# Phase 19 — Progression Readiness Audit

## Purpose

This audit checks whether the data-defined campaign can actually expose the preparation challenges required by each boss gate. It is intended to catch impossible progression before content expansion or playtesting.

## Issue found and corrected

`null-echo` required both a duel and a checkpoint preparation trial for Rift Echelon, but its stage definition only offered `boss-challenge` and `duel`. A player could therefore never complete the checkpoint requirement through normal stage encounters.

The stage now offers:

```text
duel → checkpoint → boss-challenge
```

The exact order is data-driven and can cycle according to encounter level, but all required rules are now available.

## Automated checks

`src/gameplay/progressionReadinessAudit.ts` now verifies:

- stage IDs are unique
- every boss gate references an existing stage
- every boss preparation rule is offered by that stage
- every stage offers a boss challenge
- every stage rule has a `ChallengeSystem` template
- difficulty does not decrease across the campaign
- reward multipliers do not decrease across the campaign
- boss names are unique across stages
- a progression simulation produces every required preparation rule from the stage encounter sequence
- a sequential-clear simulation advances through every stage without losing the unlock frontier
- a failed preparation, partial save, and resumed preparation sequence still unlocks each boss correctly

Missing gate or challenge coverage is treated as an error. Difficulty, reward, and boss-name issues are currently warnings so future design experiments can be reviewed rather than silently rejected.

## Validation

- Focused progression audit: passed
- Encounter-rule reachability simulation: passed
- Sequential progression simulation: passed
- Failed/partial-save/resumed-gate simulation: passed
- Boss gate tests: passed
- TypeScript type-check: passed
- Production build: passed

## Remaining Phase 19 work

The static data audit and boss-gate simulations are now complete. Remaining work is actual playable race-loop testing, challenge fairness tuning, physics edge-case review, save/load during more game states, accessibility checks, and team-battle tie/retry behaviour under real play conditions.

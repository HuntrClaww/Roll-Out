# Boss Challenge Gates — Batch 01

Boss races are no longer treated as ordinary stage wins. Each boss has a preparation gate that must be completed first. A preparation loss does not erase earlier completed requirements, and a preparation win keeps the player in the current stage so the newly available boss can be attempted.

| Stage | Boss | Required preparation |
|---|---|---|
| Intro Gate | Aether Sovereign | Complete a checkpoint route |
| Ash Crest | Cinder Axis | Win a duel |
| Frost Veil | Glacier Sigil | Complete a checkpoint route and win a duel |
| Null Echo | Rift Echelon | Win a duel and complete a checkpoint route |
| Convergence Circuit | The Circuit Steward | Demonstrate team coordination in a team battle |

The active implementation is in `src/gameplay/bossChallengeProgression.ts`. The gate manager records only successful preparation challenges, does not require exact timing, and exposes a player-facing explanation for the remaining requirement. Boss biographies and boss-defeat rewards are recorded only after the boss challenge itself is won.

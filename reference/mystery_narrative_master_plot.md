# Roll-Out: Master Mystery Plot

**Status:** Design document. Ties the existing `MYSTERY_THREADS` / `MYSTERY_REACTIONS`
system (`src/story/mysteryConvergence.ts`), the existing lore entries
(`src/story/loreFoundation.ts`), and the existing boss biographies
(`src/story/bossBiographies.ts`) into one coherent, funny, slow-burn plot.
Nothing here contradicts existing canon — it's the connective tissue that
was implied but never written down in one place.

---

## 1. Tone contract (read this before writing any story content)

This is a **comedy mystery**, not a thriller. The feeling to aim for is
*"Wait... wait a minute... okay WHAT"* — delighted disbelief — never dread.
A few load-bearing rules:

- **Nothing in this mystery is malicious.** No villain, no cover-up with
  bad intent, no danger to the player. The "creators" are absent, not evil.
  Anything that looks ominous on first read (an unstable route, a phase
  shift, a checkpoint out of order) turns out to have a mundane,
  faintly ridiculous explanation.
- **The protagonist stays themselves.** `character.protagonist` is already
  defined as "cheerful, laid-back, curious, funny, quietly persistent" —
  every mystery beat must be written through that lens. This is not a
  character who unravels. They get *more* delighted as things get weirder,
  not less stable.
- **Static carries the suspicion arc.** `character.static` is already
  defined as "gradually suspicious of impossible calculations," with an
  established deadpan voice ("Your recovery pattern is statistically
  untidy... Please continue moving. Preferably in a direction that does
  not destroy the evidence."). Static is the analytical half of every
  realization beat; the protagonist is the emotional/comedic half. Neither
  carries the mystery alone — the two of them bouncing off each other
  *is* the mechanism.
- **Clues are disguised as boring.** A badly painted sign
  (`lore.maintenance-label`, already tagged `delivery: "comedy"`), a
  scoreboard, a checkpoint stamp, a maintenance form — never a glowing
  rune or a prophecy. The existing lore already does this correctly;
  match its register.
- **Contradictions stay contradictions.** The mystery system already
  refuses to resolve to one confirmed answer (`convergenceReady` never
  produces a single "truth," and `getMysteryArchiveBody` explicitly says
  "no single explanation has been confirmed"). Do not write a scene that
  closes the loop definitively. The fun is in the fit, not the reveal.

---

## 2. The hidden answer (for writers/devs only — never state this outright in-game)

Every existing clue already points the same direction; this just names it:

> **The racing world is an extremely ambitious, deeply unfinished passion
> project that never shipped, and everyone in it has been unknowingly
> living inside its ongoing, informal quality-assurance process.**

The "creators" started building something big — routes, factions,
finish-line logic, weather systems — and then, for reasons the game
never confirms (ran out of time? got reassigned? are still "iterating"
somewhere off-screen?), stopped finishing it. What they left behind kept
half-running on its own: routes patch themselves, finish lines appear
wherever the incomplete system currently thinks a race *should* end,
and racing itself is the closest thing the world has to a self-test —
which is why the urge to race feels like passion to everyone doing it,
because on some level it *is* the world checking that its systems still
work, using racers who have long since stopped being just test data and
started being people with rivalries and snack preferences.

This single idea resolves all five threads at once, while leaving every
one of them genuinely undecided — which is the point:

| Thread | How the hidden answer fits | Why it stays a live question |
|---|---|---|
| **Finish-Line Network** | Unusual finish lines are the unfinished build's own "where should this task end" markers, firing in the wrong places because the process was interrupted mid-write. | Is that comforting (it's just a bug) or unsettling (something is still deciding where your races end)? Never resolved. |
| **The Unfinished Creators** | They really did leave it unfinished. | Accident, or "we'll fix it in post" that became permanent culture? Both readings stay valid — this is the existing `lore.creator-traces` / `lore.maintenance-label` contradiction, kept alive on purpose. |
| **The Urge to Move** | Racing is inherited test-loop behavior from the prototype phase. | Does that make it less real? The protagonist's answer, eventually, is a shrug and "feels real to me" — never resolved analytically, resolved emotionally. |
| **The Worlds Disagree** | Regions are running slightly different, asynchronously-patched versions of the same build. Every faction is seeing a real, valid layer — just not the same one. | Nobody is lying. Nobody is right either. This is why `Nettle Judge`'s reactive line ("I am filing both as accurate") already lands exactly right. |
| **The Moving Route** | Unstable routes are live hotfixes being applied while racers are still on them — a workplace-safety-violation-grade coincidence, not a threat. | Failing, adapting, or remembering an old version? All three, depending on which patch you're standing on. |

**Every boss's unique ability is a genuine creator-era tool, personally
adapted through years of individual practice** — this is already true in
every single existing biography (Aether's aether-thread frame, Cinder
Axis's heat-adapted shell, Glacier Sigil's recovered frost-sigil core,
Rift Echelon's veil-thread modification, and Circuit Steward's outright
stated "creator-era coordination device... meant for maintenance crews,
not combat"). Nothing new needs inventing here — the master answer was
already fully seeded across five separate biographies written
independently of each other. That consistency is itself a clue worth
having Static notice out loud, late.

---

## 3. Act structure (mapped to the five existing stages)

The mystery must be **invisible at Intro Gate, and undeniable by
Convergence Circuit.** Evidence density should roughly follow the
existing thread `minimumEvidence` values (2–3 pieces per thread) — this
structure just decides *when* those pieces land.

### Act 1 — Intro Gate (Aether Sovereign): "Huh, weird flex, but okay"
The player's only exposure is `lore.finish-line-patterns` (mandatory) and
the `reaction.aether-open-sky` line after the boss fight. Nothing reads
as a mystery yet — it reads as one (1) odd finish line and a boss with a
poetic turn of phrase. Static says nothing suspicious yet; this is
deliberate. The comedy here is purely ambient (Rift Echelon's knight
already glitching mid-sentence, Ghost Lap's loop) — background flavor,
not yet "clues."

### Act 2 — Ash Crest (Cinder Axis): "Okay that's twice now"
`lore.urge-to-move` and the `reaction.cinder-weight` line land here. This
is the first point where a **Recall Beat** should fire (see §5) —
Static quietly lines up Aether's finish-line comment next to Cinder
Axis's movement comment and notes, deadpan, that they don't obviously
belong in the same conversation, and yet somehow do. Player reaction:
mild amusement, not alarm. `lore.maintenance-label` (optional, comedic)
is best surfaced somewhere in this act too — a badly painted sign is the
first "hidden in plain sight" object, and it should read as pure comic
relief on first encounter, only becoming a clue in hindsight.

### Act 3 — Frost Veil (Glacier Sigil): "Wait, hold on"
`lore.creator-traces` and `reaction.glacier-mark` land here — this is
the thread that first says the word "creators" out loud. A second,
slightly more pointed Recall Beat fires, now pulling in all three prior
reactions. This is the first time Static uses the word "pattern" instead
of "coincidence." Still funny, not tense — the humor shifts from ambient
to pointed (the characters are now visibly noticing what the player has
been noticing).

### Act 4 — Null Echo (Rift Echelon): "This isn't ONE weird thing, is it"
`lore.race-before-answer` and `reaction.rift-double-answer` land here,
plus `lore.rival-system-view` is a strong fit for this act (a rival being
completely blasé about something that should be alarming is a great
comedic beat, and Null Veil's whole faction identity is "things are
unstable and everyone's fine with it"). This is the emotional turn: the
protagonist starts *actively* trying to make the pieces fit, out loud,
to Static, and gets it slightly wrong in a funny way before Static
corrects one detail. Not a breakdown — an enthusiastic, slightly
over-caffeinated theory session.

### Act 5 — Convergence Circuit (The Circuit Steward): the crashout
`reaction.circuit-order` lands, `convergenceReady` becomes true (3+
threads supported, 3+ bosses defeated is already achievable well before
this point, so by here it's near-certain), and this is where the full
**Recall Cascade** (§5, final beat) fires — the comedic climax described
in §6. The Circuit Steward, a literal checkpoint clerk who solved chaos
through paperwork, is the perfect boss to have this land on: the "big
mystical reveal" turns out to be filed correctly in a drawer somewhere,
which is the joke.

---

## 4. Hidden-in-plain-sight running gags

Concrete, reusable background details — sprinkle these across tracks,
HUD flavor text, and idle NPC lines. Each is disguised as scenery first,
payoff later. None of these require new systems; they're writing/asset
notes for whoever authors environment text and cutscene dialogue.

1. **The badly painted sign.** `lore.maintenance-label` already exists
   as a single lore entry — treat it as a *recurring* visual motif, not
   a one-off. The same clumsy handwriting and the same unfamiliar mark
   should reappear near several unrelated oddities across multiple
   tracks, always looking like it was left by a bored maintenance worker,
   never by anything grand.
2. **Knight Tide and Salt Ward.** Already seeded in this session's
   dialogue pass: "Salt Ward keeps to itself. We are not part of the five
   gates, and we prefer it that way." An unexplained sixth faction that
   nobody asks about is exactly the kind of loose thread that should
   stay unresolved through the whole main arc — a great hook for a
   future stage or epilogue, not something to pay off here.
3. **Scoreboards that look like debug consoles.** Never state this
   outright; just have environment art/flavor text describe scoreboards
   in slightly too-technical language ("displays a running count," "resets
   on a fixed interval") so that in hindsight, once the player has the
   hidden answer in mind, it reads as obviously a diagnostic tool.
4. **Ghost Lap's loop.** Already exists (`npc.ghost-lap`: "We are
   approaching the final turn again. I am sure this time will be
   different. I have been sure many times.") — this NPC should be framed,
   post-mystery, as someone stuck in what is essentially a broken test
   iteration that never terminated. Comedic, not tragic — Ghost Lap is
   in good spirits about it.
5. **Rival blasé-ness.** `lore.rival-system-view`'s existing angle (a
   rival thinks dimensional finish lines are just how tracks work) should
   recur: rivals in general are the funniest mouthpiece for "this should
   be alarming and isn't," precisely because they have no stake in
   figuring it out.

---

## 5. The Recall Cascade (flashback mechanic)

### Design intent
When the player hears something important late in the game, they should
be able to be shown — not told — that it connects to something said
much earlier, in the exact words used at the time. This is a **callback**
mechanic, not a memory/trauma mechanic: it reuses the game's own already-
written lines, resurfaced together, with new connective narration from
Static and the protagonist bridging them.

### How it fits the existing architecture
This mirrors `MYSTERY_REACTIONS` / `getMysteryReactionArchiveEntries`
exactly (same file, same pattern, same persistence-in-archive treatment
established this session) — a `RecallCascadeBeat` is a small data record
with a trigger condition and a script; `getAvailableRecallCascade(...)`
is a pure function selecting eligible unshown beats from a progress
snapshot, exactly like `getAvailableMysteryReactions`. This keeps it
consistent with a system that already works and is already tested,
rather than introducing new machinery.

### The three beats

**Recall Beat 1 — "That's twice now" (fires after Cinder Axis, Act 2)**
> *[Static, flat]* "Cross-referencing your last two boss debriefs."
> *[quotes `reaction.aether-open-sky`]* "'It looks as if it has been
> waiting for a racer to notice it.'"
> *[quotes `reaction.cinder-weight`]* "'Movement is learned as much as
> it is felt.'"
> *[Static]* "These are not the same sentence. I would like it noted that
> they are also not *not* the same sentence."
> *[Protagonist]* "...huh. Weird flex, but okay!"

**Recall Beat 2 — "Okay, hold on" (fires after Glacier Sigil, Act 3)**
> *[Static]* "Adding a third data point." *[quotes
> `reaction.glacier-mark`]* "'Someone expected the ice to move.'"
> *[Static]* "Someone. Expected. That is a plan. Plans have planners."
> *[Protagonist]* "Wait, wait, hold on — are you saying someone's just...
> out there, doing this on purpose?"
> *[Static]* "I am saying the word 'someone' appeared in my notes
> unprompted, and I do not like that it did."

**Recall Beat 3 — the crashout (fires at endgame convergence, Act 5)**
See §6 for the full scene. All five reactions quoted in sequence, landing
on the "wait — wait a minute — but then — arrgh, you know what, never
mind — I guess it's making sense now — WHAT" beat the design brief asked
for, delivered by the protagonist, with Static supplying the one
completely calm, completely deflating line that ends it.

### Implementation note
This document deliberately stops at the design/script level. Whether to
wire this up as real code this session (a `RecallCascadeBeat` array plus
a pure selector function, following the `MYSTERY_REACTIONS` pattern
exactly) or treat it as a script for a future content pass is a call
that depends on how much more system-building is wanted right now versus
locking in the story shape first. The hooks it would need
(`defeatedBossIds`, thread statuses, a `shownBeatIds` list) already exist
in `MysteryProgressSnapshot` and `StoryManager`, so implementing it later
is a small, well-contained addition whenever it's wanted — nothing here
blocks on it.

---

## 6. The climax scene (full script)

Fires once all five bosses are defeated and the mystery threads have
converged. The Circuit Steward has just been beaten. This plays instead
of (or immediately after) `reaction.circuit-order`.

> *[Static, reading off five debriefs in a row, completely level]*
> "Compiling. One: a finish line that waited to be noticed. Two:
> movement that is learned as much as felt. Three: someone who expected
> the ice to move. Four: a route that has not decided whether it failed
> or adapted. Five: an order beneath the confusion, authored by an
> unspecified party."
>
> *[Protagonist]* "Okay but those are all just — those are just things
> people said. Cool moody racer things. Racers say cool moody things,
> that's a whole genre—"
>
> *[Static]* "I am aware. I catalogued four hundred and twelve other cool
> moody things this season. These five were not like the others."
>
> *[Protagonist]* "Wait — wait a minute — no, hold on, wait—"
>
> *[Static]* "Take your time."
>
> *[Protagonist]* "—wait, so if the finish line was WAITING, and the ice
> guy KNEW the ice would move, and the route guy's route DIDN'T KNOW if
> it was broken or just — updating — then that means — no wait, that
> doesn't — augh, okay, never mind, forget I—"
>
> *[Static]* "You are welcome to stop."
>
> *[Protagonist]* "No — no, wait — OH. Oh no. OH NO. Static. Static, are
> we the test data."
>
> *[Static, after a pause exactly long enough to be devastating]*
> "I filed a similar hypothesis under 'comedy' four stages ago. I would
> like the record to show I was ahead of you."
>
> *[Protagonist]* "That's — okay, that's — WHAT. That's — okay, I need a
> minute. I need to sit with 'we are technically a QA process' for a
> minute. Does this mean my snack preferences aren't real."
>
> *[Static]* "Your snack preferences are extremely real. I have logged
> them. Extensively. Against my will."
>
> *[Protagonist, slowly grinning]* "...okay. Okay! Cool! Love that for
> us. Anyway — same time next race?"

This is the "crashout" the design brief asked for: escalating, funny,
briefly overwhelmed, and landing on acceptance-through-humor rather than
dread. Nothing is resolved. Static's "I was ahead of you" is the whole
payoff — the mystery was solvable the entire time, sitting in a comedy
tag, in plain sight, which is the joke the whole document has been
building toward.

---

## 7. What this document does and doesn't do

**Does:** gives every future writer a single, consistent answer to work
from; explains why every boss ability already made sense together; gives
Static and the protagonist a clear job in the mystery; locks the tone so
nobody accidentally writes this as a horror beat later; provides ready-
to-use script for the three Recall Cascade beats and the climax.

**Doesn't:** implement the Recall Cascade in code (see §5's implementation
note — small and ready to build whenever wanted); rewrite any existing
lore, biography, or reaction (everything here is additive); commit to a
literal in-game confirmation of the hidden answer (per §1, it should
never be stated outright — the closest any character gets is Static's
"I filed a similar hypothesis," which is a joke, not a confirmation).

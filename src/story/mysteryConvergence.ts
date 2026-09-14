import { BOSS_BIOGRAPHIES } from "./bossBiographies";
import { LORE_ENTRIES } from "./loreFoundation";

export type MysteryThreadId =
  | "finish-line-network"
  | "creator-intent"
  | "movement-impulse"
  | "world-disagreement"
  | "route-instability";

export type MysteryThreadStatus = "unseen" | "hinted" | "supported" | "converging";

export interface MysteryThread {
  id: MysteryThreadId;
  title: string;
  question: string;
  evidenceLoreIds: string[];
  evidenceBossIds: string[];
  /** A thread may remain interpretable after its evidence threshold is met. */
  minimumEvidence: number;
}

export interface MysteryProgressSnapshot {
  discoveredLoreIds: string[];
  defeatedBossIds: string[];
  factionStandingBands?: Record<string, string>;
}

export interface MysteryThreadProgress extends MysteryThread {
  discoveredEvidenceIds: string[];
  evidenceCount: number;
  status: MysteryThreadStatus;
}

export interface MysteryConvergence {
  threads: MysteryThreadProgress[];
  totalEvidenceCount: number;
  unresolvedQuestions: string[];
  contradictions: string[];
  convergenceReady: boolean;
}

export interface MysteryReaction {
  id: string;
  title: string;
  requiredBossId: string;
  requiredThreadId: MysteryThreadId;
  line: string;
}

export const MYSTERY_THREADS: MysteryThread[] = [
  {
    id: "finish-line-network",
    title: "The Finish-Line Network",
    question: "Are unusual finish lines connecting existing tracks, or selecting where a race is allowed to end?",
    evidenceLoreIds: ["lore.finish-line-patterns", "lore.maintenance-label", "lore.rival-system-view"],
    evidenceBossIds: ["boss.aether-sovereign", "boss.circuit-steward"],
    minimumEvidence: 2,
  },
  {
    id: "creator-intent",
    title: "The Unfinished Creators",
    question: "Did the original creators leave the world unfinished by accident, or did they design room for change?",
    evidenceLoreIds: ["lore.creator-traces", "lore.maintenance-label"],
    evidenceBossIds: ["boss.glacier-sigil", "boss.circuit-steward"],
    minimumEvidence: 2,
  },
  {
    id: "movement-impulse",
    title: "The Urge to Move",
    question: "Is racing a choice made by living racers, a property of the orb-body, or a response to the world itself?",
    evidenceLoreIds: ["lore.urge-to-move", "lore.race-before-answer"],
    evidenceBossIds: ["boss.cinder-axis", "boss.rift-echelon"],
    minimumEvidence: 2,
  },
  {
    id: "world-disagreement",
    title: "The Worlds Disagree",
    question: "When factions describe the same route differently, are they mistaken, or are they each seeing a valid layer?",
    evidenceLoreIds: ["lore.rival-system-view", "lore.finish-line-patterns", "lore.creator-traces"],
    evidenceBossIds: ["boss.glacier-sigil", "boss.rift-echelon"],
    minimumEvidence: 3,
  },
  {
    id: "route-instability",
    title: "The Moving Route",
    question: "Are unstable routes failing, adapting, or remembering an older configuration?",
    evidenceLoreIds: ["lore.creator-traces", "lore.finish-line-patterns", "lore.race-before-answer"],
    evidenceBossIds: ["boss.rift-echelon", "boss.circuit-steward"],
    minimumEvidence: 3,
  },
];

/** Short post-boss reactions keep victories personal without turning bosses into exposition machines. */
export const MYSTERY_REACTIONS: MysteryReaction[] = [
  {
    id: "reaction.aether-open-sky",
    title: "A route the sky remembers",
    requiredBossId: "boss.aether-sovereign",
    requiredThreadId: "finish-line-network",
    line: "The next finish line does not look nearer. It looks as if it has been waiting for a racer to notice it.",
  },
  {
    id: "reaction.cinder-weight",
    title: "Preparation leaves a shape",
    requiredBossId: "boss.cinder-axis",
    requiredThreadId: "movement-impulse",
    line: "Cinder Axis's records suggest that movement is learned as much as it is felt.",
  },
  {
    id: "reaction.glacier-mark",
    title: "A mark beneath the thaw",
    requiredBossId: "boss.glacier-sigil",
    requiredThreadId: "creator-intent",
    line: "Beneath the old route is a newer mark, carefully placed where someone expected the ice to move.",
  },
  {
    id: "reaction.rift-double-answer",
    title: "Two routes, one arrival",
    requiredBossId: "boss.rift-echelon",
    requiredThreadId: "route-instability",
    line: "The route has not decided whether it failed or adapted. Both explanations still fit the evidence.",
  },
  {
    id: "reaction.circuit-order",
    title: "The schedule underneath",
    requiredBossId: "boss.circuit-steward",
    requiredThreadId: "world-disagreement",
    line: "The League's records reveal an order beneath the confusion, but not who—or what—wrote it.",
  },
];

const validLoreIds = new Set(Object.keys(LORE_ENTRIES));
const validBossIds = new Set(BOSS_BIOGRAPHIES.map((biography) => biography.bossId));

export const evaluateMysteryConvergence = (snapshot: MysteryProgressSnapshot): MysteryConvergence => {
  const discoveredLoreIds = new Set((snapshot.discoveredLoreIds ?? []).filter((id) => validLoreIds.has(id)));
  const defeatedBossIds = new Set((snapshot.defeatedBossIds ?? []).filter((id) => validBossIds.has(id)));
  const threads = MYSTERY_THREADS.map((thread): MysteryThreadProgress => {
    const discoveredEvidenceIds = [
      ...thread.evidenceLoreIds.filter((id) => discoveredLoreIds.has(id)),
      ...thread.evidenceBossIds.filter((id) => defeatedBossIds.has(id)),
    ];
    const evidenceCount = discoveredEvidenceIds.length;
    const status: MysteryThreadStatus = evidenceCount === 0
      ? "unseen"
      : evidenceCount < thread.minimumEvidence
        ? "hinted"
        : evidenceCount === thread.minimumEvidence
          ? "supported"
          : "converging";
    return { ...thread, discoveredEvidenceIds, evidenceCount, status };
  });

  const totalEvidenceCount = threads.reduce((total, thread) => total + thread.evidenceCount, 0);
  const supportedThreads = threads.filter((thread) => thread.evidenceCount >= thread.minimumEvidence);
  const unresolvedQuestions = threads
    .filter((thread) => thread.status !== "converging")
    .map((thread) => thread.question);
  const contradictions: string[] = [];
  if (discoveredLoreIds.has("lore.rival-system-view") && discoveredLoreIds.has("lore.finish-line-patterns")) {
    contradictions.push("One account calls the finish-line behaviour ordinary while another records it as an impossible connection.");
  }
  if (discoveredLoreIds.has("lore.creator-traces") && defeatedBossIds.has("boss.circuit-steward")) {
    contradictions.push("Creator markings appear unfinished, but the coordination system still responds as if its routes have an intended order.");
  }

  return {
    threads,
    totalEvidenceCount,
    unresolvedQuestions,
    contradictions,
    convergenceReady: supportedThreads.length >= 3 && defeatedBossIds.size >= 3,
  };
};

const STATUS_RANK: Record<MysteryThreadStatus, number> = { unseen: 0, hinted: 1, supported: 2, converging: 3 };

export const getAvailableMysteryReactions = (
  snapshot: MysteryProgressSnapshot,
  shownReactionIds: string[] = [],
): MysteryReaction[] => {
  const convergence = evaluateMysteryConvergence(snapshot);
  const shown = new Set(shownReactionIds);
  return MYSTERY_REACTIONS.filter((reaction) => {
    if (shown.has(reaction.id)) return false;
    if (!snapshot.defeatedBossIds.includes(reaction.requiredBossId)) return false;
    const thread = convergence.threads.find((candidate) => candidate.id === reaction.requiredThreadId);
    return thread !== undefined && STATUS_RANK[thread.status] >= STATUS_RANK.supported;
  });
};

export interface RecallCascadeBeat {
  id: string;
  title: string;
  /** All of these bosses must be defeated for this beat to become available. */
  requiredBossIds: string[];
  /** The scripted callback — see reference/mystery_narrative_master_plot.md §5. */
  script: string[];
}

/**
 * "Recall Cascade" beats resurface earlier MYSTERY_REACTIONS lines verbatim
 * alongside new connective narration, so the player is shown — not told —
 * that something said early on connects to something said much later. Design
 * source: reference/mystery_narrative_master_plot.md. Ordered earliest to
 * latest; each requires strictly more bosses defeated than the last, so they
 * naturally unlock in sequence across the game's five stages.
 */
export const RECALL_CASCADE_BEATS: RecallCascadeBeat[] = [
  {
    id: "recall.thats-twice-now",
    title: "That's twice now",
    requiredBossIds: ["boss.aether-sovereign", "boss.cinder-axis"],
    script: [
      "Static: Cross-referencing your last two boss debriefs.",
      "Static: \"It looks as if it has been waiting for a racer to notice it.\"",
      "Static: \"Movement is learned as much as it is felt.\"",
      "Static: These are not the same sentence. I would like it noted that they are also not NOT the same sentence.",
      "Protagonist: ...huh. Weird flex, but okay!",
    ],
  },
  {
    id: "recall.okay-hold-on",
    title: "Okay, hold on",
    requiredBossIds: ["boss.aether-sovereign", "boss.cinder-axis", "boss.glacier-sigil"],
    script: [
      "Static: Adding a third data point. \"Someone expected the ice to move.\"",
      "Static: Someone. Expected. That is a plan. Plans have planners.",
      "Protagonist: Wait, wait, hold on — are you saying someone's just... out there, doing this on purpose?",
      "Static: I am saying the word \"someone\" appeared in my notes unprompted, and I do not like that it did.",
    ],
  },
  {
    id: "recall.the-crashout",
    title: "The Crashout",
    requiredBossIds: [
      "boss.aether-sovereign",
      "boss.cinder-axis",
      "boss.glacier-sigil",
      "boss.rift-echelon",
      "boss.circuit-steward",
    ],
    script: [
      "Static: Compiling. One: a finish line that waited to be noticed. Two: movement that is learned as much as felt. Three: someone who expected the ice to move. Four: a route that has not decided whether it failed or adapted. Five: an order beneath the confusion, authored by an unspecified party.",
      "Protagonist: Okay but those are all just — those are just things people said. Cool moody racer things. Racers say cool moody things, that's a whole genre—",
      "Static: I am aware. I catalogued four hundred and twelve other cool moody things this season. These five were not like the others.",
      "Protagonist: Wait — wait a minute — no, hold on, wait—",
      "Static: Take your time.",
      "Protagonist: —wait, so if the finish line was WAITING, and the ice guy KNEW the ice would move, and the route guy's route DIDN'T KNOW if it was broken or just — updating — then that means — no wait, that doesn't — augh, okay, never mind, forget I—",
      "Static: You are welcome to stop.",
      "Protagonist: No — no, wait — OH. Oh no. OH NO. Static. Static, are we the test data.",
      "Static: I filed a similar hypothesis under \"comedy\" four stages ago. I would like the record to show I was ahead of you.",
      "Protagonist: That's — okay, that's — WHAT. That's — okay, I need a minute. I need to sit with \"we are technically a QA process\" for a minute. Does this mean my snack preferences aren't real.",
      "Static: Your snack preferences are extremely real. I have logged them. Extensively. Against my will.",
      "Protagonist: ...okay. Okay! Cool! Love that for us. Anyway — same time next race?",
    ],
  },
];

const validBossIdsForRecall = new Set(BOSS_BIOGRAPHIES.map((biography) => biography.bossId));

/**
 * Returns Recall Cascade beats whose required bosses are all defeated and
 * that haven't been shown yet, earliest-eligible first (mirrors
 * getAvailableMysteryReactions).
 */
export const getAvailableRecallCascadeBeats = (
  defeatedBossIds: string[],
  shownBeatIds: string[] = [],
): RecallCascadeBeat[] => {
  const defeated = new Set(defeatedBossIds.filter((id) => validBossIdsForRecall.has(id)));
  const shown = new Set(shownBeatIds);
  return RECALL_CASCADE_BEATS.filter((beat) => {
    if (shown.has(beat.id)) return false;
    return beat.requiredBossIds.every((bossId) => defeated.has(bossId));
  });
};

export interface RecallCascadeArchiveEntry {
  title: string;
  body: string;
}

/** Persists shown Recall Cascade beats in the Lore Archive, same treatment as getMysteryReactionArchiveEntries. */
export const getRecallCascadeArchiveEntries = (shownBeatIds: string[]): RecallCascadeArchiveEntry[] => {
  const shown = new Set(shownBeatIds);
  return RECALL_CASCADE_BEATS
    .filter((beat) => shown.has(beat.id))
    .map((beat) => ({ title: beat.title, body: beat.script.join("\n") }));
};

export interface MysteryReactionArchiveEntry {
  title: string;
  body: string;
}

/**
 * Post-boss reactions are earned once and previously only surfaced through a
 * transient story notice. This makes them a durable, reviewable archive
 * entry so a player who missed or forgot the notice can still read it later.
 */
export const getMysteryReactionArchiveEntries = (
  completedReactionIds: string[],
): MysteryReactionArchiveEntry[] => {
  const completed = new Set(completedReactionIds);
  return MYSTERY_REACTIONS
    .filter((reaction) => completed.has(reaction.id))
    .map((reaction) => ({ title: reaction.title, body: reaction.line }));
};

export const getMysteryArchiveBody = (convergence: MysteryConvergence): string => {
  const threadLines = convergence.threads.map((thread) => {
    const status = thread.status.charAt(0).toUpperCase() + thread.status.slice(1);
    return `${thread.title} — ${status} (${thread.evidenceCount} evidence): ${thread.question}`;
  });
  const contradictionText = convergence.contradictions.length > 0
    ? `\n\nContradictions preserved:\n${convergence.contradictions.map((item) => `• ${item}`).join("\n")}`
    : "\n\nNo direct contradiction has been recorded yet. The archive remains open to competing explanations.";
  const readiness = convergence.convergenceReady
    ? "\n\nSeveral threads are converging, but no single explanation has been confirmed."
    : "\n\nThe pattern is incomplete. Further races, conversations, and biographies may change how these clues fit together.";
  return `${threadLines.join("\n")}\n\n${convergence.totalEvidenceCount} thread-evidence links recorded.${contradictionText}${readiness}`;
};

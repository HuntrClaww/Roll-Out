export type LoreDeliveryMethod = "conversation" | "boss" | "rival" | "environment" | "accident" | "comedy" | "contradiction";
export type StoryEventKind = "race-finished" | "discovery" | "conversation" | "world-change";

export interface LoreEntry {
  id: string;
  title: string;
  summary: string;
  delivery: LoreDeliveryMethod;
  optional: boolean;
  clueTags: string[];
}

export interface FlexibleTimeWindow {
  /** Earliest time at which the event may appear. */
  opensAtSeconds: number;
  /** Latest preferred time; expiry must never permanently block optional content. */
  closesAtSeconds?: number;
  /** Player-facing response time once the event appears. */
  responseWindowSeconds: number;
}

export interface StoryEvent {
  id: string;
  kind: StoryEventKind;
  title: string;
  description: string;
  loreEntryIds: string[];
  timeWindow: FlexibleTimeWindow;
  optional: boolean;
  requiredStageId?: string;
  requiredWin?: boolean;
}

export interface StoryCharacter {
  id: string;
  name: string;
  role: "protagonist" | "guide" | "boss" | "rival" | "creator-group";
  personalityNotes: string[];
}

export const LORE_ENTRIES: Record<string, LoreEntry> = {
  "lore.finish-line-patterns": {
    id: "lore.finish-line-patterns",
    title: "The Finish-Line Pattern",
    summary: "Some finish lines appear to connect races to places no ordinary track should reach.",
    delivery: "environment",
    optional: false,
    clueTags: ["finish-lines", "dimensions", "mystery"],
  },
  "lore.urge-to-move": {
    id: "lore.urge-to-move",
    title: "The Urge to Move",
    summary: "Racers disagree about whether their need to keep moving is instinct, culture, machinery, or something else.",
    delivery: "conversation",
    optional: false,
    clueTags: ["movement", "orb-nature", "mystery"],
  },
  "lore.creator-traces": {
    id: "lore.creator-traces",
    title: "Creator Traces",
    summary: "Old markings and unfinished systems suggest that important parts of the racing worlds were designed by ordinary creators.",
    delivery: "environment",
    optional: true,
    clueTags: ["creators", "old-tracks", "unfinished"],
  },
  "lore.maintenance-label": {
    id: "lore.maintenance-label",
    title: "A Helpful Old Sign",
    summary: "A badly painted direction sign uses the same unfamiliar mark found near several unusual finish lines.",
    delivery: "comedy",
    optional: true,
    clueTags: ["finish-lines", "creators", "comedy"],
  },
  "lore.rival-system-view": {
    id: "lore.rival-system-view",
    title: "That Is Just How Tracks Work",
    summary: "A rival considers dimensional finish lines ordinary and sees no reason to investigate them.",
    delivery: "rival",
    optional: false,
    clueTags: ["rivals", "finish-lines", "worldview"],
  },
  "lore.race-before-answer": {
    id: "lore.race-before-answer",
    title: "Race First",
    summary: "An influential racer offers one useful direction after a challenge, but leaves the larger question unanswered.",
    delivery: "boss",
    optional: false,
    clueTags: ["bosses", "racing", "mystery"],
  },
};

export const STORY_CHARACTERS: Record<string, StoryCharacter> = {
  "character.protagonist": {
    id: "character.protagonist",
    name: "The Main Character",
    role: "protagonist",
    personalityNotes: ["cheerful", "laid-back", "curious", "funny", "quietly persistent"],
  },
  "character.static": {
    id: "character.static",
    name: "Static",
    role: "guide",
    personalityNotes: ["observant", "analytical", "gradually suspicious of impossible calculations"],
  },
};

export const STORY_EVENTS: StoryEvent[] = [
  {
    id: "event.first-finish-anomaly",
    kind: "race-finished",
    title: "A Finish Line That Wasn't There Before",
    description: "Static records an inconsistency after a completed race and quietly begins comparing finish-line behavior.",
    loreEntryIds: ["lore.finish-line-patterns"],
    timeWindow: { opensAtSeconds: 3, responseWindowSeconds: 8 },
    optional: false,
    requiredStageId: "intro-gate",
    requiredWin: true,
  },
  {
    id: "event.movement-question",
    kind: "conversation",
    title: "Why Keep Racing?",
    description: "A casual conversation raises the possibility that movement means different things to different racers.",
    loreEntryIds: ["lore.urge-to-move"],
    timeWindow: { opensAtSeconds: 15, responseWindowSeconds: 10 },
    optional: false,
  },
  {
    id: "event.creator-marking",
    kind: "discovery",
    title: "Temporary. Fix Later.",
    description: "An old track contains an unfinished marking that may be more informative than its creators intended.",
    loreEntryIds: ["lore.creator-traces"],
    timeWindow: { opensAtSeconds: 30, closesAtSeconds: 180, responseWindowSeconds: 12 },
    optional: true,
  },
  {
    // lore.maintenance-label existed as fully-written content (and is
    // listed as evidence for two mystery threads in mysteryConvergence.ts)
    // but had no STORY_EVENT referencing it anywhere - discoveredLoreIds
    // is only ever populated through completeEvent()'s loreEntryIds
    // lookup, so this entry could never actually be discovered by a
    // player no matter what they did. It didn't block mystery
    // progression (both threads that use it have enough alternative
    // evidence to clear their threshold without it), but the content
    // itself was permanently unreachable, which the "optional lore must
    // remain discoverable" principle above exists specifically to avoid.
    id: "event.maintenance-sign-discovery",
    kind: "discovery",
    title: "A Helpful Old Sign",
    description: "A badly painted direction sign near an unusual finish line uses a mark the player has seen somewhere before.",
    loreEntryIds: ["lore.maintenance-label"],
    timeWindow: { opensAtSeconds: 40, closesAtSeconds: 200, responseWindowSeconds: 12 },
    optional: true,
  },
  {
    id: "event.rival-normalizes-anomaly",
    kind: "conversation",
    title: "The System Is the System",
    description: "A rival treats dimensional finish lines as ordinary, making the protagonist's questions seem unusual rather than foolish.",
    loreEntryIds: ["lore.rival-system-view"],
    timeWindow: { opensAtSeconds: 45, responseWindowSeconds: 10 },
    optional: false,
  },
  {
    id: "event.boss-race-before-answer",
    kind: "race-finished",
    title: "Race First",
    description: "A friendly influential racer agrees to discuss the finish-line pattern after a race and offers only a direction to investigate.",
    loreEntryIds: ["lore.race-before-answer"],
    timeWindow: { opensAtSeconds: 60, responseWindowSeconds: 12 },
    optional: false,
    requiredWin: true,
  },
];

export const BOSS_PERSONALITY_ARCHETYPES = [
  "friendly-challenge",
  "accidentally-informed",
  "genuine-genius",
  "clever-and-sly",
  "overly-serious",
  "chill-legendary",
] as const;

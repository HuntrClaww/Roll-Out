import { StageProgressState } from "./stageManager";
import { UpgradeInventoryState, UPGRADE_RECIPES } from "./upgradeEconomy";
import { BOSS_GATE_DEFINITIONS, BossGateSnapshot } from "./bossChallengeProgression";
import { CharacterRelationshipSnapshot, RelationshipState } from "../story/characterRelationships";
import { StoryState } from "../story/storyManager";
import { WorldStateSnapshot } from "../world/worldState";
import { PlayerTeamState } from "./playerTeam";
import { RaceRule } from "./opponentTypes";
import { NpcServiceSnapshot } from "../story/npcServices";
import { RacingStyleState, RACING_STYLE_PROFILES } from "../story/racingStyleSystem";

export const SAVE_SCHEMA_VERSION = 1;
export const SAVE_STORAGE_KEY = "rollout-save-v1";
export const SAVE_BACKUP_STORAGE_KEY = "rollout-save-v1-backup";

export interface GameSaveData {
  schemaVersion: number;
  savedAtIso: string;
  progression: StageProgressState;
  story: StoryState;
  world: WorldStateSnapshot;
  team: PlayerTeamState;
  relationships: CharacterRelationshipSnapshot;
  bossGates: BossGateSnapshot;
  upgrades: UpgradeInventoryState;
  npcServices: NpcServiceSnapshot;
  racingStyle: RacingStyleState;
}

export const serializeSaveData = (data: GameSaveData): string => JSON.stringify(data);

/** The explicit migration boundary makes future schema changes deliberate. */
export const parseSaveData = (raw: string): GameSaveData | null => {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed) || parsed.schemaVersion !== SAVE_SCHEMA_VERSION) return null;
    if (!isRecord(parsed.progression) || !isRecord(parsed.story) || !isRecord(parsed.world) || !isRecord(parsed.team) || !isRecord(parsed.upgrades)) return null;
    return {
      schemaVersion: SAVE_SCHEMA_VERSION,
      savedAtIso: validIso(parsed.savedAtIso),
      progression: sanitizeProgression(parsed.progression),
      story: sanitizeStory(parsed.story),
      world: sanitizeWorld(parsed.world),
      team: sanitizeTeam(parsed.team),
      relationships: sanitizeRelationships(parsed.relationships),
      bossGates: sanitizeBossGates(parsed.bossGates),
      upgrades: sanitizeUpgrades(parsed.upgrades),
      npcServices: sanitizeNpcServices(parsed.npcServices),
      racingStyle: sanitizeRacingStyle(parsed.racingStyle),
    };
  } catch {
    return null;
  }
};

export const saveToStorage = (data: GameSaveData, storage?: Storage): boolean => {
  const target = storage ?? getBrowserStorage();
  if (!target) return false;
  try {
    const serialized = serializeSaveData(data);
    const previous = target.getItem(SAVE_STORAGE_KEY);
    if (previous) target.setItem(SAVE_BACKUP_STORAGE_KEY, previous);
    target.setItem(SAVE_STORAGE_KEY, serialized);
    return true;
  } catch {
    return false;
  }
};

export const loadFromStorage = (storage?: Storage): GameSaveData | null => {
  const target = storage ?? getBrowserStorage();
  if (!target) return null;
  try {
    const primary = target.getItem(SAVE_STORAGE_KEY);
    const parsedPrimary = primary ? parseSaveData(primary) : null;
    if (parsedPrimary) return parsedPrimary;
    const backup = target.getItem(SAVE_BACKUP_STORAGE_KEY);
    return backup ? parseSaveData(backup) : null;
  } catch {
    return null;
  }
};

const sanitizeProgression = (value: Record<string, unknown>): StageProgressState => ({
  currentStageIndex: nonNegativeInt(value.currentStageIndex),
  unlockedStageIndex: nonNegativeInt(value.unlockedStageIndex),
  bestClearRank: nonNegativeInt(value.bestClearRank),
  totalWins: nonNegativeInt(value.totalWins),
  totalLosses: nonNegativeInt(value.totalLosses),
});

const sanitizeStory = (value: Record<string, unknown>): StoryState => ({
  worldTimeSeconds: nonNegativeNumber(value.worldTimeSeconds),
  discoveredLoreIds: stringArray(value.discoveredLoreIds),
  completedEventIds: stringArray(value.completedEventIds),
  completedRaceIds: stringArray(value.completedRaceIds),
  completedMysteryReactionIds: stringArray(value.completedMysteryReactionIds),
  completedRecallCascadeIds: stringArray(value.completedRecallCascadeIds),
});

const sanitizeWorld = (value: Record<string, unknown>): WorldStateSnapshot => ({
  visitedRegions: stringArray(value.visitedRegions),
  completedStages: stringArray(value.completedStages),
  factionStates: Array.isArray(value.factionStates) ? value.factionStates.filter(isRecord).map((faction) => ({
    id: typeof faction.id === "string" ? faction.id : "unknown",
    name: typeof faction.name === "string" ? faction.name : "Unknown",
    standing: clamp(signedNumber(faction.standing), -100, 100),
    band: faction.band === "hostile" || faction.band === "wary" || faction.band === "friendly" || faction.band === "trusted" ? faction.band : "neutral",
  })) : [],
});

const sanitizeTeam = (value: Record<string, unknown>): PlayerTeamState => ({
  player: { id: "character.protagonist", name: "The Main Character", role: "protagonist", personalityNotes: [] },
  memberIds: stringArray(value.memberIds),
  activeMemberId: typeof value.activeMemberId === "string" ? value.activeMemberId : null,
});

const sanitizeRelationships = (value: unknown): CharacterRelationshipSnapshot => Array.isArray(value)
  ? value.filter(isRecord).map((relationship) => ({
    characterId: typeof relationship.characterId === "string" ? relationship.characterId : "",
    state: validRelationshipState(relationship.state),
    interactionCount: nonNegativeInt(relationship.interactionCount),
    lastInteractionTimeSeconds: nonNegativeNumber(relationship.lastInteractionTimeSeconds),
  })).filter((relationship) => relationship.characterId.length > 0)
  : [];

const sanitizeBossGates = (value: unknown): BossGateSnapshot => {
  if (!isRecord(value)) return {};
  const result: BossGateSnapshot = {};
  for (const definition of BOSS_GATE_DEFINITIONS) {
    const stageState = isRecord(value[definition.stageId]) ? value[definition.stageId] : {};
    const rules: RaceRule[] = Array.isArray(stageState.completedPreparationRules)
      ? stageState.completedPreparationRules.filter((rule: unknown): rule is RaceRule => typeof rule === "string" && definition.preparationRules.includes(rule as RaceRule))
      : [];
    result[definition.stageId] = { completedPreparationRules: [...new Set(rules)] };
  }
  return result;
};

const sanitizeUpgrades = (value: Record<string, unknown>): UpgradeInventoryState => {
  const materials = isRecord(value.materials) ? value.materials : {};
  const upgradeLevels = isRecord(value.upgradeLevels) ? value.upgradeLevels : {};
  const sanitizedMaterials = {
    "grip-fiber": nonNegativeInt(materials["grip-fiber"]),
    "volcanic-glass": nonNegativeInt(materials["volcanic-glass"]),
    "frost-resin": nonNegativeInt(materials["frost-resin"]),
  };
  const sanitizedLevels: UpgradeInventoryState["upgradeLevels"] = {};
  for (const id of Object.keys(UPGRADE_RECIPES) as Array<keyof typeof UPGRADE_RECIPES>) {
    sanitizedLevels[id] = clamp(nonNegativeInt(upgradeLevels[id]), 0, UPGRADE_RECIPES[id].maxLevel);
  }
  return { materials: sanitizedMaterials, upgradeLevels: sanitizedLevels };
};

const sanitizeNpcServices = (value: unknown): NpcServiceSnapshot => {
  if (!isRecord(value)) return { repairIntegrity: 1, discoveredRouteHints: [], forecastedStageIds: [] };
  return {
    repairIntegrity: clamp(signedNumber(value.repairIntegrity), 0, 1),
    discoveredRouteHints: stringArray(value.discoveredRouteHints),
    forecastedStageIds: stringArray(value.forecastedStageIds),
  };
};

const sanitizeRacingStyle = (value: unknown): RacingStyleState => {
  const selectedStyleId = isRecord(value) && typeof value.selectedStyleId === "string" ? value.selectedStyleId : RACING_STYLE_PROFILES[0].id;
  return { selectedStyleId: RACING_STYLE_PROFILES.some((style) => style.id === selectedStyleId) ? selectedStyleId : RACING_STYLE_PROFILES[0].id };
};

const validRelationshipState = (value: unknown): RelationshipState =>
  value === "met" || value === "friendly" || value === "trusted" || value === "rival" || value === "defeated" ? value : "unknown";
const validIso = (value: unknown): string => typeof value === "string" && Number.isFinite(Date.parse(value)) ? value : new Date(0).toISOString();
const stringArray = (value: unknown): string[] => Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string" && item.trim().length > 0))] : [];
const nonNegativeNumber = (value: unknown): number => typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;
const signedNumber = (value: unknown): number => typeof value === "number" && Number.isFinite(value) ? value : 0;
const nonNegativeInt = (value: unknown): number => Math.floor(nonNegativeNumber(value));
const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));
const isRecord = (value: unknown): value is Record<string, any> => typeof value === "object" && value !== null && !Array.isArray(value);
const getBrowserStorage = (): Storage | null => typeof window !== "undefined" && window.localStorage ? window.localStorage : null;

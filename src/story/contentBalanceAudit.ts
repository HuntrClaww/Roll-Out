import { CHARACTER_DATABASE_ALL, CharacterFunction } from "./characterDatabase";
import { CHARACTER_ENCOUNTERS } from "./characterRelationships";
import { CHARACTER_VISUAL_PROFILES, NPC_SERVICES } from "./characterPresentation";
import { DIALOGUE_SCENES } from "./dialogueSystem";

export interface ContentBalanceAudit {
  rosterCount: number;
  uniqueCharacterCount: number;
  visualCoverageCount: number;
  encounterCoverageCount: number;
  dialogueCoverageCount: number;
  serviceCoverageCount: number;
  functionCounts: Record<CharacterFunction, number>;
  charactersWithoutVisualIdentity: string[];
  charactersWithoutAnyDiscoverabilityPath: string[];
  warnings: string[];
}

const FUNCTIONS: CharacterFunction[] = ["protagonist", "guide", "boss", "rival", "knight", "friend", "acquaintance", "event-contact", "world-worker"];

export const runContentBalanceAudit = (): ContentBalanceAudit => {
  const rosterIds = new Set(CHARACTER_DATABASE_ALL.map((character) => character.id));
  const visualIds = new Set(CHARACTER_VISUAL_PROFILES.map((profile) => profile.characterId));
  const encounterIds = new Set(CHARACTER_ENCOUNTERS.map((encounter) => encounter.characterId));
  const dialogueIds = new Set(DIALOGUE_SCENES.map((scene) => scene.characterId));
  const serviceIds = new Set(NPC_SERVICES.map((service) => service.characterId));
  const functionCounts = Object.fromEntries(FUNCTIONS.map((characterFunction) => [
    characterFunction,
    CHARACTER_DATABASE_ALL.filter((character) => character.function === characterFunction).length,
  ])) as Record<CharacterFunction, number>;
  const charactersWithoutVisualIdentity = CHARACTER_DATABASE_ALL.filter((character) => !visualIds.has(character.id)).map((character) => character.id);
  const charactersWithoutAnyDiscoverabilityPath = CHARACTER_DATABASE_ALL
    .filter((character) => !encounterIds.has(character.id) && !dialogueIds.has(character.id) && !serviceIds.has(character.id))
    .map((character) => character.id);
  const warnings: string[] = [];
  if (rosterIds.size !== CHARACTER_DATABASE_ALL.length) warnings.push("Duplicate character IDs detected.");
  if (charactersWithoutVisualIdentity.length > 0) warnings.push("Some characters lack visual identity profiles.");
  if (charactersWithoutAnyDiscoverabilityPath.length > 12) warnings.push("Too many characters lack an encounter, dialogue, or service path.");
  if (functionCounts.boss > 5) warnings.push("Boss count is growing faster than the support roster.");
  if (functionCounts.acquaintance + functionCounts.friend < 4) warnings.push("The roster may be too dense with high-attention characters.");
  return {
    rosterCount: CHARACTER_DATABASE_ALL.length,
    uniqueCharacterCount: rosterIds.size,
    visualCoverageCount: CHARACTER_DATABASE_ALL.filter((character) => visualIds.has(character.id)).length,
    encounterCoverageCount: CHARACTER_DATABASE_ALL.filter((character) => encounterIds.has(character.id)).length,
    dialogueCoverageCount: CHARACTER_DATABASE_ALL.filter((character) => dialogueIds.has(character.id)).length,
    serviceCoverageCount: CHARACTER_DATABASE_ALL.filter((character) => serviceIds.has(character.id)).length,
    functionCounts,
    charactersWithoutVisualIdentity,
    charactersWithoutAnyDiscoverabilityPath,
    warnings,
  };
};

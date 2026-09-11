import { CHARACTER_ENCOUNTERS } from "./characterRelationships";
import { getCharacterById } from "./characterDatabase";

export interface EncounterDensityAudit {
  encounterCount: number;
  regionCounts: Record<string, number>;
  stageCounts: Record<string, number>;
  worldTimeOnlyCount: number;
  invalidCharacterIds: string[];
  duplicateOneTimeCharacterIds: string[];
  overloadedRegions: string[];
  overloadedStages: string[];
  warnings: string[];
  ready: boolean;
}

const REGION_SOFT_LIMIT = 8;
const STAGE_SOFT_LIMIT = 7;

/** Ensures that adding background characters does not create an unreadable encounter flood. */
export const runEncounterDensityAudit = (): EncounterDensityAudit => {
  const regionCounts: Record<string, number> = {};
  const stageCounts: Record<string, number> = {};
  const characterCounts: Record<string, number> = {};
  const invalidCharacterIds = [...new Set(
    CHARACTER_ENCOUNTERS
      .filter((encounter) => !getCharacterById(encounter.characterId))
      .map((encounter) => encounter.characterId),
  )];

  for (const encounter of CHARACTER_ENCOUNTERS) {
    characterCounts[encounter.characterId] = (characterCounts[encounter.characterId] ?? 0) + 1;
    if (encounter.requiredRegionId) regionCounts[encounter.requiredRegionId] = (regionCounts[encounter.requiredRegionId] ?? 0) + 1;
    if (encounter.requiredStageId) stageCounts[encounter.requiredStageId] = (stageCounts[encounter.requiredStageId] ?? 0) + 1;
  }

  const duplicateOneTimeCharacterIds = [...new Set(
    CHARACTER_ENCOUNTERS
      .filter((encounter) => !encounter.repeatable)
      .map((encounter) => encounter.characterId),
  )].filter((characterId) => CHARACTER_ENCOUNTERS.filter((encounter) => !encounter.repeatable && encounter.characterId === characterId).length > 1);
  const overloadedRegions = Object.entries(regionCounts).filter(([, count]) => count > REGION_SOFT_LIMIT).map(([id]) => id);
  const overloadedStages = Object.entries(stageCounts).filter(([, count]) => count > STAGE_SOFT_LIMIT).map(([id]) => id);
  const warnings: string[] = [];
  if (invalidCharacterIds.length > 0) warnings.push("Some encounter entries reference characters outside the roster.");
  if (duplicateOneTimeCharacterIds.length > 0) warnings.push("A character has multiple non-repeatable encounter entries.");
  if (overloadedRegions.length > 0) warnings.push("One or more regions exceed the encounter density soft limit.");
  if (overloadedStages.length > 0) warnings.push("One or more stages exceed the encounter density soft limit.");

  return {
    encounterCount: CHARACTER_ENCOUNTERS.length,
    regionCounts,
    stageCounts,
    worldTimeOnlyCount: CHARACTER_ENCOUNTERS.filter((encounter) => !encounter.requiredRegionId && !encounter.requiredStageId).length,
    invalidCharacterIds,
    duplicateOneTimeCharacterIds,
    overloadedRegions,
    overloadedStages,
    warnings,
    ready: invalidCharacterIds.length === 0 && duplicateOneTimeCharacterIds.length === 0,
  };
};


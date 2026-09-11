import { CharacterRecord, getCharacterById } from "./characterDatabase";
import { BossBiography, getBossBiography } from "./bossBiographies";

export type RelationshipState = "unknown" | "met" | "friendly" | "trusted" | "rival" | "defeated";

export interface CharacterRelationship {
  characterId: string;
  state: RelationshipState;
  interactionCount: number;
  lastInteractionTimeSeconds: number;
}

export type CharacterRelationshipSnapshot = CharacterRelationship[];

export interface CharacterEncounter {
  characterId: string;
  requiredRegionId?: string;
  requiredStageId?: string;
  minimumFactionStanding?: number;
  minimumWorldTimeSeconds?: number;
  repeatable: boolean;
}

const ENCOUNTERS: CharacterEncounter[] = [
  { characterId: "character.static", repeatable: true },
  { characterId: "npc.sly-mark", requiredRegionId: "open-circuit", repeatable: true },
  { characterId: "npc.pip-salvage", requiredRegionId: "open-circuit", repeatable: true },
  { characterId: "npc.vela-cartographer", minimumWorldTimeSeconds: 20, repeatable: true },
  { characterId: "rival.basil-varn", requiredStageId: "intro-gate", repeatable: false },
  { characterId: "boss.aether-sovereign", requiredStageId: "intro-gate", repeatable: false },
  { characterId: "boss.cinder-axis", requiredStageId: "ash-crest", repeatable: false },
  { characterId: "boss.glacier-sigil", requiredStageId: "frost-veil", repeatable: false },
  { characterId: "boss.rift-echelon", requiredStageId: "null-echo", repeatable: false },
  { characterId: "boss.circuit-steward", requiredStageId: "convergence-circuit", repeatable: false },
  { characterId: "npc.ora-bridgekeeper", requiredRegionId: "mountain-pass", repeatable: true },
  { characterId: "npc.ashen-mira", requiredRegionId: "volcanic-basin", repeatable: true },
  { characterId: "npc.vesper-melt", requiredRegionId: "frozen-cavern", repeatable: true },
  { characterId: "npc.quiet-ell", requiredStageId: "null-echo", repeatable: true },
  { characterId: "npc.stamp-echo", requiredStageId: "convergence-circuit", repeatable: true },
  { characterId: "rival.hedge-lumen", requiredStageId: "intro-gate", repeatable: false },
  { characterId: "rival.iron-pollen", requiredStageId: "ash-crest", repeatable: false },
  { characterId: "rival.morrow-dash", requiredStageId: "frost-veil", repeatable: false },
  { characterId: "npc.hollow-gear", minimumWorldTimeSeconds: 90, repeatable: true },
  { characterId: "npc.copper-echo", minimumWorldTimeSeconds: 120, repeatable: true },
  { characterId: "npc.fable-fern", requiredRegionId: "mountain-pass", repeatable: true },
  { characterId: "npc.kite-warden", requiredRegionId: "mountain-pass", repeatable: true },
  { characterId: "npc.ash-cadet", requiredRegionId: "volcanic-basin", repeatable: true },
  { characterId: "npc.snow-cadet", requiredRegionId: "frozen-cavern", repeatable: true },
  { characterId: "npc.veil-runner", requiredStageId: "null-echo", repeatable: true },
  { characterId: "npc.marble-archivist", minimumWorldTimeSeconds: 150, repeatable: true },
  { characterId: "npc.sunken-scribe", requiredStageId: "frost-veil", repeatable: true },
  { characterId: "npc.choir-of-static", requiredStageId: "null-echo", repeatable: true },
  { characterId: "npc.undertow-porter", requiredRegionId: "mountain-pass", repeatable: true },
  { characterId: "npc.lantern-may", requiredRegionId: "mountain-pass", repeatable: true },
  { characterId: "npc.rivet-king", requiredRegionId: "volcanic-basin", repeatable: true },
  { characterId: "npc.faraday-finch", requiredStageId: "ash-crest", repeatable: true },
  { characterId: "npc.mirror-mara", requiredStageId: "frost-veil", repeatable: true },
  { characterId: "npc.nettle-judge", minimumWorldTimeSeconds: 180, repeatable: true },
  { characterId: "npc.ghost-lap", requiredStageId: "null-echo", repeatable: true },
  { characterId: "npc.vaultkeeper-io", requiredStageId: "convergence-circuit", repeatable: true },
  { characterId: "rival.quartz-quick", requiredStageId: "ash-crest", repeatable: false },
  { characterId: "rival.ashen-foil", requiredStageId: "ash-crest", repeatable: false },
  { characterId: "npc.pebble-prince", requiredRegionId: "mountain-pass", repeatable: true },
  { characterId: "npc.salt-analog", requiredRegionId: "volcanic-basin", repeatable: true },
  { characterId: "npc.rail-bell", requiredRegionId: "mountain-pass", repeatable: true },
  { characterId: "knight.cogline", requiredStageId: "convergence-circuit", repeatable: true },
  { characterId: "knight.ice-thread", requiredRegionId: "frozen-cavern", repeatable: true },
  { characterId: "npc.morrow-mint", minimumWorldTimeSeconds: 60, repeatable: true },
  { characterId: "npc.pocket-storm", requiredStageId: "ash-crest", repeatable: true },
];

export class CharacterRelationshipManager {
  private readonly relationships = new Map<string, CharacterRelationship>();

  public getRelationship(characterId: string): CharacterRelationship {
    return this.relationships.get(characterId) ?? { characterId, state: "unknown", interactionCount: 0, lastInteractionTimeSeconds: 0 };
  }

  public getSnapshot(): CharacterRelationshipSnapshot {
    return [...this.relationships.values()].map((relationship) => ({ ...relationship }));
  }

  public loadSnapshot(snapshot: CharacterRelationshipSnapshot): void {
    this.relationships.clear();
    for (const relationship of snapshot ?? []) {
      if (!getCharacterById(relationship.characterId)) continue;
      this.relationships.set(relationship.characterId, {
        characterId: relationship.characterId,
        state: relationship.state,
        interactionCount: Math.max(0, Math.floor(relationship.interactionCount)),
        lastInteractionTimeSeconds: Math.max(0, relationship.lastInteractionTimeSeconds),
      });
    }
  }

  public recordInteraction(characterId: string, worldTimeSeconds: number, state?: RelationshipState): CharacterRelationship {
    const current = this.getRelationship(characterId);
    const next: CharacterRelationship = {
      characterId,
      state: state ?? (current.state === "unknown" ? "met" : current.state),
      interactionCount: current.interactionCount + 1,
      lastInteractionTimeSeconds: Number.isFinite(worldTimeSeconds) ? Math.max(0, worldTimeSeconds) : current.lastInteractionTimeSeconds,
    };
    this.relationships.set(characterId, next);
    return next;
  }

  public recordBossDefeat(characterId: string, worldTimeSeconds: number): CharacterRelationship {
    return this.recordInteraction(characterId, worldTimeSeconds, "defeated");
  }

  public getUnlockedBossBiographies(): BossBiography[] {
    return [...this.relationships.values()]
      .filter((relationship) => relationship.state === "defeated")
      .map((relationship) => getBossBiography(relationship.characterId))
      .filter((biography): biography is BossBiography => biography !== undefined);
  }

  public getAvailableEncounters(regionIds: string[], completedStageIds: string[], worldTimeSeconds: number, factionStandings: Record<string, number> = {}): CharacterRecord[] {
    const regions = new Set(regionIds);
    const completedStages = new Set(completedStageIds);
    return ENCOUNTERS.filter((encounter) => {
      const relationship = this.getRelationship(encounter.characterId);
      if (!encounter.repeatable && relationship.interactionCount > 0) return false;
      if (encounter.requiredRegionId && !regions.has(encounter.requiredRegionId)) return false;
      if (encounter.requiredStageId && completedStages.has(encounter.requiredStageId)) return false;
      if (encounter.minimumWorldTimeSeconds !== undefined && worldTimeSeconds < encounter.minimumWorldTimeSeconds) return false;
      const character = getCharacterById(encounter.characterId);
      const factionId = character?.faction?.trim().toLowerCase().replace(/\s+/g, "-");
      if (encounter.minimumFactionStanding !== undefined && factionId && (factionStandings[factionId] ?? 0) < encounter.minimumFactionStanding) return false;
      return character !== undefined;
    }).map((encounter) => getCharacterById(encounter.characterId) as CharacterRecord);
  }
}

export const CHARACTER_ENCOUNTERS = ENCOUNTERS;

export const getBossCharacterIdForStage = (stageId: string): string | undefined => ({
  "intro-gate": "boss.aether-sovereign",
  "ash-crest": "boss.cinder-axis",
  "frost-veil": "boss.glacier-sigil",
  "null-echo": "boss.rift-echelon",
  "convergence-circuit": "boss.circuit-steward",
}[stageId]);

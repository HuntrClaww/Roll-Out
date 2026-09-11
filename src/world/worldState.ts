export type FactionStandingBand = "hostile" | "wary" | "neutral" | "friendly" | "trusted";

export interface FactionState {
  id: string;
  name: string;
  standing: number;
  band: FactionStandingBand;
}

export interface WorldStateSnapshot {
  visitedRegions: string[];
  completedStages: string[];
  factionStates: FactionState[];
}

const FACTIONS = [
  ["open-circuit", "Open Circuit"],
  ["ash-banner", "Ash Banner"],
  ["frost-reign", "Frost Reign"],
  ["null-veil", "Null Veil"],
  ["convergence-league", "Convergence League"],
  ["sky-dominion", "Sky Dominion"],
  ["amber-circuit", "Amber Circuit"],
  ["crimson-zero", "Crimson Zero"],
] as const;

export class WorldStateManager {
  private readonly visitedRegions = new Set<string>();
  private readonly completedStages = new Set<string>();
  private readonly factionStandings = new Map<string, number>(FACTIONS.map(([id]) => [id, 0]));

  public visitRegion(regionId: string): void {
    if (regionId.trim()) this.visitedRegions.add(regionId);
  }

  public completeStage(stageId: string, factionName: string, won: boolean): void {
    if (!stageId.trim()) return;
    if (won) this.completedStages.add(stageId);

    const factionId = normalizeFactionId(factionName);
    if (!this.factionStandings.has(factionId)) {
      this.factionStandings.set(factionId, 0);
    }
    this.adjustFactionStanding(factionId, won ? 8 : -3);
  }

  public adjustFactionStanding(factionId: string, amount: number): void {
    if (!Number.isFinite(amount)) return;
    const current = this.factionStandings.get(factionId) ?? 0;
    this.factionStandings.set(factionId, clamp(current + amount, -100, 100));
  }

  public getFactionState(factionId: string): FactionState {
    const standing = this.factionStandings.get(factionId) ?? 0;
    return {
      id: factionId,
      name: formatFactionName(factionId),
      standing,
      band: getStandingBand(standing),
    };
  }

  public getState(): WorldStateSnapshot {
    return {
      visitedRegions: [...this.visitedRegions],
      completedStages: [...this.completedStages],
      factionStates: [...this.factionStandings.keys()].map((id) => this.getFactionState(id)),
    };
  }

  public loadState(state: WorldStateSnapshot): void {
    this.visitedRegions.clear();
    this.completedStages.clear();
    this.factionStandings.clear();
    for (const regionId of state.visitedRegions ?? []) if (regionId.trim()) this.visitedRegions.add(regionId);
    for (const stageId of state.completedStages ?? []) if (stageId.trim()) this.completedStages.add(stageId);
    for (const faction of state.factionStates ?? []) {
      if (faction.id.trim() && Number.isFinite(faction.standing)) this.factionStandings.set(faction.id, clamp(faction.standing, -100, 100));
    }
    for (const [id] of FACTIONS) if (!this.factionStandings.has(id)) this.factionStandings.set(id, 0);
  }
}

export const normalizeFactionId = (name: string): string => name.trim().toLowerCase().replace(/\s+/g, "-");

const formatFactionName = (id: string): string => id.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");

const getStandingBand = (standing: number): FactionStandingBand => {
  if (standing <= -50) return "hostile";
  if (standing < 0) return "wary";
  if (standing >= 75) return "trusted";
  if (standing >= 25) return "friendly";
  return "neutral";
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

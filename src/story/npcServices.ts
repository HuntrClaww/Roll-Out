import { OrbUpgradeId } from "../gameplay/orbUpgrade";
import { UpgradeInventoryManager } from "../gameplay/upgradeEconomy";
import { NpcServiceType, getNpcService } from "./characterPresentation";

export interface ServiceNotice {
  characterId: string;
  serviceType: NpcServiceType;
  title: string;
  message: string;
  success: boolean;
}

export interface NpcServiceSnapshot {
  repairIntegrity: number;
  discoveredRouteHints: string[];
  forecastedStageIds: string[];
}

export class NpcServiceManager {
  private repairIntegrity = 1;
  private readonly discoveredRouteHints = new Set<string>();
  private readonly forecastedStageIds = new Set<string>();

  public craftUpgrade(inventory: UpgradeInventoryManager, upgradeId: OrbUpgradeId): ServiceNotice {
    const service = getNpcService("npc.pip-salvage", "upgrade-crafting");
    const success = Boolean(service) && inventory.purchase(upgradeId);
    return this.notice(service?.characterId ?? "npc.pip-salvage", "upgrade-crafting", success ? "Pip finished a modification" : "Pip needs more parts", success ? "The upgrade was assembled from tested scrap. The testing was mostly successful." : "The recipe cannot be completed with the materials currently in your inventory.", success);
  }

  public repairOrb(): ServiceNotice {
    const service = getNpcService("npc.quarry-repair", "repair");
    this.repairIntegrity = 1;
    return this.notice(service?.characterId ?? "npc.quarry-repair", "repair", "Quarry reinforced the shell", "The orb is structurally sound. Quarry recommends avoiding only the obstacles that are actually solid.", true);
  }

  public revealRouteHint(stageId: string): ServiceNotice {
    const service = getNpcService("npc.vela-cartographer", "cartography");
    const firstDiscovery = !this.discoveredRouteHints.has(stageId);
    this.discoveredRouteHints.add(stageId);
    return this.notice(service?.characterId ?? "npc.vela-cartographer", "cartography", firstDiscovery ? "Vela marked a route fragment" : "Vela reviewed the route again", firstDiscovery ? `A route contradiction has been recorded for ${stageId}.` : `The ${stageId} map still disagrees with itself, but now the disagreement is documented.`, true);
  }

  public forecast(stageId: string, windStrength: number): ServiceNotice {
    const service = getNpcService("npc.nix-weather", "forecast");
    this.forecastedStageIds.add(stageId);
    const confidence = Math.max(0, Math.min(1, 1 - Math.abs(windStrength - 1) * 0.25));
    return this.notice(service?.characterId ?? "npc.nix-weather", "forecast", "Nix issued a forecast", `Expected wind intensity: ${windStrength.toFixed(2)} m/s. Forecast confidence: ${(confidence * 100).toFixed(0)}%.`, true);
  }

  public rumor(stageId: string): ServiceNotice {
    const service = getNpcService("npc.sly-mark", "rumor");
    return this.notice(service?.characterId ?? "npc.sly-mark", "rumor", "Sly-Mark shared a rumor", `Someone saw an unusual marker near ${stageId}. Sly-Mark insists this is either important or profitable.`, true);
  }

  public challengeNotice(stageId: string, requirement: string): ServiceNotice {
    const service = getNpcService("npc.loop-clerk", "challenge-notice");
    return this.notice(service?.characterId ?? "npc.loop-clerk", "challenge-notice", "Loop updated the notice board", `${stageId}: ${requirement}`, true);
  }

  public getState(): NpcServiceSnapshot {
    return { repairIntegrity: this.repairIntegrity, discoveredRouteHints: [...this.discoveredRouteHints], forecastedStageIds: [...this.forecastedStageIds] };
  }

  public loadState(state: NpcServiceSnapshot): void {
    this.repairIntegrity = Math.max(0, Math.min(1, Number.isFinite(state.repairIntegrity) ? state.repairIntegrity : 1));
    this.discoveredRouteHints.clear();
    this.forecastedStageIds.clear();
    for (const id of state.discoveredRouteHints ?? []) if (id.trim()) this.discoveredRouteHints.add(id);
    for (const id of state.forecastedStageIds ?? []) if (id.trim()) this.forecastedStageIds.add(id);
  }

  private notice(characterId: string, serviceType: NpcServiceType, title: string, message: string, success: boolean): ServiceNotice {
    return { characterId, serviceType, title, message, success };
  }
}

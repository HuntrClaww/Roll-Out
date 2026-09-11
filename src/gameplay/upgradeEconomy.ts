import { OrbUpgrade, OrbUpgradeId, ORB_UPGRADES } from "./orbUpgrade";

export type UpgradeMaterialId = "grip-fiber" | "volcanic-glass" | "frost-resin";
export type MaterialInventory = Partial<Record<UpgradeMaterialId, number>>;

export interface UpgradeRecipe {
  id: OrbUpgradeId;
  name: string;
  description: string;
  cost: MaterialInventory;
  maxLevel: number;
  gripModifierByLevel: number[];
}

export interface UpgradeInventoryState {
  materials: MaterialInventory;
  upgradeLevels: Partial<Record<OrbUpgradeId, number>>;
}

export const UPGRADE_RECIPES: Record<OrbUpgradeId, UpgradeRecipe> = {
  "reinforced-grip": {
    id: "reinforced-grip",
    name: ORB_UPGRADES["reinforced-grip"].name,
    description: ORB_UPGRADES["reinforced-grip"].description,
    cost: { "grip-fiber": 2, "volcanic-glass": 1 },
    maxLevel: 2,
    gripModifierByLevel: [1.25, 1.4],
  },
  "frost-balance": {
    id: "frost-balance",
    name: ORB_UPGRADES["frost-balance"].name,
    description: ORB_UPGRADES["frost-balance"].description,
    cost: { "grip-fiber": 1, "frost-resin": 2 },
    maxLevel: 1,
    gripModifierByLevel: [1.15],
  },
};

export class UpgradeInventoryManager {
  private readonly materials: MaterialInventory;
  private readonly upgradeLevels: Partial<Record<OrbUpgradeId, number>> = {};

  constructor(initialMaterials: MaterialInventory = {}) {
    this.materials = { ...initialMaterials };
    this.clampMaterials();
  }

  public addMaterial(materialId: UpgradeMaterialId, amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) return;
    this.materials[materialId] = Math.max(0, Math.floor((this.materials[materialId] ?? 0) + amount));
  }

  public getMaterialCount(materialId: UpgradeMaterialId): number {
    return this.materials[materialId] ?? 0;
  }

  public getUpgradeLevel(upgradeId: OrbUpgradeId): number {
    return this.upgradeLevels[upgradeId] ?? 0;
  }

  public canPurchase(upgradeId: OrbUpgradeId): boolean {
    const recipe = UPGRADE_RECIPES[upgradeId];
    if (!recipe || this.getUpgradeLevel(upgradeId) >= recipe.maxLevel) return false;
    return Object.entries(recipe.cost).every(([materialId, amount]) => this.getMaterialCount(materialId as UpgradeMaterialId) >= (amount ?? 0));
  }

  public purchase(upgradeId: OrbUpgradeId): boolean {
    if (!this.canPurchase(upgradeId)) return false;
    const recipe = UPGRADE_RECIPES[upgradeId];
    for (const [materialId, amount] of Object.entries(recipe.cost)) {
      const id = materialId as UpgradeMaterialId;
      this.materials[id] = this.getMaterialCount(id) - (amount ?? 0);
    }
    this.upgradeLevels[upgradeId] = this.getUpgradeLevel(upgradeId) + 1;
    return true;
  }

  public getInstalledUpgrade(upgradeId: OrbUpgradeId): OrbUpgrade | null {
    const level = this.getUpgradeLevel(upgradeId);
    const recipe = UPGRADE_RECIPES[upgradeId];
    if (!recipe || level <= 0) return null;
    return { ...ORB_UPGRADES[upgradeId], gripModifier: recipe.gripModifierByLevel[level - 1] ?? ORB_UPGRADES[upgradeId].gripModifier };
  }

  public getState(): UpgradeInventoryState {
    return { materials: { ...this.materials }, upgradeLevels: { ...this.upgradeLevels } };
  }

  public loadState(state: UpgradeInventoryState): void {
    for (const id of ["grip-fiber", "volcanic-glass", "frost-resin"] as UpgradeMaterialId[]) {
      this.materials[id] = Math.max(0, Math.floor(state.materials?.[id] ?? 0));
    }
    for (const id of Object.keys(UPGRADE_RECIPES) as OrbUpgradeId[]) {
      const requestedLevel = Math.floor(state.upgradeLevels?.[id] ?? 0);
      this.upgradeLevels[id] = Math.max(0, Math.min(UPGRADE_RECIPES[id].maxLevel, requestedLevel));
    }
  }

  private clampMaterials(): void {
    for (const id of ["grip-fiber", "volcanic-glass", "frost-resin"] as UpgradeMaterialId[]) {
      this.materials[id] = Math.max(0, Math.floor(this.materials[id] ?? 0));
    }
  }
}

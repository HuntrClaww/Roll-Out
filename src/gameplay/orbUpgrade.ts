import { Marble } from "../physics/marble";

export type OrbUpgradeId = "reinforced-grip" | "frost-balance";

export interface OrbUpgrade {
  id: OrbUpgradeId;
  name: string;
  description: string;
  gripModifier: number;
}

export const ORB_UPGRADES: Record<OrbUpgradeId, OrbUpgrade> = {
  "reinforced-grip": {
    id: "reinforced-grip",
    name: "Reinforced Grip",
    description: "Improves steering traction on difficult surfaces, with no change to mass or speed.",
    gripModifier: 1.25,
  },
  "frost-balance": {
    id: "frost-balance",
    name: "Frost Balance",
    description: "A stabilizing body insert tuned for low-traction surfaces.",
    gripModifier: 1.15,
  },
};

export const applyOrbUpgrade = (marble: Marble, upgrade: OrbUpgrade): void => {
  marble.setGripModifier(upgrade.gripModifier);
};

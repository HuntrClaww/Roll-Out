import { UpgradeInventoryManager } from "../gameplay/upgradeEconomy";
import { NpcServiceManager } from "./npcServices";

describe("NPC services", () => {
  test("routes crafting through Pip and the upgrade inventory", () => {
    const services = new NpcServiceManager();
    const inventory = new UpgradeInventoryManager({ "grip-fiber": 2, "volcanic-glass": 1 });
    expect(services.craftUpgrade(inventory, "reinforced-grip").success).toBe(true);
    expect(inventory.getUpgradeLevel("reinforced-grip")).toBe(1);
  });

  test("records route and forecast discoveries for persistence", () => {
    const services = new NpcServiceManager();
    services.revealRouteHint("ash-crest");
    services.forecast("ash-crest", 1.4);
    expect(services.getState().discoveredRouteHints).toContain("ash-crest");
    expect(services.getState().forecastedStageIds).toContain("ash-crest");
    const restored = new NpcServiceManager();
    restored.loadState(services.getState());
    expect(restored.getState()).toEqual(services.getState());
  });
});

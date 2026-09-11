import { UpgradeInventoryManager } from "./upgradeEconomy";

describe("upgrade economy", () => {
  test("purchases a bounded upgrade level and consumes materials", () => {
    const inventory = new UpgradeInventoryManager({ "grip-fiber": 4, "volcanic-glass": 2 });
    expect(inventory.purchase("reinforced-grip")).toBe(true);
    expect(inventory.getUpgradeLevel("reinforced-grip")).toBe(1);
    expect(inventory.getMaterialCount("grip-fiber")).toBe(2);
    expect(inventory.getInstalledUpgrade("reinforced-grip")?.gripModifier).toBe(1.25);
    expect(inventory.purchase("reinforced-grip")).toBe(true);
    expect(inventory.getUpgradeLevel("reinforced-grip")).toBe(2);
    expect(inventory.purchase("reinforced-grip")).toBe(false);
  });

  test("does not spend materials when a recipe cannot be afforded", () => {
    const inventory = new UpgradeInventoryManager({ "grip-fiber": 1 });
    expect(inventory.purchase("reinforced-grip")).toBe(false);
    expect(inventory.getState().materials["grip-fiber"]).toBe(1);
  });
});

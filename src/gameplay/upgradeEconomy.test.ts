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

  test("frost-balance purchases and installs independently of reinforced-grip", () => {
    // frost-balance previously had zero test coverage, matching its zero
    // wiring into main.ts - both are fixed together (see main.ts's F/I
    // key handlers).
    const inventory = new UpgradeInventoryManager({ "grip-fiber": 3, "frost-resin": 2 });
    expect(inventory.purchase("frost-balance")).toBe(true);
    expect(inventory.getUpgradeLevel("frost-balance")).toBe(1);
    expect(inventory.getMaterialCount("grip-fiber")).toBe(2);
    expect(inventory.getMaterialCount("frost-resin")).toBe(0);
    expect(inventory.getInstalledUpgrade("frost-balance")?.gripModifier).toBe(1.15);
    // maxLevel is 1 for frost-balance, unlike reinforced-grip's 2.
    expect(inventory.purchase("frost-balance")).toBe(false);
    expect(inventory.getUpgradeLevel("frost-balance")).toBe(1);
  });

  test("owning both upgrades keeps each installable/queryable independently", () => {
    const inventory = new UpgradeInventoryManager({ "grip-fiber": 10, "volcanic-glass": 5, "frost-resin": 5 });
    expect(inventory.purchase("reinforced-grip")).toBe(true);
    expect(inventory.purchase("frost-balance")).toBe(true);
    expect(inventory.getInstalledUpgrade("reinforced-grip")?.gripModifier).toBe(1.25);
    expect(inventory.getInstalledUpgrade("frost-balance")?.gripModifier).toBe(1.15);
  });
});

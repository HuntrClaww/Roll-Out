import { CharacterRelationshipManager } from "./characterRelationships";

describe("character relationship manager", () => {
  test("makes one-time stage encounters disappear after interaction", () => {
    const manager = new CharacterRelationshipManager();
    expect(manager.getAvailableEncounters([], [], 0).some((character) => character.id === "rival.basil-varn")).toBe(true);
    manager.recordInteraction("rival.basil-varn", 10, "rival");
    expect(manager.getAvailableEncounters([], [], 10).some((character) => character.id === "rival.basil-varn")).toBe(false);
  });

  test("keeps recurring contacts available and records boss defeat", () => {
    const manager = new CharacterRelationshipManager();
    expect(manager.getAvailableEncounters(["open-circuit"], [], 0).some((character) => character.id === "npc.sly-mark")).toBe(true);
    manager.recordBossDefeat("boss.aether-sovereign", 30);
    expect(manager.getRelationship("boss.aether-sovereign").state).toBe("defeated");
    expect(manager.getUnlockedBossBiographies().map((entry) => entry.bossId)).toEqual(["boss.aether-sovereign"]);
  });

  test("exposes Batch 02 regional contacts through encounter rules", () => {
    const manager = new CharacterRelationshipManager();
    const encounters = manager.getAvailableEncounters(["mountain-pass"], [], 0);
    expect(encounters.map((character) => character.id)).toEqual(expect.arrayContaining(["npc.ora-bridgekeeper", "npc.fable-fern", "npc.kite-warden"]));
  });
});

import { CharacterRelationshipManager } from "./characterRelationships";
import { getDialogueScene } from "./dialogueSystem";

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

  describe("regression: the 4 combat knights are reachable end-to-end (encounter -> character -> dialogue)", () => {
    // This is the actual bug, proven at the integration level rather than
    // in each system's own isolated unit test: the encounter system used
    // to be unable to resolve these characters at all (no
    // characterDatabase entry existed), so even though dialogueSystem.ts
    // had scenes written for them, nothing in the live game could ever
    // reach getDialogueScene with a matching ID. main.ts's own call site
    // sources characterId from exactly this getAvailableEncounters()
    // result (see main.ts's dialogue-trigger code), so this is the real
    // path a player takes, not a shortcut around it.
    test("knight.ember, knight.glacier, knight.rift are available before their gate stage is cleared, and resolve to a real dialogue scene", () => {
      const manager = new CharacterRelationshipManager();
      const available = manager.getAvailableEncounters([], [], 0);
      for (const knightId of ["knight.ember", "knight.glacier", "knight.rift"]) {
        const character = available.find((c) => c.id === knightId);
        expect(character).toBeDefined();
        expect(getDialogueScene(character!.id)).toBeDefined();
      }
    });

    test("knight.ember disappears once its gate stage (ash-crest) is cleared, matching the boss's own encounter window", () => {
      const manager = new CharacterRelationshipManager();
      expect(manager.getAvailableEncounters([], [], 0).some((c) => c.id === "knight.ember")).toBe(true);
      expect(manager.getAvailableEncounters([], ["ash-crest"], 0).some((c) => c.id === "knight.ember")).toBe(false);
    });

    test("knight.tide only becomes available after its time gate, and then resolves to a real dialogue scene", () => {
      const manager = new CharacterRelationshipManager();
      expect(manager.getAvailableEncounters([], [], 0).some((c) => c.id === "knight.tide")).toBe(false);
      const available = manager.getAvailableEncounters([], [], 150);
      const tide = available.find((c) => c.id === "knight.tide");
      expect(tide).toBeDefined();
      expect(getDialogueScene(tide!.id)).toBeDefined();
    });

    test("knight.cogline and knight.ice-thread, already reachable via encounters, now resolve to a real dialogue scene too", () => {
      const manager = new CharacterRelationshipManager();
      const cogline = manager.getAvailableEncounters([], [], 0).find((c) => c.id === "knight.cogline");
      const iceThread = manager.getAvailableEncounters(["frozen-cavern"], [], 0).find((c) => c.id === "knight.ice-thread");
      expect(cogline).toBeDefined();
      expect(iceThread).toBeDefined();
      expect(getDialogueScene(cogline!.id)).toBeDefined();
      expect(getDialogueScene(iceThread!.id)).toBeDefined();
    });
  });
});

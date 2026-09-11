import { GameSaveData, loadFromStorage, parseSaveData, saveToStorage, serializeSaveData } from "./gamePersistence";

const sampleSave = (): GameSaveData => ({
  schemaVersion: 1,
  savedAtIso: "2026-09-08T00:00:00.000Z",
  progression: { currentStageIndex: 1, unlockedStageIndex: 1, bestClearRank: 1, totalWins: 2, totalLosses: 1 },
  story: { worldTimeSeconds: 42, discoveredLoreIds: [], completedEventIds: [], completedRaceIds: [], completedMysteryReactionIds: [] },
  world: { visitedRegions: ["volcanic-basin"], completedStages: ["intro-gate"], factionStates: [] },
  team: { player: { id: "character.protagonist", name: "The Main Character", role: "protagonist", personalityNotes: [] }, memberIds: [], activeMemberId: null },
  relationships: [],
  bossGates: {},
  upgrades: { materials: { "grip-fiber": 2 }, upgradeLevels: { "reinforced-grip": 1 } },
  npcServices: { repairIntegrity: 1, discoveredRouteHints: [], forecastedStageIds: [] },
  racingStyle: { selectedStyleId: "sunlit-comet" },
});

describe("game persistence", () => {
  test("round-trips a versioned save payload", () => {
    const parsed = parseSaveData(serializeSaveData(sampleSave()));
    expect(parsed?.schemaVersion).toBe(1);
    expect(parsed?.progression.currentStageIndex).toBe(1);
    expect(parsed?.upgrades.upgradeLevels["reinforced-grip"]).toBe(1);
  });

  test("rejects malformed and unsupported saves", () => {
    expect(parseSaveData("not json")).toBeNull();
    expect(parseSaveData(JSON.stringify({ schemaVersion: 999 }))).toBeNull();
    expect(parseSaveData(JSON.stringify({ schemaVersion: 1 }))).toBeNull();
  });

  test("sanitizes hostile nested values and caps upgrade levels", () => {
    const parsed = parseSaveData(JSON.stringify({
      ...sampleSave(),
      savedAtIso: "not a date",
      progression: { currentStageIndex: -4, unlockedStageIndex: "bad", bestClearRank: 3.8, totalWins: 2, totalLosses: -9 },
      story: { worldTimeSeconds: -20, discoveredLoreIds: ["lore.a", 4, "lore.a"], completedEventIds: null, completedRaceIds: [] },
      upgrades: { materials: { "grip-fiber": -10, "frost-resin": 2.7 }, upgradeLevels: { "reinforced-grip": 999 } },
    }));
    expect(parsed?.progression.currentStageIndex).toBe(0);
    expect(parsed?.progression.unlockedStageIndex).toBe(0);
    expect(parsed?.progression.bestClearRank).toBe(3);
    expect(parsed?.upgrades.materials["grip-fiber"]).toBe(0);
    expect(parsed?.upgrades.upgradeLevels["reinforced-grip"]).toBe(2);
    expect(parsed?.story.completedMysteryReactionIds).toEqual([]);
  });

  test("retains valid mystery reaction completion across a save round trip", () => {
    const save = sampleSave();
    save.story.completedMysteryReactionIds = ["reaction.aether-open-sky"];
    const parsed = parseSaveData(serializeSaveData(save));
    expect(parsed?.story.completedMysteryReactionIds).toEqual(["reaction.aether-open-sky"]);
  });

  test("falls back to the previous save when the primary payload is damaged", () => {
    const values = new Map<string, string>();
    const storage = {
      get length() { return values.size; },
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      key: (index: number) => [...values.keys()][index] ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => { values.set(key, value); },
    } as Storage;
    expect(saveToStorage(sampleSave(), storage)).toBe(true);
    expect(saveToStorage({ ...sampleSave(), progression: { ...sampleSave().progression, totalWins: 8 } }, storage)).toBe(true);
    storage.setItem("rollout-save-v1", "damaged");
    expect(loadFromStorage(storage)?.progression.totalWins).toBe(2);
  });
});

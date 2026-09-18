import { CHARACTER_DATABASE_ALL, CHARACTER_DATABASE_BATCH_01, getCharacterById, getCharactersByFunction } from "./characterDatabase";
import { CHARACTER_DATABASE_BATCH_02 } from "./characterDatabaseBatch02";

describe("character database batch 02", () => {
  test("adds twenty distinct characters without changing batch 01", () => {
    expect(CHARACTER_DATABASE_BATCH_01).toHaveLength(20);
    expect(CHARACTER_DATABASE_BATCH_02).toHaveLength(20);
    expect(CHARACTER_DATABASE_ALL).toHaveLength(64);
    expect(new Set(CHARACTER_DATABASE_ALL.map((character) => character.id)).size).toBe(64);
  });

  test("makes batch 02 queryable by the same roster API", () => {
    expect(getCharacterById("npc.hollow-gear")?.name).toBe("Hollow Gear");
    expect(getCharactersByFunction("knight").length).toBeGreaterThanOrEqual(6);
    expect(CHARACTER_DATABASE_BATCH_02.every((character) => character.storyUse.length > 20)).toBe(true);
  });
});

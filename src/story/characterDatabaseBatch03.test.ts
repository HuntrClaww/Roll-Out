import { CHARACTER_DATABASE_ALL, getCharacterById, getCharactersByFunction } from "./characterDatabase";
import { CHARACTER_DATABASE_BATCH_03 } from "./characterDatabaseBatch03";

describe("character database batch 03", () => {
  test("adds twenty-four distinct mystery, regional, and gate-knight characters", () => {
    expect(CHARACTER_DATABASE_BATCH_03).toHaveLength(24);
    expect(CHARACTER_DATABASE_ALL).toHaveLength(64);
    expect(new Set(CHARACTER_DATABASE_ALL.map((character) => character.id)).size).toBe(64);
  });

  test("keeps the roster varied instead of adding only rivals", () => {
    expect(getCharacterById("npc.marble-archivist")?.loreWeight).toBe("heavy");
    expect(getCharacterById("npc.pebble-prince")?.loreWeight).toBe("light");
    expect(getCharactersByFunction("knight").length).toBeGreaterThanOrEqual(6);
    expect(getCharactersByFunction("guide").length).toBeGreaterThanOrEqual(3);
  });
});

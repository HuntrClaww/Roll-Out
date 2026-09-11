import { CHARACTER_DATABASE_BATCH_01, getCharactersByFunction } from "./characterDatabase";

describe("character database batch 01", () => {
  test("contains twenty distinct characters", () => {
    const ids = CHARACTER_DATABASE_BATCH_01.map((character) => character.id);
    expect(CHARACTER_DATABASE_BATCH_01).toHaveLength(20);
    expect(new Set(ids).size).toBe(20);
  });

  test("keeps minor characters more numerous than bosses", () => {
    const bosses = getCharactersByFunction("boss").length;
    const supportingRoles = CHARACTER_DATABASE_BATCH_01.filter((character) =>
      ["supporting", "background", "event-contact", "world-worker", "friend", "acquaintance"].includes(character.function),
    ).length;
    expect(bosses).toBe(5);
    expect(supportingRoles).toBeGreaterThan(bosses);
  });

  test("gives every character a usable narrative purpose", () => {
    for (const character of CHARACTER_DATABASE_BATCH_01) {
      expect(character.origin.length).toBeGreaterThan(10);
      expect(character.storyUse.length).toBeGreaterThan(20);
      expect(character.personality.length).toBeGreaterThan(1);
      expect(character.traits.length).toBeGreaterThan(1);
    }
  });
});

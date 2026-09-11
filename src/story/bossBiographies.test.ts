import { BOSS_BIOGRAPHIES, getBossBiography } from "./bossBiographies";

describe("boss biographies", () => {
  test("contains one unlockable biography for every Batch 01 boss", () => {
    expect(BOSS_BIOGRAPHIES).toHaveLength(5);
    expect(new Set(BOSS_BIOGRAPHIES.map((entry) => entry.bossId)).size).toBe(5);
    for (const entry of BOSS_BIOGRAPHIES) {
      expect(entry.abilityExplanation.length).toBeGreaterThan(120);
      expect(entry.biography.length).toBeGreaterThan(2200);
      expect(getBossBiography(entry.bossId)).toBe(entry);
    }
  });
});

import { CHARACTER_VISUAL_PROFILES, NPC_SERVICES, getCharacterVisualProfile, getNpcService } from "./characterPresentation";

describe("character presentation and services", () => {
  test("gives every Batch 01 character a readable visual identity", () => {
    expect(CHARACTER_VISUAL_PROFILES).toHaveLength(60);
    expect(new Set(CHARACTER_VISUAL_PROFILES.map((profile) => profile.characterId)).size).toBe(60);
    for (const profile of CHARACTER_VISUAL_PROFILES) {
      expect(profile.primaryColor).toMatch(/^#[0-9A-F]{6}$/i);
      expect(profile.accentColor).toMatch(/^#[0-9A-F]{6}$/i);
      expect(profile.silhouette.length).toBeGreaterThan(10);
      expect(getCharacterVisualProfile(profile.characterId)).toBe(profile);
    }
  });

  test("gives support characters practical repeatable services", () => {
    expect(NPC_SERVICES.length).toBeGreaterThanOrEqual(10);
    expect(getNpcService("npc.pip-salvage", "upgrade-crafting")?.repeatable).toBe(true);
    expect(getNpcService("npc.vela-cartographer", "cartography")?.name).toBe("Route Fragment Mapping");
    expect(getNpcService("npc.ora-bridgekeeper", "forecast")?.name).toBe("Bridge Safety Check");
    expect(getNpcService("character.static", "repair")).toBeUndefined();
  });
});

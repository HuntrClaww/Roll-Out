import { DIALOGUE_SCENES, getDialogueScene, MYSTERY_REACTIVE_DIALOGUE_SCENES } from "./dialogueSystem";

describe("dialogue system", () => {
  test("provides compact scenes for the first encounter layer", () => {
    expect(DIALOGUE_SCENES.length).toBeGreaterThanOrEqual(8);
    for (const scene of DIALOGUE_SCENES) {
      expect(scene.characterId.length).toBeGreaterThan(3);
      expect(scene.lines.length).toBe(3);
      expect(scene.lines.every((line) => line.length > 10)).toBe(true);
      expect(getDialogueScene(scene.characterId)).toBe(scene);
    }
  });

  test("every reactive scene is well-formed and belongs to a character with a base scene", () => {
    expect(MYSTERY_REACTIVE_DIALOGUE_SCENES.length).toBeGreaterThanOrEqual(6);
    for (const scene of MYSTERY_REACTIVE_DIALOGUE_SCENES) {
      expect(scene.lines.length).toBe(3);
      expect(scene.lines.every((line) => line.length > 10)).toBe(true);
      expect(DIALOGUE_SCENES.some((base) => base.characterId === scene.characterId)).toBe(true);
    }
  });

  test("without thread-status context, evidence-bearing characters still return their base scene", () => {
    const base = DIALOGUE_SCENES.find((scene) => scene.characterId === "npc.marble-archivist");
    expect(getDialogueScene("npc.marble-archivist")).toBe(base);
  });

  test("a reactive scene only replaces the base scene once its thread meets the required status", () => {
    const base = DIALOGUE_SCENES.find((scene) => scene.characterId === "npc.marble-archivist");
    const reactive = MYSTERY_REACTIVE_DIALOGUE_SCENES.find((scene) => scene.characterId === "npc.marble-archivist");

    expect(getDialogueScene("npc.marble-archivist", { "creator-intent": "hinted" })).toBe(base);
    expect(getDialogueScene("npc.marble-archivist", { "creator-intent": "supported" })).toBe(reactive);
    expect(getDialogueScene("npc.marble-archivist", { "creator-intent": "converging" })).toBe(reactive);
  });

  test("prefers the more advanced eligible reaction when a thread serves two characters at different tiers", () => {
    const archivistReaction = MYSTERY_REACTIVE_DIALOGUE_SCENES.find((scene) => scene.characterId === "npc.marble-archivist");
    const vaultkeeperReaction = MYSTERY_REACTIVE_DIALOGUE_SCENES.find((scene) => scene.characterId === "npc.vaultkeeper-io");

    expect(getDialogueScene("npc.vaultkeeper-io", { "creator-intent": "supported" }))
      .toBe(DIALOGUE_SCENES.find((scene) => scene.characterId === "npc.vaultkeeper-io"));
    expect(getDialogueScene("npc.vaultkeeper-io", { "creator-intent": "converging" })).toBe(vaultkeeperReaction);
    expect(getDialogueScene("npc.marble-archivist", { "creator-intent": "converging" })).toBe(archivistReaction);
  });

  test("an unrelated thread reaching high status does not trigger a character's reaction", () => {
    const base = DIALOGUE_SCENES.find((scene) => scene.characterId === "npc.tally-nine");
    expect(getDialogueScene("npc.tally-nine", { "movement-impulse": "converging" })).toBe(base);
  });

  test("all four knights — an elite tier with full stat profiles — have a dialogue scene", () => {
    for (const knightId of ["knight_ember", "knight_glacier", "knight_tide", "knight_rift"]) {
      const scene = getDialogueScene(knightId);
      expect(scene).toBeDefined();
      expect(scene!.lines.length).toBe(3);
    }
  });
});

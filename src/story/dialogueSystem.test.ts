import { DIALOGUE_SCENES, getDialogueScene } from "./dialogueSystem";

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
});

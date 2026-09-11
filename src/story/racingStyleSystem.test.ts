import { RACING_STYLE_PROFILES, RacingStyleManager } from "./racingStyleSystem";

describe("racing style system", () => {
  test("provides varied visual-only racing styles", () => {
    expect(RACING_STYLE_PROFILES.length).toBeGreaterThanOrEqual(5);
    expect(new Set(RACING_STYLE_PROFILES.map((style) => style.shellPattern)).size).toBeGreaterThanOrEqual(4);
    expect(new Set(RACING_STYLE_PROFILES.map((style) => style.trailStyle)).size).toBeGreaterThanOrEqual(4);
    expect(RACING_STYLE_PROFILES.every((style) => style.gameplayImpact === "visual-only")).toBe(true);
  });

  test("cycles and restores the selected style safely", () => {
    const manager = new RacingStyleManager();
    const first = manager.getSelectedStyle().id;
    const second = manager.cycleStyle(1).id;
    expect(second).not.toBe(first);
    const restored = new RacingStyleManager();
    restored.loadState(manager.getState());
    expect(restored.getSelectedStyle().id).toBe(second);
    restored.loadState({ selectedStyleId: "invalid-style" });
    expect(restored.getSelectedStyle().id).toBe(second);
  });
});

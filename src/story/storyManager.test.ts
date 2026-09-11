import { StoryManager } from "./storyManager";

describe("flexible story timing", () => {
  test("does not expose an event before its opening window", () => {
    const manager = new StoryManager();
    expect(manager.getAvailableEvents("intro-gate")).toHaveLength(0);
    manager.advanceTime(3);
    expect(manager.getAvailableEvents("intro-gate").map((event) => event.id)).toContain("event.first-finish-anomaly");
  });

  test("a completed race unlocks its lore without exact timing", () => {
    const manager = new StoryManager();
    manager.advanceTime(3);
    const lore = manager.recordRaceFinished("race-1", true, "intro-gate");
    expect(lore.map((entry) => entry.id)).toContain("lore.finish-line-patterns");
  });

  test("optional event expiry does not delete discovered lore", () => {
    const manager = new StoryManager();
    manager.advanceTime(30);
    const event = manager.getAvailableEvents().find((candidate) => candidate.id === "event.creator-marking");
    expect(event).toBeDefined();
    manager.completeEvent(event!.id);
    manager.advanceTime(200);
    expect(manager.getDiscoveredLore().map((entry) => entry.id)).toContain("lore.creator-traces");
  });

  test("keeps optional events available after their preferred presentation window", () => {
    const manager = new StoryManager();
    manager.advanceTime(240);
    expect(manager.getAvailableEvents().map((event) => event.id)).toContain("event.creator-marking");
  });

  test("allows the player to accept an available event without exact timing", () => {
    const manager = new StoryManager();
    manager.advanceTime(15);
    expect(manager.completeNextAvailableEvent()).toHaveLength(1);
    expect(manager.getState().completedEventIds).toContain("event.movement-question");
  });

  test("persists valid mystery reactions and rejects duplicates or unknown IDs", () => {
    const manager = new StoryManager();
    expect(manager.completeMysteryReaction("reaction.aether-open-sky")).toBe(true);
    expect(manager.completeMysteryReaction("reaction.aether-open-sky")).toBe(false);
    expect(manager.completeMysteryReaction("reaction.not-real")).toBe(false);
    expect(manager.getState().completedMysteryReactionIds).toEqual(["reaction.aether-open-sky"]);

    const restored = new StoryManager();
    restored.loadState({
      ...manager.getState(),
      completedMysteryReactionIds: ["reaction.aether-open-sky", "reaction.not-real"],
    });
    expect(restored.getCompletedMysteryReactionIds()).toEqual(["reaction.aether-open-sky"]);
  });
});

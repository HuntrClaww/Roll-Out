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

  test("regression: lore.maintenance-label is actually discoverable now, not permanently unreachable", () => {
    // lore.maintenance-label existed as fully-written content and as
    // required mystery-thread evidence (mysteryConvergence.ts), but no
    // STORY_EVENT referenced it - discoveredLoreIds is only ever
    // populated through an event's loreEntryIds, so it could never
    // actually be discovered by a player before this fix.
    const manager = new StoryManager();
    expect(manager.getAvailableEvents().map((event) => event.id)).not.toContain("event.maintenance-sign-discovery");
    manager.advanceTime(40);
    const event = manager.getAvailableEvents().find((candidate) => candidate.id === "event.maintenance-sign-discovery");
    expect(event).toBeDefined();
    const lore = manager.completeEvent(event!.id);
    expect(lore.map((entry) => entry.id)).toContain("lore.maintenance-label");
    expect(manager.getDiscoveredLore().map((entry) => entry.id)).toContain("lore.maintenance-label");
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

  test("persists valid recall cascade beats and rejects duplicates or unknown IDs", () => {
    const manager = new StoryManager();
    expect(manager.completeRecallCascade("recall.thats-twice-now")).toBe(true);
    expect(manager.completeRecallCascade("recall.thats-twice-now")).toBe(false);
    expect(manager.completeRecallCascade("recall.not-real")).toBe(false);
    expect(manager.getState().completedRecallCascadeIds).toEqual(["recall.thats-twice-now"]);

    const restored = new StoryManager();
    restored.loadState({
      ...manager.getState(),
      completedRecallCascadeIds: ["recall.thats-twice-now", "recall.not-real"],
    });
    expect(restored.getCompletedRecallCascadeIds()).toEqual(["recall.thats-twice-now"]);
  });
});

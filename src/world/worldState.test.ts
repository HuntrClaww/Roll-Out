import { WorldStateManager } from "./worldState";

describe("world state and faction relationships", () => {
  test("records regions and successful stage completion", () => {
    const world = new WorldStateManager();
    world.visitRegion("volcanic-basin");
    world.completeStage("ash-crest", "Ash Banner", true);
    const state = world.getState();
    expect(state.visitedRegions).toContain("volcanic-basin");
    expect(state.completedStages).toContain("ash-crest");
    expect(world.getFactionState("ash-banner").band).toBe("neutral");
  });

  test("keeps faction standing bounded and treats losses as smaller changes", () => {
    const world = new WorldStateManager();
    world.completeStage("ash-crest", "Ash Banner", false);
    expect(world.getFactionState("ash-banner").standing).toBe(-3);
    world.adjustFactionStanding("ash-banner", -1000);
    expect(world.getFactionState("ash-banner").standing).toBe(-100);
  });

  test("registers factions used by recurring rivals and bosses", () => {
    const world = new WorldStateManager();
    expect(world.getFactionState("sky-dominion").name).toBe("Sky Dominion");
    expect(world.getFactionState("amber-circuit").band).toBe("neutral");
    expect(world.getFactionState("crimson-zero").standing).toBe(0);
  });
});

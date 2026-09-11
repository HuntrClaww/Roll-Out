import { ChallengeSystem } from "./challengeSystem";
import { resolveObstacleCollision, TrackObstacle } from "./obstacle";
import { RaceManager } from "./raceManager";
import { StageManager } from "./stageManager";
import { Marble, Vector3 } from "../physics/marble";

describe("stage progression and encounter mapping", () => {
  const manager = new StageManager();

  test("maps a known stage ID to its own rule list and boss", () => {
    expect(manager.generateStageEncounter("ash-crest", 1).raceRule).toBe("standard");
    expect(manager.generateStageEncounter("ash-crest", 2).raceRule).toBe("duel");
    expect(manager.generateStageEncounter("ash-crest", 1).boss.name).toBe("Cinder Axis");
  });

  test("normalizes inconsistent progress before advancing", () => {
    const state = manager.advanceProgress({
      currentStageIndex: 2,
      unlockedStageIndex: 0,
      bestClearRank: -1,
      totalWins: -2,
      totalLosses: -3,
    }, false);
    expect(state.unlockedStageIndex).toBe(2);
    expect(state.totalWins).toBe(0);
    expect(state.totalLosses).toBe(1);
  });
});

describe("challenge selection and completion", () => {
  const system = new ChallengeSystem();

  test("gates advanced challenges by difficulty", () => {
    expect(system.selectChallenge(0.5, ["boss-challenge", "standard"]).rule).toBe("standard");
    expect(system.selectChallenge(1.0, ["boss-challenge"]).rule).toBe("boss-challenge");
  });

  test("checkpoint and opponent requirements affect completion", () => {
    const checkpoint = system.getChallengeByRule("checkpoint");
    const duel = system.getChallengeByRule("duel");
    expect(checkpoint).toBeDefined();
    expect(duel).toBeDefined();
    expect(system.evaluateRaceCompletion(checkpoint!, 1, 0.9, 2)).toBe(false);
    expect(system.evaluateRaceCompletion(checkpoint!, 1, 0.9, 3)).toBe(true);
    expect(system.evaluateRaceCompletion(duel!, 1, 1, 0)).toBe(false);
  });
});

describe("obstacle and winner resolution", () => {
  test("does not collide when the marble is vertically separated", () => {
    const marble = new Marble(new Vector3(0, 3, 0));
    const obstacle: TrackObstacle = { id: "test", name: "Test", position: new Vector3(0, 0, 0), radius: 0.5, bounce: 0.2, description: "" };
    expect(resolveObstacleCollision(marble, obstacle)).toBe(false);
  });

  test("resolves a 3D overlap", () => {
    const marble = new Marble(new Vector3(0.1, 0, 0));
    const obstacle: TrackObstacle = { id: "test", name: "Test", position: new Vector3(0, 0, 0), radius: 0.5, bounce: 0.2, description: "" };
    expect(resolveObstacleCollision(marble, obstacle)).toBe(true);
    expect(marble.position.length()).toBeGreaterThanOrEqual(marble.radius + obstacle.radius - 0.001);
  });

  test("does not award a tied background battle to the player", () => {
    const manager = new RaceManager();
    const racer = { speed: 0.8, control: 0.8 } as any;
    expect(manager.resolveBackgroundTeamBattle([racer], [racer], 1).winner).toBe("enemy");
  });
});

import { ChallengeSystem } from "./challengeSystem";
import { BossChallengeProgression } from "./bossChallengeProgression";

describe("boss challenge progression", () => {
  test("requires the configured preparation rule before unlocking a boss", () => {
    const progression = new BossChallengeProgression();
    const challenges = new ChallengeSystem();
    const checkpoint = challenges.getChallengeByRule("checkpoint")!;
    expect(progression.isBossChallengeUnlocked("intro-gate")).toBe(false);
    progression.recordRaceResult("intro-gate", checkpoint, false);
    expect(progression.isBossChallengeUnlocked("intro-gate")).toBe(false);
    progression.recordRaceResult("intro-gate", checkpoint, true);
    expect(progression.isBossChallengeUnlocked("intro-gate")).toBe(true);
  });

  test("requires every preparation rule for multi-step gates", () => {
    const progression = new BossChallengeProgression();
    const challenges = new ChallengeSystem();
    const checkpoint = challenges.getChallengeByRule("checkpoint")!;
    const duel = challenges.getChallengeByRule("duel")!;
    progression.recordRaceResult("frost-veil", checkpoint, true);
    expect(progression.isBossChallengeUnlocked("frost-veil")).toBe(false);
    progression.recordRaceResult("frost-veil", duel, true);
    expect(progression.isBossChallengeUnlocked("frost-veil")).toBe(true);
  });
});

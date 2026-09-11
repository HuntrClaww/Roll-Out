import { BOSS_GATE_DEFINITIONS } from "./bossChallengeProgression";
import { BossChallengeProgression } from "./bossChallengeProgression";
import { ChallengeSystem } from "./challengeSystem";
import { runProgressionReadinessAudit } from "./progressionReadinessAudit";
import { StageManager } from "./stageManager";

describe("progression readiness audit", () => {
  test("every current boss gate can be completed from its stage rules", () => {
    const audit = runProgressionReadinessAudit();
    expect(audit.stageCount).toBe(5);
    expect(audit.stageIdsUnique).toBe(true);
    expect(audit.bossGateCoverage).toBe(true);
    expect(audit.preparationRuleCoverage).toBe(true);
    expect(audit.bossRuleCoverage).toBe(true);
    expect(audit.challengeRuleCoverage).toBe(true);
    expect(audit.difficultyMonotonic).toBe(true);
    expect(audit.rewardMonotonic).toBe(true);
    expect(audit.ready).toBe(true);
    expect(audit.errors).toEqual([]);
  });

  test("simulates encounter-rule coverage for every boss preparation requirement", () => {
    const manager = new StageManager();
    for (const stage of manager.getStages()) {
      const observedRules = new Set(
        Array.from({ length: stage.raceRules.length }, (_, index) => manager.generateStageEncounter(stage.id, index + 1).raceRule),
      );
      const gate = BOSS_GATE_DEFINITIONS.find((definition) => definition.stageId === stage.id);
      for (const requiredRule of gate?.preparationRules ?? []) {
        expect(observedRules.has(requiredRule)).toBe(true);
      }
    }
  });

  test("simulates sequential clears without losing the unlock frontier", () => {
    const manager = new StageManager();
    let progress = manager.createInitialProgress();
    for (let index = 0; index < manager.getStages().length; index += 1) {
      expect(manager.isStageUnlocked(progress.unlockedStageIndex, index)).toBe(true);
      progress = manager.advanceProgress(progress, true, true);
      expect(progress.unlockedStageIndex).toBeGreaterThanOrEqual(progress.currentStageIndex);
    }
    expect(progress.currentStageIndex).toBe(manager.getStages().length - 1);
    expect(progress.totalWins).toBe(manager.getStages().length);
  });

  test("simulates failed preparation, partial gate save, and resumed boss unlock", () => {
    const challenges = new ChallengeSystem();
    for (const definition of BOSS_GATE_DEFINITIONS) {
      const progression = new BossChallengeProgression();
      const firstRule = challenges.getChallengeByRule(definition.preparationRules[0])!;
      progression.recordRaceResult(definition.stageId, firstRule, false);
      expect(progression.isBossChallengeUnlocked(definition.stageId)).toBe(false);

      for (const rule of definition.preparationRules.slice(0, -1)) {
        progression.recordRaceResult(definition.stageId, challenges.getChallengeByRule(rule)!, true);
      }
      const partialSave = progression.getSnapshot();
      const restored = new BossChallengeProgression();
      restored.loadSnapshot(partialSave);
      expect(restored.isBossChallengeUnlocked(definition.stageId)).toBe(false);

      const finalRule = definition.preparationRules[definition.preparationRules.length - 1];
      restored.recordRaceResult(definition.stageId, challenges.getChallengeByRule(finalRule)!, true);
      expect(restored.isBossChallengeUnlocked(definition.stageId)).toBe(true);
    }
  });
});

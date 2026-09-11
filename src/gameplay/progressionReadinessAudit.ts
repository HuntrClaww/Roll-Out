import { BOSS_GATE_DEFINITIONS } from "./bossChallengeProgression";
import { ChallengeSystem } from "./challengeSystem";
import { StageManager } from "./stageManager";

export interface ProgressionReadinessAudit {
  stageCount: number;
  stageIdsUnique: boolean;
  bossGateCoverage: boolean;
  preparationRuleCoverage: boolean;
  bossRuleCoverage: boolean;
  challengeRuleCoverage: boolean;
  difficultyMonotonic: boolean;
  rewardMonotonic: boolean;
  uniqueBossNames: boolean;
  errors: string[];
  warnings: string[];
  ready: boolean;
}

/** Static checks for progression data that ordinary unit tests may not exercise. */
export const runProgressionReadinessAudit = (): ProgressionReadinessAudit => {
  const stages = new StageManager().getStages();
  const challenges = new ChallengeSystem().listChallenges();
  const stageIds = new Set(stages.map((stage) => stage.id));
  const bossNames = new Set(stages.map((stage) => stage.bossName));
  const challengeRules = new Set(challenges.map((challenge) => challenge.rule));
  const errors: string[] = [];
  const warnings: string[] = [];

  const stageIdsUnique = stageIds.size === stages.length;
  if (!stageIdsUnique) errors.push("Stage IDs must be unique.");

  const bossGateCoverage = BOSS_GATE_DEFINITIONS.every((definition) => stageIds.has(definition.stageId));
  if (!bossGateCoverage) errors.push("Every boss gate must reference an existing stage.");

  const preparationRuleCoverage = BOSS_GATE_DEFINITIONS.every((definition) => {
    const stage = stages.find((candidate) => candidate.id === definition.stageId);
    return stage !== undefined && definition.preparationRules.every((rule) => stage.raceRules.includes(rule));
  });
  if (!preparationRuleCoverage) errors.push("Every boss preparation rule must be offered by its stage.");

  const bossRuleCoverage = stages.every((stage) => stage.raceRules.includes("boss-challenge"));
  if (!bossRuleCoverage) errors.push("Every boss stage must offer a boss-challenge rule.");

  const challengeRuleCoverage = stages.every((stage) => stage.raceRules.every((rule) => challengeRules.has(rule)));
  if (!challengeRuleCoverage) errors.push("Every stage rule must have a ChallengeSystem template.");

  const difficultyMonotonic = stages.every((stage, index) => index === 0 || stage.difficulty >= stages[index - 1].difficulty);
  if (!difficultyMonotonic) warnings.push("Stage difficulty decreases between one or more consecutive stages.");

  const rewardMonotonic = stages.every((stage, index) => index === 0 || stage.rewardMultiplier >= stages[index - 1].rewardMultiplier);
  if (!rewardMonotonic) warnings.push("Stage reward multipliers decrease between one or more consecutive stages.");

  const uniqueBossNames = bossNames.size === stages.length;
  if (!uniqueBossNames) warnings.push("Multiple stages share a boss name.");

  return {
    stageCount: stages.length,
    stageIdsUnique,
    bossGateCoverage,
    preparationRuleCoverage,
    bossRuleCoverage,
    challengeRuleCoverage,
    difficultyMonotonic,
    rewardMonotonic,
    uniqueBossNames,
    errors,
    warnings,
    ready: errors.length === 0,
  };
};


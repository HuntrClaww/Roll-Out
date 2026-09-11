import {
  DEFAULT_STAGE_ROSTER,
  OpponentProfile,
  StageEncounter,
  PHASE2_MAGIC_RULES,
} from "./opponentTypes";

export class OpponentManager {
  private readonly maxMinionsPerStage = 12;

  public generateStage(
    stageId: string,
    levelNumber: number,
    raceRule: "standard" | "duel" | "boss-challenge" | "team-battle" | "checkpoint",
    bossName: string = DEFAULT_STAGE_ROSTER.bosses[0].name,
    faction?: string,
  ): StageEncounter {
    const boss = structuredClone(DEFAULT_STAGE_ROSTER.bosses[0]);
    boss.name = bossName;
    boss.id = `boss_${stageId}`;
    if (faction) boss.faction = faction;
    const knights = DEFAULT_STAGE_ROSTER.knights.slice(0, 4);
    const rivals = DEFAULT_STAGE_ROSTER.rivals.slice(0, Math.min(2 + Math.floor(levelNumber / 2), DEFAULT_STAGE_ROSTER.rivals.length));
    const minionCount = Math.min(this.maxMinionsPerStage, 5 + levelNumber * 2);
    const minions = Array.from({ length: minionCount }, (_, index) => this.createMinion(index, levelNumber));

    const difficulty = clamp(0.4 + levelNumber * 0.12 + (raceRule === "boss-challenge" ? 0.25 : 0), 0.4, 1.2);

    return {
      stageId: `${stageId}-${levelNumber}`,
      encounterName: raceRule === "boss-challenge" ? `Boss challenge ${levelNumber}` : `Stage ${levelNumber} encounter`,
      boss,
      knights: knights.map((knight) => structuredClone(knight)),
      rivals: rivals.map((rival) => structuredClone(rival)),
      minions,
      raceRule,
      difficulty,
    };
  }

  public createBossWithKnights(stageName: string): { boss: OpponentProfile; knights: OpponentProfile[] } {
    const boss = structuredClone(DEFAULT_STAGE_ROSTER.bosses[0]);
    const knights = DEFAULT_STAGE_ROSTER.knights.map((knight) => structuredClone(knight));

    boss.name = `${boss.name} - ${stageName}`;
    boss.magicPotential = clamp(boss.magicPotential + 0.12, 0, 1);

    return { boss, knights };
  }

  public createMinion(index: number, levelNumber: number): OpponentProfile {
    const base = structuredClone(DEFAULT_STAGE_ROSTER.minions[0]);
    const suffix = String(index + 1).padStart(2, "0");
    base.id = `minion_${levelNumber}_${suffix}`;
    base.name = `Minion ${suffix}`;
    base.difficulty = clamp(base.difficulty + levelNumber * 0.035, 0.2, 0.9);
    base.speed = clamp(base.speed + levelNumber * 0.015, 0.2, 1);
    base.intelligence = clamp(base.intelligence + levelNumber * 0.01, 0.2, 1);
    return base;
  }

  public explainMagicRules(): string {
    return `${PHASE2_MAGIC_RULES.scientificPrinciple} ${PHASE2_MAGIC_RULES.designRule}`;
  }
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export const createDefaultStageEncounter = (stageId: string, levelNumber: number): StageEncounter => {
  const manager = new OpponentManager();
  return manager.generateStage(stageId, levelNumber, "standard");
};

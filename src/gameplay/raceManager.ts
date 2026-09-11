import { OpponentProfile, RaceRule } from "./opponentTypes";

export interface RaceSelection {
  rule: RaceRule;
  trackId: string;
  seed: number;
  fairness: number;
  rewardMultiplier: number;
}

export class RaceManager {
  public selectRace(rulePool: RaceRule[], trackId: string, fairnessSeed: number): RaceSelection {
    const pool: RaceRule[] = rulePool.length > 0 ? rulePool : (["standard", "duel", "checkpoint"] as RaceRule[]);
    const selectedRule: RaceRule = pool[Math.floor(Math.abs(fairnessSeed) % pool.length)];

    const fairness = clamp((Math.sin(fairnessSeed) + 1) / 2, 0.1, 0.99);
    const rewardMultiplier = clamp(1 + fairness * 1.25, 1, 2.5);

    return {
      rule: selectedRule,
      trackId,
      seed: fairnessSeed,
      fairness,
      rewardMultiplier,
    };
  }

  public resolveBackgroundTeamBattle(
    playerTeam: OpponentProfile[],
    rivalTeam: OpponentProfile[],
    winThreshold: number
  ): { winner: "player" | "enemy"; results: { playerWins: number; rivalWins: number } } {
    const score = (team: OpponentProfile[]) =>
      team.reduce((total, racer) => total + ((racer.speed + racer.control) / 2 > 0.7 ? 1 : 0), 0);

    const playerWins = score(playerTeam);
    const rivalWins = score(rivalTeam);

    // Meeting the threshold is necessary, but a tied score is not a player win.
    // This prevents empty or tied background races from automatically favoring
    // the player team.
    const winner = playerWins >= winThreshold && playerWins > rivalWins ? "player" : "enemy";
    return {
      winner,
      results: {
        playerWins,
        rivalWins,
      },
    };
  }
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

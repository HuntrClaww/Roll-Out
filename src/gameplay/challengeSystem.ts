import { RaceRule } from "./opponentTypes";
import { OpponentProfile } from "./opponentTypes";

export interface ChallengeTemplate {
  id: string;
  name: string;
  rule: RaceRule;
  difficulty: number;
  rewardModifier: number;
  isBossBattle: boolean;
  isTeamBattle: boolean;
  isRivalDuel: boolean;
  targetThreat: number;
  requiresOpponentDefeat: boolean;
  checkpointRequirement: number;
}

export interface ChallengeState {
  activeChallenge: ChallengeTemplate | null;
  challengeProgress: number;
  difficultyWeight: number;
  fairness: number;
  rewardsUnlocked: number;
}

export class ChallengeSystem {
  private readonly templates: ChallengeTemplate[];

  constructor() {
    this.templates = [
      {
        id: "standard-1",
        name: "Standard Race",
        rule: "standard",
        difficulty: 0.4,
        rewardModifier: 1.0,
        isBossBattle: false,
        isTeamBattle: false,
        isRivalDuel: false,
        targetThreat: 0.45,
        requiresOpponentDefeat: false,
        checkpointRequirement: 0,
      },
      {
        id: "duel-1",
        name: "Rival Duel",
        rule: "duel",
        difficulty: 0.7,
        rewardModifier: 1.35,
        isBossBattle: false,
        isTeamBattle: false,
        isRivalDuel: true,
        targetThreat: 0.68,
        requiresOpponentDefeat: true,
        checkpointRequirement: 0,
      },
      {
        id: "checkpoint-1",
        name: "Checkpoint Rush",
        rule: "checkpoint",
        difficulty: 0.82,
        rewardModifier: 1.45,
        isBossBattle: false,
        isTeamBattle: false,
        isRivalDuel: false,
        targetThreat: 0.72,
        requiresOpponentDefeat: false,
        checkpointRequirement: 3,
      },
      {
        id: "boss-1",
        name: "Boss Challenge",
        rule: "boss-challenge",
        difficulty: 1.1,
        rewardModifier: 2.2,
        isBossBattle: true,
        isTeamBattle: false,
        isRivalDuel: false,
        targetThreat: 0.9,
        requiresOpponentDefeat: true,
        checkpointRequirement: 0,
      },
      {
        id: "team-1",
        name: "Team Battle",
        rule: "team-battle",
        difficulty: 1.25,
        rewardModifier: 2.8,
        isBossBattle: false,
        isTeamBattle: true,
        isRivalDuel: false,
        targetThreat: 0.96,
        requiresOpponentDefeat: true,
        checkpointRequirement: 3,
      },
    ];
  }

  public listChallenges(): ChallengeTemplate[] {
    return [...this.templates];
  }

  public getChallengeByRule(rule: RaceRule): ChallengeTemplate | undefined {
    return this.templates.find((template) => template.rule === rule);
  }

  public createChallengeState(): ChallengeState {
    return {
      activeChallenge: null,
      challengeProgress: 0,
      difficultyWeight: 0.5,
      fairness: 0.5,
      rewardsUnlocked: 0,
    };
  }

  public selectChallenge(stageDifficulty: number, ruleBias: RaceRule[] = ["standard", "duel", "checkpoint", "boss-challenge", "team-battle"]): ChallengeTemplate {
    const viable = this.templates.filter((template) => {
      if (!ruleBias.includes(template.rule)) return false;
      if (template.isBossBattle && stageDifficulty < 0.85) return false;
      if (template.isTeamBattle && stageDifficulty < 0.95) return false;
      return true;
    });

    const chosen = viable.sort((a, b) => Math.abs(a.difficulty - stageDifficulty) - Math.abs(b.difficulty - stageDifficulty))[0] ?? this.templates[0];
    return chosen;
  }

  public evaluateChallengeResult(
    playerScore: number,
    opponentScore: number,
    challenge: ChallengeTemplate
  ): { won: boolean; resultMultiplier: number } {
    const winBias = playerScore - opponentScore;
    const threatRule = challenge.targetThreat < 0.5 ? 0.05 : 0.12 + challenge.targetThreat * 0.18;
    const won = winBias >= threatRule || (challenge.targetThreat < 0.5 && playerScore >= opponentScore);
    const resultMultiplier = won ? challenge.rewardModifier : Math.max(0.25, challenge.rewardModifier * 0.55);

    return { won, resultMultiplier };
  }

  public evaluateRaceCompletion(
    challenge: ChallengeTemplate,
    playerProgress: number,
    opponentProgress: number,
    checkpointsCompleted: number,
  ): boolean {
    if (playerProgress < 1) return false;
    if (checkpointsCompleted < challenge.checkpointRequirement) return false;
    return !challenge.requiresOpponentDefeat || playerProgress > opponentProgress;
  }

  public evaluateTeamBattle(
    playerTeam: OpponentProfile[],
    enemyTeam: OpponentProfile[]
  ): { playerWins: number; enemyWins: number; winner: "player" | "enemy" } {
    // This is the live gate for the "team-battle" rule (main.ts wires it
    // directly into the win/loss decision for the Convergence Circuit
    // finale) - it used to count, on each side independently, how many
    // racers individually cleared a fixed (speed+control)/2 > 0.72 bar.
    // That was a real bug, not just a style issue: the protagonist's own
    // base stats average exactly 0.68 (see PLAYER_BATTLE_PROFILE in
    // playerTeam.ts), which never clears 0.72 by itself. A player who
    // hadn't recruited a specific strong-enough teammate would score 0
    // no matter how the actual race went, and since a tie already
    // resolves to "enemy" (see note below), that meant the final stage's
    // team-battle check - and therefore the stage itself, since it's
    // ANDed with real race completion in main.ts - was unwinnable
    // regardless of racing skill. It also didn't compare the two teams
    // relative to each other at all: a team that was collectively
    // stronger than its rivals overall could still lose if none of its
    // members individually happened to clear the same fixed bar.
    //
    // Fixed to compare total relative strength instead: whichever team's
    // combined (speed+control)/2 score is higher wins. This keeps "team
    // composition matters for team battles" intact (the stage's own
    // description calls it "demonstrate team coordination"), but the
    // comparison is now actually a comparison, not two independent
    // absolute pass/fail checks.
    const teamStrength = (team: OpponentProfile[]): number =>
      team.reduce((total, racer) => total + (racer.speed + racer.control) / 2, 0);

    // playerWins/enemyWins are kept in the return shape (existing callers
    // and any external reporting may read them) as a per-racer "cleared
    // a strong-racer bar" count - useful as a display stat - but they no
    // longer decide the winner themselves.
    const playerWins = playerTeam.reduce((total, racer) => total + ((racer.speed + racer.control) / 2 > 0.72 ? 1 : 0), 0);
    const enemyWins = enemyTeam.reduce((total, racer) => total + ((racer.speed + racer.control) / 2 > 0.72 ? 1 : 0), 0);

    // A tie must not be reported as a player victory (unchanged from
    // before - an empty or identically-matched team should not
    // automatically favor the player).
    const winner = teamStrength(playerTeam) > teamStrength(enemyTeam) ? "player" : "enemy";
    return { playerWins, enemyWins, winner };
  }
}

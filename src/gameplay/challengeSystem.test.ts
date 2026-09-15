import { ChallengeSystem } from "./challengeSystem";
import { OpponentProfile } from "./opponentTypes";
import { PLAYER_BATTLE_PROFILE } from "./playerTeam";

function racer(speed: number, control: number, id: string = "racer"): OpponentProfile {
  return {
    id,
    name: id,
    tier: "minion",
    faction: "Unaffiliated",
    behavior: "tactical",
    difficulty: 0.5,
    aggression: 0.5,
    caution: 0.5,
    tactical: 0.5,
    speed,
    control,
    durability: 0.5,
    stamina: 0.5,
    intelligence: 0.5,
    magicPotential: 0,
    terrainAffinity: {},
  };
}

describe("ChallengeSystem.evaluateTeamBattle", () => {
  it("regression: a solo protagonist can still win against a weaker rival team", () => {
    // The actual bug: PLAYER_BATTLE_PROFILE alone averages exactly 0.68
    // (speed 0.68, control 0.68), which never cleared the old fixed 0.72
    // threshold on its own - so a player who hadn't recruited a specific
    // strong-enough teammate could never win a team battle at all,
    // regardless of how weak the rival team was or how well the actual
    // race went. A relative comparison must let a genuinely stronger-
    // than-the-rivals solo team win. (Rivals here are weak enough in
    // total, not just per-member, since team strength is a team-size-
    // sensitive sum - see the "size vs quality" test below for that.)
    const system = new ChallengeSystem();
    const weakRivals = [racer(0.2, 0.2, "weak-rival-1"), racer(0.15, 0.15, "weak-rival-2")];

    const result = system.evaluateTeamBattle([PLAYER_BATTLE_PROFILE], weakRivals);

    expect(result.winner).toBe("player");
  });

  it("team strength is a sum, so a larger team can outweigh a smaller stronger-per-member one", () => {
    // This documents the actual chosen behavior rather than asserting it
    // by accident: two modest recruits together can out-total one very
    // strong solo rival, matching "team coordination" as the stage's own
    // description frames it - fielding a fuller squad is a legitimate way
    // to win a team battle, not just raw per-member stats.
    const system = new ChallengeSystem();
    const playerTeam = [racer(0.5, 0.5, "p1"), racer(0.5, 0.5, "p2")];
    const soloStrongRival = [racer(0.9, 0.9, "e1")];

    const result = system.evaluateTeamBattle(playerTeam, soloStrongRival);

    expect(result.winner).toBe("player");
  });

  it("a team that is collectively stronger wins even if no single racer clears the display threshold", () => {
    // Every racer here is just under 0.72 individually, but the player
    // side has more of them / slightly higher stats overall - a purely
    // relative-strength comparison must favor the stronger aggregate,
    // not zero out both sides.
    const system = new ChallengeSystem();
    const playerTeam = [racer(0.7, 0.7, "p1"), racer(0.68, 0.7, "p2")];
    const enemyTeam = [racer(0.6, 0.6, "e1")];

    const result = system.evaluateTeamBattle(playerTeam, enemyTeam);

    expect(result.winner).toBe("player");
  });

  it("a weaker team loses even if it has more members", () => {
    const system = new ChallengeSystem();
    const playerTeam = [racer(0.3, 0.3, "p1"), racer(0.3, 0.3, "p2"), racer(0.3, 0.3, "p3")];
    const enemyTeam = [racer(0.95, 0.95, "e1")];

    const result = system.evaluateTeamBattle(playerTeam, enemyTeam);

    expect(result.winner).toBe("enemy");
  });

  it("an exact tie resolves to enemy, not player", () => {
    const system = new ChallengeSystem();
    const team = [racer(0.6, 0.6, "solo")];

    const result = system.evaluateTeamBattle(team, [racer(0.6, 0.6, "rival-solo")]);

    expect(result.winner).toBe("enemy");
  });

  it("empty teams do not crash and resolve to enemy", () => {
    const system = new ChallengeSystem();
    const result = system.evaluateTeamBattle([], []);
    expect(result.winner).toBe("enemy");
    expect(result.playerWins).toBe(0);
    expect(result.enemyWins).toBe(0);
  });
});

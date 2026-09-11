import { OPPONENT_PROFILES } from "./opponentTypes";
import { PlayerTeamManager } from "./playerTeam";

describe("player identity and team management", () => {
  test("keeps the protagonist distinct from recruited racers", () => {
    const manager = new PlayerTeamManager();
    expect(manager.player.id).toBe("character.protagonist");
    expect(manager.getTeamSize()).toBe(1);
    expect(manager.getActiveMember()).toBeNull();
  });

  test("recruits non-boss racers and selects an active member", () => {
    const manager = new PlayerTeamManager();
    expect(manager.recruit(OPPONENT_PROFILES.rival_basil)).toBe(true);
    expect(manager.recruit(OPPONENT_PROFILES.rival_basil)).toBe(false);
    expect(manager.getActiveMember()?.id).toBe("rival_basil");
    expect(manager.selectActiveMember("missing")).toBe(false);
  });

  test("does not recruit bosses or exceed capacity", () => {
    const manager = new PlayerTeamManager();
    expect(manager.recruit(OPPONENT_PROFILES.boss_aether)).toBe(false);
    const profiles = [
      OPPONENT_PROFILES.rival_basil,
      OPPONENT_PROFILES.rival_cinder,
      OPPONENT_PROFILES.minion_ark,
    ];
    profiles.forEach((profile) => expect(manager.recruit(profile)).toBe(true));
    expect(manager.getTeamSize()).toBe(4);
  });

  test("exposes un recruited candidates without leaking profile state", () => {
    const manager = new PlayerTeamManager();
    const candidate = manager.getRecruitableCandidates().find((profile) => profile.id === "rival_basil");
    expect(candidate?.name).toBe("Basil Varn");
    expect(manager.recruitCandidate("rival_basil")).toBe(true);
    expect(manager.getRecruitableCandidates().some((profile) => profile.id === "rival_basil")).toBe(false);
  });

  test("builds a battle team with the protagonist first", () => {
    const manager = new PlayerTeamManager();
    manager.recruitCandidate("rival_basil");
    expect(manager.getBattleTeam().map((profile) => profile.id)).toEqual(["character.protagonist", "rival_basil"]);
  });

  test("cycles the active teammate without changing the roster", () => {
    const manager = new PlayerTeamManager();
    manager.recruitCandidate("rival_basil");
    manager.recruitCandidate("rival_cinder");
    expect(manager.getActiveMember()?.id).toBe("rival_basil");
    expect(manager.cycleActiveMember(1)?.id).toBe("rival_cinder");
    expect(manager.cycleActiveMember(-1)?.id).toBe("rival_basil");
    expect(manager.getRoster()).toHaveLength(2);
  });
});

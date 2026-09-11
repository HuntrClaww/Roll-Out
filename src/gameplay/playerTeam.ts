import { OPPONENT_PROFILES, OpponentProfile } from "./opponentTypes";

export interface PlayerIdentity {
  id: string;
  name: string;
  role: "protagonist";
  personalityNotes: string[];
}

export interface PlayerTeamState {
  player: PlayerIdentity;
  memberIds: string[];
  activeMemberId: string | null;
}

export const PLAYER_BATTLE_PROFILE: OpponentProfile = {
  id: "character.protagonist",
  name: "The Main Character",
  tier: "player",
  faction: "Unaffiliated",
  behavior: "tactical",
  difficulty: 0.5,
  aggression: 0.55,
  caution: 0.5,
  tactical: 0.65,
  speed: 0.68,
  control: 0.68,
  durability: 0.55,
  stamina: 0.65,
  intelligence: 0.5,
  magicPotential: 0.2,
  terrainAffinity: {
    asphalt: 0.7,
    gravel: 0.65,
    rock: 0.6,
    ice: 0.45,
    volcanic_rock: 0.45,
    obsidian: 0.35,
  },
};

export class PlayerTeamManager {
  public readonly player: PlayerIdentity = {
    id: "character.protagonist",
    name: "The Main Character",
    role: "protagonist",
    personalityNotes: ["cheerful", "laid-back", "curious", "funny", "quietly persistent"],
  };

  private readonly maxTeamMembers = 4;
  private readonly members = new Map<string, OpponentProfile>();
  private activeMemberId: string | null = null;

  public recruit(profile: OpponentProfile): boolean {
    if (profile.tier === "boss" || this.members.has(profile.id) || this.members.size >= this.maxTeamMembers) {
      return false;
    }

    this.members.set(profile.id, structuredClone(profile));
    if (!this.activeMemberId) this.activeMemberId = profile.id;
    return true;
  }

  public getRecruitableCandidates(): OpponentProfile[] {
    return Object.values(OPPONENT_PROFILES)
      .filter((profile) => profile.tier !== "boss" && !this.members.has(profile.id))
      .map((profile) => structuredClone(profile));
  }

  public recruitCandidate(candidateId: string): boolean {
    const candidate = OPPONENT_PROFILES[candidateId];
    return candidate ? this.recruit(candidate) : false;
  }

  public release(memberId: string): boolean {
    if (!this.members.delete(memberId)) return false;
    if (this.activeMemberId === memberId) {
      this.activeMemberId = this.members.keys().next().value ?? null;
    }
    return true;
  }

  public selectActiveMember(memberId: string): boolean {
    if (!this.members.has(memberId)) return false;
    this.activeMemberId = memberId;
    return true;
  }

  public cycleActiveMember(direction: 1 | -1): OpponentProfile | null {
    const ids = [...this.members.keys()];
    if (ids.length === 0) return null;
    const currentIndex = this.activeMemberId ? ids.indexOf(this.activeMemberId) : 0;
    const nextIndex = (currentIndex + direction + ids.length) % ids.length;
    this.activeMemberId = ids[nextIndex];
    return this.getActiveMember();
  }

  public getActiveMember(): OpponentProfile | null {
    const member = this.activeMemberId ? this.members.get(this.activeMemberId) : undefined;
    return member ? structuredClone(member) : null;
  }

  public getBattleTeam(): OpponentProfile[] {
    return [PLAYER_BATTLE_PROFILE, ...this.getRoster()];
  }

  public getRoster(): OpponentProfile[] {
    return [...this.members.values()].map((member) => structuredClone(member));
  }

  public getState(): PlayerTeamState {
    return {
      player: { ...this.player, personalityNotes: [...this.player.personalityNotes] },
      memberIds: [...this.members.keys()],
      activeMemberId: this.activeMemberId,
    };
  }

  public loadState(state: PlayerTeamState): void {
    this.members.clear();
    for (const memberId of state.memberIds ?? []) {
      if (this.members.size >= this.maxTeamMembers) break;
      const candidate = OPPONENT_PROFILES[memberId];
      if (candidate && candidate.tier !== "boss") this.members.set(memberId, structuredClone(candidate));
    }
    this.activeMemberId = state.activeMemberId && this.members.has(state.activeMemberId) ? state.activeMemberId : this.members.keys().next().value ?? null;
  }

  public getTeamSize(): number {
    return this.members.size + 1;
  }

  public getTeamCapacity(): number {
    return this.maxTeamMembers + 1;
  }
}

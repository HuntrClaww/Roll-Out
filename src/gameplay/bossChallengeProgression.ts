import { ChallengeTemplate } from "./challengeSystem";
import { RaceRule } from "./opponentTypes";

export interface BossGateDefinition {
  stageId: string;
  preparationRules: RaceRule[];
  description: string;
}

export interface BossGateState {
  completedPreparationRules: RaceRule[];
}

export type BossGateSnapshot = Record<string, BossGateState>;

export const BOSS_GATE_DEFINITIONS: BossGateDefinition[] = [
  { stageId: "intro-gate", preparationRules: ["checkpoint"], description: "Complete a checkpoint route before challenging Aether Sovereign." },
  { stageId: "ash-crest", preparationRules: ["duel"], description: "Prove your racing discipline in a duel before challenging Cinder Axis." },
  { stageId: "frost-veil", preparationRules: ["checkpoint", "duel"], description: "Complete both control and rivalry trials before challenging Glacier Sigil." },
  { stageId: "null-echo", preparationRules: ["duel", "checkpoint"], description: "Read the unstable route through a duel and a checkpoint trial before challenging Rift Echelon." },
  { stageId: "convergence-circuit", preparationRules: ["team-battle"], description: "Demonstrate team coordination before challenging the Circuit Steward." },
];

export class BossChallengeProgression {
  private readonly states = new Map<string, BossGateState>();

  public getDefinition(stageId: string): BossGateDefinition | undefined {
    return BOSS_GATE_DEFINITIONS.find((definition) => definition.stageId === stageId);
  }

  public getState(stageId: string): BossGateState {
    const state = this.states.get(stageId);
    return state ? { completedPreparationRules: [...state.completedPreparationRules] } : { completedPreparationRules: [] };
  }

  public getSnapshot(): BossGateSnapshot {
    return Object.fromEntries(BOSS_GATE_DEFINITIONS.map((definition) => [definition.stageId, this.getState(definition.stageId)]));
  }

  public loadSnapshot(snapshot: BossGateSnapshot): void {
    this.states.clear();
    for (const definition of BOSS_GATE_DEFINITIONS) {
      const validRules = (snapshot[definition.stageId]?.completedPreparationRules ?? [])
        .filter((rule) => definition.preparationRules.includes(rule));
      this.states.set(definition.stageId, { completedPreparationRules: [...new Set(validRules)] });
    }
  }

  public recordRaceResult(stageId: string, challenge: ChallengeTemplate, won: boolean): BossGateState {
    const definition = this.getDefinition(stageId);
    if (!definition || !won || challenge.isBossBattle) return this.getState(stageId);
    const state = this.getState(stageId);
    if (definition.preparationRules.includes(challenge.rule) && !state.completedPreparationRules.includes(challenge.rule)) {
      state.completedPreparationRules.push(challenge.rule);
      this.states.set(stageId, state);
    }
    return { completedPreparationRules: [...state.completedPreparationRules] };
  }

  public isBossChallengeUnlocked(stageId: string): boolean {
    const definition = this.getDefinition(stageId);
    if (!definition) return true;
    const completed = this.getState(stageId).completedPreparationRules;
    return definition.preparationRules.every((rule) => completed.includes(rule));
  }

  public getPreparationDescription(stageId: string): string | null {
    if (this.isBossChallengeUnlocked(stageId)) return null;
    return this.getDefinition(stageId)?.description ?? "Complete the required preparation challenges before the boss race.";
  }
}

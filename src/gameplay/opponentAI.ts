import { PHASE2_MAGIC_RULES, OpponentProfile, RaceContext } from "./opponentTypes";

export interface OpponentDecision {
  behavior: string;
  steeringBias: number;
  accelerationBias: number;
  riskTolerance: number;
  targetSpeed: number;
  shouldUseAbility: boolean;
  abilityName?: string;
  statusText: string;
}

export class HybridOpponentAI {
  constructor(private readonly profile: OpponentProfile) {}

  public decide(context: RaceContext): OpponentDecision {
    const terrainAffinity = this.profile.terrainAffinity[context.surface] ?? 0.5;
    const environmentalPressure =
      (context.windStrength * 0.5 + Math.abs(context.slope) * 0.8 + Math.abs(context.temperature - 20) * 0.015) /
      (1 + this.profile.durability * 0.4);

    const baseRisk = this.profile.aggression * 0.8 + this.profile.tactical * 0.25 - this.profile.caution * 0.6;
    const riskTolerance = clamp(baseRisk + context.threatLevel * 0.1 - context.currentRank * 0.05, 0, 1);

    const speedBias =
      this.profile.speed * 0.8 + terrainAffinity * 0.5 + this.profile.stamina * 0.2 - environmentalPressure * 0.4;

    const accelerationBias = clamp(speedBias - riskTolerance * 0.4, -1, 1);
    const steeringBias = clamp(
      (this.profile.control * 1.2 + context.trackDifficulty * 0.8 - context.windStrength * 0.7) *
        (1 + this.profile.intelligence * 0.3),
      -1,
      1
    );

    const abilityReady = this.profile.ability !== undefined && context.threatLevel > 0.45 && this.profile.magicPotential > 0.45;
    const trigger = this.profile.ability?.trigger ?? "self";
    const triggerCondition = (() => {
      switch (trigger) {
        case "terrain":
          return Math.abs(context.slope) > 0.18 || context.surface === "ice" || context.surface === "volcanic_rock";
        case "opponent":
          return context.threatLevel > 0.7;
        case "environment":
          return context.windStrength > 1.2 || context.temperature > 80 || Math.abs(context.slope) > 0.25;
        case "self":
        default:
          return context.distanceRemaining < 0.7;
      }
    })();

    const shouldUseAbility = abilityReady && this.profile.ability !== undefined && triggerCondition && context.distanceRemaining < 0.5 + this.profile.ability.cooldown * 0.02;

    const behavior = this.selectBehavior(context, riskTolerance, terrainAffinity);
    const targetSpeed = clamp(
      this.profile.speed * (0.5 + terrainAffinity * 0.9) + (behavior === "aggressive" ? 0.18 : 0) - context.threatLevel * 0.15,
      0.2,
      1.5
    );

    return {
      behavior,
      steeringBias,
      accelerationBias,
      riskTolerance,
      targetSpeed,
      shouldUseAbility,
      abilityName: shouldUseAbility ? this.profile.ability?.name : undefined,
      statusText: this.describeBehavior(behavior, context, shouldUseAbility),
    };
  }

  private selectBehavior(context: RaceContext, riskTolerance: number, terrainAffinity: number): string {
    if (context.currentRank <= 1 && this.profile.aggression > 0.65) {
      return "aggressive";
    }

    if (context.threatLevel > 0.75 || context.temperature > 120 || context.windStrength > 1.8) {
      return this.profile.caution > 0.65 ? "cautious" : "defensive";
    }

    if (terrainAffinity > 0.8 && riskTolerance > 0.6) {
      return "tactical";
    }

    if (riskTolerance > 0.76) {
      return this.profile.behavior === "reckless" ? "reckless" : "aggressive";
    }

    if (this.profile.caution > 0.65) {
      return "cautious";
    }

    return this.profile.behavior;
  }

  private describeBehavior(behavior: string, context: RaceContext, shouldUseAbility: boolean): string {
    const base = behavior.charAt(0).toUpperCase() + behavior.slice(1);
    const surfaceText = ` on ${context.surface}`;
    const abilityText = shouldUseAbility ? " ability trigger engaged" : " maintaining control";
    return `${base}${surfaceText}${abilityText}`;
  }
}

export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export const evaluateMagicBoundaries = (currentStrength: number, naturalPressure: number): number => {
  const scientificGuard = Math.min(PHASE2_MAGIC_RULES.conservationLimit, 1 - naturalPressure * 0.18);
  return clamp(currentStrength * scientificGuard, 0, PHASE2_MAGIC_RULES.maxAmplification);
};

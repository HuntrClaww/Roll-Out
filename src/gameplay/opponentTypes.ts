export type OpponentTier = "player" | "boss" | "knight" | "rival" | "minion";
export type OpponentBehavior = "aggressive" | "cautious" | "defensive" | "tactical" | "reckless";
export type AbilityTrigger = "terrain" | "opponent" | "self" | "environment";
export type RaceRule = "standard" | "duel" | "boss-challenge" | "team-battle" | "checkpoint";

export interface OpponentAbility {
  name: string;
  description: string;
  trigger: AbilityTrigger;
  strength: number;
  cooldown: number;
  magicAmplification: number;
}

export interface OpponentProfile {
  id: string;
  name: string;
  tier: OpponentTier;
  faction: string;
  behavior: OpponentBehavior;
  difficulty: number;
  aggression: number;
  caution: number;
  tactical: number;
  speed: number;
  control: number;
  durability: number;
  stamina: number;
  intelligence: number;
  magicPotential: number;
  terrainAffinity: Record<string, number>;
  ability?: OpponentAbility;
}

export interface RaceContext {
  surface: string;
  slope: number;
  altitude: number;
  temperature: number;
  windStrength: number;
  trackDifficulty: number;
  currentRank: number;
  currentSpeed: number;
  distanceRemaining: number;
  threatLevel: number;
}

export interface StageEncounter {
  stageId: string;
  encounterName: string;
  boss: OpponentProfile;
  knights: OpponentProfile[];
  rivals: OpponentProfile[];
  minions: OpponentProfile[];
  raceRule: RaceRule;
  difficulty: number;
}

export const PHASE2_MAGIC_RULES = {
  // Scientific logic is the root. Magic can only amplify natural effects it cannot create them out of nothing.
  scientificPrinciple:
    "Magic is a force amplifier, not an energy source. It may sharpen perception, stabilize movement, redirect momentum, or grant brief environmental advantage, but it cannot violate conservation of momentum, mass, or terrain logic.",
  allowedEffects: [
    "boost",
    "redirect",
    "stabilize",
    "predict",
    "mask",
    "empower",
  ],
  maxAmplification: 1.5,
  maxThermalShift: 18,
  maxWindShift: 2.5,
  maxTerrainModifier: 0.4,
  magicDecay: 0.15,
  conservationLimit: 0.6,
  // The magic layer must interact with terrain, chemistry, and geography, not override them.
  designRule:
    "A special ability may grant a temporary condition shift, but the underlying laws of mass, aerodynamics, friction, and slope remain active.",
} as const;

export const OPPONENT_PROFILES: Record<string, OpponentProfile> = {
  boss_aether: {
    id: "boss_aether",
    name: "Aether Sovereign",
    tier: "boss",
    faction: "Sky Dominion",
    behavior: "tactical",
    difficulty: 1,
    aggression: 0.82,
    caution: 0.3,
    tactical: 0.94,
    speed: 0.92,
    control: 0.88,
    durability: 0.9,
    stamina: 0.8,
    intelligence: 0.98,
    magicPotential: 0.96,
    terrainAffinity: {
      asphalt: 0.7,
      ice: 0.9,
      gravel: 0.8,
      rock: 0.8,
      volcanic_rock: 0.7,
      obsidian: 0.6,
      sand: 0.5,
      grass: 0.75,
    },
    ability: {
      name: "Skyglass Drift",
      description: "Temporarily reduces effective wind resistance and stabilizes high-speed turns using a localized atmospheric manipulation burst.",
      trigger: "environment",
      strength: 0.82,
      cooldown: 12,
      magicAmplification: 1.25,
    },
  },
  knight_ember: {
    id: "knight_ember",
    name: "Knight Ember",
    tier: "knight",
    faction: "Ash Banner",
    behavior: "aggressive",
    difficulty: 0.75,
    aggression: 0.9,
    caution: 0.25,
    tactical: 0.58,
    speed: 0.88,
    control: 0.75,
    durability: 0.8,
    stamina: 0.75,
    intelligence: 0.72,
    magicPotential: 0.52,
    terrainAffinity: {
      asphalt: 0.6,
      ice: 0.45,
      gravel: 0.8,
      rock: 0.85,
      volcanic_rock: 0.96,
      obsidian: 0.75,
      sand: 0.7,
      grass: 0.65,
    },
  },
  knight_glacier: {
    id: "knight_glacier",
    name: "Knight Glacier",
    tier: "knight",
    faction: "Frost Reign",
    behavior: "cautious",
    difficulty: 0.7,
    aggression: 0.46,
    caution: 0.88,
    tactical: 0.8,
    speed: 0.7,
    control: 0.92,
    durability: 0.82,
    stamina: 0.8,
    intelligence: 0.84,
    magicPotential: 0.58,
    terrainAffinity: {
      asphalt: 0.4,
      ice: 0.98,
      gravel: 0.55,
      rock: 0.7,
      volcanic_rock: 0.3,
      obsidian: 0.25,
      sand: 0.35,
      grass: 0.6,
    },
  },
  knight_tide: {
    id: "knight_tide",
    name: "Knight Tide",
    tier: "knight",
    faction: "Salt Ward",
    behavior: "defensive",
    difficulty: 0.8,
    aggression: 0.6,
    caution: 0.72,
    tactical: 0.85,
    speed: 0.78,
    control: 0.8,
    durability: 0.88,
    stamina: 0.86,
    intelligence: 0.8,
    magicPotential: 0.6,
    terrainAffinity: {
      asphalt: 0.7,
      ice: 0.66,
      gravel: 0.78,
      rock: 0.7,
      volcanic_rock: 0.64,
      obsidian: 0.62,
      sand: 0.88,
      grass: 0.82,
    },
  },
  knight_rift: {
    id: "knight_rift",
    name: "Knight Rift",
    tier: "knight",
    faction: "Null Veil",
    behavior: "reckless",
    difficulty: 0.92,
    aggression: 0.94,
    caution: 0.2,
    tactical: 0.76,
    speed: 0.9,
    control: 0.7,
    durability: 0.72,
    stamina: 0.68,
    intelligence: 0.74,
    magicPotential: 0.67,
    terrainAffinity: {
      asphalt: 0.72,
      ice: 0.75,
      gravel: 0.82,
      rock: 0.78,
      volcanic_rock: 0.7,
      obsidian: 0.8,
      sand: 0.68,
      grass: 0.6,
    },
  },
  rival_basil: {
    id: "rival_basil",
    name: "Basil Varn",
    tier: "rival",
    faction: "Amber Circuit",
    behavior: "tactical",
    difficulty: 0.56,
    aggression: 0.7,
    caution: 0.52,
    tactical: 0.9,
    speed: 0.8,
    control: 0.82,
    durability: 0.74,
    stamina: 0.7,
    intelligence: 0.86,
    magicPotential: 0.4,
    terrainAffinity: {
      asphalt: 0.85,
      ice: 0.6,
      gravel: 0.7,
      rock: 0.78,
      volcanic_rock: 0.5,
      obsidian: 0.42,
      sand: 0.58,
      grass: 0.82,
    },
  },
  rival_cinder: {
    id: "rival_cinder",
    name: "Cinder Vale",
    tier: "rival",
    faction: "Crimson Zero",
    behavior: "aggressive",
    difficulty: 0.58,
    aggression: 0.86,
    caution: 0.35,
    tactical: 0.45,
    speed: 0.88,
    control: 0.7,
    durability: 0.72,
    stamina: 0.75,
    intelligence: 0.62,
    magicPotential: 0.38,
    terrainAffinity: {
      asphalt: 0.75,
      ice: 0.42,
      gravel: 0.8,
      rock: 0.9,
      volcanic_rock: 0.93,
      obsidian: 0.73,
      sand: 0.68,
      grass: 0.65,
    },
  },
  minion_ark: {
    id: "minion_ark",
    name: "Ark-7",
    tier: "minion",
    faction: "Steel Warden",
    behavior: "defensive",
    difficulty: 0.32,
    aggression: 0.42,
    caution: 0.76,
    tactical: 0.5,
    speed: 0.65,
    control: 0.7,
    durability: 0.69,
    stamina: 0.73,
    intelligence: 0.5,
    magicPotential: 0.14,
    terrainAffinity: {
      asphalt: 0.76,
      ice: 0.48,
      gravel: 0.82,
      rock: 0.7,
      volcanic_rock: 0.5,
      obsidian: 0.4,
      sand: 0.6,
      grass: 0.78,
    },
  },
};

export const DEFAULT_STAGE_ROSTER = {
  bosses: [OPPONENT_PROFILES.boss_aether],
  knights: [
    OPPONENT_PROFILES.knight_ember,
    OPPONENT_PROFILES.knight_glacier,
    OPPONENT_PROFILES.knight_tide,
    OPPONENT_PROFILES.knight_rift,
  ],
  rivals: [
    OPPONENT_PROFILES.rival_basil,
    OPPONENT_PROFILES.rival_cinder,
  ],
  minions: [
    OPPONENT_PROFILES.minion_ark,
    OPPONENT_PROFILES.minion_ark,
    OPPONENT_PROFILES.minion_ark,
  ],
};

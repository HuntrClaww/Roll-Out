import { OpponentManager } from "./opponentManager";
import { OPPONENT_PROFILES } from "./opponentTypes";

/**
 * Regression tests for a 2026-09-12 fix: generateStage() previously always
 * cloned Aether Sovereign's stats/terrain affinity/ability for every boss
 * fight and just renamed the result, so Cinder Axis, Glacier Sigil, Rift
 * Echelon, and The Circuit Steward all played identically to Aether
 * Sovereign (wind-favoring terrain, ice-favoring terrain, "Skyglass Drift"
 * ability) despite having completely distinct established biographies.
 */
describe("OpponentManager boss generation", () => {
  const manager = new OpponentManager();

  test("Cinder Axis gets volcanic-specialist stats, not Aether Sovereign's", () => {
    const encounter = manager.generateStage("ash-crest", 1, "standard", "Cinder Axis", "Ash Banner");
    expect(encounter.boss.name).toBe("Cinder Axis");
    expect(encounter.boss.ability?.name).toBe("Heat-Gradient Reading");
    expect(encounter.boss.terrainAffinity.volcanic_rock).toBeGreaterThan(encounter.boss.terrainAffinity.ice);
    expect(encounter.boss.terrainAffinity.ice).toBeLessThan(OPPONENT_PROFILES.boss_aether.terrainAffinity.ice);
  });

  test("Glacier Sigil gets ice-specialist stats, not Aether Sovereign's", () => {
    const encounter = manager.generateStage("frost-veil", 1, "standard", "Glacier Sigil", "Frost Reign");
    expect(encounter.boss.ability?.name).toBe("Frost-Sigil Foresight");
    expect(encounter.boss.terrainAffinity.ice).toBeGreaterThan(encounter.boss.terrainAffinity.volcanic_rock);
  });

  test("Rift Echelon gets its own reckless-behavior profile and ability", () => {
    const encounter = manager.generateStage("null-echo", 1, "standard", "Rift Echelon", "Null Veil");
    expect(encounter.boss.behavior).toBe("reckless");
    expect(encounter.boss.ability?.name).toBe("Rift Step");
    expect(encounter.boss.caution).toBeLessThan(OPPONENT_PROFILES.boss_aether.caution);
  });

  test("The Circuit Steward gets a coordination-based profile, not a copy of any elemental boss", () => {
    const encounter = manager.generateStage("convergence-circuit", 1, "team-battle", "The Circuit Steward", "Convergence League");
    expect(encounter.boss.ability?.name).toBe("Checkpoint Convergence");
    expect(encounter.boss.terrainAffinity.asphalt).toBeGreaterThan(encounter.boss.terrainAffinity.volcanic_rock);
    expect(encounter.boss.aggression).toBeLessThan(OPPONENT_PROFILES.boss_aether.aggression);
  });

  test("the five canonical bosses all have distinct abilities from one another", () => {
    const names = ["Aether Sovereign", "Cinder Axis", "Glacier Sigil", "Rift Echelon", "The Circuit Steward"];
    const abilityNames = names.map(
      (name) => manager.generateStage("stage", 1, "standard", name).boss.ability?.name,
    );
    expect(new Set(abilityNames).size).toBe(names.length);
  });

  test("falls back safely to the default roster boss for an unrecognized name", () => {
    const encounter = manager.generateStage("custom-stage", 1, "standard", "A Brand New Challenger");
    expect(encounter.boss.name).toBe("A Brand New Challenger");
    // Falls back to Aether Sovereign's stats as the safe default.
    expect(encounter.boss.ability?.name).toBe(OPPONENT_PROFILES.boss_aether.ability?.name);
  });

  test("still applies the stage id and faction override on top of the matched profile", () => {
    const encounter = manager.generateStage("ash-crest", 1, "standard", "Cinder Axis", "Custom Faction");
    expect(encounter.boss.id).toBe("boss_ash-crest");
    expect(encounter.boss.faction).toBe("Custom Faction");
  });
});

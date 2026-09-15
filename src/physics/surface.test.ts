import { Surface } from "./surface";
import { PHYSICS } from "./constants";

describe("Surface", () => {
  describe("physics values stay in sync with constants.ts", () => {
    // Every surface that also exists in PHYSICS.SURFACES must report the
    // exact same friction/rollingResistance Marble actually uses at
    // runtime. This is the regression test for the drift bug: these two
    // files used to hold independently-maintained copies of the same
    // numbers, which had already diverged (visual colors) and could
    // silently diverge again for the physics numbers too.
    const sharedKeys = Object.keys(PHYSICS.SURFACES) as Array<keyof typeof PHYSICS.SURFACES>;

    it.each(sharedKeys)("%s matches PHYSICS.SURFACES exactly", (key) => {
      const visual = Surface.getSurface(key);
      const physics = PHYSICS.SURFACES[key];
      expect(visual).toBeDefined();
      expect(visual!.friction).toBe(physics.friction);
      expect(visual!.rollingResistance).toBe(physics.rollingResistance);
    });
  });

  describe("visual completeness", () => {
    it("defines a color for every surface", () => {
      for (const name of Surface.getAllSurfaceNames()) {
        const data = Surface.getSurface(name);
        expect(data?.color).toBeTruthy();
      }
    });

    it("includes metal, a surface used by track rendering that is not yet physics-backed", () => {
      // metal is visual-only today (no PHYSICS.SURFACES entry) — this
      // documents that intentionally, so a future physics addition for
      // it is a deliberate choice rather than an accidental gap. gravel
      // and rock used to be in the same boat but are now real physics
      // surfaces (see the regression test below).
      expect(Surface.getSurface("metal")).toBeDefined();
      expect(PHYSICS.SURFACES).not.toHaveProperty("metal");
    });

    it("regression: gravel and rock are real physics surfaces, not silently no-op ones", () => {
      // These were the actual bug: track.ts already used "gravel" and
      // "rock" as the `surface` for real regions (Mountain Pass Base
      // Camp/Alpine Meadow, Volcanic Basin Cooling Basin), but neither
      // existed in PHYSICS.SURFACES. Marble.applyRollingResistance and
      // Marble.applySteeringForce both return immediately when the
      // surface lookup misses — so on those regions the player had zero
      // steering control and no rolling resistance, silently.
      expect(PHYSICS.SURFACES).toHaveProperty("gravel");
      expect(PHYSICS.SURFACES).toHaveProperty("rock");
    });
  });

  describe("getSurface / getAllSurfaceNames", () => {
    it("returns undefined for an unknown surface", () => {
      expect(Surface.getSurface("lava_pretending_to_be_solid")).toBeUndefined();
    });

    it("returns every registered surface name", () => {
      const names = Surface.getAllSurfaceNames();
      expect(names).toEqual(expect.arrayContaining([
        "asphalt", "gravel", "dirt", "rock", "ice",
        "sand", "grass", "volcanic_rock", "obsidian", "metal",
      ]));
    });
  });
});

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

    it("includes surfaces used by track rendering that are not yet physics-backed", () => {
      // gravel/rock/metal are visual-only today (no PHYSICS.SURFACES entry) —
      // this documents that intentionally, so a future physics addition for
      // them is a deliberate choice rather than an accidental gap.
      expect(Surface.getSurface("gravel")).toBeDefined();
      expect(Surface.getSurface("rock")).toBeDefined();
      expect(Surface.getSurface("metal")).toBeDefined();
      expect(PHYSICS.SURFACES).not.toHaveProperty("gravel");
      expect(PHYSICS.SURFACES).not.toHaveProperty("rock");
      expect(PHYSICS.SURFACES).not.toHaveProperty("metal");
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

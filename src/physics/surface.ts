/**
 * Surface System - Visual/display properties for track surfaces
 * (name, color, particle effect), keyed to line up with the physics
 * surface keys in `constants.ts`.
 *
 * Friction and rolling resistance are NOT redefined here — they are
 * pulled live from `PHYSICS.SURFACES` in constants.ts, which is the
 * single physics source of truth (it's what Marble.applyRollingResistance
 * and Marble.applySteeringForce actually read at runtime). Previously
 * this file kept its own hand-copied friction/rollingResistance numbers,
 * which could silently drift out of sync with the real physics values
 * over time since nothing enforced they stay equal. Deriving them here
 * instead makes that class of drift structurally impossible: if
 * constants.ts changes a surface's friction, this file's numbers update
 * automatically. Surfaces below that have no physics entry in
 * constants.ts (metal — visual-only for now, not yet selectable as an
 * actual race surface) keep their own defined values.
 */
import { PHYSICS } from "./constants";

export interface SurfaceData {
  name: string;
  friction: number;
  rollingResistance: number;
  color: string;
  visualEffect?: string;
}

type PhysicsSurfaceKey = keyof typeof PHYSICS.SURFACES;

/** Pull friction/rollingResistance from constants.ts when the key exists there. */
function physicsValuesFor(
  key: PhysicsSurfaceKey | null,
  fallbackFriction: number,
  fallbackRollingResistance: number
): { friction: number; rollingResistance: number } {
  if (key && PHYSICS.SURFACES[key]) {
    const p = PHYSICS.SURFACES[key];
    return { friction: p.friction, rollingResistance: p.rollingResistance };
  }
  return { friction: fallbackFriction, rollingResistance: fallbackRollingResistance };
}

export class Surface {
  static readonly SURFACES: { [key: string]: SurfaceData } = {
    asphalt: {
      name: "Asphalt",
      ...physicsValuesFor("asphalt", 1.2, 0.003),
      color: "#444444",
      visualEffect: "dust",
    },
    gravel: {
      name: "Gravel",
      ...physicsValuesFor("gravel", 1.0, 0.006),
      color: "#9E8B63",
      visualEffect: "grit_spray",
    },
    dirt: {
      name: "Dirt",
      ...physicsValuesFor("dirt", 0.9, 0.008),
      color: "#8B4513",
      visualEffect: "dirt_spray",
    },
    rock: {
      name: "Rock",
      ...physicsValuesFor("rock", 1.1, 0.005),
      color: "#7A7A7A",
      visualEffect: "grit_spray",
    },
    ice: {
      name: "Ice",
      ...physicsValuesFor("ice", 0.3, 0.001),
      color: "#E0F6FF",
      visualEffect: "ice_crack",
    },
    sand: {
      name: "Sand",
      ...physicsValuesFor("sand", 0.6, 0.015),
      color: "#FFFACD",
      visualEffect: "sand_spray",
    },
    grass: {
      name: "Grass",
      ...physicsValuesFor("grass", 0.8, 0.01),
      color: "#228B22",
      visualEffect: "grass_kick",
    },
    volcanic_rock: {
      name: "Volcanic Rock",
      ...physicsValuesFor("volcanic_rock", 0.8, 0.008),
      color: "#9B4E1D",
      visualEffect: "ash_haze",
    },
    obsidian: {
      name: "Obsidian",
      ...physicsValuesFor("obsidian", 0.25, 0.0005),
      color: "#1B1B1B",
      visualEffect: "glass_sheen",
    },
    metal: {
      name: "Metal",
      // Not yet in PHYSICS.SURFACES — visual-only surface type, own values.
      ...physicsValuesFor(null, 1.5, 0.002),
      color: "#C0C0C0",
      visualEffect: "sparks",
    },
  };

  /**
   * Get surface data by name
   */
  static getSurface(name: string): SurfaceData | undefined {
    return this.SURFACES[name];
  }

  /**
   * Get all surface names
   */
  static getAllSurfaceNames(): string[] {
    return Object.keys(this.SURFACES);
  }
}

/**
 * Surface System - Defines track surface properties
 */

export interface SurfaceData {
  name: string;
  friction: number;
  rollingResistance: number;
  color: string;
  visualEffect?: string;
}

export class Surface {
  static readonly SURFACES: { [key: string]: SurfaceData } = {
    asphalt: {
      name: "Asphalt",
      friction: 1.2,
      rollingResistance: 0.003,
      color: "#444444",
      visualEffect: "dust",
    },
    gravel: {
      name: "Gravel",
      friction: 1.0,
      rollingResistance: 0.006,
      color: "#9E8B63",
      visualEffect: "grit_spray",
    },
    dirt: {
      name: "Dirt",
      friction: 0.9,
      rollingResistance: 0.008,
      color: "#8B4513",
      visualEffect: "dirt_spray",
    },
    rock: {
      name: "Rock",
      friction: 1.1,
      rollingResistance: 0.005,
      color: "#7A7A7A",
      visualEffect: "grit_spray",
    },
    ice: {
      name: "Ice",
      friction: 0.3,
      rollingResistance: 0.001,
      color: "#E0F6FF",
      visualEffect: "ice_crack",
    },
    sand: {
      name: "Sand",
      friction: 0.6,
      rollingResistance: 0.015,
      color: "#FFFACD",
      visualEffect: "sand_spray",
    },
    grass: {
      name: "Grass",
      friction: 0.8,
      rollingResistance: 0.01,
      color: "#228B22",
      visualEffect: "grass_kick",
    },
    volcanic_rock: {
      name: "Volcanic Rock",
      friction: 0.8,
      rollingResistance: 0.008,
      color: "#9B4E1D",
      visualEffect: "ash_haze",
    },
    obsidian: {
      name: "Obsidian",
      friction: 0.25,
      rollingResistance: 0.0005,
      color: "#1B1B1B",
      visualEffect: "glass_sheen",
    },
    metal: {
      name: "Metal",
      friction: 1.5,
      rollingResistance: 0.002,
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

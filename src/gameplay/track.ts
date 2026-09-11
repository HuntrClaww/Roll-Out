import { Vector3 } from "../physics/marble";

/**
 * TrackRegion - A section of track with defined environmental properties
 */
export interface TrackRegion {
  name: string;
  startX: number;
  endX: number;
  baseElevation: number;
  peakElevation: number;
  surface: string;
  temperature: number;
  windVector: Vector3;
  description: string;
}

/**
 * Track - Enhanced track system with elevation, temperature, surfaces, and wind
 * Inspired by physics/geography framework: geological variety, realistic terrain
 */
export class Track {
  name: string;
  regions: TrackRegion[];
  totalLength: number;
  /** Playable lateral width in world units. */
  width: number;

  constructor(name: string) {
    this.name = name;
    this.regions = [];
    this.totalLength = 0;
    this.width = 4;
  }

  /**
   * Add a region to the track
   */
  addRegion(region: TrackRegion): void {
    this.regions.push(region);
    this.totalLength = Math.max(this.totalLength, region.endX);
  }

  /**
   * Get the track height at a given X position (interpolated elevation)
   */
  getHeightAtX(xPos: number): number {
    const region = this.getRegionAtX(xPos);
    if (!region) return 0;

    // Linear interpolation between base and peak
    const progress = (xPos - region.startX) / (region.endX - region.startX);
    const clampedProgress = Math.max(0, Math.min(1, progress));

    return region.baseElevation + (region.peakElevation - region.baseElevation) * clampedProgress;
  }

  /**
   * Get the slope angle at a given X position
   */
  getSlopeAtX(xPos: number, sampleDistance: number = 1): number {
    const h1 = this.getHeightAtX(xPos - sampleDistance / 2);
    const h2 = this.getHeightAtX(xPos + sampleDistance / 2);
    const deltaH = h2 - h1;
    return Math.atan2(deltaH, sampleDistance);
  }

  /**
   * Get the region at a given X position
   */
  getRegionAtX(xPos: number): TrackRegion | null {
    for (const region of this.regions) {
      if (xPos >= region.startX && xPos <= region.endX) {
        return region;
      }
    }
    return null;
  }

  /**
   * Get environmental properties at a given position
   */
  getEnvironmentAt(xPos: number): {
    surface: string;
    temperature: number;
    elevation: number;
    slope: number;
    windVector: Vector3;
  } {
    const region = this.getRegionAtX(xPos);
    if (!region) {
      return {
        surface: "asphalt",
        temperature: 25,
        elevation: 0,
        slope: 0,
        windVector: new Vector3(0, 0, 0),
      };
    }

    return {
      surface: region.surface,
      temperature: region.temperature,
      elevation: this.getHeightAtX(xPos),
      slope: this.getSlopeAtX(xPos),
      windVector: region.windVector,
    };
  }
}

/**
 * Pre-built Track: Mountain Pass
 * A high-altitude course with elevation changes, thin air, and temperature variations
 */
export class MountainPassTrack extends Track {
  constructor() {
    super("Mountain Pass");

    // Region 1: Base Camp (starting area, sea level)
    this.addRegion({
      name: "Base Camp",
      startX: 0,
      endX: 50,
      baseElevation: 0,
      peakElevation: 50,
      surface: "gravel",
      temperature: 20,
      windVector: new Vector3(0, 0, 1), // Slight forward wind
      description: "Climbing out of the valley with gravel tracks",
    });

    // Region 2: Alpine Meadow (high elevation, cold)
    this.addRegion({
      name: "Alpine Meadow",
      startX: 50,
      endX: 120,
      baseElevation: 50,
      peakElevation: 200,
      surface: "rock",
      temperature: 5,
      windVector: new Vector3(2, 0, 0.5), // Strong crosswind
      description: "Steep mountain slopes with rocky terrain and thin air",
    });

    // Region 3: Mountain Peak (highest point, very cold, thin air)
    this.addRegion({
      name: "Mountain Peak",
      startX: 120,
      endX: 180,
      baseElevation: 200,
      peakElevation: 300,
      surface: "ice",
      temperature: -15,
      windVector: new Vector3(3, 0, -1), // Strong opposing wind at peak
      description: "Summit crossing with icy conditions and extreme wind",
    });

    // Region 4: Descent (downhill, warming up)
    this.addRegion({
      name: "Descent",
      startX: 180,
      endX: 250,
      baseElevation: 300,
      peakElevation: 100,
      surface: "asphalt",
      temperature: 10,
      windVector: new Vector3(0, 0, 2), // Tailwind downhill
      description: "Fast descent back to lower elevations on smooth asphalt",
    });
  }
}

/**
 * Pre-built Track: Volcanic Basin
 * A low-lying area with temperature extremes, varied surfaces, and geological interest
 */
export class VolcanicBasinTrack extends Track {
  constructor() {
    super("Volcanic Basin");

    // Region 1: Outer Plain (cool, safe)
    this.addRegion({
      name: "Outer Plain",
      startX: 0,
      endX: 60,
      baseElevation: 10,
      peakElevation: 15,
      surface: "asphalt",
      temperature: 25,
      windVector: new Vector3(0, 0, 1),
      description: "Approaching the volcanic zone on smooth roads",
    });

    // Region 2: Obsidian Fields (black volcanic glass, hot, slippery)
    this.addRegion({
      name: "Obsidian Fields",
      startX: 60,
      endX: 140,
      baseElevation: 15,
      peakElevation: 40,
      surface: "obsidian",
      temperature: 60,
      windVector: new Vector3(-1, 0, 0.5), // Heat shimmer wind
      description: "Black volcanic glass with intense heat and reduced friction",
    });

    // Region 3: Lava Flow Channels (extreme heat, unpredictable terrain)
    this.addRegion({
      name: "Lava Flow Channels",
      startX: 140,
      endX: 220,
      baseElevation: 40,
      peakElevation: 80,
      surface: "volcanic_rock",
      temperature: 150,
      windVector: new Vector3(0, 0, -0.5), // Slight cooling wind
      description: "Navigating ancient lava channels with extreme surface temperature",
    });

    // Region 4: Cooling Basin (temperature drops, returns to stable)
    this.addRegion({
      name: "Cooling Basin",
      startX: 220,
      endX: 280,
      baseElevation: 80,
      peakElevation: 30,
      surface: "gravel",
      temperature: 35,
      windVector: new Vector3(1, 0, 0),
      description: "Cooling zone with gravel terrain and decreasing heat",
    });
  }
}

/**
 * Pre-built Track: Frozen Cavern
 * An underground ice cavern with constant cold, slippery surfaces, and wind tunnels
 */
export class FrozenCavernTrack extends Track {
  constructor() {
    super("Frozen Cavern");

    // Region 1: Entrance (transition from outside to inside)
    this.addRegion({
      name: "Cavern Entrance",
      startX: 0,
      endX: 40,
      baseElevation: 0,
      peakElevation: -20,
      surface: "ice",
      temperature: 0,
      windVector: new Vector3(0, 0, 1), // Wind flowing into cavern
      description: "Descending into the ice cavern from the surface",
    });

    // Region 2: Deep Freeze (very slippery, extreme cold)
    this.addRegion({
      name: "Deep Freeze",
      startX: 40,
      endX: 120,
      baseElevation: -20,
      peakElevation: -60,
      surface: "ice",
      temperature: -30,
      windVector: new Vector3(2, 0, 0), // Strong lateral wind in cavern
      description: "Deep underground with ancient glacial ice and howling winds",
    });

    // Region 3: Wind Tunnel (active ice formation, extreme wind)
    this.addRegion({
      name: "Wind Tunnel",
      startX: 120,
      endX: 180,
      baseElevation: -60,
      peakElevation: -70,
      surface: "ice",
      temperature: -25,
      windVector: new Vector3(4, 0, -1), // Extremely strong headwind
      description: "Narrow tunnel with jet-stream wind speeds and treacherous ice",
    });

    // Region 4: Exit Rise (climbing back out)
    this.addRegion({
      name: "Exit Rise",
      startX: 180,
      endX: 240,
      baseElevation: -70,
      peakElevation: 10,
      surface: "ice",
      temperature: -15,
      windVector: new Vector3(1, 0, 2), // Wind flowing out of cavern
      description: "Steep climb back to surface through crystalline ice formations",
    });
  }
}

/**
 * Create a track by name
 */
export function createTrack(trackName: string): Track {
  switch (trackName.toLowerCase()) {
    case "mountain pass":
      return new MountainPassTrack();
    case "volcanic basin":
      return new VolcanicBasinTrack();
    case "frozen cavern":
      return new FrozenCavernTrack();
    default:
      return new Track("Custom Track");
  }
}

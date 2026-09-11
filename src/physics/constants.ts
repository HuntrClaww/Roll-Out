/**
 * Physics Constants for Marble Racing Game (Enhanced)
 * 
 * Incorporates physics, geography, and material science knowledge.
 * These values define realistic physics behavior.
 * Adjust based on testing and desired "feel."
 */

export const PHYSICS = {
  // World
  GRAVITY: 9.81,                       // m/s² (downward)
  GROUND_LEVEL: 0,                     // reference height for collisions
  AIR_DENSITY_SEA_LEVEL: 1.225,        // kg/m³ (sea level air density)
  SCALE_HEIGHT: 8500,                  // m (atmosphere scale height)

  // Marble defaults
  MARBLE_RADIUS: 0.1,                  // meters (standard marble size)
  MARBLE_MASS: 0.2,                    // kg (light for mobile performance)
  MARBLE_LINEAR_DAMPING: 0.02,         // air resistance (simplified)
  MARBLE_ANGULAR_DAMPING: 0.01,        // rotational air resistance

  // Marble Materials. Density is SI kg/m³ because geometry is expressed in metres.
  MARBLE_MATERIALS: {
    steel: {
      density: 7800,                   // kg/m³
      baseFriction: 1.3,
      restitution: 0.3,                // low bounce
      rollingResistance: 0.002,        // very smooth
      thermalConductivity: 0.8,        // conducts heat well
    },
    rubber: {
      density: 1200,                   // kg/m³
      baseFriction: 0.7,
      restitution: 0.8,                // bouncy
      rollingResistance: 0.01,         // loses energy quickly
      thermalConductivity: 0.15,       // poor conductor
    },
    glass: {
      density: 2500,                   // kg/m³
      baseFriction: 0.2,               // very slippery
      restitution: 0.4,
      rollingResistance: 0.001,        // extremely smooth
      thermalConductivity: 1.0,        // conducts heat
    },
    stone: {
      density: 2300,                   // kg/m³
      baseFriction: 0.9,
      restitution: 0.2,
      rollingResistance: 0.008,
      thermalConductivity: 0.6,        // moderate conductor
    },
  },

  // Surfaces (friction coefficient and rolling resistance)
  // Temperature-adjusted: friction = baseFriction * (1 + tempCoefficient * (surfaceTemp - baseTemp))
  SURFACES: {
    asphalt: {
      friction: 1.2,
      rollingResistance: 0.003,
      temperature: 25,                 // base temperature (°C)
      temperatureCoefficient: 0.01,    // friction change per degree
    },
    dirt: {
      friction: 0.9,
      rollingResistance: 0.008,
      temperature: 20,
      temperatureCoefficient: 0.015,
    },
    ice: {
      friction: 0.3,
      rollingResistance: 0.001,
      temperature: -10,
      temperatureCoefficient: 0.05,    // ice very sensitive to temperature
    },
    sand: {
      friction: 0.6,
      rollingResistance: 0.015,
      temperature: 35,
      temperatureCoefficient: 0.02,
    },
    grass: {
      friction: 0.8,
      rollingResistance: 0.01,
      temperature: 18,
      temperatureCoefficient: 0.01,
    },
    volcanic_rock: {
      friction: 0.8,
      rollingResistance: 0.008,
      temperature: 100,                // hot volcanic terrain
      temperatureCoefficient: 0.03,
    },
    obsidian: {
      friction: 0.25,                  // very slippery like glass
      rollingResistance: 0.0005,
      temperature: 150,                // even hotter
      temperatureCoefficient: 0.02,
    },
  },

  // Collision
  RESTITUTION: 0.2,
  COLLISION_DAMPING: 0.8,

  // Spin & Angular Momentum
  // Sphere moment of inertia: I = (2/5) * m * r²
  // Rolling no-slip condition: v = ω * r
  GYROSCOPIC_DAMPING: 0.95,           // how much spin affects steering resistance
  SPIN_TRACTION_BONUS: 0.3,           // extra traction from spinning

  // Input
  MAX_STEER_ANGLE: 0.5,
  STEER_RESPONSIVENESS: 5.0,

  // Air & Wind Physics
  DRAG_COEFFICIENT: 0.47,             // sphere drag coefficient
  MARBLE_CROSS_SECTION: Math.PI * (0.1 ** 2), // πr² for sphere

  // Simulation
  FIXED_TIMESTEP: 1 / 60,
  MAX_SIMULATION_FRAMES: 4,

  // Elevation & Terrain
  ELEVATION_GRAVITY_COMPONENT: true,  // gravity component along slope
  ELEVATION_AIR_DENSITY: true,        // air density changes with elevation
};

/**
 * Unit conversion helpers
 */
export const UNITS = {
  metersToPixels: (m: number) => m * 100,
  pixelsToMeters: (px: number) => px / 100,
};

import { PHYSICS } from "./constants";

/**
 * Vector3 - Simple 3D vector math
 */
export class Vector3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  add(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  multiply(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vector3): Vector3 {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  normalize(): Vector3 {
    const len = this.length();
    if (len === 0) return new Vector3(0, 0, 0);
    return new Vector3(this.x / len, this.y / len, this.z / len);
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }
}

/**
 * Marble Material Definition
 */
export interface MarbleMaterial {
  name: string;
  density: number;
  baseFriction: number;
  restitution: number;
  rollingResistance: number;
  thermalConductivity: number;
}

/**
 * Marble - The player's spherical racing object (Enhanced with physics/geography knowledge)
 */
export class Marble {
  // State
  position: Vector3;
  velocity: Vector3;
  angularVelocity: Vector3;

  // Physical properties
  mass: number;
  radius: number;
  momentOfInertia: number;
  material: MarbleMaterial;
  linearDamping: number;
  angularDamping: number;
  private gripModifier: number = 1;

  // Current conditions
  currentSurface: string = "asphalt";
  currentTemperature: number = 25; // °C
  currentAltitude: number = 0;     // meters
  currentSlope: number = 0;         // radians
  onGround: boolean = false;

  // Wind effect
  windVector: Vector3 = new Vector3(0, 0, 0);

  constructor(
    position: Vector3 = new Vector3(0, 5, 0),
    material: MarbleMaterial | string = "steel"
  ) {
    this.position = position.clone();
    this.velocity = new Vector3(0, 0, 0);
    this.angularVelocity = new Vector3(0, 0, 0);
    this.radius = PHYSICS.MARBLE_RADIUS;

    // Resolve material
    if (typeof material === "string") {
      const materialData = PHYSICS.MARBLE_MATERIALS[material as keyof typeof PHYSICS.MARBLE_MATERIALS];
      this.material = {
        ...(materialData as MarbleMaterial),
        name: material,
      };
    } else {
      this.material = material;
    }

    // Calculate mass from material density and volume
    const marbleVolume = (4 / 3) * Math.PI * (this.radius ** 3);
    this.mass = this.material.density * marbleVolume;

    // Moment of inertia for sphere: I = (2/5) * m * r²
    this.momentOfInertia = (2 / 5) * this.mass * (this.radius ** 2);

    this.linearDamping = PHYSICS.MARBLE_LINEAR_DAMPING;
    this.angularDamping = PHYSICS.MARBLE_ANGULAR_DAMPING;
  }

  /**
   * Apply gravity with slope component
   */
  applyGravity(deltaTime: number, slopeAngle: number = 0): void {
    if (!this.onGround) {
      // Freefall: gravity's full magnitude applies straight down. The
      // ground's slope only matters while a surface is actually constraining
      // the marble's motion, so it must not scale gravity while airborne.
      this.velocity.y -= PHYSICS.GRAVITY * deltaTime;
    }

    // Gravity component along the slope surface. getSlopeAtX (the source of
    // slopeAngle) is positive when height increases with +z, i.e. uphill in
    // the direction of travel. Gravity's tangential component always points
    // downhill, so it must subtract from +z velocity on an uphill grade
    // (decelerating the climb) and add to it on a downhill grade
    // (accelerating the descent) — the opposite of the climb/descent sign.
    if (PHYSICS.ELEVATION_GRAVITY_COMPONENT && this.onGround && Math.abs(slopeAngle) > 0.01) {
      const downslideAccel = PHYSICS.GRAVITY * Math.sin(slopeAngle);
      this.velocity.z -= downslideAccel * deltaTime;
    }
  }

  /**
   * Apply combined air resistance from ambient drag and wind.
   *
   * Aerodynamic drag depends on the marble's velocity RELATIVE to the
   * surrounding air, not on the marble's ground-frame velocity and the
   * wind's ground-frame velocity as two independent effects. Computing
   * one force from (windVector - velocity) means: zero wind reduces to
   * ordinary still-air drag opposing the marble's motion; a marble moving
   * exactly with the wind feels no drag at all; and a marble outrunning a
   * tailwind or fighting a headwind is decelerated by the correct relative
   * speed rather than by the wind's absolute speed alone.
   */
  applyAirResistance(deltaTime: number): void {
    const airVelocityRelativeToMarble = this.windVector.subtract(this.velocity);
    const relativeSpeed = airVelocityRelativeToMarble.length();
    if (relativeSpeed <= 0.01) return;

    const airDensity = this.getAirDensityAtAltitude(this.currentAltitude);
    // Drag force: F = 0.5 * ρ * v² * A * Cd, applied toward the direction
    // the air is moving relative to the marble.
    const dragMagnitude =
      0.5 * airDensity * relativeSpeed ** 2 * PHYSICS.MARBLE_CROSS_SECTION * PHYSICS.DRAG_COEFFICIENT;
    const dragAccel = dragMagnitude / this.mass;
    const dragDirection = airVelocityRelativeToMarble.normalize().multiply(dragAccel * deltaTime);
    this.velocity = this.velocity.add(dragDirection);
  }

  /**
   * Calculate air density based on altitude (exponential model)
   */
  getAirDensityAtAltitude(altitude: number): number {
    if (!PHYSICS.ELEVATION_AIR_DENSITY) return PHYSICS.AIR_DENSITY_SEA_LEVEL;
    return PHYSICS.AIR_DENSITY_SEA_LEVEL * Math.exp(-altitude / PHYSICS.SCALE_HEIGHT);
  }

  /**
   * Apply linear damping (viscous damping)
   */
  applyLinearDamping(deltaTime: number): void {
    this.velocity.x *= 1 - this.linearDamping * deltaTime;
    this.velocity.y *= 1 - this.linearDamping * deltaTime;
    this.velocity.z *= 1 - this.linearDamping * deltaTime;
  }

  /**
   * Apply rolling resistance based on surface and temperature
   */
  applyRollingResistance(deltaTime: number): void {
    const surfaceData = PHYSICS.SURFACES[this.currentSurface as keyof typeof PHYSICS.SURFACES];
    if (!surfaceData) return;

    // Temperature-adjusted friction
    const tempDelta = this.currentTemperature - surfaceData.temperature;
    const tempFactor = 1 + (surfaceData.temperatureCoefficient * tempDelta);

    let resistance = surfaceData.rollingResistance * tempFactor;
    resistance = Math.max(0, resistance); // Can't be negative

    this.velocity = this.velocity.multiply(1 - resistance * deltaTime);
  }

  /**
   * Update position based on velocity
   */
  updatePosition(deltaTime: number): void {
    const newPos = this.position.add(this.velocity.multiply(deltaTime));
    this.position = newPos;
  }

  /**
   * Update angular velocity based on rolling condition.
   * No-slip condition: v = ω × r_contact, where r_contact points from the
   * marble's center straight down to the ground contact point, (0, -radius, 0).
   * Solving for ω gives an axis perpendicular to the direction of travel —
   * like a wheel or ball, which tumbles end-over-end — not the vertical
   * axis. A marble rolling in +z rotates about the x-axis; one rolling in
   * +x rotates about the z-axis. The magnitude (speed / radius) is
   * unchanged from before, so gameplay effects that only read magnitude
   * (getSpin, steering's gyroscopic/traction terms) are unaffected; only
   * the axis, which matters once the marble's spin is rendered visually,
   * is corrected.
   */
  updateAngularVelocity(): void {
    if (!this.onGround) return;

    const horizontalVelocity = new Vector3(this.velocity.x, 0, this.velocity.z);
    const speed = horizontalVelocity.length();
    if (speed <= 0.01) return;

    const up = new Vector3(0, 1, 0);
    const rollingAxis = up.cross(horizontalVelocity).multiply(1 / this.radius);
    this.angularVelocity = new Vector3(rollingAxis.x, 0, rollingAxis.z);
  }

  /**
   * Check collision with ground
   */
  checkGroundCollision(trackHeightAtPosition: number = 0): void {
    if (this.position.y <= trackHeightAtPosition + this.radius) {
      this.position.y = trackHeightAtPosition + this.radius;
      this.velocity.y = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  }

  /**
   * Apply steering force with gyroscopic damping and spin traction
   * @param steerAmount -1 to 1 (left to right)
   */
  applySteeringForce(steerAmount: number, deltaTime: number): void {
    if (!this.onGround) return;

    const surfaceData = PHYSICS.SURFACES[this.currentSurface as keyof typeof PHYSICS.SURFACES];
    if (!surfaceData) return;

    // Temperature-adjusted friction. Clamped to non-negative to match the
    // same defensive pattern applyRollingResistance already uses just
    // below in this file — without it, a temperature far enough below a
    // surface's base temperature could drive tempFactor negative and
    // invert steering (steering left would push the marble right).
    // Unreachable with today's game content (coldest configured
    // temperature is -8°C on ice, base -10°C — nowhere close), but the
    // formula itself should be safe for whatever temperature future
    // stages introduce, the same way its sibling already is.
    const tempDelta = this.currentTemperature - surfaceData.temperature;
    const tempFactor = Math.max(0, 1 + (surfaceData.temperatureCoefficient * tempDelta));
    const adjustedFriction = surfaceData.friction * tempFactor * this.gripModifier;

    // Base steering force
    let steerForce = steerAmount * PHYSICS.STEER_RESPONSIVENESS * adjustedFriction;

    // Gyroscopic effect: spinning reduces steering effectiveness
    const spinMagnitude = this.angularVelocity.length();
    if (spinMagnitude > 0.1) {
      const gyroResistance = 1 / (1 + PHYSICS.GYROSCOPIC_DAMPING * spinMagnitude);
      steerForce *= gyroResistance;
    }

    // Extra traction from spin (higher spin = better grip)
    const spinTraction = Math.min(spinMagnitude / 5, 1.0) * PHYSICS.SPIN_TRACTION_BONUS;
    steerForce *= 1 + spinTraction;

    // Determine lateral axis based on forward direction
    const forward = this.velocity.clone().normalize();
    let right = new Vector3(-forward.z, 0, forward.x).normalize();

    // Apply lateral acceleration
    const lateralAccel = steerForce / this.mass;
    const steerAccel = right.multiply(lateralAccel * deltaTime);
    this.velocity = this.velocity.add(steerAccel);
  }

  /**
   * Apply forward drive along the track (+z axis) while throttle is held.
   *
   * This is the marble's actual engine/propulsion input — the only other
   * forward-motion source is gravity's along-slope component, which
   * cannot by itself carry a marble up sustained climbs (a free-rolling
   * ball cannot climb a long, steep grade from momentum alone; it needs
   * continuous drive, same as any real vehicle). Grounded only, like
   * steering — a marble mid-air is not being driven by anything.
   * @param throttleInput 0 (no throttle) to 1 (full throttle); values
   *   outside that range are clamped, so a negative "brake" input is
   *   simply treated as no thrust rather than actively reversing.
   */
  applyThrust(throttleInput: number, deltaTime: number): void {
    if (!this.onGround) return;
    const clampedThrottle = Math.max(0, Math.min(1, throttleInput));
    if (clampedThrottle <= 0) return;

    const thrustAccel = PHYSICS.THRUST_ACCELERATION * clampedThrottle;
    this.velocity.z += thrustAccel * deltaTime;
  }

  /**
   * Main physics update
   */
  update(deltaTime: number, trackHeightAtPosition: number = 0, slopeAngle: number = 0): void {
    // Clamp deltaTime to avoid large jumps
    if (deltaTime > 0.1) deltaTime = 0.1;

    // Apply forces
    this.applyGravity(deltaTime, slopeAngle);
    this.applyAirResistance(deltaTime);
    this.applyLinearDamping(deltaTime);

    // Only apply rolling resistance if on ground
    if (this.onGround) {
      this.applyRollingResistance(deltaTime);
    }

    // Update position
    this.updatePosition(deltaTime);

    // Check collisions
    this.checkGroundCollision(trackHeightAtPosition);

    // Update spin based on rolling
    this.updateAngularVelocity();
  }

  /**
   * Get marble speed (magnitude of velocity)
   */
  getSpeed(): number {
    return this.velocity.length();
  }

  /**
   * Get marble spin magnitude
   */
  getSpin(): number {
    return this.angularVelocity.length();
  }

  /**
   * Reset marble to starting position
   */
  reset(newPosition: Vector3): void {
    this.position = newPosition.clone();
    this.velocity = new Vector3(0, 0, 0);
    this.angularVelocity = new Vector3(0, 0, 0);
    this.onGround = false;
  }

  /**
   * Set environmental conditions
   */
  setEnvironment(surface: string, temperature: number, altitude: number, slope: number): void {
    this.currentSurface = surface;
    this.currentTemperature = temperature;
    this.currentAltitude = altitude;
    this.currentSlope = slope;
  }

  /**
   * Set wind vector
   */
  setWind(windVector: Vector3): void {
    this.windVector = windVector;
  }

  /** Apply a bounded gameplay upgrade without replacing the marble's identity. */
  setGripModifier(modifier: number): void {
    this.gripModifier = Math.max(0.5, Math.min(1.75, modifier));
  }

  getGripModifier(): number {
    return this.gripModifier;
  }
}

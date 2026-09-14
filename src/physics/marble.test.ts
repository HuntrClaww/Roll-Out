import { Marble, Vector3 } from "./marble";

/**
 * Regression tests for the physics accuracy fixes made 2026-09-12:
 *   1. Freefall gravity must not be scaled by ground slope.
 *   2. The along-slope gravity component must decelerate uphill motion and
 *      accelerate downhill motion (not the reverse).
 *   3. Air resistance/wind must depend on velocity RELATIVE to the wind.
 *   4. Rolling angular velocity must use the axis perpendicular to travel,
 *      not the vertical axis.
 *
 * There was no direct physics-level test coverage before this file; the
 * marble class was only exercised indirectly via gameplay integration
 * tests, none of which asserted on these formulas.
 */
describe("Marble physics", () => {
  describe("gravity", () => {
    test("applies full gravity in freefall regardless of ground slope", () => {
      const flat = new Marble(new Vector3(0, 5, 0));
      flat.onGround = false;
      flat.applyGravity(1, 0);

      const sloped = new Marble(new Vector3(0, 5, 0));
      sloped.onGround = false;
      sloped.applyGravity(1, 0.9); // a steep slope beneath, but marble is airborne

      expect(sloped.velocity.y).toBeCloseTo(flat.velocity.y, 10);
      expect(flat.velocity.y).toBeCloseTo(-9.81, 5);
    });

    test("decelerates a marble moving uphill", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = true;
      marble.velocity = new Vector3(0, 0, 5); // moving in +z
      const slopeAngle = 0.5; // positive: uphill in +z, per Track.getSlopeAtX convention

      marble.applyGravity(1, slopeAngle);

      expect(marble.velocity.z).toBeLessThan(5);
    });

    test("accelerates a marble moving downhill", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = true;
      marble.velocity = new Vector3(0, 0, 5);
      const slopeAngle = -0.5; // negative: downhill in +z

      marble.applyGravity(1, slopeAngle);

      expect(marble.velocity.z).toBeGreaterThan(5);
    });

    test("a marble at rest on an uphill grade rolls backward (downhill), not forward", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = true;
      marble.velocity = new Vector3(0, 0, 0);

      marble.applyGravity(1, 0.5); // uphill in +z

      expect(marble.velocity.z).toBeLessThan(0);
    });

    test("does not apply any slope component while airborne, even on a steep grade", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = false;
      marble.velocity = new Vector3(0, 0, 5);

      marble.applyGravity(1, 0.9);

      expect(marble.velocity.z).toBeCloseTo(5, 10);
    });
  });

  describe("air resistance and wind", () => {
    test("still air (no wind) decelerates a moving marble", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.velocity = new Vector3(0, 0, 10);
      marble.setWind(new Vector3(0, 0, 0));

      marble.applyAirResistance(0.1);

      expect(marble.velocity.z).toBeLessThan(10);
    });

    test("produces no net force when the marble moves exactly with the wind", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.velocity = new Vector3(0, 0, 6);
      marble.setWind(new Vector3(0, 0, 6));

      marble.applyAirResistance(0.1);

      expect(marble.velocity.z).toBeCloseTo(6, 10);
    });

    test("a tailwind slower than the marble still decelerates it, using the relative speed", () => {
      const withTailwind = new Marble(new Vector3(0, 0, 0));
      withTailwind.velocity = new Vector3(0, 0, 10);
      withTailwind.setWind(new Vector3(0, 0, 4)); // tailwind, slower than marble

      const stillAir = new Marble(new Vector3(0, 0, 0));
      stillAir.velocity = new Vector3(0, 0, 10);
      stillAir.setWind(new Vector3(0, 0, 0));

      withTailwind.applyAirResistance(0.1);
      stillAir.applyAirResistance(0.1);

      // Relative speed with the tailwind (6) is lower than in still air (10),
      // so the tailwind case must decelerate less than the still-air case.
      expect(withTailwind.velocity.z).toBeLessThan(10);
      expect(withTailwind.velocity.z).toBeGreaterThan(stillAir.velocity.z);
    });

    test("a headwind decelerates the marble more than still air", () => {
      const withHeadwind = new Marble(new Vector3(0, 0, 0));
      withHeadwind.velocity = new Vector3(0, 0, 10);
      withHeadwind.setWind(new Vector3(0, 0, -4)); // headwind

      const stillAir = new Marble(new Vector3(0, 0, 0));
      stillAir.velocity = new Vector3(0, 0, 10);
      stillAir.setWind(new Vector3(0, 0, 0));

      withHeadwind.applyAirResistance(0.1);
      stillAir.applyAirResistance(0.1);

      expect(withHeadwind.velocity.z).toBeLessThan(stillAir.velocity.z);
    });

    test("a stationary marble is pushed by the wind", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.velocity = new Vector3(0, 0, 0);
      marble.setWind(new Vector3(0, 0, 3));

      marble.applyAirResistance(0.1);

      expect(marble.velocity.z).toBeGreaterThan(0);
    });
  });

  describe("rolling angular velocity", () => {
    test("rolling forward (+z) spins about the x-axis, not the vertical axis", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = true;
      marble.velocity = new Vector3(0, 0, 5);

      marble.updateAngularVelocity();

      expect(Math.abs(marble.angularVelocity.x)).toBeGreaterThan(0);
      expect(marble.angularVelocity.y).toBeCloseTo(0, 10);
    });

    test("rolling sideways (+x) spins about the z-axis", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = true;
      marble.velocity = new Vector3(5, 0, 0);

      marble.updateAngularVelocity();

      expect(Math.abs(marble.angularVelocity.z)).toBeGreaterThan(0);
      expect(marble.angularVelocity.y).toBeCloseTo(0, 10);
    });

    test("spin magnitude still matches speed / radius, preserving existing gameplay math", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = true;
      marble.velocity = new Vector3(0, 0, 5);

      marble.updateAngularVelocity();

      expect(marble.getSpin()).toBeCloseTo(5 / marble.radius, 5);
    });

    test("does not update angular velocity while airborne", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = false;
      marble.velocity = new Vector3(0, 0, 5);
      marble.angularVelocity = new Vector3(1, 2, 3);

      marble.updateAngularVelocity();

      expect(marble.angularVelocity).toEqual(new Vector3(1, 2, 3));
    });
  });

  describe("thrust", () => {
    test("does nothing with zero or negative throttle", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = true;
      marble.velocity = new Vector3(0, 0, 2);

      marble.applyThrust(0, 0.1);
      expect(marble.velocity.z).toBeCloseTo(2, 10);

      marble.applyThrust(-1, 0.1);
      expect(marble.velocity.z).toBeCloseTo(2, 10);
    });

    test("accelerates a stationary marble forward at full throttle", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = true;
      marble.velocity = new Vector3(0, 0, 0);

      marble.applyThrust(1, 0.1);

      expect(marble.velocity.z).toBeGreaterThan(0);
    });

    test("does nothing while airborne", () => {
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = false;
      marble.velocity = new Vector3(0, 0, 0);

      marble.applyThrust(1, 0.1);

      expect(marble.velocity.z).toBe(0);
    });

    test("clamps throttle input above 1 to full thrust, not more", () => {
      const fullThrottle = new Marble(new Vector3(0, 0, 0));
      fullThrottle.onGround = true;
      fullThrottle.applyThrust(1, 0.1);

      const overThrottle = new Marble(new Vector3(0, 0, 0));
      overThrottle.onGround = true;
      overThrottle.applyThrust(5, 0.1);

      expect(overThrottle.velocity.z).toBeCloseTo(fullThrottle.velocity.z, 10);
    });

    test("full throttle net-accelerates (does not just hold steady) on the steepest starting grade in the game", () => {
      // The steepest track-starting region (Mountain Pass, "Base Camp") rises
      // 50 units over 50 units of travel — a 45-degree grade. A marble at
      // rest there must be able to move forward under thrust alone, or the
      // track is uncompletable from a standing start.
      const steepestStartingSlope = Math.PI / 4; // 45 degrees
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = true;
      marble.velocity = new Vector3(0, 0, 0);

      const dt = 1 / 60;
      for (let step = 0; step < 120; step += 1) { // 2 simulated seconds
        marble.applyGravity(dt, steepestStartingSlope);
        marble.applyThrust(1, dt);
      }

      expect(marble.velocity.z).toBeGreaterThan(0);
    });
  });

  describe("steering", () => {
    test("temperature-adjusted friction never goes negative, even far below a surface's base temperature", () => {
      // Regression test: applySteeringForce used to compute
      // tempFactor = 1 + coefficient * tempDelta with no floor, unlike its
      // sibling applyRollingResistance which already clamped to zero. Ice
      // has the highest temperatureCoefficient (0.05) and a base
      // temperature of -10°C, so a large enough cold snap used to be able
      // to drive friction negative and invert steering — turning a left
      // input into a rightward push. Not reachable with today's game
      // content, but the formula itself must be safe regardless.
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = true;
      marble.velocity = new Vector3(0, 0, 1); // moving forward so `right` is well-defined
      marble.currentSurface = "ice";
      marble.currentTemperature = -500; // absurdly far below ice's -10°C base

      const velocityBefore = marble.velocity.clone();
      marble.applySteeringForce(1, 1); // steer hard right

      // With friction clamped at zero, adjustedFriction is 0, so
      // steerForce is 0 and velocity must be unchanged — never pushed
      // further right (correct clamp) and never flipped left (the bug).
      expect(marble.velocity.x).toBeCloseTo(velocityBefore.x, 10);
    });

    test("a positive steering input consistently produces the same velocity.x direction at a normal temperature", () => {
      // Given forward=(0,0,1), right=(-forward.z,0,forward.x)=(-1,0,0), so a
      // positive steerAmount pushes velocity.x negative under this file's
      // own sign convention. The point of this test isn't the specific
      // sign (that's an internal convention, not a gameplay contract) —
      // it's that steering is deterministic and un-inverted at an ordinary
      // temperature, which the test above confirms stays true even at an
      // extreme one.
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = true;
      marble.velocity = new Vector3(0, 0, 1);
      marble.currentSurface = "asphalt";
      marble.currentTemperature = 25; // matches asphalt's own base temperature

      marble.applySteeringForce(1, 1);

      expect(marble.velocity.x).toBeLessThan(0);
    });
  });

  describe("regression: the pre-fix uphill-launch bug cannot recur silently", () => {
    test("a marble at rest with no thrust does not move forward on an uphill grade", () => {
      // Locks in the corrected sign from the gravity fix: without thrust,
      // gravity alone must never push a stationary marble further uphill.
      const marble = new Marble(new Vector3(0, 0, 0));
      marble.onGround = true;
      marble.velocity = new Vector3(0, 0, 0);

      marble.applyGravity(1, 0.5); // uphill, no thrust applied

      expect(marble.velocity.z).toBeLessThanOrEqual(0);
    });
  });
});

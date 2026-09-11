# Phase 1: Foundation — Marble Racing Game Core Systems

**Duration:** ~2 weeks (conceptual)  
**Goal:** Establish the core physics engine, basic track, and proof-of-concept gameplay loop.  
**Platform:** Android mobile (primary target)  
**Development Environment:** Visual Studio Code

---

## Phase 1 Overview

Phase 1 focuses on building the foundation—a working marble physics system, a simple playable track, and basic opponent AI. By the end of this phase, you should have:

- A marble that rolls realistically on different surfaces
- A simple racetrack with multiple surface types
- One basic opponent marble
- A complete race from start to finish
- The ability to test on Android or a mobile emulator

---

## Task Breakdown

### 1. Project Structure & Setup

**Objective:** Create a well-organized folder hierarchy that supports physics, rendering, gameplay logic, and asset management.

**Deliverables:**
- [ ] Initialize VS Code project
- [ ] Set up Git repository
- [ ] Create folder structure:
  ```
  RollOut/
  ├── src/
  │   ├── physics/
  │   │   ├── marble.ts
  │   │   ├── surface.ts
  │   │   ├── collision.ts
  │   │   └── constants.ts
  │   ├── rendering/
  │   │   ├── renderer.ts
  │   │   ├── camera.ts
  │   │   └── sprites.ts
  │   ├── gameplay/
  │   │   ├── track.ts
  │   │   ├── race.ts
  │   │   ├── opponent.ts
  │   │   └── input.ts
  │   ├── game.ts
  │   └── main.ts
  ├── assets/
  │   ├── sprites/
  │   ├── sounds/
  │   └── tracks/
  ├── docs/
  │   ├── DESIGN.md
  │   ├── PHYSICS.md
  │   └── ARCHITECTURE.md
  ├── package.json
  ├── tsconfig.json
  └── README.md
  ```

**Notes:**
- Use TypeScript for type safety
- Install these dependencies:
  - `three.js` or `babylon.js` (3D/2D rendering)
  - `cannon-es` (physics engine) or custom physics
  - `webpack` (bundler)
  - `ts-loader` (TypeScript loader)

---

### 2. Game Design Pillars Document

**Objective:** Crystallize the design philosophy so all future decisions align with it.

**Deliverables:**
- [ ] Create `docs/DESIGN.md` with these sections:

#### Core Pillars
1. **Rolling is the core fantasy**
   - The player's interaction is fundamentally about steering a marble
   - Physics-driven, not arcade-simplified
   - Every surface change affects how the marble moves

2. **Surfaces matter**
   - Friction, drag, and grip vary by terrain type
   - Visual changes in track appearance directly affect gameplay
   - Players learn: "ice = slippery," "asphalt = grippy," "sand = slow"

3. **Upgrades must be visible**
   - Upgraded marbles look or move noticeably better
   - Stat changes translate to tangible gameplay differences
   - Grinding should feel rewarding

4. **Simple visual style, deep physics**
   - Graphics are stylized, not photorealistic
   - Physics calculations are accurate and complex beneath the surface
   - Gameplay is readable on small mobile screens

5. **Mobile-first design**
   - Touch-friendly controls
   - Smooth performance on mid-range Android phones
   - Readable camera framing
   - No required 120 FPS (60 FPS is acceptable)

#### Game Loop
- **Menu → Race Selection → Countdown → Race Start → Marble Control → Finish → Results → Upgrade/Unlock → Back to Menu**

#### Playable Moment
- Player taps to accelerate or tilts device to steer
- Marble rolls downhill and around curves
- Different surface types slow or speed the marble
- Player crosses finish line and sees race time/rank

---

### 3. Core Marble Physics Model

**Objective:** Create a mathematically accurate marble model that rolls, collides, and responds to surfaces.

**Deliverables:**
- [ ] Create `src/physics/marble.ts`
- [ ] Implement:

```typescript
interface MarbleState {
  position: Vector3;           // (x, y, z) position in world
  velocity: Vector3;           // (vx, vy, vz) linear velocity
  angularVelocity: Vector3;    // rotation per second
  mass: number;                // kg (typically 0.1 to 1.0)
  radius: number;              // meters (typically 0.1)
  linearDamping: number;       // air resistance (0.01 to 0.1)
  angularDamping: number;      // rotational damping (0.01 to 0.1)
}

interface MarblePhysicsConstants {
  gravity: number;             // 9.81 m/s²
  rollingResistance: number;   // typically 0.001 to 0.01 depending on surface
  restitution: number;         // bounce (0 = no bounce, 1 = infinite)
  friction: number;            // grip coefficient
}
```

**Core equations to implement:**

1. **Gravity and velocity update:**
   ```
   velocity.y -= gravity * deltaTime
   position += velocity * deltaTime
   ```

2. **Angular velocity and rolling:**
   ```
   // Marble spins as it rolls (no-slip condition)
   spinVelocity = velocity / radius
   position += (velocity + spinVelocity * radius) * deltaTime
   ```

3. **Rolling resistance (slows marble over time):**
   ```
   velocity *= (1 - rollingResistance * deltaTime)
   ```

4. **Surface friction (grip during turns):**
   ```
   // On low-friction surfaces like ice:
   turnForce = steerInput * friction
   // On high-friction surfaces like asphalt:
   turnForce = steerInput * friction (higher value)
   ```

5. **Simple collision with track:**
   ```
   if marbleY < trackHeightAtPosition(marbleX, marbleZ):
     marbleY = trackHeightAtPosition(marbleX, marbleZ)
     velocity.y = 0  // stick to surface
   ```

**Notes:**
- Keep the physics deterministic (same input = same output every time)
- Start simple; add complexity only if needed
- Validate with analytical solutions (e.g., marble rolling down a ramp should reach a predictable speed)

---

### 4. Surface System

**Objective:** Define surface types and how they affect marble behavior.

**Deliverables:**
- [ ] Create `src/physics/surface.ts`

```typescript
interface Surface {
  name: string;
  friction: number;            // 0.0 to 2.0 (higher = more grip)
  rollingResistance: number;   // 0.0 to 0.05 (higher = more drag)
  color: string;               // visual identifier
  visualEffect?: string;       // particles, sound, etc.
}

const SURFACES = {
  asphalt: { friction: 1.2, rollingResistance: 0.003, color: "#444444" },
  dirt: { friction: 0.9, rollingResistance: 0.008, color: "#8B4513" },
  ice: { friction: 0.3, rollingResistance: 0.001, color: "#E0F6FF" },
  sand: { friction: 0.6, rollingResistance: 0.015, color: "#FFFACD" },
};
```

**For Phase 1, use these 4 surfaces:**
- Asphalt (default, high grip)
- Dirt (medium grip, medium drag)
- Ice (low grip, very smooth)
- Sand (low grip, high drag)

**Implementation:**
- Track is divided into regions
- Each region has a surface type
- As the marble moves through regions, apply that surface's physics

---

### 5. First Test Track

**Objective:** Create a simple but varied track that tests all surface types and basic geometry.

**Deliverables:**
- [ ] Create `src/gameplay/track.ts` with track definition:

```typescript
interface TrackSegment {
  start: Vector3;
  end: Vector3;
  width: number;
  surface: string;             // "asphalt", "ice", "dirt", etc.
  height?: number;             // if varying
  curve?: number;              // 0 = straight, 1 = tight curve
}

const TRACK_PHASE_1: TrackSegment[] = [
  { start: {x: 0, y: 5, z: 0}, end: {x: 0, y: 3, z: 20}, width: 2, surface: "asphalt" },      // Start line (downhill)
  { start: {x: 0, y: 3, z: 20}, end: {x: 10, y: 2, z: 30}, width: 2, surface: "dirt" },       // Left turn on dirt
  { start: {x: 10, y: 2, z: 30}, end: {x: 10, y: 1, z: 50}, width: 2, surface: "asphalt" },   // Straight
  { start: {x: 10, y: 1, z: 50}, end: {x: -10, y: 0.5, z: 60}, width: 2, surface: "ice" },    // Icy curve (hard to grip)
  { start: {x: -10, y: 0.5, z: 60}, end: {x: -5, y: 0, z: 80}, width: 2, surface: "sand" },   // Sand section
  { start: {x: -5, y: 0, z: 80}, end: {x: 0, y: -0.5, z: 100}, width: 2, surface: "asphalt" }, // Final sprint
];

// Finish line at z = 100
const FINISH_LINE_Z = 100;
```

**Visual representation:**
- Use simple 3D geometry (cubes, planes)
- Color code each surface
- Render checkpoints and finish line clearly

---

### 6. Basic Rendering & Camera

**Objective:** Display the marble, track, and opponent on screen with a mobile-friendly camera.

**Deliverables:**
- [ ] Create `src/rendering/renderer.ts`
- [ ] Create `src/rendering/camera.ts`

**Rendering requirements:**
1. Draw the marble (sphere or simple shape)
2. Draw the track (colored planes for each surface segment)
3. Draw the opponent marble
4. Render UI: speed, position, race timer

**Camera settings for mobile:**
- Third-person, slightly above and behind the marble
- Follow marble smoothly
- Keep track fully visible
- Adjust FOV for small screens (tighter framing)

```typescript
class GameCamera {
  followTarget(marble: Marble, deltaTime: number) {
    const targetPos = marble.position + offset; // offset = {x: 0, y: 2, z: -8}
    this.position = lerp(this.position, targetPos, 5 * deltaTime);
    this.lookAt(marble.position + {y: 1, z: 0});
  }
}
```

---

### 7. Mobile Input System

**Objective:** Translate touch and tilt input into marble steering.

**Deliverables:**
- [ ] Create `src/gameplay/input.ts`

**Two input options (choose one or both):**

**Option A: Touch steering**
```typescript
function handleTouchInput(touchX: number, touchY: number) {
  const centerX = screen.width / 2;
  const steerAmount = (touchX - centerX) / (screen.width / 2); // -1 to +1
  marble.applySteeringForce(steerAmount);
}
```

**Option B: Tilt steering**
```typescript
function handleAccelerometerInput(tiltX: number, tiltY: number) {
  const steerAmount = tiltX / 90; // normalize to -1 to +1
  marble.applySteeringForce(steerAmount);
}
```

**For Phase 1:** Implement touch steering (simpler to test on desktop and emulator).

---

### 8. Basic Opponent AI

**Objective:** Create one simple opponent marble that follows the track and races competitively.

**Deliverables:**
- [ ] Create `src/gameplay/opponent.ts`

**Simple AI logic:**
1. Know the track waypoints
2. Always steer toward the next waypoint
3. Accelerate down straights, brake on curves
4. Respawn if it gets stuck or falls off track

```typescript
class OpponentMarble extends Marble {
  waypoints: Vector3[];
  currentWaypoint: number = 0;

  update(deltaTime: number) {
    const target = this.waypoints[this.currentWaypoint];
    const direction = (target - this.position).normalize();
    
    // Steer toward waypoint
    const steerForce = calculateSteeringForce(this.velocity, direction);
    this.applyForce(steerForce);

    // Check if reached waypoint
    if (distance(this.position, target) < 5) {
      this.currentWaypoint += 1;
    }

    super.update(deltaTime);
  }
}
```

---

### 9. Race Loop & Game State

**Objective:** Implement the full race flow: countdown, racing, finish detection, results.

**Deliverables:**
- [ ] Create `src/gameplay/race.ts`

```typescript
enum RaceState {
  Menu,
  Countdown,
  Racing,
  Finished,
  Results,
}

class RaceManager {
  state: RaceState = RaceState.Countdown;
  countdownTimer: number = 3;
  playerMarble: Marble;
  opponentMarble: Marble;
  track: Track;
  
  update(deltaTime: number) {
    switch (this.state) {
      case RaceState.Countdown:
        this.countdownTimer -= deltaTime;
        if (this.countdownTimer <= 0) {
          this.state = RaceState.Racing;
        }
        break;

      case RaceState.Racing:
        this.playerMarble.update(deltaTime);
        this.opponentMarble.update(deltaTime);
        
        if (this.playerMarble.position.z >= FINISH_LINE_Z) {
          this.playerFinishTime = this.raceTime;
          this.state = RaceState.Finished;
        }
        if (this.opponentMarble.position.z >= FINISH_LINE_Z) {
          this.opponentFinishTime = this.raceTime;
        }
        
        this.raceTime += deltaTime;
        break;

      case RaceState.Finished:
        // Show results screen
        break;
    }
  }

  render() {
    // Draw marble, opponent, track, UI
  }
}
```

---

### 10. Physics Validation & Testing

**Objective:** Verify that marble physics behaves realistically.

**Deliverables:**
- [ ] Run test scenarios:
  1. **Gravity test:** Drop marble from height, verify it falls at 9.81 m/s²
  2. **Rolling test:** Roll marble down a ramp, verify speed matches physics equations
  3. **Friction test:** Roll marble on different surfaces, verify speeds differ appropriately
  4. **Turn test:** Steer marble on curve, verify it banks realistically (or slides on ice)
  5. **Collision test:** Roll marble through surface transitions, verify no glitches

- [ ] Document any issues found
- [ ] Adjust physics constants if needed

---

## Phase 1 Deliverables Checklist

- [ ] Project folder structure created
- [ ] Git repository initialized
- [ ] TypeScript and build tools configured
- [ ] Design pillars document written
- [ ] Marble physics model implemented
- [ ] Surface system defined
- [ ] First track laid out
- [ ] Basic rendering working
- [ ] Mobile input system working
- [ ] Opponent AI running
- [ ] Race loop complete and playable
- [ ] Physics validated and tested
- [ ] README updated with how to build and run Phase 1

---

## Success Criteria

**Phase 1 is successful when:**
1. You can start a race, see a marble rolling down the track
2. The marble responds to input (touch or tilt)
3. The marble slows down on sand, speeds up on ice, handles normally on asphalt
4. An opponent marble races alongside you
5. Both marbles reach the finish line and the race ends
6. Physics feel believable (marbles don't float, don't instantly speed up, etc.)

---

## Next Steps (Preview to Phase 2)

Once Phase 1 is complete:
- Add multiple tracks / levels
- Implement upgrade system
- Add visual feedback (speed lines, particle effects)
- Introduce special surfaces (lava, bouncy zones)
- Build main menu and track selection
- Add sound design


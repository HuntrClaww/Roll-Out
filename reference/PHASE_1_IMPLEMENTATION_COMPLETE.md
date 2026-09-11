# Phase 1: Complete Implementation Guide

## Overview
Phase 1 has been fully enhanced with advanced physics principles from the physics/geography framework. The implementation transforms RollOut from a basic marble racer into a physics-accurate simulation with realistic environmental effects.

## What's New in Phase 1

### 1. Enhanced Physics System (`src/physics/marble.ts`)

#### Core Improvements:
- **Vector3 Math Library**: Complete 3D vector operations (add, subtract, multiply, dot product, cross product, normalize)
- **Marble Material System**: 4 material types with distinct properties:
  - **Steel** (2700 kg/m³): High density, moderate friction, high restitution
  - **Rubber** (920 kg/m³): Low density, high friction, low restitution
  - **Glass** (2500 kg/m³): High density, low friction, very high restitution
  - **Stone** (2700 kg/m³): High density, moderate friction, moderate restitution

#### Physics Methods Implemented:

1. **Gravity with Slope Component**
   - Perpendicular gravity (y-axis): `v_y -= g * cos(slope) * dt`
   - Downslope acceleration: `v_z += g * sin(slope) * dt`
   - Makes hills feel natural and different from flat surfaces

2. **Air Drag (Aerodynamic Resistance)**
   - Equation: `F_drag = 0.5 * ρ * v² * A * C_d`
   - Air density decreases with altitude: `ρ = ρ₀ * e^(-h/H)`
   - Sphere drag coefficient: 0.47
   - Effect: Speeds plateau due to air resistance at high altitudes

3. **Temperature-Dependent Friction**
   - Surface friction adjusts by temperature: `f = f₀ * (1 + k * ΔT)`
   - Each surface has base temperature and sensitivity coefficient
   - Example: Ice at -10°C with k=0.05 becomes much less slippery if warmed
   - Makes environmental conditions meaningful

4. **Rolling Resistance**
   - Gradually slows marbles on flat surfaces
   - Adjusted by surface temperature for realistic behavior
   - No-slip condition maintained: `v_linear = ω * r`

5. **Angular Momentum & Gyroscopic Effect**
   - Moment of inertia: `I = (2/5) * m * r²`
   - Spinning marble resists steering (gyroscopic damping)
   - Spin provides traction bonus in turns
   - Formula: `steering_force *= 1 / (1 + gyro_damping * ω)`
   - Also adds spin traction: `steering *= (1 + spin_traction_bonus)`

6. **Wind Physics**
   - Applied as lateral acceleration
   - Wind vector can simulate jet streams, cavern drafts, mountain passes
   - Makes track positions feel distinct

7. **Elevation System**
   - Each marble tracks current altitude
   - Air density changes based on elevation
   - Temperature varies by elevation naturally
   - Affects all physics calculations

### 2. Track System with Environmental Zones (`src/gameplay/track.ts`)

#### Track Architecture:
- **TrackRegion Interface**: Defines track sections with properties
  - Elevation profile (base to peak)
  - Surface type
  - Temperature
  - Wind vector
  - Name and description

#### Pre-Built Tracks Inspired by Physics/Geography:

**Mountain Pass Track** (80-300m elevation)
- **Base Camp** (0-50m): Gravel, warm, gentle wind
- **Alpine Meadow** (50-200m): Rocky terrain, cold, strong crosswind
- **Mountain Peak** (200-300m): Icy, very cold (-15°C), extreme opposing wind
- **Descent** (300-100m): Fast asphalt descent with tailwind
- Features: Elevation extremes, temperature gradient, challenging physics

**Volcanic Basin Track** (10-80m elevation, 25-150°C)
- **Outer Plain** (10-15m): Safe cool zone, asphalt
- **Obsidian Fields** (15-40m): Black volcanic glass, 60°C, reduced friction
- **Lava Flow Channels** (40-80m): Ancient lava flows, 150°C extreme heat
- **Cooling Basin** (80-30m): Gravel, returning to stable temperature
- Features: Extreme temperatures, varied surfaces, heat effects on marble behavior

**Frozen Cavern Track** (-70-10m elevation, -30 to 0°C)
- **Cavern Entrance** (0 to -20m): Transition zone, cave entrance wind
- **Deep Freeze** (-20 to -60m): Ancient glacial ice, howling winds
- **Wind Tunnel** (-60 to -70m): Extreme wind speeds (4 m/s), treacherous conditions
- **Exit Rise** (-70 to +10m): Steep climb back to surface
- Features: Constant cold, extreme wind, underground dynamic

### 3. Enhanced Main Game Loop (`src/main.ts`)

#### Features:

**Dynamic Track Integration**
```typescript
- Player marble gets track conditions at Z position
- Surface type, temperature, elevation all affect physics
- Wind vector applied each frame
- Slope angle calculated for gravity
```

**Material Visualization**
- Marbles render with material-specific colors
- Steel = Silver, Rubber = Dark, Glass = Light Blue, Stone = Tan
- Visual feedback helps understand marble properties

**Spin Indicator**
- Spinning marbles show yellow ring around them
- Visual representation of angular momentum
- Helps understand gyroscopic effects

**Environmental Display**
- Current surface type and temperature
- Elevation and air density
- Wind speed at current position
- Spin rate (debug mode)

**Track Visualization**
- Track profile drawn as 3D-like curve
- Surface type shown with color-coded regions
- Region names labeled
- Elevation changes obvious visually

**Debug UI** (Toggle with 'D')
- Spin rate (rad/s)
- Wind speed (m/s)
- Position along track
- Instructions for track selection

**Track Selection**
- Press '1' for Mountain Pass
- Press '2' for Volcanic Basin
- Press '3' for Frozen Cavern
- Marble positions reset when switching

### 4. Physics Constants Enhanced (`src/physics/constants.ts`)

#### New Systems:

**Marble Materials**
```typescript
- density: kg/m³
- baseFriction: 0-1 range
- restitution: bounce coefficient (0-1)
- rollingResistance: friction when rolling
- thermalConductivity: heat absorption factor
```

**Surfaces with Temperature Data**
```typescript
- baseFriction: surface friction at base temperature
- temperature: °C (reference temperature)
- temperatureCoefficient: how much temperature affects friction
- rollingResistance: resistance to rolling
- Examples:
  - Asphalt: 25°C, coefficient 0.015
  - Ice: -10°C, coefficient 0.05 (very temperature-sensitive)
  - Lava: 200°C, coefficient 0.1 (changes dramatically with temp)
```

**Atmospheric Physics**
```typescript
- AIR_DENSITY_SEA_LEVEL: 1.225 kg/m³
- SCALE_HEIGHT: 8500m (altitude scale)
- DRAG_COEFFICIENT: 0.47 (sphere)
- MARBLE_CROSS_SECTION: π * r²
```

**Angular Momentum**
```typescript
- GYROSCOPIC_DAMPING: steering resistance from spin
- SPIN_TRACTION_BONUS: grip improvement from spin
- Moment of inertia calculated: I = (2/5) * m * r²
```

## Physics Concepts Realized

### From Physics Framework:

1. **Classical Mechanics**
   - ✅ Newton's Laws (F = ma, motion equations)
   - ✅ Rotational motion (angular velocity, moment of inertia)
   - ✅ Energy conservation (speed variations)
   - ✅ Friction models (static, kinetic, rolling)

2. **Geomorphology**
   - ✅ Elevation gradients and slopes
   - ✅ Geological surfaces (rock types)
   - ✅ Terrain variation and valleys
   - ✅ Track design inspired by real geology

3. **Spherical Object Properties**
   - ✅ Sphere geometry (volume, moment of inertia)
   - ✅ Material properties (density, composition)
   - ✅ Rotational dynamics
   - ✅ Surface interactions

4. **Atmospheric Physics**
   - ✅ Air density variations with altitude
   - ✅ Drag forces on moving objects
   - ✅ Wind effects on trajectory
   - ✅ Aerodynamic resistance

5. **Thermodynamics**
   - ✅ Temperature-dependent friction
   - ✅ Surface temperature profiles
   - ✅ Environmental effects on physics
   - ✅ Thermal conductivity of materials

## Gameplay Impact

### Material Choice Matters
- **Steel marble**: Fast on smooth surfaces, slowed by air drag at altitude
- **Rubber marble**: Grips well on hills, rolls slower due to resistance
- **Glass marble**: Super bouncy, very slippery, needs precise control
- **Stone marble**: Balanced, moderate in all properties

### Surface Conditions Matter
- **Cold ice**: Low friction, marble slides; warms up reduces sliding
- **Hot lava**: Extreme friction changes, marble can get "stuck" temporarily
- **Volcanic obsidian**: Always slippery, creates distinctive feel
- **Asphalt**: Reliable, predictable baseline

### Environment Matters
- **High altitude**: Thin air reduces drag, but marble slows due to gravity
- **Wind**: Can push marble sideways, requires steering input to compensate
- **Temperature**: Changes grip, affects how marble responds to input
- **Slopes**: Accelerate downhill naturally, resist uphill

## Testing Phase 1

### What to Test:

1. **Marble Behavior on Different Surfaces**
   ```
   - Start on Mountain Pass track
   - Notice marble accelerates on slope
   - Try steering with gyroscopic effect
   - See how spin affects grip in turns
   ```

2. **Temperature Effects**
   ```
   - Volcanic track shows hot obsidian
   - Observe different physics behavior
   - Compare with cold ice cavern
   - Temperature indicators in UI
   ```

3. **Wind Physics**
   ```
   - Mountain peak has strong wind
   - Marble drifts sideways against wind
   - Requires active steering to maintain course
   - Wind tunnel in cavern is extreme test
   ```

4. **Material Differences**
   ```
   - Steel marble: Silver, balanced
   - Glass marble: Blue, very bouncy/slippery
   - Rubber marble: Dark, good grip
   - Stone marble: Tan, all-around capable
   ```

5. **Aerial Effects**
   ```
   - Jump off high section
   - Notice air drag slows falling marble
   - Speed plateaus due to air resistance
   - Heavier materials fall faster (larger mass)
   ```

### Debug Tips (Press 'D' to toggle):
- Watch Spin value during turns (should increase)
- Watch Wind speed at different track positions
- Watch elevation change and air density adjust
- Press 1/2/3 to switch tracks and observe different physics

## Files Modified/Created

### New Files:
- `src/physics/marble.ts` - Complete enhanced marble physics
- `src/gameplay/track.ts` - Track system with 3 geological tracks
- `reference/PHASE_1_IMPLEMENTATION_COMPLETE.md` - This document

### Modified Files:
- `src/physics/constants.ts` - Enhanced with material/surface/atmospheric data
- `src/main.ts` - Integrated track system, visualization, debug UI

### File Dependencies:
```
src/main.ts
├── src/physics/marble.ts (Vector3, Marble)
├── src/gameplay/track.ts (Track, createTrack)
└── src/physics/constants.ts (PHYSICS constants)

src/gameplay/track.ts
└── src/physics/marble.ts (Vector3)
```

## Architecture Notes

### Physics Update Pipeline:
```
1. Get environment at marble position (from track)
2. Set environmental conditions (surface, temp, altitude, wind)
3. Apply forces (gravity, air drag, wind)
4. Apply damping and rolling resistance
5. Update position based on velocity
6. Check collisions with track
7. Update angular velocity based on rolling
8. Apply steering forces (with gyroscopic effects)
9. Render marble at new position
```

### Physics Tuning Variables:
All physics can be tuned via `src/physics/constants.ts`:
- `GRAVITY`: 9.81 m/s² (can adjust for different "gravity feel")
- `MARBLE_LINEAR_DAMPING`: How quickly velocity decreases
- `MARBLE_ANGULAR_DAMPING`: How quickly spin decreases
- `GYROSCOPIC_DAMPING`: How much spin affects steering
- `SPIN_TRACTION_BONUS`: How much spin helps grip
- Material properties (density, friction, restitution)
- Surface properties (base friction, temperature coefficient)

## Next Steps (Phase 2-20)

Based on Phase 1 foundation, future phases can explore:
- **Boss encounters** (obstacles, competing marbles)
- **Marble upgrades** (modify material, add powers)
- **Advanced tracks** (loops, ramps, custom obstacles)
- **Multiplayer** (simultaneous marble racing)
- **Game modes** (time trials, battle modes)
- **Story integration** (game lore, narrative progression)
- **Advanced physics** (collisions, angular momentum transfer)
- **Visual enhancements** (particle effects, environmental details)

## Conclusion

Phase 1 now represents a complete, physics-grounded marble racing simulation. All core mechanics are in place, inspired by real-world physics principles from the comprehensive framework. The game feels natural because the underlying mathematics reflects reality.

Players can immediately understand how materials, surfaces, temperature, and wind affect their marble's behavior. Environmental conditions become strategic considerations, not random factors.

Ready for Phase 2 when you provide additional lore and want to expand with challenges, obstacles, and story progression.

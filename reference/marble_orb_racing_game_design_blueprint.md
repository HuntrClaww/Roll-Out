# Marble/Orb Racing Game — Design and Development Blueprint

## Purpose

This document is a focused design guide for an agentic AI helping build the game. It contains only gameplay, design, graphical plotting, terrain, physics, progression, and implementation plans.

### Explicitly Excluded

- Intro videos and cinematics
- Narration and dialogue scripts
- Voice acting
- Subtitle timing
- Cinematic SFX scripts
- AI video-generation workflows

---

# 1. Core Game Concept

The game is a racing game centered on spherical racers, informally called **marbles** or **orbs**.

Its defining contrast is:

> A visually simple game with surprisingly deep underlying rules.

The player races through unusual tracks, surfaces, environments, and obstacles. The experience combines racing, physics-driven movement, environmental adaptation, progression, experimentation, and imaginative worlds.

The player should not need scientific knowledge. Complex scientific ideas should operate mostly beneath the visible gameplay.

> **The science should be felt, not displayed.**

For example, the player should feel that one orb slides on ice or grips rough rock differently rather than being shown complicated friction equations.

---

# 2. Reality Meets Magic

The world should use recognizable physical principles while allowing the orbs to possess unusual traits that bypass certain ordinary limitations.

The goal is not to destroy physics completely. Instead:

> **Physics establishes the rules; the unusual properties of the orbs selectively bend or bypass some limitations.**

Possible examples:

- Seemingly impossible speeds
- Unusual movement across difficult surfaces
- Specialized body structures improving traction
- Material-like properties reacting differently to environments
- Strange worlds connected through dimensional transitions

The magical elements should still feel internally consistent.

---

# 3. Player Experience

The player should learn through observation and experimentation.

Desired player discoveries include:

- “This orb handles ice much better.”
- “These spikes help on this terrain.”
- “My current body is not suitable for this area.”
- “This obstacle requires speed rather than toughness.”
- “That upgrade actually changed the way my orb handles.”

The player-facing interface should use simple concepts such as:

- Grip
- Speed
- Stability
- Toughness
- Heat resistance
- Water handling
- Surface control

The underlying system may be much more sophisticated than the displayed information.

---

# 4. Orb Design

## 4.1 Orb Identity

Each important orb should be recognizable through combinations of:

- Base color
- Patterns
- Symbols or markings
- Material appearance
- Surface texture
- Attachments
- Body modifications
- Energy effects

Examples:

- A green orb with a painted X
- A metallic robotic-looking orb
- A rough rocky orb
- A crystalline orb
- A smooth lightweight orb
- An orb with spikes or traction structures

Customization should not completely erase the identity of the original orb.

## 4.2 Possible Orb Categories

Potential game-friendly categories include:

- Smooth
- Metallic
- Rocky
- Crystalline
- Heavy
- Lightweight
- Spiked
- Reinforced
- Heat-resistant
- Water-adapted

These do not need to be perfectly realistic scientific materials. They are gameplay identities inspired by physical properties.

---

# 5. Upgrades and Body Changes

The progression loop should be easy to understand:

> **Earn → Upgrade → Feel the difference.**

Possible upgrade areas:

- Surface texture
- Grip structures
- Spikes
- Protective layers
- Weight
- Balance
- Energy output
- Heat resistance
- Water resistance
- Impact resistance
- Rolling efficiency

## Upgrade Rule

Every upgrade should solve or alter a recognizable gameplay problem.

Ask:

- What problem does this upgrade solve?
- Which terrain becomes easier?
- What weakness might it introduce?
- Can the player visibly or physically notice the difference?

Avoid upgrades that only increase invisible numbers without changing the player's experience.

---

# 6. Environmental Adaptation

The environment should meaningfully affect the orb.

Important factors may include:

- Surface material
- Roughness
- Slope
- Temperature
- Water
- Ice
- Loose particles
- Moving terrain
- Environmental hazards

## Ice

Possible behavior:

- Reduced grip
- Longer sliding
- More difficult turning
- Specialized bodies may perform better

## Sand and Loose Material

Possible behavior:

- Increased rolling resistance
- Reduced momentum
- Partial sinking or slowdown
- Different results depending on body design

## Rocky Terrain

Possible behavior:

- Repeated impacts
- Unpredictable directional changes
- Advantage for strong or reinforced bodies

## Water

Possible behavior:

- Drag
- Buoyancy where appropriate
- Altered control
- Specialized orbs performing better

## Volcanic Terrain

Possible behavior:

- High temperatures
- Hot surfaces
- Lava hazards
- Steam
- Unstable ground

## Bubble or Soap Environments

Possible behavior:

- Extremely slippery surfaces
- Floating bubbles
- Temporary visual obstruction
- Bouncing or unusual movement
- Playful but difficult interactions

---

# 7. Terrain Design

Tracks should not simply be roads. Each track is a playable environmental system.

Terrain can influence:

- Speed
- Direction
- Grip
- Stability
- Momentum
- Jumping
- Survival
- Obstacle behavior

Potential terrain categories:

- Smooth manufactured tracks
- Rocky landscapes
- Ice worlds
- Volcanic worlds
- Sandy environments
- Water-filled tracks
- Bubble and soap worlds
- Mechanical environments
- Giant everyday environments where the orb is tiny

## Geographic Scale

Because the racers are small spherical objects, ordinary objects can become enormous landscapes. Streets, buildings, slopes, household objects, and water features can all become racing environments.

---

# 8. Obstacles

Obstacles should not be limited to stationary physical barriers.

An obstacle can be:

- A physical barrier
- A terrain problem
- A timing challenge
- A puzzle
- An environmental hazard
- A requirement demanding adaptation

## Physical Obstacles

- Rocks
- Walls
- Moving barriers
- Falling objects
- Rotating mechanisms
- Gaps

## Environmental Obstacles

- Extreme heat
- Ice
- Water currents
- Unstable terrain
- Slippery surfaces
- Loose material

## Requirement-Based Obstacles

Some areas should effectively ask:

> “Are you prepared for this?”

The player may need a particular body type, upgrade, grip level, heat resistance, stability level, or special trait.

Preparation should therefore become part of the challenge.

---

# 9. Physics Design

The game should use physics-inspired behavior without requiring a perfect scientific simulation.

Begin with:

- Gravity
- Velocity
- Acceleration
- Momentum
- Friction
- Collision response
- Slope effects

Later layers may include:

- Surface-specific friction
- Rolling resistance
- Temperature effects
- Material differences
- Water drag
- Weight effects
- Temporary environmental modifiers

## Start Simple

### Layer 1 — Basic Movement

- Player input
- Acceleration
- Deceleration
- Gravity
- Collision

### Layer 2 — Terrain

- Ice
- Rock
- Sand
- Smooth surfaces

### Layer 3 — Orb Differences

- Weight
- Grip
- Stability
- Material traits

### Layer 4 — Advanced Environment

- Temperature
- Water
- Dynamic hazards
- Special environmental reactions

Visual complexity should never force unnecessary technical complexity underneath.

---

# 10. Consistency Over Perfect Realism

Consistency is more important than scientific perfection.

If ice causes sliding, players should gradually learn what that means. If reinforced bodies perform better on rough terrain, that relationship should remain understandable.

Magical exceptions are acceptable, but they should have their own internal rules.

The player should gradually develop intuition about the universe.

---

# 11. Game Modes

## Adventure Mode

Adventure Mode is the primary progression area.

Players can:

- Travel through different worlds
- Encounter increasingly unusual tracks
- Meet bosses
- Unlock new possibilities
- Discover environmental challenges

Adventure Mode does not need to be open-world. It can consist of connected stages, worlds, dimensions, or track sequences.

## Challenge Mode

Challenge Mode contains specialized tasks.

Potential challenges:

- Reach a location within a time limit
- Survive an environmental hazard
- Complete a route using a restricted body type
- Maintain momentum
- Navigate an obstacle course
- Solve a terrain puzzle
- Meet boss requirements

Challenge Mode is closely connected to boss progression.

---

# 12. Boss System

Bosses should not simply unlock after completing a fixed number of levels.

Instead, bosses can issue specific requirements. The player must demonstrate relevant abilities before gaining the opportunity to race them.

Examples:

- Complete a difficult ice challenge
- Survive a volcanic route
- Finish a terrain puzzle
- Demonstrate sufficient control

Possible rewards:

- Unlocking the boss as a playable orb
- Unlocking some of the boss's traits
- Unlocking special upgrades
- Unlocking new areas

Not every boss should give away every unique characteristic. Some traits should remain exclusive.

---

# 13. Progression Loop

The general progression structure is:

```text
Race
 ↓
Earn
 ↓
Unlock or Upgrade
 ↓
Adapt to New Challenge
 ↓
Discover New Terrain
 ↓
Race Again
```

Grinding should feel useful because the player can see and feel what progress achieves.

---

# 14. Track Variety and Reusable Systems

The game should eventually support many tracks without requiring a completely new technical system for every one.

## Reusable Track Modules

- Straight sections
- Slopes
- Curves
- Jumps
- Narrow passages
- Moving platforms
- Hazard zones
- Puzzle sections
- Finish areas

## Reusable Environmental Modules

- Ice layers
- Rock layers
- Water areas
- Sand areas
- Heat zones
- Mechanical hazards

Combining reusable systems can produce large track variety efficiently.

---

# 15. Recommended Visual Direction

The playable game should remain primarily **2D or 2.5D**.

Do not attempt to reproduce high-end interactive 3D cinematic graphics during ordinary gameplay.

The recommended approach is:

> **A layered 2D world that creates an illusion of depth.**

This keeps development achievable while retaining visual personality.

---

# 16. 2.5D Rendering Strategy

Divide each playable scene into visual layers.

## Layer 1 — Background

Distant scenery and non-interactive elements:

- Mountains
- Cities
- Volcanoes
- Large machinery
- Strange skies
- Distant landscapes

## Layer 2 — Main Terrain and Track

The primary playable surface. This defines:

- Ground
- Slopes
- Curves
- Surface regions
- Collision boundaries

## Layer 3 — Gameplay Objects

Contains:

- Player orb
- Opponent orbs
- Interactive objects
- Moving obstacles

## Layer 4 — Foreground

Objects that occasionally pass in front of the action:

- Rocks
- Plants
- Mechanical components
- Large environmental structures

## Layer 5 — Effects

- Dust
- Water splashes
- Sparks
- Smoke
- Energy trails
- Environmental particles

---

# 17. Graphical Plotting Principles

Graphical plotting should be a structured system rather than random image placement.

Each playable scene should define:

- World boundaries
- Track path
- Collision zones
- Surface regions
- Spawn points
- Checkpoints
- Obstacles
- Decorative layers

Conceptual structure:

```text
SCENE
├── Background
├── Distant Decoration
├── Track
│   ├── Surface Zone A
│   ├── Surface Zone B
│   └── Collision Geometry
├── Gameplay Objects
│   ├── Player
│   ├── Opponents
│   └── Obstacles
├── Foreground Decoration
└── Visual Effects
```

Visual artwork and collision logic should be separable. A beautiful image should not automatically determine physical behavior.

---

# 18. Track Plotting

Plot tracks as understandable geometric systems.

For each track section, define:

- Position
- Width
- Height
- Surface type
- Slope
- Collision boundaries
- Special properties

A conceptual data structure may resemble:

```text
Track Segment
- start position
- end position
- visual style
- collision shape
- surface type
- friction modifier
- special effect
```

This supports many different track designs using the same core systems.

---

# 19. Creating Depth Without Full 3D

Create depth through:

- Parallax backgrounds
- Layered foreground objects
- Dynamic shadows
- Depth-based scaling
- Perspective-inspired track artwork
- Environmental particles
- Selective lighting

A fully rotating 3D camera is not required.

---

# 20. Orb Graphics and Asset Construction

The orb should be simple but visually expressive.

Potential techniques:

- Pre-rendered rotation sprites
- Multiple material textures
- Dynamic overlays
- Small attachment sprites
- Ground shadows
- Particle trails

Possible layered structure:

```text
ORB
├── Base body
├── Material texture
├── Identity marking
├── Upgrade attachment
├── Damage or dirt overlay
├── Energy glow
└── Shadow
```

This supports customization without creating a completely separate asset for every combination.

---

# 21. Surface Visualization

Players should visually recognize important terrain differences.

### Ice

- Reflective surfaces
- Cracks
- Cold particle effects

### Sand

- Loose grains
- Small dust clouds
- Soft visual edges

### Rock

- Irregular forms
- Visible bumps
- Small debris

### Water

- Ripples
- Reflections
- Splash effects

### Volcanic Terrain

- Dark rock
- Cracks
- Heat glow
- Steam

Visual recognition should help players predict possible behavior without displaying scientific explanations.

---

# 22. Procedural and Reusable Development

Do not manually hard-code every feature for every level.

Create reusable definitions for:

- Surface types
- Obstacles
- Track segments
- Particle effects
- Environmental themes
- Orb traits

Then assemble these systems into different combinations.

This supports ambitious goals, such as building a large number of tracks, without development complexity growing at the same rate.

---

# 23. Visual Priorities

Gameplay graphics should prioritize:

1. Readability
2. Performance
3. Consistency
4. Personality
5. Illusion of depth

over:

- Photorealism
- Excessive detail
- Complex cinematic rendering

The player must quickly understand:

- Where they are
- Where they can travel
- What is dangerous
- What surface they are touching
- What obstacle is approaching

---

# 24. Recommended Initial Technology Direction

A practical initial direction is:

- Visual Studio Code
- HTML
- CSS
- JavaScript
- A 2D game framework such as Phaser

The first objective should be a playable browser prototype.

Suggested development path:

```text
Core Movement Prototype
        ↓
Basic Physics
        ↓
One Test Track
        ↓
Surface Differences
        ↓
Orb Upgrades
        ↓
Obstacles
        ↓
Multiple Tracks
        ↓
Progression
        ↓
Android Packaging
```

The exact framework may change later. Gameplay architecture is more important than immediately choosing a sophisticated engine.

---

# 25. Minimum Viable Prototype

The first playable version should be deliberately small.

## One Orb

With:

- Acceleration
- Braking
- Rolling appearance
- Basic collision

## One Track

Containing:

- A slope
- A flat section
- At least two different surfaces
- One obstacle
- A finish point

## One Environmental Difference

For example, normal ground versus ice. The player should immediately feel the difference.

## One Upgrade

For example, increased grip. The player should then return to the same terrain and noticeably feel the improvement.

If this prototype works, the central concept is validated.

---

# 26. Development Priorities for an Agentic AI

The AI should work in stages and avoid attempting the entire game immediately.

1. Create a stable project structure.
2. Implement reliable orb movement.
3. Implement collision and terrain interaction.
4. Create one visually readable test track.
5. Add a second surface with noticeably different behavior.
6. Add one obstacle.
7. Add a basic upgrade system.
8. Separate game data from game logic so new tracks, surfaces, and orb types can be added efficiently.

---

# 27. Non-Negotiable Design Principles

The development process should preserve these principles:

### Keep the game approachable.
Do not expose excessive scientific terminology to ordinary players.

### Make physics experiential.
Players should learn primarily through movement and experimentation.

### Make upgrades matter.
Changes must produce noticeable effects.

### Make environments distinct.
A volcanic track should not merely be an ordinary track with different colors.

### Preserve orb identity.
Customization should not make characters unrecognizable.

### Make obstacles create decisions.
They should not merely block the player's path.

### Presentation can remain simple.
Complex internal logic is acceptable, but the player-facing experience should remain understandable.

### Keep development achievable.
Favor efficient 2D and 2.5D techniques over unnecessary full 3D complexity.

---

# 28. Long-Term Vision

The long-term vision is a stylized racing universe in which deceptively simple spherical racers encounter increasingly strange environments.

The player gradually learns to understand:

- The orb
- The terrain
- The environment
- The obstacle
- The required adaptation

The game should feel like:

> **A simple-looking racing game whose worlds become increasingly surprising as the player learns how they work.**

The primary experience is not scientific education. It is the feeling of:

> **“I understand why that happened. Let me try a different approach.”**

That feeling should drive experimentation, progression, replayability, and discovery.

---

# Final Instruction to the Development Agent

Do not attempt to build everything simultaneously.

Prove the core sequence first:

```text
ORB MOVES
   ↓
ORB INTERACTS WITH GROUND
   ↓
DIFFERENT SURFACES FEEL DIFFERENT
   ↓
PLAYER CAN ADAPT
   ↓
UPGRADES CREATE NOTICEABLE CHANGE
   ↓
OBSTACLES CREATE NEW PROBLEMS
   ↓
TRACKS COMBINE THESE SYSTEMS
```

Once this foundation is stable, the game can grow in creative scale without its core systems becoming chaotic.

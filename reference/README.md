# RollOut — Marble Racing Game

A physics-driven marble racing game designed for Android mobile platforms.

## Project Overview

**RollOut** is a game where spherical objects (marbles) race across varied terrain with realistic physics. The game emphasizes:

- **Physics-first gameplay:** Rolling resistance, surface friction, and angular momentum matter
- **Visual simplicity:** Stylized graphics that remain readable on mobile
- **Procedural progression:** Multiple surfaces, upgrades, and challenges unlock as you progress
- **Mobile-optimized:** Smooth performance on mid-range Android devices

## Quick Start

### Prerequisites

- Node.js (16+)
- npm or yarn
- Visual Studio Code (recommended)
- Android emulator or physical device (for testing)

### Installation

```bash
# Clone or navigate to the project
cd RollOut

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure

```
src/
├── physics/          # Core marble physics engine
├── rendering/        # Graphics, camera, UI rendering
├── gameplay/         # Game loop, races, AI, input
├── utils/            # Helper functions and types
└── main.ts          # Entry point

docs/
├── DESIGN.md        # Design philosophy and pillars
├── PHYSICS.md       # Physics equations and constants
└── ARCHITECTURE.md  # Technical architecture
```

## Development

### Running Phase 1

```bash
npm run dev
```

This starts a development server at `http://localhost:8080`. You can test in a desktop browser and on Android via emulator or physical device.

### Type Checking

```bash
npm run type-check
```

### Running Tests

```bash
npm test
```

## Architecture Highlights

### Physics System

- Sphere-based marble model
- Per-surface friction and rolling resistance coefficients
- Realistic collision detection
- Gravity and velocity updates every frame

### Rendering

- Three.js for 3D graphics
- Mobile-friendly camera positioning
- Real-time UI overlays (speed, position, timer)

### Gameplay

- Race manager handles game states (countdown, racing, finished)
- Input system translates touch/tilt to steering
- Simple opponent AI follows predefined waypoints

## Phase Roadmap

- **Phase 1 (Current):** Foundation — marble physics, first track, basic race loop
- **Phase 2:** Multiple tracks and environments
- **Phase 3:** Upgrade system and progression
- **Phase 4:** Boss encounters and challenge mode
- **Phase 5 onwards:** Polish, optimization, additional content

See [PHASE_1_FOUNDATION.md](./PHASE_1_FOUNDATION.md) for detailed Phase 1 breakdown.

## Design Documents

- [Design Pillars](./docs/DESIGN.md)
- [Physics Reference](./docs/PHYSICS.md)
- [Architecture](./docs/ARCHITECTURE.md)

## Contributing

Internal development only at this stage.

## License

MIT

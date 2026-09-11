# Phase 1: Foundation — Getting Started Checklist

## ✅ Completed Setup

- [x] Created project folder structure (`src/`, `docs/`, `assets/`, `public/`)
- [x] Initialized `package.json` with TypeScript and build tools
- [x] Configured `tsconfig.json` and `webpack.config.js`
- [x] Created core physics module:
  - [x] `src/physics/constants.ts` — Physics configuration
  - [x] `src/physics/marble.ts` — Marble model with gravity, damping, and rolling resistance
  - [x] `src/physics/surface.ts` — Surface types and friction data
- [x] Created basic game loop in `src/main.ts`
- [x] Created HTML entry point at `public/index.html`
- [x] Created `.gitignore` for Node and build artifacts
- [x] Created `PHASE_1_FOUNDATION.md` with detailed breakdown
- [x] Created `README.md` with project overview

## 📋 Next Steps to Complete Phase 1

### 1. Install Dependencies
```bash
cd "Roll Out - Roll Into The Extreme Wonderland"
npm install
```

This will install:
- `three.js` (for 3D graphics, if needed)
- `cannon-es` (physics engine, optional for phase 1)
- `webpack` & `ts-loader` (build tools)
- `typescript` (type checking)

### 2. Build and Run
```bash
npm run dev
```

This starts a development server at `http://localhost:8080`.

**What you should see:**
- A 2D canvas with sky and ground
- A red marble (player) falling
- A cyan marble (opponent) also falling
- UI showing speed, position, race time
- Both marbles responding to steering (left/right arrow keys or touch)

### 3. Test Physics
Once running, try:
1. **Press left/right arrows** — the marbles should steer left and right
2. **Watch them fall** — they should accelerate downward due to gravity
3. **Check the UI** — speed should increase as they fall
4. **Open browser console** — `game` object is exposed for debugging

### 4. Implement Remaining Systems

The basic physics loop is working. Now build:

1. **Track System** (`src/gameplay/track.ts`)
   - Define track segments with positions, surfaces, width
   - Start with the simple 6-segment track from Phase 1 docs
   - Render track as colored segments

2. **Advanced Rendering** (`src/rendering/`)
   - Upgrade from 2D canvas to 3D (Three.js)
   - Proper camera follow
   - Better marble and track visuals

3. **Opponent AI** (`src/gameplay/opponent.ts`)
   - Make opponent follow track waypoints
   - React to surfaces and curves
   - Competitive racing behavior

4. **Race Loop** (`src/gameplay/race.ts`)
   - Countdown timer before race starts
   - Finish line detection
   - Results screen showing times

### 5. Validate Physics
Run physics tests to ensure:
- [ ] Marble falls with correct acceleration (should reach ~10 m/s after 1 second)
- [ ] Different surfaces affect speed (sand should slow marble more than asphalt)
- [ ] Steering works smoothly without glitches
- [ ] No marbles get stuck or fly through surfaces

### 6. Document Your Findings
Update `docs/PHYSICS.md` with:
- Actual measured physics values
- Any deviations from theoretical predictions
- Tuning notes for "feel" adjustments

---

## Current Project Structure

```
RollOut/
├── src/
│   ├── physics/
│   │   ├── constants.ts       ✅ Done
│   │   ├── marble.ts          ✅ Done
│   │   ├── surface.ts         ✅ Done
│   │   └── collision.ts       📝 Next
│   ├── rendering/
│   │   ├── renderer.ts        📝 Next
│   │   └── camera.ts          📝 Next
│   ├── gameplay/
│   │   ├── track.ts           📝 Next
│   │   ├── race.ts            📝 Next
│   │   ├── opponent.ts        📝 Next
│   │   └── input.ts           📝 Next
│   └── main.ts                ✅ Done
├── public/
│   └── index.html             ✅ Done
├── docs/
│   ├── PHASE_1_FOUNDATION.md  ✅ Done
│   ├── DESIGN.md              📝 Next
│   ├── PHYSICS.md             📝 Next
│   └── ARCHITECTURE.md        📝 Next
├── package.json               ✅ Done
├── tsconfig.json              ✅ Done
├── webpack.config.js          ✅ Done
├── README.md                  ✅ Done
└── .gitignore                 ✅ Done
```

---

## Debugging Tips

### If the build fails:
1. Check `npm run type-check` for TypeScript errors
2. Look at webpack output for module issues
3. Ensure all imports are correct

### If marbles don't appear:
1. Check browser console for errors
2. Verify canvas is being created
3. Check that `render()` is being called each frame

### If physics feels wrong:
1. Adjust `PHYSICS` constants in `src/physics/constants.ts`
2. Add logging to `Marble.update()` to track values
3. Compare to expected physics equations

### On mobile/emulator:
1. Touch steering should map screen X position to steering angle
2. Test on multiple device sizes
3. Ensure canvas scales correctly with viewport

---

## Success Milestone

**Phase 1 is complete when:**
- You can run the game and see two marbles
- Steering input affects marble movement
- Physics feels responsive and believable
- No crashes or console errors
- Can test on Android emulator

At that point, move to **Phase 2: Multiple Tracks & Environments**.

---

## Questions or Issues?

Refer to:
- [PHASE_1_FOUNDATION.md](./PHASE_1_FOUNDATION.md) — Detailed system breakdown
- [README.md](./README.md) — Project overview
- Console logging in `src/main.ts` — Enable debug output
- Physics equations in `src/physics/marble.ts` — See the math

Good luck! 🚀

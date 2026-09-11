# RollOut Project Structure Outline

**Status:** Ready for Phase Planning (Phases 2-20)  
**Approach:** Push limits beyond Android constraints — optimize later  
**Organization:** Clean separation of working code and reference materials

---

## 📂 Project Layout (Current)

### Root Directory — Active Project Files

```
RollOut/
├── src/                           ✅ WORKING CODE
│   ├── physics/
│   │   ├── constants.ts
│   │   ├── marble.ts
│   │   └── surface.ts
│   ├── rendering/
│   ├── gameplay/
│   ├── utils/
│   └── main.ts
│
├── public/
│   └── index.html                 ✅ WORKING CODE
│
├── assets/                        ✅ GAME ASSETS
│   ├── sprites/
│   ├── sounds/
│   └── tracks/
│
├── package.json                   ✅ WORKING FILE
├── tsconfig.json                  ✅ WORKING FILE
├── webpack.config.js              ✅ WORKING FILE
├── .gitignore                     ✅ WORKING FILE
└── README.md                      ✅ WORKING FILE
```

### Reference Directory — Theory & Documentation

```
reference/
├── physics_geography_spherical_objects_conversation.md
│   └── Complete physics/geography/chemistry framework
│   └── Lists ALL physics laws, geographical principles, elemental properties
│   └── For deep understanding of what marble physics COULD be
│
├── marble_racing_game_conversation_history.md
│   └── Original design conversation
│   └── Game pillars, modes (Adventure, Challenge), boss encounters
│   └── Marble characteristics, progression systems
│   └── Contains scattered lore notes (to extract later)
│
├── PHASE_1_FOUNDATION.md
│   └── Detailed Phase 1 system breakdown
│   └── 10 core systems: physics, surfaces, track, rendering, input, AI, race loop
│
├── PHASE_1_CHECKLIST.md
│   └── Getting-started guide
│   └── Step-by-step tasks and validation
│
└── (Future)
    ├── LORE.md — Game narrative (when ready)
    ├── PHASE_2_PLANNING.md
    ├── PHASE_3_PLANNING.md
    └── ... PHASE_20_PLANNING.md
```

---

## 🎯 What Stays in Root (Why?)

| File/Folder | Why |
|---|---|
| `src/` | **Active development** — all game code goes here |
| `public/` | **Build target** — HTML entry point |
| `assets/` | **Game content** — sprites, sounds, tracks |
| `package.json` | **Dependencies** — build system needs it |
| `tsconfig.json` | **TypeScript config** — compiler needs it |
| `webpack.config.js` | **Build config** — bundler needs it |
| `.gitignore` | **Git rules** — keeps repo clean |
| `README.md` | **Developer guide** — how to build/run |
| `FILE_ORGANIZATION.md` | **This document** — project structure reference |

These are **essential for the build pipeline**.

---

## 📚 What Moved to `/reference/` (Why?)

| File | Why |
|---|---|
| `physics_geography_spherical_objects_conversation.md` | **Theory reference** — comprehensive physics/chemistry/geography knowledge base |
| `marble_racing_game_conversation_history.md` | **Design history** — original conversation, design decisions, lore fragments |
| `PHASE_1_FOUNDATION.md` | **Implementation guide** — read-only reference for Phase 1 architecture |
| `PHASE_1_CHECKLIST.md` | **Getting-started** — read-only checklist and validation steps |

These are **reference materials** — they inform decisions but aren't needed for the build.

---

## 🔄 Knowledge Map

### From `/reference/` → Into Phases

```
physics_geography_spherical_objects_conversation.md
    ↓
    Informs what's POSSIBLE for each surface type
    Informs thermal systems (Phase X?)
    Informs advanced environmental effects (Phase X?)

marble_racing_game_conversation_history.md
    ↓
    Game modes (Adventure, Challenge) → Phases 2-5
    Boss encounters → Phases 4-6
    Marble characteristics → Phase 3
    Progression systems → Phases 2-3
    Lore fragments → To be extracted and integrated
```

---

## ✅ File Organization Complete

### Currently in Root:
- ✅ `src/` — TypeScript game code
- ✅ `public/` — HTML/web assets
- ✅ `assets/` — Game sprites/sounds/tracks
- ✅ Build configuration files
- ✅ `README.md` — Developer guide
- ✅ `FILE_ORGANIZATION.md` — This document

### Currently in `/reference/`:
- ✅ `physics_geography_spherical_objects_conversation.md` — Physics/chemistry/geography framework
- ✅ `marble_racing_game_conversation_history.md` — Design conversation history
- ✅ `PHASE_1_FOUNDATION.md` — Phase 1 breakdown
- ✅ `PHASE_1_CHECKLIST.md` — Phase 1 getting started

---

## 🚀 Next Steps

1. **Phase Planning (Phases 2-20)** — Continue in main conversation
2. **Ignore Android Studio constraints** — Build ambitiously, optimize later
3. **Add Game Lore** — When you have the opening story ready
4. **Update `/reference/`** — As phases are designed, create PHASE_X_PLANNING.md files

---

## 💡 Design Philosophy (From Reference Materials)

**From the physics/geography framework:**
- We have comprehensive knowledge of real-world physics
- We understand terrain, climate, seasons, environmental factors
- We understand spherical objects, composition, internal structure

**Apply to RollOut:**
- Use selective physics (not all of it) for fun gameplay
- Create diverse track types (reference: terrain types)
- Implement surface variety (reference: climate/composition)
- Build progression naturally (reference: how things evolve over time)

**From the marble racing conversation:**
- Adventure mode: race through varied tracks
- Challenge mode: face specific boss marbles
- Progression: unlock new marble types and features
- Lore: marbles traveling through dimensions

**Phases 2-20 should:**
- Expand track variety (use terrain knowledge)
- Introduce environmental effects (use climate/seasonal knowledge)
- Add boss encounters (from conversation notes)
- Implement upgrade systems (from conversation notes)
- Integrate lore (when ready)

---

## 📝 Convention for Future Files

When creating new documentation:
- **Active project files** → Root directory
- **Theory/reference** → `/reference/` folder
- **Phase plans** → `/reference/PHASE_X_PLANNING.md`
- **Implementation files** → `src/` directory

---

## ✨ Ready to Begin

**With this organization:**
1. ✅ Project code is clean and focused
2. ✅ Reference materials are accessible
3. ✅ Knowledge is preserved and searchable
4. ✅ Ready to design Phases 2-20
5. ✅ Ready to add lore when available
6. ✅ Ready to push creative limits

**Next phase:** Planning Phases 2-20 without Android constraints.

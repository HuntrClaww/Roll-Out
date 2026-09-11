# RollOut Project File Organization

## 📁 Root Directory Structure

```
RollOut/
│
├── src/                          ✅ KEEP - Source code (TypeScript)
│   ├── physics/
│   ├── rendering/
│   ├── gameplay/
│   ├── utils/
│   └── main.ts
│
├── public/                       ✅ KEEP - Web/public assets
│   └── index.html
│
├── docs/                         ⚠️  MOVE TO /reference/ (later)
│   └── (game design docs will go here later)
│
├── assets/                       ✅ KEEP - Game assets
│   ├── sprites/
│   ├── sounds/
│   └── tracks/
│
├── package.json                  ✅ KEEP - Dependencies
├── tsconfig.json                 ✅ KEEP - TypeScript config
├── webpack.config.js             ✅ KEEP - Build config
├── .gitignore                    ✅ KEEP - Git ignore
├── README.md                     ✅ KEEP - Project overview
│
└── reference/                    ✅ NEW - Theory & Reference Materials
    ├── PHYSICS_GEOGRAPHY_SPHERICAL_OBJECTS.md
    ├── MARBLE_RACING_CONVERSATION_HISTORY.md
    ├── PHASE_1_FOUNDATION.md
    ├── PHASE_1_CHECKLIST.md
    └── (other reference docs)
```

---

## ✅ Files to Keep in Root

These are **working project files** — they stay in the main directory:

| File/Folder | Purpose |
|---|---|
| `src/` | All game source code (physics, rendering, gameplay) |
| `public/` | Public HTML and browser assets |
| `assets/` | Game sprites, sounds, tracks (non-code) |
| `package.json` | npm dependencies |
| `tsconfig.json` | TypeScript configuration |
| `webpack.config.js` | Build configuration |
| `.gitignore` | Git ignore rules |
| `README.md` | Project overview for developers |

---

## 📚 Files to Move to `/reference/`

These are **theory, documentation, and reference materials** — they go to `/reference/`:

| File | Purpose |
|---|---|
| `physics_geography_spherical_objects_conversation.md` | Complete physics/geography/chemistry framework |
| `marble_racing_game_conversation_history.md` | Original conversation history & design notes |
| `PHASE_1_FOUNDATION.md` | Phase 1 detailed breakdown (reference) |
| `PHASE_1_CHECKLIST.md` | Phase 1 checklist (reference) |
| `DESIGN_PILLARS.md` | Core game design philosophy |
| `LORE.md` | (To be added) Game story and narrative |
| (future) `ARCHITECTURE_OVERVIEW.md` | System architecture decisions |
| (future) `PHYSICS_DEEP_DIVE.md` | Detailed physics equations & tuning |

---

## 🎯 Why This Organization?

- **Root stays clean:** Only active project files needed for development
- **Reference stays organized:** All theory, history, design docs in one place
- **Easy to ignore:** `/reference/` is excluded from builds (already in `.gitignore`)
- **Easy to find:** All design context in one searchable folder
- **Scalable:** As project grows, reference folder grows naturally

---

## 📝 Reference Folder Contents (To Be Organized)

### Already Exists:
- ✅ `physics_geography_spherical_objects_conversation.md` (complete physics/chemistry/geography framework)
- ✅ `marble_racing_game_conversation_history.md` (original design conversation)
- ✅ `PHASE_1_FOUNDATION.md` (phase 1 breakdown)
- ✅ `PHASE_1_CHECKLIST.md` (phase 1 tasks)

### To Be Created:
- 📝 `LORE.md` — Game story (when ready)
- 📝 `DESIGN_PILLARS.md` — Core design philosophy
- 📝 `PHASE_2_PLANNING.md` — Phase 2 breakdown (next)
- 📝 `PHASE_3_PLANNING.md` — Phase 3 breakdown
- ... and so on for Phases 4-20

---

## 🔍 What's Next?

After file organization:
1. ✅ Move reference documents to `/reference/`
2. ✅ Update Git tracking (exclude `/reference/` if desired)
3. ✅ Begin **Phase Planning** — starting with Phases 2-20 overview
4. 📝 Later: Add game lore when ready
5. 📝 Later: Integrate lore into early phases

---

## 🚀 Ready for Development

Once organized:
- All reference materials are in one place
- Project root is clean and focused
- Ready to continue planning phases 2-20
- Lore can be added anytime without disrupting structure

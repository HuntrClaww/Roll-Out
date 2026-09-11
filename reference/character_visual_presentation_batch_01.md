# Character Visual Presentation — Batch 01

This phase establishes visual identity rules before asset production. The visual profiles are not final rendered art; they are implementation-ready direction for silhouettes, color, material treatment, movement, portraits, and UI layering.

## Presentation principles

- Silhouette must communicate role before detail is visible.
- Bosses use stronger shape language and material contrast than ordinary knights.
- Support NPCs receive memorable props or movement habits so their smaller story roles remain recognizable.
- Faction colors guide the palette without forcing every character into a uniform design.
- Motion signatures reflect personality: Static makes precise corrections, Cinder Vale lunges, Vela follows patterns, and Rook stops dramatically.
- Character visuals remain compatible with the project’s 2D/2.5D layered rendering strategy.

## NPC services

| Character | Service | Gameplay purpose |
|---|---|---|
| Pip Salvage | Scrap-Built Upgrades | Crafts upgrades from collected materials |
| Quarry | Track and Shell Repair | Supports repair state and collision explanations |
| Vela | Route Fragment Mapping | Reveals alternate routes and contradictory map data |
| Nix Weather | Wind and Weather Forecast | Communicates upcoming environmental changes |
| Sly-Mark | Unofficial Directions | Offers shortcuts, rumors, and event hints |
| Loop | Checkpoint Notices | Publishes challenge requirements and revised schedules |

The typed implementation is in `src/story/characterPresentation.ts`. The profiles are intentionally separate from final image files so silhouettes, palette, and behavior can be revised without rewriting gameplay identity data.

## Prototype service controls

The current prototype exposes the services through keyboard shortcuts while the final service menus are being designed:

- `P` — Pip crafts Reinforced Grip
- `K` — Quarry repairs the orb shell
- `V` — Vela records a route hint
- `N` — Nix issues a wind forecast
- `H` — Sly-Mark shares a rumor
- `J` — Loop displays the current challenge notice

The service state is included in the Version 1 save payload so route discoveries and forecast history are not lost when the player saves.

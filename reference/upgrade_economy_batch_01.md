# Upgrade Economy — Batch 01

The first upgrade economy converts the earlier grip prototype into a small inventory-backed system. It is intentionally limited so progression can be tested before adding a large crafting tree.

## Materials

| Material | Current purpose |
|---|---|
| Grip Fiber | General reinforcement material used by steering upgrades |
| Volcanic Glass | Durable heat-forged component used in Reinforced Grip |
| Frost Resin | Flexible low-temperature component used in Frost Balance |

## Upgrades

### Reinforced Grip

- Level 1 cost: 2 Grip Fiber and 1 Volcanic Glass
- Level 2 cost: 2 Grip Fiber and 1 Volcanic Glass
- Level cap: 2
- Grip modifiers: 1.25 at Level 1, 1.40 at Level 2
- Gameplay role: improves steering traction without changing mass, speed, or material identity

### Frost Balance

- Level 1 cost: 1 Grip Fiber and 2 Frost Resin
- Level cap: 1
- Grip modifier: 1.15
- Gameplay role: a smaller stability upgrade intended for low-traction routes

## Reward rule

Successful boss-stage completion grants two Grip Fiber and one region-linked component. Frost Veil grants Frost Resin; other current boss stages grant Volcanic Glass until more region-specific materials are authored.

## Safety rules

- Materials are integer counts and cannot become negative.
- Purchases fail atomically when the recipe cannot be afforded.
- Upgrade levels cannot exceed their recipe cap.
- Grip modifiers are passed through the marble’s existing bounded setter, which clamps the active modifier between 0.5 and 1.75.
- Upgrades do not silently alter mass, radius, density, or material identity.

The implementation is in `src/gameplay/upgradeEconomy.ts`. The next economy step is persistent inventory and service-specific purchase locations, not an uncontrolled increase in upgrade statistics.

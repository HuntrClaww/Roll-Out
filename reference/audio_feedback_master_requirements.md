# Audio and Feedback Master Requirements

Audio production is intentionally deferred. This document records the complete sound and feedback inventory so later production can be planned without overlooking small background interactions.

The list describes desired sound categories, not permission to download or generate assets now. Every sound should have a quiet fallback, a volume category, and an accessibility consideration.

## 1. Global and system sounds

- Game boot, loading start, loading complete, retry, and error
- Main menu open, close, move, confirm, cancel, and locked-option attempt
- Feature, stage, character, biography, and lore unlocks
- Save complete, save failure, load complete, load failure, backup recovery, unsupported-save warning, and corruption warning
- Settings changed, input remapped, accessibility changed, pause, resume, restart, quit, and confirmation prompts

## 2. Player orb movement and physics

- Rolling on asphalt, gravel, rock, ice, volcanic rock, and obsidian
- Acceleration, deceleration, high-speed rolling, steering correction, skid start, sustained skid, skid recovery, controlled drift, and uncontrolled drift
- Airborne launch, travel, spin, soft landing, hard landing, edge scrape, wall bump, sustained scrape, orb contact, and recovery
- Obstacle glancing hit, direct hit, rebound, fall, respawn, wind push, gust intensification, gust fade, temperature warning, and traction warning

## 3. Customisation and upgrades

- Style selection move and confirm
- Shell pattern, trail, decal, and finish-effect preview
- Upgrade menu open, recipe available, crafting start, crafting complete, crafting failure, insufficient materials, level increase, and maximum level
- Grip activation and deactivation
- Repair start, repair complete, repair unavailable, damaged-shell warning, material acquired, rare material acquired, and inventory-full warning if limits are added

## 4. Race lifecycle and feedback

- Countdown three, two, one, race start, false-start warning if introduced
- Checkpoint approaching, crossed, missed, and completed
- Lap or segment completion if added
- Rival overtaken, player overtaken, near miss, risky shortcut, shortcut discovered
- Boss gate locked, preparation completed, boss challenge unlocked, boss start, final stretch, finish-line approach
- Player finish, opponent finish, victory, defeat, draw or unresolved result, objective complete, objective failed, reward calculation, reward received, stage completion, retry, and new-stage transition

## 5. Challenge and boss sounds

- Challenge notice posted, accepted, dismissed, duel announcement, checkpoint announcement, team-battle announcement, boss announcement
- Boss introduction, ability warning, ability active, ability interrupted, vulnerability, defeat, defeat transition, biography unlock, rematch selection, and rematch confirmation

Suggested boss identities:

- Aether Sovereign: airy chimes, pressure pulses, distant high wind
- Cinder Axis: low stone impacts, furnace breath, glass crackle
- Glacier Sigil: crystalline ticks, ice resonance, muted snow movement
- Rift Echelon: reversed fragments, unstable panning, signal skips
- Circuit Steward: checkpoint stamps, relay clicks, layered scheduling tones

## 6. Character and NPC interaction

- Dialogue panel open, line advance, line complete, choice movement, choice confirm, and unavailable choice
- Encounter discovered, recurring character recognized, relationship increase, relationship change, rival challenge, rematch, friend assistance, acquaintance rumor, and background gesture

NPC service sounds:

- Pip: tool drawer, loose parts rattle, successful assembly, failed assembly
- Quarry: hammer tap, stone inspection, weld or seal, repair complete
- Vela: map unfurl, map mark, contradiction discovery
- Nix: weather-vane spin, forecast issued, uncertainty marker
- Sly-Mark: sign flick, paper shuffle, rumor reveal, suspicious pause
- Loop: checkpoint stamp, form accepted, schedule revised
- Static: measurement pulse, anomaly confirmation, interrupted calculation

## 7. Environmental ambience

### Ordinary tracks and Open Circuit

- Distant rolling traffic, track vibration, sign movement, flag flutter, crowd murmur, debris shift, checkpoint booth, and rest-stop ambience

### Mountain Pass

- Open mountain wind, distant rockfall, glider or bird call, rope creak, gravel slide, echoing impact, and high-altitude hush

### Volcanic Basin

- Lava rumble, magma bubbling, heat-shimmer hum, vent burst, ash fall, surface crackle, cooling-stone fracture, and distant eruption

### Frozen Cavern

- Ice resonance, ice creak, falling frost, powder shift, frozen drip, brittle fracture, fissure wind, and distant collapse

### Null Veil

- Dimensional hum, directionless echo, signal dropout, spatial swell, route-seam flutter, mismatched roll echo, silence pocket, and reappearing ambience

### Convergence Circuit

- Layered crowd, checkpoint bells, relay machinery, overlapping announcements, team rally pulse, schedule-board movement, finish-line surge, and controlled shutdown

## 8. Weather and environmental changes

- Wind begin, direction change, speed rise, speed drop, crosswind warning, tailwind impression, rain begin, rain on surface, distant thunder, lightning, snow begin, snow density, ash cloud approach, ash cloud pass, temperature fall, temperature rise, freezing, thawing, reduced visibility, and restored visibility

## 9. UI, lore, and archive

- Lore Archive open, close, next entry, previous entry, scroll tick, unread indicator, page turn, biography page turn, biography completion, map open, map close, contradiction marker, faction standing increase, faction standing decrease, faction-band change, reputation warning, roster open, roster selection, and service availability

## 10. Team and recruitment

- Recruitment offer, accepted, declined, capacity reached, teammate selected, teammate cycled, ability ready, ability used, ability unavailable, synergy discovered, ally victory, ally defeat, team result, and relationship-based team dialogue

## 11. Accessibility and mixing

- Every critical sound needs a visual equivalent.
- Checkpoints, warnings, boss abilities, victories, defeats, and save failures cannot rely on audio alone.
- Separate buses should exist for music, ambience, physics, UI, dialogue, boss cues, and accessibility alerts.
- Warnings need mid- or low-frequency alternatives, not only high-frequency tones.
- Repeated rolling and wind sounds must avoid fatigue.
- Critical information must remain readable through captions and visual indicators.
- Panning must not hide required information from one side.

## 12. Asset metadata

Every future asset should record its ID, category, trigger, priority, loop status, duration, intensity, variation count, cooldown, mixing bus, ducking behavior, localization dependency, accessibility equivalent, placeholder status, and approval status.

Audio implementation and asset production are intentionally deferred after this inventory. The next active development work can proceed without sound files while preserving these trigger contracts.

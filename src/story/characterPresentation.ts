export type CharacterVisualLayer = "player" | "guide" | "boss" | "rival" | "support" | "background";
export type NpcServiceType = "upgrade-crafting" | "repair" | "cartography" | "forecast" | "rumor" | "challenge-notice";

export interface CharacterVisualProfile {
  characterId: string;
  silhouette: string;
  primaryColor: string;
  accentColor: string;
  surfaceTreatment: string;
  motionSignature: string;
  portraitMood: string;
  layer: CharacterVisualLayer;
}

export interface NpcServiceDefinition {
  characterId: string;
  serviceType: NpcServiceType;
  name: string;
  description: string;
  repeatable: boolean;
}

const visual = (
  characterId: string,
  silhouette: string,
  primaryColor: string,
  accentColor: string,
  surfaceTreatment: string,
  motionSignature: string,
  portraitMood: string,
  layer: CharacterVisualLayer,
): CharacterVisualProfile => ({ characterId, silhouette, primaryColor, accentColor, surfaceTreatment, motionSignature, portraitMood, layer });

export const CHARACTER_VISUAL_PROFILES: CharacterVisualProfile[] = [
  visual("character.protagonist", "clean round orb with a visible centre highlight", "#F3F0E8", "#F2B84B", "polished neutral shell", "small corrective hops and curious turns", "open and alert", "player"),
  visual("character.static", "compact orb with a hovering antenna ring", "#B9C4D0", "#6CE0E6", "matte instrument casing", "precise hovering adjustments", "analytical", "guide"),
  visual("boss.aether-sovereign", "tall aerodynamic orb with swept fins", "#A9E7FF", "#FFF1A8", "cloud-glazed reflective shell", "wide graceful arcs", "serene challenge", "boss"),
  visual("boss.cinder-axis", "heavy orb with layered heat plates", "#7C2720", "#FFB347", "cracked volcanic glass", "deliberate weight shifts", "stern protection", "boss"),
  visual("boss.glacier-sigil", "faceted orb with a thin floating sigil", "#B8E8FF", "#FFFFFF", "frosted translucent shell", "silent low-friction glides", "patient focus", "boss"),
  visual("boss.rift-echelon", "asymmetric orb with a broken outline", "#30254F", "#D58CFF", "flickering veil grain", "brief skips and playful reversals", "knowing amusement", "boss"),
  visual("boss.circuit-steward", "orb surrounded by checkpoint tabs", "#D9B982", "#4A3323", "patched administrative plating", "short route corrections", "welcoming exhaustion", "boss"),
  visual("rival.basil-varn", "balanced racing orb with a narrow stripe", "#D79B42", "#FFF0A6", "carefully maintained enamel", "consistent measured lines", "competitive courtesy", "rival"),
  visual("rival.cinder-vale", "lean orb with an uneven flame crest", "#B83A2F", "#FFDC72", "heat-scorched enamel", "fast daring lunges", "reckless confidence", "rival"),
  visual("npc.sly-mark", "small orb under an oversized route-marker hat", "#53445F", "#E3B4FF", "dusty painted shell", "sideways entrances and quick exits", "performative helpfulness", "support"),
  visual("npc.mosswheel", "wide low orb threaded with living moss", "#537A4A", "#B9E27B", "soft organic growth", "slow rolling sways", "gentle amusement", "support"),
  visual("npc.pip-salvage", "orb carrying mismatched tool modules", "#C47D45", "#75D0C8", "scrap-metal patchwork", "excited wobbling", "inventive delight", "support"),
  visual("npc.brassettle", "square-edged orb with sign brackets", "#A97945", "#F0D39A", "brushed brass and paint", "fussy straight-line turns", "particular pride", "support"),
  visual("npc.nix-weather", "orb with a spinning wind vane", "#6E9BC4", "#E8F7FF", "weathered blue coating", "quick directional pivots", "animated concern", "support"),
  visual("npc.loop-clerk", "orb stamped with repeating checkpoint bands", "#8A8A82", "#F4D35E", "official label layers", "perfect repetitive loops", "calm confusion", "support"),
  visual("npc.mallow", "soft rounded orb with a serving tray", "#E6A86B", "#FFF0C2", "warm satin finish", "comfortable short rolls", "friendly calm", "background"),
  visual("npc.quarry-repair", "dense orb with a visible repair seam", "#69645D", "#D4A373", "rough stone composite", "steady grounded pushes", "practical patience", "support"),
  visual("npc.vela-cartographer", "orb with orbiting map fragments", "#4C6F91", "#F5D76E", "ink-blue shell with paper fins", "careful pattern-following curves", "focused curiosity", "support"),
  visual("npc.drift-apprentice", "small bright orb with training markers", "#8AC6A3", "#FFFFFF", "freshly polished beginner shell", "eager imperfect bursts", "hopeful attention", "background"),
  visual("npc.rook-rumor", "orb with layered message ribbons", "#6B536F", "#F3A6C8", "overpainted poster texture", "dramatic stops and starts", "confident speculation", "support"),
  visual("npc.ora-bridgekeeper", "orb with a curved bridge rail", "#6B8DAA", "#E6C77A", "weathered suspension plating", "careful measured arcs", "watchful", "support"),
  visual("npc.ashen-mira", "orb with a heat gauge crest", "#7E4335", "#FFD080", "dark ceramic shell", "steady inspection turns", "practical concern", "support"),
  visual("npc.vesper-melt", "orb with a translucent melting map", "#7DA8B7", "#F1E4C3", "seasonally frosted shell", "gentle thawing rolls", "nostalgic warmth", "support"),
  visual("npc.quiet-ell", "orb with a small listening dish", "#3B4059", "#9AA8E8", "sound-dampened matte shell", "motionless pauses", "quiet attention", "support"),
  visual("npc.stamp-echo", "orb with two overlapping checkpoint bands", "#8C7665", "#E8C98B", "duplicated label layers", "repeating half-turns", "formal confusion", "support"),
  visual("rival.hedge-lumen", "orb with a branching route stripe", "#729B62", "#E7D26F", "clean enamel with leaf marks", "quick line-switches", "friendly challenge", "rival"),
  visual("rival.iron-pollen", "dense orb with magnetic flecks", "#6B707A", "#E2A95B", "metallic mineral shell", "precise weighted pivots", "measured rivalry", "rival"),
  visual("rival.morrow-dash", "lean courier orb with a tail tab", "#A84D38", "#F5E18A", "weathered courier enamel", "urgent forward bursts", "restless optimism", "rival"),
  visual("npc.needle-nell", "small orb with a needle-shaped fin", "#7A6578", "#D9B7E6", "fine polished workshop shell", "tiny exact adjustments", "focused kindness", "support"),
  visual("npc.ember-lark", "round orb with a warm tray crest", "#B26B45", "#FFE0A0", "soft satin heat finish", "comfortable welcoming rolls", "dramatic warmth", "background"),
  visual("npc.rime-choir", "three linked orb motifs around one shell", "#A8D9E7", "#DDF7FF", "layered frost markings", "synchronized pulses", "ceremonial calm", "support"),
  visual("npc.tally-nine", "orb with nine small counting marks", "#454A68", "#C0C9FF", "numbered observation shell", "repeated exact loops", "patient obsession", "support"),
  visual("npc.ribbon-jan", "orb trailing short banner strips", "#C56D91", "#F5D36D", "painted festival shell", "decorative swerves", "busy optimism", "background"),
  visual("npc.hollow-gear", "heavy orb with an exposed maintenance gear", "#59605A", "#B6C1A7", "aged industrial casing", "dutiful straight pushes", "lonely routine", "support"),
  visual("npc.copper-echo", "orb with a resonant signal tower", "#966B4D", "#D8E3C2", "oxidized copper shell", "slow signal-like pulses", "formal welcome", "support"),
  visual("npc.fable-fern", "orb wrapped in living leaf curls", "#4D8050", "#D5F09A", "soft botanical growth", "protective gentle sways", "playful care", "background"),
  visual("npc.kite-warden", "orb with a high-wing escort frame", "#769ABD", "#F3E29C", "wind-polished shell", "controlled aerial arcs", "disciplined kindness", "support"),
  visual("npc.ash-cadet", "orb with a small heat-training plate", "#985043", "#F0B26D", "newly scorched ceramic", "eager corrective hops", "earnest focus", "support"),
  visual("npc.snow-cadet", "small orb with a copied frost mark", "#A9D4E8", "#FFFFFF", "carefully frosted shell", "hesitant controlled glides", "determined shyness", "support"),
  visual("npc.veil-runner", "orb with a temporary seam outline", "#423B65", "#BDA6F2", "low-light veil coating", "brief scouting skips", "professional alertness", "support"),
  visual("npc.marble-archivist", "orb with layered archive plates", "#756B62", "#E9D7A8", "aged polished stone", "slow deliberate rotations", "theatrical patience", "guide"),
  visual("npc.sunken-scribe", "orb with a waterproof writing fin", "#3E6675", "#B7E1E8", "damp inked shell", "steady low rolls", "quiet diligence", "support"),
  visual("npc.choir-of-static", "clustered signal rings around one core", "#59627C", "#9DE7E1", "flickering signal grain", "overlapping micro-movements", "collective curiosity", "support"),
  visual("npc.undertow-porter", "dense orb with a cargo harness", "#55605F", "#C79B67", "rubbed transport plating", "heavy dependable pushes", "practical friendliness", "support"),
  visual("npc.lantern-may", "orb with a glowing lantern hood", "#7F644E", "#FFD67A", "warm night-worn shell", "gentle guiding arcs", "welcoming courage", "support"),
  visual("npc.rivet-king", "orb with oversized repair studs", "#697078", "#E0A45B", "hammered metal shell", "boisterous bouncing turns", "competitive pride", "support"),
  visual("npc.pebble-prince", "tiny orb with a ceremonial pebble crown", "#88796D", "#EACB8E", "carefully dusted stone", "formal little rolls", "grand importance", "background"),
  visual("npc.faraday-finch", "orb with floating magnetic flecks", "#4F6579", "#D6A94D", "conductive mineral finish", "precise field-following turns", "excited analysis", "support"),
  visual("npc.mirror-mara", "reflective orb with offset highlights", "#586A83", "#D6E8FF", "mirror-polished shell", "slightly delayed echoes of motion", "guarded playfulness", "support"),
  visual("npc.salt-analog", "layered orb with geological bands", "#B9A78F", "#6B7880", "dry mineral strata", "measured straight rolls", "literal calm", "support"),
  visual("npc.rail-bell", "orb with a bell-shaped warning cap", "#8B765F", "#F4C96B", "scuffed signal metal", "sharp abrupt stops", "loud helpfulness", "background"),
  visual("npc.nettle-judge", "formal orb with a balanced scale emblem", "#514F61", "#E8D18E", "ceremonial matte enamel", "controlled inspection arcs", "strict fairness", "guide"),
  visual("npc.ghost-lap", "semi-transparent orb leaving a repeated ring", "#A8B8C6", "#E9F5FF", "faded recorded shell", "repeating incomplete loop", "polite focus", "support"),
  visual("npc.vaultkeeper-io", "orb with a sealed vault aperture", "#4D5960", "#D2B276", "secure layered casing", "guarded measured movement", "cautious helpfulness", "guide"),
  visual("rival.quartz-quick", "crystal-edged orb with reflective stripes", "#B5A5D6", "#FFF0A4", "faceted quartz shell", "rapid reflective cuts", "bright impatience", "rival"),
  visual("rival.ashen-foil", "sleek orb with a fencing-like fin", "#84433D", "#D9B47A", "polished heat enamel", "elegant deflections", "dramatic courtesy", "rival"),
  visual("knight.cogline", "orb with a protected gear collar", "#68716C", "#C6D09A", "maintained industrial casing", "mechanical straight lines", "dutiful focus", "support"),
  visual("knight.ice-thread", "thin orb with a luminous route thread", "#91C7D9", "#ECFFFF", "fine frost shell", "delicate exact glides", "quiet bravery", "support"),
  visual("knight.ember", "compact orb with reforged heat plating", "#8A3324", "#FFC15C", "freshly rebuilt scorched shell", "impatient forward lunges", "brash readiness", "support"),
  visual("knight.glacier", "faceted orb tracing a visible ice pattern", "#A7D8EC", "#FFFFFF", "pattern-etched frost shell", "exact pattern-following glides", "watchful discipline", "support"),
  visual("knight.tide", "low orb ringed with dried salt bands", "#7C9A97", "#E9F0EC", "weathered salt-crust shell", "unhurried unpredictable drifts", "dry watchfulness", "support"),
  visual("knight.rift", "rigid orb clutching a logged checklist tab", "#443A5E", "#C9B8FF", "meticulously labeled veil grain", "stiff correct-form turns", "anxious sincerity", "support"),
  visual("npc.morrow-mint", "orb with a small refreshment cart badge", "#78A486", "#F5D69A", "soft travel-worn satin", "comfortable rolling pauses", "unhurried warmth", "background"),
  visual("npc.pocket-storm", "tiny orb containing a cloud swirl", "#5A7899", "#D5E8FF", "charged glass casing", "restless jittering", "dramatic curiosity", "background"),
];

export const NPC_SERVICES: NpcServiceDefinition[] = [
  { characterId: "npc.pip-salvage", serviceType: "upgrade-crafting", name: "Scrap-Built Upgrades", description: "Crafts orb upgrades from collected materials and explains what each modification changes.", repeatable: true },
  { characterId: "npc.quarry-repair", serviceType: "repair", name: "Track and Shell Repair", description: "Repairs damaged equipment and identifies whether a collision was caused by material failure or route movement.", repeatable: true },
  { characterId: "npc.vela-cartographer", serviceType: "cartography", name: "Route Fragment Mapping", description: "Reveals route fragments, contradictions, and alternate paths discovered across finish-line transitions.", repeatable: true },
  { characterId: "npc.nix-weather", serviceType: "forecast", name: "Wind and Weather Forecast", description: "Reports upcoming environmental changes with a confidence estimate rather than a false promise of certainty.", repeatable: true },
  { characterId: "npc.sly-mark", serviceType: "rumor", name: "Unofficial Directions", description: "Offers shortcuts, event rumors, and occasionally useful information hidden inside exaggeration.", repeatable: true },
  { characterId: "npc.loop-clerk", serviceType: "challenge-notice", name: "Checkpoint Notices", description: "Publishes challenge requirements, deadlines, and revised schedules without making optional content permanently missable.", repeatable: true },
  { characterId: "npc.ora-bridgekeeper", serviceType: "forecast", name: "Bridge Safety Check", description: "Reports whether a suspended route has changed tension or elevation since the last inspection.", repeatable: true },
  { characterId: "npc.ashen-mira", serviceType: "forecast", name: "Heat Readings", description: "Provides practical heat and surface warnings before a volcanic route changes state.", repeatable: true },
  { characterId: "npc.vesper-melt", serviceType: "cartography", name: "Seasonal Route Memory", description: "Shares temporary maps of paths that exist only during thaw conditions.", repeatable: true },
  { characterId: "npc.quiet-ell", serviceType: "rumor", name: "Echo Evidence", description: "Reports sound anomalies that may point toward an unstable route without declaring a final explanation.", repeatable: true },
  { characterId: "npc.stamp-echo", serviceType: "challenge-notice", name: "Duplicate Notices", description: "Cross-checks challenge requirements when two checkpoint offices issue conflicting schedules.", repeatable: true },
  { characterId: "npc.needle-nell", serviceType: "upgrade-crafting", name: "Precision Components", description: "Identifies whether collected upgrade materials are genuine, damaged, or incorrectly fitted.", repeatable: true },
  { characterId: "npc.marble-archivist", serviceType: "cartography", name: "Archive Consultation", description: "Compares route records and identifies which old diagrams contradict one another.", repeatable: true },
  { characterId: "npc.faraday-finch", serviceType: "forecast", name: "Magnetic Field Reading", description: "Reports how nearby magnetic formations may disturb equipment and route markers.", repeatable: true },
  { characterId: "npc.nettle-judge", serviceType: "challenge-notice", name: "Fairness Review", description: "Explains whether a challenge result met its stated conditions without relying on hidden timing.", repeatable: true },
  { characterId: "npc.vaultkeeper-io", serviceType: "upgrade-crafting", name: "Rare Material Review", description: "Checks provenance and readiness before rare creator-era components are used.", repeatable: true },
  { characterId: "npc.lantern-may", serviceType: "forecast", name: "Night Route Warning", description: "Marks hazards and safe rest points along routes with reduced visibility.", repeatable: true },
];

export const getCharacterVisualProfile = (characterId: string): CharacterVisualProfile | undefined =>
  CHARACTER_VISUAL_PROFILES.find((profile) => profile.characterId === characterId);

export const getNpcService = (characterId: string, serviceType?: NpcServiceType): NpcServiceDefinition | undefined =>
  NPC_SERVICES.find((service) => service.characterId === characterId && (!serviceType || service.serviceType === serviceType));

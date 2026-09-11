export interface DialogueScene {
  characterId: string;
  title: string;
  lines: string[];
}

export const DIALOGUE_SCENES: DialogueScene[] = [
  {
    characterId: "character.static",
    title: "Static has a question",
    lines: [
      "Static: Your recovery pattern is statistically untidy.",
      "Static: That is not a criticism. Untidy patterns are often where useful information hides.",
      "Static: Please continue moving. Preferably in a direction that does not destroy the evidence.",
    ],
  },
  {
    characterId: "npc.sly-mark",
    title: "A shortcut with a warning",
    lines: [
      "Sly-Mark: I know a shortcut. I also know three reasons not to use it.",
      "Sly-Mark: Fortunately, only one of those reasons is currently nearby.",
      "Sly-Mark: Payment is optional. Gratitude is strongly encouraged.",
    ],
  },
  {
    characterId: "npc.pip-salvage",
    title: "Pip has found something useful",
    lines: [
      "Pip Salvage: Good news! I found a part that fits your orb.",
      "Pip Salvage: Better news! I only tested it on something that was already broken.",
      "Pip Salvage: If it rattles, that means it is thinking.",
    ],
  },
  {
    characterId: "npc.vela-cartographer",
    title: "A map with a missing centre",
    lines: [
      "Vela: This route appears beside itself on three different maps.",
      "Vela: I would call that a printing error, but the printing error keeps moving.",
      "Vela: Bring me another finish-line mark. Patterns become more honest in groups.",
    ],
  },
  {
    characterId: "rival.basil-varn",
    title: "Basil Varn proposes a fair race",
    lines: [
      "Basil Varn: I do not mind losing to a better route. I mind losing to a route that changes its mind.",
      "Basil Varn: We will race cleanly. Then we will inspect the finish line.",
      "Basil Varn: If you win, I will admit it. Eventually.",
    ],
  },
  {
    characterId: "boss.aether-sovereign",
    title: "Aether Sovereign offers a challenge",
    lines: [
      "Aether Sovereign: The wind is not against you. It is simply refusing to carry you for free.",
      "Aether Sovereign: Cross my route, and I will tell you what the sky remembers.",
      "Aether Sovereign: Do not chase the fastest current. Chase the current that remains honest.",
    ],
  },
  {
    characterId: "boss.cinder-axis",
    title: "Cinder Axis checks your preparation",
    lines: [
      "Cinder Axis: Heat does not care how confident you feel.",
      "Cinder Axis: Check your equipment. Check the route. Then check both again.",
      "Cinder Axis: If you still want the race after that, you may be ready for it.",
    ],
  },
  {
    characterId: "boss.glacier-sigil",
    title: "Glacier Sigil points to an old path",
    lines: [
      "Glacier Sigil: The safest line is not always the line that looks untouched.",
      "Glacier Sigil: Ice remembers pressure longer than racers remember warnings.",
      "Glacier Sigil: Move carefully. Careful does not mean slow.",
    ],
  },
  {
    characterId: "boss.rift-echelon",
    title: "Rift Echelon gives three answers",
    lines: [
      "Rift Echelon: I know why the route moved.",
      "Rift Echelon: I know why the route did not move.",
      "Rift Echelon: One of those statements is useful. You may race me to discover which.",
    ],
  },
  {
    characterId: "boss.circuit-steward",
    title: "The Circuit Steward opens registration",
    lines: [
      "Circuit Steward: Your race is scheduled, rescheduled, and currently happening.",
      "Circuit Steward: Please select one route. The other routes may select you.",
      "Circuit Steward: A victory earns a stamp. A defeat earns a revised form.",
    ],
  },
  {
    characterId: "npc.ora-bridgekeeper",
    title: "Ora checks the bridge",
    lines: [
      "Ora: The bridge is safe enough. That is not the same as safe.",
      "Ora: If it sways, follow the sway. If it sings, stop immediately.",
      "Ora: Please do not test the emergency repair by racing across it.",
    ],
  },
  {
    characterId: "npc.ashen-mira",
    title: "Ashen Mira shares a heat reading",
    lines: [
      "Ashen Mira: The stone is warming faster than yesterday.",
      "Ashen Mira: That does not mean the race is impossible. It means preparation matters.",
      "Ashen Mira: I have prepared extra supplies. Try not to make them necessary.",
    ],
  },
  {
    characterId: "npc.vesper-melt",
    title: "Vesper offers a temporary map",
    lines: [
      "Vesper Melt: This path exists until the thaw remembers it is spring.",
      "Vesper Melt: Draw quickly. The map is already becoming a memory.",
      "Vesper Melt: If you return and the route is gone, that is not a failure of navigation.",
    ],
  },
  {
    characterId: "npc.quiet-ell",
    title: "Quiet Ell heard something early",
    lines: [
      "Quiet Ell: Your rolling sound arrived before your orb.",
      "Quiet Ell: I checked twice. The second check arrived before the first.",
      "Quiet Ell: I am not worried. I am recording the amount by which I am not worried.",
    ],
  },
  {
    characterId: "rival.hedge-lumen",
    title: "Hedge Lumen suggests another line",
    lines: [
      "Hedge Lumen: Everyone sees the obvious route. That is why it is crowded.",
      "Hedge Lumen: Try the line that looks longer until the final turn.",
      "Hedge Lumen: If it fails, we will call it research and race again.",
    ],
  },
  {
    characterId: "npc.hollow-gear",
    title: "Hollow Gear continues its work",
    lines: [
      "Hollow Gear: Maintenance request received. Track damage was not on the old schedule.",
      "Hollow Gear: Repair commencing. Please identify whether the track is still supposed to be here.",
      "Hollow Gear: Thank you. Your answer has been filed under temporary.",
    ],
  },
  {
    characterId: "npc.marble-archivist",
    title: "The Archivist opens the wrong shelf",
    lines: [
      "Marble Archivist: This record describes your route before you travelled it.",
      "Marble Archivist: I would call that impossible, but the archive dislikes dramatic conclusions.",
      "Marble Archivist: Bring me another contradiction. Contradictions are often better preserved than answers.",
    ],
  },
  {
    characterId: "npc.faraday-finch",
    title: "Faraday Finch studies the route",
    lines: [
      "Faraday Finch: The ridge is pulling on your equipment in a very interesting direction.",
      "Faraday Finch: Please do not panic. Panic changes the measurements.",
      "Faraday Finch: If something starts orbiting you, tell me before it becomes important.",
    ],
  },
  {
    characterId: "npc.nettle-judge",
    title: "Nettle Judge reviews the challenge",
    lines: [
      "Nettle Judge: A victory is not automatically a fair result.",
      "Nettle Judge: I will inspect the route, the timing window, and the behaviour of the finish line.",
      "Nettle Judge: Fortunately, the paperwork is less dangerous than the race.",
    ],
  },
  {
    characterId: "npc.vaultkeeper-io",
    title: "Vaultkeeper Io asks a difficult question",
    lines: [
      "Vaultkeeper Io: Rare materials should not be used merely because they are rare.",
      "Vaultkeeper Io: Tell me what you intend to improve before I show you what may help.",
      "Vaultkeeper Io: A good answer opens more doors than a confident one.",
    ],
  },
  {
    characterId: "rival.quartz-quick",
    title: "Quartz Quick sees a bright line",
    lines: [
      "Quartz Quick: The best route is shining right there.",
      "Quartz Quick: Unless that is a warning reflection. It might be a warning reflection.",
      "Quartz Quick: Either way, I am taking it first.",
    ],
  },
  {
    characterId: "npc.ghost-lap",
    title: "Ghost Lap repeats the final turn",
    lines: [
      "Ghost Lap: Thank you for joining the race.",
      "Ghost Lap: We are approaching the final turn again.",
      "Ghost Lap: I am sure this time will be different. I have been sure many times.",
    ],
  },
];

export const getDialogueScene = (characterId: string): DialogueScene | undefined =>
  DIALOGUE_SCENES.find((scene) => scene.characterId === characterId);

export type RacingShellPattern = "solid" | "split-tone" | "spiral" | "rings" | "constellation" | "glitch-lines";
export type RacingTrailStyle = "none" | "spark-dust" | "wind-ribbon" | "ember-streak" | "frost-shimmer" | "signal-pulses";

export interface RacingStyleProfile {
  id: string;
  name: string;
  shellPattern: RacingShellPattern;
  primaryColor: string;
  secondaryColor: string;
  highlightColor: string;
  decal: string;
  trailStyle: RacingTrailStyle;
  finishEffect: string;
  motionLanguage: string;
  gameplayImpact: "visual-only";
}

export const RACING_STYLE_PROFILES: RacingStyleProfile[] = [
  {
    id: "sunlit-comet",
    name: "Sunlit Comet",
    shellPattern: "split-tone",
    primaryColor: "#F3F0E8",
    secondaryColor: "#F2B84B",
    highlightColor: "#FFF8D6",
    decal: "small forward star",
    trailStyle: "spark-dust",
    finishEffect: "brief gold ring",
    motionLanguage: "bright, confident, and readable",
    gameplayImpact: "visual-only",
  },
  {
    id: "moss-runner",
    name: "Moss Runner",
    shellPattern: "rings",
    primaryColor: "#537A4A",
    secondaryColor: "#B9E27B",
    highlightColor: "#E7FFD1",
    decal: "leaf-shaped route mark",
    trailStyle: "wind-ribbon",
    finishEffect: "soft green pulse",
    motionLanguage: "organic, calm, and grounded",
    gameplayImpact: "visual-only",
  },
  {
    id: "ember-spiral",
    name: "Ember Spiral",
    shellPattern: "spiral",
    primaryColor: "#8B2D25",
    secondaryColor: "#FFB347",
    highlightColor: "#FFE0A3",
    decal: "angular flame slash",
    trailStyle: "ember-streak",
    finishEffect: "short rising sparks",
    motionLanguage: "energetic, daring, and fast-looking",
    gameplayImpact: "visual-only",
  },
  {
    id: "frostline",
    name: "Frostline",
    shellPattern: "constellation",
    primaryColor: "#B8E8FF",
    secondaryColor: "#5E9FC2",
    highlightColor: "#FFFFFF",
    decal: "three-point frost sigil",
    trailStyle: "frost-shimmer",
    finishEffect: "crystalline flash",
    motionLanguage: "precise, quiet, and elegant",
    gameplayImpact: "visual-only",
  },
  {
    id: "signal-jester",
    name: "Signal Jester",
    shellPattern: "glitch-lines",
    primaryColor: "#30254F",
    secondaryColor: "#D58CFF",
    highlightColor: "#F7D6FF",
    decal: "misaligned arrow pair",
    trailStyle: "signal-pulses",
    finishEffect: "offset duplicate ring",
    motionLanguage: "playful, unpredictable, and expressive",
    gameplayImpact: "visual-only",
  },
];

export interface RacingStyleState {
  selectedStyleId: string;
}

export class RacingStyleManager {
  private selectedStyleId = RACING_STYLE_PROFILES[0].id;

  public getSelectedStyle(): RacingStyleProfile {
    return this.getStyle(this.selectedStyleId) ?? RACING_STYLE_PROFILES[0];
  }

  public getStyle(styleId: string): RacingStyleProfile | undefined {
    return RACING_STYLE_PROFILES.find((style) => style.id === styleId);
  }

  public cycleStyle(direction: 1 | -1): RacingStyleProfile {
    const currentIndex = RACING_STYLE_PROFILES.findIndex((style) => style.id === this.selectedStyleId);
    const nextIndex = (Math.max(0, currentIndex) + direction + RACING_STYLE_PROFILES.length) % RACING_STYLE_PROFILES.length;
    this.selectedStyleId = RACING_STYLE_PROFILES[nextIndex].id;
    return this.getSelectedStyle();
  }

  public loadState(state: RacingStyleState): void {
    if (this.getStyle(state.selectedStyleId)) this.selectedStyleId = state.selectedStyleId;
  }

  public getState(): RacingStyleState {
    return { selectedStyleId: this.selectedStyleId };
  }
}

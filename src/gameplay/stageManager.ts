import { RaceRule } from "./opponentTypes";
import { OpponentManager } from "./opponentManager";

export interface StageDefinition {
  id: string;
  name: string;
  trackId: string;
  difficulty: number;
  unlockStage: number;
  faction: string;
  raceRules: RaceRule[];
  rewardMultiplier: number;
  bossName: string;
}

export interface StageProgressState {
  currentStageIndex: number;
  unlockedStageIndex: number;
  bestClearRank: number;
  totalWins: number;
  totalLosses: number;
}

export class StageManager {
  private readonly stages: StageDefinition[];
  private readonly manager: OpponentManager;

  constructor() {
    this.manager = new OpponentManager();
    this.stages = [
      {
        id: "intro-gate",
        name: "Intro Gate",
        trackId: "Mountain Pass",
        difficulty: 0.35,
        unlockStage: 0,
        faction: "Open Circuit",
        raceRules: ["standard", "checkpoint", "boss-challenge"],
        rewardMultiplier: 1.1,
        bossName: "Aether Sovereign",
      },
      {
        id: "ash-crest",
        name: "Ash Crest",
        trackId: "Volcanic Basin",
        difficulty: 0.55,
        unlockStage: 1,
        faction: "Ash Banner",
        raceRules: ["standard", "duel", "boss-challenge"],
        rewardMultiplier: 1.28,
        bossName: "Cinder Axis",
      },
      {
        id: "frost-veil",
        name: "Frost Veil",
        trackId: "Frozen Cavern",
        difficulty: 0.75,
        unlockStage: 2,
        faction: "Frost Reign",
        raceRules: ["standard", "checkpoint", "duel", "boss-challenge"],
        rewardMultiplier: 1.5,
        bossName: "Glacier Sigil",
      },
      {
        id: "null-echo",
        name: "Null Echo",
        trackId: "Mountain Pass",
        difficulty: 0.9,
        unlockStage: 3,
        faction: "Null Veil",
        raceRules: ["duel", "checkpoint", "boss-challenge"],
        rewardMultiplier: 1.8,
        bossName: "Rift Echelon",
      },
      {
        id: "convergence-circuit",
        name: "Convergence Circuit",
        trackId: "Frozen Cavern",
        difficulty: 1.2,
        unlockStage: 4,
        faction: "Convergence League",
        raceRules: ["team-battle", "boss-challenge"],
        rewardMultiplier: 2.4,
        bossName: "The Circuit Steward",
      },
    ];
  }

  public getStages(): StageDefinition[] {
    return [...this.stages];
  }

  public isStageUnlocked(playerStageProgress: number, stageIndex: number): boolean {
    const stage = this.stages[stageIndex];
    if (!stage) return false;
    return playerStageProgress >= stage.unlockStage;
  }

  public getUnlockedStages(playerStageProgress: number): StageDefinition[] {
    return this.stages.filter((stage, index) => this.isStageUnlocked(playerStageProgress, index));
  }

  public getCurrentStage(playerStageProgress: number): StageDefinition | null {
    const boundedIndex = clamp(playerStageProgress, 0, this.stages.length - 1);
    return this.stages[boundedIndex] ?? this.stages[0] ?? null;
  }

  public getNextStage(playerStageProgress: number): StageDefinition | null {
    const nextStageIndex = this.stages.findIndex((stage, index) => !this.isStageUnlocked(playerStageProgress, index));
    return nextStageIndex === -1 ? null : this.stages[nextStageIndex];
  }

  public generateStageEncounter(stageId: string, levelNumber: number): ReturnType<OpponentManager["generateStage"]> {
    const requestedStageIndex = this.stages.findIndex((stage) => stage.id === stageId);
    const stageIndex = requestedStageIndex >= 0
      ? requestedStageIndex
      : clamp(levelNumber - 1, 0, this.stages.length - 1);
    const stage = this.stages[stageIndex] ?? this.stages[0];
    const levelIndex = Math.max(0, Math.floor(levelNumber) - 1);
    const activeRule = stage.raceRules[levelIndex % stage.raceRules.length] ?? "standard";
    return this.manager.generateStage(stage.id, levelNumber, activeRule, stage.bossName, stage.faction);
  }

  public createInitialProgress(): StageProgressState {
    return {
      currentStageIndex: 0,
      unlockedStageIndex: 0,
      bestClearRank: 0,
      totalWins: 0,
      totalLosses: 0,
    };
  }

  public advanceProgress(state: StageProgressState, stageCleared: boolean, advanceStage: boolean = true): StageProgressState {
    const finalStageIndex = this.stages.length - 1;
    const nextState: StageProgressState = {
      ...state,
      currentStageIndex: clamp(state.currentStageIndex, 0, finalStageIndex),
      unlockedStageIndex: clamp(state.unlockedStageIndex, 0, finalStageIndex),
      bestClearRank: Math.max(0, state.bestClearRank),
      totalWins: Math.max(0, state.totalWins),
      totalLosses: Math.max(0, state.totalLosses),
    };

    // A persisted or externally supplied state must never point at a locked stage.
    nextState.unlockedStageIndex = Math.max(nextState.unlockedStageIndex, nextState.currentStageIndex);

    if (stageCleared) {
      nextState.totalWins += 1;
      nextState.bestClearRank = Math.max(nextState.bestClearRank, nextState.currentStageIndex + 1);
      if (advanceStage) {
        nextState.currentStageIndex = Math.min(nextState.currentStageIndex + 1, finalStageIndex);
        nextState.unlockedStageIndex = Math.min(Math.max(nextState.unlockedStageIndex, nextState.currentStageIndex), finalStageIndex);
      }
    } else {
      nextState.totalLosses += 1;
    }

    return nextState;
  }
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

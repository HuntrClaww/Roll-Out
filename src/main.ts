/**
 * Main entry point for RollOut game
 * 
 * This initializes the game and sets up the render loop.
 */

import { Marble, Vector3 } from "./physics/marble";
import { Track, createTrack } from "./gameplay/track";
import { OpponentManager } from "./gameplay/opponentManager";
import { HybridOpponentAI } from "./gameplay/opponentAI";
import { StageDefinition, StageManager } from "./gameplay/stageManager";
import { ChallengeSystem, ChallengeTemplate } from "./gameplay/challengeSystem";
import { StageEncounter } from "./gameplay/opponentTypes";
import { applyOrbUpgrade } from "./gameplay/orbUpgrade";
import { createStarterObstacle, resolveObstacleCollision, TrackObstacle } from "./gameplay/obstacle";
import { StoryManager } from "./story/storyManager";
import { PlayerTeamManager } from "./gameplay/playerTeam";
import { WorldStateManager } from "./world/worldState";
import { CharacterRelationshipManager, getBossCharacterIdForStage } from "./story/characterRelationships";
import { BossBiography } from "./story/bossBiographies";
import { LoreEntry } from "./story/loreFoundation";
import { DialogueScene, getDialogueScene } from "./story/dialogueSystem";
import { BossChallengeProgression } from "./gameplay/bossChallengeProgression";
import { UpgradeInventoryManager } from "./gameplay/upgradeEconomy";
import { GameSaveData, loadFromStorage, saveToStorage } from "./gameplay/gamePersistence";
import { NpcServiceManager } from "./story/npcServices";
import { RacingStyleManager } from "./story/racingStyleSystem";
import { evaluateMysteryConvergence, getAvailableMysteryReactions, getMysteryArchiveBody } from "./story/mysteryConvergence";

class Game {
  private marble: Marble;
  private opponentMarble: Marble;
  private opponentAI: HybridOpponentAI;
  private track: Track;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private running: boolean = false;
  private lastFrameTime: number = 0;
  private raceTime: number = 0;
  private steerInput: number = 0;
  private showDebugUI: boolean = true;
  private readonly starterObstacle: TrackObstacle = createStarterObstacle();
  private gripUpgradeEnabled: boolean = false;
  private raceFinished: boolean = false;
  private raceResult: "player" | "opponent" | null = null;
  private checkpointIndex: number = 0;
  private readonly checkpoints = [0.25, 0.5, 0.75];
  private readonly stageManager: StageManager;
  private readonly challengeSystem: ChallengeSystem;
  private progression: ReturnType<StageManager["createInitialProgress"]>;
  private activeStage: StageDefinition;
  private activeChallenge: ChallengeTemplate;
  private activeEncounter: StageEncounter;
  private readonly storyManager = new StoryManager();
  private readonly playerTeamManager = new PlayerTeamManager();
  private readonly worldStateManager = new WorldStateManager();
  private readonly characterRelationshipManager = new CharacterRelationshipManager();
  private readonly bossChallengeProgression = new BossChallengeProgression();
  private readonly upgradeInventory = new UpgradeInventoryManager({ "grip-fiber": 4, "volcanic-glass": 2, "frost-resin": 1 });
  private readonly npcServiceManager = new NpcServiceManager();
  private readonly racingStyleManager = new RacingStyleManager();
  private readonly playerTrail: Array<{ x: number; y: number }> = [];
  private storyNotice: string | null = null;
  private lorePanelOpen = false;
  private lorePanelEntryIndex = 0;
  private lorePanelScroll = 0;
  private dialogueScene: DialogueScene | null = null;
  private dialogueLineIndex = 0;

  constructor() {
    // Create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.display = "block";
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    // Initialize track (Mountain Pass for Phase 1)
    this.track = createTrack("Mountain Pass");

    // Phase 2: Opponent intelligence framework prototype
    const opponentManager = new OpponentManager();
    this.stageManager = new StageManager();
    this.challengeSystem = new ChallengeSystem();
    const stage = opponentManager.generateStage("stage_01", 1, "boss-challenge");
    this.opponentAI = new HybridOpponentAI(stage.boss);
    const decision = this.opponentAI.decide({
      surface: "ice",
      slope: 0.35,
      altitude: 120,
      temperature: -8,
      windStrength: 1.6,
      trackDifficulty: 0.82,
      currentRank: 2,
      currentSpeed: 0.9,
      distanceRemaining: 0.42,
      threatLevel: 0.88,
    });

    this.progression = this.stageManager.createInitialProgress();
    const nextStage = this.stageManager.getCurrentStage(this.progression.currentStageIndex);
    const challengeTemplate = this.challengeSystem.selectChallenge(0.82, ["standard", "duel", "boss-challenge", "team-battle"]);

    this.activeStage = nextStage ?? this.stageManager.getStages()[0];
    this.activeChallenge = this.selectChallengeForStage(this.activeStage);
    this.activeEncounter = this.stageManager.generateStageEncounter(this.activeStage.id, 1);
    this.opponentAI = new HybridOpponentAI(this.activeEncounter.boss);

    console.log("Phase 2 boss AI prototype:", stage.encounterName, decision.statusText);
    console.log("Phase 3 stage progression prototype:", nextStage?.name ?? "No next stage");
    console.log("Phase 4 challenge prototype:", challengeTemplate.name, challengeTemplate.rule);

    // Initialize marbles
    this.marble = new Marble(new Vector3(0, 10, 0), "steel");
    this.opponentMarble = new Marble(new Vector3(2, 10, 0), "glass");

    // Setup input
    this.setupInput();

    // Handle window resize
    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  private setupInput(): void {
    // Touch steering. Keep the gesture bounded and always release steering when
    // the finger leaves the screen or the browser loses focus.
    document.addEventListener("touchmove", (e) => {
      if (e.touches.length === 0) return;
      e.preventDefault();
      const touch = e.touches[0];
      const centerX = this.canvas.width / 2;
      this.steerInput = ((touch.clientX - centerX) / (this.canvas.width / 2)) * 0.5;
    }, { passive: false });
    const releaseTouchSteering = (): void => {
      this.steerInput = 0;
    };
    document.addEventListener("touchend", releaseTouchSteering, { passive: true });
    document.addEventListener("touchcancel", releaseTouchSteering, { passive: true });
    window.addEventListener("blur", releaseTouchSteering);

    // Keyboard steering (for testing)
    document.addEventListener("keydown", (e) => {
      if (!this.lorePanelOpen && e.key === "ArrowLeft") this.steerInput = -0.5;
      if (!this.lorePanelOpen && e.key === "ArrowRight") this.steerInput = 0.5;
      if (e.key === "d") this.showDebugUI = !this.showDebugUI; // Toggle debug UI
      if (e.key.toLowerCase() === "g") {
        const installedUpgrade = this.upgradeInventory.getInstalledUpgrade("reinforced-grip");
        if (!installedUpgrade) {
          this.storyNotice = "No Reinforced Grip upgrade installed. Press U to craft it.";
        } else {
          this.gripUpgradeEnabled = !this.gripUpgradeEnabled;
          if (this.gripUpgradeEnabled) {
            applyOrbUpgrade(this.marble, installedUpgrade);
          } else {
            this.marble.setGripModifier(1);
          }
        }
      }
      if (e.key.toLowerCase() === "u") {
        if (this.upgradeInventory.purchase("reinforced-grip")) {
          const installedUpgrade = this.upgradeInventory.getInstalledUpgrade("reinforced-grip");
          if (installedUpgrade) applyOrbUpgrade(this.marble, installedUpgrade);
          this.gripUpgradeEnabled = true;
          this.storyNotice = `Crafted Reinforced Grip level ${this.upgradeInventory.getUpgradeLevel("reinforced-grip")}.`;
        } else {
          this.storyNotice = "Reinforced Grip cannot be crafted: insufficient materials or maximum level reached.";
        }
      }
      if (e.key.toLowerCase() === "p") {
        const notice = this.npcServiceManager.craftUpgrade(this.upgradeInventory, "reinforced-grip");
        if (notice.success) {
          const installedUpgrade = this.upgradeInventory.getInstalledUpgrade("reinforced-grip");
          if (installedUpgrade) applyOrbUpgrade(this.marble, installedUpgrade);
          this.gripUpgradeEnabled = true;
        }
        this.storyNotice = `${notice.title}: ${notice.message}`;
        this.persistGameSilently();
      }
      if (e.key.toLowerCase() === "k") {
        const notice = this.npcServiceManager.repairOrb();
        this.storyNotice = `${notice.title}: ${notice.message}`;
        this.persistGameSilently();
      }
      if (e.key.toLowerCase() === "v") {
        const notice = this.npcServiceManager.revealRouteHint(this.activeStage.id);
        this.storyNotice = `${notice.title}: ${notice.message}`;
        this.persistGameSilently();
      }
      if (e.key.toLowerCase() === "n") {
        const wind = this.track.getEnvironmentAt(this.marble.position.z).windVector.length();
        const notice = this.npcServiceManager.forecast(this.activeStage.id, wind);
        this.storyNotice = `${notice.title}: ${notice.message}`;
        this.persistGameSilently();
      }
      if (e.key.toLowerCase() === "h") {
        const notice = this.npcServiceManager.rumor(this.activeStage.id);
        this.storyNotice = `${notice.title}: ${notice.message}`;
      }
      if (e.key.toLowerCase() === "j") {
        const requirement = this.bossChallengeProgression.getPreparationDescription(this.activeStage.id) ?? "The boss challenge is unlocked.";
        const notice = this.npcServiceManager.challengeNotice(this.activeStage.id, requirement);
        this.storyNotice = `${notice.title}: ${notice.message}`;
      }
      if (e.key.toLowerCase() === "t") {
        const style = this.racingStyleManager.cycleStyle(1);
        this.storyNotice = `Racing style selected: ${style.name}. Visuals only; physics unchanged.`;
        this.persistGameSilently();
      }
      if (e.key.toLowerCase() === "r") this.resetRace();
      if (e.key === "F6") {
        e.preventDefault();
        this.saveGame();
      }
      if (e.key === "F7") {
        e.preventDefault();
        this.loadGame();
      }
      if (e.key.toLowerCase() === "q") this.playerTeamManager.recruitCandidate("rival_basil");
      if (e.key.toLowerCase() === "e") this.playerTeamManager.recruitCandidate("rival_cinder");
      if (e.key.toLowerCase() === "m") this.playerTeamManager.recruitCandidate("minion_ark");
      if (e.key === "[" || e.key === "]") this.playerTeamManager.cycleActiveMember(e.key === "]" ? 1 : -1);
      if (e.key.toLowerCase() === "l") {
        const lore = this.storyManager.completeNextAvailableEvent(this.activeStage.id);
        this.storyNotice = lore.length > 0 ? `Lore found: ${lore[0].title}` : "No story event is ready yet.";
      }
      if (e.key.toLowerCase() === "c") {
        const world = this.worldStateManager.getState();
        const available = this.characterRelationshipManager.getAvailableEncounters(
          world.visitedRegions,
          world.completedStages,
          this.storyManager.getState().worldTimeSeconds,
          Object.fromEntries(world.factionStates.map((state) => [state.id, state.standing])),
        );
        if (available.length > 0) {
          this.dialogueScene = getDialogueScene(available[0].id) ?? null;
          this.dialogueLineIndex = 0;
          this.characterRelationshipManager.recordInteraction(available[0].id, this.storyManager.getState().worldTimeSeconds);
          this.storyNotice = this.dialogueScene ? "Dialogue opened. Press Enter or Space to continue." : `Encounter found: ${available[0].name}`;
        } else {
          this.storyNotice = "No new character encounter is ready; previous contacts may return later.";
        }
      }
      if (e.key.toLowerCase() === "b") {
        this.lorePanelOpen = !this.lorePanelOpen;
        this.lorePanelEntryIndex = 0;
        this.lorePanelScroll = 0;
        this.storyNotice = this.lorePanelOpen ? "Lore panel opened. Use Arrow keys to browse; B closes it." : "Lore panel closed.";
      }
      if (this.lorePanelOpen && e.key === "ArrowDown") this.lorePanelScroll += 3;
      if (this.lorePanelOpen && e.key === "ArrowUp") this.lorePanelScroll = Math.max(0, this.lorePanelScroll - 3);
      if (this.lorePanelOpen && e.key === "ArrowRight") {
        this.lorePanelEntryIndex += 1;
        this.lorePanelScroll = 0;
      }
      if (this.lorePanelOpen && e.key === "ArrowLeft") {
        this.lorePanelEntryIndex = Math.max(0, this.lorePanelEntryIndex - 1);
        this.lorePanelScroll = 0;
      }
      if (this.dialogueScene && (e.key === "Enter" || e.key === " ")) {
        this.dialogueLineIndex += 1;
        if (this.dialogueLineIndex >= this.dialogueScene.lines.length) {
          this.dialogueScene = null;
          this.storyNotice = "Conversation complete.";
        }
      }
      if (this.dialogueScene && e.key === "Escape") {
        this.dialogueScene = null;
        this.storyNotice = "Conversation closed. You can revisit recurring contacts later.";
      }
      if (e.key === "1") {
        this.track = createTrack("Mountain Pass");
        this.resetRace(false);
      }
      if (e.key === "2") {
        this.track = createTrack("Volcanic Basin");
        this.resetRace(false);
      }
      if (e.key === "3") {
        this.track = createTrack("Frozen Cavern");
        this.resetRace(false);
      }
    });

    document.addEventListener("keyup", () => {
      this.steerInput = 0;
    });
  }

  private update(deltaTime: number): void {
    if (this.raceFinished) return;

    // Clamp deltaTime to avoid large jumps
    if (deltaTime > 0.1) deltaTime = 0.1;
    this.storyManager.advanceTime(deltaTime);

    // Get track conditions at marble position
    const playerEnv = this.track.getEnvironmentAt(this.marble.position.z);
    const opponentEnv = this.track.getEnvironmentAt(this.opponentMarble.position.z);

    // Update environmental conditions
    this.marble.setEnvironment(
      playerEnv.surface,
      playerEnv.temperature,
      playerEnv.elevation,
      playerEnv.slope
    );
    this.marble.setWind(playerEnv.windVector);

    this.opponentMarble.setEnvironment(
      opponentEnv.surface,
      opponentEnv.temperature,
      opponentEnv.elevation,
      opponentEnv.slope
    );
    this.opponentMarble.setWind(opponentEnv.windVector);

    // Update player marble
    this.marble.applySteeringForce(this.steerInput, deltaTime);
    this.marble.update(
      deltaTime,
      playerEnv.elevation,
      playerEnv.slope
    );
    this.constrainToTrack(this.marble);
    this.playerTrail.push({ x: this.marble.position.x, y: this.marble.position.z });
    if (this.playerTrail.length > 18) this.playerTrail.shift();
    this.syncObstacleToTrack();
    resolveObstacleCollision(this.marble, this.starterObstacle);

    // Update opponent marble using the same environment-aware AI prototype
    // used by the stage encounter system.
    const opponentDecision = this.opponentAI.decide({
      surface: opponentEnv.surface,
      slope: opponentEnv.slope,
      altitude: opponentEnv.elevation,
      temperature: opponentEnv.temperature,
      windStrength: opponentEnv.windVector.length(),
      trackDifficulty: this.activeStage.difficulty,
      currentRank: this.opponentMarble.position.z >= this.marble.position.z ? 1 : 2,
      currentSpeed: this.opponentMarble.getSpeed(),
      distanceRemaining: Math.max(0, (this.track.totalLength - this.opponentMarble.position.z) / this.track.totalLength),
      threatLevel: this.activeEncounter.boss.difficulty,
    });
    this.opponentMarble.applySteeringForce(opponentDecision.steeringBias, deltaTime);
    this.opponentMarble.update(
      deltaTime,
      opponentEnv.elevation,
      opponentEnv.slope
    );
    this.constrainToTrack(this.opponentMarble);

    this.updateRaceProgress();

    this.raceTime += deltaTime;
  }

  private constrainToTrack(marble: Marble): void {
    const halfWidth = this.track.width / 2;
    const limit = halfWidth - marble.radius;
    if (marble.position.x < -limit || marble.position.x > limit) {
      marble.position.x = Math.max(-limit, Math.min(limit, marble.position.x));
      marble.velocity.x *= -0.4;
    }
  }

  private updateRaceProgress(): void {
    const playerProgress = this.marble.position.z / this.track.totalLength;
    while (this.checkpointIndex < this.checkpoints.length && playerProgress >= this.checkpoints[this.checkpointIndex]) {
      this.checkpointIndex += 1;
    }

    const playerReachedFinish = playerProgress >= 1;
    const opponentFinished = this.opponentMarble.position.z >= this.track.totalLength;
    if (playerReachedFinish || opponentFinished) {
      const playerCompletedChallenge = this.challengeSystem.evaluateRaceCompletion(
        this.activeChallenge,
        playerProgress,
        this.opponentMarble.position.z / this.track.totalLength,
        this.checkpointIndex,
      );
      const teamBattleWinner = this.activeChallenge.isTeamBattle
        ? this.challengeSystem.evaluateTeamBattle(this.playerTeamManager.getBattleTeam(), this.activeEncounter.rivals).winner
        : "player";
      this.raceFinished = true;
      this.raceResult = playerCompletedChallenge && teamBattleWinner === "player" && (!opponentFinished || this.marble.position.z > this.opponentMarble.position.z)
        ? "player"
        : "opponent";
      const raceId = `${this.activeStage.id}-${this.progression.totalWins + this.progression.totalLosses + 1}`;
      this.storyManager.recordRaceFinished(raceId, this.raceResult === "player", this.activeStage.id);
      this.worldStateManager.visitRegion(this.activeStage.trackId.toLowerCase().replace(/\s+/g, "-"));
      this.bossChallengeProgression.recordRaceResult(this.activeStage.id, this.activeChallenge, this.raceResult === "player");
      const stageCleared = this.raceResult === "player" && (this.activeChallenge.isBossBattle || !this.activeStage.raceRules.includes("boss-challenge"));
      if (this.raceResult === "opponent" || stageCleared) {
        this.worldStateManager.completeStage(this.activeStage.id, this.activeStage.faction, stageCleared);
      }
      if (this.raceResult === "player" && stageCleared) {
        this.upgradeInventory.addMaterial("grip-fiber", 2);
        this.upgradeInventory.addMaterial(this.activeStage.id === "frost-veil" ? "frost-resin" : "volcanic-glass", 1);
        const bossCharacterId = getBossCharacterIdForStage(this.activeStage.id);
        if (bossCharacterId) {
          this.characterRelationshipManager.recordBossDefeat(bossCharacterId, this.storyManager.getState().worldTimeSeconds);
          this.storyNotice = `Victory recorded. Boss biography unlocked for ${this.activeEncounter.boss.name}.`;
          const mysterySnapshot = this.getMysteryProgressSnapshot();
          const reaction = getAvailableMysteryReactions(mysterySnapshot, this.storyManager.getCompletedMysteryReactionIds())
            .find((candidate) => candidate.requiredBossId === bossCharacterId);
          if (reaction && this.storyManager.completeMysteryReaction(reaction.id)) {
            this.storyNotice += ` ${reaction.title}: ${reaction.line}`;
          }
        }
      }
      this.progression = this.stageManager.advanceProgress(this.progression, this.raceResult === "player", stageCleared);
      if (this.raceResult === "player" && !stageCleared) {
        this.storyNotice = this.bossChallengeProgression.getPreparationDescription(this.activeStage.id)
          ? "Preparation complete. Restart the race to attempt the boss challenge."
          : "Preparation result recorded.";
      }
      this.persistGameSilently();
    }
  }

  private resetRace(loadStage: boolean = true): void {
    if (loadStage) {
      this.loadCurrentStage();
      this.track = createTrack(this.activeStage.trackId);
    }
    this.marble.reset(new Vector3(0, 10, 0));
    this.opponentMarble.reset(new Vector3(2, 10, 0));
    this.raceTime = 0;
    this.checkpointIndex = 0;
    this.playerTrail.length = 0;
    this.raceFinished = false;
    this.raceResult = null;
  }

  private loadCurrentStage(): void {
    const stage = this.stageManager.getCurrentStage(this.progression.currentStageIndex);
    if (!stage) return;

    this.activeStage = stage;
    this.activeChallenge = this.selectChallengeForStage(stage);
    this.activeEncounter = this.stageManager.generateStageEncounter(stage.id, this.progression.currentStageIndex + 1);
    this.opponentAI = new HybridOpponentAI(this.activeEncounter.boss);
    this.track = createTrack(stage.trackId);
  }

  private selectChallengeForStage(stage: StageDefinition): ChallengeTemplate {
    if (this.bossChallengeProgression.isBossChallengeUnlocked(stage.id) && stage.raceRules.includes("boss-challenge")) {
      return this.challengeSystem.getChallengeByRule("boss-challenge") ?? this.challengeSystem.selectChallenge(stage.difficulty, stage.raceRules);
    }
    const gate = this.bossChallengeProgression.getDefinition(stage.id);
    const completed = this.bossChallengeProgression.getState(stage.id).completedPreparationRules;
    const pendingPreparation = gate?.preparationRules.filter((rule) => !completed.includes(rule));
    return this.challengeSystem.selectChallenge(stage.difficulty, pendingPreparation && pendingPreparation.length > 0 ? pendingPreparation : stage.raceRules.filter((rule) => rule !== "boss-challenge"));
  }

  private syncObstacleToTrack(): void {
    this.starterObstacle.position.y = this.track.getHeightAtX(this.starterObstacle.position.z) + this.starterObstacle.radius;
  }

  private render(): void {
    if (!this.ctx) return;

    // Draw background (sky)
    this.ctx.fillStyle = "#87CEEB"; // Sky blue
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw track with elevation visualization
    this.drawTrack();

    // Convert 3D to 2D screen coordinates (simple perspective)
    const screenX = (pos: Vector3) => this.canvas.width / 2 + pos.x * 50;
    const screenY = (pos: Vector3) => (this.canvas.height / 2) - pos.z * 3 - (pos.y * 20);

    // Draw player marble and its visual-only racing style.
    const playerScreenX = screenX(this.marble.position);
    const playerScreenY = screenY(this.marble.position);
    const playerEnv = this.track.getEnvironmentAt(this.marble.position.z);
    
    const racingStyle = this.racingStyleManager.getSelectedStyle();
    this.drawPlayerTrail(screenX, screenY, racingStyle);
    this.ctx.fillStyle = racingStyle.primaryColor;
    this.ctx.beginPath();
    this.ctx.arc(playerScreenX, playerScreenY, 10, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = racingStyle.secondaryColor;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(playerScreenX, playerScreenY, 12, 0, Math.PI * 2);
    this.ctx.stroke();
    this.drawShellPattern(playerScreenX, playerScreenY, racingStyle);

    // Draw spin indicator
    if (this.marble.getSpin() > 0.1) {
      this.ctx.strokeStyle = "rgba(255, 255, 0, 0.7)";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(playerScreenX, playerScreenY, 13, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Draw opponent marble
    const opponentScreenX = screenX(this.opponentMarble.position);
    const opponentScreenY = screenY(this.opponentMarble.position);
    
    this.ctx.fillStyle = this.getMaterialColor(this.opponentMarble.material.name);
    this.ctx.beginPath();
    this.ctx.arc(opponentScreenX, opponentScreenY, 8, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw UI
    this.ctx.fillStyle = "#000000";
    this.ctx.font = "16px Arial";
    this.ctx.fillText(`Track: ${this.track.name}`, 10, 30);
    this.ctx.fillText(`Speed: ${this.marble.getSpeed().toFixed(2)} m/s`, 10, 50);
    this.ctx.fillText(`Surface: ${playerEnv.surface} | Temp: ${playerEnv.temperature}°C`, 10, 70);
    this.ctx.fillText(`Grip upgrade: ${this.gripUpgradeEnabled ? "Reinforced" : "Standard"} [G]`, 10, 90);
    this.ctx.fillText(`Racing style: ${racingStyle.name} [T]`, 10, 100);
    this.ctx.fillText(`Materials: fiber ${this.upgradeInventory.getMaterialCount("grip-fiber")} | glass ${this.upgradeInventory.getMaterialCount("volcanic-glass")} | resin ${this.upgradeInventory.getMaterialCount("frost-resin")} [U] Craft`, 10, 120);
    this.ctx.fillText(`Elevation: ${playerEnv.elevation.toFixed(1)}m | Air density: ${this.marble.getAirDensityAtAltitude(playerEnv.elevation).toFixed(3)}`, 10, 140);
    this.ctx.fillText(`Checkpoints: ${this.checkpointIndex}/${this.checkpoints.length} [R] Restart`, 10, 160);
    this.ctx.fillText(`Stage ${this.progression.currentStageIndex + 1}: ${this.activeStage.name} | Unlocked: ${this.progression.unlockedStageIndex + 1}`, 10, 180);
    this.ctx.fillText(`Challenge: ${this.activeChallenge.name} | Encounter: ${this.activeEncounter.encounterName}`, 10, 200);
    const gateDescription = this.bossChallengeProgression.getPreparationDescription(this.activeStage.id);
    this.ctx.fillText(`Boss gate: ${gateDescription ? "Preparation required" : "Unlocked"}`, 10, 220);
    this.ctx.fillText(`W/L: ${this.progression.totalWins}/${this.progression.totalLosses}`, 10, 240);
    this.ctx.fillText(`Lore discovered: ${this.storyManager.getDiscoveredLore().length}`, 10, 260);
    const availableStoryEvents = this.storyManager.getAvailableEvents(this.activeStage.id).length;
    this.ctx.fillText(`Story events available: ${availableStoryEvents} [L] Read next`, 10, 280);
    this.ctx.fillText(`Boss biographies: ${this.characterRelationshipManager.getUnlockedBossBiographies().length}/5 [B]`, 10, 300);
    const activeMember = this.playerTeamManager.getActiveMember();
    this.ctx.fillText(`Team: ${this.playerTeamManager.getTeamSize()}/${this.playerTeamManager.getTeamCapacity()} | Pilot: ${this.playerTeamManager.player.name}`, 10, 320);
    this.ctx.fillText(`Active teammate: ${activeMember?.name ?? "None"}`, 10, 340);
    const faction = this.worldStateManager.getFactionState(this.activeStage.faction.toLowerCase().replace(/\s+/g, "-"));
    this.ctx.fillText(`Faction: ${faction.name} | Standing: ${faction.band} (${faction.standing})`, 10, 360);
    if (this.storyNotice) this.ctx.fillText(this.storyNotice, 10, 380);

    if (this.showDebugUI) {
       this.ctx.fillText(`Spin: ${this.marble.getSpin().toFixed(2)} rad/s`, 10, 420);
       this.ctx.fillText(`Wind: ${playerEnv.windVector.length().toFixed(2)} m/s`, 10, 440);
       this.ctx.fillText(`Position Z: ${this.marble.position.z.toFixed(1)}m`, 10, 460);
       this.ctx.fillText(`[D] Debug  [T] Style  [U] Craft  [P] Pip  [K] Quarry  [V] Vela  [N] Nix`, 10, 480);
    }

    this.ctx.fillText(`Race Time: ${this.raceTime.toFixed(1)}s`, 10, this.canvas.height - 20);
    if (this.raceFinished) {
      this.ctx.fillStyle = this.raceResult === "player" ? "#126B2E" : "#8B1E1E";
      this.ctx.font = "bold 24px Arial";
      this.ctx.fillText(this.raceResult === "player" ? "FINISH — PLAYER WINS" : "FINISH — OPPONENT WINS", 10, 445);
      this.ctx.strokeStyle = racingStyle.highlightColor;
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.arc(playerScreenX, playerScreenY, 18 + Math.sin(this.raceTime * 5) * 2, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    if (this.lorePanelOpen) this.drawLorePanel();
    if (this.dialogueScene) this.drawDialoguePanel();
  }

  private drawPlayerTrail(screenX: (position: Vector3) => number, screenY: (position: Vector3) => number, style: ReturnType<RacingStyleManager["getSelectedStyle"]>): void {
    if (!this.ctx || style.trailStyle === "none") return;
    for (let index = 0; index < this.playerTrail.length; index += 1) {
      const point = this.playerTrail[index];
      const progress = (index + 1) / this.playerTrail.length;
      const x = screenX(new Vector3(point.x, 0, point.y));
      const y = screenY(new Vector3(point.x, 0, point.y));
      this.ctx.globalAlpha = progress * 0.35;
      this.ctx.fillStyle = style.secondaryColor;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2 + progress * 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }

  private drawShellPattern(x: number, y: number, style: ReturnType<RacingStyleManager["getSelectedStyle"]>): void {
    if (!this.ctx) return;
    this.ctx.strokeStyle = style.highlightColor;
    this.ctx.fillStyle = style.highlightColor;
    this.ctx.lineWidth = 1.5;
    if (style.shellPattern === "rings") {
      this.ctx.beginPath();
      this.ctx.arc(x, y, 6, 0, Math.PI * 2);
      this.ctx.stroke();
    } else if (style.shellPattern === "spiral") {
      this.ctx.beginPath();
      this.ctx.arc(x, y, 7, -0.8, 1.9);
      this.ctx.stroke();
    } else if (style.shellPattern === "constellation") {
      [[-4, -3], [2, -5], [5, 3]].forEach(([dx, dy]) => {
        this.ctx!.beginPath();
        this.ctx!.arc(x + dx, y + dy, 1.2, 0, Math.PI * 2);
        this.ctx!.fill();
      });
    } else if (style.shellPattern === "glitch-lines") {
      this.ctx.beginPath();
      this.ctx.moveTo(x - 7, y - 2);
      this.ctx.lineTo(x - 1, y - 2);
      this.ctx.moveTo(x + 2, y + 3);
      this.ctx.lineTo(x + 7, y + 3);
      this.ctx.stroke();
    } else if (style.shellPattern === "split-tone") {
      this.ctx.beginPath();
      this.ctx.arc(x, y, 7, Math.PI * 0.15, Math.PI * 1.15);
      this.ctx.stroke();
    }
  }

  private drawDialoguePanel(): void {
    if (!this.ctx || !this.dialogueScene) return;
    const panelWidth = Math.min(560, this.canvas.width - 40);
    const panelHeight = 150;
    const panelX = (this.canvas.width - panelWidth) / 2;
    const panelY = this.canvas.height - panelHeight - 45;
    this.ctx.fillStyle = "rgba(25, 18, 12, 0.94)";
    this.ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    this.ctx.strokeStyle = "#F1C76B";
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
    this.ctx.fillStyle = "#F6F1DE";
    this.ctx.font = "bold 17px Arial";
    this.ctx.fillText(this.dialogueScene.title, panelX + 16, panelY + 28);
    this.ctx.font = "15px Arial";
    const line = this.dialogueScene.lines[this.dialogueLineIndex] ?? "";
    const dialogueLines = this.wrapText(line, panelWidth - 32, "15px Arial");
    dialogueLines.slice(0, 2).forEach((dialogueLine, index) => this.ctx!.fillText(dialogueLine, panelX + 16, panelY + 68 + index * 20));
    this.ctx.font = "12px Arial";
    this.ctx.fillText("[Enter/Space] Continue   [Esc] Close", panelX + 16, panelY + 125);
  }

  private getLorePanelEntries(): Array<{ title: string; body: string }> {
    const mystery = this.getMysteryConvergence();
    const convergenceEntry = {
      title: "Mystery Convergence",
      body: getMysteryArchiveBody(mystery),
    };
    const loreEntries = this.storyManager.getDiscoveredLore().map((entry: LoreEntry) => ({
      title: entry.title,
      body: `${entry.summary}\n\nDelivery: ${entry.delivery}`,
    }));
    const biographies = this.characterRelationshipManager.getUnlockedBossBiographies().map((entry: BossBiography) => ({
      title: entry.title,
      body: `${entry.abilityExplanation}\n\n${entry.biography}`,
    }));
    return [convergenceEntry, ...loreEntries, ...biographies];
  }

  private getMysteryConvergence() {
    return evaluateMysteryConvergence(this.getMysteryProgressSnapshot());
  }

  private getMysteryProgressSnapshot() {
    return {
      discoveredLoreIds: this.storyManager.getState().discoveredLoreIds,
      defeatedBossIds: this.characterRelationshipManager.getUnlockedBossBiographies().map((biography) => biography.bossId),
    };
  }

  private drawLorePanel(): void {
    if (!this.ctx) return;
    const entries = this.getLorePanelEntries();
    const panelWidth = Math.min(620, this.canvas.width - 40);
    const panelHeight = Math.min(500, this.canvas.height - 40);
    const panelX = this.canvas.width - panelWidth - 20;
    const panelY = 20;

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#F6F1DE";
    this.ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    this.ctx.strokeStyle = "#4E3823";
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    this.ctx.fillStyle = "#2E2118";
    this.ctx.font = "bold 20px Arial";
    this.ctx.fillText("Lore Archive", panelX + 18, panelY + 30);
    this.ctx.font = "12px Arial";
    this.ctx.fillText("[B] Close   [←/→] Entry   [↑/↓] Scroll", panelX + 18, panelY + 50);

    if (entries.length === 0) {
      this.ctx.font = "16px Arial";
      this.ctx.fillText("No lore has been discovered yet.", panelX + 18, panelY + 90);
      this.ctx.fillText("Complete races and defeat bosses to unlock entries.", panelX + 18, panelY + 116);
      return;
    }

    const entryIndex = Math.min(this.lorePanelEntryIndex, entries.length - 1);
    const entry = entries[entryIndex];
    const textWidth = panelWidth - 36;
    const lines = this.wrapText(entry.body, textWidth, "14px Arial");
    const visibleLines = Math.max(1, Math.floor((panelHeight - 105) / 20));
    const maxScroll = Math.max(0, lines.length - visibleLines);
    this.lorePanelScroll = Math.min(this.lorePanelScroll, maxScroll);

    this.ctx.font = "bold 16px Arial";
    this.ctx.fillText(`${entryIndex + 1}/${entries.length} — ${entry.title}`, panelX + 18, panelY + 78);
    this.ctx.font = "14px Arial";
    for (let index = 0; index < visibleLines; index += 1) {
      const line = lines[this.lorePanelScroll + index];
      if (line !== undefined) this.ctx.fillText(line, panelX + 18, panelY + 105 + index * 20);
    }
    this.ctx.font = "12px Arial";
    this.ctx.fillText(`Scroll ${this.lorePanelScroll}/${maxScroll}`, panelX + 18, panelY + panelHeight - 12);
  }

  private wrapText(text: string, maxWidth: number, font: string): string[] {
    if (!this.ctx) return [];
    this.ctx.font = font;
    return text.split("\n").flatMap((paragraph) => {
      if (!paragraph) return [""];
      const words = paragraph.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (this.ctx!.measureText(candidate).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = candidate;
        }
      }
      if (line) lines.push(line);
      return lines;
    });
  }

  private drawTrack(): void {
    if (!this.ctx) return;

    const trackStartX = this.canvas.width / 2 - 100;
    const trackWidth = 200;
    const trackBaseY = this.canvas.height * 0.65;

    // Draw track profile
    this.ctx.strokeStyle = "#8B7355"; // Brown for track
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    const segments = 100;
    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;
      const zPos = progress * this.track.totalLength;
      const height = this.track.getHeightAtX(zPos);
      
      const screenX = trackStartX + (progress * trackWidth);
      const screenY = trackBaseY - (height * 2);

      if (i === 0) {
        this.ctx.moveTo(screenX, screenY);
      } else {
        this.ctx.lineTo(screenX, screenY);
      }
    }
    this.ctx.stroke();

    // Starter obstacle: collision data and visuals remain separate.
    const obstacleProgress = this.starterObstacle.position.z / this.track.totalLength;
    const obstacleX = trackStartX + obstacleProgress * trackWidth;
    this.ctx.fillStyle = "#6B4F35";
    this.ctx.beginPath();
    this.ctx.arc(obstacleX, trackBaseY - 4, 7, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw surface type indicators with color
    const regionStartX = this.canvas.width / 2 - 100;
    for (const region of this.track.regions) {
      const startProgress = region.startX / this.track.totalLength;
      const endProgress = region.endX / this.track.totalLength;
      
      const screenStartX = regionStartX + (startProgress * trackWidth);
      const screenEndX = regionStartX + (endProgress * trackWidth);
      
      this.ctx.fillStyle = this.getSurfaceColor(region.surface);
      this.ctx.fillRect(screenStartX, trackBaseY + 5, screenEndX - screenStartX, 8);

      // Draw region name
      this.ctx.fillStyle = "#000000";
      this.ctx.font = "10px Arial";
      this.ctx.fillText(
        region.name,
        screenStartX,
        trackBaseY + 20
      );
    }
  }

  private createSaveData(): GameSaveData {
    return {
      schemaVersion: 1,
      savedAtIso: new Date().toISOString(),
      progression: { ...this.progression },
      story: this.storyManager.getState(),
      world: this.worldStateManager.getState(),
      team: this.playerTeamManager.getState(),
      relationships: this.characterRelationshipManager.getSnapshot(),
      bossGates: this.bossChallengeProgression.getSnapshot(),
      upgrades: this.upgradeInventory.getState(),
      npcServices: this.npcServiceManager.getState(),
      racingStyle: this.racingStyleManager.getState(),
    };
  }

  private persistGameSilently(): void {
    saveToStorage(this.createSaveData());
  }

  private saveGame(): void {
    this.storyNotice = saveToStorage(this.createSaveData()) ? "Game saved." : "Game could not be saved on this device.";
  }

  private loadGame(): void {
    const save = loadFromStorage();
    if (!save) {
      this.storyNotice = "No compatible save was found.";
      return;
    }
    this.applySaveData(save);
    this.storyNotice = "Game loaded.";
  }

  private applySaveData(save: GameSaveData): void {
    const finalStageIndex = this.stageManager.getStages().length - 1;
    this.progression = {
      ...save.progression,
      currentStageIndex: Math.max(0, Math.min(finalStageIndex, save.progression.currentStageIndex)),
      unlockedStageIndex: Math.max(0, Math.min(finalStageIndex, save.progression.unlockedStageIndex)),
    };
    this.storyManager.loadState(save.story);
    this.worldStateManager.loadState(save.world);
    this.playerTeamManager.loadState(save.team);
    this.characterRelationshipManager.loadSnapshot(save.relationships);
    this.bossChallengeProgression.loadSnapshot(save.bossGates);
    this.upgradeInventory.loadState(save.upgrades);
    this.npcServiceManager.loadState(save.npcServices);
    this.racingStyleManager.loadState(save.racingStyle);
    this.gripUpgradeEnabled = false;
    this.marble.setGripModifier(1);
    this.loadCurrentStage();
    this.track = createTrack(this.activeStage.trackId);
    this.resetRace(false);
  }

  private getMaterialColor(material: string): string {
    switch (material) {
      case "steel": return "#C0C0C0";
      case "rubber": return "#333333";
      case "glass": return "#E0F2F7";
      case "stone": return "#D2B48C";
      default: return "#FF6B6B";
    }
  }

  private getSurfaceColor(surface: string): string {
    switch (surface) {
      case "asphalt": return "#505050";
      case "gravel": return "#D3D3D3";
      case "rock": return "#808080";
      case "ice": return "#E0FFFF";
      case "obsidian": return "#1C1C1C";
      case "volcanic_rock": return "#8B4513";
      default: return "#A0A0A0";
    }
  }

  private gameLoop = (currentTime: number): void => {
    if (this.lastFrameTime === 0) this.lastFrameTime = currentTime;
    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    this.update(deltaTime);
    this.render();

    if (this.running) {
      requestAnimationFrame(this.gameLoop);
    }
  };

  public start(): void {
    this.running = true;
    this.lastFrameTime = 0;
    requestAnimationFrame(this.gameLoop);
    console.log("🎮 Game started!");
  }

  public stop(): void {
    this.running = false;
    console.log("⏹️ Game stopped");
  }
}

// Initialize and start game when page loads
window.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.start();

  // Expose game to console for debugging
  (window as any).game = game;
});

export default Game;

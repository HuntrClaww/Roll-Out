import { LoreEntry, STORY_EVENTS, LORE_ENTRIES, StoryEvent } from "./loreFoundation";
import { MYSTERY_REACTIONS, RECALL_CASCADE_BEATS } from "./mysteryConvergence";

export interface StoryState {
  worldTimeSeconds: number;
  discoveredLoreIds: string[];
  completedEventIds: string[];
  completedRaceIds: string[];
  completedMysteryReactionIds: string[];
  completedRecallCascadeIds: string[];
}

export class StoryManager {
  private state: StoryState = {
    worldTimeSeconds: 0,
    discoveredLoreIds: [],
    completedEventIds: [],
    completedRaceIds: [],
    completedMysteryReactionIds: [],
    completedRecallCascadeIds: [],
  };

  public getState(): StoryState {
    return {
      ...this.state,
      discoveredLoreIds: [...this.state.discoveredLoreIds],
      completedEventIds: [...this.state.completedEventIds],
      completedRaceIds: [...this.state.completedRaceIds],
      completedMysteryReactionIds: [...this.state.completedMysteryReactionIds],
      completedRecallCascadeIds: [...this.state.completedRecallCascadeIds],
    };
  }

  public loadState(state: StoryState): void {
    this.state = {
      worldTimeSeconds: Number.isFinite(state.worldTimeSeconds) ? Math.max(0, state.worldTimeSeconds) : 0,
      discoveredLoreIds: [...new Set(state.discoveredLoreIds ?? [])].filter((id) => Boolean(LORE_ENTRIES[id])),
      completedEventIds: [...new Set(state.completedEventIds ?? [])].filter((id) => STORY_EVENTS.some((event) => event.id === id)),
      completedRaceIds: [...new Set(state.completedRaceIds ?? [])].filter((id) => id.trim().length > 0),
      completedMysteryReactionIds: [...new Set(state.completedMysteryReactionIds ?? [])].filter((id) => MYSTERY_REACTIONS.some((reaction) => reaction.id === id)),
      completedRecallCascadeIds: [...new Set(state.completedRecallCascadeIds ?? [])].filter((id) => RECALL_CASCADE_BEATS.some((beat) => beat.id === id)),
    };
  }

  public advanceTime(deltaSeconds: number): void {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return;
    this.state.worldTimeSeconds += deltaSeconds;
  }

  public getAvailableEvents(stageId?: string): StoryEvent[] {
    return STORY_EVENTS.filter((event) => {
      if (this.state.completedEventIds.includes(event.id)) return false;
      if (event.requiredStageId && event.requiredStageId !== stageId) return false;
      if (this.state.worldTimeSeconds < event.timeWindow.opensAtSeconds) return false;
      // A close time is a preferred presentation window, not a permanent
      // expiry. Optional lore must remain discoverable if the player arrives late.
      return event.optional || !event.timeWindow.closesAtSeconds || this.state.worldTimeSeconds <= event.timeWindow.closesAtSeconds;
    });
  }

  public completeEvent(eventId: string): LoreEntry[] {
    const event = STORY_EVENTS.find((candidate) => candidate.id === eventId);
    if (!event || this.state.completedEventIds.includes(eventId)) return [];

    this.state.completedEventIds.push(eventId);
    const newlyDiscovered = event.loreEntryIds
      .filter((id) => !this.state.discoveredLoreIds.includes(id))
      .map((id) => LORE_ENTRIES[id])
      .filter((entry): entry is LoreEntry => entry !== undefined);
    this.state.discoveredLoreIds.push(...newlyDiscovered.map((entry) => entry.id));
    return newlyDiscovered;
  }

  public completeNextAvailableEvent(stageId?: string): LoreEntry[] {
    const nextEvent = this.getAvailableEvents(stageId).find((event) => !event.requiredWin);
    return nextEvent ? this.completeEvent(nextEvent.id) : [];
  }

  public recordRaceFinished(raceId: string, won: boolean, stageId: string): LoreEntry[] {
    if (this.state.completedRaceIds.includes(raceId)) return [];
    this.state.completedRaceIds.push(raceId);
    if (!won) return [];

    return this.getAvailableEvents(stageId)
      .filter((event) => event.kind === "race-finished" && event.requiredWin)
      .flatMap((event) => this.completeEvent(event.id));
  }

  public getDiscoveredLore(): LoreEntry[] {
    return this.state.discoveredLoreIds
      .map((id) => LORE_ENTRIES[id])
      .filter((entry): entry is LoreEntry => entry !== undefined);
  }

  public getCompletedMysteryReactionIds(): string[] {
    return [...this.state.completedMysteryReactionIds];
  }

  public completeMysteryReaction(reactionId: string): boolean {
    if (!MYSTERY_REACTIONS.some((reaction) => reaction.id === reactionId)) return false;
    if (this.state.completedMysteryReactionIds.includes(reactionId)) return false;
    this.state.completedMysteryReactionIds.push(reactionId);
    return true;
  }

  public getCompletedRecallCascadeIds(): string[] {
    return [...this.state.completedRecallCascadeIds];
  }

  public completeRecallCascade(beatId: string): boolean {
    if (!RECALL_CASCADE_BEATS.some((beat) => beat.id === beatId)) return false;
    if (this.state.completedRecallCascadeIds.includes(beatId)) return false;
    this.state.completedRecallCascadeIds.push(beatId);
    return true;
  }
}

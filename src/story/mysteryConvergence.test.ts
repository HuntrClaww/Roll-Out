import { evaluateMysteryConvergence, getAvailableMysteryReactions, getMysteryArchiveBody, MYSTERY_THREADS } from "./mysteryConvergence";

describe("mystery convergence", () => {
  test("starts with unanswered threads and no fabricated evidence", () => {
    const result = evaluateMysteryConvergence({ discoveredLoreIds: [], defeatedBossIds: [] });
    expect(result.threads).toHaveLength(MYSTERY_THREADS.length);
    expect(result.totalEvidenceCount).toBe(0);
    expect(result.convergenceReady).toBe(false);
    expect(result.threads.every((thread) => thread.status === "unseen")).toBe(true);
  });

  test("combines lore and boss biographies without requiring exact order", () => {
    const result = evaluateMysteryConvergence({
      discoveredLoreIds: ["lore.finish-line-patterns", "lore.rival-system-view", "lore.creator-traces"],
      defeatedBossIds: ["boss.aether-sovereign", "boss.glacier-sigil", "boss.rift-echelon"],
    });
    expect(result.threads.find((thread) => thread.id === "finish-line-network")?.status).toBe("converging");
    expect(result.threads.filter((thread) => thread.status === "supported" || thread.status === "converging").length).toBeGreaterThanOrEqual(3);
    expect(result.convergenceReady).toBe(true);
  });

  test("preserves useful contradictions instead of forcing a single answer", () => {
    const result = evaluateMysteryConvergence({
      discoveredLoreIds: ["lore.finish-line-patterns", "lore.rival-system-view", "lore.creator-traces"],
      defeatedBossIds: ["boss.circuit-steward"],
    });
    expect(result.contradictions).toHaveLength(2);
    expect(result.unresolvedQuestions.length).toBeGreaterThan(0);
  });

  test("ignores invalid save identifiers", () => {
    const result = evaluateMysteryConvergence({
      discoveredLoreIds: ["lore.not-real", "lore.finish-line-patterns"],
      defeatedBossIds: ["boss.not-real"],
    });
    expect(result.totalEvidenceCount).toBeGreaterThan(1);
    expect(result.threads.find((thread) => thread.id === "finish-line-network")?.evidenceCount).toBe(1);
  });

  test("unlocks a post-boss reaction only after its thread is supported", () => {
    const before = getAvailableMysteryReactions({
      discoveredLoreIds: [],
      defeatedBossIds: ["boss.aether-sovereign"],
    });
    expect(before).toHaveLength(0);

    const after = getAvailableMysteryReactions({
      discoveredLoreIds: ["lore.finish-line-patterns", "lore.rival-system-view"],
      defeatedBossIds: ["boss.aether-sovereign"],
    });
    expect(after.map((reaction) => reaction.id)).toContain("reaction.aether-open-sky");
    expect(getAvailableMysteryReactions({
      discoveredLoreIds: ["lore.finish-line-patterns", "lore.rival-system-view"],
      defeatedBossIds: ["boss.aether-sovereign"],
    }, ["reaction.aether-open-sky"])).toHaveLength(0);
  });

  test("creates archive text that shows status and preserves uncertainty", () => {
    const body = getMysteryArchiveBody(evaluateMysteryConvergence({
      discoveredLoreIds: ["lore.finish-line-patterns"],
      defeatedBossIds: [],
    }));
    expect(body).toContain("The Finish-Line Network — Hinted");
    expect(body).toContain("The pattern is incomplete");
  });
});

import {
  evaluateMysteryConvergence,
  getAvailableMysteryReactions,
  getMysteryArchiveBody,
  getMysteryReactionArchiveEntries,
  getAvailableRecallCascadeBeats,
  getRecallCascadeArchiveEntries,
  MYSTERY_THREADS,
} from "./mysteryConvergence";

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

  test("keeps a seen post-boss reaction available as a durable archive entry", () => {
    expect(getMysteryReactionArchiveEntries([])).toHaveLength(0);

    const entries = getMysteryReactionArchiveEntries(["reaction.aether-open-sky", "reaction.not-real"]);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toEqual({
      title: "A route the sky remembers",
      body: "The next finish line does not look nearer. It looks as if it has been waiting for a racer to notice it.",
    });
  });

  test("returns reaction archive entries in a stable, declared order", () => {
    const allReactionIds = [
      "reaction.circuit-order",
      "reaction.aether-open-sky",
      "reaction.rift-double-answer",
    ];
    const entries = getMysteryReactionArchiveEntries(allReactionIds);
    expect(entries.map((entry) => entry.title)).toEqual([
      "A route the sky remembers",
      "Two routes, one arrival",
      "The schedule underneath",
    ]);
  });
});

describe("recall cascade", () => {
  test("no beats are available before any bosses are defeated", () => {
    expect(getAvailableRecallCascadeBeats([])).toHaveLength(0);
  });

  test("the first beat unlocks once its two required bosses are both defeated, not before", () => {
    expect(getAvailableRecallCascadeBeats(["boss.aether-sovereign"])).toHaveLength(0);
    const available = getAvailableRecallCascadeBeats(["boss.aether-sovereign", "boss.cinder-axis"]);
    expect(available.map((beat) => beat.id)).toContain("recall.thats-twice-now");
  });

  test("the final crashout beat requires all five bosses defeated", () => {
    const fourDefeated = getAvailableRecallCascadeBeats([
      "boss.aether-sovereign",
      "boss.cinder-axis",
      "boss.glacier-sigil",
      "boss.rift-echelon",
    ]);
    expect(fourDefeated.some((beat) => beat.id === "recall.the-crashout")).toBe(false);

    const allFive = getAvailableRecallCascadeBeats([
      "boss.aether-sovereign",
      "boss.cinder-axis",
      "boss.glacier-sigil",
      "boss.rift-echelon",
      "boss.circuit-steward",
    ]);
    expect(allFive.some((beat) => beat.id === "recall.the-crashout")).toBe(true);
  });

  test("already-shown beats are excluded from availability", () => {
    const defeated = ["boss.aether-sovereign", "boss.cinder-axis"];
    expect(getAvailableRecallCascadeBeats(defeated, ["recall.thats-twice-now"])).toHaveLength(0);
  });

  test("archive entries persist shown beats with their full script", () => {
    expect(getRecallCascadeArchiveEntries([])).toHaveLength(0);
    const entries = getRecallCascadeArchiveEntries(["recall.thats-twice-now"]);
    expect(entries).toHaveLength(1);
    expect(entries[0].title).toBe("That's twice now");
    expect(entries[0].body).toContain("Weird flex, but okay!");
  });
});

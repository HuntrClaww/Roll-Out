import { runEncounterDensityAudit } from "./encounterDensityAudit";

describe("encounter density audit", () => {
  test("keeps the current roster discoverable without overloading a region or stage", () => {
    const audit = runEncounterDensityAudit();
    expect(audit.encounterCount).toBeGreaterThanOrEqual(40);
    expect(audit.invalidCharacterIds).toEqual([]);
    expect(audit.duplicateOneTimeCharacterIds).toEqual([]);
    expect(audit.overloadedRegions).toEqual([]);
    expect(audit.overloadedStages).toEqual([]);
    expect(audit.worldTimeOnlyCount).toBeGreaterThan(0);
    expect(audit.ready).toBe(true);
  });
});


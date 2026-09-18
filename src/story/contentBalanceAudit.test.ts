import { runContentBalanceAudit } from "./contentBalanceAudit";

describe("64-character content balance audit", () => {
  test("keeps the roster unique and visually covered", () => {
    const report = runContentBalanceAudit();
    expect(report.rosterCount).toBe(64);
    expect(report.uniqueCharacterCount).toBe(64);
    expect(report.visualCoverageCount).toBe(64);
    expect(report.charactersWithoutVisualIdentity).toHaveLength(0);
  });

  test("keeps enough characters discoverable without requiring every character to be a dialogue lead", () => {
    const report = runContentBalanceAudit();
    expect(report.encounterCoverageCount).toBeGreaterThanOrEqual(30);
    expect(report.dialogueCoverageCount).toBeGreaterThanOrEqual(15);
    expect(report.serviceCoverageCount).toBeGreaterThanOrEqual(10);
    expect(report.charactersWithoutAnyDiscoverabilityPath.length).toBeLessThanOrEqual(12);
    expect(report.functionCounts.boss).toBe(5);
    expect(report.warnings).not.toContain("Duplicate character IDs detected.");
  });
});

import { describe, expect, it } from "vitest";
import { computeChart, scoreChart } from "./qimen";

describe("computeChart", () => {
  it("returns a complete, stable nine-palace chart", () => {
    const chart = computeChart("2025-06-01T12:00:00+08:00");
    expect(chart.palaces).toHaveLength(9);
    expect(chart.palaces[0]).toMatchObject({ position: 1, direction: "坎" });
    expect(new Set(chart.palaces.map((p) => p.position)).size).toBe(9);
  });
  it("changes the hour plate and produces a bounded score", () => {
    const first = computeChart("2025-05-15T00:00:00+08:00");
    const second = computeChart("2025-05-15T12:00:00+08:00");
    expect(first.hour_stem).not.toBe(second.hour_stem);
    expect(scoreChart(second.palaces)).toBeGreaterThanOrEqual(0);
    expect(scoreChart(second.palaces)).toBeLessThanOrEqual(10);
  });
});

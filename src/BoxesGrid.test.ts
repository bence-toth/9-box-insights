import { getBoxLayout, getBoxScore } from "./boxesGridUtils";
import gridConfigs from "./config";

describe("getBoxLayout", () => {
  describe("3x3 grid (9-box)", () => {
    it("should return 9 boxes", () => {
      expect(getBoxLayout(3, 3)).toHaveLength(9);
    });

    it("should render top row first (boxes 7, 8, 9)", () => {
      const layout = getBoxLayout(3, 3);
      expect(layout.slice(0, 3)).toEqual([7, 8, 9]);
    });

    it("should render middle row second (boxes 4, 5, 6)", () => {
      const layout = getBoxLayout(3, 3);
      expect(layout.slice(3, 6)).toEqual([4, 5, 6]);
    });

    it("should render bottom row last (boxes 1, 2, 3)", () => {
      const layout = getBoxLayout(3, 3);
      expect(layout.slice(6, 9)).toEqual([1, 2, 3]);
    });
  });

  describe("3x1 grid (1-3 rating)", () => {
    it("should return 3 boxes in order", () => {
      expect(getBoxLayout(3, 1)).toEqual([1, 2, 3]);
    });
  });

  describe("5x1 grid (1-5 rating)", () => {
    it("should return 5 boxes in order", () => {
      expect(getBoxLayout(5, 1)).toEqual([1, 2, 3, 4, 5]);
    });
  });

  it("should contain each box number exactly once", () => {
    const layout = getBoxLayout(3, 3);
    expect(new Set(layout).size).toBe(9);
    expect(Math.min(...layout)).toBe(1);
    expect(Math.max(...layout)).toBe(9);
  });
});

describe("getBoxScore", () => {
  describe("3x3 grid (9-box)", () => {
    it("should score box 1 (bottom-left) as 0", () => {
      expect(getBoxScore(1, 3)).toBe(0);
    });

    it("should score box 5 (center) as 2", () => {
      expect(getBoxScore(5, 3)).toBe(2);
    });

    it("should score box 9 (top-right) as 4", () => {
      expect(getBoxScore(9, 3)).toBe(4);
    });

    it("should score box 3 (bottom-right) as 2", () => {
      expect(getBoxScore(3, 3)).toBe(2);
    });

    it("should score box 7 (top-left) as 2", () => {
      expect(getBoxScore(7, 3)).toBe(2);
    });
  });

  describe("5x1 grid (1-5 rating)", () => {
    it("should score box 1 as 0", () => {
      expect(getBoxScore(1, 5)).toBe(0);
    });

    it("should score box 3 as 2", () => {
      expect(getBoxScore(3, 5)).toBe(2);
    });

    it("should score box 5 as 4", () => {
      expect(getBoxScore(5, 5)).toBe(4);
    });
  });

  describe("3x1 grid (1-3 rating)", () => {
    it("should score box 1 as 0", () => {
      expect(getBoxScore(1, 3)).toBe(0);
    });

    it("should score box 2 as 1", () => {
      expect(getBoxScore(2, 3)).toBe(1);
    });

    it("should score box 3 as 2", () => {
      expect(getBoxScore(3, 3)).toBe(2);
    });
  });
});

describe("gridConfigs", () => {
  it("should define at least one config", () => {
    expect(gridConfigs.length).toBeGreaterThan(0);
  });

  it("should have unique paths", () => {
    const paths = gridConfigs.map((c) => c.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("should have unique labels", () => {
    const labels = gridConfigs.map((c) => c.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("should include a 9-box config (3x3)", () => {
    const nineBox = gridConfigs.find(
      (c) => c.numberOfColumns === 3 && c.numberOfRows === 3
    );
    expect(nineBox).toBeDefined();
  });

  it("should include a 1-5 rating config (5x1)", () => {
    const fiveBox = gridConfigs.find(
      (c) => c.numberOfColumns === 5 && c.numberOfRows === 1
    );
    expect(fiveBox).toBeDefined();
  });

  it("should include a 1-3 rating config (3x1)", () => {
    const threeBox = gridConfigs.find(
      (c) => c.numberOfColumns === 3 && c.numberOfRows === 1
    );
    expect(threeBox).toBeDefined();
  });

  it("should have valid box thresholds referencing boxes within grid bounds", () => {
    gridConfigs.forEach((config) => {
      const totalBoxes = config.numberOfColumns * config.numberOfRows;
      config.boxThresholds.forEach((t) => {
        expect(t.box).toBeGreaterThanOrEqual(1);
        expect(t.box).toBeLessThanOrEqual(totalBoxes);
      });
      config.boxGroupThresholds.forEach((g) => {
        g.boxes.forEach((box) => {
          expect(box).toBeGreaterThanOrEqual(1);
          expect(box).toBeLessThanOrEqual(totalBoxes);
        });
      });
    });
  });

  it("should have threshold min/max values between 0 and 1", () => {
    gridConfigs.forEach((config) => {
      config.boxThresholds.forEach((t) => {
        if (t.min !== undefined) expect(t.min).toBeGreaterThanOrEqual(0);
        if (t.max !== undefined) expect(t.max).toBeLessThanOrEqual(1);
        if (t.min !== undefined && t.max !== undefined) {
          expect(t.min).toBeLessThanOrEqual(t.max);
        }
      });
    });
  });
});

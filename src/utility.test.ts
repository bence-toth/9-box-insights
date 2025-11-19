import { calculateCorrelationWithPValue } from "./utility";

describe("calculateCorrelationWithPValue", () => {
  describe("Edge cases", () => {
    it("should return NaN for insufficient data (n < 3)", () => {
      const result = calculateCorrelationWithPValue([]);
      expect(result.correlation).toBeNaN();
      expect(result.pValue).toBeNaN();
    });

    it("should return NaN for data with only one point", () => {
      const result = calculateCorrelationWithPValue([{ x: 1, y: 2 }]);
      expect(result.correlation).toBeNaN();
      expect(result.pValue).toBeNaN();
    });

    it("should return NaN for data with only two points", () => {
      const result = calculateCorrelationWithPValue([
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ]);
      expect(result.correlation).toBeNaN();
      expect(result.pValue).toBeNaN();
    });
  });

  describe("Perfect correlations", () => {
    it("should return correlation of 1 and p-value of 0 for perfect positive correlation", () => {
      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
        { x: 5, y: 10 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeCloseTo(1, 10);
      expect(result.pValue).toBe(0);
    });

    it("should return correlation of -1 and p-value of 0 for perfect negative correlation", () => {
      const data = [
        { x: 1, y: 10 },
        { x: 2, y: 8 },
        { x: 3, y: 6 },
        { x: 4, y: 4 },
        { x: 5, y: 2 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeCloseTo(-1, 10);
      expect(result.pValue).toBe(0);
    });
  });

  describe("No correlation", () => {
    it("should return correlation near 0 for completely uncorrelated data", () => {
      const data = [
        { x: 1, y: 5 },
        { x: 2, y: 3 },
        { x: 3, y: 7 },
        { x: 4, y: 2 },
        { x: 5, y: 6 },
      ];
      const result = calculateCorrelationWithPValue(data);
      // Correlation should be close to 0 (within reasonable range)
      expect(Math.abs(result.correlation)).toBeLessThan(0.5);
      // p-value should be relatively high (not significant)
      expect(result.pValue).toBeGreaterThan(0.05);
    });

    it("should handle horizontal line (constant y values)", () => {
      const data = [
        { x: 1, y: 5 },
        { x: 2, y: 5 },
        { x: 3, y: 5 },
        { x: 4, y: 5 },
        { x: 5, y: 5 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBe(0);
      // When correlation is 0, p-value should be close to 1 (no significance)
      expect(result.pValue).toBeGreaterThan(0.99);
    });

    it("should handle vertical line (constant x values)", () => {
      const data = [
        { x: 5, y: 1 },
        { x: 5, y: 2 },
        { x: 5, y: 3 },
        { x: 5, y: 4 },
        { x: 5, y: 5 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBe(0);
      // When correlation is 0, p-value should be close to 1 (no significance)
      expect(result.pValue).toBeGreaterThan(0.99);
    });
  });

  describe("Moderate correlations", () => {
    it("should calculate positive correlation correctly", () => {
      const data = [
        { x: 1, y: 2.1 },
        { x: 2, y: 3.9 },
        { x: 3, y: 6.2 },
        { x: 4, y: 7.8 },
        { x: 5, y: 10.1 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeGreaterThan(0.9);
      expect(result.correlation).toBeLessThan(1);
      expect(result.pValue).toBeGreaterThan(0);
      expect(result.pValue).toBeLessThan(0.05); // Should be statistically significant
    });

    it("should calculate negative correlation correctly", () => {
      const data = [
        { x: 1, y: 9.8 },
        { x: 2, y: 8.2 },
        { x: 3, y: 6.1 },
        { x: 4, y: 4.3 },
        { x: 5, y: 2.2 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeLessThan(-0.9);
      expect(result.correlation).toBeGreaterThan(-1);
      expect(result.pValue).toBeGreaterThan(0);
      expect(result.pValue).toBeLessThan(0.05); // Should be statistically significant
    });

    it("should calculate weak positive correlation correctly", () => {
      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 5 },
        { x: 3, y: 4 },
        { x: 4, y: 7 },
        { x: 5, y: 6 },
        { x: 6, y: 9 },
        { x: 7, y: 8 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeGreaterThan(0.5);
      expect(result.correlation).toBeLessThan(0.95);
      expect(result.pValue).toBeGreaterThan(0);
      expect(result.pValue).toBeLessThan(1);
    });
  });

  describe("Real-world scenarios", () => {
    it("should handle larger datasets with strong positive correlation", () => {
      const data = Array.from({ length: 50 }, (_, i) => ({
        x: i + 1,
        y: (i + 1) * 2 + Math.random() * 2 - 1, // y = 2x with small random noise
      }));
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeGreaterThan(0.95);
      expect(result.pValue).toBeLessThan(0.001); // Very significant
    });

    it("should handle larger datasets with no correlation", () => {
      // Use alternating pattern to ensure no correlation
      const data = Array.from({ length: 50 }, (_, i) => ({
        x: i + 1,
        y: i % 2 === 0 ? 50 + (i % 10) : 50 - (i % 10),
      }));
      const result = calculateCorrelationWithPValue(data);
      expect(Math.abs(result.correlation)).toBeLessThan(0.5);
      // With this pattern, p-value should indicate no significant correlation
    });

    it("should handle negative values", () => {
      const data = [
        { x: -5, y: -10 },
        { x: -3, y: -6 },
        { x: -1, y: -2 },
        { x: 1, y: 2 },
        { x: 3, y: 6 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeCloseTo(1, 10);
      expect(result.pValue).toBe(0);
    });

    it("should handle floating point values", () => {
      const data = [
        { x: 1.5, y: 2.3 },
        { x: 2.7, y: 4.1 },
        { x: 3.2, y: 5.9 },
        { x: 4.8, y: 8.2 },
        { x: 5.1, y: 9.7 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeGreaterThan(0.9);
      expect(result.pValue).toBeGreaterThan(0);
      expect(result.pValue).toBeLessThan(0.05);
    });

    it("should handle zero values", () => {
      const data = [
        { x: 0, y: 0 },
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeCloseTo(1, 10);
      expect(result.pValue).toBe(0);
    });
  });

  describe("Statistical significance", () => {
    it("should return low p-value for strong correlation with small sample", () => {
      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeCloseTo(1, 10);
      expect(result.pValue).toBe(0);
    });

    it("should return higher p-value for weak correlation", () => {
      const data = [
        { x: 1, y: 1 },
        { x: 2, y: 3 },
        { x: 3, y: 2 },
        { x: 4, y: 4 },
        { x: 5, y: 3 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.pValue).toBeGreaterThan(0.05);
    });
  });

  describe("Boundary conditions", () => {
    it("should handle three data points (minimum for calculation)", () => {
      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeCloseTo(1, 10);
      expect(result.pValue).toBe(0);
      expect(result.correlation).not.toBeNaN();
      expect(result.pValue).not.toBeNaN();
    });

    it("should handle very large values", () => {
      const data = [
        { x: 1000000, y: 2000000 },
        { x: 2000000, y: 4000000 },
        { x: 3000000, y: 6000000 },
        { x: 4000000, y: 8000000 },
        { x: 5000000, y: 10000000 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeCloseTo(1, 10);
      expect(result.pValue).toBe(0);
    });

    it("should handle very small values", () => {
      const data = [
        { x: 0.0001, y: 0.0002 },
        { x: 0.0002, y: 0.0004 },
        { x: 0.0003, y: 0.0006 },
        { x: 0.0004, y: 0.0008 },
        { x: 0.0005, y: 0.001 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeCloseTo(1, 10);
      expect(result.pValue).toBe(0);
    });
  });

  describe("Data quality", () => {
    it("should handle mixed scale data", () => {
      const data = [
        { x: 1, y: 100 },
        { x: 2, y: 200 },
        { x: 3, y: 300 },
        { x: 4, y: 400 },
        { x: 5, y: 500 },
      ];
      const result = calculateCorrelationWithPValue(data);
      expect(result.correlation).toBeCloseTo(1, 10);
      expect(result.pValue).toBe(0);
    });

    it("should handle data with outliers affecting correlation", () => {
      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
        { x: 5, y: 100 }, // outlier
      ];
      const result = calculateCorrelationWithPValue(data);
      // Outlier should reduce correlation
      expect(result.correlation).toBeLessThan(0.95);
      expect(result.correlation).toBeGreaterThan(0);
    });
  });
});

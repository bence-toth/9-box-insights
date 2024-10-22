import { jStat } from "jstat";

const calculatePValue = (r: number, n: number): number => {
  const t = (r * Math.sqrt(n - 2)) / Math.sqrt(1 - r * r);
  const df = n - 2; // degrees of freedom

  // Ensure degrees of freedom is positive
  if (df <= 0) {
    return NaN; // Not enough data to compute p-value
  }

  // Calculate two-tailed p-value
  return 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));
};

interface CorrelationResult {
  correlation: number;
  pValue: number;
}

const calculateCorrelationWithPValue = (
  data: { x: number; y: number }[]
): CorrelationResult => {
  const n = data.length;
  if (n < 3) {
    return { correlation: NaN, pValue: NaN }; // Not enough data
  }

  const sumX = data.reduce((sum, val) => sum + val.x, 0);
  const sumY = data.reduce((sum, val) => sum + val.y, 0);
  const sumXY = data.reduce((sum, val) => sum + val.x * val.y, 0);
  const sumX2 = data.reduce((sum, val) => sum + val.x * val.x, 0);
  const sumY2 = data.reduce((sum, val) => sum + val.y * val.y, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  );

  const r = denominator !== 0 ? numerator / denominator : 0;

  if (r === 1 || r === -1) {
    return { correlation: r, pValue: 0 };
  }

  const pValue = calculatePValue(r, n);

  return { correlation: r, pValue };
};

export { calculateCorrelationWithPValue };

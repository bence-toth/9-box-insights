const topRightElbow = [6, 8, 9];
const bottomLeftElbow = [1, 2, 4];
const mainDiagonal = [3, 5, 7];

const boxThresholds: { box: number; min?: number; max?: number }[] = [
  { box: 9, max: 0.2 },
];

const boxGroupThresholds: {
  boxes: number[];
  min?: number;
  max?: number;
}[] = [
  { boxes: topRightElbow, max: 0.35 },
  { boxes: bottomLeftElbow, min: 0 },
  { boxes: mainDiagonal, min: 0 },
];

export { boxThresholds, boxGroupThresholds };

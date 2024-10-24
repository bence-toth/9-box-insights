const boxThresholds: { box: number; min?: number; max?: number }[] = [];

const topRightElbow = [6, 8, 9];
// const bottomLeftElbow = [1, 2, 4];
// const mainDiagonal = [3, 5, 7];

const boxGroupThresholds: {
  boxes: number[];
  min?: number;
  max?: number;
}[] = [{ boxes: topRightElbow, max: 0.33 }];

export { boxThresholds, boxGroupThresholds };

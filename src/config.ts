export interface BoxThreshold {
  box: number;
  min?: number;
  max?: number;
}

export interface BoxGroupThreshold {
  boxes: number[];
  min?: number;
  max?: number;
}

export interface GridConfig {
  label: string;
  path: string;
  numberOfColumns: number;
  numberOfRows: number;
  boxThresholds: BoxThreshold[];
  boxGroupThresholds: BoxGroupThreshold[];
}

const gridConfigs: GridConfig[] = [
  {
    label: "9-Box",
    path: "/",
    numberOfColumns: 3,
    numberOfRows: 3,
    boxThresholds: [],
    boxGroupThresholds: [
      // Boxes in the top-right elbow (high performance × high agility)
      { boxes: [7, 8, 9], max: 0.33 },
    ],
  },
  {
    label: "1-3 Rating",
    path: "/1-3",
    numberOfColumns: 3,
    numberOfRows: 1,
    boxThresholds: [],
    boxGroupThresholds: [{ boxes: [3], max: 0.33 }],
  },
  {
    label: "1-5 Rating",
    path: "/1-5",
    numberOfColumns: 5,
    numberOfRows: 1,
    boxThresholds: [
      { box: 1, min: 0.03, max: 0.05 },
      { box: 2, min: 0.05, max: 0.07 },
      { box: 3, min: 0.5, max: 0.6 },
      { box: 4, min: 0.2, max: 0.3 },
      { box: 5, min: 0.05, max: 0.1 },
    ],
    boxGroupThresholds: [],
  },
];

export default gridConfigs;

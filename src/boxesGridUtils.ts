export const getBoxLayout = (numberOfColumns: number, numberOfRows: number) => {
  const layout: number[] = [];
  for (let row = numberOfRows - 1; row >= 0; row--) {
    for (let col = 0; col < numberOfColumns; col++) {
      layout.push(row * numberOfColumns + col + 1);
    }
  }
  return layout;
};

export const getBoxScore = (boxNumber: number, numberOfColumns: number) => {
  const col = (boxNumber - 1) % numberOfColumns;
  const row = Math.floor((boxNumber - 1) / numberOfColumns);
  return col + row;
};

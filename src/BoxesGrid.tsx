import EmployeeCard from "./EmployeeCard";
import Box from "./Box";
import type { Employee } from "./useEmployees";
import type { GridConfig } from "./config";
import "./BoxesGrid.css";

interface BoxesGridProps {
  filteredEmployees: Employee[];
  onDropEmployee: (employeeId: number, boxNumber: number | null) => void;
  config: GridConfig;
}

export const getBoxLayout = (numberOfColumns: number, numberOfRows: number) => {
  const layout: number[] = [];
  for (let row = numberOfRows - 1; row >= 0; row--) {
    for (let col = 0; col < numberOfColumns; col++) {
      layout.push(row * numberOfColumns + col + 1);
    }
  }
  return layout;
};

export const getBoxScore = (
  boxNumber: number,
  numberOfColumns: number
) => {
  const col = (boxNumber - 1) % numberOfColumns;
  const row = Math.floor((boxNumber - 1) / numberOfColumns);
  return col + row;
};

const BoxesGrid = ({
  filteredEmployees,
  onDropEmployee,
  config,
}: BoxesGridProps) => {
  const { numberOfColumns, numberOfRows, boxThresholds, boxGroupThresholds } =
    config;
  const boxLayout = getBoxLayout(numberOfColumns, numberOfRows);
  const totalFilteredEmployees = filteredEmployees.length;

  const boxCounts =
    totalFilteredEmployees === 0
      ? {}
      : filteredEmployees.reduce((acc, emp) => {
          if (emp.box) {
            acc[emp.box] = (acc[emp.box] || 0) + 1;
          }
          return acc;
        }, {} as Record<number, number>);

  const calculateGroupRatio = (groupBoxes: number[]) => {
    if (totalFilteredEmployees === 0) return 0;
    const groupCount = filteredEmployees.filter(
      (emp) => emp.box && groupBoxes.includes(emp.box)
    ).length;
    return groupCount / totalFilteredEmployees;
  };

  const boxGroupThresholdChecks = boxGroupThresholds.map((group) => ({
    boxes: group.boxes,
    outOfRange:
      (group.min !== undefined && calculateGroupRatio(group.boxes) < group.min) ||
      (group.max !== undefined && calculateGroupRatio(group.boxes) > group.max),
  }));

  const maxScore = numberOfColumns - 1 + numberOfRows - 1;

  return (
    <section>
      <div
        className="box-grid-container"
        style={{
          gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
          gridTemplateRows: `repeat(${numberOfRows}, 1fr)`,
        }}
      >
        {boxLayout.map((boxNumber) => {
          const count = boxCounts[boxNumber] ?? 0;
          const ratio =
            totalFilteredEmployees > 0 ? count / totalFilteredEmployees : 0;
          const score = getBoxScore(boxNumber, numberOfColumns);
          return (
            <Box
              key={boxNumber}
              boxNumber={boxNumber}
              onDropEmployee={onDropEmployee}
              ratio={ratio}
              count={count}
              threshold={boxThresholds.find((t) => t.box === boxNumber)}
              hasReachedGroupThreshold={boxGroupThresholdChecks.some(
                (group) => group.boxes.includes(boxNumber) && group.outOfRange
              )}
              score={score}
              maxScore={maxScore}
            >
              {filteredEmployees
                .filter((employee) => employee.box === boxNumber)
                .map((employee) => (
                  <EmployeeCard key={employee.id} employee={employee} />
                ))}
            </Box>
          );
        })}
      </div>
    </section>
  );
};

export default BoxesGrid;

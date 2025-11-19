import EmployeeCard from "./EmployeeCard";
import Box from "./Box";
import { box3Thresholds, box3GroupThresholds } from "./config";
import type { Employee } from "./useEmployees";
import "./Boxes3.css";

interface Boxes3Props {
  filteredEmployees: Employee[];
  onDropEmployee: (employeeId: number, boxNumber: number | null) => void;
}

const boxLayout = [1, 2, 3];

const Boxes3 = ({ filteredEmployees, onDropEmployee }: Boxes3Props) => {
  const totalFilteredEmployees = filteredEmployees.length;

  if (totalFilteredEmployees === 0) {
    return (
      <section>
        <div className="box3-grid-container">
          {boxLayout.map((boxNumber) => (
            <Box
              key={boxNumber}
              boxNumber={boxNumber}
              onDropEmployee={onDropEmployee}
              ratio={0}
              count={0}
              threshold={box3Thresholds.find((box) => box.box === boxNumber)}
              hasReachedGroupThreshold={false}
              children={null}
            />
          ))}
        </div>
      </section>
    );
  }

  const boxCounts = filteredEmployees.reduce((acc, emp) => {
    if (emp.box) {
      acc[emp.box] = (acc[emp.box] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  const boxRatios = Object.entries(boxCounts).map(([boxNumber, count]) => ({
    boxNumber: Number(boxNumber),
    ratio: count / totalFilteredEmployees,
  }));

  const calculateGroupRatio = (groupBoxes: number[]) => {
    const groupCount = filteredEmployees.filter(
      (emp) => emp.box && groupBoxes.includes(emp.box)
    ).length;
    return groupCount / totalFilteredEmployees;
  };

  const boxGroupThresholdChecks: {
    boxes: number[];
    outOfRange: boolean;
  }[] = box3GroupThresholds.map((group) => ({
    boxes: group.boxes,
    outOfRange:
      (group.min !== undefined &&
        calculateGroupRatio(group.boxes) < group.min) ||
      (group.max !== undefined && calculateGroupRatio(group.boxes) > group.max),
  }));

  return (
    <section>
      <div className="box3-grid-container">
        {boxLayout.map((boxNumber) => (
          <Box
            key={boxNumber}
            boxNumber={boxNumber}
            onDropEmployee={onDropEmployee}
            ratio={
              boxRatios.find((box) => box.boxNumber === boxNumber)?.ratio ?? 0
            }
            count={boxCounts[boxNumber] ?? 0}
            threshold={box3Thresholds.find((box) => box.box === boxNumber)}
            hasReachedGroupThreshold={boxGroupThresholdChecks.some(
              (group) => group.boxes.includes(boxNumber) && group.outOfRange
            )}
          >
            {filteredEmployees
              .filter((employee) => employee.box === boxNumber)
              .map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
          </Box>
        ))}
      </div>
    </section>
  );
};

export default Boxes3;

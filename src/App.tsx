import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { jStat } from "jstat";

import "./App.css";

import employeeData from "./employees";
import classNames from "classnames";

const enrichedEmployeeData = employeeData.map((employee, employeeIndex) => ({
  id: employeeIndex,
  ...employee,
  box: null,
}));

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

interface Employee {
  id: number;
  name: string;
  jobLevel: number;
  gender: number; // 1 for male, 0 for non-male
  ethnicity: number; // 1 for local, 0 for non-local
  box: number | null; // Box number (1-9), null if not placed yet
  team: string;
}

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const [, drag] = useDrag(() => ({
    type: "EMPLOYEE",
    item: { id: employee.id },
  }));

  return (
    <div ref={drag} className="employee-card">
      {employee.name}
    </div>
  );
};

interface BoxProps {
  boxNumber: number;
  handleDrop: (employeeId: number, boxNumber: number) => void;
  children: React.ReactNode;
  ratio: number;
  threshold?: { min?: number; max?: number };
  hasReachedGroupThreshold: boolean;
}

const Box = ({
  boxNumber,
  handleDrop,
  children,
  ratio,
  threshold,
  hasReachedGroupThreshold,
}: BoxProps) => {
  const [, drop] = useDrop(() => ({
    accept: "EMPLOYEE",
    drop: (employee: Employee) => handleDrop(employee.id, boxNumber),
  }));

  return (
    <div
      ref={drop}
      className={classNames("box", `box-${boxNumber}`, {
        "out-of-range":
          (threshold?.min && ratio < threshold?.min) ||
          (threshold?.max && ratio > threshold?.max) ||
          hasReachedGroupThreshold,
      })}
    >
      <header>
        <div>Box {boxNumber}</div>
        <div className="ratio">{(ratio * 100).toFixed(0)}%</div>
      </header>
      <div className="box-contents">{children}</div>
    </div>
  );
};

interface UnplottedProps {
  employees: Employee[];
  handleDrop: (employeeId: number, boxNumber: number | null) => void;
}

const Unplotted = ({ employees, handleDrop }: UnplottedProps) => {
  const [, dropBack] = useDrop(() => ({
    accept: "EMPLOYEE",
    drop: (employee: Employee) => handleDrop(employee.id, null),
  }));

  return (
    <section className="unplotted" ref={dropBack}>
      <header>Unplotted</header>
      <div className="unplotted-contents">
        {employees
          .filter((employee) => employee.box === null)
          .map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
      </div>
    </section>
  );
};

interface BiasProps {
  title: string;
  correlation: number;
  pValue: number;
}

const Bias = ({ title, correlation, pValue }: BiasProps) => {
  const isSignificant = !isNaN(pValue) && pValue < 0.05;
  const isInsignificant = !isNaN(pValue) && pValue >= 0.05;

  return (
    <div
      className={classNames("bias", {
        significant: isSignificant,
        insignificant: isInsignificant,
      })}
    >
      <p className="title">{title}</p>
      {isNaN(correlation) ? (
        <p>Not enough data</p>
      ) : (
        <>
          <p>{isSignificant ? "Significant" : "Insignificant"}</p>
          <p>
            C = {correlation.toFixed(2)}, p = {pValue.toFixed(4)}
          </p>
        </>
      )}
    </div>
  );
};

const App = () => {
  const [employees, setEmployees] = useState<Employee[]>(enrichedEmployeeData);

  const handleDrop = (employeeId: number, boxNumber: number | null) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === employeeId ? { ...employee, box: boxNumber } : employee
      )
    );
  };

  const teams = Array.from(new Set(employees.map((emp) => emp.team)));

  const [teamFilters, setTeamFilters] = useState<Record<string, boolean>>(
    () => {
      const initialFilters: Record<string, boolean> = {};
      teams.forEach((team) => {
        initialFilters[team] = true; // All teams are on by default
      });
      return initialFilters;
    }
  );

  const handleTeamToggle = (team: string) => {
    setTeamFilters((prevFilters) => ({
      ...prevFilters,
      [team]: !prevFilters[team],
    }));
  };

  // Calculate box ratios
  const filteredEmployees = employees.filter((emp) => teamFilters[emp.team]);
  const totalFilteredEmployees = filteredEmployees.length;

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

  const topRightElbow = [6, 8, 9];
  const bottomLeftElbow = [1, 2, 4];
  const mainDiagonal = [3, 5, 7];

  const topRightElbowRatio = calculateGroupRatio(topRightElbow);
  const bottomLeftElbowRatio = calculateGroupRatio(bottomLeftElbow);
  const mainDiagonalRatio = calculateGroupRatio(mainDiagonal);

  const boxScores = [
    { box: 1, performance: 0, agility: 0 },
    { box: 2, performance: 1, agility: 0 },
    { box: 3, performance: 2, agility: 0 },
    { box: 4, performance: 0, agility: 1 },
    { box: 5, performance: 1, agility: 1 },
    { box: 6, performance: 2, agility: 1 },
    { box: 7, performance: 0, agility: 2 },
    { box: 8, performance: 1, agility: 2 },
    { box: 9, performance: 2, agility: 2 },
  ];

  const boxThresholds: { box: number; min?: number; max?: number }[] = [
    { box: 9, max: 0.2 },
  ];

  const boxGroupThresholds: {
    boxes: number[];
    outOfRange: boolean;
  }[] = [
    { boxes: topRightElbow, outOfRange: topRightElbowRatio > 0.35 },
    { boxes: bottomLeftElbow, outOfRange: bottomLeftElbowRatio < 0 },
    { boxes: mainDiagonal, outOfRange: mainDiagonalRatio < 0 },
  ];

  const employeesWithScores = filteredEmployees
    .filter((emp) => emp.box)
    .map((emp) => {
      const scores = boxScores.find((score) => score.box === emp.box)!;
      return {
        ...emp,
        placementScore: scores.performance + scores.agility,
      };
    });

  const jobLevelData = employeesWithScores.map((emp) => ({
    x: emp.placementScore,
    y: emp.jobLevel,
  }));

  const jobLevelCorrelation = calculateCorrelationWithPValue(jobLevelData);

  const genderData = employeesWithScores.map((emp) => ({
    x: emp.placementScore,
    y: emp.gender,
  }));

  const genderCorrelation = calculateCorrelationWithPValue(genderData);

  const ethnicityData = employeesWithScores.map((emp) => ({
    x: emp.placementScore,
    y: emp.ethnicity,
  }));

  const ethnicityCorrelation = calculateCorrelationWithPValue(ethnicityData);

  return (
    <DndProvider backend={HTML5Backend}>
      <section>
        <div className="team-filters">
          {teams.map((team) => (
            <label key={team}>
              <input
                type="checkbox"
                checked={teamFilters[team]}
                onChange={() => handleTeamToggle(team)}
              />
              {team}
            </label>
          ))}
        </div>
      </section>
      <section>
        <div className="grid-container">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((boxNumber) => (
            <Box
              key={boxNumber}
              boxNumber={boxNumber}
              handleDrop={handleDrop}
              ratio={
                boxRatios.find((box) => box.boxNumber === boxNumber)?.ratio ?? 0
              }
              threshold={boxThresholds.find((box) => box.box === boxNumber)}
              hasReachedGroupThreshold={boxGroupThresholds.some(
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
      <Unplotted employees={filteredEmployees} handleDrop={handleDrop} />
      <section className="biases">
        <header>Biases</header>
        <div className="biases-contents">
          <Bias title="Job level bias" {...jobLevelCorrelation} />
          <Bias title="Gender bias" {...genderCorrelation} />
          <Bias title="Ethnicity bias" {...ethnicityCorrelation} />
        </div>
      </section>
    </DndProvider>
  );
};

export default App;

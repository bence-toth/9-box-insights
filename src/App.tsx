import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";

import employeeData from "./employees.example";

const enrichedEmployeeData = employeeData.map((employee, employeeIndex) => ({
  id: employeeIndex,
  ...employee,
  box: null,
}));

const calculateCorrelation = (data: { x: number; y: number }[]): number => {
  const n = data.length;
  const sumX = data.reduce((sum, val) => sum + val.x, 0);
  const sumY = data.reduce((sum, val) => sum + val.y, 0);
  const sumXY = data.reduce((sum, val) => sum + val.x * val.y, 0);
  const sumX2 = data.reduce((sum, val) => sum + val.x * val.x, 0);
  const sumY2 = data.reduce((sum, val) => sum + val.y * val.y, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  );

  return denominator ? numerator / denominator : 0;
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
}

const Box = ({ boxNumber, handleDrop, children, ratio }: BoxProps) => {
  const [, drop] = useDrop(() => ({
    accept: "EMPLOYEE",
    drop: (employee: Employee) => handleDrop(employee.id, boxNumber),
  }));

  return (
    <div ref={drop} className="box">
      <p>Box {boxNumber}</p>
      <div>{ratio}</div>
      {children}
    </div>
  );
};

const App = () => {
  const [employees, setEmployees] = useState<Employee[]>(enrichedEmployeeData);

  const handleDrop = (employeeId: number, boxNumber: number) => {
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

  // Calculate box group ratios:
  const topRightElbow = [6, 8, 9];
  const bottomLeftElbow = [1, 2, 4];
  const mainDiagonal = [3, 5, 7];

  const calculateGroupRatio = (groupBoxes: number[]) => {
    const groupCount = employees.filter(
      (emp) => emp.box && groupBoxes.includes(emp.box)
    ).length;
    return groupCount / totalFilteredEmployees;
  };

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

  const jobLevelCorrelation = calculateCorrelation(jobLevelData);

  const genderData = employeesWithScores.map((emp) => ({
    x: emp.placementScore,
    y: emp.gender,
  }));

  const genderCorrelation = calculateCorrelation(genderData);

  const ethnicityData = employeesWithScores.map((emp) => ({
    x: emp.placementScore,
    y: emp.ethnicity,
  }));

  const ethnicityCorrelation = calculateCorrelation(ethnicityData);

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
        <h2>Plotted</h2>
        <div className="grid-container">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((boxNumber) => (
            <Box
              key={boxNumber}
              boxNumber={boxNumber}
              handleDrop={handleDrop}
              ratio={
                boxRatios.find((box) => box.boxNumber === boxNumber)?.ratio ?? 0
              }
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
      <section>
        <h2>Unplotted:</h2>
        <div>
          {filteredEmployees
            .filter((employee) => employee.box === null)
            .map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
        </div>
      </section>
      <section>
        <h2>Calculations:</h2>
        <p>Top right elbow: {topRightElbowRatio}</p>
        <p>Bottom left elbow: {bottomLeftElbowRatio}</p>
        <p>Main diagonal: {mainDiagonalRatio}</p>
        <p>Job level correlation: {jobLevelCorrelation}</p>
        <p>Gender correlation: {genderCorrelation}</p>
        <p>Ethnicity correlation: {ethnicityCorrelation}</p>
      </section>
    </DndProvider>
  );
};

export default App;

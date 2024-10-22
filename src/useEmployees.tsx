import { useState } from "react";
import employeeData from "./employees";

const enrichedEmployeeData = employeeData.map((employee, employeeIndex) => ({
  id: employeeIndex,
  ...employee,
  box: null,
}));

export interface Employee {
  id: number;
  name: string;
  jobLevel: number;
  gender: number; // 1 for male, 0 for non-male
  ethnicity: number; // 1 for European, 0 for non-European
  box: number | null; // box number (1-9), null if not unplotted
  team: string;
}

const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>(enrichedEmployeeData);

  const onDropEmployee = (employeeId: number, boxNumber: number | null) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === employeeId ? { ...employee, box: boxNumber } : employee
      )
    );
  };

  return { employees, onDropEmployee };
};

export default useEmployees;

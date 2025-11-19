import { useState, useCallback } from "react";
import employeeData from "./employees";

import type { EmployeeData } from "./employees";

const enrichedEmployeeData = employeeData
  .sort((a: EmployeeData, b: EmployeeData) => a.name.localeCompare(b.name))
  .map((employee: EmployeeData, employeeIndex: number) => ({
    id: employeeIndex,
    box: null,
    ...employee,
  }));

export interface Employee {
  id: number;
  name: string;
  jobLevel: number;
  gender: number;
  ethnicity: number;
  box: number | null;
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

  const unplotAllEmployees = useCallback(() => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) => ({ ...employee, box: null }))
    );
  }, []);

  return { employees, onDropEmployee, unplotAllEmployees };
};

export default useEmployees;

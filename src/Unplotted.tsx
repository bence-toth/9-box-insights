import { useDrop } from "react-dnd";
import EmployeeCard from "./EmployeeCard";
import type { Employee } from "./useEmployees";
import "./Unplotted.css";

interface UnplottedProps {
  employees: Employee[];
  onDropEmployee: (employeeId: number, boxNumber: number | null) => void;
}

const Unplotted = ({ employees, onDropEmployee }: UnplottedProps) => {
  const [, dropBack] = useDrop(() => ({
    accept: "EMPLOYEE",
    drop: (employee: Employee) => onDropEmployee(employee.id, null),
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

export default Unplotted;

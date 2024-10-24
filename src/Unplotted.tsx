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

  const unplottedEmployees = employees.filter(
    (employee) => employee.box === null
  );

  const ratio = unplottedEmployees.length / employees.length;

  return (
    <section className="unplotted" ref={dropBack}>
      <header>
        <div>Unplotted</div>
        <div>
          {unplottedEmployees.length} ppl, {(ratio * 100).toFixed(0)}%
        </div>
      </header>
      <div className="unplotted-contents">
        {unplottedEmployees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
    </section>
  );
};

export default Unplotted;

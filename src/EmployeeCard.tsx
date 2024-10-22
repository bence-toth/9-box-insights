import { useDrag } from "react-dnd";
import type { Employee } from "./useEmployees";
import "./EmployeeCard.css";

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

export default EmployeeCard;

import classNames from "classnames";
import { useDrop } from "react-dnd";
import "./Box.css";
import type { Employee } from "./useEmployees";

interface BoxProps {
  boxNumber: number;
  onDropEmployee: (employeeId: number, boxNumber: number) => void;
  children: React.ReactNode;
  ratio: number;
  threshold?: { min?: number; max?: number };
  hasReachedGroupThreshold: boolean;
}

const Box = ({
  boxNumber,
  onDropEmployee,
  children,
  ratio,
  threshold,
  hasReachedGroupThreshold,
}: BoxProps) => {
  const [, drop] = useDrop(() => ({
    accept: "EMPLOYEE",
    drop: (employee: Employee) => onDropEmployee(employee.id, boxNumber),
  }));

  const hasReachedBoxThreshold =
    (threshold?.min && ratio < threshold?.min) ||
    (threshold?.max && ratio > threshold?.max);

  return (
    <div
      ref={drop}
      className={classNames("box", `box-${boxNumber}`, {
        "out-of-range": hasReachedBoxThreshold || hasReachedGroupThreshold,
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

export default Box;

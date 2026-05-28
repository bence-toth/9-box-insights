import classNames from "classnames";
import { useDrop } from "react-dnd";
import "./Box.css";
import type { Employee } from "./useEmployees";

interface BoxProps {
  boxNumber: number;
  onDropEmployee: (employeeId: number, boxNumber: number) => void;
  children: React.ReactNode;
  ratio: number;
  count: number;
  threshold?: { min?: number; max?: number };
  hasReachedGroupThreshold: boolean;
  score: number;
  maxScore: number;
}

const Box = ({
  boxNumber,
  onDropEmployee,
  children,
  ratio,
  count,
  threshold,
  hasReachedGroupThreshold,
  score,
  maxScore,
}: BoxProps) => {
  const [, drop] = useDrop(() => ({
    accept: "EMPLOYEE",
    drop: (employee: Employee) => onDropEmployee(employee.id, boxNumber),
  }));

  const hasReachedBoxThreshold =
    (threshold?.min && ratio < threshold?.min) ||
    (threshold?.max && ratio > threshold?.max);

  // Map score to a 0-4 bucket for consistent coloring across all grid sizes
  const colorBucket =
    maxScore === 0 ? 2 : Math.round((score / maxScore) * 4);

  return (
    <div
      ref={drop}
      className={classNames("box", `placement-score-${colorBucket}`, {
        "out-of-range": hasReachedBoxThreshold || hasReachedGroupThreshold,
      })}
    >
      <header>
        <div>Box {boxNumber}</div>
        <div className="ratio">
          {count} ppl, {(ratio * 100).toFixed(0)}%
        </div>
      </header>
      <div className="box-contents">{children}</div>
    </div>
  );
};

export default Box;

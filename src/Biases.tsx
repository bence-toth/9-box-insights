import Bias from "./Bias";
import { calculateCorrelationWithPValue } from "./utility";
import type { Employee } from "./useEmployees";
import "./Biases.css";

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

interface BiasesProps {
  filteredEmployees: Employee[];
}

const Biases = ({ filteredEmployees }: BiasesProps) => {
  const employeesWithScores = filteredEmployees
    .filter((employee) => employee.box)
    .map((employee) => {
      const scores = boxScores.find((score) => score.box === employee.box)!;
      return {
        ...employee,
        placementScore: scores.performance + scores.agility,
      };
    });

  const jobLevelData = employeesWithScores.map((employee) => ({
    x: employee.placementScore,
    y: employee.jobLevel,
  }));
  const jobLevelCorrelation = calculateCorrelationWithPValue(jobLevelData);

  const genderData = employeesWithScores.map((employee) => ({
    x: employee.placementScore,
    y: employee.gender,
  }));
  const genderCorrelation = calculateCorrelationWithPValue(genderData);

  const ethnicityData = employeesWithScores.map((employee) => ({
    x: employee.placementScore,
    y: employee.ethnicity,
  }));
  const ethnicityCorrelation = calculateCorrelationWithPValue(ethnicityData);

  return (
    <section className="biases">
      <header>Biases</header>
      <div className="biases-contents">
        <Bias title="Job level bias" {...jobLevelCorrelation} />
        <Bias title="Gender bias" {...genderCorrelation} />
        <Bias title="Ethnicity bias" {...ethnicityCorrelation} />
      </div>
    </section>
  );
};

export default Biases;

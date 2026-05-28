import Bias from "./Bias";
import { calculateCorrelationWithPValue } from "./utility";
import { getBoxScore } from "./BoxesGrid";
import type { Employee } from "./useEmployees";
import type { GridConfig } from "./config";
import "./Biases.css";

interface BiasesProps {
  filteredEmployees: Employee[];
  config: GridConfig;
}

const Biases = ({ filteredEmployees, config }: BiasesProps) => {
  const employeesWithScores = filteredEmployees
    .filter((employee) => employee.box)
    .map((employee) => ({
      ...employee,
      placementScore: getBoxScore(employee.box!, config.numberOfColumns),
    }));

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

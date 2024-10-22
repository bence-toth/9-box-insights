import classNames from "classnames";
import "./Bias.css";

interface BiasProps {
  title: string;
  correlation: number;
  pValue: number;
}

const Bias = ({ title, correlation, pValue }: BiasProps) => {
  const isSignificant = !isNaN(pValue) && pValue < 0.05;
  const isInsignificant = !isNaN(pValue) && pValue >= 0.05;

  return (
    <div
      className={classNames("bias", {
        significant: isSignificant,
        insignificant: isInsignificant,
      })}
    >
      <p className="title">{title}</p>
      {isNaN(correlation) ? (
        <p>Not enough data</p>
      ) : (
        <>
          <p>{isSignificant ? "Significant" : "Insignificant"}</p>
          <p>
            C = {correlation.toFixed(2)}, p = {pValue.toFixed(4)}
          </p>
        </>
      )}
    </div>
  );
};

export default Bias;

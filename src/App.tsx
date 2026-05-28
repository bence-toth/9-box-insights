import classNames from "classnames";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import TeamFilters from "./TeamFilters";
import Biases from "./Biases";
import BoxesGrid from "./BoxesGrid";
import Unplotted from "./Unplotted";
import useEmployees from "./useEmployees";
import useTeams from "./useTeams";
import gridConfigs from "./config";
import "./App.css";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="nav">
      {gridConfigs.map((config) => (
        <Link
          key={config.path}
          to={config.path}
          className={classNames("nav-link", {
            active: location.pathname === config.path,
          })}
        >
          {config.label}
        </Link>
      ))}
    </nav>
  );
};

const App = () => {
  const { employees, onDropEmployee, unplotAllEmployees } = useEmployees();
  const { teams, teamFilters, onToggleTeam, filteredEmployees } = useTeams({
    employees,
  });
  const location = useLocation();

  useEffect(() => {
    unplotAllEmployees();
  }, [location.pathname, unplotAllEmployees]);

  const activeConfig =
    gridConfigs.find((c) => c.path === location.pathname) ?? gridConfigs[0];

  return (
    <DndProvider backend={HTML5Backend}>
      <Navigation />
      <TeamFilters
        teams={teams}
        teamFilters={teamFilters}
        onToggleTeam={onToggleTeam}
      />
      <Routes>
        {gridConfigs.map((config) => (
          <Route
            key={config.path}
            path={config.path}
            element={
              <BoxesGrid
                filteredEmployees={filteredEmployees}
                onDropEmployee={onDropEmployee}
                config={config}
              />
            }
          />
        ))}
      </Routes>
      <Unplotted
        employees={filteredEmployees}
        onDropEmployee={onDropEmployee}
      />
      <Biases filteredEmployees={filteredEmployees} config={activeConfig} />
    </DndProvider>
  );
};

export default App;

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import TeamFilters from "./TeamFilters";
import Biases from "./Biases";
import Boxes from "./Boxes";
import Boxes3 from "./Boxes3";
import Unplotted from "./Unplotted";
import useEmployees from "./useEmployees";
import useTeams from "./useTeams";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav
      style={{
        padding: "16px",
        backgroundColor: "#f0f0f0",
        borderBottom: "2px solid #ddd",
        marginBottom: "16px",
      }}
    >
      <Link
        to="/"
        style={{
          marginRight: "16px",
          padding: "8px 16px",
          textDecoration: "none",
          backgroundColor: location.pathname === "/" ? "#007acc" : "#fff",
          color: location.pathname === "/" ? "#fff" : "#007acc",
          borderRadius: "4px",
          border: "1px solid #007acc",
        }}
      >
        9-Box View
      </Link>
      <Link
        to="/3-box"
        style={{
          padding: "8px 16px",
          textDecoration: "none",
          backgroundColor: location.pathname === "/3-box" ? "#007acc" : "#fff",
          color: location.pathname === "/3-box" ? "#fff" : "#007acc",
          borderRadius: "4px",
          border: "1px solid #007acc",
        }}
      >
        3-Box View
      </Link>
    </nav>
  );
};

const AppContent = () => {
  const { employees, onDropEmployee, unplotAllEmployees } = useEmployees();
  const { teams, teamFilters, onToggleTeam, filteredEmployees } = useTeams({
    employees,
  });
  const location = useLocation();

  useEffect(() => {
    unplotAllEmployees();
  }, [location.pathname, unplotAllEmployees]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Navigation />
      <TeamFilters
        teams={teams}
        teamFilters={teamFilters}
        onToggleTeam={onToggleTeam}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Boxes
              filteredEmployees={filteredEmployees}
              onDropEmployee={onDropEmployee}
            />
          }
        />
        <Route
          path="/3-box"
          element={
            <Boxes3
              filteredEmployees={filteredEmployees}
              onDropEmployee={onDropEmployee}
            />
          }
        />
      </Routes>
      <Unplotted
        employees={filteredEmployees}
        onDropEmployee={onDropEmployee}
      />
      <Biases filteredEmployees={filteredEmployees} />
    </DndProvider>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TeamFilters from "./TeamFilters";
import Biases from "./Biases";
import Boxes from "./Boxes";
import Unplotted from "./Unplotted";
import useEmployees from "./useEmployees";
import useTeams from "./useTeams";

const App = () => {
  const { employees, onDropEmployee } = useEmployees();
  const { teams, teamFilters, onToggleTeam, filteredEmployees } = useTeams({
    employees,
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <TeamFilters
        teams={teams}
        teamFilters={teamFilters}
        onToggleTeam={onToggleTeam}
      />
      <Boxes
        filteredEmployees={filteredEmployees}
        onDropEmployee={onDropEmployee}
      />
      <Unplotted
        employees={filteredEmployees}
        onDropEmployee={onDropEmployee}
      />
      <Biases filteredEmployees={filteredEmployees} />
    </DndProvider>
  );
};

export default App;

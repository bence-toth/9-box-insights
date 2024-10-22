import { useState } from "react";
import type { Employee } from "./useEmployees";

interface UseTeamsParams {
  employees: Employee[];
}

const useTeams = ({ employees }: UseTeamsParams) => {
  const teams = Array.from(new Set(employees.map((employee) => employee.team)));

  const [teamFilters, setTeamFilters] = useState<Record<string, boolean>>(
    () => {
      const initialFilters: Record<string, boolean> = {};
      teams.forEach((team) => {
        initialFilters[team] = true; // All teams are on by default
      });
      return initialFilters;
    }
  );

  const onToggleTeam = (team: string) => {
    setTeamFilters((prevFilters) => ({
      ...prevFilters,
      [team]: !prevFilters[team],
    }));
  };

  const filteredEmployees = employees.filter(
    (employee) => teamFilters[employee.team]
  );

  return { teams, teamFilters, onToggleTeam, filteredEmployees };
};

export default useTeams;

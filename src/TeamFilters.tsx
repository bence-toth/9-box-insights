import "./TeamFilters.css";

interface TeamFiltersProps {
  teams: string[];
  teamFilters: Record<string, boolean>;
  onToggleTeam: (team: string) => void;
}

const TeamFilters = ({
  teams,
  teamFilters,
  onToggleTeam,
}: TeamFiltersProps) => (
  <section>
    <div className="team-filters">
      {teams.map((team) => (
        <label key={team}>
          <input
            type="checkbox"
            checked={teamFilters[team]}
            onChange={() => onToggleTeam(team)}
          />
          {team}
        </label>
      ))}
    </div>
  </section>
);

export default TeamFilters;

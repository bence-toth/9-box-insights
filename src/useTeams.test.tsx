import { renderHook, act } from "@testing-library/react";
import useTeams from "./useTeams";
import type { Employee } from "./useEmployees";

// Test data constants
const ARYA_STARK = "Arya Stark";
const NED_STARK = "Ned Stark";
const TYRION_LANNISTER = "Tyrion Lannister";
const JON_SNOW = "Jon Snow";
const SANSA_STARK = "Sansa Stark";
const HOUSE_STARK = "House Stark";
const HOUSE_LANNISTER = "House Lannister";
const NIGHTS_WATCH = "Night's Watch";
const HOUSE_TARGARYEN = "House Targaryen";

describe("useTeams", () => {
  const mockEmployees: Employee[] = [
    {
      id: 0,
      name: ARYA_STARK,
      team: HOUSE_STARK,
      jobLevel: 5,
      gender: 0,
      ethnicity: 1,
      box: null,
    },
    {
      id: 1,
      name: NED_STARK,
      team: HOUSE_STARK,
      jobLevel: 3,
      gender: 1,
      ethnicity: 1,
      box: 5,
    },
    {
      id: 2,
      name: TYRION_LANNISTER,
      team: HOUSE_LANNISTER,
      jobLevel: 5,
      gender: 1,
      ethnicity: 1,
      box: null,
    },
    {
      id: 3,
      name: JON_SNOW,
      team: NIGHTS_WATCH,
      jobLevel: 5,
      gender: 1,
      ethnicity: 0,
      box: 3,
    },
    {
      id: 4,
      name: SANSA_STARK,
      team: HOUSE_STARK,
      jobLevel: 4,
      gender: 0,
      ethnicity: 1,
      box: null,
    },
  ];

  describe("Initial state", () => {
    it("should extract unique teams from employees", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      expect(result.current.teams).toHaveLength(3);
      expect(result.current.teams).toContain(HOUSE_STARK);
      expect(result.current.teams).toContain(HOUSE_LANNISTER);
      expect(result.current.teams).toContain(NIGHTS_WATCH);
    });

    it("should handle empty employees array", () => {
      const { result } = renderHook(() => useTeams({ employees: [] }));

      expect(result.current.teams).toHaveLength(0);
      expect(result.current.filteredEmployees).toHaveLength(0);
    });

    it("should initialize all team filters to true", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      expect(result.current.teamFilters[HOUSE_STARK]).toBe(true);
      expect(result.current.teamFilters[HOUSE_LANNISTER]).toBe(true);
      expect(result.current.teamFilters[NIGHTS_WATCH]).toBe(true);
    });

    it("should return all employees when all filters are enabled", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      expect(result.current.filteredEmployees).toHaveLength(5);
    });

    it("should handle single employee", () => {
      const singleEmployee = [mockEmployees[0]];
      const { result } = renderHook(() =>
        useTeams({ employees: singleEmployee })
      );

      expect(result.current.teams).toHaveLength(1);
      expect(result.current.teams).toContain(HOUSE_STARK);
      expect(result.current.filteredEmployees).toHaveLength(1);
    });

    it("should handle employees all from the same team", () => {
      const sameTeamEmployees = mockEmployees.map((emp) => ({
        ...emp,
        team: HOUSE_STARK,
      }));
      const { result } = renderHook(() =>
        useTeams({ employees: sameTeamEmployees })
      );

      expect(result.current.teams).toHaveLength(1);
      expect(result.current.teams).toContain(HOUSE_STARK);
      expect(result.current.filteredEmployees).toHaveLength(5);
    });
  });

  describe("onToggleTeam", () => {
    it("should toggle team filter from true to false", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      expect(result.current.teamFilters[HOUSE_STARK]).toBe(true);

      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
      });

      expect(result.current.teamFilters[HOUSE_STARK]).toBe(false);
    });

    it("should toggle team filter from false to true", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      // First toggle off
      act(() => {
        result.current.onToggleTeam(HOUSE_LANNISTER);
      });

      expect(result.current.teamFilters[HOUSE_LANNISTER]).toBe(false);

      // Then toggle back on
      act(() => {
        result.current.onToggleTeam(HOUSE_LANNISTER);
      });

      expect(result.current.teamFilters[HOUSE_LANNISTER]).toBe(true);
    });

    it("should not affect other team filters when toggling one", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
      });

      expect(result.current.teamFilters[HOUSE_STARK]).toBe(false);
      expect(result.current.teamFilters[HOUSE_LANNISTER]).toBe(true);
      expect(result.current.teamFilters[NIGHTS_WATCH]).toBe(true);
    });

    it("should allow toggling multiple teams", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
        result.current.onToggleTeam(HOUSE_LANNISTER);
      });

      expect(result.current.teamFilters[HOUSE_STARK]).toBe(false);
      expect(result.current.teamFilters[HOUSE_LANNISTER]).toBe(false);
      expect(result.current.teamFilters[NIGHTS_WATCH]).toBe(true);
    });

    it("should handle toggling non-existent team gracefully", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      expect(() => {
        act(() => {
          result.current.onToggleTeam("NonExistentTeam");
        });
      }).not.toThrow();

      // When toggling a non-existent team (undefined -> !undefined = true)
      expect(result.current.teamFilters["NonExistentTeam"]).toBe(true);
    });

    it("should handle multiple sequential toggles of same team", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
      });
      expect(result.current.teamFilters[HOUSE_STARK]).toBe(false);

      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
      });
      expect(result.current.teamFilters[HOUSE_STARK]).toBe(true);

      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
      });
      expect(result.current.teamFilters[HOUSE_STARK]).toBe(false);
    });
  });

  describe("filteredEmployees", () => {
    it("should filter out employees from disabled teams", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
      });

      const filtered = result.current.filteredEmployees;
      expect(filtered).toHaveLength(2);
      expect(filtered.every((emp) => emp.team !== HOUSE_STARK)).toBe(true);
      expect(filtered.some((emp) => emp.team === HOUSE_LANNISTER)).toBe(true);
      expect(filtered.some((emp) => emp.team === NIGHTS_WATCH)).toBe(true);
    });

    it("should show only employees from enabled teams", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      // Disable all teams except House Stark
      act(() => {
        result.current.onToggleTeam(HOUSE_LANNISTER);
        result.current.onToggleTeam(NIGHTS_WATCH);
      });

      const filtered = result.current.filteredEmployees;
      expect(filtered).toHaveLength(3);
      expect(filtered.every((emp) => emp.team === HOUSE_STARK)).toBe(true);
    });

    it("should return empty array when all teams are disabled", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
        result.current.onToggleTeam(HOUSE_LANNISTER);
        result.current.onToggleTeam(NIGHTS_WATCH);
      });

      expect(result.current.filteredEmployees).toHaveLength(0);
    });

    it("should return all employees when all teams are enabled", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      // Disable and re-enable all teams
      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
        result.current.onToggleTeam(HOUSE_LANNISTER);
      });

      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
        result.current.onToggleTeam(HOUSE_LANNISTER);
      });

      expect(result.current.filteredEmployees).toHaveLength(5);
    });

    it("should update filtered employees immediately after toggle", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      expect(result.current.filteredEmployees).toHaveLength(5);

      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
      });

      expect(result.current.filteredEmployees).toHaveLength(2);
    });

    it("should preserve employee properties in filtered results", () => {
      const { result } = renderHook(() =>
        useTeams({ employees: mockEmployees })
      );

      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
        result.current.onToggleTeam(NIGHTS_WATCH);
      });

      const filtered = result.current.filteredEmployees;
      expect(filtered).toHaveLength(1);

      const lannisterEmployee = filtered[0];
      expect(lannisterEmployee.name).toBe("Tyrion Lannister");
      expect(lannisterEmployee.team).toBe(HOUSE_LANNISTER);
      expect(lannisterEmployee.jobLevel).toBe(5);
      expect(lannisterEmployee.gender).toBe(1);
      expect(lannisterEmployee.ethnicity).toBe(1);
      expect(lannisterEmployee.box).toBeNull();
    });
  });

  describe("Dynamic employee updates", () => {
    it("should update teams when employees prop changes", () => {
      const { result, rerender } = renderHook(
        ({ employees }) => useTeams({ employees }),
        { initialProps: { employees: mockEmployees } }
      );

      expect(result.current.teams).toHaveLength(3);

      const newEmployees = [
        ...mockEmployees,
        {
          id: 5,
          name: "Daenerys Targaryen",
          team: HOUSE_TARGARYEN,
          jobLevel: 5,
          gender: 0,
          ethnicity: 1,
          box: null,
        },
      ];

      rerender({ employees: newEmployees });

      expect(result.current.teams).toHaveLength(4);
      expect(result.current.teams).toContain(HOUSE_TARGARYEN);
    });

    it("should update filtered employees when employees prop changes", () => {
      const { result, rerender } = renderHook(
        ({ employees }) => useTeams({ employees }),
        { initialProps: { employees: mockEmployees } }
      );

      const starkCount = result.current.filteredEmployees.filter(
        (emp) => emp.team === HOUSE_STARK
      ).length;
      expect(starkCount).toBe(3);

      const newEmployees = mockEmployees.filter(
        (emp) => emp.team !== HOUSE_STARK
      );

      rerender({ employees: newEmployees });

      const newStarkCount = result.current.filteredEmployees.filter(
        (emp) => emp.team === HOUSE_STARK
      ).length;
      expect(newStarkCount).toBe(0);
    });

    it("should maintain filter state when employees prop changes", () => {
      const { result, rerender } = renderHook(
        ({ employees }) => useTeams({ employees }),
        { initialProps: { employees: mockEmployees } }
      );

      // Disable House Stark team
      act(() => {
        result.current.onToggleTeam(HOUSE_STARK);
      });

      expect(result.current.teamFilters[HOUSE_STARK]).toBe(false);

      // Update employees (add new employee to House Stark)
      const newEmployees = [
        ...mockEmployees,
        {
          id: 5,
          name: "Robb Stark",
          team: HOUSE_STARK,
          jobLevel: 3,
          gender: 1,
          ethnicity: 1,
          box: null,
        },
      ];

      rerender({ employees: newEmployees });

      // Filter should still be disabled
      expect(result.current.teamFilters[HOUSE_STARK]).toBe(false);
      // And new employee should not appear in filtered results
      expect(
        result.current.filteredEmployees.every(
          (emp) => emp.name !== "Robb Stark"
        )
      ).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle employees with undefined team", () => {
      const employeesWithUndefinedTeam = [
        {
          id: 0,
          name: "Test",
          team: undefined as any,
          jobLevel: 3,
          gender: 1,
          ethnicity: 1,
          box: null,
        },
      ];

      const { result } = renderHook(() =>
        useTeams({ employees: employeesWithUndefinedTeam })
      );

      expect(result.current.teams).toHaveLength(1);
      expect(result.current.teams).toContain(undefined);
    });

    it("should handle employees with empty string team", () => {
      const employeesWithEmptyTeam = [
        {
          id: 0,
          name: "Test",
          team: "",
          jobLevel: 3,
          gender: 1,
          ethnicity: 1,
          box: null,
        },
      ];

      const { result } = renderHook(() =>
        useTeams({ employees: employeesWithEmptyTeam })
      );

      expect(result.current.teams).toHaveLength(1);
      expect(result.current.teams).toContain("");
      expect(result.current.filteredEmployees).toHaveLength(1);
    });

    it("should handle duplicate team names correctly", () => {
      const employeesWithDuplicates = [
        { ...mockEmployees[0], team: HOUSE_STARK },
        { ...mockEmployees[1], team: HOUSE_STARK },
        { ...mockEmployees[2], team: HOUSE_STARK },
      ];

      const { result } = renderHook(() =>
        useTeams({ employees: employeesWithDuplicates })
      );

      expect(result.current.teams).toHaveLength(1);
      expect(result.current.filteredEmployees).toHaveLength(3);
    });

    it("should handle very long team names", () => {
      const longTeamName = "A".repeat(1000);
      const employeesWithLongTeam = [
        { ...mockEmployees[0], team: longTeamName },
      ];

      const { result } = renderHook(() =>
        useTeams({ employees: employeesWithLongTeam })
      );

      expect(result.current.teams).toHaveLength(1);
      expect(result.current.teams[0]).toBe(longTeamName);
      expect(result.current.filteredEmployees).toHaveLength(1);
    });

    it("should handle special characters in team names", () => {
      const specialTeamName = "Team-@#$%^&*()_+";
      const employeesWithSpecialTeam = [
        { ...mockEmployees[0], team: specialTeamName },
      ];

      const { result } = renderHook(() =>
        useTeams({ employees: employeesWithSpecialTeam })
      );

      expect(result.current.teams).toContain(specialTeamName);

      act(() => {
        result.current.onToggleTeam(specialTeamName);
      });

      expect(result.current.teamFilters[specialTeamName]).toBe(false);
    });
  });

  describe("Performance and stability", () => {
    it("should not recreate teams array unnecessarily", () => {
      const { result, rerender } = renderHook(
        ({ employees }) => useTeams({ employees }),
        { initialProps: { employees: mockEmployees } }
      );

      const firstTeams = result.current.teams;

      rerender({ employees: mockEmployees });

      const secondTeams = result.current.teams;

      // Arrays should have same content
      expect(firstTeams).toEqual(secondTeams);
    });

    it("should handle large number of employees efficiently", () => {
      const largeEmployeeList = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Employee ${i}`,
        team: `Team ${i % 10}`,
        jobLevel: (i % 5) + 1,
        gender: i % 2,
        ethnicity: i % 2,
        box: null,
      }));

      const { result } = renderHook(() =>
        useTeams({ employees: largeEmployeeList })
      );

      expect(result.current.teams).toHaveLength(10);
      expect(result.current.filteredEmployees).toHaveLength(1000);

      act(() => {
        result.current.onToggleTeam("Team 0");
      });

      expect(result.current.filteredEmployees).toHaveLength(900);
    });

    it("should handle large number of teams efficiently", () => {
      const manyTeams = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Employee ${i}`,
        team: `Team ${i}`,
        jobLevel: 3,
        gender: 1,
        ethnicity: 1,
        box: null,
      }));

      const { result } = renderHook(() => useTeams({ employees: manyTeams }));

      expect(result.current.teams).toHaveLength(100);

      // Toggle half the teams
      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.onToggleTeam(`Team ${i}`);
        }
      });

      expect(result.current.filteredEmployees).toHaveLength(50);
    });
  });
});

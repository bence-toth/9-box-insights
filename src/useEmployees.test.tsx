import { renderHook } from "@testing-library/react";
import { act } from "react";
import useEmployees from "./useEmployees";
import type { Employee } from "./useEmployees";
import {
  ARYA_STARK,
  JON_SNOW,
  TYRION_LANNISTER,
  HOUSE_STARK,
} from "./test-utils/mockEmployees";

// Mock the employees module using shared test data
// Use jest.requireActual inside the factory to access the imported data
jest.mock("./employees.example", () => {
  const { mockEmployeesData } = jest.requireActual<
    typeof import("./test-utils/mockEmployees")
  >("./test-utils/mockEmployees");
  return {
    __esModule: true,
    default: mockEmployeesData,
  };
});

describe("useEmployees", () => {
  describe("Initial state", () => {
    it("should return employees array sorted alphabetically by name", () => {
      const { result } = renderHook(() => useEmployees());

      expect(result.current.employees).toHaveLength(3);
      expect(result.current.employees[0].name).toBe(ARYA_STARK);
      expect(result.current.employees[1].name).toBe(JON_SNOW);
      expect(result.current.employees[2].name).toBe(TYRION_LANNISTER);
    });

    it("should enrich employee data with id and box properties", () => {
      const { result } = renderHook(() => useEmployees());

      result.current.employees.forEach((employee: Employee, index: number) => {
        expect(employee).toHaveProperty("id", index);
        expect(employee).toHaveProperty("box", null);
        expect(employee).toHaveProperty("name");
        expect(employee).toHaveProperty("team");
        expect(employee).toHaveProperty("jobLevel");
        expect(employee).toHaveProperty("gender");
        expect(employee).toHaveProperty("ethnicity");
      });
    });

    it("should initialize all employees with box set to null", () => {
      const { result } = renderHook(() => useEmployees());

      result.current.employees.forEach((employee: Employee) => {
        expect(employee.box).toBeNull();
      });
    });

    it("should preserve original employee data properties", () => {
      const { result } = renderHook(() => useEmployees());

      const aryaEmployee = result.current.employees.find(
        (emp) => emp.name === ARYA_STARK
      );
      expect(aryaEmployee).toBeDefined();
      expect(aryaEmployee?.team).toBe(HOUSE_STARK);
      expect(aryaEmployee?.jobLevel).toBe(5);
      expect(aryaEmployee?.gender).toBe(0);
      expect(aryaEmployee?.ethnicity).toBe(1);
    });
  });

  describe("onDropEmployee", () => {
    it("should update the box number for a specific employee", () => {
      const { result } = renderHook(() => useEmployees());

      const employeeId = result.current.employees[0].id;

      act(() => {
        result.current.onDropEmployee(employeeId, 5);
      });

      expect(result.current.employees[0].box).toBe(5);
    });

    it("should not affect other employees when updating one employee", () => {
      const { result } = renderHook(() => useEmployees());

      const employeeId = result.current.employees[1].id;

      act(() => {
        result.current.onDropEmployee(employeeId, 3);
      });

      expect(result.current.employees[0].box).toBeNull();
      expect(result.current.employees[1].box).toBe(3);
      expect(result.current.employees[2].box).toBeNull();
    });

    it("should allow setting box to null", () => {
      const { result } = renderHook(() => useEmployees());

      const employeeId = result.current.employees[0].id;

      // First set to a box
      act(() => {
        result.current.onDropEmployee(employeeId, 5);
      });

      expect(result.current.employees[0].box).toBe(5);

      // Then set back to null
      act(() => {
        result.current.onDropEmployee(employeeId, null);
      });

      expect(result.current.employees[0].box).toBeNull();
    });

    it("should handle multiple sequential updates to the same employee", () => {
      const { result } = renderHook(() => useEmployees());

      const employeeId = result.current.employees[0].id;

      act(() => {
        result.current.onDropEmployee(employeeId, 1);
      });
      expect(result.current.employees[0].box).toBe(1);

      act(() => {
        result.current.onDropEmployee(employeeId, 5);
      });
      expect(result.current.employees[0].box).toBe(5);

      act(() => {
        result.current.onDropEmployee(employeeId, 9);
      });
      expect(result.current.employees[0].box).toBe(9);
    });

    it("should handle updates to multiple employees", () => {
      const { result } = renderHook(() => useEmployees());

      const [emp1, emp2, emp3] = result.current.employees;

      act(() => {
        result.current.onDropEmployee(emp1.id, 1);
        result.current.onDropEmployee(emp2.id, 5);
        result.current.onDropEmployee(emp3.id, 9);
      });

      expect(result.current.employees[0].box).toBe(1);
      expect(result.current.employees[1].box).toBe(5);
      expect(result.current.employees[2].box).toBe(9);
    });

    it("should not throw error when updating non-existent employee", () => {
      const { result } = renderHook(() => useEmployees());

      expect(() => {
        act(() => {
          result.current.onDropEmployee(999, 5);
        });
      }).not.toThrow();

      // All employees should remain unchanged
      result.current.employees.forEach((employee) => {
        expect(employee.box).toBeNull();
      });
    });

    it("should handle box numbers in valid range (1-9)", () => {
      const { result } = renderHook(() => useEmployees());

      const employeeId = result.current.employees[0].id;

      for (let boxNum = 1; boxNum <= 9; boxNum++) {
        act(() => {
          result.current.onDropEmployee(employeeId, boxNum);
        });
        expect(result.current.employees[0].box).toBe(boxNum);
      }
    });
  });

  describe("unplotAllEmployees", () => {
    it("should set all employee boxes to null", () => {
      const { result } = renderHook(() => useEmployees());

      // First, assign boxes to all employees
      act(() => {
        result.current.employees.forEach((emp, index) => {
          result.current.onDropEmployee(emp.id, index + 1);
        });
      });

      // Verify boxes are set
      expect(result.current.employees[0].box).toBe(1);
      expect(result.current.employees[1].box).toBe(2);
      expect(result.current.employees[2].box).toBe(3);

      // Unplot all
      act(() => {
        result.current.unplotAllEmployees();
      });

      // Verify all boxes are null
      result.current.employees.forEach((employee) => {
        expect(employee.box).toBeNull();
      });
    });

    it("should work when some employees already have null boxes", () => {
      const { result } = renderHook(() => useEmployees());

      // Assign boxes to only some employees
      act(() => {
        result.current.onDropEmployee(result.current.employees[0].id, 1);
        result.current.onDropEmployee(result.current.employees[1].id, 5);
        // Leave employees[2] as null
      });

      expect(result.current.employees[0].box).toBe(1);
      expect(result.current.employees[1].box).toBe(5);
      expect(result.current.employees[2].box).toBeNull();

      // Unplot all
      act(() => {
        result.current.unplotAllEmployees();
      });

      // Verify all boxes are null
      result.current.employees.forEach((employee) => {
        expect(employee.box).toBeNull();
      });
    });

    it("should work when all employees already have null boxes", () => {
      const { result } = renderHook(() => useEmployees());

      // All employees start with null boxes
      expect(result.current.employees.every((emp) => emp.box === null)).toBe(
        true
      );

      // Unplot all
      act(() => {
        result.current.unplotAllEmployees();
      });

      // Verify all boxes are still null
      result.current.employees.forEach((employee) => {
        expect(employee.box).toBeNull();
      });
    });

    it("should maintain stable reference using useCallback", () => {
      const { result, rerender } = renderHook(() => useEmployees());

      const firstUnplotRef = result.current.unplotAllEmployees;

      // Trigger a re-render by updating an employee
      act(() => {
        result.current.onDropEmployee(result.current.employees[0].id, 5);
      });

      rerender();

      const secondUnplotRef = result.current.unplotAllEmployees;

      // Function reference should be stable
      expect(firstUnplotRef).toBe(secondUnplotRef);
    });

    it("should preserve other employee properties when unplotting", () => {
      const { result } = renderHook(() => useEmployees());

      // Assign boxes
      act(() => {
        result.current.onDropEmployee(result.current.employees[0].id, 5);
      });

      const employeeBeforeUnplot = { ...result.current.employees[0] };

      // Unplot all
      act(() => {
        result.current.unplotAllEmployees();
      });

      const employeeAfterUnplot = result.current.employees[0];

      // All properties except box should remain the same
      expect(employeeAfterUnplot.id).toBe(employeeBeforeUnplot.id);
      expect(employeeAfterUnplot.name).toBe(employeeBeforeUnplot.name);
      expect(employeeAfterUnplot.team).toBe(employeeBeforeUnplot.team);
      expect(employeeAfterUnplot.jobLevel).toBe(employeeBeforeUnplot.jobLevel);
      expect(employeeAfterUnplot.gender).toBe(employeeBeforeUnplot.gender);
      expect(employeeAfterUnplot.ethnicity).toBe(
        employeeBeforeUnplot.ethnicity
      );
      expect(employeeAfterUnplot.box).toBeNull();
    });
  });

  describe("State persistence", () => {
    it("should maintain state across multiple renders", () => {
      const { result, rerender } = renderHook(() => useEmployees());

      const employeeId = result.current.employees[0].id;

      act(() => {
        result.current.onDropEmployee(employeeId, 5);
      });

      rerender();

      expect(result.current.employees[0].box).toBe(5);
    });

    it("should maintain employee count across operations", () => {
      const { result } = renderHook(() => useEmployees());

      const initialCount = result.current.employees.length;

      act(() => {
        result.current.onDropEmployee(result.current.employees[0].id, 5);
      });

      expect(result.current.employees.length).toBe(initialCount);

      act(() => {
        result.current.unplotAllEmployees();
      });

      expect(result.current.employees.length).toBe(initialCount);
    });
  });

  describe("Employee sorting", () => {
    it("should maintain alphabetical order after box assignments", () => {
      const { result } = renderHook(() => useEmployees());

      // Assign boxes in random order
      act(() => {
        result.current.onDropEmployee(result.current.employees[2].id, 1);
        result.current.onDropEmployee(result.current.employees[0].id, 5);
        result.current.onDropEmployee(result.current.employees[1].id, 9);
      });

      // Names should still be in alphabetical order
      expect(result.current.employees[0].name).toBe(ARYA_STARK);
      expect(result.current.employees[1].name).toBe(JON_SNOW);
      expect(result.current.employees[2].name).toBe(TYRION_LANNISTER);
    });
  });
});

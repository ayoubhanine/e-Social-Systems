import { describe, expect, it, beforeEach } from "vitest";
import { DECLARATIONS, EMPLOYERS } from "../data/index.js";
import * as FN from "./functions.js";
import { Declaration, Employee, Employer } from "./classes.js";

// Clear data before each test
beforeEach(() => {
  EMPLOYERS.clear();
  DECLARATIONS.clear();
});

describe("get_all_employees", () => {
  it("should return empty array when no employers exist", () => {
    expect(FN.get_all_employees()).toEqual([]);
  });

  it("should return all employees from all employers", () => {
    const employer1 = new Employer("Tech", "Company A", 100000);
    const employer2 = new Employer("Finance", "Company B", 200000);
    const emp1 = new Employee("John", 5000);
    const emp2 = new Employee("Jane", 6000);
    const emp3 = new Employee("Bob", 4000);

    EMPLOYERS.set(employer1.id, employer1);
    EMPLOYERS.set(employer2.id, employer2);
    employer1.add_employee(emp1);
    employer1.add_employee(emp2);
    employer2.add_employee(emp3);

    const employees = FN.get_all_employees();
    expect(employees).toHaveLength(3);
    expect(employees).toContain(emp1);
    expect(employees).toContain(emp2);
    expect(employees).toContain(emp3);
  });
});

describe("get_employee_rights", () => {
  it("should return null if employee not found", () => {
    expect(FN.get_employee_rights("nonexistent")).toBeNull();
  });

  it("should calculate total contributions (employee + employer) for employee", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 5000);
    employer.add_employee(employee);
    EMPLOYERS.set(employer.id, employer);

    // Create 3 declarations
    const decl1 = new Declaration(employee.id, employer.id, new Date("2024-01-01"));
    const decl2 = new Declaration(employee.id, employer.id, new Date("2024-02-01"));
    const decl3 = new Declaration(employee.id, employer.id, new Date("2024-03-01"));
    DECLARATIONS.set(decl1.id, decl1);
    DECLARATIONS.set(decl2.id, decl2);
    DECLARATIONS.set(decl3.id, decl3);

    // Employee contribution: 5000 * 0.04 = 200 per declaration
    // Employer contribution: 5000 * 0.08 = 400 per declaration
    // Total per declaration: 600
    // For 3 declarations: 1800
    const rights = FN.get_employee_rights(employee.id);
    expect(rights).toBe(1800);
  });

  it("should handle salary cap at 6000 for employee contribution", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 10000); // salary above cap
    employer.add_employee(employee);
    EMPLOYERS.set(employer.id, employer);

    const decl = new Declaration(employee.id, employer.id, new Date("2024-01-01"));
    DECLARATIONS.set(decl.id, decl);

    // Employee contribution: 6000 * 0.04 = 240 (capped)
    // Employer contribution: 10000 * 0.08 = 800 (not capped)
    // Total: 1040
    const rights = FN.get_employee_rights(employee.id);
    expect(rights).toBe(1040);
  });
});

describe("add_employee", () => {
  it("should add employee to employer", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 5000);
    EMPLOYERS.set(employer.id, employer);

    FN.add_employee(employer.id, employee);

    expect(employer.employees.has(employee)).toBe(true);
  });

  it("should throw error if employee is not Employee instance", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    EMPLOYERS.set(employer.id, employer);
    expect(() => FN.add_employee(employer.id, {})).toThrow("employee must be an instance of Employee class");
  });

  it("should throw error if employer not found", () => {
    const employee = new Employee("John", 5000);
    expect(() => FN.add_employee("nonexistent", employee)).toThrow("employer not found");
  });
});

describe("add_declaration", () => {
  it("should add declaration to declarations map", () => {
    const declaration = new Declaration("emp1", "emp1", new Date());

    FN.add_declaration(declaration);

    expect(DECLARATIONS.get(declaration.id)).toBe(declaration);
  });

  it("should throw error if declaration is not Declaration instance", () => {
    expect(() => FN.add_declaration({})).toThrow("declaration must be an instance of Declaration class");
  });
});

describe("add_employer", () => {
  it("should add employer to employers map", () => {
    const employer = new Employer("Tech", "Company A", 100000);

    FN.add_employer(employer);

    expect(EMPLOYERS.get(employer.id)).toBe(employer);
  });

  it("should throw error if employer is not Employer instance", () => {
    expect(() => FN.add_employer({})).toThrow("employer must be an instance of Employer class");
  });
});

describe("get_employee_contribution", () => {
  it("should throw error if employee not found", () => {
    expect(() => FN.get_employee_contribution("nonexistent")).toThrow("employee not found");
  });

  it("should calculate total employee contribution for all declarations", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 5000);
    employer.add_employee(employee);
    EMPLOYERS.set(employer.id, employer);

    const decl1 = new Declaration(employee.id, employer.id, new Date("2024-01-01"));
    const decl2 = new Declaration(employee.id, employer.id, new Date("2024-02-01"));
    DECLARATIONS.set(decl1.id, decl1);
    DECLARATIONS.set(decl2.id, decl2);

    // Employee contribution: 5000 * 0.04 = 200 per declaration
    // For 2 declarations: 400
    const contribution = FN.get_employee_contribution(employee.id);
    expect(contribution).toBe(400);
  });

  it("should respect salary cap at 6000", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 10000);
    employer.add_employee(employee);
    EMPLOYERS.set(employer.id, employer);

    const decl = new Declaration(employee.id, employer.id, new Date());
    DECLARATIONS.set(decl.id, decl);

    // Employee contribution: 6000 * 0.04 = 240 (capped)
    const contribution = FN.get_employee_contribution(employee.id);
    expect(contribution).toBe(240);
  });
});

describe("get_employer_contribution", () => {
  it("should return 0 if employer has no declarations", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    EMPLOYERS.set(employer.id, employer);

    expect(FN.get_employer_contribution(employer.id)).toBe(0);
  });

  it("should calculate total employer contribution for all declarations", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee1 = new Employee("John", 5000);
    const employee2 = new Employee("Jane", 4000);
    employer.add_employee(employee1);
    employer.add_employee(employee2);
    EMPLOYERS.set(employer.id, employer);

    const decl1 = new Declaration(employee1.id, employer.id, new Date("2024-01-01"));
    const decl2 = new Declaration(employee2.id, employer.id, new Date("2024-02-01"));
    DECLARATIONS.set(decl1.id, decl1);
    DECLARATIONS.set(decl2.id, decl2);

    // Employer contribution: 5000 * 0.08 = 400 + 4000 * 0.08 = 320
    // Total: 720
    const contribution = FN.get_employer_contribution(employer.id);
    expect(contribution).toBe(720);
  });

  it("should handle multiple declarations for same employee", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 5000);
    employer.add_employee(employee);
    EMPLOYERS.set(employer.id, employer);

    const decl1 = new Declaration(employee.id, employer.id, new Date("2024-01-01"));
    const decl2 = new Declaration(employee.id, employer.id, new Date("2024-02-01"));
    DECLARATIONS.set(decl1.id, decl1);
    DECLARATIONS.set(decl2.id, decl2);

    // Employer contribution: 5000 * 0.08 = 400 per declaration
    // For 2 declarations: 800
    const contribution = FN.get_employer_contribution(employer.id);
    expect(contribution).toBe(800);
  });
});

describe("get_total_contributions", () => {
  it("should return 0 when no declarations exist", () => {
    expect(FN.get_total_contributions()).toBe(0);
  });

  it("should calculate total of all contributions (employee + employer)", () => {
    const employer1 = new Employer("Tech", "Company A", 100000);
    const employer2 = new Employer("Finance", "Company B", 200000);
    const emp1 = new Employee("John", 5000);
    const emp2 = new Employee("Jane", 4000);
    employer1.add_employee(emp1);
    employer2.add_employee(emp2);
    EMPLOYERS.set(employer1.id, employer1);
    EMPLOYERS.set(employer2.id, employer2);

    const decl1 = new Declaration(emp1.id, employer1.id, new Date("2024-01-01"));
    const decl2 = new Declaration(emp2.id, employer2.id, new Date("2024-02-01"));
    DECLARATIONS.set(decl1.id, decl1);
    DECLARATIONS.set(decl2.id, decl2);

    // Declaration 1: emp1 contribution (200) + employer1 contribution (400) = 600
    // Declaration 2: emp2 contribution (160) + employer2 contribution (320) = 480
    // Total: 1080
    const total = FN.get_total_contributions();
    expect(total).toBe(1080);
  });

  it("should handle multiple declarations correctly", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 5000);
    employer.add_employee(employee);
    EMPLOYERS.set(employer.id, employer);

    const decl1 = new Declaration(employee.id, employer.id, new Date("2024-01-01"));
    const decl2 = new Declaration(employee.id, employer.id, new Date("2024-02-01"));
    DECLARATIONS.set(decl1.id, decl1);
    DECLARATIONS.set(decl2.id, decl2);

    // Each declaration: 200 (employee) + 400 (employer) = 600
    // For 2 declarations: 1200
    const total = FN.get_total_contributions();
    expect(total).toBe(1200);
  });
});

describe("get_highest_contributing_employer", () => {
  it("should return null when no employers exist", () => {
    expect(FN.get_highest_contributing_employer()).toBeNull();
  });

  it("should return employer with highest contribution", () => {
    const employer1 = new Employer("Tech", "Company A", 100000);
    const employer2 = new Employer("Finance", "Company B", 200000);
    const emp1 = new Employee("John", 5000);
    const emp2 = new Employee("Jane", 3000);
    const emp3 = new Employee("Bob", 6000);
    employer1.add_employee(emp1);
    employer1.add_employee(emp2);
    employer2.add_employee(emp3);
    EMPLOYERS.set(employer1.id, employer1);
    EMPLOYERS.set(employer2.id, employer2);

    // Employer1: 2 declarations
    const decl1 = new Declaration(emp1.id, employer1.id, new Date("2024-01-01"));
    const decl2 = new Declaration(emp2.id, employer1.id, new Date("2024-02-01"));
    // Employer2: 1 declaration
    const decl3 = new Declaration(emp3.id, employer2.id, new Date("2024-03-01"));
    DECLARATIONS.set(decl1.id, decl1);
    DECLARATIONS.set(decl2.id, decl2);
    DECLARATIONS.set(decl3.id, decl3);

    // Employer1: 5000 * 0.08 + 3000 * 0.08 = 400 + 240 = 640
    // Employer2: 6000 * 0.08 = 480
    // Employer1 should be highest
    const highest = FN.get_highest_contributing_employer();
    expect(highest).toBe(employer1);
  });

  it("should return first employer when contributions are equal", () => {
    const employer1 = new Employer("Tech", "Company A", 100000);
    const employer2 = new Employer("Finance", "Company B", 200000);
    const emp1 = new Employee("John", 5000);
    const emp2 = new Employee("Jane", 5000);
    employer1.add_employee(emp1);
    employer2.add_employee(emp2);
    EMPLOYERS.set(employer1.id, employer1);
    EMPLOYERS.set(employer2.id, employer2);

    const decl1 = new Declaration(emp1.id, employer1.id, new Date("2024-01-01"));
    const decl2 = new Declaration(emp2.id, employer2.id, new Date("2024-02-01"));
    DECLARATIONS.set(decl1.id, decl1);
    DECLARATIONS.set(decl2.id, decl2);

    // Both have same contribution: 5000 * 0.08 = 400
    const highest = FN.get_highest_contributing_employer();
    expect(highest).toBe(employer1); // First one encountered
  });
});


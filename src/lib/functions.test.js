import { describe, expect, it, beforeEach } from "vitest";
import { DECLARATIONS, EMPLOYERS } from "../data/index.js";
import * as FN from "./functions.js";
import { Declaration, Employee, Employer } from "./classes.js";
import { get_days_between_dates } from "./functions.js";

// Clear data before each test
beforeEach(() => {
  EMPLOYERS.clear();
  DECLARATIONS.clear();
});

describe("Employee class", () => {
  it("should create an employee with correct properties", () => {
    const employee = new Employee("John Doe", 5000);
    expect(employee.name).toBe("John Doe");
    expect(employee.salary).toBe(5000);
    expect(employee.months_declared).toBe(0);
    expect(employee.id).toBeTruthy();
  });

  it("should calculate contribution with salary cap at 6000", () => {
    const employee1 = new Employee("John", 5000);
    expect(employee1.contribution).toBe(200); // 5000 * 0.04

    const employee2 = new Employee("Jane", 10000);
    expect(employee2.contribution).toBe(240); // 6000 * 0.04 (capped)
  });

  it("should update salary with set_salary", () => {
    const employee = new Employee("John", 5000);
    employee.set_salary(6000);
    expect(employee.salary).toBe(6000);
    expect(employee.contribution).toBe(240); // 6000 * 0.04
  });
});

describe("Employer class", () => {
  it("should create an employer with correct properties", () => {
    const employer = new Employer("", "Company A", 100000);
    expect(employer.sector).toBe("Other");
    expect(employer.company_name).toBe("Company A");
    expect(employer.employees.size).toBe(0);
    expect(employer.id).toBeTruthy();
  });

  it("should add employees correctly", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee1 = new Employee("John", 5000);
    const employee2 = new Employee("Jane", 4000);

    employer.add_employee(employee1);
    employer.add_employee(employee2);

    expect(employer.employee_count).toBe(2);
    expect(employer.employees.has(employee1)).toBe(true);
    expect(employer.employees.has(employee2)).toBe(true);
  });

  it("should retrieve employee by id", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 5000);
    employer.add_employee(employee);

    const retrieved = employer.get_employee(employee.id);
    expect(retrieved).toBe(employee);
  });

  it("should return null for nonexistent employee", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    expect(employer.get_employee("nonexistent")).toBeNull();
  });

  it("should calculate total contribution from all employees", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee1 = new Employee("John", 5000);
    const employee2 = new Employee("Jane", 4000);

    employer.add_employee(employee1);
    employer.add_employee(employee2);

    // Contribution: 5000 * 0.08 + 4000 * 0.08 = 400 + 320 = 720
    expect(employer.contribution).toBe(720);
  });
});

describe("get_days_between_dates", () => {
  it("should return correct number of days between two dates", () => {
    const d1 = new Date("2024-01-01");
    const d2 = new Date("2024-01-31");
    expect(get_days_between_dates(d1, d2)).toBe(30);
  });

  it("should return 0 when both dates are the same", () => {
    const d1 = new Date("2024-01-01");
    const d2 = new Date("2024-01-01");
    expect(get_days_between_dates(d1, d2)).toBe(0);
  });

  it("should handle leap years correctly", () => {
    const d1 = new Date("2020-02-01");
    const d2 = new Date("2020-03-01");
    expect(get_days_between_dates(d1, d2)).toBe(29); // 2020 is a leap year
  });
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


describe("Declaration class", () => {
  it("should calculate total_contribution correctly", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 5000);
    employer.add_employee(employee);
    EMPLOYERS.set(employer.id, employer);

    const declaration = new Declaration(employee.id, employer.id, new Date());

    // Employee contribution: 5000 * 0.04 = 200
    // Employer contribution: 5000 * 0.08 = 400
    // Per employee: 400 / 1 = 400
    // Total: 200 + 400 = 600
    expect(declaration.total_contribution).toBe(600);
  });

  it("should calculate penalties for late declarations", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 5000);
    employer.add_employee(employee);
    EMPLOYERS.set(employer.id, employer);

    // Create a declaration from 40 days ago (10 days late)
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 40);
    const declaration = new Declaration(employee.id, employer.id, pastDate);

    // Days late: 40 - 30 = 10 days
    // Base contribution: 200 (employee) + 400 (employer per employee) = 600
    // Penalty: 10 * 600 * 0.00005 = 0.3
    const penalties = declaration.penalties;
    expect(penalties).toBeCloseTo(0.3, 2);
  });

  it("should return 0 penalties for recent declarations", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 5000);
    employer.add_employee(employee);
    EMPLOYERS.set(employer.id, employer);

    const declaration = new Declaration(employee.id, employer.id, new Date());

    // Recent declaration should have no penalty
    expect(declaration.penalties).toBe(0);
  });

  it("should return 0 total_contribution if employee not found", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    EMPLOYERS.set(employer.id, employer);

    const declaration = new Declaration("nonexistent", employer.id, new Date());

    expect(declaration.total_contribution).toBe(0);
  });

  it("should return 0 penalties if employee not found", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    EMPLOYERS.set(employer.id, employer);

    const declaration = new Declaration("nonexistent", employer.id, new Date());

    expect(declaration.penalties).toBe(0);
  });
});

describe("get_average_employee_salary", () => {
  it("should return 0 when no employees exist", () => {
    expect(FN.get_average_employee_salary()).toBe(0);
  });

  it("should calculate correct average salary", () => {
    const employer1 = new Employer("Tech", "Company A", 100000);
    const employer2 = new Employer("Finance", "Company B", 200000);
    const emp1 = new Employee("John", 5000);
    const emp2 = new Employee("Jane", 6000);
    const emp3 = new Employee("Bob", 4000);

    employer1.add_employee(emp1);
    employer1.add_employee(emp2);
    employer2.add_employee(emp3);
    EMPLOYERS.set(employer1.id, employer1);
    EMPLOYERS.set(employer2.id, employer2);

    // Average: (5000 + 6000 + 4000) / 3 = 15000 / 3 = 5000
    expect(FN.get_average_employee_salary()).toBe(5000);
  });

  it("should handle single employee", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 5000);
    employer.add_employee(employee);
    EMPLOYERS.set(employer.id, employer);

    expect(FN.get_average_employee_salary()).toBe(5000);
  });
});

describe("get_employer_by_id", () => {
  it("should return employer when found", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    EMPLOYERS.set(employer.id, employer);

    const found = FN.get_employer_by_id(employer.id);
    expect(found).toBe(employer);
  });

  it("should return null when employer not found", () => {
    expect(FN.get_employer_by_id("nonexistent")).toBeNull();
  });
});

describe("get_employee_by_id", () => {
  it("should return employee when found", () => {
    const employer = new Employer("Tech", "Company A", 100000);
    const employee = new Employee("John", 5000);
    employer.add_employee(employee);
    EMPLOYERS.set(employer.id, employer);

    const found = FN.get_employee_by_id(employee.id);
    expect(found).toBe(employee);
  });

  it("should find employee across multiple employers", () => {
    const employer1 = new Employer("Tech", "Company A", 100000);
    const employer2 = new Employer("Finance", "Company B", 200000);
    const employee = new Employee("John", 5000);
    employer2.add_employee(employee);
    EMPLOYERS.set(employer1.id, employer1);
    EMPLOYERS.set(employer2.id, employer2);

    const found = FN.get_employee_by_id(employee.id);
    expect(found).toBe(employee);
  });

  it("should return null when employee not found", () => {
    expect(FN.get_employee_by_id("nonexistent")).toBeNull();
  });
});
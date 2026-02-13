//@ts-check
import { generate_id } from "../utils";
import { get_days_between_dates, get_employer_by_id } from "./functions";
import { DECLARATIONS } from "../data";
const sectors = {
  Technology: 1,
  Healthcare: 2,
  Education: 3,
  Finance: 4,
  Manufacturing: 5,
  Retail: 6,
  Construction: 7,
  Transportation: 8,
  Hospitality: 9,
  Agriculture: 10,
  Other: 11,
};

export const sector_list = Object.keys(sectors);

export class Employer {
  /**
   * @param {keyof typeof sectors} sector
   * @param {string} company_name
   */
  constructor(sector, company_name) {
    this.id = generate_id();
    this.sector = sector;
    if (!sectors[sector]) {
      this.sector = "Other";
    }
    this.company_name = company_name.trim();
    /** @type {Set<Employee>} */
    this.employees = new Set();
    this.penalties = 0;
  }
  /**
   * @returns {number}
   */
  get employee_count() {
    return this.employees.size;
  }
  /**
   * @returns {number}
   */
  get contribution() {
    let total = 0;
    for (let employee of this.employees) {
      total += employee.salary * 0.08;
    }
    return total;
  }
  /**
   * @param {Employee} employee
   */
  add_employee(employee) {
    if (this.employees.has(employee)) return;
    this.employees.add(employee);
  }
  /**
   * @param {string} employee_id
   * @returns {Employee | null}
   */

  get_employee(employee_id) {
    for (let employee of this.employees) {
      if (employee.id === employee_id) {
        return employee;
      }
    }
    return null;
  }
}

export class Employee {
  /**
   *
   * @param {string} name
   * @param {number} salary
   */
  constructor(name, salary) {
    this.id = generate_id();
    this.name = name;
    this.salary = salary;
    this.months_declared = 0;
  }
  /**
   *
   * @param {number} new_salary
   */
  set_salary(new_salary) {
    this.salary = new_salary;
  }
  get contribution() {
    let salary = Math.min(this.salary, 6000); // cap the salary at 6000
    return salary * 0.04;
  }
}

export class Declaration {
  /**
   * @param {string} employer_id
   * @param {Date} date
   */
  constructor(employer_id, date) {
    this.id = generate_id();
    this.employer_id = employer_id;
    this.date = date;
  }
  /**
   * Calculates penalties based on how many days late the declaration is from the 30-day submission window
   * @returns {number} penalty amount (0 if no penalty applies)
   */
  get penalties() {
    const employer = get_employer_by_id(this.employer_id);
    if (!employer) return 0;

    // Find the previous declaration for this employer (most recent before this one)
    let previous_declaration = null;
    for (const declaration of DECLARATIONS.values()) {
      if (
        declaration.employer_id === this.employer_id &&
        declaration.id !== this.id &&
        declaration.date < this.date
      ) {
        if (
          !previous_declaration ||
          declaration.date > previous_declaration.date
        ) {
          previous_declaration = declaration;
        }
      }
    }

    // If no previous declaration exists, this is the first declaration - no penalty
    if (!previous_declaration) return 0;

    const days_elapsed = Math.floor(
      get_days_between_dates(previous_declaration.date, this.date),
    );
    const days_late = Math.max(0, days_elapsed - 30);

    if (days_late <= 0) return 0;

    // Calculate base contribution for ALL employees
    let base_contribution = 0;
    for (const employee of employer.employees) {
      base_contribution += employee.contribution + employee.salary * 0.08;
    }
    console.table({
      days_late,
      base_contribution,
      penaltie: Math.ceil(days_late * base_contribution * 0.005),
    });
    return Math.ceil(days_late * base_contribution * 0.005);
  }

  get total_contribution() {
    const employer = get_employer_by_id(this.employer_id);
    if (!employer) return 0;

    // Calculate total for ALL employees
    let total = 0;
    for (const employee of employer.employees) {
      total += employee.contribution; // Employee contribution (capped at 6000)
      total += employee.salary * 0.08; // Employer contribution (NOT capped)
    }

    return Math.ceil(total);
  }
}

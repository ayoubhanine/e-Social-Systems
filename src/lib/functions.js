//@ts-check
import { DECLARATIONS, EMPLOYERS } from "../data/index";
import { Employer, Declaration, Employee } from "./classes";

// employee functions
/**
 * @param {string} employee_id
 * @returns {Employee | null} Employee object if found, otherwise null
 */
export function get_employee_by_id(employee_id) {
  for (let employer of EMPLOYERS.values()) {
    const employee = employer.get_employee(employee_id);
    if (employee) return employee;
  }
  return null;
}

/**
 *
 * @returns {Employee[]} Array of all employees
 */
export function get_all_employees() {
  /**@type {Employee[]} */
  let employees = [];
  for (let employer of EMPLOYERS.values()) {
    // generate array of employees from employer's employee  and push to employees array
    employees.push(...Array.from(employer.employees));
  }
  return employees;
}

/**
 * @param {string} employee_id
 * @returns {number | null} Total contributions (employee + employer) or null if employee not found
 */
export function get_employee_rights(employee_id) {
  /**
   * @type {Employee | null}
   */
  let employee = null;

  for (let employer of EMPLOYERS.values()) {
    employee = employer.get_employee(employee_id);
    if (employee) break;
  }

  if (!employee) return null;

  let total = 0;

  for (let declaration of DECLARATIONS.values()) {
    if (declaration.employee_id === employee_id) {
      // Employee contribution (capped if required)
      total += employee.contribution;

      // Employer contribution (NOT capped anymore)
      total += employee.salary * 0.08;
    }
  }

  return Math.ceil(total);
}

/**
 * Adds an employee to an employer.
 * @param {string} employer_id
 * @param {Employee} employee
 * @returns {void}
 */
export function add_employee(employer_id, employee) {
  if (!(employee instanceof Employee)) {
    throw new Error("employee must be an instance of Employee class");
  }
  const employer = EMPLOYERS.get(employer_id);
  if (!employer) throw new Error("employer not found");
  employer.add_employee(employee);
}

// declaration functions
/**
 * Adds a declaration to the declarations map.
 * @param {Declaration} declaration
 * @returns {void}
 * @throws {Error}
 */
export function add_declaration(declaration) {
  if (!(declaration instanceof Declaration))
    throw new Error("declaration must be an instance of Declaration class");

  DECLARATIONS.set(declaration.id, declaration);
}

// employer functions

/**
 * @param {string} employer_id
 * @returns {Employer | null} Employer object if found, otherwise null
 */
export function get_employer_by_id(employer_id) {
  return EMPLOYERS.get(employer_id) || null;
}

/**
 * @returns {Employer[]}
 */
export function get_all_employers() {
  let employers = [];

  for (let employer of EMPLOYERS.values()) {
    employers.push(employer);
  }
  return employers;
}

/**
 * Adds an employer to the employers map.
 * @param {Employer} employer
 * @returns {void}
 * @throws {Error}
 */
export function add_employer(employer) {
  if (!(employer instanceof Employer))
    throw new Error("employer must be an instance of Employer class");
  EMPLOYERS.set(employer.id, employer);
}

/**
 * Calculates total employee contribution for all declarations of a given employee.
 * @param {string} employee_id
 * @returns {number}
 * @throws {Error}
 */
export function get_employee_contribution(employee_id) {
  /**
   * @type {Employee | null}
   */
  let employee = get_employee_by_id(employee_id);
  if (!employee) throw new Error("employee not found");
  let contribution = 0;
  for (let declaration of DECLARATIONS.values()) {
    if (declaration.employee_id === employee_id) {
      contribution += employee.contribution;
    }
  }
  return contribution;
}

/**
 * Calculates total employer contribution for all declarations of a given employer.
 * @param {string} employer_id
 * @returns {number}
 */
export function get_employer_contribution(employer_id) {
  const employer = EMPLOYERS.get(employer_id);
  if (!employer) return 0;

  let contribution = 0;
  for (let declaration of DECLARATIONS.values()) {
    if (declaration.employer_id === employer_id) {
      const employee = employer.get_employee(declaration.employee_id);
      if (employee) {
        contribution += employee.salary * 0.08;
      }
    }
  }
  return Math.ceil(contribution);
}

/**
 * Returns the number of days between two dates.
 * @param {Date} d1
 * @param {Date} d2
 * @returns {number}
 */
export function get_days_between_dates(d1, d2) {
  // this somehow fixes off-by-one issues
  const day = 24 * 60 * 60 * 1000;
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.abs((utc2 - utc1) / day);
}

// global statistics functions
/**
 * Calculates the total of all contributions (employee + employer) across all declarations.
 * @returns {number} Total contributions from all declarations
 */
export function get_total_contributions() {
  let total = 0;
  for (let declaration of DECLARATIONS.values()) {
    const employer = EMPLOYERS.get(declaration.employer_id);
    if (!employer) continue;
    const employee = employer.get_employee(declaration.employee_id);
    if (employee) {
      total += employee.contribution;
      total += employee.salary * 0.08;
    }
  }
  return Math.ceil(total);
}

/**
 * Finds the employer with the highest total contribution.
 * @returns {Employer | null} The employer with highest contribution or null if no employers exist
 */
export function get_highest_contributing_employer() {
  let highest_contribution = 0;
  let highest_employer = null;
  for (let employer of EMPLOYERS.values()) {
    let contribution = get_employer_contribution(employer.id);
    if (contribution > highest_contribution) {
      highest_contribution = contribution;
      highest_employer = employer;
    }
  }
  return highest_employer;
}

/**
 * Calculates the average salary of all employees across all employers.
 * @returns {number} Average salary of all employees, or 0 if no employees exist
 */
export function get_average_employee_salary() {
  let total_salary = 0;
  let employee_count = 0;
  for (let employer of EMPLOYERS.values()) {
    for (let employee of employer.employees) {
      total_salary += employee.salary;
      employee_count++;
    }
  }
  return employee_count > 0 ? total_salary / employee_count : 0;
}

export function get_all_declarations() {
  let declarations = [];
  for (let declaration of DECLARATIONS.values()) {
    declarations.push(declaration);
  }
  return declarations;
}

/**
 * Calculates the total of all contributions (employee + employer) across all declarations per month
 * @param {Date} month
 * @returns {Number} Total contributions from all declarations
 */
export function get_total_contributions_by_month(month) {
  let total = 0;

  for (let declaration of DECLARATIONS.values()) {
    const declarationMonth = new Date(declaration.date).getMonth() + 1;

    if (declarationMonth !== new Date(month).getMonth() + 1) continue;

    const employer = EMPLOYERS.get(declaration.employer_id);
    if (!employer) continue;

    const employee = employer.get_employee(declaration.employee_id);
    if (!employee) continue;

    total += employee.contribution;
    total += employee.salary * 0.08;
  }

  return Math.ceil(total);
}

/**
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean} Whether the two dates are in the same month and year
 */
export function compare_date_months(date1, date2) {
  const month1 = new Date(date1).getMonth() + 1;
  const month2 = new Date(date2).getMonth() + 1;
  const year1 = new Date(date1).getFullYear();
  const year2 = new Date(date2).getFullYear();
  return month1 === month2 && year1 === year2;
}

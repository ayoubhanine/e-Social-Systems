//@ts-check
import { DECLARATIONS, EMPLOYERS } from "../data/index";
import { Employer, Declaration, Employee } from "./classes";

/**
 *
 * @returns {Employee[]} Array of all employees
 */
export function get_all_employees() {
  /**@type {Employee[]} */
  let employees = [];
  for (let employer of EMPLOYERS.values()) {
    // generate array of employees from employer's employee map and push to employees array
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
      total += employee.contribution; 
      total += employee.salary * 0.08; 
    }
  }
  return total;
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
  let employee = null;
  for (let employer of EMPLOYERS.values()) {
    employee = employer.get_employee(employee_id);
    if (employee) break;
  }
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
  return contribution;
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
  return total;
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
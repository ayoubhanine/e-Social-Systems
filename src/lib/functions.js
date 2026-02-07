import { DECLARATIONS, EMPLOYERS } from "../data/index";
import { generate_id } from "../utils/index";
import { Employer, Declaration, Employee } from "./classes";

// employee functions

/**
 * 
 * @returns {Employee[]}
 */
export function get_all_employees() {
  let employees = [];
  for (let employer of EMPLOYERS.values()) {
    employees = employees.concat(employer.employees);
  }
  return employees;
}



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
  
}


/** *
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
 * @param {Declaration} declaration
 * @returns {void}
 */
export function add_declaration(declaration) {
  if (!(declaration instanceof Declaration))
    throw new Error("declaration must be an instance of Declaration class");
  DECLARATIONS.set(declaration.id, declaration);
}

/**
 * @param {Employer} employer
 * @returns {void}
 */
export function add_employer(employer) {
  if (!(employer instanceof Employer))
    throw new Error("employer must be an instance of Employer class");
  EMPLOYERS.set(employer.id, employer);
}

/**
 * @param {string} employee_id
 * @returns {number}
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
 * @param {string} employer_id
 * @returns {number}
 */
export function get_employer_contribution(employer_id) {
  let contribution = 0;
  for (let declaration of DECLARATIONS.values()) {
    if (declaration.employer_id === employer_id) {
      contribution += declaration;
    }
  }
  return contribution;
}



// global statistics functions
/**
 * @returns {number}
 */
export function get_total_contributions() {
  let contribution = 0;
  for (let declaration of DECLARATIONS.values()) {
    contribution += declaration;
  }
}


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
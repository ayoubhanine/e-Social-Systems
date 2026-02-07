//@ts-check
import { generate_id } from "../utils";
export class Employer {
  /**
   * @param {string} sector
   * @param {string} company_name
   * @param {number} income_per_month
   */
  constructor(sector, company_name, income_per_month) {
    this.id = generate_id();
    this.sector = sector;
    this.company_name = company_name;
    /** @type {Set<Employee>} */
    this.employees = new Set();
    this.income_per_month = income_per_month;
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
     * 
     * @param {string} employee_id 
     * @param {string} employer_id 
     * @param {Date} date 
     */
  constructor(employee_id, employer_id, date) {
    
    this.id = generate_id();
    this.employee_id = employee_id;
    this.employer_id = employer_id;
    this.date = date;
  }
}

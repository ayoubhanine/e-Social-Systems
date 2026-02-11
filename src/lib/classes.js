//@ts-check
import { generate_id  } from "../utils";
import { get_days_between_dates, get_employer_by_id } from "./functions"
const sectors = {
  "Technology": 1,
  "Healthcare": 2,
  "Education": 3,
  "Finance": 4,
  "Manufacturing": 5,
  "Retail": 6,
  "Construction": 7,
  "Transportation": 8,
  "Hospitality": 9,
  "Agriculture": 10,
  "Other": 11
}
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
  /**
   * Calculates penalties based on how many days late the declaration is from the 30-day submission window
   * @returns {number} penalty amount (0 if no penalty applies)
   */
  get penalties() {
    const employer = get_employer_by_id(this.employer_id);
    if (!employer) return 0;
    const employee = employer.get_employee(this.employee_id);
    if (!employee) return 0;
    
    // Declarations should be submitted within 30 days of the declaration date
    const days_since = get_days_between_dates(this.date, new Date());
    const days_late = Math.max(0, days_since - 30);
    
    if (days_late <= 0) return 0;
    
    // Penalty: 0.005% per day of (employee contribution + employer contribution per employee)
    const base_contribution = employee.contribution + (employer.contribution / employer.employee_count);
    return days_late * base_contribution * 0.00005; // 0.005% = 0.00005
  }
  get total_contribution() {
    const employer = get_employer_by_id(this.employer_id);
    if (!employer) return 0;
    const employee = employer.get_employee(this.employee_id);
    if (!employee) return 0;
    return employee.contribution + employer.contribution / employer.employee_count;
  }
}

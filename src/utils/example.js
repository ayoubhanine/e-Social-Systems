import { faker } from '@faker-js/faker';
import { Employer, Employee, Declaration } from '../lib/classes';
import { EMPLOYERS, DECLARATIONS } from '../data/index';

/**
 * Predefined sectors from the Employer class
 */
const SECTORS = {
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

/**
 * Generate a random sector from the available sectors
 * @returns {keyof typeof SECTORS | string}
 */
function getRandomSector() {
  const keys = Object.keys(SECTORS);
  return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Generate example employers with employees and declarations.
 * Declarations are now created **per employer** (each includes all employees),
 * not per employee.
 *
 * @param {number} employerCount - Number of employers to generate
 * @param {number} employeePerEmployer - Number of employees per employer
 * @param {number} declarationsPerEmployer - Number of declarations per employer
 * @returns {void}
 */
export function generateExampleData(
  employerCount = 5,
  employeePerEmployer = 8,
  declarationsPerEmployer = 6
) {
  // Generate employers
  for (let i = 0; i < employerCount; i++) {
    const employer = new Employer(
      getRandomSector(),
      faker.company.name()
    );

    // Generate employees for each employer
    for (let j = 0; j < employeePerEmployer; j++) {
      const employee = new Employee(
        faker.person.fullName(),
        faker.number.int({ min: 2000, max: 8000 }) 
      );
      
      employer.add_employee(employee);
    }

    // Generate declarations for each employer (each declaration covers all employees)
    for (let k = 0; k < declarationsPerEmployer; k++) {
      // Generate dates spread over the past 6 months
      const declarationDate = faker.date.past({ days: 180 });
      
      const declaration = new Declaration(
        employer.id,
        declarationDate
      );

      DECLARATIONS.set(declaration.id, declaration);
    }

    // Add employer to the global map
    EMPLOYERS.set(employer.id, employer);
  }

  console.log(`Generated ${employerCount} employers with ${employeePerEmployer} employees each`);
  console.log(`Total declarations: ${DECLARATIONS.size}`);
}

/**
 * Generate a single employer with employees for testing
 * @param {number} employeeCount - Number of employees to generate
 * @returns {Employer}
 */
export function generateSingleEmployer(employeeCount = 5) {
  const employer = new Employer(
    getRandomSector(),
    faker.company.name()
  );

  for (let i = 0; i < employeeCount; i++) {
    const employee = new Employee(
      faker.person.fullName(),
      faker.number.int({ min: 25000, max: 150000 })
    );
    employer.add_employee(employee);
  }

  EMPLOYERS.set(employer.id, employer);
  return employer;
}

/**
 * Generate a single employee for testing
 * @returns {Employee}
 */
export function generateSingleEmployee() {
  return new Employee(
    faker.person.fullName(),
    faker.number.int({ min: 25000, max: 150000 })
  );
}

/**
 * Generate a single declaration for testing.
 * Declarations are now tied only to an employer (and include all its employees).
 *
 * @param {string} employerId
 * @returns {Declaration}
 */
export function generateSingleDeclaration(employerId) {
  const declaration = new Declaration(
    employerId,
    faker.date.past({ days: 90 })
  );
  
  DECLARATIONS.set(declaration.id, declaration);
  return declaration;
}

/**
 * Clear all generated data from the maps
 * @returns {void}
 */
export function clearExampleData() {
  EMPLOYERS.clear();
  DECLARATIONS.clear();
  console.log('Cleared all example data');
}

/**
 * Get summary of generated data
 * @returns {{employers: number, employees: number, declarations: number}}
 */
export function getDataSummary() {
  let employees = 0;
  for (let employer of EMPLOYERS.values()) {
    employees += employer.employee_count;
  }

  return {
    employers: EMPLOYERS.size,
    employees: employees,
    declarations: DECLARATIONS.size
  };
}

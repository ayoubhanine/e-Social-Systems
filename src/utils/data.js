import { faker } from "@faker-js/faker";
import { Employer, Employee, Declaration } from "../lib/classes";
/**
 * Generate random dataset of employers, employees and declarations.
 *
 * @param {Object} opts
 * @param {number} opts.numEmployers - number of employers to create
 * @param {number} opts.minEmployees - minimum employees per employer
 * @param {number} opts.maxEmployees - maximum employees per employer
 * @param {number} opts.maxMonthsPerEmployee - max months declared per employee (0..12)
 * @param {number} [opts.seed] - optional faker seed for reproducible results
 * @returns {{ employers: Employer[], employees: Employee[], declarations: Declaration[] }}
 */
export function generateRandomDataset({
  numEmployers = 10,
  minEmployees = 3,
  maxEmployees = 20,
  maxMonthsPerEmployee = 12,
  seed = undefined,
} = {}) {
  if (typeof seed === "number") {
    faker.seed(seed);
  }

  const employers = [];
  const employees = [];
  const declarations = [];

  const sectors = [
    "Agriculture",
    "Manufacturing",
    "Construction",
    "Retail",
    "IT",
    "Healthcare",
    "Education",
    "Finance",
    "Transport",
    "Hospitality",
  ];

  for (let i = 0; i < numEmployers; i++) {
    const sector = faker.helpers.arrayElement(sectors);
    const company_name = faker.company.name();
    // income_per_month: random realistic monthly revenue
    const income_per_month = faker.number.int({ min: 5000, max: 200000 });

    const employer = new Employer(sector, company_name, income_per_month);

    // Remove instance properties that shadow prototype getters so getters work
    // (your class sets employees_count and contribution in constructor and also defines getters)
    try {
      delete employer.employees_count;
    } catch (e) {}
    try {
      delete employer.contribution;
    } catch (e) {}

    const numEmployees = faker.number.int({
      min: minEmployees,
      max: maxEmployees,
    });

    for (let j = 0; j < numEmployees; j++) {
      const name = faker.person.fullName();
      // salary: choose a realistic salary, allow some above cap to test cap logic
      const salary = faker.number.int({ min: 1500, max: 10000, precision: 1 });

      const employee = new Employee(name, salary);

      // Add employee to employer (Employer.add_employee uses Set)
      employer.add_employee(employee);

      employees.push(employee);

      // Generate random months declared for this employee (0..maxMonthsPerEmployee)
      const monthsDeclared = faker.number.int({
        min: 0,
        max: maxMonthsPerEmployee,
      });
      employee.months_declared = monthsDeclared;

      // Create declarations for random months (unique months)
      const months = faker.helpers.uniqueArray(
        () => faker.number.int({ min: 1, max: 12 }),
        Math.min(monthsDeclared, 12),
      );

      for (const month of months) {
        const decl = new Declaration(employee.id, employer.id, month);
        // Declaration class only sets id in your snippet; attach fields explicitly
        decl.employee_id = employee.id;
        decl.employer_id = employer.id;
        decl.month = month;
        declarations.push(decl);
      }
    }

    employers.push(employer);
  }

  return { employers, employees, declarations, sectors };
}
const example_data = generateRandomDataset({
  numEmployers: 10,
  minEmployees: 2,
  maxEmployees: 4,
  maxMonthsPerEmployee: 6,
  seed: 42, // reproducible
});

export default example_data;

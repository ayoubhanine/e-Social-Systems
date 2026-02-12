# Refactoring Plan: Removing `employee_id` from Declaration Class

## Executive Summary

The Declaration class currently includes an `employee_id` field, but the business logic indicates that each declaration should automatically include **all employees** of the employer. This document outlines the complete refactoring plan to remove `employee_id` from the Declaration class without breaking existing functionality.

---

## 1. Project Understanding

### 1.1 System Overview

This is an **e-Social Systems** application that manages:
- **Employers**: Companies with employees
- **Employees**: Workers belonging to employers
- **Declarations**: Monthly declarations submitted by employers for their employees

### 1.2 Current Data Model

**Employer Class:**
- Contains a `Set<Employee>` of all employees
- Calculates total contribution from all employees: `sum(employee.salary * 0.08)`
- Has `employee_count` getter

**Employee Class:**
- Has `contribution` getter: `min(salary, 6000) * 0.04` (employee contribution, capped at 6000)
- Salary can be updated dynamically

**Declaration Class (Current):**
- `id`: Unique identifier
- `employee_id`: **TO BE REMOVED** - Currently references a single employee
- `employer_id`: References the employer
- `date`: Declaration date
- `penalties`: Getter calculating late fees (0.005% per day after 30 days)
- `total_contribution`: Getter calculating employee + employer contributions

### 1.3 Contribution Calculations

**Employee Contribution:**
- Formula: `min(salary, 6000) * 0.04`
- Capped at 6000 DH salary
- Example: Employee with 8000 DH salary → contribution = 6000 * 0.04 = 240 DH

**Employer Contribution:**
- Formula: `employee.salary * 0.08` (per employee)
- **NOT capped** at 6000
- Example: Employee with 8000 DH salary → employer contribution = 8000 * 0.08 = 640 DH

**Total Contribution per Declaration:**
- Should be: Sum of (employee contribution + employer contribution) for **ALL employees** of the employer
- Current (incorrect): Only calculates for one employee

**Penalties:**
- Applied if declaration is submitted more than 30 days late
- Formula: `days_late * base_contribution * 0.00005`
- Base contribution: Sum of (employee contribution + employer contribution per employee) for **ALL employees**

### 1.4 Current Issues

1. **Declaration.js page** already creates declarations without `employee_id` (using a workaround object)
2. **Declaration class** still requires `employee_id` in constructor
3. **Multiple functions** filter declarations by `employee_id`, which won't work when declarations represent all employees
4. **Tests and example data generators** create declarations with `employee_id`

---

## 2. Refactoring Strategy

### 2.1 Core Principle

**A Declaration represents a monthly declaration for an entire employer, automatically including all employees of that employer at the time of declaration.**

### 2.2 Migration Path

1. **Phase 1**: Update Declaration class to remove `employee_id`
2. **Phase 2**: Update all getters and methods that use `employee_id`
3. **Phase 3**: Refactor functions that filter by `employee_id`
4. **Phase 4**: Update UI components and data generators
5. **Phase 5**: Update tests

---

## 3. Detailed Changes Required

### 3.1 Declaration Class (`src/lib/classes.js`)

#### Current Constructor:
```javascript
constructor(employee_id, employer_id, date) {
  this.id = generate_id();
  this.employee_id = employee_id;  // REMOVE THIS
  this.employer_id = employer_id;
  this.date = date;
}
```

#### New Constructor:
```javascript
constructor(employer_id, date) {
  this.id = generate_id();
  this.employer_id = employer_id;
  this.date = date;
}
```

#### Current `penalties` Getter:
```javascript
get penalties() {
  const employer = get_employer_by_id(this.employer_id);
  if (!employer) return 0;
  const employee = employer.get_employee(this.employee_id);  // REMOVE THIS
  if (!employee) return 0;
  
  const days_since = get_days_between_dates(this.date, new Date());
  const days_late = Math.max(0, days_since - 30);
  
  if (days_late <= 0) return 0;
  
  // Only calculates for ONE employee - WRONG
  const base_contribution = employee.contribution + (employer.contribution / employer.employee_count);
  return Math.ceil(days_late * base_contribution * 0.00005);
}
```

#### New `penalties` Getter:
```javascript
get penalties() {
  const employer = get_employer_by_id(this.employer_id);
  if (!employer) return 0;
  
  const days_since = get_days_between_dates(this.date, new Date());
  const days_late = Math.max(0, days_since - 30);
  
  if (days_late <= 0) return 0;
  
  // Calculate base contribution for ALL employees
  let base_contribution = 0;
  for (const employee of employer.employees) {
    base_contribution += employee.contribution + (employee.salary * 0.08);
  }
  
  return Math.ceil(days_late * base_contribution * 0.00005);
}
```

#### Current `total_contribution` Getter:
```javascript
get total_contribution() {
  const employer = get_employer_by_id(this.employer_id);
  if (!employer) return 0;
  const employee = employer.get_employee(this.employee_id);  // REMOVE THIS
  if (!employee) return 0;

  // Only calculates for ONE employee - WRONG
  return Math.ceil(employee.contribution + employer.contribution / employer.employee_count);
}
```

#### New `total_contribution` Getter:
```javascript
get total_contribution() {
  const employer = get_employer_by_id(this.employer_id);
  if (!employer) return 0;

  // Calculate total for ALL employees
  let total = 0;
  for (const employee of employer.employees) {
    total += employee.contribution;  // Employee contribution (capped at 6000)
    total += employee.salary * 0.08;  // Employer contribution (NOT capped)
  }
  
  return Math.ceil(total);
}
```

---

### 3.2 Functions in `src/lib/functions.js`

#### 3.2.1 `get_employee_rights(employee_id)`

**Current Logic:**
- Filters declarations by `declaration.employee_id === employee_id`
- Sums contributions for matching declarations

**Problem:** When declarations don't have `employee_id`, we can't filter by it.

**Solution:** Calculate employee rights differently:
- Find all declarations for employers where the employee works
- For each declaration, calculate the employee's portion of that declaration
- Sum all portions

**New Implementation:**
```javascript
export function get_employee_rights(employee_id) {
  const employee = get_employee_by_id(employee_id);
  if (!employee) return null;

  // Find the employer of this employee
  let employer = null;
  for (let emp of EMPLOYERS.values()) {
    if (emp.get_employee(employee_id)) {
      employer = emp;
      break;
    }
  }
  
  if (!employer) return null;

  let total = 0;
  
  // Find all declarations for this employer
  for (let declaration of DECLARATIONS.values()) {
    if (declaration.employer_id === employer.id) {
      // Calculate this employee's portion of the declaration
      // Employee contribution
      total += employee.contribution;
      
      // Employer contribution for this employee
      total += employee.salary * 0.08;
    }
  }

  return Math.ceil(total);
}
```

#### 3.2.2 `get_employee_contribution(employee_id)`

**Current Logic:**
- Filters declarations by `declaration.employee_id === employee_id`
- Sums employee contributions

**New Implementation:**
```javascript
export function get_employee_contribution(employee_id) {
  const employee = get_employee_by_id(employee_id);
  if (!employee) throw new Error("employee not found");
  
  // Find the employer of this employee
  let employer = null;
  for (let emp of EMPLOYERS.values()) {
    if (emp.get_employee(employee_id)) {
      employer = emp;
      break;
    }
  }
  
  if (!employer) return 0;
  
  let contribution = 0;
  
  // Count declarations for this employer (each includes this employee)
  let declaration_count = 0;
  for (let declaration of DECLARATIONS.values()) {
    if (declaration.employer_id === employer.id) {
      declaration_count++;
    }
  }
  
  // Employee contribution per declaration * number of declarations
  contribution = employee.contribution * declaration_count;
  
  return contribution;
}
```

#### 3.2.3 `get_employer_contribution(employer_id)`

**Current Logic:**
- Filters declarations by `declaration.employer_id === employer_id`
- For each declaration, gets employee by `declaration.employee_id`
- Sums employer contributions

**New Implementation:**
```javascript
export function get_employer_contribution(employer_id) {
  const employer = EMPLOYERS.get(employer_id);
  if (!employer) return 0;

  let contribution = 0;
  
  // Count how many declarations exist for this employer
  let declaration_count = 0;
  for (let declaration of DECLARATIONS.values()) {
    if (declaration.employer_id === employer_id) {
      declaration_count++;
    }
  }
  
  // For each declaration, calculate employer contribution for all employees
  // Since each declaration includes all employees, multiply by declaration count
  for (const employee of employer.employees) {
    contribution += employee.salary * 0.08 * declaration_count;
  }
  
  return Math.ceil(contribution);
}
```

**Alternative (More Efficient) Implementation:**
```javascript
export function get_employer_contribution(employer_id) {
  const employer = EMPLOYERS.get(employer_id);
  if (!employer) return 0;

  // Count declarations for this employer
  let declaration_count = 0;
  for (let declaration of DECLARATIONS.values()) {
    if (declaration.employer_id === employer_id) {
      declaration_count++;
    }
  }
  
  // Calculate total employer contribution: sum of (salary * 0.08) for all employees * declaration count
  let total_per_declaration = 0;
  for (const employee of employer.employees) {
    total_per_declaration += employee.salary * 0.08;
  }
  
  return Math.ceil(total_per_declaration * declaration_count);
}
```

#### 3.2.4 `get_total_contributions()`

**Current Logic:**
- Iterates all declarations
- For each, gets employee by `declaration.employee_id`
- Sums contributions

**New Implementation:**
```javascript
export function get_total_contributions() {
  let total = 0;
  
  // Simply sum all declaration total_contributions
  // Each declaration already includes all employees
  for (let declaration of DECLARATIONS.values()) {
    total += declaration.total_contribution;
  }
  
  return Math.ceil(total);
}
```

#### 3.2.5 `get_total_contributions_by_month(month)`

**Current Logic:**
- Filters declarations by month
- For each, gets employee by `declaration.employee_id`
- Sums contributions

**New Implementation:**
```javascript
export function get_total_contributions_by_month(month) {
  let total = 0;
  const targetMonth = new Date(month).getMonth() + 1;
  const targetYear = new Date(month).getFullYear();

  for (let declaration of DECLARATIONS.values()) {
    const declarationDate = new Date(declaration.date);
    const declarationMonth = declarationDate.getMonth() + 1;
    const declarationYear = declarationDate.getFullYear();

    if (declarationMonth === targetMonth && declarationYear === targetYear) {
      // Each declaration already includes all employees
      total += declaration.total_contribution;
    }
  }

  return Math.ceil(total);
}
```

---

### 3.3 UI Components

#### 3.3.1 `src/pages/declaration.js`

**Current State:**
- Already creates declarations without `employee_id` (workaround)
- Uses a plain object instead of `Declaration` class

**Changes Needed:**
1. Update `addEmployerDeclaration()` to use the `Declaration` class properly:
```javascript
function addEmployerDeclaration(employerId, date) {
  const employer = EMPLOYERS.get(employerId);
  if (!employer) {
    toast.error("Employeur introuvable");
    return null;
  }

  // Create declaration using the updated class (no employee_id)
  const declaration = new Declaration(employerId, new Date(date));
  
  DECLARATIONS.set(declaration.id, declaration);
  
  return declaration;
}
```

2. Remove the workaround object with custom getters (lines 134-168)

#### 3.3.2 `src/pages/assures.js`

**Function: `get_employee_declared_months(id)`**

**Current Logic:**
```javascript
function get_employee_declared_months(id){
  let declared = 0 
  for(let emp of DECLARATIONS.values()){
    if(emp.employee_id === id) declared++
  }
  return declared
}
```

**New Implementation:**
```javascript
function get_employee_declared_months(id){
  const employee = get_employee_by_id(id);
  if (!employee) return 0;
  
  // Find the employer of this employee
  let employer = null;
  for (let emp of EMPLOYERS.values()) {
    if (emp.get_employee(id)) {
      employer = emp;
      break;
    }
  }
  
  if (!employer) return 0;
  
  // Count declarations for this employer (each includes this employee)
  let declared = 0;
  for (let declaration of DECLARATIONS.values()) {
    if (declaration.employer_id === employer.id) {
      declared++;
    }
  }
  
  return declared;
}
```

#### 3.3.3 `src/pages/Historique.js`

**Status:** No direct changes needed
- Already displays declarations correctly
- Uses `declaration.total_contribution` and `declaration.penalties` which will be updated in the class
- Shows employee count from employer, not from declaration

#### 3.3.4 `src/pages/Dashboard.js`

**Status:** No direct changes needed
- Uses `declaration.total_contribution` which will be updated in the class
- Uses `declaration.employer_id` which remains unchanged

---

### 3.4 Data Generators and Examples

#### 3.4.1 `src/utils/example.js`

**Function: `generateExampleData()`**

**Current Logic:**
- Creates declarations per employee: `new Declaration(employee.id, employer.id, declarationDate)`

**New Implementation:**
- Create one declaration per month per employer (not per employee)
- Need to track which months have been declared for each employer

**New Implementation:**
```javascript
export function generateExampleData(
  employerCount = 5,
  employeePerEmployer = 8,
  declarationsPerEmployee = 6  // This becomes declarations per employer
) {
  // ... existing employer and employee generation code ...

  // Generate declarations per employer (not per employee)
  for (let i = 0; i < employerCount; i++) {
    const employer = /* ... get employer ... */;
    
    // Generate declarations for this employer
    for (let k = 0; k < declarationsPerEmployee; k++) {
      const declarationDate = faker.date.past({ days: 180 });
      
      // Create declaration for entire employer (no employee_id)
      const declaration = new Declaration(
        employer.id,  // Only employer_id, no employee_id
        declarationDate
      );

      DECLARATIONS.set(declaration.id, declaration);
    }
  }
}
```

**Function: `generateSingleDeclaration(employeeId, employerId)`**

**Current Signature:**
```javascript
export function generateSingleDeclaration(employeeId, employerId)
```

**New Signature:**
```javascript
export function generateSingleDeclaration(employerId)
```

**New Implementation:**
```javascript
export function generateSingleDeclaration(employerId) {
  const declaration = new Declaration(
    employerId,  // Only employer_id
    faker.date.past({ days: 90 })
  );
  
  DECLARATIONS.set(declaration.id, declaration);
  return declaration;
}
```

#### 3.4.2 `src/utils/data.js`

**Function: `generateRandomDataset()`**

**Current Logic:**
- Creates declarations per employee per month

**New Implementation:**
- Create declarations per employer per month
- Track unique month-employer combinations

**New Implementation:**
```javascript
export function generateRandomDataset({
  numEmployers = 10,
  minEmployees = 3,
  maxEmployees = 20,
  maxMonthsPerEmployee = 12,  // Rename to maxMonthsPerEmployer
  seed = undefined,
} = {}) {
  // ... existing code for employers and employees ...

  for (let i = 0; i < numEmployers; i++) {
    const employer = /* ... */;
    
    // Generate unique months for this employer
    const monthsDeclared = faker.number.int({
      min: 0,
      max: maxMonthsPerEmployee,
    });
    
    const months = faker.helpers.uniqueArray(
      () => faker.number.int({ min: 1, max: 12 }),
      Math.min(monthsDeclared, 12),
    );

    // Create one declaration per month for this employer
    for (const month of months) {
      // Create a date for this month
      const year = new Date().getFullYear();
      const declarationDate = new Date(year, month - 1, 1);
      
      const decl = new Declaration(employer.id, declarationDate);
      declarations.push(decl);
    }
  }
}
```

---

### 3.5 Tests (`src/lib/functions.test.js`)

#### 3.5.1 Update Declaration Creation in Tests

**Current:**
```javascript
const decl1 = new Declaration(employee.id, employer.id, new Date("2024-01-01"));
```

**New:**
```javascript
const decl1 = new Declaration(employer.id, new Date("2024-01-01"));
```

#### 3.5.2 Update Test Expectations

**Test: `get_employee_rights`**

**Current Expectation:**
- Creates 3 declarations for one employee
- Expects: 3 * (employee contribution + employer contribution)

**New Expectation:**
- Creates 3 declarations for employer (includes all employees)
- For the specific employee: 3 * (employee contribution + employer contribution)
- Logic remains the same, but calculation method changes

**Test: `get_employee_contribution`**

**Current Expectation:**
- Creates 2 declarations for one employee
- Expects: 2 * employee contribution

**New Expectation:**
- Creates 2 declarations for employer
- For the specific employee: 2 * employee contribution
- Logic remains the same

**Test: `get_employer_contribution`**

**Current Expectation:**
- Creates declarations per employee
- Sums employer contributions

**New Expectation:**
- Creates declarations per employer
- Each declaration includes all employees
- Sums employer contributions for all employees across all declarations

**Example Update:**
```javascript
it("should calculate total employer contribution for all declarations", () => {
  const employer = new Employer("Tech", "Company A", 100000);
  const employee1 = new Employee("John", 5000);
  const employee2 = new Employee("Jane", 4000);
  employer.add_employee(employee1);
  employer.add_employee(employee2);
  EMPLOYERS.set(employer.id, employer);

  // Create 2 declarations for the employer (not per employee)
  const decl1 = new Declaration(employer.id, new Date("2024-01-01"));
  const decl2 = new Declaration(employer.id, new Date("2024-02-01"));
  DECLARATIONS.set(decl1.id, decl1);
  DECLARATIONS.set(decl2.id, decl2);

  // Employer contribution per declaration:
  // employee1: 5000 * 0.08 = 400
  // employee2: 4000 * 0.08 = 320
  // Total per declaration: 720
  // For 2 declarations: 1440
  const contribution = FN.get_employer_contribution(employer.id);
  expect(contribution).toBe(1440);
});
```

**Test: `get_total_contributions`**

**Current Expectation:**
- Creates declarations per employee
- Sums all contributions

**New Expectation:**
- Creates declarations per employer
- Each declaration includes all employees
- Sums all declaration totals

**Test: `Declaration class`**

**Current Tests:**
- Test `total_contribution` for one employee
- Test `penalties` for one employee

**New Tests:**
- Test `total_contribution` for employer with multiple employees
- Test `penalties` for employer with multiple employees

**Example Update:**
```javascript
it("should calculate total_contribution correctly for all employees", () => {
  const employer = new Employer("Tech", "Company A", 100000);
  const employee1 = new Employee("John", 5000);
  const employee2 = new Employee("Jane", 4000);
  employer.add_employee(employee1);
  employer.add_employee(employee2);
  EMPLOYERS.set(employer.id, employer);

  const declaration = new Declaration(employer.id, new Date());

  // Employee1 contribution: 5000 * 0.04 = 200
  // Employee1 employer contribution: 5000 * 0.08 = 400
  // Employee2 contribution: 4000 * 0.04 = 160
  // Employee2 employer contribution: 4000 * 0.08 = 320
  // Total: 200 + 400 + 160 + 320 = 1080
  expect(declaration.total_contribution).toBe(1080);
});
```

---

## 4. Implementation Checklist

### Phase 1: Core Class Changes
- [ ] Update `Declaration` constructor to remove `employee_id` parameter
- [ ] Remove `this.employee_id` assignment
- [ ] Update `penalties` getter to iterate over all employees
- [ ] Update `total_contribution` getter to iterate over all employees
- [ ] Update JSDoc comments

### Phase 2: Function Updates
- [ ] Update `get_employee_rights()` to work without `employee_id`
- [ ] Update `get_employee_contribution()` to work without `employee_id`
- [ ] Update `get_employer_contribution()` to work without `employee_id`
- [ ] Update `get_total_contributions()` to use `total_contribution` getter
- [ ] Update `get_total_contributions_by_month()` to use `total_contribution` getter

### Phase 3: UI Components
- [ ] Update `declaration.js` to use `Declaration` class properly
- [ ] Remove workaround object in `declaration.js`
- [ ] Update `get_employee_declared_months()` in `assures.js`
- [ ] Verify `Historique.js` works correctly (should be fine)
- [ ] Verify `Dashboard.js` works correctly (should be fine)

### Phase 4: Data Generators
- [ ] Update `generateExampleData()` in `example.js`
- [ ] Update `generateSingleDeclaration()` signature and implementation
- [ ] Update `generateRandomDataset()` in `data.js`

### Phase 5: Tests
- [ ] Update all test declarations to use new constructor
- [ ] Update test expectations for `get_employee_rights`
- [ ] Update test expectations for `get_employee_contribution`
- [ ] Update test expectations for `get_employer_contribution`
- [ ] Update test expectations for `get_total_contributions`
- [ ] Update test expectations for `Declaration` class getters
- [ ] Run all tests and fix any failures

### Phase 6: Documentation
- [ ] Update README.md to reflect new Declaration structure
- [ ] Update any API documentation
- [ ] Add migration notes if needed

---

## 5. Potential Issues and Solutions

### Issue 1: Historical Data Compatibility
**Problem:** Existing declarations in the system may have `employee_id` set.

**Solution:**
- Option A: Migration script to convert old declarations (if needed)
- Option B: Make `employee_id` optional and handle both cases during transition
- Option C: Clear all existing declarations (if acceptable)

### Issue 2: Employee Rights Calculation
**Problem:** When an employee changes employers, their rights calculation becomes complex.

**Solution:**
- Track which employer an employee belonged to at declaration time
- Or: Calculate rights based on current employer's declarations only
- Clarify business requirement: Should employee rights include contributions from previous employers?

### Issue 3: Declaration Uniqueness
**Problem:** Need to prevent duplicate declarations for the same employer/month.

**Solution:**
- Add validation in `add_declaration()` to check for existing declaration for same `employer_id` and month
- Or: Allow multiple declarations per month (if business allows)

### Issue 4: Employee Count Changes
**Problem:** If employees are added/removed after a declaration is created, the declaration's totals don't change.

**Solution:**
- **This is correct behavior**: Declaration should reflect the state at declaration time
- If needed, store a snapshot of employees at declaration time (more complex)

---

## 6. Testing Strategy

### Unit Tests
1. Test Declaration class getters with 0, 1, and multiple employees
2. Test all functions with various scenarios
3. Test edge cases (no employees, no declarations, etc.)

### Integration Tests
1. Test full declaration flow: create → calculate → display
2. Test employee rights calculation across multiple declarations
3. Test employer contribution calculation

### Manual Testing
1. Create declarations through UI
2. Verify calculations in dashboard
3. Verify employee rights display
4. Verify historical view

---

## 7. Rollback Plan

If issues arise:
1. Keep old code in a branch
2. Revert Declaration constructor changes
3. Restore `employee_id` field
4. Restore old getter implementations
5. Restore old function implementations

---

## 8. Notes

- The `declaration.js` page already implements the desired behavior (declarations without `employee_id`), but uses a workaround. This refactoring will make it the official approach.
- The current `total_contribution` calculation divides employer contribution by employee count, which seems incorrect. The new implementation sums contributions for all employees, which is more logical.
- Consider adding validation to prevent duplicate declarations for the same employer/month combination.

---

## 9. Questions to Clarify

1. **Employee Rights**: Should employee rights include contributions from all employers they've worked for, or only the current employer?
2. **Declaration Uniqueness**: Can an employer submit multiple declarations for the same month?
3. **Historical Accuracy**: If an employee leaves an employer, should their past declarations still include them, or should declarations reflect current employees only?
4. **Penalty Calculation**: Should penalties be calculated per employee or per declaration total?

---

## End of Document

This refactoring plan provides a comprehensive guide to removing `employee_id` from the Declaration class while maintaining all functionality. Follow the phases sequentially and test thoroughly at each step.


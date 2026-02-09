# e-Social Systems

### Development
- Clone project 
```sh
git clone https://github.com/ayoubhanine/e-Social-Systems.git
```
- Install dependencies
```sh
npm install
```
- Start development server
```sh
npm run dev
```

### Building
```sh
npm run build
```

### Testing
```sh
npm test
```

---

## Functions Index

Quick Links: [Employee Functions](#employee-functions) | [Employer Functions](#employer-functions) | [Declaration Functions](#declaration-functions) | [Statistics Functions](#statistics-functions) | [Utility Functions](#utility-functions)

### Employee Functions

#### [get_employee_by_id(employee_id)](src/lib/functions.js#L7)
**Description:** Retrieve an employee object by their ID across all employers.  
**Returns:** `Employee | null`

#### [get_all_employees()](src/lib/functions.js#L16)
**Description:** Get an array of all employees from all employers.  
**Returns:** `Employee[]`

#### [get_employee_rights(employee_id)](src/lib/functions.js#L26)
**Description:** Calculate total contributions (employee + employer) for a specific employee.  
**Returns:** `number | null`

#### [add_employee(employer_id, employee)](src/lib/functions.js#L47)
**Description:** Add an employee to a specific employer.  
**Parameters:**
- `employer_id` (string)
- `employee` (Employee instance)

**Throws:** Error if employer not found or invalid employee

#### [get_employee_contribution(employee_id)](src/lib/functions.js#L90)
**Description:** Calculate total employee contribution across all their declarations.  
**Returns:** `number`  
**Throws:** Error if employee not found

---

### Employer Functions

#### [get_all_employers()](src/lib/functions.js#L98)
**Description:** Get an array of all employers in the system.
**Returns:** `Employer[]`

#### [get_employer_by_id(employer_id)](src/lib/functions.js#L76)
**Description:** Retrieve an employer object by their ID.  
**Returns:** `Employer | null`

#### [add_employer(employer)](src/lib/functions.js#L83)
**Description:** Add an employer to the system.  
**Parameters:** `employer` (Employer instance)  
**Throws:** Error if invalid employer

#### [get_employer_contribution(employer_id)](src/lib/functions.js#L103)
**Description:** Calculate total employer contribution for all their declarations.  
**Returns:** `number`

#### [get_highest_contributing_employer()](src/lib/functions.js#L170)
**Description:** Find the employer with the highest total contribution.  
**Returns:** `Employer | null`

#### [get_average_employee_salary()](src/lib/functions.js#L181)
**Description:** Calculate the average salary of all employees across all employers.  
**Returns:** `number`

---

### Declaration Functions

#### [add_declaration(declaration)](src/lib/functions.js#L61)
**Description:** Add a declaration to the system.  
**Parameters:** `declaration` (Declaration instance)  
**Throws:** Error if invalid declaration

---

### Statistics Functions

#### [get_total_contributions()](src/lib/functions.js#L150)
**Description:** Calculate the total of all contributions (employee + employer) across all declarations.  
**Returns:** `number`

#### [get_days_between_dates(d1, d2)](src/lib/functions.js#L120)
**Description:** Calculate the number of days between two dates.  
**Parameters:**
- `d1` (Date)
- `d2` (Date)

**Returns:** `number`

---

### Utility Functions

#### [select(selector)](src/utils/index.js#L1)
**Description:** Select a DOM element using CSS selector.  
**Returns:** `Element`  
**Throws:** Error if element not found

#### [html(strings, ...values)](src/utils/index.js#L10)
**Description:** Template literal tag for HTML with syntax highlighting.  
**Returns:** `string`

#### [css(strings, ...values)](src/utils/index.js#L16)
**Description:** Template literal tag for CSS with syntax highlighting.  
**Returns:** `string`

#### [sleep(ms)](src/utils/index.js#L22)
**Description:** Async sleep function using setTimeout.  
**Parameters:** `ms` (number) - milliseconds to sleep  
**Returns:** `Promise<void>`

#### [debounce(func, delay)](src/utils/index.js#L30)
**Description:** Debounce a function to limit how often it's called.  
**Parameters:**
- `func` (Function)
- `delay` (number) - delay in milliseconds

**Returns:** `Function` - debounced function

#### [generate_id()](src/utils/index.js#L42)
**Description:** Generate a random 8-character ID.  
**Returns:** `string`

---

## Data Models

### Employer Class
**Location:** [src/lib/classes.js](src/lib/classes.js)
- `id` - unique identifier
- `sector` - business sector
- `company_name` - company name
- `employees` - Set of Employee objects
- `income_per_month` - monthly revenue
- `penalties` - penalty amount
- `employee_count` - getter: number of employees
- `contribution` - getter: total contribution

### Employee Class
**Location:** [src/lib/classes.js](src/lib/classes.js)
- `id` - unique identifier
- `name` - employee name
- `salary` - monthly salary
- `months_declared` - number of months declared
- `contribution` - getter: calculated contribution (capped at 6000)

### Declaration Class
**Location:** [src/lib/classes.js](src/lib/classes.js)
- `id` - unique identifier
- `employee_id` - reference to employee
- `employer_id` - reference to employer
- `date` - declaration date
- `penalties` - getter: calculates 0.005% daily penalty for declarations submitted after 30 days
- `total_contribution` - getter: combined contribution (employee + employer)


## Branch Management

### Keep branch up to date
```sh
git pull origin main  // this will pull the latest changes from the main branch into your current branch
npm install 
```

### Create new branch
```sh
git checkout -b feature/example
```

### Push changes
```sh
git add . -v 
git commit -m "your commit message"
git push origin feature/your-branch-name
```

---

## Project Structure

```
src/
├── app.js                # Application entry point
├── router/
│   └── index.js          # Router and navigation logic
├── pages/                # Page components
│   ├── Dashboard.js
│   ├── déclaration.js
│   ├── Employeurs.js
│   ├── assures.js
│   ├── Historique.js
│   └── base.js
├── lib/
│   ├── classes.js        # Data models
│   ├── functions.js      # Business logic
│   └── functions.test.js # Unit tests
├── utils/
│   ├── index.js          # Utility functions
│   └── data.js           # Test data generation
└── data/
    └── index.js          # Global data stores
```

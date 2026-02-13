# e-Social Systems - Projet de simulation d'un organisme de sécurité sociale 
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

## Development
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

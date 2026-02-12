# e-Social Systems — Bug Fixes Todo List

**Project:** JavaScript application simulating a social security agency (CNSS-type)  
**Generated:** February 12, 2026

This document lists the bugs and improvements identified in the codebase, classified into 3 priority levels.

---

## Level 1 — Critical / High Priority

Bugs that cause incorrect calculations, crashes, or block core functionality.

| # | Ticket | Description | File(s) | Impact |
|---|--------|-------------|---------|--------|
| 1.1 | **Incorrect employer contribution calculation** | `get_employee_rights()` applies a cap to the employer share with `Math.min(employee.salary, 6000) * 0.08` whereas the employer share should not be capped. | `src/lib/functions.js` L51-52 | Wrong social rights totals |
| 1.2 | **Averaged employer share in `Declaration.total_contribution` and `penalties`** | Uses `employer.contribution / employer.employee_count` instead of the actual contribution per employee (`employee.salary * 0.08`). | `src/lib/classes.js` L129, L138 | Wrong amounts per declaration |
| 1.3 | **`generateExampleData()` called multiple times** | `assures.js`, `declaration.js`, and `Historique.js` all call `generateExampleData()` on load. Pages are imported together → data duplicated. | `src/pages/assures.js`, `declaration.js`, `Historique.js` | Data multiplied on each load |
| 1.4 | **Crash when employer missing in Dashboard** | `EMPLOYERS.get(decl.employer_id).company_name` with no null check → crash if `employer_id` is invalid. | `src/pages/Dashboard.js` L214 | Fatal error on dashboard |
| 1.5 | **Declaration form non-functional** | The "Déclarer" button only shows a toast; no `Declaration` creation, no month reading, no uniqueness validation (employer + month). | `src/pages/declaration.js` | Feature not implemented |
| 1.6 | **Add insured without employer selected** | `add_employee(employeurSelect.value, emp)` with `""` when no employer selected → `EMPLOYERS.get("")` = undefined → crash. | `src/pages/assures.js` L332 | Crash when adding insured without employer |
| 1.7 | **Duplicate employer list rows** | `displayEmployers()` does not clear `tbody` before populating; each submit appends rows without clearing previous ones. | `src/pages/Employeurs.js` L306-319 | Duplicates in table |
| 1.8 | **Tests vs implementation mismatch** | Tests use `new Employer("Tech", "Company A", 100000)` but `Employer` only accepts `(sector, company_name)`. | `src/lib/functions.test.js` | Test suite failing |

---

## Level 2 — Medium Priority

Bugs that alter expected behavior, UX, or do not comply with specs.

| # | Ticket | Description | File(s) | Impact |
|---|--------|-------------|---------|--------|
| 2.1 | **Employer sector options mismatch** | Form options (Technologie, Industrie, Commerce, etc.) do not match `sector_list` (Technology, Healthcare, Education, etc.). `"Technologie"` → fallback to `"Other"`. | `src/pages/Employeurs.js` L53-59, `src/lib/classes.js` | Sector always "Other" |
| 2.2 | **Dashboard typo** | Text "MSur l'ensemble des assurés" instead of "Sur l'ensemble des assurés". | `src/pages/Dashboard.js` L69 | Display error |
| 2.3 | **Duplicates in `get_all_employees()`** | If an employee appears under multiple employers, they may be returned multiple times. | `src/lib/functions.js` L24-31 | Duplicates in insured list |
| 2.4 | **Duplicate HTML IDs** | Two elements with `id="filter__employer"` (employer and month filters). | `src/pages/Historique.js` L43, L62 | Invalid HTML, selector issues |
| 2.5 | **Declaration uniqueness** | Spec requires uniqueness (employer + month). Current model is per employee/month; no duplicate check. | `src/lib/functions.js`, `src/pages/declaration.js` | Possible duplicates |
| 2.6 | **`Employee.months_declared` unused** | Property never updated; `get_employee_declared_months()` recalculates from declarations. | `src/lib/classes.js`, `src/pages/assures.js` | Dead code / confusion |
| 2.7 | **Late penalty logic unclear** | `days_late = days_since - 30` relative to declaration date, not a business deadline (e.g. end of next month). | `src/lib/classes.js` L123-129 | Ambiguous business logic |
| 2.8 | **`data.js` vs `example.js`** | `src/utils/data.js` uses `Employer(sector, company_name, income_per_month)` and `Declaration` with `month` (number); API incompatible with rest of project. | `src/utils/data.js` | Risk of incorrect usage |
| 2.9 | **Historique: `render_table` on array** | `Array.from(data.values())` on an array; `data` is already an array. Use `data` directly or `Array.from(data)`. | `src/pages/Historique.js` L354 | Redundancy / confusion |
| 2.10 | **"Salarie" column in Historique** | Displays `employer.employee_count` (total employees) instead of count for the declaration row (1 per line). | `src/pages/Historique.js` L418 | Misleading display |

---

## Level 3 — Low Priority

Improvements, code quality, and missing bonus features.

| # | Ticket | Description | File(s) | Impact |
|---|--------|-------------|---------|--------|
| 3.1 | **Anomaly detection (bonus)** | No implementation for abnormally high salary detection or business alerts. | To be created | Bonus feature missing |
| 3.2 | **Inconsistent rounding** | Some functions round (e.g. `Math.ceil`) at different levels; rounding strategy should be standardized. | `src/lib/functions.js`, `classes.js` | Inconsistent amounts |
| 3.3 | **Month input missing `id`** | Declaration month field has no `id`, so it cannot be read by script. | `src/pages/declaration.js` L30 | Cannot read month value |
| 3.4 | **Historique `cleanup` incomplete** | `reset_filters_handler`, `apply_filters_handler`, etc. are not removed in `cleanup`. | `src/pages/Historique.js` L420-427 | Potential memory leaks / listeners |
| 3.5 | **Example data placement** | Centralize `generateExampleData()` (e.g. in `app.js` or on router init) instead of in each page. | `src/pages/*.js`, `src/app.js` | Cleaner architecture |
| 3.6 | **`get_days_between_dates` tests** | Leap year test expects 29 days between 2020-02-01 and 2020-03-01; current logic may differ depending on implementation. Needs validation. | `src/lib/functions.test.js` L99-103 | Potentially fragile tests |
| 3.7 | **`html` import in `assures.js`** | `renderTable` uses `html\`...\`` but result is a string; verify HTML escaping for XSS prevention. | `src/pages/assures.js` | Security (if user data) |
| 3.8 | **Empty employer in Declarations select** | Ensure no empty or invalid option is added when employer list is empty. | `src/pages/declaration.js` L134-139 | UX / validation |

---

## Summary by Priority

| Priority | Ticket Count |
|----------|--------------|
| Level 1 — Critical | 8 |
| Level 2 — Medium | 10 |
| Level 3 — Low | 8 |

---

## Project Brief Compliance

| Requirement | Status |
|-------------|--------|
| Employer management (add, associate employees) | Partially OK — sector bug, duplication |
| Insured management (add, link, update salary) | Partially OK — employer validation missing |
| Monthly declaration | Not implemented |
| Declaration uniqueness (employer + month) | Not implemented |
| Contribution calculation (employee, employer, cap) | Calculation and cap bugs |
| Social rights (months declared, total contributions) | OK with calculation bugs |
| Late penalties | Logic needs clarification |
| Global statistics | OK with crash risk |
| History and filters | OK with minor bugs |
| Anomaly detection (bonus) | Not implemented |

---

## Suggested Fix Order

1. **Level 1**: Tickets 1.3 (duplicate data), 1.7 (duplicate employers), 1.6 (employer validation), 1.4 (Dashboard crash), 1.1–1.2 (calculations), 1.5 (declarations), 1.8 (tests).
2. **Level 2**: Fix sectors, typo, declaration uniqueness, IDs, penalties.
3. **Level 3**: Anomaly detection, code cleanup, rounding standardization.

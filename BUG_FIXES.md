# Project Bug Findings & Fix Plan

Date: 2026-02-11

## Summary

I scanned the codebase and identified several critical calculation and API mismatches that can produce falsy results or test failures. Below are the findings and proposed fixes.

## Findings & Fix Plans

- **Incorrect employer contribution cap**
  - Symptom: `get_employee_rights()` in `src/lib/functions.js` caps the employer share using `Math.min(employee.salary, 6000) * 0.08`.
  - Fix: Use `employee.salary * 0.08` for the employer portion. Add tests confirming employee share is capped at 6000 while employer share is uncapped.

- **Declaration uses averaged employer contribution**
  - Symptom: `Declaration.total_contribution` and `Declaration.penalties` (in `src/lib/classes.js`) compute the employer part as `employer.contribution / employer.employee_count` (an average) instead of the contribution for the specific employee.
  - Fix: Replace with `employee.salary * 0.08`. Update tests for per-declaration totals and penalties.

- **Example data / generator API mismatch**
  - Symptom: `src/utils/example.js` uses different function names and constructs `Declaration` with `month` numbers (not `Date`), and creates `Employer` with extra args. `src/app.js` imports `generateExampleData` which doesn't exist.
  - Fix: Add a single `generateExampleData()` entrypoint that populates `EMPLOYERS` and `DECLARATIONS` with correct types. Create declarations using `Date` objects. Align `Employer` constructor usage and fix imports in `src/app.js`.

- **Tests vs implementation constructor mismatch**
  - Symptom: Tests call `new Employer(..., income_per_month)` but `Employer` currently accepts only `(sector, company_name)`.
  - Fix: Prefer updating tests to match the current `Employer` signature (or add optional `income_per_month` to constructor if that data is required). Keep tests and generator consistent.

- **Day-difference rounding fragility**
  - Symptom: `get_days_between_dates()` uses `Math.round(...)` which can produce off-by-one errors due to time-of-day / timezone differences.
  - Fix: Normalize dates to UTC midnight and use `Math.floor(...)` for deterministic day counts. Add edge-case tests (same day, leap-year, timezone variations).

- **Inconsistent rounding**
  - Symptom: Some aggregations apply `Math.ceil` at different layers while getters produce raw floats, producing inconsistent totals.
  - Fix: Standardize rounding strategy: keep calculations precise in getters and apply `Math.ceil` only at reporting boundaries (or document and apply consistently). Update tests accordingly.

- **Optional: duplicate employees in `get_all_employees()`**
  - Symptom: If an employee can appear under multiple employers, `get_all_employees()` may include duplicates.
  - Fix: If uniqueness is intended, dedupe employees by `id` before returning.

## Next Steps

1. Apply the calculation fixes in `src/lib/functions.js` and `src/lib/classes.js` (priority).
2. Update `src/utils/example.js` and `src/app.js` to provide a working example data generator.
3. Update tests in `src/lib/functions.test.js` to match constructors and rounding rules.
4. Run the test suite and iterate until green.

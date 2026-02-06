import { generate_id } from "../utils"
export class Employer{
    constructor(sector, company_name , income_per_month ){
        this.id  = generate_id()
        this.sector = sector
        this.company_name = company_name
        this.employees = new Set()
        this.income_per_month = income_per_month
        this.penalties = 0
    }
    get employees_count(){
        return this.employees.size
    }
    get contribution(){
        let total= 0 
        for(let employee of this.employees){
            total+= employee.salary * 0.08 
        }
        return total
    }
    add_employee(employee){
        this.employees.add(employee)
    }
}

export class Employee{
    constructor(name, salary){
        this.id = generate_id()
        this.name = name
        this.salary = salary
        this.months_declared = 0
    }
    set_salary(new_salary){
        this.salary = new_salary
    }
    get contribution(){
        let salary = Math.min(this.salary , 6000) // cap the salary at 6000
        return salary * 0.04  
    }
}

export class Declaration{
    constructor(employee_id, employer_id, month){
        this.id = generate_id()
        this.employee_id = employee_id
        this.employer_id = employer_id
        this.month = month
    }
}
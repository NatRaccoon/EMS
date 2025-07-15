import { create } from 'zustand'
import { Employee, sampleEmployees } from '../types/employee.data'


interface State {
  employees: Employee[]
  selectedEmployee: Employee | null
  setEmployees: (list: Employee[]) => void
  selectEmployee: (emp: Employee | null) => void
  addOrUpdateEmployee: (emp: Employee) => void
  deleteEmployee: (id: string) => void
}

export const useEmployeeStore = create<State>((set, get) => ({
  employees: sampleEmployees,
  selectedEmployee: null,

  setEmployees: (list) => set({ employees: list }),
  selectEmployee: (emp) => set({ selectedEmployee: emp }),

  addOrUpdateEmployee: (emp) => {
    const employees = get().employees
    const index = employees.findIndex((e) => e.id === emp.id)
    if (index !== -1) {
      employees[index] = emp
    } else {
      employees.push(emp)
    }
    set({ employees: [...employees] })
  },

  deleteEmployee: (id) => {
    const employees = get().employees.filter((e) => e.id !== id)
    set({ employees })
  },
}))
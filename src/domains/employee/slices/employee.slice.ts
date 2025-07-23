import { create } from 'zustand'
// import { Employee } from '../types/employee.data'
import { Employee } from '@/types'

// Allow id to be optional for new employees
export type EmployeeInput = Omit<Employee, 'id'> & { id?: string };

interface State {
  employees: Employee[]
  selectedEmployee: Employee | null
  setEmployees: (list: Employee[]) => void
  selectEmployee: (emp: Employee | null) => void
  addOrUpdateEmployee: (emp: EmployeeInput) => Promise<void>
  deleteEmployee: (id: string) => Promise<void>
  fetchEmployees: () => Promise<void>
}

export const useEmployeeStore = create<State>((set, get) => ({
  employees: [],
  selectedEmployee: null,

  setEmployees: (list) => set({ employees: list }),
  selectEmployee: (emp) => set({ selectedEmployee: emp }),

  fetchEmployees: async () => {
    const res = await fetch('http://localhost:3001/employees');
    const data = await res.json();
    set({ employees: data });
  },

  addOrUpdateEmployee: async (emp) => {
    if (emp.id) {
      // Update (PATCH)
      const res = await fetch(`http://localhost:3001/employees/${emp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emp),
      });
      const updated = await res.json();
      set((state) => ({
        employees: state.employees.map(e => e.id === emp.id ? { ...e, ...updated } : e)
      }));
    } else {
      // Add (POST)
      const res = await fetch('http://localhost:3001/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emp),
      });
      const newEmp = await res.json();
      set((state) => ({ employees: [...state.employees, newEmp] }));

      // Add user for this employee
      try {
        // Dynamically import department store to avoid circular deps
        const { useDepartmentStore } = await import('../../department/slices/department.slice');
        const departments = useDepartmentStore.getState().departments;
        const departmentName = departments.find(d => d.id === newEmp.departmentId)?.name || '';
        const password = `${newEmp.firstName}${newEmp.lastName}`.toLowerCase();
        const user = {
          id: newEmp.id,
          name: `${newEmp.firstName} ${newEmp.lastName}`,
          email: newEmp.email,
          role: 'employee',
          permissions: ['self'],
          department: departmentName,
          employeeId: newEmp.employeeId,
          password: password,
          photo: '', // Default photo, can be updated later
          mustChangePassword: true, // Require password change on first login
        };
        const userRes = await fetch('http://localhost:3001/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
        if (!userRes.ok) throw new Error('Failed to add user');
        // Simulate sending welcome email
        console.log(
          `Welcome email to: ${user.email}\n` +
          `Hi ${user.name},\n` +
          `You have been added to the Employee Management System.\n` +
          `Login at: http://localhost:3000/auth/login\n` +
          `Email: ${user.email}\n` +
          `Password: ${user.password}\n` +
          `You will be required to change your password on first login.`
        );
      } catch (err) {
        console.error('Error creating user for new employee:', err);
      }
    }
  },

  deleteEmployee: async (id) => {
    await fetch(`http://localhost:3001/employees/${id}`, { method: 'DELETE' });
    // Also delete the corresponding user
    await fetch(`http://localhost:3001/users/${id}`, { method: 'DELETE' });
    set((state) => ({ employees: state.employees.filter(e => e.id !== id) }));
  },
}));
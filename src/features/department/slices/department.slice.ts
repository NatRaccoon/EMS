import { create } from 'zustand';
import { Department } from '../types/department.data';

type DepartmentAuditLog = {
  id: string;
  type: 'add' | 'update' | 'delete';
  departmentId: string;
  timestamp: string;
  summary: string;
};

type DepartmentState = {
  departments: Department[];
  auditLog: DepartmentAuditLog[];
  fetchDepartments: () => Promise<void>;
  addDepartment: (dept: Department) => Promise<void>;
  updateDepartment: (id: string, data: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  getAuditLog: () => DepartmentAuditLog[];
};

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: [],
  auditLog: [],

  fetchDepartments: async () => {
    const res = await fetch('http://localhost:3001/departments');
    const data = await res.json();
    set({ departments: data });
  },

  addDepartment: async (dept) => {
    const res = await fetch('http://localhost:3001/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dept),
    });
    const newDept = await res.json();
    set((state) => ({
      departments: [...state.departments, newDept],
      auditLog: [
        ...state.auditLog,
        {
          id: `${newDept.id}-add-${Date.now()}`,
          type: 'add',
          departmentId: newDept.id,
          timestamp: new Date().toISOString(),
          summary: `Added department '${newDept.name}'`,
        },
      ],
    }));
  },

  updateDepartment: async (id, data) => {
    const res = await fetch(`http://localhost:3001/departments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    const dept = get().departments.find((d) => d.id === id);
    set((state) => ({
      departments: state.departments.map((d) => d.id === id ? { ...d, ...updated } : d),
      auditLog: dept
        ? [
            ...state.auditLog,
            {
              id: `${id}-update-${Date.now()}`,
              type: 'update',
              departmentId: id,
              timestamp: new Date().toISOString(),
              summary: `Updated department '${dept.name}'`,
            },
          ]
        : state.auditLog,
    }));
  },

  deleteDepartment: async (id) => {
    await fetch(`http://localhost:3001/departments/${id}`, { method: 'DELETE' });
    const dept = get().departments.find((d) => d.id === id);
    set((state) => ({
      departments: state.departments.filter((d) => d.id !== id),
      auditLog: dept
        ? [
            ...state.auditLog,
            {
              id: `${id}-delete-${Date.now()}`,
              type: 'delete',
              departmentId: id,
              timestamp: new Date().toISOString(),
              summary: `Deleted department '${dept.name}'`,
            },
          ]
        : state.auditLog,
    }));
  },

  getAuditLog: () => get().auditLog,
})); 
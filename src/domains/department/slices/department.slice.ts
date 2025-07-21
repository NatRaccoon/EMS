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
  addDepartment: (dept: Department) => void;
  updateDepartment: (id: string, data: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  getAuditLog: () => DepartmentAuditLog[];
};

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: [],
  auditLog: [],
  addDepartment: (dept) => set((state) => ({
    departments: [...state.departments, dept],
    auditLog: [
      ...state.auditLog,
      {
        id: `${dept.id}-add-${Date.now()}`,
        type: 'add',
        departmentId: dept.id,
        timestamp: new Date().toISOString(),
        summary: `Added department '${dept.name}'`,
      },
    ],
  })),
  updateDepartment: (id, data) => set((state) => {
    const dept = state.departments.find((d) => d.id === id);
    return {
      departments: state.departments.map((d) => d.id === id ? { ...d, ...data } : d),
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
    };
  }),
  deleteDepartment: (id) => set((state) => {
    const dept = state.departments.find((d) => d.id === id);
    return {
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
    };
  }),
  getAuditLog: () => get().auditLog,
})); 
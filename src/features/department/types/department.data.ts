export type Department = {
  id: string;
  name: string;
  managerId?: string;
  parentId?: string; // For sub-departments
} 
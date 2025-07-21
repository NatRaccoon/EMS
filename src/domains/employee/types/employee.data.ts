export type Employee = {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'inactive';
  departmentId?: string;
}

export const sampleEmployees: Employee[] = [
  {
    id: '1',
    name: 'Jane Doe',
    role: 'Software Engineer',
    status: 'active',
    email: 'jane@example.com',
  },
  {
    id: '2',
    name: 'John Smith',
    role: 'Product Manager',
    status: 'inactive',
    email: 'john@example.com',
  }
]
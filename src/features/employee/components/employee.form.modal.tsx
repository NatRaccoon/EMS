'use client'
import { useState, useEffect, useContext } from 'react'
import { useEmployeeStore } from '../slices/employee.slice'
import { Employee } from '@/types/index'
import { useDepartmentStore } from '../../department/slices/department.slice'
import Select from 'react-select';
import { AppContext } from '@/domains/auth/context/AppContext';


export default function EmployeeFormModal({ employee, onClose }: { employee?: Employee, onClose: () => void }) {

function generateEmployeeId() {
  return 'EMP' + Date.now();
}

const EMPTY_EMPLOYEE: Employee = {
  id: '',
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  departmentId: '',
  managerId: '',
  status: 'active',
  startDate: new Date().toISOString().slice(0, 10),
  salary: 0,
  photo: '',
  emergencyContact: {
    name: '',
    phone: '',
    relationship: '',
  },
  workSchedule: {
    monday: '9:00 AM - 5:00 PM',
    tuesday: '9:00 AM - 5:00 PM',
    wednesday: '9:00 AM - 5:00 PM',
    thursday: '9:00 AM - 5:00 PM',
    friday: '9:00 AM - 5:00 PM',
    saturday: 'Off',
    sunday: 'Off',
  },
  documents: [],
  notes: '',
};
const [form, setForm] = useState<Employee>({ ...EMPTY_EMPLOYEE });

const { departments, fetchDepartments } = useDepartmentStore();

useEffect(() => {
  fetchDepartments();
}, [fetchDepartments]);

useEffect(() => {
  if (employee) {
    setForm(employee);
  } else {
    setForm({ ...EMPTY_EMPLOYEE }); // Always start with all fields
  }
}, [employee]);

  const { addOrUpdateEmployee } = useEmployeeStore()
  const appCtx = useContext(AppContext);

  const handleSubmit = () => {
    let payload;
    if (employee) {
      // Merge form changes with original employee object
      payload = { ...employee, ...form };
      console.log("Form",form);
      console.log("First",payload);
    } else {
      // New employee: require minimal fields, auto-generate the rest
      const { id, ...rest } = EMPTY_EMPLOYEE; // Remove id
      console.log("Second",rest);
      payload = {
        ...rest,
        ...form, // form is always full
        employeeId: generateEmployeeId(),
        // Do NOT set id here!
      };
    }
    console.log('Employee payload:', payload); // Debug: see all fields
    addOrUpdateEmployee(payload);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="font-bold text-lg mb-4">{employee ? 'Edit' : 'Add'} Employee</h2>
        <input className="border p-2 mb-2 w-full" placeholder="First Name" value={form.firstName || ''} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <input className="border p-2 mb-2 w-full" placeholder="Last Name" value={form.lastName || ''} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        <input className="border p-2 mb-2 w-full" placeholder="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="border p-2 mb-2 w-full" placeholder="Position" value={form.position || ''} onChange={e => setForm({ ...form, position: e.target.value })} />
        <Select
          classNamePrefix="react-select"
          options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
          value={departments.find(dept => dept.id === form.departmentId) ? { value: form.departmentId, label: departments.find(dept => dept.id === form.departmentId)?.name || '' } : null}
          onChange={option => setForm({ ...form, departmentId: option && option.value ? option.value : '' })}
          isClearable
          placeholder="Select or search for a department..."
        />
        {/* Optionally, add department/manager selectors here in the future */}
        <div className="flex justify-end gap-2 mt-5">
          <button className="text-gray-700" onClick={onClose}>Cancel</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  )
}
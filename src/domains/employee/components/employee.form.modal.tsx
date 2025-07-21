'use client'
import { useState, useEffect } from 'react'
import { useEmployeeStore } from '../slices/employee.slice'
import { Employee } from '../types/employee.data'
import { useDepartmentStore } from '../../department/slices/department.slice'


export default function EmployeeFormModal({ employee, onClose }: { employee?: Employee, onClose: () => void }) {

const EMPTY_EMPLOYEE: Employee = {
  id: '',
  name: '',
  role: '',
  email: '',
  status: 'active',
}
const [form, setForm] = useState<Employee>(EMPTY_EMPLOYEE)

useEffect(() => {
  if (employee) {
    setForm(employee)
  } else {
    setForm({
      ...EMPTY_EMPLOYEE,
      id: Date.now().toString(),
    })
  }
}, [employee])

  const { addOrUpdateEmployee } = useEmployeeStore()
  const { departments } = useDepartmentStore()

  const handleSubmit = () => {
    addOrUpdateEmployee(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="font-bold text-lg mb-4">{employee ? 'Edit' : 'Add'} Employee</h2>
        <input className="border p-2 mb-2 w-full" placeholder="Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2 mb-2 w-full" placeholder="Role" value={form.role || ''} onChange={e => setForm({ ...form, role: e.target.value })} />
        <input className="border p-2 mb-2 w-full" placeholder="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
        <select className="border p-2 mb-2 w-full" value={form.departmentId || ''} onChange={e => setForm({ ...form, departmentId: e.target.value })}>
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
        <select className="flex flex-col border p-2 mb-4 w-full" value={form.status || 'active'} onChange={e => setForm({ ...form, status: e.target.value as any })}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="flex justify-end gap-2">
          <button className="text-gray-700" onClick={onClose}>Cancel</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  )
}
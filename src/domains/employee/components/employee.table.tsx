'use client'

import { useEmployeeStore } from "../slices/employee.slice"

export default function EmployeeTable({ onEdit, onView }: any) {
  const { employees, deleteEmployee } = useEmployeeStore()

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="px-4 py-2 border">Name</th>
          <th className="px-4 py-2 border">Role</th>
          <th className="px-4 py-2 border">Status</th>
          <th className="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(emp  => (
          <tr key={emp.id}>
            <td className="px-4 py-2 border">{emp.name}</td>
            <td className="px-4 py-2 border">{emp.role}</td>
            <td className="px-4 py-2 border">
              <span className={`px-2 py-1 text-xs rounded \${emp.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {emp.status}
              </span>
            </td>
            <td className="px-4 py-2 border space-x-2">
              <button className="text-blue-600" onClick={() => onView(emp)}>View</button>
              <button className="text-yellow-600" onClick={() => onEdit(emp)}>Edit</button>
              <button className="text-red-600" onClick={() => deleteEmployee(emp.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
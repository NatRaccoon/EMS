'use client'

import { Employee } from "../types/employee.data"


export default function EmployeeDetailModal({ employee, onClose }: { employee: Employee, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-full max-w-sm">
        <h2 className="font-bold text-lg mb-4">Employee Details</h2>
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Role:</strong> {employee.role}</p>
        <p><strong>Status:</strong> {employee.status}</p>
        <button className="mt-4 bg-gray-700 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
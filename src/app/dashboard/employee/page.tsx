'use client'
import EmployeeDetailModal from '@/domains/employee/components/employee.detail.modal'
import EmployeeFormModal from '@/domains/employee/components/employee.form.modal'
import EmployeeTable from '@/domains/employee/components/employee.table'
import { Employee } from '@/domains/employee/types/employee.data'
import { useState } from 'react'


export default function EmployeePage() {
  const [editEmp, setEditEmp] = useState<Employee | undefined>()
  const [viewEmp, setViewEmp] = useState<Employee | undefined>()

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Employee Directory</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setEditEmp({} as any)}>Add Employee</button>
      </div>
      <EmployeeTable onEdit={setEditEmp} onView={setViewEmp} />
      {editEmp && <EmployeeFormModal employee={editEmp} onClose={() => setEditEmp(undefined)} />}
      {viewEmp && <EmployeeDetailModal employee={viewEmp} onClose={() => setViewEmp(undefined)} />}
    </div>
  )
}
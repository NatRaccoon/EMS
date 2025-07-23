"use client"
import React, { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '@/domains/auth/context/AppContext';
import { useAuth } from '@/domains/auth/context/AuthContext';

import { Users, Building, Shield, Edit, Save, X } from 'lucide-react';
import { Employee } from '@/types';

interface RoleAssignment {
  employeeId: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  department: string;
  manager?: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const appCtx = useContext(AppContext);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [roleAssignment, setRoleAssignment] = useState<RoleAssignment>({
    employeeId: '',
    role: 'employee',
    department: '',
    manager: ''
  });

  // Only allow admin access
  if (!user || user.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <Shield size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Access Denied</h2>
          <p className="text-red-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setRoleAssignment({
      employeeId: employee.employeeId,
      role: 'employee', // Default role, would need to be fetched from user data
      department: employee.departmentId,
      manager: employee.managerId
    });
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    if (selectedEmployee && appCtx) {
      appCtx.updateEmployee(selectedEmployee.id, {
        departmentId: roleAssignment.department,
        managerId: roleAssignment.manager || ''
      });
      setIsEditing(false);
      setSelectedEmployee(null);
    }
  };

  const departments = appCtx?.departments || [];
  const employees = appCtx?.employees || [];

  function getDepartmentName(departmentId: string) {
    return departments.find(d => d.id === departmentId)?.name || 'N/A';
  }
  function getManagerName(managerId: string) {
    const mgr = employees.find(e => e.id === managerId);
    return mgr ? `${mgr.firstName} ${mgr.lastName}` : 'N/A';
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage employee roles, departments, and permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Employee Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Users size={24} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Employee Management</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                    <p className="text-xs text-gray-500">
                      Department: {getDepartmentName(employee.departmentId)} | Manager: {getManagerName(employee.managerId)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Building size={24} className="text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Department Overview</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {departments.map((dept) => {
                const deptEmployees = employees.filter(emp => emp.departmentId === dept.id) || [];
                const managers = deptEmployees.filter(emp => emp.managerId === 'N/A' || emp.managerId === emp.id);
                
                return (
                  <div key={dept.id || dept.name} className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">{dept.name}</h3>
                    <div className="text-sm text-gray-600">
                      <p>Employees: {deptEmployees.length}</p>
                      <p>Managers: {managers.length}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Edit {selectedEmployee.firstName} {selectedEmployee.lastName}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={roleAssignment.department}
                  onChange={(e) => setRoleAssignment({...roleAssignment, department: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveChanges}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client"
import React, { useState } from 'react';
import { AttendanceProvider } from '@/domains/attendance/context/AttendanceContext';
import TimerWidget from '@/domains/attendance/components/TimerWidget';
import ManualEntryForm from '@/domains/attendance/components/ManualEntryForm';
import LogList from '@/domains/attendance/components/LogList';
import TimesheetView from '@/domains/attendance/components/TimesheetView';
import ReportsDashboard from '@/domains/attendance/components/ReportsDashboard';
import { useAuth } from '@/domains/auth/context/AuthContext';
import { Clock, Edit, List, FileText, BarChart2, Users, UserCheck } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '@/domains/auth/context/AppContext';
import { User } from '@/shared/types';

const TABS = [
  { id: 'timer', label: 'Timer', icon: <Clock size={18} /> },
  { id: 'manual', label: 'Manual Entry', icon: <Edit size={18} /> },
  { id: 'logs', label: 'Logs', icon: <List size={18} /> },
  { id: 'timesheet', label: 'Timesheet', icon: <FileText size={18} /> },
  { id: 'reports', label: 'Reports', icon: <BarChart2 size={18} /> },
];

const HIGH_LEVEL_TAB = { id: 'team', label: 'Team/Employee Attendance', icon: <Users size={18} /> };

const TAB_DESCRIPTIONS: Record<string, string> = {
  timer: 'Track your work in real time. Start and stop the timer as you work.',
  manual: 'Manually log time for past activities or corrections.',
  logs: 'View and manage all your time logs.',
  timesheet: 'Generate and review your timesheets for payroll and reporting.',
  reports: 'Analyze your productivity and time allocation.',
  team: 'View and manage attendance for your team or employees.',
};

function useEmployeeListForUser(user: User) {
  // Use AppContext for richer employee data
  const appCtx = useContext(AppContext);
  if (!user || !appCtx) {
    console.log('AppContext or user missing:', { user, appCtx });
    return [];
  }
  const { employees } = appCtx;
  let filtered: any[] = [];
  
  if (user.role === 'admin' || user.role === 'hr') {
    // Admin and HR can see all employees
    filtered = employees;
  } else if (user.role === 'manager') {
    // Manager can see:
    // 1. Direct reports (employees where manager matches user name/id)
    // 2. All employees in their department (if they manage a department)
    const directReports = employees.filter(
      (emp) => emp.manager === user.name || emp.manager === user.id || emp.manager === user.employeeId
    );
    
    // For department-based management, managers can see all employees in their department
    const departmentEmployees = employees.filter(
      (emp) => emp.department === user.department && emp.id !== user.id
    );
    
    // Combine both sets, removing duplicates
    const allVisibleEmployees = [...directReports, ...departmentEmployees];
    filtered = allVisibleEmployees.filter((emp, index, arr) => 
      arr.findIndex(e => e.id === emp.id) === index
    );
  }
  
  console.log('Filtering employees for user:', user, 'Result:', filtered);
  return filtered;
}

function TeamAttendanceTab({ currentUser }: { currentUser: User }) {
  const employees = useEmployeeListForUser(currentUser);
  const [selectedId, setSelectedId] = useState(employees[0]?.employeeId || '');
  const selected = employees.find((e) => e.employeeId === selectedId);
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Team/Employee Attendance</h2>
            <p className="text-gray-600">Manage and view attendance for your team members</p>
          </div>
        </div>
        
        {/* Employee Selection */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <label className="font-semibold text-gray-700 flex items-center gap-2">
            <UserCheck size={16} />
            Select Employee:
          </label>
          <select
            className="border rounded-lg px-4 py-2 flex-1 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
          >
            {employees.map(emp => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.firstName} {emp.lastName} ({emp.position})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Info Card */}
      {selected && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {selected.firstName} {selected.lastName}
              </h3>
              <p className="text-gray-600">{selected.position}</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div><span className="font-medium">Department:</span> {selected.department}</div>
              <div><span className="font-medium">Manager:</span> {selected.manager}</div>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      {(!employees || employees.length === 0) ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-medium mb-2">No employees found for your role</div>
          <div className="text-red-500 text-sm">Check if AppContext is provided and employee data is loaded. See console for debug info.</div>
        </div>
      ) : selected ? (
        <div className="space-y-6">
          {/* Logs Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Time Logs</h3>
            </div>
            <div className="p-4">
              <LogList employeeId={selected.employeeId} />
            </div>
          </div>

          {/* Timesheet Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Timesheet</h3>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors"
                onClick={() => {}}
                disabled
                title="Export to Excel coming soon!"
              >
                <FileText size={16} /> Export to Excel
              </button>
            </div>
            <div className="p-4">
              <TimesheetView employeeId={selected.employeeId} enableExport={true} />
            </div>
          </div>

          {/* Reports Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Reports</h3>
            </div>
            <div className="p-4">
              <ReportsDashboard employeeId={selected.employeeId} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-gray-500">Select an employee to view attendance</div>
        </div>
      )}
    </div>
  );
}

const AttendancePage = () => {
  const [tab, setTab] = useState('timer');
  const { user } = useAuth();
  if (!user) return null;
  const employeeId = user.employeeId || user.id;
  const isHighLevel = ['admin', 'hr', 'manager'].includes(user.role);
  const tabs = isHighLevel ? [...TABS, HIGH_LEVEL_TAB] : TABS;

  return (
    <AttendanceProvider>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance & Time Tracking</h1>
          <p className="text-gray-600 text-lg">
            {isHighLevel 
              ? "Manage your own time and oversee team attendance. Track hours, generate reports, and export data."
              : "Log your work hours, generate timesheets, and gain insights into your productivity."
            }
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-8 justify-center">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50
                ${tab === t.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Description */}
        <div className="mb-6 text-center text-gray-600 text-sm min-h-[24px]">
          {TAB_DESCRIPTIONS[tab]}
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-200">
          {tab === 'timer' && <TimerWidget employeeId={employeeId} />}
          {tab === 'manual' && <ManualEntryForm employeeId={employeeId} />}
          {tab === 'logs' && <LogList employeeId={employeeId} />}
          {tab === 'timesheet' && (
            <div>
              <TimesheetView employeeId={employeeId} enableExport={isHighLevel} />
            </div>
          )}
          {tab === 'reports' && <ReportsDashboard employeeId={employeeId} />}
          {tab === 'team' && isHighLevel && <TeamAttendanceTab currentUser={user} />}
        </div>
      </div>
    </AttendanceProvider>
  );
};

export default AttendancePage;

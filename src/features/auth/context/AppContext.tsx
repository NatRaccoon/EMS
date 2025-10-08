"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Employee,
  Department,
  AttendanceRecord,
  LeaveRequest,
  Task,
  PerformanceReview,
  PayrollRecord,
  Notification,
  Shift,
} from '@/types/index';

interface AppContextType {
  employees: Employee[];
  departments: Department[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  tasks: Task[];
  performanceReviews: PerformanceReview[];
  payrollRecords: PayrollRecord[];
  notifications: Notification[];
  shifts: Shift[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveRequest: (id: string, request: Partial<LeaveRequest>) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  addAttendanceRecord: (record: AttendanceRecord) => void;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export { AppContext };

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  // Fetch all data on mount
  useEffect(() => {
    fetch('http://localhost:3001/employees').then(res => res.json()).then(setEmployees);
    fetch('http://localhost:3001/departments').then(res => res.json()).then(setDepartments);
    fetch('http://localhost:3001/attendanceRecords').then(res => res.json()).then(setAttendanceRecords);
    fetch('http://localhost:3001/leaveRequests').then(res => res.json()).then(setLeaveRequests);
    fetch('http://localhost:3001/tasks').then(res => res.json()).then(setTasks);
    fetch('http://localhost:3001/performanceReviews').then(res => res.json()).then(setPerformanceReviews);
    fetch('http://localhost:3001/payrollRecords').then(res => res.json()).then(setPayrollRecords);
    fetch('http://localhost:3001/notifications').then(res => res.json()).then(setNotifications);
    fetch('http://localhost:3001/shifts').then(res => res.json()).then(setShifts);
  }, []);

  const sendWelcomeEmail = (user: any) => {
    // In production, replace this with an API call to your backend/email service
    console.log(
      `Welcome email to: ${user.email}\n` +
      `Hi ${user.name},\n` +
      `You have been added to the Employee Management System.\n` +
      `Login at: http://localhost:3000/auth/login\n` +
      `Email: ${user.email}\n` +
      `Password: ${user.password}\n` +
      `You will be required to change your password on first login.`
    );
  };

  const addEmployee = async (employee: Employee) => {
    try {
      // 1. Add to employees
      console.log('Attempting to add employee:', employee);
      const res = await fetch('http://localhost:3001/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });
      if (!res.ok) throw new Error('Failed to add employee');
      const newEmp = await res.json();
      setEmployees(prev => [...prev, newEmp]);
      console.log('Employee added:', newEmp);

      // 2. Add to users
      const password = `${newEmp.firstName}${newEmp.lastName}`.toLowerCase();
      const departmentName = departments.find(d => d.id === newEmp.departmentId)?.name || '';
      const user = {
        id: newEmp.id,
        name: `${newEmp.firstName} ${newEmp.lastName}`,
        email: newEmp.email,
        role: 'employee',
        permissions: ['self'],
        department: departmentName,
        employeeId: newEmp.employeeId,
        password: password
      };
      console.log('Attempting to add user:', user);
      const userRes = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!userRes.ok) throw new Error('Failed to add user');
      const newUser = await userRes.json();
      console.log('User added:', newUser);

      sendWelcomeEmail(user);
    } catch (err) {
      console.error('Error in addEmployee:', err);
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    const res = await fetch(`http://localhost:3001/employees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    });
    const updated = await res.json();
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updated } : emp));
  };

  const deleteEmployee = async (id: string) => {
    await fetch(`http://localhost:3001/employees/${id}`, { method: 'DELETE' });
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const addLeaveRequest = async (request: LeaveRequest) => {
    const res = await fetch('http://localhost:3001/leaveRequests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const newReq = await res.json();
    setLeaveRequests(prev => [...prev, newReq]);
  };

  const updateLeaveRequest = async (id: string, requestData: Partial<LeaveRequest>) => {
    const res = await fetch(`http://localhost:3001/leaveRequests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    const updated = await res.json();
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, ...updated } : req));
  };

  const addTask = async (task: Task) => {
    const res = await fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const newTask = await res.json();
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    const res = await fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    const updated = await res.json();
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updated } : task));
  };

  const addAttendanceRecord = async (record: AttendanceRecord) => {
    const res = await fetch('http://localhost:3001/attendanceRecords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    const newRec = await res.json();
    setAttendanceRecords(prev => [...prev, newRec]);
  };

  const markNotificationAsRead = async (id: string) => {
    await fetch(`http://localhost:3001/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
    setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));
  };

  // Add similar CRUD for departments, performanceReviews, payrollRecords, shifts as needed

  return (
    <AppContext.Provider
      value={{
        employees,
        departments,
        attendanceRecords,
        leaveRequests,
        tasks,
        performanceReviews,
        payrollRecords,
        notifications,
        shifts,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addLeaveRequest,
        updateLeaveRequest,
        addTask,
        updateTask,
        addAttendanceRecord,
        markNotificationAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

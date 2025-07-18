import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Employee, Department, AttendanceRecord, LeaveRequest, Task, PerformanceReview, PayrollRecord, Notification, Shift } from '../types';

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
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Mock data
const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Admin',
    email: 'john.admin@company.com',
    phone: '+1 555-0101',
    position: 'System Administrator',
    department: 'IT',
    manager: 'N/A',
    status: 'active',
    startDate: '2020-01-15',
    salary: 75000,
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    emergencyContact: {
      name: 'Jane Admin',
      phone: '+1 555-0102',
      relationship: 'Spouse'
    },
    workSchedule: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'Off',
      sunday: 'Off'
    },
    documents: [
      { id: '1', name: 'Employment Contract', type: 'contract', url: '#', uploadDate: '2020-01-15', size: '2.5 MB' },
      { id: '2', name: 'ID Copy', type: 'id', url: '#', uploadDate: '2020-01-15', expiryDate: '2025-01-15', size: '1.2 MB' }
    ],
    notes: 'Excellent system administrator with strong leadership skills.'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 555-0201',
    position: 'HR Manager',
    department: 'Human Resources',
    manager: 'John Admin',
    status: 'active',
    startDate: '2020-03-01',
    salary: 68000,
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    emergencyContact: {
      name: 'Mike Johnson',
      phone: '+1 555-0202',
      relationship: 'Spouse'
    },
    workSchedule: {
      monday: '8:30 AM - 4:30 PM',
      tuesday: '8:30 AM - 4:30 PM',
      wednesday: '8:30 AM - 4:30 PM',
      thursday: '8:30 AM - 4:30 PM',
      friday: '8:30 AM - 4:30 PM',
      saturday: 'Off',
      sunday: 'Off'
    },
    documents: [
      { id: '3', name: 'Employment Contract', type: 'contract', url: '#', uploadDate: '2020-03-01', size: '2.1 MB' },
      { id: '4', name: 'HR Certification', type: 'certificate', url: '#', uploadDate: '2020-03-01', size: '1.8 MB' }
    ],
    notes: 'Experienced HR professional with excellent communication skills.'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike.chen@company.com',
    phone: '+1 555-0301',
    position: 'Senior Developer',
    department: 'Engineering',
    manager: 'Sarah Johnson',
    status: 'active',
    startDate: '2021-06-15',
    salary: 95000,
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    emergencyContact: {
      name: 'Lisa Chen',
      phone: '+1 555-0302',
      relationship: 'Sister'
    },
    workSchedule: {
      monday: '10:00 AM - 6:00 PM',
      tuesday: '10:00 AM - 6:00 PM',
      wednesday: '10:00 AM - 6:00 PM',
      thursday: '10:00 AM - 6:00 PM',
      friday: '10:00 AM - 6:00 PM',
      saturday: 'Off',
      sunday: 'Off'
    },
    documents: [
      { id: '5', name: 'Employment Contract', type: 'contract', url: '#', uploadDate: '2021-06-15', size: '2.3 MB' },
      { id: '6', name: 'Resume', type: 'resume', url: '#', uploadDate: '2021-06-15', size: '1.5 MB' }
    ],
    notes: 'Top-performing developer with expertise in full-stack development.'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@company.com',
    phone: '+1 555-0401',
    position: 'Marketing Specialist',
    department: 'Marketing',
    manager: 'Sarah Johnson',
    status: 'probation',
    startDate: '2024-01-15',
    salary: 52000,
    photo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    emergencyContact: {
      name: 'Bob Smith',
      phone: '+1 555-0402',
      relationship: 'Father'
    },
    workSchedule: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'Off',
      sunday: 'Off'
    },
    documents: [
      { id: '7', name: 'Employment Contract', type: 'contract', url: '#', uploadDate: '2024-01-15', size: '2.0 MB' },
      { id: '8', name: 'Portfolio', type: 'other', url: '#', uploadDate: '2024-01-15', size: '5.2 MB' }
    ],
    notes: 'New hire showing great potential in digital marketing.'
  }
];

const mockDepartments: Department[] = [
  { id: '1', name: 'IT', head: 'John Admin', employeeCount: 5, description: 'Information Technology' },
  { id: '2', name: 'Human Resources', head: 'Sarah Johnson', employeeCount: 3, description: 'Human Resources Management' },
  { id: '3', name: 'Engineering', head: 'Mike Chen', employeeCount: 12, description: 'Software Engineering' },
  { id: '4', name: 'Marketing', head: 'Alice Smith', employeeCount: 8, description: 'Marketing and Sales' }
];

const mockAttendanceRecords: AttendanceRecord[] = [
  { id: '1', employeeId: 'EMP001', date: '2024-01-15', checkIn: '09:00', checkOut: '17:00', workingHours: 8, status: 'present' },
  { id: '2', employeeId: 'EMP002', date: '2024-01-15', checkIn: '08:30', checkOut: '16:30', workingHours: 8, status: 'present' },
  { id: '3', employeeId: 'EMP003', date: '2024-01-15', checkIn: '10:15', checkOut: '18:00', workingHours: 7.75, status: 'late' },
  { id: '4', employeeId: 'EMP004', date: '2024-01-15', checkIn: '09:00', checkOut: '17:00', workingHours: 8, status: 'present' }
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: 'EMP003',
    type: 'vacation',
    startDate: '2024-02-01',
    endDate: '2024-02-05',
    days: 5,
    reason: 'Family vacation',
    status: 'pending',
    requestDate: '2024-01-15'
  },
  {
    id: '2',
    employeeId: 'EMP004',
    type: 'sick',
    startDate: '2024-01-20',
    endDate: '2024-01-20',
    days: 1,
    reason: 'Medical appointment',
    status: 'approved',
    approvedBy: 'Sarah Johnson',
    requestDate: '2024-01-18'
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Update Employee Database',
    description: 'Migrate employee records to new system',
    assignedTo: 'EMP001',
    assignedBy: 'Sarah Johnson',
    dueDate: '2024-02-15',
    priority: 'high',
    status: 'in-progress',
    category: 'IT',
    comments: []
  },
  {
    id: '2',
    title: 'Q1 Performance Reviews',
    description: 'Complete quarterly performance evaluations',
    assignedTo: 'EMP002',
    assignedBy: 'John Admin',
    dueDate: '2024-03-31',
    priority: 'medium',
    status: 'todo',
    category: 'HR',
    comments: []
  }
];

const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: '1',
    employeeId: 'EMP003',
    reviewerId: 'EMP002',
    period: 'Q4 2023',
    type: 'quarterly',
    overallRating: 4.5,
    goals: [
      { id: '1', title: 'Code Quality', description: 'Improve code review scores', target: '90%', achievement: '92%', progress: 100, status: 'completed' },
      { id: '2', title: 'Team Leadership', description: 'Mentor junior developers', target: '2 mentees', achievement: '3 mentees', progress: 100, status: 'completed' }
    ],
    feedback: 'Excellent performance with strong technical skills and leadership qualities.',
    strengths: ['Technical expertise', 'Problem-solving', 'Team collaboration'],
    areasForImprovement: ['Time management', 'Documentation'],
    status: 'completed',
    reviewDate: '2024-01-15'
  }
];

const mockPayrollRecords: PayrollRecord[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    month: 'January',
    year: 2024,
    basicSalary: 75000,
    allowances: 5000,
    deductions: 8000,
    bonus: 2000,
    netSalary: 74000,
    payDate: '2024-01-31',
    status: 'paid'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    month: 'January',
    year: 2024,
    basicSalary: 68000,
    allowances: 4000,
    deductions: 7200,
    bonus: 1500,
    netSalary: 66300,
    payDate: '2024-01-31',
    status: 'paid'
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Leave Request Pending',
    message: 'Mike Chen has submitted a leave request for approval',
    type: 'info',
    read: false,
    timestamp: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    userId: '2',
    title: 'Performance Review Due',
    message: 'Q1 performance reviews are due by March 31st',
    type: 'warning',
    read: false,
    timestamp: '2024-01-15T14:00:00Z'
  }
];

const mockShifts: Shift[] = [
  { id: '1', name: 'Day Shift', startTime: '09:00', endTime: '17:00', type: 'fixed', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  { id: '2', name: 'Early Shift', startTime: '08:30', endTime: '16:30', type: 'fixed', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  { id: '3', name: 'Flexible Shift', startTime: '10:00', endTime: '18:00', type: 'rotating', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
];

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(mockPerformanceReviews);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);

  const addEmployee = (employee: Employee) => {
    setEmployees(prev => [...prev, employee]);
  };

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...employeeData } : emp));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const addLeaveRequest = (request: LeaveRequest) => {
    setLeaveRequests(prev => [...prev, request]);
  };

  const updateLeaveRequest = (id: string, requestData: Partial<LeaveRequest>) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, ...requestData } : req));
  };

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...taskData } : task));
  };

  const addAttendanceRecord = (record: AttendanceRecord) => {
    setAttendanceRecords(prev => [...prev, record]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));
  };

  return (
    <AppContext.Provider value={{
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
      markNotificationAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};
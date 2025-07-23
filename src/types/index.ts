// Core types for the Employee Management System
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  departmentId: string;
  managerId: string;
  status: 'active' | 'probation' | 'suspended' | 'terminated';
  startDate: string;
  salary: number;
  photo?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  workSchedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  documents: Document[];
  notes: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  employeeCount: number;
  description: string;
}

export type AttendanceRecord = {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'late' | 'absent' | 'partial';
};

export type LeaveRequest = {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'denied';
};

export type Task = {
  id: string;
  title: string;
  assignedTo: string;
  status: string;
};

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'id' | 'certificate' | 'resume' | 'nda' | 'other';
  url: string;
  uploadDate: string;
  expiryDate?: string;
  size: string;
}

export type PerformanceReview = {
  id: string;
  employeeId: string;
  period: string;
  overallRating: number;
  status: string;
};

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: string;
  achievement: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
}

export type PayrollRecord = {
  id: string;
  employeeId: string;
  netSalary: number;
  payDate: string;
  status: string;
};

export interface User {
  photo: string;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  permissions: string[];
  department: string;
  employeeId?: string;
  password: string;
}

export type Shift = {
  id: string;
  employeeId: string;
  start: string;
  end: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
};

export type ViewMode = 'grid' | 'list' | 'calendar';
export type FilterType = 'all' | 'active' | 'probation' | 'terminated';

// Attendance & Time Tracking Types
export interface TimeLog {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm or ISO
  endTime: string; // HH:mm or ISO
  duration: number; // in minutes
  type: 'work' | 'meeting' | 'break' | 'overtime' | 'other';
  project?: string;
  task?: string;
  notes?: string;
  billable?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Timesheet {
  id: string;
  employeeId: string;
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD
  logs: TimeLog[];
  totalHours: number;
  overtimeHours: number;
  breakMinutes: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedBy?: string;
  notes?: string;
}

export type TimeLogCategory = 'work' | 'meeting' | 'break' | 'overtime' | 'other';

// Payroll Management Types
export interface PayrollPeriod {
  id: string;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'processing' | 'completed' | 'paid';
  processedAt?: string;
  processedBy?: string;
  totalAmount: number;
  employeeCount: number;
}

export interface PayrollItem {
  id: string;
  payrollRecordId: string;
  type: 'basic_salary' | 'overtime' | 'allowance' | 'bonus' | 'deduction' | 'tax' | 'other';
  description: string;
  amount: number;
  isAddition: boolean; // true for additions, false for deductions
  category?: string;
}

export interface Payslip {
  id: string;
  payrollRecordId: string;
  employeeId: string;
  period: string;
  issueDate: string;
  items: PayrollItem[];
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  notes?: string;
  status: 'draft' | 'generated' | 'sent' | 'acknowledged';
}

export interface PayrollSettings {
  id: string;
  overtimeRate: number; // multiplier for overtime (e.g., 1.5 for time and a half)
  taxRate: number; // percentage for tax calculation
  allowanceTypes: string[]; // types of allowances (housing, transport, etc.)
  deductionTypes: string[]; // types of deductions (insurance, loans, etc.)
  payDay: number; // day of month for salary payment
  currency: string;
  taxYear: number;
}

export type PayrollItemType = 'basic_salary' | 'overtime' | 'allowance' | 'bonus' | 'deduction' | 'tax' | 'other';
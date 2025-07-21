// Core types for the Employee Management System
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  manager: string;
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

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workingHours: number;
  status: 'present' | 'late' | 'absent' | 'partial';
  location?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'unpaid' | 'maternity' | 'study' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  approvedBy?: string;
  requestDate: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed';
  category: string;
  comments: Comment[];
}

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

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  type: 'quarterly' | 'annual' | 'probation';
  overallRating: number;
  goals: Goal[];
  feedback: string;
  strengths: string[];
  areasForImprovement: string[];
  status: 'draft' | 'completed' | 'acknowledged';
  reviewDate: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: string;
  achievement: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  periodStart: string;
  periodEnd: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  overtime: number;
  bonus: number;
  tax: number;
  netSalary: number;
  payDate: string;
  status: 'draft' | 'processed' | 'paid';
  items: PayrollItem[];
  notes?: string;
  processedBy?: string;
  processedAt?: string;
}

export interface User {
  photo: string;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  permissions: string[];
  department: string;
  employeeId?: string;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  type: 'fixed' | 'rotating';
  days: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

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
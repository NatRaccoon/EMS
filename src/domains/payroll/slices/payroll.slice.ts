import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  PayrollRecord, 
  PayrollPeriod, 
  PayrollItem, 
  Payslip, 
  PayrollSettings,
  TimeLog 
} from '@/shared/types';

interface PayrollState {
  payrollRecords: PayrollRecord[];
  payrollPeriods: PayrollPeriod[];
  payslips: Payslip[];
  settings: PayrollSettings;
  
  // Actions
  generatePayroll: (employeeId: string, month: number, year: number, attendanceLogs: TimeLog[]) => PayrollRecord;
  processPayrollPeriod: (month: number, year: number) => PayrollPeriod;
  generatePayslip: (payrollRecordId: string) => Payslip;
  updatePayrollRecord: (id: string, record: Partial<PayrollRecord>) => void;
  deletePayrollRecord: (id: string) => void;
  updateSettings: (settings: Partial<PayrollSettings>) => void;
  calculateOvertime: (logs: TimeLog[], hourlyRate: number) => number;
  calculateTax: (grossPay: number) => number;
}

const defaultSettings: PayrollSettings = {
  id: '1',
  overtimeRate: 1.5,
  taxRate: 15, // 15% tax rate
  allowanceTypes: ['Housing', 'Transport', 'Meal', 'Medical'],
  deductionTypes: ['Insurance', 'Loan', 'Advance', 'Tax'],
  payDay: 25,
  currency: 'USD',
  taxYear: 2024
};

export const usePayrollStore = create<PayrollState>()(
  persist(
    (set, get) => ({
      payrollRecords: [],
      payrollPeriods: [],
      payslips: [],
      settings: defaultSettings,

      generatePayroll: (employeeId, month, year, attendanceLogs) => {
        const { settings } = get();
        
        // Get employee data (would come from employee store)
        const employee = { salary: 5000 }; // Mock employee data
        
        // Calculate overtime from attendance logs
        const overtimeLogs = attendanceLogs.filter(log => log.type === 'overtime');
        const overtimeHours = overtimeLogs.reduce((sum, log) => sum + (log.duration / 60), 0);
        const hourlyRate = employee.salary / 160; // Assuming 160 hours per month
        const overtimePay = overtimeHours * hourlyRate * settings.overtimeRate;
        
        // Calculate basic salary
        const basicSalary = employee.salary;
        
        // Calculate allowances (mock data)
        const allowances = 500; // Housing allowance
        
        // Calculate deductions
        const deductions = 200; // Insurance
        
        // Calculate tax
        const grossPay = basicSalary + overtimePay + allowances;
        const tax = get().calculateTax(grossPay);
        
        // Calculate net salary
        const netSalary = grossPay - deductions - tax;
        
        const payrollRecord: PayrollRecord = {
          id: `${employeeId}-${month}-${year}`,
          employeeId,
          month: month.toString(),
          year,
          periodStart: `${year}-${month.toString().padStart(2, '0')}-01`,
          periodEnd: `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate()}`,
          basicSalary,
          allowances,
          deductions,
          overtime: overtimePay,
          bonus: 0,
          tax,
          netSalary,
          payDate: `${year}-${month.toString().padStart(2, '0')}-${settings.payDay}`,
          status: 'draft',
          items: [
            {
              id: '1',
              payrollRecordId: `${employeeId}-${month}-${year}`,
              type: 'basic_salary',
              description: 'Basic Salary',
              amount: basicSalary,
              isAddition: true
            },
            {
              id: '2',
              payrollRecordId: `${employeeId}-${month}-${year}`,
              type: 'overtime',
              description: 'Overtime Pay',
              amount: overtimePay,
              isAddition: true
            },
            {
              id: '3',
              payrollRecordId: `${employeeId}-${month}-${year}`,
              type: 'allowance',
              description: 'Housing Allowance',
              amount: allowances,
              isAddition: true
            },
            {
              id: '4',
              payrollRecordId: `${employeeId}-${month}-${year}`,
              type: 'deduction',
              description: 'Insurance',
              amount: deductions,
              isAddition: false
            },
            {
              id: '5',
              payrollRecordId: `${employeeId}-${month}-${year}`,
              type: 'tax',
              description: 'Income Tax',
              amount: tax,
              isAddition: false
            }
          ],
          notes: '',
          processedBy: '',
          processedAt: new Date().toISOString()
        };

        set(state => ({
          payrollRecords: [...state.payrollRecords, payrollRecord]
        }));

        return payrollRecord;
      },

      processPayrollPeriod: (month, year) => {
        const { payrollRecords } = get();
        const periodRecords = payrollRecords.filter(record => 
          parseInt(record.month) === month && record.year === year
        );
        
        const totalAmount = periodRecords.reduce((sum, record) => sum + record.netSalary, 0);
        
        const payrollPeriod: PayrollPeriod = {
          id: `${month}-${year}`,
          month,
          year,
          startDate: `${year}-${month.toString().padStart(2, '0')}-01`,
          endDate: `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate()}`,
          status: 'completed',
          processedAt: new Date().toISOString(),
          processedBy: 'System',
          totalAmount,
          employeeCount: periodRecords.length
        };

        set(state => ({
          payrollPeriods: [...state.payrollPeriods, payrollPeriod]
        }));

        return payrollPeriod;
      },

      generatePayslip: (payrollRecordId) => {
        const { payrollRecords } = get();
        const record = payrollRecords.find(r => r.id === payrollRecordId);
        
        if (!record) throw new Error('Payroll record not found');
        
        const payslip: Payslip = {
          id: `payslip-${payrollRecordId}`,
          payrollRecordId,
          employeeId: record.employeeId,
          period: `${record.month}/${record.year}`,
          issueDate: new Date().toISOString(),
          items: record.items,
          grossPay: record.basicSalary + record.overtime + record.allowances,
          totalDeductions: record.deductions + record.tax,
          netPay: record.netSalary,
          notes: record.notes,
          status: 'generated'
        };

        set(state => ({
          payslips: [...state.payslips, payslip]
        }));

        return payslip;
      },

      updatePayrollRecord: (id, record) => {
        set(state => ({
          payrollRecords: state.payrollRecords.map(r => 
            r.id === id ? { ...r, ...record } : r
          )
        }));
      },

      deletePayrollRecord: (id) => {
        set(state => ({
          payrollRecords: state.payrollRecords.filter(r => r.id !== id)
        }));
      },

      updateSettings: (settings) => {
        set(state => ({
          settings: { ...state.settings, ...settings }
        }));
      },

      calculateOvertime: (logs, hourlyRate) => {
        const { settings } = get();
        const overtimeLogs = logs.filter(log => log.type === 'overtime');
        const overtimeHours = overtimeLogs.reduce((sum, log) => sum + (log.duration / 60), 0);
        return overtimeHours * hourlyRate * settings.overtimeRate;
      },

      calculateTax: (grossPay) => {
        const { settings } = get();
        return (grossPay * settings.taxRate) / 100;
      }
    }),
    {
      name: 'payroll-store',
      partialize: (state) => ({ 
        payrollRecords: state.payrollRecords, 
        payrollPeriods: state.payrollPeriods,
        payslips: state.payslips,
        settings: state.settings
      }),
    }
  )
); 
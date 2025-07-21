"use client"
import React, { createContext, useContext, ReactNode } from 'react';
import { usePayrollStore } from '../slices/payroll.slice';
import { PayrollRecord, PayrollPeriod, Payslip, PayrollSettings, TimeLog } from '@/shared/types';

interface PayrollContextValue {
  payrollRecords: PayrollRecord[];
  payrollPeriods: PayrollPeriod[];
  payslips: Payslip[];
  settings: PayrollSettings;
  generatePayroll: ReturnType<typeof usePayrollStore>['generatePayroll'];
  processPayrollPeriod: ReturnType<typeof usePayrollStore>['processPayrollPeriod'];
  generatePayslip: ReturnType<typeof usePayrollStore>['generatePayslip'];
  updatePayrollRecord: ReturnType<typeof usePayrollStore>['updatePayrollRecord'];
  deletePayrollRecord: ReturnType<typeof usePayrollStore>['deletePayrollRecord'];
  updateSettings: ReturnType<typeof usePayrollStore>['updateSettings'];
  calculateOvertime: ReturnType<typeof usePayrollStore>['calculateOvertime'];
  calculateTax: ReturnType<typeof usePayrollStore>['calculateTax'];
}

const PayrollContext = createContext<PayrollContextValue | undefined>(undefined);

export const PayrollProvider = ({ children }: { children: ReactNode }) => {
  const payrollRecords = usePayrollStore((s) => s.payrollRecords);
  const payrollPeriods = usePayrollStore((s) => s.payrollPeriods);
  const payslips = usePayrollStore((s) => s.payslips);
  const settings = usePayrollStore((s) => s.settings);
  const generatePayroll = usePayrollStore((s) => s.generatePayroll);
  const processPayrollPeriod = usePayrollStore((s) => s.processPayrollPeriod);
  const generatePayslip = usePayrollStore((s) => s.generatePayslip);
  const updatePayrollRecord = usePayrollStore((s) => s.updatePayrollRecord);
  const deletePayrollRecord = usePayrollStore((s) => s.deletePayrollRecord);
  const updateSettings = usePayrollStore((s) => s.updateSettings);
  const calculateOvertime = usePayrollStore((s) => s.calculateOvertime);
  const calculateTax = usePayrollStore((s) => s.calculateTax);

  return (
    <PayrollContext.Provider value={{
      payrollRecords,
      payrollPeriods,
      payslips,
      settings,
      generatePayroll,
      processPayrollPeriod,
      generatePayslip,
      updatePayrollRecord,
      deletePayrollRecord,
      updateSettings,
      calculateOvertime,
      calculateTax
    }}>
      {children}
    </PayrollContext.Provider>
  );
};

export function usePayrollContext() {
  const ctx = useContext(PayrollContext);
  if (!ctx) throw new Error('usePayrollContext must be used within PayrollProvider');
  return ctx;
} 
"use client"
import React, { useState } from 'react';
import { PayrollProvider,  usePayrollContext } from '@/domains/payroll/context/PayrollContext';
// import { usePayrollContext } from '@/domains/payroll/context/PayrollContext'; // ✅ adjust the path based on your
import { useAuth } from '@/domains/auth/context/AuthContext';
import { useContext } from 'react';
import { AppContext } from '@/domains/auth/context/AppContext';
import { 
  DollarSign, 
  FileText, 
  Settings, 
  BarChart3, 
  Users,
  Calendar,
  Download,
  Eye
} from 'lucide-react';

const TABS = [
  { id: 'processing', label: 'Payroll Processing', icon: <DollarSign size={18} /> },
  { id: 'payslips', label: 'Payslips', icon: <FileText size={18} /> },
  { id: 'reports', label: 'Reports', icon: <BarChart3 size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

const TAB_DESCRIPTIONS: Record<string, string> = {
  processing: 'Generate and process payroll for employees.',
  payslips: 'View and manage employee payslips.',
  reports: 'Analyze payroll data and generate reports.',
  settings: 'Configure payroll settings and parameters.',
};

import { PayrollProcessingComponent } from '@/domains/payroll/components/payroll-processing.component';

function PayrollProcessingTab() {
  return <PayrollProcessingComponent />;
}

import { PayslipComponent } from '@/domains/payroll/components/payslip.component';

function PayslipsTab() {
  const { payslips, payrollRecords } = usePayrollContext();
  const { employees } = useContext(AppContext);

  const getEmployeeName = (employeeId: string) => {
    const employee = employees?.find(e => e.employeeId === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Generated Payslips</h3>
        </div>
        <div className="p-6">
          {payslips.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p>No payslips generated yet.</p>
              <p className="text-sm">Generate payroll first to create payslips.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {payslips.map((payslip) => (
                <div key={payslip.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <PayslipComponent
                    payslip={payslip}
                    employeeName={getEmployeeName(payslip.employeeId)}
                    onPrint={() => console.log('Print payslip:', payslip.id)}
                    onDownload={() => console.log('Download payslip:', payslip.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportsTab() {
  const { payrollRecords, payrollPeriods } = usePayrollContext();

  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const totalOvertime = payrollRecords.reduce((sum, record) => sum + record.overtime, 0);
  const totalTax = payrollRecords.reduce((sum, record) => sum + record.tax, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <DollarSign size={24} className="text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Payroll</h3>
              <p className="text-2xl font-bold text-green-600">${totalPayroll.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <Calendar size={24} className="text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Overtime Pay</h3>
              <p className="text-2xl font-bold text-blue-600">${totalOvertime.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} className="text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Tax</h3>
              <p className="text-2xl font-bold text-red-600">${totalTax.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Records Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Payroll Records</h3>
        </div>
        <div className="p-6">
          {payrollRecords.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No payroll records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Employee</th>
                    <th className="text-left py-2">Period</th>
                    <th className="text-left py-2">Basic Salary</th>
                    <th className="text-left py-2">Overtime</th>
                    <th className="text-left py-2">Deductions</th>
                    <th className="text-left py-2">Net Salary</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{record.employeeId}</td>
                      <td className="py-2">{record.month}/{record.year}</td>
                      <td className="py-2">${record.basicSalary.toFixed(2)}</td>
                      <td className="py-2">${record.overtime.toFixed(2)}</td>
                      <td className="py-2">${record.deductions.toFixed(2)}</td>
                      <td className="py-2">${record.netSalary.toFixed(2)}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          record.status === 'paid' ? 'bg-green-100 text-green-800' :
                          record.status === 'processed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const { settings, updateSettings } = usePayrollContext();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payroll Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Rate</label>
            <input
              type="number"
              step="0.1"
              value={localSettings.overtimeRate}
              onChange={(e) => setLocalSettings({...localSettings, overtimeRate: parseFloat(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={localSettings.taxRate}
              onChange={(e) => setLocalSettings({...localSettings, taxRate: parseFloat(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pay Day</label>
            <input
              type="number"
              min="1"
              max="31"
              value={localSettings.payDay}
              onChange={(e) => setLocalSettings({...localSettings, payDay: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={localSettings.currency}
              onChange={(e) => setLocalSettings({...localSettings, currency: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

const PayrollPage = () => {
  const [tab, setTab] = useState('processing');
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <PayrollProvider>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payroll Management</h1>
          <p className="text-gray-600 text-lg">
            Process payroll, generate payslips, and manage compensation.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-8 justify-center">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary
                ${tab === t.id ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-black hover:bg-primary/10'}`}
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
          {tab === 'processing' && <PayrollProcessingTab />}
          {tab === 'payslips' && <PayslipsTab />}
          {tab === 'reports' && <ReportsTab />}
          {tab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </PayrollProvider>
  );
};

export default PayrollPage;

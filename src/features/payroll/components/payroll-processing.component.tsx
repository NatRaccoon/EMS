import React, { useState } from 'react';
import { usePayrollContext } from '../context/PayrollContext';
import { useContext } from 'react';
import { AppContext } from '@/domains/auth/context/AppContext';
import { useAttendanceContext } from '@/domains/attendance/context/AttendanceContext';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';

interface PayrollProcessingProps {
  onComplete?: () => void;
}

export const PayrollProcessingComponent: React.FC<PayrollProcessingProps> = ({ onComplete }) => {
  const { generatePayroll, payrollRecords, settings } = usePayrollContext();
  const { employees } = useContext(AppContext);
  const { generateTimesheet } = useAttendanceContext();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [processing, setProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const handleProcessPayroll = async () => {
    setProcessing(true);
    setProcessedCount(0);
  
    for (let i = 0; i < (employees?.length || 0); i++) {
      const employee = employees![i];
  
      // Await timesheet (assuming async)
      const timesheet = await generateTimesheet(employee.employeeId, selectedMonth, selectedYear);
  
      // Defensive check
      if (!timesheet || !timesheet.logs) {
        console.warn(`Missing logs for employee ${employee.employeeId}`);
        continue;
      }
  
      generatePayroll(employee.employeeId, selectedMonth, selectedYear, timesheet.logs);
  
      setProcessedCount(i + 1);
  
      // Optional delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  
    setProcessing(false);
    onComplete?.();
  };
  

  const getEmployeePayrollStatus = (employeeId: string) => {
    const record = payrollRecords.find(
      r => r.employeeId === employeeId && 
           parseInt(r.month) === selectedMonth && 
           r.year === selectedYear
    );
    return record;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payroll Period</h3>
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2"
              disabled={processing}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i).toLocaleDateString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2"
              disabled={processing}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={2024 + i} value={2024 + i}>
                  {2024 + i}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Processing Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Payroll Processing</h3>
          <div className="flex items-center gap-2">
            {processing && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleProcessPayroll}
            disabled={processing}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? <Pause size={16} /> : <Play size={16} />}
            {processing ? 'Processing...' : 'Process Payroll'}
          </button>
          
          <div className="text-sm text-gray-600">
            {processing && (
              <span>Processed {processedCount} of {employees?.length || 0} employees</span>
            )}
          </div>
        </div>

        {/* Settings Info */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Current Settings</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Overtime Rate:</span>
              <span className="ml-1 font-medium">{settings.overtimeRate}x</span>
            </div>
            <div>
              <span className="text-gray-600">Tax Rate:</span>
              <span className="ml-1 font-medium">{settings.taxRate}%</span>
            </div>
            <div>
              <span className="text-gray-600">Pay Day:</span>
              <span className="ml-1 font-medium">{settings.payDay}</span>
            </div>
            <div>
              <span className="text-gray-600">Currency:</span>
              <span className="ml-1 font-medium">{settings.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Employee Payroll Status</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-gray-600">Processed</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle size={16} className="text-yellow-600" />
                <span className="text-gray-600">Pending</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {employees?.map((employee) => {
              const payrollRecord = getEmployeePayrollStatus(employee.employeeId);
              const isProcessed = !!payrollRecord;

              return (
                <div key={employee.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {employee.firstName} {employee.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                      <p className="text-xs text-gray-500">Department: {employee.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {isProcessed ? (
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle size={16} />
                          <span className="font-medium">Processed</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Net: {formatCurrency(payrollRecord!.netSalary)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payrollRecord!.status}
                        </p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-yellow-600">
                          <AlertCircle size={16} />
                          <span className="font-medium">Pending</span>
                        </div>
                        <p className="text-sm text-gray-500">Not processed</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 
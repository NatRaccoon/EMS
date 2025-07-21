import React from 'react';
import { Payslip, PayrollItem } from '@/shared/types';
import { Download, Printer } from 'lucide-react';

interface PayslipProps {
  payslip: Payslip;
  employeeName?: string;
  onPrint?: () => void;
  onDownload?: () => void;
}

export const PayslipComponent: React.FC<PayslipProps> = ({
  payslip,
  employeeName = 'Employee',
  onPrint,
  onDownload
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const additions = payslip.items.filter(item => item.isAddition);
  const deductions = payslip.items.filter(item => !item.isAddition);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">PAYSLIP</h1>
            <p className="text-blue-100">Period: {payslip.period}</p>
            <p className="text-blue-100">Issue Date: {new Date(payslip.issueDate).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{formatCurrency(payslip.netPay)}</div>
            <p className="text-blue-100 text-sm">Net Pay</p>
          </div>
        </div>
      </div>

      {/* Employee Information */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Employee Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {employeeName}</p>
              <p><span className="font-medium">Employee ID:</span> {payslip.employeeId}</p>
              <p><span className="font-medium">Payslip ID:</span> {payslip.id}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Payroll Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                  payslip.status === 'generated' ? 'bg-green-100 text-green-800' :
                  payslip.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {payslip.status}
                </span>
              </p>
              <p><span className="font-medium">Gross Pay:</span> {formatCurrency(payslip.grossPay)}</p>
              <p><span className="font-medium">Total Deductions:</span> {formatCurrency(payslip.totalDeductions)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings and Deductions */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Earnings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-green-700">Earnings</h3>
            <div className="space-y-3">
              {additions.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">{item.description}</p>
                    <p className="text-xs text-gray-500 capitalize">{item.type.replace('_', ' ')}</p>
                  </div>
                  <span className="font-semibold text-green-600">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 border-t-2 border-green-200 pt-3">
                <span className="font-semibold text-gray-800">Total Earnings</span>
                <span className="font-bold text-green-600">{formatCurrency(payslip.grossPay)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-red-700">Deductions</h3>
            <div className="space-y-3">
              {deductions.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">{item.description}</p>
                    <p className="text-xs text-gray-500 capitalize">{item.type.replace('_', ' ')}</p>
                  </div>
                  <span className="font-semibold text-red-600">-{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 border-t-2 border-red-200 pt-3">
                <span className="font-semibold text-gray-800">Total Deductions</span>
                <span className="font-bold text-red-600">-{formatCurrency(payslip.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Net Pay Summary */}
      <div className="bg-gray-50 p-6 rounded-b-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Net Pay</h3>
            <p className="text-sm text-gray-600">Amount to be paid</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(payslip.netPay)}</div>
            <p className="text-sm text-gray-500">Pay Date: {new Date(payslip.issueDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {payslip.notes && (
        <div className="p-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
          <p className="text-sm text-gray-600">{payslip.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-end gap-3">
          {onPrint && (
            <button
              onClick={onPrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer size={16} />
              Print
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 
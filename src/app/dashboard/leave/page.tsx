'use client'
import React, { useState, useContext } from 'react';
import { AppContext } from '@/domains/auth/context/AppContext';
import { useAuth } from '@/domains/auth/context/AuthContext';
import { CalendarCheck, PlusCircle, XCircle, CheckCircle, Clock, X } from 'lucide-react';

const LEAVE_TYPES = [
  { value: 'vacation', label: 'Vacation' },
  { value: 'sick', label: 'Sick' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'maternity', label: 'Maternity' },
  { value: 'study', label: 'Study' },
  { value: 'emergency', label: 'Emergency' },
];

type LeaveType = 'vacation' | 'sick' | 'unpaid' | 'maternity' | 'study' | 'emergency';

export default function LeavePage() {
  const { user } = useAuth();
  const appCtx = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }>({
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: '', // always a string
  });
  const [error, setError] = useState('');
  // --- Move filter/search state hooks here ---
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  if (!user || !appCtx) return null;

  // Mock leave balance
  const leaveBalance = 15;

  // User's leave requests
  const myLeaves = appCtx.leaveRequests.filter(l => l.employeeId === (user.employeeId ? user.employeeId : user.id));

  // Submit handler (move above HR/Admin view)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.startDate || !form.endDate || !form.type) {
      setError('All fields are required.');
      return;
    }
    appCtx.addLeaveRequest({
      id: Date.now().toString(),
      employeeId: user.employeeId ? user.employeeId : user.id,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days: 1, // TODO: calculate days
      reason: form.reason || '',
      status: 'pending',
      requestDate: new Date().toISOString(),
    });
    setShowForm(false);
    setForm({ type: 'vacation', startDate: '', endDate: '', reason: '' });
  };

  // Role check
  const isHR = user.role === 'hr' || user.role === 'admin';

  // HR/Admin view: show both employee and management views
  if (isHR) {
    // Export to CSV
    const handleExport = () => {
      const rows = [
        ['Employee', 'Type', 'Start', 'End', 'Status', 'Requested'],
        ...appCtx.leaveRequests.map(l => {
          const emp = appCtx.employees.find(e => e.employeeId === l.employeeId);
          return [
            emp ? `${emp.firstName} ${emp.lastName}` : l.employeeId,
            l.type,
            l.startDate,
            l.endDate,
            l.status,
            new Date(l.requestDate).toLocaleDateString(),
          ];
        })
      ];
      const csv = rows.map(r => r.map(String).map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leave-requests.csv';
      a.click();
      URL.revokeObjectURL(url);
    };

    // Filtered leave requests for management table
    const filteredRequests = appCtx.leaveRequests.filter(l => {
      // Status filter
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      // Type filter
      if (typeFilter !== 'all' && l.type !== typeFilter) return false;
      // Search by employee name
      if (search.trim()) {
        const emp = appCtx.employees.find(e => e.employeeId === l.employeeId);
        const name = emp ? `${emp.firstName} ${emp.lastName}`.toLowerCase() : l.employeeId.toLowerCase();
        if (!name.includes(search.trim().toLowerCase())) return false;
      }
      return true;
    });

    return (
      <div className="max-w-5xl mx-auto py-8 px-2 flex flex-col gap-8">
        {/* Employee view for HR/Admin */}
        <div className="bg-white dark:bg-black rounded-2xl shadow-lg p-6 flex items-center gap-6 border border-primary/20">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <CalendarCheck size={36} className="text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-black dark:text-white mb-1">Leave Balance</h2>
            <div className="text-4xl font-extrabold text-primary">{leaveBalance} <span className="text-lg font-medium">days</span></div>
          </div>
          <button
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold shadow transition text-lg"
            onClick={() => setShowForm(true)}
          >
            <PlusCircle size={22} /> Request Leave
          </button>
        </div>
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form className="bg-white dark:bg-black rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-primary/20" onSubmit={handleSubmit}>
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-black dark:text-white flex items-center gap-2">
                <PlusCircle size={22} className="text-primary" /> Request Leave
              </h2>
              {error && <div className="text-red-500 mb-2">{error}</div>}
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as LeaveType }))}
                  >
                    {LEAVE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reason</label>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={form.reason ?? ''}
                    onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 w-full"
                    value={form.startDate}
                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 w-full"
                    value={form.endDate}
                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  />
                </div>
              </div>
              {/* Summary */}
              <div className="mb-4 bg-primary/5 rounded p-3 text-sm text-primary flex flex-col gap-1">
                <span><b>Type:</b> {LEAVE_TYPES.find(t => t.value === form.type)?.label}</span>
                <span><b>From:</b> {form.startDate || '--'} <b>To:</b> {form.endDate || '--'}</span>
                {form.reason && form.reason.length > 0 && <span><b>Reason:</b> {form.reason}</span>}
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl w-full mt-2 text-lg font-semibold"
              >
                Submit Request
              </button>
            </form>
          </div>
        )}
        {/* Divider */}
        <div className="h-1 bg-primary/10 rounded my-2" />
        {/* My Leave Requests (for HR/Admin) */}
        <div className="bg-white dark:bg-black rounded-2xl shadow p-6 border border-primary/20">
          <h2 className="text-lg font-bold text-black dark:text-white mb-4">My Leave Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Type</th>
                  <th className="py-2 text-left">Start</th>
                  <th className="py-2 text-left">End</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Requested</th>
                </tr>
              </thead>
              <tbody>
                {myLeaves.length === 0 ? (
                  <tr><td colSpan={5} className="text-gray-400 text-center py-4">No leave requests yet.</td></tr>
                ) : myLeaves.map((l, i) => (
                  <tr key={l.id} className={i % 2 === 0 ? 'bg-primary/5' : ''}>
                    <td className="py-2 capitalize">{l.type}</td>
                    <td className="py-2">{l.startDate}</td>
                    <td className="py-2">{l.endDate}</td>
                    <td className="py-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        l.status === 'approved' ? 'bg-primary/20 text-primary' :
                        l.status === 'denied' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {l.status === 'approved' && <CheckCircle size={14} className="text-primary" />}
                        {l.status === 'denied' && <XCircle size={14} className="text-red-500" />}
                        {l.status === 'pending' && <Clock size={14} className="text-yellow-500" />}
                        {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2">{new Date(l.requestDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Divider */}
        <div className="h-1 bg-primary/10 rounded my-2" />
        {/* Advanced Reporting Section */}
        {(() => {
          // Calculate summary stats
          const total = appCtx.leaveRequests.length;
          const approved = appCtx.leaveRequests.filter(l => l.status === 'approved').length;
          const denied = appCtx.leaveRequests.filter(l => l.status === 'denied').length;
          const pending = appCtx.leaveRequests.filter(l => l.status === 'pending').length;
          // Count by leave type
          const typeCounts: Record<string, number> = {};
          LEAVE_TYPES.forEach(t => { typeCounts[t.value] = 0; });
          appCtx.leaveRequests.forEach(l => { if (typeCounts[l.type] !== undefined) typeCounts[l.type]++; });
          const maxType = Math.max(...Object.values(typeCounts));
          return (
            <div className="bg-white dark:bg-black rounded-2xl shadow p-6 border border-primary/20 mb-6">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Leave Requests Report</h3>
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-primary">{total}</span>
                  <span className="text-xs text-gray-500">Total</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-green-600">{approved}</span>
                  <span className="text-xs text-gray-500">Approved</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-yellow-600">{pending}</span>
                  <span className="text-xs text-gray-500">Pending</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-red-600">{denied}</span>
                  <span className="text-xs text-gray-500">Denied</span>
                </div>
              </div>
              {/* Bar chart for leave types */}
              <div className="w-full max-w-xl mx-auto">
                <div className="flex items-end gap-3 h-32">
                  {LEAVE_TYPES.map(t => (
                    <div key={t.value} className="flex flex-col items-center flex-1">
                      <div
                        className="w-8 rounded-t bg-primary/70 flex items-end justify-center"
                        style={{ height: `${maxType ? (typeCounts[t.value] / maxType) * 100 : 0}%`, minHeight: '8px' }}
                        title={`${t.label}: ${typeCounts[t.value]}`}
                      >
                        <span className="text-xs text-white font-bold">{typeCounts[t.value]}</span>
                      </div>
                      <span className="text-xs mt-1 text-black dark:text-white text-center">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
        {/* Search and Filters for All Leave Requests */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <input
            type="text"
            className="border rounded px-3 py-2 w-48"
            placeholder="Search employee name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-2 py-2"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="denied">Denied</option>
          </select>
          <select
            className="border rounded px-2 py-2"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            {LEAVE_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <button
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded font-semibold shadow transition ml-auto"
            onClick={handleExport}
            type="button"
          >
            Export to Excel
          </button>
        </div>
        {/* All Leave Requests Management */}
        <div className="bg-white dark:bg-black rounded-2xl shadow p-6 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black dark:text-white">All Leave Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Employee</th>
                  <th className="py-2 text-left">Type</th>
                  <th className="py-2 text-left">Start</th>
                  <th className="py-2 text-left">End</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Requested</th>
                  <th className="py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr><td colSpan={7} className="text-gray-400 text-center py-4">No leave requests found.</td></tr>
                ) : filteredRequests.map((l, i) => {
                  const emp = appCtx.employees.find(e => e.employeeId === l.employeeId);
                  return (
                    <tr key={l.id} className={i % 2 === 0 ? 'bg-primary/5' : ''}>
                      <td className="py-2">{emp ? `${emp.firstName} ${emp.lastName}` : l.employeeId}</td>
                      <td className="py-2 capitalize">{l.type}</td>
                      <td className="py-2">{l.startDate}</td>
                      <td className="py-2">{l.endDate}</td>
                      <td className="py-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          l.status === 'approved' ? 'bg-primary/20 text-primary' :
                          l.status === 'denied' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {l.status === 'approved' && <CheckCircle size={14} className="text-primary" />}
                          {l.status === 'denied' && <XCircle size={14} className="text-red-500" />}
                          {l.status === 'pending' && <Clock size={14} className="text-yellow-500" />}
                          {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-2">{new Date(l.requestDate).toLocaleDateString()}</td>
                      <td className="py-2">
                        {l.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 rounded bg-primary hover:bg-primary-dark text-white text-xs font-semibold"
                              onClick={() => appCtx.updateLeaveRequest(l.id, { status: 'approved' })}
                            >
                              Approve
                            </button>
                            <button
                              className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-semibold"
                              onClick={() => appCtx.updateLeaveRequest(l.id, { status: 'denied' })}
                            >
                              Deny
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-2 flex flex-col gap-8">
      {/* Leave Balance */}
      <div className="bg-white dark:bg-black rounded-2xl shadow-lg p-6 flex items-center gap-6 border border-primary/20">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <CalendarCheck size={36} className="text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-black dark:text-white mb-1">Leave Balance</h2>
          <div className="text-4xl font-extrabold text-primary">{leaveBalance} <span className="text-lg font-medium">days</span></div>
        </div>
        <button
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold shadow transition text-lg"
          onClick={() => setShowForm(true)}
        >
          <PlusCircle size={22} /> Request Leave
        </button>
      </div>

      {/* Leave Request Form (Modal) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-white dark:bg-black rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-primary/20" onSubmit={handleSubmit}>
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white flex items-center gap-2">
              <PlusCircle size={22} className="text-primary" /> Request Leave
            </h2>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as LeaveType }))}
                >
                  {LEAVE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={form.reason ?? ''}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                />
              </div>
            </div>
            {/* Summary */}
            <div className="mb-4 bg-primary/5 rounded p-3 text-sm text-primary flex flex-col gap-1">
              <span><b>Type:</b> {LEAVE_TYPES.find(t => t.value === form.type)?.label}</span>
              <span><b>From:</b> {form.startDate || '--'} <b>To:</b> {form.endDate || '--'}</span>
              {form.reason && form.reason.length > 0 && <span><b>Reason:</b> {form.reason}</span>}
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl w-full mt-2 text-lg font-semibold"
            >
              Submit Request
            </button>
          </form>
        </div>
      )}

      {/* Divider */}
      <div className="h-1 bg-primary/10 rounded my-2" />

      {/* Leave History */}
      <div className="bg-white dark:bg-black rounded-2xl shadow p-6 border border-primary/20">
        <h2 className="text-lg font-bold text-black dark:text-white mb-4">My Leave Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Type</th>
                <th className="py-2 text-left">Start</th>
                <th className="py-2 text-left">End</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Requested</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.length === 0 ? (
                <tr><td colSpan={5} className="text-gray-400 text-center py-4">No leave requests yet.</td></tr>
              ) : myLeaves.map((l, i) => (
                <tr key={l.id} className={i % 2 === 0 ? 'bg-primary/5' : ''}>
                  <td className="py-2 capitalize">{l.type}</td>
                  <td className="py-2">{l.startDate}</td>
                  <td className="py-2">{l.endDate}</td>
                  <td className="py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      l.status === 'approved' ? 'bg-primary/20 text-primary' :
                      l.status === 'denied' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {l.status === 'approved' && <CheckCircle size={14} className="text-primary" />}
                      {l.status === 'denied' && <XCircle size={14} className="text-red-500" />}
                      {l.status === 'pending' && <Clock size={14} className="text-yellow-500" />}
                      {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2">{new Date(l.requestDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
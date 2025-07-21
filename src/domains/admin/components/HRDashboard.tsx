import React, { useContext } from 'react';
import { AppContext } from '@/domains/auth/context/AppContext';
import { useAuth } from '@/domains/auth/context/AuthContext';
import { Users, DollarSign, TrendingUp, Plus, Bell, Calendar, FileText } from 'lucide-react';
import ClockInOutWidget from '@/shared/components/ClockInOutWidget';

const HRDashboard: React.FC = () => {
  const appCtx = useContext(AppContext);
  const { user } = useAuth();
  if (!user || !appCtx) return null;

  const employee = appCtx.employees.find(e => e.employeeId === user.employeeId);
  const avatar = employee?.photo || '/public/file.svg';
  const totalEmployees = appCtx.employees.length || 0;
  const payrolls = appCtx.payrollRecords;
  const lastPayroll = payrolls.length > 0 ? payrolls[payrolls.length - 1] : null;
  const reviews = appCtx.performanceReviews;
  const pendingReviews = reviews.filter(r => r.status !== 'completed').length;
  const notifications = appCtx.notifications.filter(n => n.userId === user.id);

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 flex flex-col gap-8">
      {/* Welcome Header (Full Width) */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={avatar}
          alt="avatar"
          className="w-16 h-16 rounded-full border-2 border-blue-200 object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Welcome, {user.name || user.email}!</h1>
          <p className="text-gray-600 text-lg">Handle employee data, payroll, and performance reviews.</p>
        </div>
      </div>
      {/* Widgets Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <Users size={24} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Total Employees</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalEmployees}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign size={24} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Payroll Overview</h3>
          </div>
          {lastPayroll ? (
            <>
              <div className="text-sm text-gray-600">Last Payroll: <b>{lastPayroll.payDate}</b></div>
              <div className="text-sm text-gray-600">Total Paid: <b>${lastPayroll.netSalary.toLocaleString()}</b></div>
              <div className="text-sm text-gray-600">Status: <span className={`font-semibold ${lastPayroll.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{lastPayroll.status}</span></div>
            </>
          ) : <div className="text-gray-400 text-sm">No payroll records yet.</div>}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={24} className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Performance Reviews</h3>
          </div>
          <div className="text-sm text-gray-600">Pending Reviews: <b>{pendingReviews}</b></div>
        </div>
      </div>
      {/* Clock In/Out Widget */}
      <ClockInOutWidget employeeId={user.employeeId || user.id} compact />
      {/* Notifications */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><Bell size={20} className="text-yellow-500" /> Notifications</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-2 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-gray-400 text-sm">No notifications.</div>
          ) : notifications.map(n => (
            <div key={n.id} className={`flex items-center gap-2 p-2 rounded ${n.read ? 'bg-gray-50' : 'bg-yellow-50'}`}>
              <span className={`w-2 h-2 rounded-full ${n.read ? 'bg-gray-300' : 'bg-yellow-400'}`}></span>
              <span className="font-medium text-gray-700">{n.title}</span>
              <span className="text-xs text-gray-500 ml-auto">{new Date(n.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <Plus size={28} className="text-primary" />
            <span className="font-semibold">Add Employee</span>
          </button>
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <DollarSign size={28} className="text-primary" />
            <span className="font-semibold">Process Payroll</span>
          </button>
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <TrendingUp size={28} className="text-primary" />
            <span className="font-semibold">Review Performance</span>
          </button>
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <Calendar size={28} className="text-primary" />
            <span className="font-semibold">Approve Leave</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard; 
import React, { useContext } from 'react';
import { Clock, FileText, TrendingUp, User, Bell, Calendar, LogOut, Edit2 } from 'lucide-react';
import { useAuth } from '@/domains/auth/context/AuthContext';
import { AppContext } from '@/domains/auth/context/AppContext';
import ClockInOutWidget from '@/shared/components/ClockInOutWidget';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const appCtx = useContext(AppContext);
  if (!user || !appCtx) return null;

  // Attendance summary (last record)
  const attendance = appCtx.attendanceRecords.filter(r => r.employeeId === user.employeeId);
  const lastAttendance = attendance.length > 0 ? attendance[attendance.length - 1] : null;

  // Payslip summary (last record)
  const payslips = appCtx.payrollRecords.filter(r => r.employeeId === user.employeeId);
  const lastPayslip = payslips.length > 0 ? payslips[payslips.length - 1] : null;

  // Performance review summary (last record)
  const reviews = appCtx.performanceReviews.filter(r => r.employeeId === user.employeeId);
  const lastReview = reviews.length > 0 ? reviews[reviews.length - 1] : null;

  // Notifications
  const notifications = appCtx.notifications.filter(n => n.userId === user.id);

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 flex flex-col gap-8">
      {/* Welcome Header (Full Width) */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={user?.photo || '/public/file.svg'}
          alt="avatar"
          className="w-16 h-16 rounded-full border-2 border-blue-200 object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Welcome, {user.name || user.email}!</h1>
          <p className="text-gray-600 text-lg">Here's a summary of your work and updates.</p>
        </div>
      </div>
      {/* Widgets Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Attendance Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={24} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Attendance</h3>
              </div>
              {lastAttendance ? (
                <>
                  <div className="text-sm text-gray-600">Last Check-in: <b>{lastAttendance.checkIn}</b></div>
                  <div className="text-sm text-gray-600">Last Check-out: <b>{lastAttendance.checkOut || '-'}</b></div>
                  <div className="text-sm text-gray-600">Status: <span className={`font-semibold ${lastAttendance.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>{lastAttendance.status}</span></div>
                </>
              ) : <div className="text-gray-400 text-sm">No attendance records yet.</div>}
            </div>
            {/* Payslip Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <FileText size={24} className="text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Latest Payslip</h3>
              </div>
              {lastPayslip ? (
                <>
                  <div className="text-sm text-gray-600">Net Salary: <b>${lastPayslip.netSalary.toLocaleString()}</b></div>
                  <div className="text-sm text-gray-600">Pay Date: <b>{lastPayslip.payDate}</b></div>
                  <div className="text-sm text-gray-600">Status: <span className={`font-semibold ${lastPayslip.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{lastPayslip.status}</span></div>
                </>
              ) : <div className="text-gray-400 text-sm">No payslips yet.</div>}
            </div>
            {/* Performance Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={24} className="text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Performance Review</h3>
              </div>
              {lastReview ? (
                <>
                  <div className="text-sm text-gray-600">Period: <b>{lastReview.period}</b></div>
                  <div className="text-sm text-gray-600">Rating: <b>{lastReview.overallRating}/5</b></div>
                  <div className="text-sm text-gray-600">Status: <span className="font-semibold text-blue-600">{lastReview.status}</span></div>
                </>
              ) : <div className="text-gray-400 text-sm">No reviews yet.</div>}
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
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <Clock size={28} className="text-primary" />
            <span className="font-semibold">Clock In/Out</span>
          </button>
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <Calendar size={28} className="text-primary" />
            <span className="font-semibold">Request Leave</span>
          </button>
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <FileText size={28} className="text-primary" />
            <span className="font-semibold">View Timesheet</span>
          </button>
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <Edit2 size={28} className="text-primary" />
            <span className="font-semibold">Update Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard; 
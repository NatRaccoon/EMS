import React, { useContext } from 'react';
import { AppContext } from '@/domains/auth/context/AppContext';
import { useAuth } from '@/domains/auth/context/AuthContext';
import { Users, Clock, TrendingUp, CheckSquare, Bell, FileText, Edit2 } from 'lucide-react';
import ClockInOutWidget from '@/shared/components/ClockInOutWidget';

const ManagerDashboard: React.FC = () => {
  const appCtx = useContext(AppContext);
  const { user } = useAuth();
  if (!user || !appCtx) return null;

  const employee = appCtx.employees.find(e => e.employeeId === user.employeeId);
  const avatar = employee?.photo || '/public/file.svg';
  // Team: employees managed by this manager
  const team = appCtx.employees.filter(e => e.manager === user.name || e.manager === user.employeeId);
  const teamSize = team.length;
  // Team attendance: count present today
  const today = new Date().toISOString().slice(0, 10);
  const teamAttendance = appCtx.attendanceRecords.filter(r => team.some(e => e.employeeId === r.employeeId) && r.date === today);
  // Team performance: average rating
  const teamReviews = appCtx.performanceReviews.filter(r => team.some(e => e.employeeId === r.employeeId));
  const avgRating = teamReviews.length > 0 ? (teamReviews.reduce((sum, r) => sum + (r.overallRating || 0), 0) / teamReviews.length).toFixed(2) : '-';
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
          <p className="text-gray-600 text-lg">Oversee your team's performance, attendance, and tasks.</p>
        </div>
      </div>
      {/* Widgets Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <Users size={24} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Team Size</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600">{teamSize}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={24} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Team Attendance Today</h3>
          </div>
          <div className="text-sm text-gray-600">Present: <b>{teamAttendance.length}</b> / {teamSize}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={24} className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Team Performance</h3>
          </div>
          <div className="text-sm text-gray-600">Avg. Rating: <b>{avgRating}</b></div>
        </div>
      </div>
      {/* Clock In/Out Widget */}
      <ClockInOutWidget employeeId={user.employeeId || user.id} compact />
      {/* Notifications */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><Bell size={20} className="text-yellow-500" /> Team Notifications</h2>
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
            <CheckSquare size={28} className="text-primary" />
            <span className="font-semibold">Approve Timesheets</span>
          </button>
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <TrendingUp size={28} className="text-primary" />
            <span className="font-semibold">Review Team Performance</span>
          </button>
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <Clock size={28} className="text-primary" />
            <span className="font-semibold">Manage Attendance</span>
          </button>
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <Edit2 size={28} className="text-primary" />
            <span className="font-semibold">Assign Tasks</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard; 
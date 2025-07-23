import React, { useContext } from 'react';
import { AppContext } from '@/domains/auth/context/AppContext';
import { useAuth } from '@/domains/auth/context/AuthContext';
import { Users, Building, Shield, Plus, Bell, FileText, Settings } from 'lucide-react';
import ClockInOutWidget from '@/presentation/components/ClockInOutWidget';


const AdminDashboard: React.FC = () => {
  const appCtx = useContext(AppContext);
  const { user } = useAuth();
  if (!user || !appCtx) return null;

  const totalEmployees = appCtx.employees.length || 0;
  const totalDepartments = appCtx.departments?.length || 0;
  const notifications = appCtx.notifications;
  const employee = appCtx.employees.find(e => e.employeeId === user.employeeId);
  const avatar = employee?.photo || '/public/file.svg';

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
          <p className="text-gray-600 text-lg">Manage your organization's HR system, employees, and departments.</p>
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
            <Building size={24} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Departments</h3>
          </div>
          <div className="text-2xl font-bold text-green-600">{totalDepartments}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={24} className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Admin Tools</h3>
          </div>
          <div className="text-2xl font-bold text-purple-600">3</div>
        </div>
      </div>
      {/* Clock In/Out Widget */}
      <ClockInOutWidget employeeId={user.employeeId || user.id} compact />
      {/* Notifications */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><Bell size={20} className="text-yellow-500" /> System Notifications</h2>
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
            <Shield size={28} className="text-primary" />
            <span className="font-semibold">Manage Roles & Permissions</span>
          </button>
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <Plus size={28} className="text-primary" />
            <span className="font-semibold">Add Employee</span>
          </button>
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <Building size={28} className="text-primary" />
            <span className="font-semibold">Manage Departments</span>
          </button>
          <button className="p-6 rounded-lg border bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:text-white transition-shadow cursor-pointer flex flex-col items-center gap-2">
            <FileText size={28} className="text-primary" />
            <span className="font-semibold">View System Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
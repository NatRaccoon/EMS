"use client"
import React from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Building, 
  CheckSquare, 
  BarChart3,
  Settings,
  LogOut,
  Bell
} from 'lucide-react';
import { useAuth } from '@/domains/auth/context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout, hasPermission } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, permission: 'all' },
    { id: 'employees', label: 'Employees', icon: Users, permission: 'employees' },
    { id: 'departments', label: 'Departments', icon: Building, permission: 'employees' },
    { id: 'attendance', label: 'Attendance', icon: Clock, permission: 'attendance' },
    { id: 'leave', label: 'Leave', icon: Calendar, permission: 'leave' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, permission: 'tasks' },
    { id: 'performance', label: 'Performance', icon: TrendingUp, permission: 'performance' },
    { id: 'payroll', label: 'Payroll', icon: DollarSign, permission: 'payroll' },
    { id: 'documents', label: 'Documents', icon: FileText, permission: 'employees' },
    { id: 'reports', label: 'Reports', icon: BarChart3, permission: 'all' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'all' }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    hasPermission(item.permission) || 
    hasPermission('all') ||
    (user?.role === 'employee' && ['dashboard', 'attendance', 'leave', 'tasks', 'performance'].includes(item.id))
  );

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">HR System</h1>
        <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} className="mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
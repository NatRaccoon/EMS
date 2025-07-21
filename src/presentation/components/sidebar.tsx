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
  Bell,
  Shield
} from 'lucide-react';
import { useAuth } from '@/domains/auth/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';


const Sidebar: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, permission: 'all', route: '/dashboard' },
    { id: 'admin', label: 'Admin Panel', icon: Shield, permission: 'admin', route: '/dashboard/admin' },
    { id: 'employees', label: 'Employees', icon: Users, permission: 'employees', route: '/dashboard/employee' },
    { id: 'departments', label: 'Departments', icon: Building, permission: 'employees', route: '/dashboard/departments' },
    { id: 'attendance', label: 'Attendance', icon: Clock, permission: 'attendance', route: '/dashboard/attendance' },
    { id: 'leave', label: 'Leave', icon: Calendar, permission: 'leave', route: '/dashboard/leave' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, permission: 'tasks', route: '/dashboard/tasks' },
    { id: 'performance', label: 'Performance', icon: TrendingUp, permission: 'performance', route: '/dashboard/performance' },
    { id: 'payroll', label: 'Payroll', icon: DollarSign, permission: 'payroll', route: '/dashboard/payroll' },
    { id: 'documents', label: 'Documents', icon: FileText, permission: 'employees', route: '/dashboard/documents' },
    { id: 'reports', label: 'Reports', icon: BarChart3, permission: 'all', route: '/dashboard/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'all', route: '/settings' }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    // Dashboard is always available to all users
    if (item.id === 'dashboard') return true;
    
    // Admin panel only for admins
    if (item.id === 'admin') return user?.role === 'admin';
    
    // Other items based on permissions and role
    return hasPermission(item.permission) || 
           hasPermission('all') ||
           (user?.role === 'employee' && ['attendance', 'leave', 'tasks', 'performance'].includes(item.id)) ||
           (user?.role === 'hr' && ['employees', 'payroll', 'performance', 'leave'].includes(item.id)) ||
           (user?.role === 'manager' && ['employees', 'attendance', 'performance', 'tasks'].includes(item.id));
  });

  return (
    <div className="w-64 bg-white dark:bg-black shadow-lg h-screen flex flex-col fixed left-0 top-0 z-10">
      {/* Logo - Fixed */}
      <div className="p-6 border-b bg-white dark:bg-black flex-shrink-0 flex items-center justify-center">
        <span className="font-bold text-2xl text-primary tracking-tight">EMS</span>
      </div>
      {/* Navigation - Scrollable */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.route;
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.route)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary border-l-4 border-primary'
                  : 'text-black dark:text-white hover:bg-primary/5 dark:hover:bg-primary/10'
              }`}
            >
              <Icon size={20} className="mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer - Fixed */}
      <div className="p-4 border-t bg-white flex-shrink-0">
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
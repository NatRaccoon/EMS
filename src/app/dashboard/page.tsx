"use client"
import React from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useContext } from 'react';
import { AppContext } from '@/features/auth/context/AppContext';
import { 
  Users, 
  Clock, 
  Building, 
  Shield, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  BarChart3,
  Plus,
  Settings
} from 'lucide-react';
import AdminDashboard from '@/features/admin/components/AdminDashboard';
import HRDashboard from '@/features/admin/components/HRDashboard';
import ManagerDashboard from '@/features/admin/components/ManagerDashboard';
import EmployeeDashboard from '@/features/employee/components/EmployeeDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  const appCtx = useContext(AppContext);

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'hr':
      return <HRDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    default:
      return <EmployeeDashboard />;
  }
}

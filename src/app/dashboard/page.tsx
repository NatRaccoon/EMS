"use client"
import React from 'react';
import { useAuth } from '@/domains/auth/context/AuthContext';
import { useContext } from 'react';
import { AppContext } from '@/domains/auth/context/AppContext';
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
import AdminDashboard from '../../domains/admin/components/AdminDashboard';
import HRDashboard from '../../domains/admin/components/HRDashboard';
import ManagerDashboard from '../../domains/admin/components/ManagerDashboard';
import EmployeeDashboard from '../../domains/employee/components/EmployeeDashboard';

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

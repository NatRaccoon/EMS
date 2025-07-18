"use client"

import { useAuth } from "@/domains/auth/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null; // Avoid flashing

  //   const renderContent = () => {
  //   switch (activeTab) {
  //     case 'dashboard':
  //       return <Dashboard />;
  //     case 'employees':
  //       return <EmployeeList />;
  //     case 'attendance':
  //       return <AttendanceTracker />;
  //     case 'leave':
  //       return <LeaveManagement />;
  //     case 'departments':
  //       return <DepartmentManagement />;
  //     case 'tasks':
  //       return <TaskManagement />;
  //     case 'performance':
  //       return <PerformanceManagement />;
  //     case 'payroll':
  //       return <PayrollManagement />;
  //     case 'documents':
  //       return <DocumentManagement />;
  //     case 'reports':
  //       return <ReportsAnalytics />;
  //     case 'settings':
  //       return <Settings />;
  //     default:
  //       return <Dashboard />;
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
      <h1 className="text-4xl font-bold">Tailwind 3.4 + Next.js 🎉</h1>
    </div>
  );
};


export default Home
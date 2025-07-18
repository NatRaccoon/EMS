'use client'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/domains/auth/slices/auth.slice'
import React, { useState } from 'react';


import { useAuth } from '@/domains/auth/context/AuthContext';
import { Building, Mail, User, Lock } from 'lucide-react';




export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    } else {
      router.replace('/dashboard'); // ✅ Go to dashboard after mock login
    }
  } catch (err) {
    setError('Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  const demoAccounts = [
    { role: 'Admin', email: 'admin@company.com', password: 'password' },
    { role: 'HR', email: 'hr@company.com', password: 'password' },
    { role: 'Manager', email: 'manager@company.com', password: 'password' },
    { role: 'Employee', email: 'employee@company.com', password: 'password' }
  ];

  const handleDemoLogin = (email: string) => {
    setEmail(email);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="flex">
          {/* Left Side - Branding */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-center">
            <div className="text-white">
              <div className="flex items-center mb-8">
                <Building size={48} className="mr-4" />
                <h1 className="text-3xl font-bold">HR System</h1>
              </div>
              <h2 className="text-2xl font-semibold mb-4">Employee Management Made Simple</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Streamline your HR processes with our comprehensive employee management system. 
                Track attendance, manage leave requests, handle payroll, and boost productivity.
              </p>
              <div className="mt-8 space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  <span className="text-blue-100">Complete Employee Profiles</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  <span className="text-blue-100">Automated Attendance Tracking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  <span className="text-blue-100">Performance Management</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  <span className="text-blue-100">Payroll & Reporting</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your HR dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.role}
                      onClick={() => handleDemoLogin(account.email)}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      <User size={16} className="mr-2" />
                      {account.role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
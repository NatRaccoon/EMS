// components/LayoutShell.tsx
'use client';

import { useAuth } from '@/domains/auth/context/AuthContext';
import { useState } from 'react';
import Sidebar from './sidebar';
import Navbar from './Navbar';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { mustChangePassword, setPassword, user } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await setPassword(newPassword);
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar  />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <Navbar />
        {children}
      </main>
      {mustChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleChangePassword} className="bg-white dark:bg-black rounded-2xl shadow-2xl p-8 w-full max-w-md border border-primary/20 relative">
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Change Your Password</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">For security, you must set a new password before continuing.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input type="password" className="border rounded px-2 py-1 w-full" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input type="password" className="border rounded px-2 py-1 w-full" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}
            {success && <div className="mb-2 text-green-600 text-sm">Password updated! You may now continue.</div>}
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl w-full mt-2 text-lg font-semibold" disabled={isLoading}>{isLoading ? 'Updating...' : 'Set Password'}</button>
          </form>
        </div>
      )}
    </div>
  );
}

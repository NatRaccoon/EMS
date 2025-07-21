"use client"
import React, { useContext, useState, useRef } from 'react';
import { useAuth } from '@/domains/auth/context/AuthContext';
import { AppContext } from '@/domains/auth/context/AppContext';
import { Bell, Search, Sun, Moon, LogOut, User, Settings, Edit2 } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const appCtx = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [dark, setDark] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Notifications for this user
  const notifications = appCtx?.notifications?.filter(n => n.userId === user?.id) || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Theme toggle (optional)
  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-black backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-between w-full shadow-sm">
      {/* User Name and Role (Left) */}
      {user && (
        <div className="hidden md:flex flex-col items-start mr-6">
          <span className="font-semibold text-black dark:text-white text-sm leading-tight">{user.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</span>
        </div>
      )}
      {/* Search Bar */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search employees, departments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>
      {/* Right Side: Notifications, Theme, Profile */}
      <div className="flex items-center gap-4 ml-4">
        {/* Theme Toggle */}
        <button
          className="p-2 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20"
          onClick={() => setDark(d => !d)}
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={20} className="text-primary" /> : <Moon size={20} className="text-black" />}
        </button>
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            className="relative p-2 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20"
            onClick={() => setShowNotif(s => !s)}
            aria-label="Notifications"
          >
            <Bell size={20} className="text-black dark:text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-gray-100 dark:border-gray-800 font-semibold text-black dark:text-white">Notifications</div>
              {notifications.length === 0 ? (
                <div className="p-4 text-gray-400 text-sm">No notifications.</div>
              ) : notifications.map(n => (
                <div key={n.id} className={`flex items-start gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-800 ${n.read ? 'bg-gray-50 dark:bg-gray-900' : 'bg-primary/10 dark:bg-primary/20'}`}>
                  <span className={`w-2 h-2 rounded-full mt-2 ${n.read ? 'bg-gray-300' : 'bg-primary'}`}></span>
                  <div className="flex-1">
                    <div className="font-medium text-black dark:text-white">{n.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{n.message}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center gap-2 p-1 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20"
            onClick={() => setShowProfile(s => !s)}
            aria-label="Profile"
          >
            <img
              src={user?.photo || '/public/file.svg'}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-gray-300 object-cover"
            />
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <img
                  src={user?.photo || '/public/file.svg'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
                <div>
                  <div className="font-semibold text-black dark:text-white">{user?.name || user?.email}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</div>
                </div>
              </div>
              <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-primary/10 dark:hover:bg-primary/20 text-black dark:text-white" onClick={() => setShowProfile(false)}>
                <User size={16} /> View Profile
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-primary/10 dark:hover:bg-primary/20 text-black dark:text-white" onClick={() => setShowProfile(false)}>
                <Edit2 size={16} /> Edit Profile
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-primary/10 dark:hover:bg-primary/20 text-black dark:text-white" onClick={() => setShowProfile(false)}>
                <Settings size={16} /> Settings
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border-t border-gray-100 dark:border-gray-800" onClick={logout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
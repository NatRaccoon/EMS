// components/LayoutShell.tsx
'use client';

import { useState } from 'react';
import Sidebar from './sidebar';
import Navbar from './Navbar';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex">
      <Sidebar  />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <Navbar />
        {children}
      </main>
    </div>
  );
}

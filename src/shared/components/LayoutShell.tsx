// components/LayoutShell.tsx
'use client';

import { useState } from 'react';
import Sidebar from './sidebar';


export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">{children}</main>
    </div>
  );
}

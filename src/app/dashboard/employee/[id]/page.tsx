"use client"
import { useParams, useRouter } from 'next/navigation'
import { useEmployeeStore } from '@/domains/employee/slices/employee.slice'
import { Employee } from '@/domains/employee/types/employee.data'
import { useMemo, useState } from 'react'
import { Mail, Phone, User, Briefcase, FileText, Activity, Edit, Power } from 'lucide-react'

export default function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { employees } = useEmployeeStore()
  const emp: Employee | undefined = useMemo(() => employees.find(e => e.id === id), [employees, id])
  const [tab, setTab] = useState<'profile'|'activity'|'documents'>('profile')

  function getAvatarColor(str: string) {
    const colors = [
      'bg-primary/80', 'bg-green-600', 'bg-blue-600', 'bg-yellow-600', 'bg-pink-600', 'bg-purple-600', 'bg-orange-600', 'bg-teal-600', 'bg-indigo-600'
    ]
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  if (!emp) return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <button className="mb-6 text-primary hover:underline" onClick={() => router.back()}>&larr; Back to Employees</button>
      <div className="bg-red-100 text-red-700 p-6 rounded-lg font-semibold">Employee not found.</div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto min-h-screen py-8 px-1 md:px-6 flex flex-col">
      <button className="mb-6 text-primary hover:underline" onClick={() => router.back()}>&larr; Back to Employees</button>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Sidebar */}
        <aside className="w-full md:w-80 flex-shrink-0 flex flex-col items-center md:items-stretch gap-6 bg-white dark:bg-black rounded-2xl shadow-lg border border-primary/20 p-6 sticky top-8 h-fit">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-4xl uppercase mb-2 ${getAvatarColor(emp.name || emp.id)}`}>{emp.name ? emp.name.split(' ').map(n => n[0]).join('').slice(0,2) : '?'}</div>
          <div className="flex flex-col items-center md:items-start gap-1">
            <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2"><User size={22} />{emp.name}</h1>
            <span className="capitalize text-primary font-semibold flex items-center gap-2"><Briefcase size={18} />{emp.role}</span>
            <span className={`font-semibold flex items-center gap-2 ${emp.status === 'active' ? 'text-primary' : 'text-red-600'}`}><Power size={18} />{emp.status ? emp.status.charAt(0).toUpperCase() + emp.status.slice(1) : ''}</span>
          </div>
          {/* Contact Card */}
          <div className="w-full bg-primary/5 rounded-xl p-4 flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><Mail size={18} /> <span>{emp.email}</span></div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><Phone size={18} /> <span className="italic text-gray-400">No phone</span></div>
          </div>
          {/* Actions */}
          <div className="flex gap-3 mt-4 w-full">
            <button className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary-dark transition flex items-center justify-center gap-2" onClick={() => {/* TODO: Edit logic */}}><Edit size={18}/> Edit</button>
            <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition flex items-center justify-center gap-2" onClick={() => {/* TODO: Deactivate logic */}}><Power size={18}/> Deactivate</button>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex border-b border-primary/10 bg-primary/5 rounded-t-2xl">
            <button className={`px-6 py-4 font-semibold transition-colors flex items-center gap-2 ${tab==='profile' ? 'text-primary border-b-2 border-primary bg-white dark:bg-black' : 'text-gray-500 hover:text-primary'}`} onClick={() => setTab('profile')}><User size={18}/> Profile</button>
            <button className={`px-6 py-4 font-semibold transition-colors flex items-center gap-2 ${tab==='activity' ? 'text-primary border-b-2 border-primary bg-white dark:bg-black' : 'text-gray-500 hover:text-primary'}`} onClick={() => setTab('activity')}><Activity size={18}/> Activity</button>
            <button className={`px-6 py-4 font-semibold transition-colors flex items-center gap-2 ${tab==='documents' ? 'text-primary border-b-2 border-primary bg-white dark:bg-black' : 'text-gray-500 hover:text-primary'}`} onClick={() => setTab('documents')}><FileText size={18}/> Documents</button>
          </div>
          {/* Tab Content */}
          <div className="p-6 min-h-[300px] bg-white dark:bg-black rounded-b-2xl shadow border border-primary/10">
            {tab === 'profile' && (
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="text-lg font-bold mb-2 text-black dark:text-white flex items-center gap-2"><User size={18}/> Contact & Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><span className="font-semibold text-gray-500">Email:</span> <span className="text-black dark:text-white">{emp.email}</span></div>
                    <div><span className="font-semibold text-gray-500">Role:</span> <span className="capitalize text-black dark:text-white">{emp.role}</span></div>
                    <div><span className="font-semibold text-gray-500">Status:</span> <span className={`font-semibold ${emp.status === 'active' ? 'text-primary' : 'text-red-600'}`}>{emp.status ? emp.status.charAt(0).toUpperCase() + emp.status.slice(1) : ''}</span></div>
                    {/* Add more fields as needed */}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold mb-2 text-black dark:text-white flex items-center gap-2"><Briefcase size={18}/> Other Info</h2>
                  <div className="text-gray-500">No additional info yet.</div>
                </div>
              </div>
            )}
            {tab === 'activity' && (
              <div>
                <h2 className="text-lg font-bold mb-2 text-black dark:text-white flex items-center gap-2"><Activity size={18}/> Recent Activity</h2>
                <div className="text-gray-500">No recent activity found. (Clock-ins, edits, etc. will appear here.)</div>
              </div>
            )}
            {tab === 'documents' && (
              <div>
                <h2 className="text-lg font-bold mb-2 text-black dark:text-white flex items-center gap-2"><FileText size={18}/> Documents</h2>
                <div className="text-gray-500">No documents uploaded yet. (Upload and manage files here in the future.)</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 
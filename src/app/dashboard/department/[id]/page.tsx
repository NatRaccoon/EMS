"use client"
import { useParams, useRouter } from 'next/navigation';
import { useDepartmentStore } from '@/domains/department/slices/department.slice';
import { useEmployeeStore } from '@/domains/employee/slices/employee.slice';
import { Users, ArrowLeft, User2 } from 'lucide-react';

export default function DepartmentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { departments, getAuditLog } = useDepartmentStore();
  const { employees } = useEmployeeStore();
  const dept = departments.find(d => d.id === id);
  const members = employees.filter(e => e.departmentId === id);
  const manager = dept?.managerId ? employees.find(e => e.id === dept.managerId) : null;
  const auditLog = getAuditLog().filter(log => log.departmentId === id);

  if (!dept) return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-primary mb-4 text-lg font-semibold hover:underline"><ArrowLeft/> Back</button>
      <div className="bg-red-100 text-red-700 p-6 rounded-xl font-semibold">Department not found.</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="sticky top-0 z-10 bg-white dark:bg-black rounded-2xl shadow p-4 mb-8 flex items-center gap-4 border border-primary/10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-primary text-lg font-semibold hover:underline"><ArrowLeft/> Back</button>
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-extrabold shadow">
            {dept.name?.charAt(0) || '?'}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">{dept.name}</h1>
            <div className="text-gray-500 text-sm">Department</div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-primary/20 p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8 mb-6">
          <div className="flex-1">
            <div className="text-gray-500 mb-1">Manager</div>
            <div className="flex items-center gap-2 font-semibold">
              {manager ? <><User2 size={18}/>{manager.name}</> : <span className="text-gray-400">None</span>}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-gray-500 mb-1">Members</div>
            <div className="font-semibold text-primary text-lg">{members.length}</div>
          </div>
        </div>
        <div className="border-t border-primary/10 my-6" />
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white flex items-center gap-2"><Users size={20}/> Members</h2>
        {members.length === 0 ? (
          <div className="text-gray-400">No members in this department.</div>
        ) : (
          <ul className="space-y-2">
            {members.map(emp => (
              <li key={emp.id} className="flex items-center gap-3 p-2 rounded hover:bg-primary/5 transition">
                <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                  {emp.name?.charAt(0) || '?'}
                </span>
                <span className="font-semibold">{emp.name}</span>
                <span className="text-xs text-gray-500 ml-2">{emp.role}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-primary/10 my-6" />
        <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Recent Activity</h2>
        <div className="text-gray-400">(Activity log coming soon...)</div>
      </div>
      <div className="border-t border-primary/10 my-6" />
      <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Change History</h2>
      {auditLog.length === 0 ? (
        <div className="text-gray-400">No changes yet.</div>
      ) : (
        <ul className="space-y-2">
          {auditLog.slice().reverse().map(log => (
            <li key={log.id} className="p-3 rounded bg-primary/5 flex flex-col md:flex-row md:items-center gap-2">
              <span className="text-xs text-gray-500 w-40">{new Date(log.timestamp).toLocaleString()}</span>
              <span className={`text-xs font-bold ${log.type === 'add' ? 'text-green-700' : log.type === 'update' ? 'text-yellow-700' : 'text-red-700'}`}>{log.type.toUpperCase()}</span>
              <span className="text-sm text-black dark:text-white">{log.summary}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 
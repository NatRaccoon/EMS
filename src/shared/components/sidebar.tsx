'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navItems = [
  { name: 'Employees', path: '/dashboard/employee' },
  { name: 'Attendance', path: '/dashboard/attendance' },
  { name: 'Payroll', path: '/dashboard/payroll' },
  { name: 'Performance', path: '/dashboard/performance' },
  { name: 'Admin', path: '/dashboard/admin' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4 fixed">
      <h2 className="text-xl font-bold mb-6">Code Raccoon EMS</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map(item => (
          <Link
            key={item.path}
            href={item.path}
            className={clsx(
              'px-3 py-2 rounded hover:bg-gray-700',
              pathname === item.path && 'bg-gray-700'
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
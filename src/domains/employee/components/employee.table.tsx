'use client'

import { useEmployeeStore } from "../slices/employee.slice"
import { useState, useMemo, useEffect } from 'react'
import { useDepartmentStore } from '../../department/slices/department.slice'

export default function EmployeeTable({ onEdit, onView, renderAddButton, renderNameCell }: any) {
  const { employees, deleteEmployee } = useEmployeeStore()
  const { departments } = useDepartmentStore()

  // Search/filter/sort state
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'name'|'role'|'status'>('name')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  // Filtered and sorted employees
  const filtered = employees.filter(emp => {
    if (statusFilter !== 'all' && emp.status !== statusFilter) return false
    if (roleFilter !== 'all' && emp.role !== roleFilter) return false
    if (departmentFilter !== 'all') {
      if (departmentFilter === 'none' && emp.departmentId) return false
      if (departmentFilter !== 'none' && emp.departmentId !== departmentFilter) return false
    }
    if (search.trim() && !emp.name.toLowerCase().includes(search.trim().toLowerCase())) return false
    return true
  })
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0
    if (sortBy === 'name') cmp = a.name.localeCompare(b.name)
    else if (sortBy === 'role') cmp = a.role.localeCompare(b.role)
    else if (sortBy === 'status') cmp = a.status.localeCompare(b.status)
    return sortDir === 'asc' ? cmp : -cmp
  })

  // Pagination state (moved after sorted)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  // Reset to page 1 if filters/search/sort/pageSize change and page is out of range
  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [sorted.length, pageSize])

  // Unique roles for filter
  const uniqueRoles = useMemo(() => {
    const set = new Set(employees.map(e => e.role))
    return Array.from(set)
  }, [employees])
  // Unique departments for filter
  const uniqueDepartments = useMemo(() => {
    const set = new Set(employees.map(e => e.departmentId).filter(Boolean))
    return Array.from(set)
  }, [employees])
  // Helper: get department name
  function getDeptName(id?: string) {
    if (!id) return 'None'
    const dept = departments.find(d => d.id === id)
    return dept ? dept.name : 'None'
  }

  // Bulk selection state
  const [selected, setSelected] = useState<string[]>([])
  // Helper: all IDs on current page
  const pageIds = paginated.map(emp => emp.id)
  const allSelected = pageIds.length > 0 && pageIds.every(id => selected.includes(id))
  const someSelected = pageIds.some(id => selected.includes(id))

  // Bulk action handlers
  const handleSelectAll = () => {
    if (allSelected) {
      setSelected(selected.filter(id => !pageIds.includes(id)))
    } else {
      setSelected([...selected, ...pageIds.filter(id => !selected.includes(id))])
    }
  }
  const handleSelectOne = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter(sid => sid !== id) : [...selected, id])
  }
  const handleDeleteSelected = () => {
    selected.forEach(id => deleteEmployee(id))
    setSelected([])
  }
  const handleExportSelected = () => {
    const rows = [
      ['Name', 'Email', 'Role', 'Status'],
      ...employees.filter(emp => selected.includes(emp.id)).map(emp => [emp.name, emp.email, emp.role, emp.status])
    ]
    const csv = rows.map(r => r.map(v => `"${(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'employees-selected.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Helper: deterministic color for avatar
  function getAvatarColor(str: string) {
    // Simple hash to pick a color
    const colors = [
      'bg-primary/80', 'bg-green-600', 'bg-blue-600', 'bg-yellow-600', 'bg-pink-600', 'bg-purple-600', 'bg-orange-600', 'bg-teal-600', 'bg-indigo-600'
    ]
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div>
      {/* Search, Filters, Sort Controls */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          className="border rounded px-2 py-1"
          placeholder="Search name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="border rounded px-2 py-1" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select className="border rounded px-2 py-1" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          {uniqueRoles.map((role, idx) => <option key={role ? `role-${role}` : `idx-${idx}`} value={role}>{role}</option>)}
        </select>
        <select className="border rounded px-2 py-1" value={departmentFilter} onChange={e => { setDepartmentFilter(e.target.value); setPage(1); }}>
          <option value="all">All Departments</option>
          {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
          <option value="none">None</option>
        </select>
        <select className="border rounded px-2 py-1" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
          <option value="name">Sort by Name</option>
          <option value="role">Sort by Role</option>
          <option value="status">Sort by Status</option>
        </select>
        <button className="border rounded px-2 py-1" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>{sortDir === 'asc' ? '↑' : '↓'}</button>
        <div className="flex gap-2 ml-auto">
          {renderAddButton && renderAddButton()}
          <button
            className="bg-primary text-white px-4 py-2 rounded font-semibold shadow hover:bg-primary-dark transition"
            onClick={() => {
              const rows = [
                ['Name', 'Email', 'Role', 'Status'],
                ...sorted.map(emp => [emp.name, emp.email, emp.role, emp.status])
              ];
              const csv = rows.map(r => r.map(v => `"${(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'employees.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export CSV
          </button>
        </div>
      </div>
      {/* Bulk actions bar */}
      {selected.length > 0 && (
        <div className="flex items-center gap-4 mb-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2">
          <span className="font-semibold text-primary">{selected.length} selected</span>
          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-semibold" onClick={handleDeleteSelected}>Delete Selected</button>
          <button className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark font-semibold" onClick={handleExportSelected}>Export Selected</button>
          <button className="ml-auto text-gray-500 hover:text-black" onClick={() => setSelected([])}>Clear</button>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white dark:bg-black border border-primary/20 rounded-lg overflow-hidden shadow text-sm md:text-base">
          <thead>
            <tr className="bg-primary/10 text-primary">
              <th className="px-2 py-2 border w-8 min-w-[32px]">{/* Checkbox */}</th>
              <th className="px-4 py-2 border min-w-[160px]">Name</th>
              <th className="px-4 py-2 border min-w-[180px]">Email</th>
              <th className="px-4 py-2 border min-w-[140px]">Department</th>
              <th className="px-4 py-2 border min-w-[120px]">Role</th>
              <th className="px-4 py-2 border min-w-[100px]">Status</th>
              <th className="px-4 py-2 border min-w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((emp, idx)  => (
              <tr key={emp.id ? `emp-${emp.id}` : `idx-${idx}`} className="hover:bg-primary/5 transition">
                <td className="px-2 py-2 border text-center">
                  <input type="checkbox" checked={selected.includes(emp.id)} onChange={() => handleSelectOne(emp.id)} />
                </td>
                <td className="px-4 py-2 border flex items-center gap-3 min-w-[160px]">
                  {/* Avatar with initials and color */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-lg uppercase ${getAvatarColor(emp.name || emp.id)}`}>
                    {emp.name ? emp.name.split(' ').map(n => n[0]).join('').slice(0,2) : '?'}
                  </div>
                  <span className="truncate">
                    {renderNameCell ? renderNameCell(emp) : emp.name}
                  </span>
                </td>
                <td className="px-4 py-2 border min-w-[180px] truncate">{emp.email}</td>
                <td className="px-4 py-2 border min-w-[140px]">{getDeptName(emp.departmentId)}</td>
                <td className="px-4 py-2 border capitalize min-w-[120px]">{emp.role}</td>
                <td className="px-4 py-2 border min-w-[100px]">
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${emp.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-red-100 text-red-600'}`}>
                    {emp.status ? emp.status.charAt(0).toUpperCase() + emp.status.slice(1) : ''}
                  </span>
                </td>
                <td className="px-4 py-2 border min-w-[120px] space-x-2">
                  <button className="px-3 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 font-semibold transition" onClick={() => onView(emp)}>View</button>
                  <button className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-semibold transition" onClick={() => onEdit(emp)}>Edit</button>
                  <button className="px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 font-semibold transition" onClick={() => deleteEmployee(emp.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select className="border rounded px-2 py-1" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
            {[10, 20, 50].map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded bg-primary/10 text-primary font-semibold disabled:opacity-50" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button className="px-2 py-1 rounded bg-primary/10 text-primary font-semibold disabled:opacity-50" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .flex-wrap, .gap-2, .mb-4, .items-center { flex-direction: column !important; align-items: stretch !important; gap: 0.5rem !important; }
        }
      `}</style>
    </div>
  )
}
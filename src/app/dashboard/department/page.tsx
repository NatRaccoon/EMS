"use client"
import { useDepartmentStore } from '@/domains/department/slices/department.slice'
import { useEmployeeStore } from '@/domains/employee/slices/employee.slice'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Users, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/domains/auth/context/AuthContext';
import Select from 'react-select';

function exportDepartmentsToCSV(departments: any[], employees: any[]) {
  const header = ['Department Name', 'Manager', 'Members']
  const rows = departments.map((dept: any) => [
    dept.name,
    dept.managerId ? (employees.find((e: any) => e.id === dept.managerId)?.name || dept.managerId) : '',
    employees.filter((e: any) => e.departmentId === dept.id).length
  ])
  const csv = [header, ...rows].map((r: any) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'departments.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// Add a function to generate a color from a string
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 60%, 60%)`;
  return color;
}

export default function DepartmentPage() {
  const { departments, fetchDepartments, addDepartment, updateDepartment, deleteDepartment } = useDepartmentStore()
  const { employees } = useEmployeeStore()
  const { user } = useAuth();
  const isHRorAdmin = user && (user.role === 'admin' || user.role === 'hr');
  const [showForm, setShowForm] = useState(false)
  const [editDept, setEditDept] = useState<any>(null)
  const [form, setForm] = useState({ name: '', managerId: '', parentId: '' })
  const [search, setSearch] = useState('')
  const [managerFilter, setManagerFilter] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [managerSearch, setManagerSearch] = useState('');
  const [parentDeptSearch, setParentDeptSearch] = useState('');
  const router = useRouter()

  useEffect(() => {
    fetchDepartments();
    fetch('http://localhost:3001/users')
      .then(res => res.json())
      .then(setUsers);
  }, [fetchDepartments]);

  // Filtered departments
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(search.toLowerCase())
    const matchesManager = managerFilter ? dept.managerId === managerFilter : true
    return matchesSearch && matchesManager
  })

  // Bulk selection handlers
  const allSelected = filteredDepartments.length > 0 && filteredDepartments.every(d => selected.includes(d.id))
  const toggleAll = () => {
    if (allSelected) setSelected([])
    else setSelected(filteredDepartments.map(d => d.id))
  }
  const toggleOne = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(sid => sid !== id) : [...sel, id])
  }
  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selected.length} selected department(s)?`)) {
      selected.forEach(id => deleteDepartment(id))
      setSelected([])
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editDept) {
      if (!window.confirm('Are you sure you want to save changes to this department?')) return;
      updateDepartment(editDept.id, { name: form.name, managerId: form.managerId, parentId: form.parentId })
    } else {
      addDepartment({ id: Date.now().toString(), name: form.name, managerId: form.managerId, parentId: form.parentId })
    }
    setShowForm(false)
    setEditDept(null)
    setForm({ name: '', managerId: '', parentId: '' })
  }

  const handleEdit = (dept: any) => {
    setEditDept(dept)
    setForm({ name: dept.name, managerId: dept.managerId || '', parentId: dept.parentId || '' })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this department?')) deleteDepartment(id)
  }

  function renderDepartmentsTree(parentId = '') {
    return filteredDepartments.filter(d => (d.parentId || '') === parentId).map(dept => {
      const members = employees.filter((e: any) => e.departmentId === dept.id)
      return (
        <div key={dept.id} className={`flex flex-col md:flex-row md:items-center gap-2 px-4 py-4 hover:bg-primary/5 transition rounded-xl ${parentId ? 'ml-8 border-l-2 border-primary/10' : ''}`}>
          <input
            type="checkbox"
            checked={selected.includes(dept.id)}
            onChange={() => toggleOne(dept.id)}
            className="accent-primary w-4 h-4 mr-2 self-start md:self-center"
            disabled={!isHRorAdmin}
          />
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
            <span
              className="font-semibold text-lg text-primary flex items-center gap-2 cursor-pointer hover:underline hover:text-primary-dark"
              onClick={() => router.push(`/dashboard/department/${dept.id}`)}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg shadow" style={{ background: stringToColor(dept.id) }}>
                {dept.name?.charAt(0) || '?'}
              </span>
              {dept.name}
            </span>
            <span className="text-gray-500 ml-2">{members.length} member{members.length !== 1 ? 's' : ''}</span>
            {dept.managerId && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">Manager: {(() => { const mgr = employees.find((e: any) => e.id === dept.managerId); return mgr ? `${mgr.firstName} ${mgr.lastName}` : dept.managerId })()}</span>}
          </div>
          {isHRorAdmin && (
            <div className="flex gap-2 ml-auto">
              <button className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-semibold transition flex items-center gap-1" onClick={() => handleEdit(dept)}><Edit size={16}/> Edit</button>
              <button className="px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 font-semibold transition flex items-center gap-1" onClick={() => handleDelete(dept.id)}><Trash2 size={16}/> Delete</button>
            </div>
          )}
          {/* Render sub-departments recursively */}
          {renderDepartmentsTree(dept.id)}
        </div>
      )
    })
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-2 md:px-6">
      <div className="sticky top-0 z-10 bg-white dark:bg-black rounded-2xl shadow p-4 mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border border-primary/10">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Departments</h1>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <input
            type="text"
            placeholder="Search departments..."
            className="border rounded px-2 py-1 w-48"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-2 py-1 w-48"
            value={managerFilter}
            onChange={e => setManagerFilter(e.target.value)}
          >
            <option value="">All Managers</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
            ))}
          </select>
          {isHRorAdmin && <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded font-semibold shadow hover:bg-primary-dark transition" onClick={() => { setShowForm(true); setEditDept(null); setForm({ name: '', managerId: '', parentId: '' }) }}><Plus size={20}/> Add Department</button>}
          <button className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded font-semibold shadow hover:bg-primary/20 transition border border-primary" onClick={() => exportDepartmentsToCSV(filteredDepartments, employees)}><Download size={20}/> Export CSV</button>
        </div>
      </div>
      {selected.length > 0 && isHRorAdmin && (
        <div className="mb-4 flex gap-2">
          <button className="bg-red-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-red-700 transition" onClick={handleBulkDelete}>
            <Trash2 size={18} className="inline mr-1"/> Delete Selected ({selected.length})
          </button>
        </div>
      )}
      <div className="text-xs text-gray-500 mb-2">You can view the change history for each department at the bottom of its details page.</div>
      <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-primary/20 p-0 divide-y divide-primary/10">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/10 bg-primary/5 rounded-t-2xl sticky top-[80px] z-5">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-primary w-4 h-4" disabled={!isHRorAdmin} />
          <span className="font-semibold text-gray-600">Select All</span>
        </div>
        {filteredDepartments.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No departments found.</div>
        ) : renderDepartmentsTree()}
      </div>
      {/* Add/Edit Department Modal */}
      {showForm && isHRorAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form className="bg-white dark:bg-black rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-primary/20" onSubmit={handleSubmit}>
            <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowForm(false)} aria-label="Close">×</button>
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white flex items-center gap-2">{editDept ? <Edit size={22}/> : <Plus size={22}/>} {editDept ? 'Edit' : 'Add'} Department</h2>
            <div className="flex justify-center mb-4">
              <span className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-2xl shadow" style={{ background: stringToColor(form.name || 'X') }}>
                {(form.name || 'X').charAt(0)}
              </span>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Department Name</label>
              <input className="border rounded px-2 py-1 w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Manager (optional)</label>
              <Select
                classNamePrefix="react-select"
                options={users.map(u => ({ value: u.id, label: `${u.name} (${u.role})` }))}
                value={users.find(u => u.id === form.managerId) ? { value: form.managerId, label: `${users.find(u => u.id === form.managerId)?.name} (${users.find(u => u.id === form.managerId)?.role})` } : null}
                onChange={(option: { value: string; label: string } | null) => setForm(f => ({ ...f, managerId: option ? option.value : '' }))}
                isClearable
                placeholder="Select or search for a manager..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Parent Department (optional)</label>
              <Select
                classNamePrefix="react-select"
                options={departments.filter(d => !editDept || d.id !== editDept.id).map(d => ({ value: d.id, label: d.name }))}
                value={departments.find(d => d.id === form.parentId) ? { value: form.parentId, label: departments.find(d => d.id === form.parentId)?.name || '' } : null}
                onChange={(option: { value: string; label: string } | null) => setForm(f => ({ ...f, parentId: option ? option.value : '' }))}
                isClearable
                placeholder="Select or search for a parent department..."
              />
            </div>
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl w-full mt-2 text-lg font-semibold">{editDept ? 'Save Changes' : 'Add Department'}</button>
          </form>
        </div>
      )}
    </div>
  )
} 
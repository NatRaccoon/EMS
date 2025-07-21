import React, { useState } from 'react';
import { useAttendanceContext } from '../context/AttendanceContext';
import { TimeLogCategory } from '@/shared/types';

const TIMER_TYPES = [
  { value: 'work', label: 'Work' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'break', label: 'Break' },
  { value: 'overtime', label: 'Overtime' },
  { value: 'other', label: 'Other' },
];

export default function ManualEntryForm({ employeeId }: { employeeId: string }) {
  const { addLog } = useAttendanceContext();
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState<TimeLogCategory>('work');
  const [project, setProject] = useState('');
  const [task, setTask] = useState('');
  const [notes, setNotes] = useState('');
  const [billable, setBillable] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!date || !startTime || !endTime) {
      setError('Date, start time, and end time are required.');
      return;
    }
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      setError('Invalid start or end time.');
      return;
    }
    const duration = Math.floor((end.getTime() - start.getTime()) / 60000);
    const now = new Date().toISOString();
    addLog({
      id: `${employeeId}-${Date.now()}`,
      employeeId,
      date,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration,
      type,
      project,
      task,
      notes,
      billable,
      createdAt: now,
      updatedAt: now,
    });
    setDate('');
    setStartTime('');
    setEndTime('');
    setType('work');
    setProject('');
    setTask('');
    setNotes('');
    setBillable(false);
  };

  return (
    <form className="bg-white rounded-lg shadow p-6 w-full max-w-md mx-auto mt-6" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Manual Time Entry</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-2 flex gap-2">
        <input
          type="date"
          className="border rounded px-2 py-1 flex-1"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          className="border rounded px-2 py-1 flex-1"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <input
          type="time"
          className="border rounded px-2 py-1 flex-1"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>
      <div className="mb-2 flex gap-2">
        <select
          className="border rounded px-2 py-1 flex-1"
          value={type}
          onChange={(e) => setType(e.target.value as TimeLogCategory)}
        >
          {TIMER_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="Project (optional)"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="Task (optional)"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>
      <textarea
        className="border rounded px-2 py-1 w-full mb-2"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={billable}
          onChange={(e) => setBillable(e.target.checked)}
          className="mr-2"
        />
        Billable
      </label>
      <button
        type="submit"
        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded w-full"
      >
        Add Time Log
      </button>
    </form>
  );
} 
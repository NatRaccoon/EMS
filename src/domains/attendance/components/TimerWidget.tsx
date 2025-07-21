import React, { useState, useEffect } from 'react';
import { useAttendanceContext } from '../context/AttendanceContext';

const TIMER_TYPES = [
  { value: 'work', label: 'Work' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'break', label: 'Break' },
  { value: 'overtime', label: 'Overtime' },
  { value: 'other', label: 'Other' },
];

export default function TimerWidget({ employeeId }: { employeeId: string }) {
  const {
    timer,
    startTimer,
    stopTimer,
    resetTimer,
  } = useAttendanceContext();

  const [type, setType] = useState('work');
  const [project, setProject] = useState('');
  const [task, setTask] = useState('');
  const [notes, setNotes] = useState('');
  const [billable, setBillable] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer.isRunning && timer.startTime) {
      interval = setInterval(() => {
        setElapsed(
          Math.floor((Date.now() - new Date(timer.startTime!).getTime()) / 1000)
        );
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => interval && clearInterval(interval);
  }, [timer.isRunning, timer.startTime]);

  const handleStart = () => {
    startTimer(type as any, project, task);
  };

  const handleStop = () => {
    stopTimer(employeeId, notes, billable);
    setNotes('');
    setBillable(false);
    setProject('');
    setTask('');
  };

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Time Tracker</h2>
      <div className="mb-4 flex gap-2">
        <select
          className="border rounded px-2 py-1"
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={timer.isRunning}
        >
          {TIMER_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="Project (optional)"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          disabled={timer.isRunning}
        />
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="Task (optional)"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          disabled={timer.isRunning}
        />
      </div>
      <div className="text-4xl font-mono text-center mb-4">
        {timer.isRunning && timer.startTime
          ? formatElapsed(elapsed)
          : '00:00:00'}
      </div>
      {timer.isRunning ? (
        <>
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
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
            onClick={handleStop}
          >
            Stop Timer
          </button>
        </>
      ) : (
        <button
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded w-full"
          onClick={handleStart}
        >
          Start Timer
        </button>
      )}
    </div>
  );
} 
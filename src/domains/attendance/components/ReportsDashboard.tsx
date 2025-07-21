import React from 'react';
import { useAttendanceContext } from '../context/AttendanceContext';

function sumByType(logs, type) {
  return logs.filter((l) => l.type === type).reduce((sum, l) => sum + l.duration, 0);
}

function sumByProject(logs) {
  const map = {};
  logs.forEach((l) => {
    if (!l.project) return;
    map[l.project] = (map[l.project] || 0) + l.duration;
  });
  return map;
}

function formatDuration(minutes: number) {
  const totalSeconds = Math.round(minutes * 60);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const TIMER_TYPES = [
  { value: 'work', label: 'Work' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'break', label: 'Break' },
  { value: 'overtime', label: 'Overtime' },
  { value: 'other', label: 'Other' },
];

export default function ReportsDashboard({ employeeId }: { employeeId: string }) {
  const { logs } = useAttendanceContext();
  const employeeLogs = logs.filter((log) => log.employeeId === employeeId);
  const totalMinutes = employeeLogs.reduce((sum, l) => sum + l.duration, 0);
  const byType = TIMER_TYPES.map((t) => ({
    ...t,
    minutes: sumByType(employeeLogs, t.value),
  }));
  const byProject = sumByProject(employeeLogs);

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Productivity Reports</h2>
      <div className="mb-4">Total Time Tracked: <b>{formatDuration(totalMinutes)}</b></div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">By Type</h3>
        <ul>
          {byType.map((t) => (
            <li key={t.value} className="flex justify-between">
              <span>{t.label}</span>
              <span>{formatDuration(t.minutes)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">By Project</h3>
        {Object.keys(byProject).length === 0 ? (
          <div className="text-gray-500">No project data.</div>
        ) : (
          <ul>
            {Object.entries(byProject).map(([project, minutes]) => (
              <li key={project} className="flex justify-between">
                <span>{project}</span>
                <span>{formatDuration(minutes)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Placeholder for future charts/analytics */}
    </div>
  );
} 
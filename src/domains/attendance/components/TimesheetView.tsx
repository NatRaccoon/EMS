import React, { useState } from 'react';
import { useAttendanceContext } from '../context/AttendanceContext';
import * as XLSX from 'xlsx';

function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getWeekday(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, { weekday: 'long' });
}

function sumBreaksForDay(logs, date) {
  return logs.filter(l => l.date === date && l.type === 'break').reduce((sum, l) => sum + l.duration, 0);
}

export default function TimesheetView({ employeeId, enableExport = false }: { employeeId: string, enableExport?: boolean }) {
  const { timesheets, generateTimesheet, logs } = useAttendanceContext();
  const [periodStart, setPeriodStart] = useState(formatDate(getMonday(new Date())));
  const [periodEnd, setPeriodEnd] = useState(formatDate(new Date()));
  const [noLogsMsg, setNoLogsMsg] = useState('');

  const handleGenerate = () => {
    // Check if there are logs for this period
    const periodLogs = logs.filter(
      (log) =>
        log.employeeId === employeeId &&
        log.date >= periodStart &&
        log.date <= periodEnd
    );
    if (periodLogs.length === 0) {
      setNoLogsMsg('No logs found for this period. Please add logs first.');
      return;
    }
    setNoLogsMsg('');
    console.log('Generating timesheet for logs:', periodLogs);
    generateTimesheet(employeeId, periodStart, periodEnd);
  };

  const sheets = timesheets.filter(
    (ts) => ts.employeeId === employeeId && ts.periodStart === periodStart && ts.periodEnd === periodEnd
  );
  const sheet = sheets.length > 0 ? sheets[0] : null;

  // Excel export logic
  const exportToExcel = () => {
    if (!sheet) return;
    // Get all logs for this period and employee
    const periodLogs = logs.filter(
      (log) =>
        log.employeeId === employeeId &&
        log.date >= periodStart &&
        log.date <= periodEnd
    );
    // Group logs by date for break sum
    const breakSums = {};
    periodLogs.forEach(log => {
      if (!breakSums[log.date]) breakSums[log.date] = 0;
      if (log.type === 'break') breakSums[log.date] += log.duration;
    });
    const data = periodLogs.map(log => ({
      Date: log.date,
      Weekday: getWeekday(log.date),
      Start: log.startTime ? new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      End: log.endTime ? new Date(log.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      Break: breakSums[log.date] || 0,
      Type: log.type,
      Sum: `${Math.floor(log.duration / 60)}h ${log.duration % 60}m`,
      Customer: '', // Separate field, can be filled if available
      Description: log.notes || '',
      Location: '', // Not tracked yet
      'Billable Hours': log.billable ? (log.duration / 60).toFixed(2) : '0',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Timesheet');
    XLSX.writeFile(wb, `Timesheet_${employeeId}_${periodStart}_to_${periodEnd}.xlsx`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Timesheet</h2>
      <div className="flex gap-2 mb-4">
        <label className="flex flex-col text-xs">
          Period Start
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
          />
        </label>
        <label className="flex flex-col text-xs">
          Period End
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
          />
        </label>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded self-end"
          onClick={handleGenerate}
        >
          Generate
        </button>
        {enableExport && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
            onClick={exportToExcel}
            disabled={!sheet}
            title={!sheet ? 'Generate timesheet first' : 'Export to Excel'}
          >
            <span>Export to Excel</span>
          </button>
        )}
      </div>
      {noLogsMsg && (
        <div className="text-red-500 mb-2">{noLogsMsg}</div>
      )}
      {sheet ? (
        <div>
          <div className="mb-2">Total Hours: <b>{sheet.totalHours.toFixed(2)}</b></div>
          <div className="mb-2">Overtime Hours: <b>{sheet.overtimeHours.toFixed(2)}</b></div>
          <div className="mb-2">Break Minutes: <b>{sheet.breakMinutes}</b></div>
          <div className="mb-2">Status: <b>{sheet.status}</b></div>
          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="border-b">
                <th className="py-2">Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Duration</th>
                <th>Type</th>
                <th>Project</th>
                <th>Task</th>
                <th>Notes</th>
                <th>Billable</th>
              </tr>
            </thead>
            <tbody>
              {sheet.logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="py-1">{log.date}</td>
                  <td>{log.startTime ? new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</td>
                  <td>{log.endTime ? new Date(log.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</td>
                  <td>{Math.floor(log.duration / 60)}h {log.duration % 60}m</td>
                  <td>{log.type}</td>
                  <td>{log.project || '-'}</td>
                  <td>{log.task || '-'}</td>
                  <td>{log.notes || '-'}</td>
                  <td>{log.billable ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500">No timesheet for this period. Click Generate.</div>
      )}
    </div>
  );
} 
import React from 'react';
import { useAttendanceContext } from '../context/AttendanceContext';

export default function LogList({ employeeId }: { employeeId: string }) {
  const { logs, deleteLog } = useAttendanceContext();
  const employeeLogs = logs.filter((log) => log.employeeId === employeeId);

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Time Logs</h2>
      {employeeLogs.length === 0 ? (
        <div className="text-gray-500">No logs yet.</div>
      ) : (
        <table className="w-full text-sm">
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employeeLogs.map((log) => (
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
                <td>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteLog(log.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 
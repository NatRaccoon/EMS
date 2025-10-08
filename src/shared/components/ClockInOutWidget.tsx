import React, { useState, useMemo } from 'react';
import { useAttendanceContext } from '@/domains/attendance/context/AttendanceContext';
import ManualEntryForm from '@/domains/attendance/components/ManualEntryForm';
import { Clock, Edit2 } from 'lucide-react';

function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function ClockInOutWidget({ employeeId, compact = false }: { employeeId: string, compact?: boolean }) {
  const { timer, startTimer, stopTimer, logs } = useAttendanceContext();
  const [notes, setNotes] = useState('');
  const [billable, setBillable] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Track elapsed time if running
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer.isRunning && timer.startTime) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - new Date(timer.startTime!).getTime()) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => interval && clearInterval(interval);
  }, [timer.isRunning, timer.startTime]);

  // Today's total work duration
  const today = new Date().toISOString().slice(0, 10);
  const todayLogs = useMemo(() => logs.filter(l => l.employeeId === employeeId && l.date === today && l.type === 'work'), [logs, employeeId, today]);
  const todayMinutes = todayLogs.reduce((sum, l) => sum + l.duration, 0);

  const handleStart = () => {
    startTimer('work', undefined, undefined);
  };
  const handleStop = () => {
    stopTimer(employeeId, notes, billable);
    setNotes('');
    setBillable(false);
  };

  return (
    <div className={`bg-white rounded-lg shadow ${compact ? 'p-3' : 'p-6'} w-full ${compact ? 'max-w-xs' : 'max-w-md'} mx-auto flex flex-col gap-3`}>
      <div className="flex items-center gap-2 mb-2">
        <Clock size={compact ? 18 : 24} className="text-blue-600" />
        <h3 className={`font-semibold text-gray-800 ${compact ? 'text-base' : 'text-lg'}`}>Clock In / Out</h3>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${timer.isRunning ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {timer.isRunning ? 'Clocked In' : 'Clocked Out'}
        </span>
        {timer.isRunning && timer.startTime && (
          <span className="text-xs text-gray-500">since {new Date(timer.startTime).toLocaleTimeString()}</span>
        )}
      </div>
      <div className={`font-mono text-center mb-2 ${compact ? 'text-2xl' : 'text-4xl'}`}>
        {timer.isRunning && timer.startTime ? formatElapsed(elapsed) : '00:00:00'}
      </div>
      <div className={`text-center text-gray-600 mb-2 ${compact ? 'text-xs' : ''}`}>
        Today's Work: <span className="font-bold">{(todayMinutes / 60).toFixed(2)} hrs</span>
      </div>
      {timer.isRunning ? (
        <>
          {!compact && (
            <>
              <textarea
                className="border rounded px-2 py-1 w-full mb-2"
                placeholder="Notes (optional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={billable}
                  onChange={e => setBillable(e.target.checked)}
                  className="mr-2"
                />
                Billable
              </label>
            </>
          )}
          <button
            className={`bg-red-500 text-white px-4 py-2 rounded w-full ${compact ? 'text-sm' : ''}`}
            onClick={handleStop}
          >
            Clock Out
          </button>
        </>
      ) : (
        <button
          className={`bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded w-full ${compact ? 'text-sm' : ''}`}
          onClick={handleStart}
        >
          Clock In
        </button>
      )}
      {!compact && (
        <button
          className="flex items-center gap-2 text-blue-600 hover:underline justify-center mt-2"
          onClick={() => setShowManual(true)}
          type="button"
        >
          <Edit2 size={18} /> Manual Time Entry
        </button>
      )}
      {showManual && !compact && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 relative w-full max-w-lg">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowManual(false)}
              aria-label="Close"
            >
              ×
            </button>
            <ManualEntryForm employeeId={employeeId} />
          </div>
        </div>
      )}
    </div>
  );
} 
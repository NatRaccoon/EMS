import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimeLog, Timesheet } from '@/shared/types';

interface TimerState {
  isRunning: boolean;
  startTime: string | null;
  endTime: string | null;
  currentType: TimeLog['type'];
  project?: string;
  task?: string;
}

interface AttendanceState {
  logs: TimeLog[];
  timesheets: Timesheet[];
  timer: TimerState;
  fetchLogs: () => Promise<void>;
  startTimer: (type: TimeLog['type'], project?: string, task?: string) => void;
  stopTimer: (employeeId: string, notes?: string, billable?: boolean) => void;
  addLog: (log: TimeLog) => Promise<void>;
  updateLog: (id: string, log: Partial<TimeLog>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  generateTimesheet: (employeeId: string, periodStart: string, periodEnd: string) => void;
  resetTimer: () => void;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      logs: [],
      timesheets: [],
      timer: {
        isRunning: false,
        startTime: null,
        endTime: null,
        currentType: 'work',
        project: undefined,
        task: undefined,
      },
      fetchLogs: async () => {
        const res = await fetch('http://localhost:3001/attendanceRecords');
        const data = await res.json();
        set({ logs: data });
      },
      startTimer: (type, project, task) => {
        set({
          timer: {
            isRunning: true,
            startTime: new Date().toISOString(),
            endTime: null,
            currentType: type,
            project,
            task,
          },
        });
      },
      stopTimer: (employeeId, notes, billable) => {
        const { timer } = get();
        if (!timer.isRunning || !timer.startTime) return;
        const endTime = new Date().toISOString();
        const duration = Math.floor((new Date(endTime).getTime() - new Date(timer.startTime).getTime()) / 60000);
        const log: TimeLog = {
          id: `${employeeId}-${Date.now()}`,
          employeeId,
          date: timer.startTime.slice(0, 10),
          startTime: timer.startTime,
          endTime,
          duration,
          type: timer.currentType,
          project: timer.project,
          task: timer.task,
          notes,
          billable,
          createdAt: timer.startTime,
          updatedAt: endTime,
        };
        get().addLog(log);
        set((state) => ({
          timer: { ...state.timer, isRunning: false, endTime },
        }));
      },
      addLog: async (log) => {
        const res = await fetch('http://localhost:3001/attendanceRecords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log),
        });
        const newLog = await res.json();
        set((state) => ({ logs: [...state.logs, newLog] }));
      },
      updateLog: async (id, log) => {
        const res = await fetch(`http://localhost:3001/attendanceRecords/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...log, updatedAt: new Date().toISOString() }),
        });
        const updated = await res.json();
        set((state) => ({
          logs: state.logs.map((l) => (l.id === id ? { ...l, ...updated } : l)),
        }));
      },
      deleteLog: async (id) => {
        await fetch(`http://localhost:3001/attendanceRecords/${id}`, { method: 'DELETE' });
        set((state) => ({ logs: state.logs.filter((l) => l.id !== id) }));
      },
      generateTimesheet: (employeeId, periodStart, periodEnd) => {
        const logs = get().logs.filter(
          (log) =>
            log.employeeId === employeeId &&
            log.date >= periodStart &&
            log.date <= periodEnd
        );
        const totalHours = logs.reduce((sum, log) => sum + log.duration, 0) / 60;
        const overtimeHours = logs.filter((log) => log.type === 'overtime').reduce((sum, log) => sum + log.duration, 0) / 60;
        const breakMinutes = logs.filter((log) => log.type === 'break').reduce((sum, log) => sum + log.duration, 0);
        const timesheet: Timesheet = {
          id: `${employeeId}-${periodStart}-${periodEnd}`,
          employeeId,
          periodStart,
          periodEnd,
          logs,
          totalHours,
          overtimeHours,
          breakMinutes,
          status: 'draft',
        };
        set((state) => ({ timesheets: [...state.timesheets, timesheet] }));
      },
      resetTimer: () => set((state) => ({
        timer: {
          ...state.timer,
          isRunning: false,
          startTime: null,
          endTime: null,
          currentType: 'work',
          project: undefined,
          task: undefined,
        },
      })),
    }),
    {
      name: 'attendance-store',
      partialize: (state) => ({ logs: state.logs, timesheets: state.timesheets, timer: state.timer }),
    }
  )
); 
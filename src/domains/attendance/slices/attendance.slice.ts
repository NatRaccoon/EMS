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
  startTimer: (type: TimeLog['type'], project?: string, task?: string) => void;
  stopTimer: (employeeId: string, notes?: string, billable?: boolean) => void;
  addLog: (log: TimeLog) => void;
  updateLog: (id: string, log: Partial<TimeLog>) => void;
  deleteLog: (id: string) => void;
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
        set((state) => ({
          logs: [...state.logs, log],
          timer: { ...state.timer, isRunning: false, endTime },
        }));
      },
      addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
      updateLog: (id, log) => set((state) => ({
        logs: state.logs.map((l) => (l.id === id ? { ...l, ...log, updatedAt: new Date().toISOString() } : l)),
      })),
      deleteLog: (id) => set((state) => ({ logs: state.logs.filter((l) => l.id !== id) })),
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
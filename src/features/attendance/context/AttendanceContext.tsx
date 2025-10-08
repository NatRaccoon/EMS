"use client"
import React, { createContext, useContext, ReactNode } from 'react';
import { useAttendanceStore } from '../slices/attendance.slice';
import { TimeLog, Timesheet } from '@/shared/types';

interface AttendanceContextValue {
  logs: TimeLog[];
  timesheets: Timesheet[];
  timer: ReturnType<typeof useAttendanceStore>['timer'];
  startTimer: ReturnType<typeof useAttendanceStore>['startTimer'];
  stopTimer: ReturnType<typeof useAttendanceStore>['stopTimer'];
  addLog: ReturnType<typeof useAttendanceStore>['addLog'];
  updateLog: ReturnType<typeof useAttendanceStore>['updateLog'];
  deleteLog: ReturnType<typeof useAttendanceStore>['deleteLog'];
  generateTimesheet: ReturnType<typeof useAttendanceStore>['generateTimesheet'];
  resetTimer: ReturnType<typeof useAttendanceStore>['resetTimer'];
}

const AttendanceContext = createContext<AttendanceContextValue | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const logs = useAttendanceStore((s) => s.logs);
  const timesheets = useAttendanceStore((s) => s.timesheets);
  const timer = useAttendanceStore((s) => s.timer);
  const startTimer = useAttendanceStore((s) => s.startTimer);
  const stopTimer = useAttendanceStore((s) => s.stopTimer);
  const addLog = useAttendanceStore((s) => s.addLog);
  const updateLog = useAttendanceStore((s) => s.updateLog);
  const deleteLog = useAttendanceStore((s) => s.deleteLog);
  const generateTimesheet = useAttendanceStore((s) => s.generateTimesheet);
  const resetTimer = useAttendanceStore((s) => s.resetTimer);

  return (
    <AttendanceContext.Provider value={{
      logs,
      timesheets,
      timer,
      startTimer,
      stopTimer,
      addLog,
      updateLog,
      deleteLog,
      generateTimesheet,
      resetTimer,
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export function useAttendanceContext() {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error('useAttendanceContext must be used within AttendanceProvider');
  return ctx;
} 
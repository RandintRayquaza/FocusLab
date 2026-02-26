import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage, STORAGE_KEYS } from '../utils/storage';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [sessions, setSessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, []);
  const [dailyChecks, setDailyChecks] = useLocalStorage(STORAGE_KEYS.DAILY_CHECKS, []);
  const [userProfile, setUserProfile] = useLocalStorage(STORAGE_KEYS.USER_PROFILE, {
    name: 'MindTrack User',
    joinedAt: new Date().toISOString(),
  });
  const [streak, setStreak] = useLocalStorage(STORAGE_KEYS.STREAK, { current: 0, longest: 0, lastStudyDate: null });
  
  // Phase 2 Additions
  const [subjects, setSubjects] = useLocalStorage(STORAGE_KEYS.SUBJECTS, ['Math', 'Physics', 'Chemistry']);
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS, { defaultRestTime: 5 });

  const addSession = useCallback((newSession) => {
    setSessions(prev => [newSession, ...prev]);
  }, [setSessions]);

  const addDailyCheck = useCallback((check) => {
    setDailyChecks(prev => {
      // Replace if same date, else prepend
      const filtered = prev.filter(c => c.date !== check.date);
      return [check, ...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    });
  }, [setDailyChecks]);

  const value = {
    sessions,
    addSession,
    dailyChecks,
    addDailyCheck,
    userProfile,
    setUserProfile,
    streak,
    setStreak,
    subjects,
    setSubjects,
    settings,
    setSettings
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataStore() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataStore must be used within a DataProvider');
  }
  return context;
}


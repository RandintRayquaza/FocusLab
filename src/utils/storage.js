import { useState, useEffect } from 'react';

// Centralised Keys
export const STORAGE_KEYS = {
  SESSIONS: 'mindtrack_sessions',
  DAILY_CHECKS: 'mindtrack_daily_checks',
  USER_PROFILE: 'mindtrack_user_profile',
  STREAK: 'mindtrack_streak',
  SUBJECTS: 'mindtrack_subjects',
  SETTINGS: 'mindtrack_settings',
};

// Generic LocalStorage Hook
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

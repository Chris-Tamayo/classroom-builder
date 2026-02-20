import { useState, useEffect, useCallback } from 'react';
import { ClassEntry } from '@/types/schedule';

const STORAGE_KEY = 'class-schedule-data';

export function useSchedule() {
  const [classes, setClasses] = useState<ClassEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  }, [classes]);

  const addClass = useCallback((entry: Omit<ClassEntry, 'id'>) => {
    const newEntry: ClassEntry = { ...entry, id: crypto.randomUUID() };
    setClasses(prev => [...prev, newEntry]);
    return newEntry;
  }, []);

  const updateClass = useCallback((id: string, updates: Partial<Omit<ClassEntry, 'id'>>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteClass = useCallback((id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setClasses([]);
  }, []);

  return { classes, addClass, updateClass, deleteClass, clearAll };
}

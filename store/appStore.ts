import { create } from 'zustand';
import type { Event } from '@/types';

interface AppState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setEvents: (events: Event[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  setEvents: (events) => set({ events }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

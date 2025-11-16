import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@/types';

interface UserState {
  currentUser: User | null;
  interestedEventIds: Set<number>;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  addInterestedEvent: (eventId: number) => void;
  removeInterestedEvent: (eventId: number) => void;
  isInterestedInEvent: (eventId: number) => boolean;
  clearUserData: () => void;
}

interface PersistedUserState {
  currentUser: User | null;
  interestedEventIds: number[];
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      interestedEventIds: new Set<number>(),

      setCurrentUser: (user) => set({ currentUser: user }),

      addInterestedEvent: (eventId) =>
        set((state) => ({
          interestedEventIds: new Set(state.interestedEventIds).add(eventId),
        })),

      removeInterestedEvent: (eventId) =>
        set((state) => {
          const newSet = new Set(state.interestedEventIds);
          newSet.delete(eventId);
          return { interestedEventIds: newSet };
        }),

      isInterestedInEvent: (eventId) => get().interestedEventIds.has(eventId),

      clearUserData: () =>
        set({
          currentUser: null,
          interestedEventIds: new Set<number>(),
        }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Custom serialization for Set
      partialize: (state): PersistedUserState => ({
        currentUser: state.currentUser,
        interestedEventIds: Array.from(state.interestedEventIds),
      }),
      // Custom deserialization for Set
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.interestedEventIds = new Set(
            (state as unknown as PersistedUserState).interestedEventIds
          );
        }
      },
    }
  )
);

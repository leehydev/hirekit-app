import { create } from 'zustand';
import { getMe, type User } from '@/lib/api';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: boolean;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  error: false,

  fetchUser: async () => {
    set({ isLoading: true, error: false });
    try {
      const user = await getMe();
      set({ user, isLoading: false, error: false });
    } catch {
      set({ user: null, isLoading: false, error: true });
    }
  },

  clearUser: () => set({ user: null, isLoading: false, error: false }),
}));

import { create } from 'zustand';

interface NavigationState {
  /** 하단 네비게이션 바 표시 여부 */
  isBottomNavVisible: boolean;
  showBottomNav: () => void;
  hideBottomNav: () => void;
  setBottomNavVisible: (visible: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isBottomNavVisible: false,
  showBottomNav: () => set({ isBottomNavVisible: true }),
  hideBottomNav: () => set({ isBottomNavVisible: false }),
  setBottomNavVisible: (visible) => set({ isBottomNavVisible: visible }),
}));

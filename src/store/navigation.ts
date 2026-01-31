import { create } from 'zustand';

interface NavigationState {
  /** 하단 네비게이션 바 표시 여부 */
  isBottomNavVisible: boolean;
  showBottomNav: () => void;
  hideBottomNav: () => void;
  setBottomNavVisible: (visible: boolean) => void;
  /** 피드 헤더 햄버거 메뉴(Sheet) 열림 여부 – 리마운트 시에도 유지 */
  isHeaderMenuOpen: boolean;
  setHeaderMenuOpen: (open: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isBottomNavVisible: true,
  showBottomNav: () => set({ isBottomNavVisible: true }),
  hideBottomNav: () => set({ isBottomNavVisible: false }),
  setBottomNavVisible: (visible) => set({ isBottomNavVisible: visible }),
  isHeaderMenuOpen: false,
  setHeaderMenuOpen: (open) => set({ isHeaderMenuOpen: open }),
}));

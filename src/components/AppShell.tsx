'use client';

import { useNavigationStore } from '@/store/navigation';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * 앱 레이아웃 껍데기. 하단 네비 표시 여부는 Zustand(useNavigationStore)로 제어.
 */
export function AppShell({ children }: AppShellProps) {
  const isBottomNavVisible = useNavigationStore((s) => s.isBottomNavVisible);

  return (
    <>
      <main
        className={isBottomNavVisible ? 'pb-20' : undefined}
        role="main"
      >
        {children}
      </main>
      {isBottomNavVisible && <BottomNav />}
    </>
  );
}

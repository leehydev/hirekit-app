'use client';

import { useEffect } from 'react';
import { useNavigationStore } from '@/store/navigation';
import { useUserStore } from '@/store/user';
import { useUser } from '@/hooks/useUser';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * 앱 레이아웃 껍데기. 하단 네비 표시 여부는 Zustand(useNavigationStore)로 제어.
 * 로그인한 사용자에게만 BottomNav 표시.
 * user 조회는 여기서 한 번만 수행 (무한 /api/auth/token 방지).
 */
export function AppShell({ children }: AppShellProps) {
  const isBottomNavVisible = useNavigationStore((s) => s.isBottomNavVisible);
  const { data: user } = useUser();
  const fetchUser = useUserStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const showBottomNav = isBottomNavVisible && !!user;

  return (
    <>
      <main
        className={showBottomNav ? 'pb-20' : undefined}
        role="main"
      >
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </>
  );
}

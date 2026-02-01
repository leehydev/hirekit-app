'use client';

import { useEffect } from 'react';
import { logout } from '@/lib/api';
import { useUser } from '@/hooks/useUser';

/**
 * 로그인 필수 페이지에서 사용.
 * 비로그인 또는 만료된 토큰이면 logout 후 /login으로 리다이렉트.
 * (미들웨어는 쿠키 유무만 보므로, 만료된 토큰은 이 훅에서 처리)
 */
export function useRequireAuth() {
  const { data: user, isLoading, isError } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (isError || !user) {
      logout();
    }
  }, [isLoading, isError, user]);

  return { user, isLoading, isError };
}

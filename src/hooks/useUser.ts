'use client';

import { useUserStore } from '@/store/user';

/**
 * 전역 유저 상태 훅 (Zustand 기반)
 *
 * - user 조회는 AppShell 마운트 시 한 번만 수행
 * - 로그인 여부·유저 정보는 store에서 읽기만 함 → 무한 refetch 방지
 */
export function useUser() {
  const user = useUserStore((s) => s.user);
  const isLoading = useUserStore((s) => s.isLoading);
  const error = useUserStore((s) => s.error);

  return {
    data: user,
    isLoading,
    isError: error,
  };
}

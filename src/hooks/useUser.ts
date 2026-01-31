'use client';

import { useQuery } from '@tanstack/react-query';
import { getMe, userKeys, type User } from '@/lib/api';

/**
 * 전역 유저 상태 훅
 *
 * - 로그인 여부, 고객 정보를 앱 어디서든 동일한 캐시로 사용
 * - queryKey가 같아서 여러 컴포넌트에서 호출해도 한 번만 요청하고 공유
 */
export function useUser() {
  return useQuery<User>({
    queryKey: userKeys.me(),
    queryFn: getMe,
    retry: false,
  });
}

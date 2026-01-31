import { fetchApi } from './client';

export interface User {
  id: string;
  nickname: string;
  email: string;
}

/** React Query 키 – 전역 유저 상태 공유용 */
export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

/**
 * 현재 로그인 사용자 정보 조회
 */
export function getMe() {
  return fetchApi<User>('/api/users/me');
}

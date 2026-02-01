import { fetchApi } from './client';

export interface User {
  id: string;
  nickname: string;
  email: string;
  profileImage?: string | null;
  status?: string;
  /** 사용자가 볼 수 있는 답변 공개 범위. MEMBERS_ONLY가 있으면 회원전용 답변 조회 가능 */
  allowedVisibilities?: string[];
}

/** React Query 키 – 전역 유저 상태 공유용 */
export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const,
};

/**
 * 현재 로그인 사용자 정보 조회
 * 공개 페이지에서 수시로 호출되므로 401 시 토스트 없이 에러만 반환(silentAuth)
 */
export function getMe() {
  return fetchApi<User>('/api/users/me', { silentAuth: true });
}

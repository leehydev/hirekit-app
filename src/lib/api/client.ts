import { logout } from './auth';
import { API_URL } from './constants';

/**
 * API 호출 함수
 *
 * - credentials: 'include'로 쿠키 자동 전송
 * - 401 에러 시 토큰 갱신 시도
 *
 * @param endpoint API 경로 (예: '/api/users/me')
 * @param options fetch 옵션
 * @returns 응답 데이터
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  let response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {
    const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      response = await fetch(`${API_URL}${endpoint}`, config);
    } else {
      await logout();
      throw new Error('인증이 만료되었습니다.');
    }
  }

  if (!response.ok) {
    throw new Error(`API 에러: ${response.status}`);
  }

  return response.json();
}

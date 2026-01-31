import { API_URL } from './constants';

/**
 * API 호출 함수
 *
 * - credentials: 'include'로 쿠키 자동 전송
 * - 401 시: 토큰 있으면 refresh 시도, 없으면/실패 시 에러만 throw
 * - 리다이렉트/로그아웃은 하지 않음 → 로그인 필수 페이지(레이아웃/미들웨어 등)에서 처리
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
    const tokenRes = await fetch('/api/auth/token', {
      method: 'GET',
      credentials: 'include',
    });

    if (!tokenRes.ok) {
      throw new Error('인증이 만료되었습니다.');
    }

    const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      response = await fetch(`${API_URL}${endpoint}`, config);
    } else {
      throw new Error('인증이 만료되었습니다.');
    }
  }

  if (!response.ok) {
    throw new Error(`API 에러: ${response.status}`);
  }

  return response.json();
}

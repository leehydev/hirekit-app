import { API_URL } from './constants';

/**
 * 로그아웃
 * 쿠키 삭제 후 로그인 페이지로 이동
 */
export async function logout(): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  window.location.href = '/login';
}

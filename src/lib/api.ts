/**
 * API 기본 URL
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // 기본 옵션 설정
  const config: RequestInit = {
    ...options,
    // 쿠키를 요청에 포함 (중요!)
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // API 호출
  let response = await fetch(`${API_URL}${endpoint}`, config);

  // 401 에러 (인증 실패) 시 토큰 갱신 시도
  if (response.status === 401) {
    // 토큰 갱신 요청
    const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
    });

    // 갱신 성공 시 원래 요청 재시도
    if (refreshResponse.ok) {
      response = await fetch(`${API_URL}${endpoint}`, config);
    } else {
      // 갱신 실패 시 로그인 페이지로 이동
      window.location.href = '/login';
      throw new Error('인증이 만료되었습니다.');
    }
  }

  // 응답 에러 처리
  if (!response.ok) {
    throw new Error(`API 에러: ${response.status}`);
  }

  // JSON 응답 반환
  return response.json();
}

/**
 * 로그아웃 함수
 * 쿠키 삭제 후 로그인 페이지로 이동
 */
export async function logout(): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  // 로그인 페이지로 이동
  window.location.href = '/login';
}

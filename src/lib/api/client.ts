import { toast } from 'sonner';
import { API_URL } from './constants';
import { ApiError, getApiErrorMessage, type ApiErrorResponse } from './errors';

function showErrorToast(message: string) {
  if (typeof window !== 'undefined') {
    toast.error(message);
  }
}

export type FetchApiOptions = RequestInit & {
  /** true면 401 시 토스트 없이 에러만 throw (로그인 여부 확인용 호출에 사용) */
  silentAuth?: boolean;
};

/**
 * API 호출 함수
 *
 * - credentials: 'include'로 쿠키 자동 전송
 * - 401 시: 토큰 있으면 refresh 시도, 없으면/실패 시 에러만 throw
 * - 에러 시: 에러 코드별 대고객 메시지로 토스트 표시 후 ApiError throw (silentAuth: true면 401 시 토스트 생략)
 * - 리다이렉트/로그아웃은 하지 않음 → 로그인 필수 페이지(레이아웃/미들웨어 등)에서 처리
 */
export async function fetchApi<T>(endpoint: string, options: FetchApiOptions = {}): Promise<T> {
  const { silentAuth, ...init } = options;
  const config: RequestInit = {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  };

  let response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {
    const tokenRes = await fetch('/api/auth/token', {
      method: 'GET',
      credentials: 'include',
    });

    if (!tokenRes.ok) {
      const msg = '로그인이 필요해요.';
      if (!silentAuth) showErrorToast(msg);
      throw new ApiError(msg, 'UNAUTHORIZED');
    }

    const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      response = await fetch(`${API_URL}${endpoint}`, config);
    } else {
      const msg = '로그인이 필요해요.';
      if (!silentAuth) showErrorToast(msg);
      throw new ApiError(msg, 'UNAUTHORIZED');
    }
  }

  if (!response.ok) {
    let body: Partial<ApiErrorResponse> | null = null;
    try {
      const json = await response.json();
      if (json && typeof json === 'object' && 'success' in json) {
        body = json as Partial<ApiErrorResponse>;
      }
    } catch {
      // ignore JSON parse error
    }
    const message = getApiErrorMessage(body);
    showErrorToast(message);
    throw new ApiError(message, body?.code);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text || !text.trim()) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

/**
 * 인증 프록시
 *
 * - 공개 경로(PUBLIC_PATHS 등)는 인증 없이 통과.
 * - 비공개 경로: 리프레시 토큰 없으면 → 로그인 페이지, 액세스 없/만료면 → refresh 후 /me 검사.
 * - 경로·상수 정의: @/lib/middleware-auth
 */
import {
  AUTH_API_URL as API_URL,
  ACCESS_TOKEN_COOKIE_NAME,
  ERROR_PAGES,
  REFRESH_TOKEN_COOKIE_NAME,
  isPublicPath,
  redirectToError,
  redirectToLogin,
} from '@/lib/middleware-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // 1. 공개 경로면 인증 검사 없이 통과
  if (isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // 2. API URL 미설정 시 /me·refresh 호출 불가 → 500 페이지
  if (!API_URL) {
    return redirectToError(request, ERROR_PAGES.serverError, 503);
  }

  const cookieHeader = request.headers.get('cookie') ?? '';
  const hasAccessToken = !!request.cookies.get(ACCESS_TOKEN_COOKIE_NAME!)?.value?.trim();
  const hasRefreshToken = !!request.cookies.get(REFRESH_TOKEN_COOKIE_NAME!)?.value?.trim();

  // 3. 리프레시 토큰 없음 = 세션 없음 → 로그인으로
  if (!hasRefreshToken) {
    return redirectToLogin(request);
  }

  // 4. 액세스 토큰 있으면 /me로 세션 유효성 검사
  if (hasAccessToken) {
    const meRes = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });

    if (meRes.ok) return NextResponse.next();
    if (meRes.status === 404) return redirectToError(request, ERROR_PAGES.notFound, 404);
    if (meRes.status !== 401)
      return redirectToError(request, ERROR_PAGES.serverError, meRes.status);
    // 401이면 아래에서 refresh 시도
  }

  // 5. 액세스 없거나 /me 401 → refresh 한 번 시도 후 같은 URL로 재요청
  const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });

  if (refreshRes.ok) {
    const response = NextResponse.redirect(request.url);
    const setCookies = refreshRes.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookies) response.headers.append('Set-Cookie', cookie);
    return response;
  }

  // 6. refresh 실패(만료 등) → 로그인으로
  return redirectToLogin(request);
}

export const config = {
  /** _next, api, favicon, public 정적 파일(이미지·폰트·기타) 제외한 경로에서만 실행 */
  matcher: [
    '/((?!_next|api|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|txt|json)$).*)',
  ],
};

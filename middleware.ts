/**
 * 인증 미들웨어
 *
 * - 공개 경로(PUBLIC_PATHS) 외에는 모두 로그인 필수.
 * - 로그인 필수 경로 접근 시: 리프레시 토큰 없으면 로그인으로, 액세스만 없으면 refresh 먼저 시도.
 * - /me·refresh 결과에 따라 로그인/404/500 페이지로 리다이렉트.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** 백엔드 API 베이스 URL (env 미설정 시 500 페이지로 리다이렉트) */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** 액세스 토큰 쿠키 이름. env: ACCESS_TOKEN_COOKIE_NAME */
const ACCESS_TOKEN_COOKIE_NAME = process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'accessToken';
/** 리프레시 토큰 쿠키 이름. env: REFRESH_TOKEN_COOKIE_NAME */
const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'refreshToken';

/**
 * 전체 공개 경로
 * 여기만 비로그인 허용. 나머지 경로는 모두 로그인 필수.
 * /404, /500 포함 시 에러 페이지 접근 시 인증 체크 안 함 → 리다이렉트 루프 방지.
 */
const PUBLIC_PATHS = ['/', '/login', '/oauth', '/404', '/500', '/feed'];

/** 에러 시 보낼 페이지 경로 (로그인, 404, 서버오류) */
const ERROR_PAGES = {
  login: '/login',
  notFound: '/404',
  serverError: '/500',
} as const;

/**
 * 현재 경로가 공개 경로인지 여부
 * 정확 일치 또는 해당 경로 하위 모두 공개로 처리.
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * 로그인 페이지로 리다이렉트
 * from 쿼리에 현재 경로를 넣어 로그인 후 복귀용으로 사용 가능.
 */
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(ERROR_PAGES.login, request.url);
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

/**
 * 404/500 등 에러 전용 페이지로 리다이렉트
 * status 쿼리로 HTTP 상태 코드 전달 (선택).
 */
function redirectToError(
  request: NextRequest,
  path: (typeof ERROR_PAGES)[keyof typeof ERROR_PAGES],
  status?: number,
) {
  const url = new URL(path, request.url);
  if (status != null) url.searchParams.set('status', String(status));
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  // 1. 공개 경로면 인증 체크 없이 통과
  if (isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // API URL 미설정이면 /me·refresh 호출 불가 → 설정 오류이므로 500 페이지로
  if (!API_URL) {
    return redirectToError(request, ERROR_PAGES.serverError, 503);
  }

  const cookieHeader = request.headers.get('cookie') ?? '';
  const hasAccessToken = !!request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value?.trim();
  const hasRefreshToken = !!request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value?.trim();

  // 2. 리프레시 토큰 없으면 로그인으로 (세션 없음)
  if (!hasRefreshToken) {
    return redirectToLogin(request);
  }

  // 3. 액세스 토큰 있으면 /me로 세션 유효성 검사
  if (hasAccessToken) {
    const meRes = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });

    if (meRes.ok) {
      return NextResponse.next();
    }

    if (meRes.status === 404) {
      return redirectToError(request, ERROR_PAGES.notFound, 404);
    }

    if (meRes.status !== 401) {
      return redirectToError(request, ERROR_PAGES.serverError, meRes.status);
    }
    // 401이면 아래에서 refresh 시도
  }

  // 4. 액세스 없거나 /me 401 → refresh 한 번 시도
  const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });

  if (refreshRes.ok) {
    // 새 토큰 쿠키를 붙여 같은 URL로 리다이렉트 → 브라우저가 새 쿠키로 재요청
    const response = NextResponse.redirect(request.url);
    const setCookies = refreshRes.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookies) {
      response.headers.append('Set-Cookie', cookie);
    }
    return response;
  }

  // refresh 실패(만료 등) → 로그인으로
  return redirectToLogin(request);
}

export const config = {
  /** _next, api, favicon, 이미지 등 제외한 모든 경로에서 실행 */
  matcher: ['/((?!_next|api|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};

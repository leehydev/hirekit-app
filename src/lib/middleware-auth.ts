/**
 * 프록시(인증)용 설정·헬퍼
 * proxy.ts에서 import하여 사용.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** 백엔드 API 베이스 URL */
export const AUTH_API_URL = process.env.NEXT_PUBLIC_API_URL;

/** 액세스 토큰 쿠키 이름 */
export const ACCESS_TOKEN_COOKIE_NAME = process.env.ACCESS_TOKEN_COOKIE_NAME;
/** 리프레시 토큰 쿠키 이름 */
export const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME;

/**
 * 전체 공개 경로 (비로그인 허용).
 * /questions는 별도 처리: /questions/new, /questions/[uuid]/answers/new는 로그인 필수.
 */
export const PUBLIC_PATHS = ['/', '/login', '/oauth', '/404', '/500', '/feed', '/search'];

/** 에러 시 리다이렉트 대상 페이지 */
export const ERROR_PAGES = {
  login: '/login',
  notFound: '/404',
  serverError: '/500',
} as const;

/**
 * 현재 경로가 공개 경로인지 여부
 * - PUBLIC_PATHS 하위: 공개
 * - /questions/new, /questions/[uuid]/answers/new: 비공개
 * - /questions/[uuid] 상세: 공개
 */
export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return true;
  }
  if (pathname.startsWith('/questions/new') || pathname === '/questions/new') {
    return false;
  }
  if (pathname.includes('/answers/new')) {
    return false;
  }
  if (pathname.startsWith('/questions/')) {
    return true;
  }
  return false;
}

/** 로그인 페이지로 리다이렉트 (from 쿼리에 현재 경로 포함) */
export function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(ERROR_PAGES.login, request.url);
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

/** 404/500 등 에러 페이지로 리다이렉트 */
export function redirectToError(
  request: NextRequest,
  path: (typeof ERROR_PAGES)[keyof typeof ERROR_PAGES],
  status?: number,
) {
  const url = new URL(path, request.url);
  if (status != null) url.searchParams.set('status', String(status));
  return NextResponse.redirect(url);
}

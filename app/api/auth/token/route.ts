import { parse } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 토큰 존재 여부만 검사 (유효성 X).
 * 리프레시 토큰 쿠키가 있으면 200, 없으면 401.
 * 쿠키 이름: REFRESH_TOKEN_COOKIE_NAME env 또는 기본값 refreshToken
 */
const REFRESH_TOKEN_COOKIE_NAME =
  process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'refreshToken';

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const cookies = parse(cookieHeader);
  const token = cookies[REFRESH_TOKEN_COOKIE_NAME];
  const hasToken = !!token?.trim();

  if (!hasToken) {
    return NextResponse.json({ hasToken: false }, { status: 401 });
  }

  return NextResponse.json({ hasToken: true }, { status: 200 });
}

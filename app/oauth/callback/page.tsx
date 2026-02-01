'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/store/user';
import { useNavigationStore } from '@/store/navigation';

/** return_to가 앱 내부 경로인지 검증 (오픈 리다이렉트 방지). 루트(/)는 리턴 없음으로 처리 */
function getValidReturnTo(value: string | null): string | null {
  if (!value || typeof value !== 'string') return null;
  if (!value.startsWith('/') || value.startsWith('//') || value === '/') return null;
  return value;
}

/**
 * useSearchParams()를 사용하는 내부 컴포넌트 (Suspense 경계 필요)
 */
function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hideBottomNav = useNavigationStore((s) => s.hideBottomNav);
  const showBottomNav = useNavigationStore((s) => s.showBottomNav);
  const fetchUser = useUserStore((s) => s.fetchUser);

  const isProcessed = useRef(false);

  useEffect(() => {
    hideBottomNav();
    return () => showBottomNav();
  }, [hideBottomNav, showBottomNav]);

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const error = searchParams.get('error');
    /** 백엔드가 콜백 리다이렉트 URL에 붙여준 복귀 경로 (성공/실패 모두) */
    const returnTo = getValidReturnTo(searchParams.get('return_to'));

    if (error) {
      console.error('OAuth 로그인 실패:', error);
      alert('로그인에 실패했습니다: ' + error);
      const loginUrl = returnTo ? `/login?from=${encodeURIComponent(returnTo)}` : '/login';
      router.replace(loginUrl);
    } else {
      fetchUser().then(() => router.replace(returnTo ?? '/feed'));
    }
  }, [fetchUser, searchParams, router]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <p>로그인 처리 중...</p>
    </div>
  );
}

/**
 * OAuth 콜백 페이지
 *
 * 카카오 로그인 성공 후 백엔드가 이 페이지로 리다이렉트함
 * 토큰은 이미 쿠키에 저장되어 있음 (백엔드가 Set-Cookie로 설정)
 *
 * URL 예시:
 * /oauth/callback?return_to=/feed (성공 - 백엔드가 쿠키 oauth2_return_to를 읽어 쿼리로 붙임)
 * /oauth/callback?error=xxx&return_to=/feed (실패)
 */
export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <p>로그인 처리 중...</p>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}

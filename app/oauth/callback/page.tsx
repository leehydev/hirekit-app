'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { userKeys } from '@/lib/api';
import { useNavigationStore } from '@/store/navigation';

/**
 * useSearchParams()를 사용하는 내부 컴포넌트 (Suspense 경계 필요)
 */
function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const hideBottomNav = useNavigationStore((s) => s.hideBottomNav);
  const showBottomNav = useNavigationStore((s) => s.showBottomNav);

  const isProcessed = useRef(false);

  useEffect(() => {
    hideBottomNav();
    return () => showBottomNav();
  }, [hideBottomNav, showBottomNav]);

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth 로그인 실패:', error);
      alert('로그인에 실패했습니다: ' + error);
      router.replace('/login');
    } else {
      // 로그인 성공 → 유저 쿼리 무효화 후 메인으로 이동 (메인에서 useUser가 최신 데이터 요청)
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      router.replace('/');
    }
  }, [queryClient, searchParams, router]);

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
 * /oauth/callback (성공 - 토큰은 쿠키에)
 * /oauth/callback?error=xxx (실패)
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

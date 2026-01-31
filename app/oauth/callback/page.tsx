'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const router = useRouter();
  const searchParams = useSearchParams();

  // 중복 실행 방지
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    // URL에서 에러 파라미터 확인
    const error = searchParams.get('error');

    if (error) {
      // 로그인 실패
      console.error('OAuth 로그인 실패:', error);
      alert('로그인에 실패했습니다: ' + error);
      router.replace('/login');
    } else {
      // 로그인 성공 (토큰은 쿠키에 자동 저장됨)
      console.log('로그인 성공!');
      router.replace('/');
    }
  }, []);

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

'use client';

import { useEffect } from 'react';
import { API_URL } from '@/lib/api';
import { useNavigationStore } from '@/store/navigation';

/**
 * 로그인 페이지
 * 카카오 로그인 버튼 제공
 */
export default function LoginPage() {
  const hideBottomNav = useNavigationStore((s) => s.hideBottomNav);
  const showBottomNav = useNavigationStore((s) => s.showBottomNav);

  useEffect(() => {
    hideBottomNav();
    return () => showBottomNav();
  }, [hideBottomNav, showBottomNav]);

  /**
   * 카카오 로그인 버튼 클릭 시 실행
   * 백엔드의 OAuth2 인증 URL로 이동
   */
  const handleKakaoLogin = () => {
    // 백엔드가 카카오 로그인 페이지로 리다이렉트 해줌
    window.location.href = `${API_URL}/oauth2/authorization/kakao`;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '20px',
      }}
    >
      <h1>HireKit 로그인</h1>

      <button
        onClick={handleKakaoLogin}
        style={{
          backgroundColor: '#FEE500',
          color: '#000000',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        카카오로 로그인
      </button>
    </div>
  );
}

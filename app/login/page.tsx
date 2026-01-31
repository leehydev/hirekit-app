'use client';

import { useEffect } from 'react';
import { RiMessage3Fill } from '@remixicon/react';
import { API_URL } from '@/lib/api';
import { useNavigationStore } from '@/store/navigation';
import { LoginButton, AppLogo } from '@/components/Login';
import Image from 'next/image';

/**
 * 로그인 페이지
 * 카카오, 네이버, 구글 로그인 버튼 제공
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
    window.location.href = `${API_URL}/oauth2/authorization/kakao`;
  };

  return (
    <div className="min-h-screen bg-login-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* App Logo */}
        <AppLogo />

        {/* Subtitle */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-3">합격자는 이미 알고 있던 질문</h2>
          <p className="text-base text-gray-400">면접장에서 당황하지 마세요</p>
        </div>

        {/* Login Buttons */}
        <div className="space-y-3 mb-8">
          <LoginButton
            provider="kakao"
            icon={<Image src="/icons/icon-kakao.png" alt="Kakao" width={24} height={24} />}
            onClick={handleKakaoLogin}
          >
            Kakao로 로그인
          </LoginButton>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            계속 진행함으로써 HireKit의
            <br />
            <a href="#" className="underline hover:text-gray-400">
              이용약관 및 개인정보 보처리방침
            </a>
            에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

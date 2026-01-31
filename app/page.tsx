'use client';

import { useQueryClient } from '@tanstack/react-query';
import { logout, userKeys } from '@/lib/api';
import { useUser } from '@/hooks/useUser';

/**
 * 메인 페이지
 */
export default function HomePage() {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useUser();

  const handleLogout = () => {
    queryClient.removeQueries({ queryKey: userKeys.me() });
    logout();
  };

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (isError || !user) {
    return (
      <div>
        <p>로그인이 필요합니다.</p>
        <a href="/login">로그인하기</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>안녕하세요, {user.nickname}님!</h1>
      <p>이메일: {user.email}</p>
      <button onClick={handleLogout}>로그아웃</button>
      <p className="mt-4">
        <a href="/company-search" className="text-primary underline">
          사업자 검색 예시
        </a>
      </p>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { fetchApi, logout } from '@/lib/api';

/**
 * 사용자 정보 타입
 */
interface User {
  id: string;
  nickname: string;
  email: string;
}

/**
 * 메인 페이지
 */
export default function HomePage() {
  // 사용자 정보 상태
  const [user, setUser] = useState<User | null>(null);

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 페이지 로드 시 사용자 정보 가져오기
  useEffect(() => {
    fetchApi<User>('/api/users/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // 로딩 중
  if (loading) {
    return <p>로딩 중...</p>;
  }

  // 로그인 안 됨
  if (!user) {
    return (
      <div>
        <p>로그인이 필요합니다.</p>
        <a href="/login">로그인하기</a>
      </div>
    );
  }

  // 로그인 됨
  return (
    <div style={{ padding: '20px' }}>
      <h1>안녕하세요, {user.nickname}님!</h1>
      <p>이메일: {user.email}</p>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}

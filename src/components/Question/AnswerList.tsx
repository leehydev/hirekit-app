'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AnswerCard } from './AnswerCard';
import type { Answer } from '@/lib/api/questions';

interface AnswerListProps {
  answers: Answer[];
  isLoggedIn: boolean;
  onLoadMore: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLike?: (answerId: string) => void;
  /** 비로그인 시 볼 수 없는 회원전용 답변 개수 (빈 목록일 때 문구 분기용) */
  membersOnlyCount?: number;
}

export function AnswerList({
  answers,
  isLoggedIn,
  onLoadMore,
  hasMore,
  isLoadingMore,
  onLike,
  membersOnlyCount = 0,
}: AnswerListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { rootMargin: '100px', threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  if (answers.length === 0) {
    // 공개 답변 0개 + 회원전용만 있을 때 (비로그인)
    if (!isLoggedIn && membersOnlyCount > 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">
            회원전용 답변이 {membersOnlyCount}개 있어요.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            <Link
              href="/login"
              className="font-medium text-primary underline underline-offset-2 hover:no-underline"
            >
              로그인
            </Link>
            하면 확인할 수 있어요.
          </p>
        </div>
      );
    }
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">아직 답변이 없어요.</p>
        <p className="text-muted-foreground text-xs mt-2">첫 답변을 남겨보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {answers.map((answer) => (
        <AnswerCard key={answer.id} answer={answer} isLoggedIn={isLoggedIn} onLike={onLike} />
      ))}

      <div ref={loadMoreRef} className="h-4" aria-hidden />

      {isLoadingMore && (
        <p className="text-muted-foreground text-sm py-4 text-center">답변을 불러오는 중…</p>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { AnswerCard } from './AnswerCard';
import type { Answer } from '@/lib/api/questions';

interface AnswerListProps {
  answers: Answer[];
  isLoggedIn: boolean;
  onLoadMore: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLike?: (answerId: string) => void;
}

export function AnswerList({
  answers,
  isLoggedIn,
  onLoadMore,
  hasMore,
  isLoadingMore,
  onLike,
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

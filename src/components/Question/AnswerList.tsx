'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  /** 현재 로그인한 사용자 ID – 본인 답변에 수정/삭제/공개설정 메뉴 표시 */
  currentUserId?: string;
  /** 질문 ID – 답변 수정/삭제/공개설정 시 필요 */
  questionId?: string;
  onAnswerEdit?: (answer: Answer) => void;
  onAnswerDelete?: (answer: Answer) => void;
  onAnswerVisibility?: (answer: Answer) => void;
}

export function AnswerList({
  answers,
  isLoggedIn,
  onLoadMore,
  hasMore,
  isLoadingMore,
  onLike,
  membersOnlyCount = 0,
  currentUserId,
  questionId,
  onAnswerEdit,
  onAnswerDelete,
  onAnswerVisibility,
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
    if (membersOnlyCount > 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">
            회원전용 답변이 {membersOnlyCount}개 있어요.
          </p>
          {!isLoggedIn ? (
            <p className="text-muted-foreground text-xs mt-2">
              <Link
                href="/login"
                className="font-medium text-primary underline underline-offset-2 hover:no-underline"
              >
                로그인
              </Link>
              하면 확인할 수 있어요.
            </p>
          ) : (
            <p className="text-muted-foreground text-xs mt-2">
              답변 하나를 공유하면 모든 답변을 확인할 수 있어요.
            </p>
          )}
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
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {answers.map((answer) => (
        <motion.div
          key={answer.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                ease: 'easeOut',
              },
            },
          }}
        >
          <AnswerCard
            answer={answer}
            isLoggedIn={isLoggedIn}
            onLike={onLike}
            isAnswerAuthor={
              !!currentUserId && !!answer.authorId && answer.authorId === currentUserId
            }
            onEdit={onAnswerEdit}
            onDelete={onAnswerDelete}
            onVisibility={onAnswerVisibility}
          />
        </motion.div>
      ))}

      <div ref={loadMoreRef} className="h-4" aria-hidden />

      {isLoadingMore && (
        <p className="text-muted-foreground text-sm py-4 text-center">답변을 불러오는 중…</p>
      )}
    </motion.div>
  );
}

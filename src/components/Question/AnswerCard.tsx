'use client';

import { Heart, Lightbulb, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTimeAgo } from '@/lib/formatters';
import { useCodes } from '@/hooks/useCodes';
import type { Answer } from '@/lib/api/questions';
import Link from 'next/link';

interface AnswerCardProps {
  answer: Answer;
  isLoggedIn: boolean;
  onLike?: (answerId: string) => void;
}

export function AnswerCard({ answer, isLoggedIn, onLike }: AnswerCardProps) {
  const { getLabel } = useCodes();
  const passStatusLabel = answer.passStatus ? getLabel('PassStatus', answer.passStatus) : null;
  const authorLabel = answer.authorHidden ? '익명' : (answer.authorName ?? '익명');
  const isMembersOnly = answer.visibility === 'MEMBERS_ONLY';

  // 회원 전용 답변 블러 처리
  if (!isLoggedIn && isMembersOnly) {
    return (
      <div className="rounded-xl bg-card p-5 border border-border/50 relative overflow-hidden min-h-[200px]">
        <div className="blur-sm select-none space-y-3">
          <p className="text-foreground leading-relaxed">{answer.content.slice(0, 100)}...</p>
          {answer.tip && (
            <div className="space-y-2 p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">{answer.tip.slice(0, 50)}...</p>
            </div>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="text-center space-y-3 p-4">
            <p className="text-sm font-medium text-foreground">회원 전용 답변입니다</p>
            <Button size="sm" asChild>
              <Link href="/login">로그인하기</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="rounded-xl bg-card p-5 space-y-4 border border-border/50">
      {/* 상태 및 날짜 */}
      <div className="flex items-center gap-2 flex-wrap">
        {answer.passStatus === 'PASS' && passStatusLabel && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-status-success-bg text-status-success-text">
            ✓ {passStatusLabel}
          </span>
        )}
        {answer.passStatus === 'FAIL' && passStatusLabel && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
            ✗ {passStatusLabel}
          </span>
        )}
        {answer.interviewDate && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            {new Date(answer.interviewDate).toLocaleDateString('ko-KR')}
          </span>
        )}
      </div>

      {/* 답변 내용 */}
      <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
        {answer.content}
      </p>

      {/* 팁 */}
      {answer.tip && (
        <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border/30">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="size-4" style={{ color: 'var(--tip-yellow)' }} />
            <span className="text-sm font-medium text-foreground">팁</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{answer.tip}</p>
        </div>
      )}

      {/* 작성자 및 좋아요 */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="text-xs text-muted-foreground space-x-2">
          <span>{authorLabel}</span>
          <span>·</span>
          <time>{formatTimeAgo(answer.createdAt)}</time>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => onLike?.(answer.id)}
          disabled={!isLoggedIn}
        >
          <Heart
            className={`size-4 transition-colors ${
              answer.isLikedByMe ? 'fill-red-500 text-red-500' : ''
            }`}
          />
          <span className="text-sm">{answer.likeCount}</span>
        </Button>
      </div>
    </article>
  );
}

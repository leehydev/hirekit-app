'use client';

import { useState } from 'react';
import { Heart, Lightbulb, Calendar, MoreVertical, Eye, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { formatTimeAgo } from '@/lib/formatters';
import { useCodes } from '@/hooks/useCodes';
import type { Answer } from '@/lib/api/questions';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AnswerCardProps {
  answer: Answer;
  isLoggedIn: boolean;
  onLike?: (answerId: string) => void;
  /** 본인 답변일 때 수정/삭제/공개설정 메뉴 표시 */
  isAnswerAuthor?: boolean;
  onEdit?: (answer: Answer) => void;
  onDelete?: (answer: Answer) => void;
  onVisibility?: (answer: Answer) => void;
}

export function AnswerCard({
  answer,
  isLoggedIn,
  onLike,
  isAnswerAuthor,
  onEdit,
  onDelete,
  onVisibility,
}: AnswerCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { getLabel } = useCodes();
  const passStatusLabel = answer.passStatus ? getLabel('PassStatus', answer.passStatus) : null;
  const visibilityLabel = getLabel('AnswerVisibility', answer.visibility);
  const authorLabel = answer.authorHidden ? '익명' : (answer.authorName ?? '익명');
  const isMembersOnly = answer.visibility === 'MEMBERS_ONLY';

  const handleMenuAction = (fn: ((a: Answer) => void) | undefined) => {
    if (!fn) return;
    fn(answer);
    setSheetOpen(false);
  };

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
      {/* 상태·날짜·작성자 메뉴 */}
      <div className="flex items-center gap-2 flex-wrap justify-between">
        <div className="flex items-center gap-2 flex-wrap">
        {isAnswerAuthor && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
            <User className="size-3.5" />
            내가 쓴 글
          </span>
        )}
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
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="size-3.5" />
          {visibilityLabel}
        </span>
        </div>
        {isAnswerAuthor && (onEdit || onDelete || onVisibility) && (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                aria-label="답변 메뉴"
              >
                <MoreVertical className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className={cn(
                'left-1/2 right-auto w-full max-w-[430px] -translate-x-1/2 rounded-t-2xl border-t px-5 pb-8 pt-4',
                'pb-[max(2rem,env(safe-area-inset-bottom))]',
              )}
            >
              <SheetHeader>
                <SheetTitle>답변 관리</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 py-2">
                {onEdit && (
                  <Button
                    variant="ghost"
                    className="justify-start h-12"
                    onClick={() => handleMenuAction(onEdit)}
                  >
                    수정
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    className="justify-start h-12 text-destructive hover:text-destructive"
                    onClick={() => handleMenuAction(onDelete)}
                  >
                    삭제
                  </Button>
                )}
                {onVisibility && (
                  <Button
                    variant="ghost"
                    className="justify-start h-12"
                    onClick={() => handleMenuAction(onVisibility)}
                  >
                    공개 설정 변경
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
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

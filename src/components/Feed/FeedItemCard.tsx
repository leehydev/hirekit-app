'use client';

import { Lightbulb, Pencil } from 'lucide-react';
import Link from 'next/link';
import type { FeedItemResponse } from '@/lib/api/feed';
import { formatTimeAgo, formatAnswerCount } from '@/lib/formatters';
import { truncateText } from '@/lib/formatters';
import { useCodes } from '@/hooks/useCodes';
import { QuestionTag } from './QuestionTag';
import { Button } from '@/components/ui/button';

interface FeedItemCardProps {
  item: FeedItemResponse;
  isLoggedIn?: boolean;
}

export function FeedItemCard({ item, isLoggedIn }: FeedItemCardProps) {
  const { getLabel } = useCodes();
  const { question, representativeAnswer, answerCounts } = item;
  const jobLabel = getLabel('Job', question.job);
  const authorLabel = question.authorHidden ? '익명' : '익명'; // API에서 작성자명 미제공 시 익명
  const status =
    representativeAnswer?.passStatus === 'PASS'
      ? 'passed'
      : representativeAnswer?.passStatus === 'FAIL'
        ? 'failed'
        : null;
  const passStatusLabel =
    status === 'passed'
      ? getLabel('PassStatus', 'PASS')
      : status === 'failed'
        ? getLabel('PassStatus', 'FAIL')
        : null;
  const tipPreview = representativeAnswer?.tip ?? null;
  const quotePreview = representativeAnswer?.content
    ? truncateText(representativeAnswer.content, 120)
    : undefined;
  const hasMembersOnly = !isLoggedIn && answerCounts.membersOnlyAnswerCount > 0;

  return (
    <article className="rounded-xl bg-card p-4 space-y-3 border border-border/50">
      {/* 태그 및 작성 시간 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <QuestionTag label={question.companyName} variant="company" />
          <QuestionTag label={jobLabel} variant="category" />
          <span className="text-muted-foreground text-xs">{authorLabel}</span>
        </div>
        <time className="text-muted-foreground text-xs whitespace-nowrap">
          {formatTimeAgo(question.createdAt)}
        </time>
      </div>

      {/* 질문 내용 */}
      <h3 className="text-foreground font-medium text-base leading-snug">{question.content}</h3>

      {/* 합격 여부 및 팁 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {status === 'passed' && passStatusLabel && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-status-success-bg text-status-success-text">
              {passStatusLabel}
            </span>
          )}
          {status === 'failed' && passStatusLabel && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
              {passStatusLabel}
            </span>
          )}
          {(tipPreview || quotePreview) && (
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Lightbulb className="size-4" style={{ color: 'var(--tip-yellow)' }} />
              <span>팁</span>
            </div>
          )}
        </div>

        {tipPreview && <p className="text-muted-foreground text-sm">{tipPreview}</p>}

        {quotePreview && (
          <p className="text-muted-foreground/80 text-sm italic pl-3 border-l-2 border-border line-clamp-2-ellipsis">
            {quotePreview}
          </p>
        )}
      </div>

      {/* 답변 수 및 액션 */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <Link
            href={`/questions/${question.id}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {formatAnswerCount(answerCounts.totalAnswerCount)}
          </Link>
          <Button size="sm" variant="outline" className="gap-1.5" asChild>
            <Link href={`/questions/${question.id}/answers/new`}>
              <Pencil className="size-3.5" />
              답변하기
            </Link>
          </Button>
        </div>
        {hasMembersOnly && (
          <p className="text-xs text-muted-foreground">
            <Link
              href="/login"
              className="font-medium text-primary underline underline-offset-2 hover:no-underline"
            >
              로그인
            </Link>
            하면 답변 {answerCounts.membersOnlyAnswerCount}개를 더 볼 수 있어요.
          </p>
        )}
      </div>
    </article>
  );
}

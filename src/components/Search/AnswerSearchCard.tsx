'use client';

import Link from 'next/link';
import { MessageSquare, ChevronRight } from 'lucide-react';
import type { AnswerDetailResponse } from '@/lib/api/search';

interface AnswerSearchCardProps {
  answer: AnswerDetailResponse;
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}

export function AnswerSearchCard({ answer }: AnswerSearchCardProps) {
  const questionId = answer.questionId ?? '';
  const questionPreview = answer.questionContent
    ? truncate(answer.questionContent, 80)
    : '';

  return (
    <Link
      href={questionId ? `/questions/${questionId}` : '#'}
      className="flex items-start gap-4 px-4 py-4 hover:bg-secondary/30 transition-colors group"
    >
      <div className="shrink-0 w-12 h-12 rounded-lg bg-search-accent-blue/20 flex items-center justify-center">
        <MessageSquare className="size-6 text-search-accent-blue" />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        {questionPreview && (
          <p className="text-muted-foreground text-sm leading-snug">
            Q: {questionPreview}
          </p>
        )}
        <p className="text-foreground font-medium text-base leading-snug line-clamp-2">
          {truncate(answer.content, 120)}
        </p>
        <div className="text-sm text-muted-foreground">
          {answer.likeCount > 0 && `${answer.likeCount} likes`}
        </div>
      </div>
      <ChevronRight className="shrink-0 size-5 text-muted-foreground group-hover:text-foreground transition-colors mt-2" />
    </Link>
  );
}

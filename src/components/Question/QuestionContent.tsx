'use client';

import { QuestionTag } from '@/components/Feed/QuestionTag';
import { Button } from '@/components/ui/button';
import { Pencil, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatTimeAgo } from '@/lib/formatters';
import { useCodes } from '@/hooks/useCodes';
import type { QuestionDetail } from '@/lib/api/questions';

interface QuestionContentProps {
  question: QuestionDetail;
  isLoggedIn: boolean;
  /** 질문 작성자 본인일 때 true – "내가 쓴 글" 뱃지 표시 */
  isQuestionAuthor?: boolean;
}

export function QuestionContent({ question, isLoggedIn, isQuestionAuthor }: QuestionContentProps) {
  const { getLabel } = useCodes();
  const jobLabel = getLabel('Job', question.job);
  const authorLabel = question.authorHidden ? '익명' : question.authorName ?? '익명';

  return (
    <motion.div
      layoutId={`question-card-${question.id}`}
      className="rounded-xl bg-card p-6 space-y-4 border border-border/50"
    >
      {/* 태그 및 시간 */}
      <motion.div
        layoutId={`question-tags-${question.id}`}
        className="flex items-center justify-between gap-2 flex-wrap"
      >
        <div className="flex items-center gap-2 flex-wrap">
          {isQuestionAuthor && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
              <User className="size-3.5" />
              내가 쓴 글
            </span>
          )}
          <QuestionTag label={question.companyName} variant="company" />
          <QuestionTag label={jobLabel} variant="category" />
        </div>
        <time className="text-muted-foreground text-xs whitespace-nowrap">
          {formatTimeAgo(question.createdAt)}
        </time>
      </motion.div>

      {/* 질문 내용 */}
      <motion.h1
        layoutId={`question-content-${question.id}`}
        className="text-foreground font-semibold text-xl leading-relaxed"
      >
        {question.content}
      </motion.h1>

      {/* 작성자 및 답변하기 버튼 */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <span className="text-sm text-muted-foreground">{authorLabel}</span>
        <Button variant="default" size="default" className="gap-2" asChild>
          <Link href={isLoggedIn ? `/questions/${question.id}/answers/new` : '/login'}>
            <Pencil className="size-4" />
            답변하기
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

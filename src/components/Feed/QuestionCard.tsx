import { Lightbulb, Pencil } from 'lucide-react';
import { Question } from '@/types/feed';
import { formatTimeAgo, formatAnswerCount } from '@/lib/formatters';
import { QuestionTag } from './QuestionTag';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <article className="rounded-xl bg-card p-4 space-y-3 border border-border/50">
      {/* Tags and timestamp */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {question.tags.map((tag) => (
            <QuestionTag key={tag.id} label={tag.label} variant={tag.variant} />
          ))}
          <span className="text-muted-foreground text-xs">{question.author}</span>
        </div>
        <time className="text-muted-foreground text-xs whitespace-nowrap">
          {formatTimeAgo(question.timestamp)}
        </time>
      </div>

      {/* Question title */}
      <h3 className="text-foreground font-medium text-base leading-snug">
        {question.title}
      </h3>

      {/* Status and tip */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {question.status === 'passed' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-(--status-success-bg) text-(--status-success-text)">
              PASSED
            </span>
          )}
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Lightbulb className="size-4" style={{ color: 'var(--tip-yellow)' }} />
            <span>Tip</span>
          </div>
        </div>

        {/* Tip preview */}
        <p className="text-muted-foreground text-sm">{question.tipPreview}</p>

        {/* Quote preview if available */}
        {question.quotePreview && (
          <p className="text-muted-foreground/80 text-sm italic pl-3 border-l-2 border-border">
            {question.quotePreview}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href={`/questions/${question.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {formatAnswerCount(question.answerCount)}
        </Link>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Pencil className="size-3.5" />
          Answer
        </Button>
      </div>
    </article>
  );
}

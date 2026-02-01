'use client';

import Link from 'next/link';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { SearchQuestion } from '@/types/search';
import { Badge } from '@/components/ui/badge';

interface QuestionSearchCardProps {
  question: SearchQuestion;
}

export function QuestionSearchCard({ question }: QuestionSearchCardProps) {
  return (
    <Link
      href={`/questions/${question.id}`}
      className="flex items-start gap-4 px-4 py-4 hover:bg-secondary/30 transition-colors group"
    >
      {/* Question Icon */}
      <div className="shrink-0 w-12 h-12 rounded-lg bg-search-accent-blue/20 flex items-center justify-center">
        <HelpCircle className="size-6 text-search-accent-blue" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title */}
        <h3 className="text-foreground font-medium text-base leading-snug">
          {question.title}
        </h3>

        {/* Company name badge */}
        {question.companyName && (
          <Badge variant="secondary" className="font-medium border-0">
            {question.companyName}
          </Badge>
        )}
      </div>

      {/* Chevron */}
      <ChevronRight className="shrink-0 size-5 text-muted-foreground group-hover:text-foreground transition-colors mt-2" />
    </Link>
  );
}

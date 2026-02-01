'use client';

import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onTryDifferentKeywords: () => void;
}

export function EmptyState({ onTryDifferentKeywords }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Icon */}
      <div className="w-32 h-32 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
        <SearchX className="size-16 text-muted-foreground" />
      </div>

      {/* Heading */}
      <h3 className="text-foreground text-xl font-semibold mb-3">검색 결과가 없어요.</h3>

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
        검색 결과가 없어요. 다른 키워드로 검색해 보세요.
      </p>

      {/* Action Button */}
      <Button
        variant="link"
        onClick={onTryDifferentKeywords}
        className="text-search-accent-blue hover:text-search-accent-blue/80 text-base font-medium"
      >
        검색 페이지로 이동
      </Button>
    </div>
  );
}

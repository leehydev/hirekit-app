'use client';

import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchResultHeaderProps {
  resultCount: number;
  onFilterClick: () => void;
}

export function SearchResultHeader({ resultCount, onFilterClick }: SearchResultHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <h2 className="text-sm font-medium text-muted-foreground tracking-wide">
        {resultCount} 개의 검색 결과
      </h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={onFilterClick}
        className="gap-2 text-search-accent-blue hover:text-search-accent-blue/80"
      >
        <SlidersHorizontal className="size-4" />
        Filter
      </Button>
    </div>
  );
}

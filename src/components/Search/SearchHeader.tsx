'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  /** Enter 시 호출 (현재 탭으로 새 키워드 검색) */
  onSearchSubmit?: (query: string) => void;
}

export function SearchHeader({ query, onQueryChange, onClear, onSearchSubmit }: SearchHeaderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && onSearchSubmit) onSearchSubmit(trimmed);
  };

  return (
    <div className="sticky top-0 z-50 bg-card border-b border-border/40 px-4 py-3">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="질문, 회사, 답변 등 검색"
          className="pl-10 pr-12 h-12 rounded-xl bg-secondary/50 border-input/50 focus-visible:border-ring text-base"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-muted/80 hover:bg-muted"
            aria-label="Clear search"
          >
            <X className="size-5" />
          </Button>
        )}
      </form>
    </div>
  );
}

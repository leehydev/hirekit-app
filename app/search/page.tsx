'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SEARCH_QUERY_KEY } from '@/types/search';

const RECENT_SEARCHES_KEY = 'hirekit-recent-searches';
const MAX_RECENT_SEARCHES = 10;

function loadRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function saveRecentSearches(items: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(loadRecentSearches());
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const handleRemoveSearch = useCallback((index: number) => {
    setRecentSearches((prev) => {
      const next = prev.filter((_, i) => i !== index);
      saveRecentSearches(next);
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setRecentSearches([]);
    saveRecentSearches([]);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keyword = searchQuery.trim();
    if (keyword) {
      setRecentSearches((prev) => {
        const deduped = [keyword, ...prev.filter((q) => q !== keyword)].slice(
          0,
          MAX_RECENT_SEARCHES,
        );
        saveRecentSearches(deduped);
        return deduped;
      });
      const params = new URLSearchParams({ [SEARCH_QUERY_KEY]: keyword });
      router.push(`/search/questions?${params.toString()}`);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setRecentSearches((prev) => {
      const deduped = [search, ...prev.filter((q) => q !== search)].slice(0, MAX_RECENT_SEARCHES);
      saveRecentSearches(deduped);
      return deduped;
    });
    const params = new URLSearchParams({ [SEARCH_QUERY_KEY]: search });
    router.push(`/search/questions?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border/40">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleBack}
            className="shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft className="size-6" />
          </Button>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="질문, 회사, 답변 등 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-full bg-input/30 border-input/50 focus-visible:border-ring"
              autoFocus
            />
          </form>

          {/* Cancel Button */}
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="shrink-0 text-foreground hover:text-foreground/80"
          >
            Cancel
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Recent Searches Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">최근 검색어</h2>
            {recentSearches.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleClearAll}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                모두 삭제
              </Button>
            )}
          </div>

          {/* Recent Searches List */}
          {recentSearches.length > 0 ? (
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <div key={index} className="flex items-center gap-3 py-3 group">
                  {/* Clock Icon */}
                  <Clock className="size-5 text-muted-foreground shrink-0" />

                  {/* Search Text */}
                  <button
                    type="button"
                    onClick={() => handleRecentSearchClick(search)}
                    className="flex-1 text-left text-foreground hover:text-foreground/80 transition-colors"
                  >
                    {search}
                  </button>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveSearch(index)}
                    className="shrink-0 opacity-70 hover:opacity-100"
                    aria-label={`Remove ${search}`}
                  >
                    <X className="size-5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm py-4">최근 검색어가 없어요.</p>
          )}
        </div>
      </main>
    </div>
  );
}

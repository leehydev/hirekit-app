'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchResultHeader, AnswerSearchCard, EmptyState } from '@/components/Search';
import { searchAnswers, type AnswerDetailResponse } from '@/lib/api/search';
import { SEARCH_QUERY_KEY } from '@/types/search';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const PAGE_SIZE = 20;

function AnswersSearchContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get(SEARCH_QUERY_KEY)?.trim() ?? '';
  const [answers, setAnswers] = useState<AnswerDetailResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword) {
      setAnswers([]);
      setTotalElements(0);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    searchAnswers({ keyword, page: 0, size: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setAnswers(res.content);
        setTotalElements(res.totalElements);
        setTotalPages(res.totalPages);
        setPage(res.number);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message ?? '검색 중 오류가 발생했어요.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [keyword]);

  const loadMore = () => {
    if (!keyword || page >= totalPages - 1 || loading) return;
    setLoading(true);
    searchAnswers({ keyword, page: page + 1, size: PAGE_SIZE })
      .then((res) => {
        setAnswers((prev) => [...prev, ...res.content]);
        setPage(res.number);
      })
      .finally(() => setLoading(false));
  };

  const handleFilterClick = () => {
    // TODO: 정렬/필터
  };

  const handleTryDifferentKeywords = () => {
    window.location.href = '/search';
  };

  if (!keyword) {
    return <EmptyState onTryDifferentKeywords={handleTryDifferentKeywords} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </div>
    );
  }

  if (loading && answers.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-muted-foreground">
        검색 중...
      </div>
    );
  }

  if (answers.length === 0) {
    return <EmptyState onTryDifferentKeywords={handleTryDifferentKeywords} />;
  }

  return (
    <div className="min-h-screen">
      <SearchResultHeader
        resultCount={totalElements}
        onFilterClick={handleFilterClick}
      />
      <div className="divide-y divide-border/40">
        {answers.map((answer) => (
          <AnswerSearchCard key={answer.id} answer={answer} />
        ))}
      </div>
      {page < totalPages - 1 && (
        <div className="px-4 py-6 flex justify-center">
          <Button variant="outline" onClick={loadMore} disabled={loading} className="gap-2">
            {loading && <Spinner className="size-4" />}
            {loading ? '불러오는 중...' : '더 보기'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AnswersSearchPage() {
  return (
    <Suspense fallback={<div className="px-4 py-8 text-center text-muted-foreground">검색 중...</div>}>
      <AnswersSearchContent />
    </Suspense>
  );
}

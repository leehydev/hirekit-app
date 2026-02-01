'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchResultHeader, QuestionSearchCard, EmptyState } from '@/components/Search';
import { searchQuestions } from '@/lib/api/search';
import { SEARCH_QUERY_KEY } from '@/types/search';
import type { SearchQuestion } from '@/types/search';
import type { QuestionDetail } from '@/lib/api/questions';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 20;

function mapToSearchQuestion(item: QuestionDetail): SearchQuestion {
  return {
    id: item.id,
    title: item.content,
    difficulty: 'INTERMEDIATE',
    answerCount: 0,
    viewCount: 0,
    job: item.job,
    companyName: item.companyName,
  };
}

export default function QuestionsSearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get(SEARCH_QUERY_KEY)?.trim() ?? '';
  const [questions, setQuestions] = useState<SearchQuestion[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword) {
      setQuestions([]);
      setTotalElements(0);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    searchQuestions({ keyword, page: 0, size: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setQuestions(res.content.map(mapToSearchQuestion));
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
    searchQuestions({ keyword, page: page + 1, size: PAGE_SIZE })
      .then((res) => {
        setQuestions((prev) => [
          ...prev,
          ...res.content.map(mapToSearchQuestion),
        ]);
        setPage(res.number);
      })
      .finally(() => setLoading(false));
  };

  const handleFilterClick = () => {
    // TODO: 정렬/필터 모달
  };

  const handleTryDifferentKeywords = () => {
    window.location.href = '/search';
  };

  if (!keyword) {
    return (
      <EmptyState
        onTryDifferentKeywords={handleTryDifferentKeywords}
      />
    );
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

  if (loading && questions.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-muted-foreground">
        검색 중...
      </div>
    );
  }

  if (questions.length === 0) {
    return <EmptyState onTryDifferentKeywords={handleTryDifferentKeywords} />;
  }

  return (
    <div className="min-h-screen">
      <SearchResultHeader
        resultCount={totalElements}
        onFilterClick={handleFilterClick}
      />
      <div className="divide-y divide-border/40">
        {questions.map((question) => (
          <QuestionSearchCard key={question.id} question={question} />
        ))}
      </div>
      {page < totalPages - 1 && (
        <div className="px-4 py-6 flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? '불러오는 중...' : '더 보기'}
          </Button>
        </div>
      )}
    </div>
  );
}

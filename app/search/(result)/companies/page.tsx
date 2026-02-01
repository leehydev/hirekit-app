'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchResultHeader, CompanySearchCard, EmptyState } from '@/components/Search';
import { searchCompanies } from '@/lib/api/search';
import type { CompanyResponse } from '@/lib/api/companies';
import { SEARCH_QUERY_KEY } from '@/types/search';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 20;

export default function CompaniesSearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get(SEARCH_QUERY_KEY)?.trim() ?? '';
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword) {
      setCompanies([]);
      setTotalElements(0);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    searchCompanies({ keyword, page: 0, size: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setCompanies(res.content);
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
    searchCompanies({ keyword, page: page + 1, size: PAGE_SIZE })
      .then((res) => {
        setCompanies((prev) => [...prev, ...res.content]);
        setPage(res.number);
      })
      .finally(() => setLoading(false));
  };

  const handleFilterClick = () => {
    // TODO: 산업 필터 등
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

  if (loading && companies.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-muted-foreground">
        검색 중...
      </div>
    );
  }

  if (companies.length === 0) {
    return <EmptyState onTryDifferentKeywords={handleTryDifferentKeywords} />;
  }

  return (
    <div className="min-h-screen">
      <SearchResultHeader
        resultCount={totalElements}
        onFilterClick={handleFilterClick}
      />
      <div className="divide-y divide-border/40">
        {companies.map((company) => (
          <CompanySearchCard
            key={company.id ?? company.name}
            company={company}
          />
        ))}
      </div>
      {page < totalPages - 1 && (
        <div className="px-4 py-6 flex justify-center">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? '불러오는 중...' : '더 보기'}
          </Button>
        </div>
      )}
    </div>
  );
}

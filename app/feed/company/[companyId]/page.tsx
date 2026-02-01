'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useParams, useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { FeedItemCard } from '@/components/Feed/FeedItemCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFeed, feedKeys, type FeedItemResponse } from '@/lib/api';
import { SortBy } from '@/types/feed';
import { useUser } from '@/hooks/useUser';
import { useCodes } from '@/hooks/useCodes';

const PAGE_SIZE = 5;
const COMPANY_NAME_QUERY_KEY = 'name';

function CompanyFeedPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const companyId = params?.companyId as string | undefined;
  const nameFromQuery = searchParams.get(COMPANY_NAME_QUERY_KEY) ?? '';

  const [sortBy, setSortBy] = useState<SortBy>('latest');

  const job = searchParams.get('job') ?? 'all';
  const setJob = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value === 'all') {
        next.delete('job');
      } else {
        next.set('job', value);
      }
      if (nameFromQuery) next.set(COMPANY_NAME_QUERY_KEY, nameFromQuery);
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams, nameFromQuery],
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data: user, isLoading: isUserLoading } = useUser();
  const isLoggedIn = !!user;
  const { data: codesData } = useCodes();
  const jobCodes = codesData?.find((g) => g.type === 'Job')?.codes ?? [];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: [
      ...feedKeys.list({
        companyId: companyId ?? '',
        job: job === 'all' ? undefined : job,
        size: PAGE_SIZE,
      }),
    ],
    queryFn: ({ pageParam }) =>
      getFeed({
        companyId: companyId ?? undefined,
        job: job === 'all' ? undefined : job,
        cursor: pageParam as string | undefined,
        size: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!companyId,
  });

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];
  const displayName =
    nameFromQuery || allItems[0]?.question.companyName || '회사 피드';

  const displayItems: FeedItemResponse[] =
    sortBy === 'most-answers'
      ? [...allItems].sort(
          (a, b) => b.answerCounts.totalAnswerCount - a.answerCounts.totalAnswerCount,
        )
      : allItems;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) handleLoadMore();
      },
      { rootMargin: '100px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  if (!companyId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">회사 정보가 없어요.</p>
      </div>
    );
  }

  if (isUserLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  function renderFeedList() {
    if (isLoading) {
      return <p className="text-muted-foreground text-sm py-8 text-center">불러오는 중…</p>;
    }
    if (isError) {
      return (
        <p className="text-destructive text-sm py-8 text-center">
          {error instanceof Error ? error.message : '피드를 불러오지 못했어요.'}
        </p>
      );
    }
    if (displayItems.length === 0) {
      return (
        <p className="text-muted-foreground text-sm py-8 text-center">
          이 회사에 등록된 질문이 없어요.
        </p>
      );
    }
    return displayItems.map((item) => (
      <FeedItemCard
        key={item.question.id}
        item={item}
        isLoggedIn={isLoggedIn}
        currentUserId={user?.id}
      />
    ));
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon-sm" asChild className="shrink-0" aria-label="뒤로">
            <Link href="/feed">
              <ChevronLeft className="size-6" />
            </Link>
          </Button>
          <h1 className="flex-1 min-w-0 text-lg font-semibold truncate">
            {displayName || '회사 피드'}
          </h1>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
          <div className="flex items-center justify-between gap-4">
            <Select value={job} onValueChange={setJob}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="직무" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">직무 전체</SelectItem>
                {jobCodes.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="latest" className="space-y-4 mt-4">
            {renderFeedList()}
          </TabsContent>

          <TabsContent value="most-answers" className="space-y-4 mt-4">
            {renderFeedList()}
          </TabsContent>
        </Tabs>

        <div ref={loadMoreRef} className="h-4" aria-hidden />
        {isFetchingNextPage && (
          <p className="text-muted-foreground text-sm py-4 text-center">더 불러오는 중…</p>
        )}
      </div>
    </div>
  );
}

export default function CompanyFeedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <CompanyFeedPageContent />
    </Suspense>
  );
}

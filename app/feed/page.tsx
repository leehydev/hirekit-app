'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedHeader } from '@/components/Feed/FeedHeader';
import { FeedItemCard } from '@/components/Feed/FeedItemCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { getFeed, feedKeys, type FeedItemResponse } from '@/lib/api';
import { SortBy } from '@/types/feed';
import { useNavigationStore } from '@/store/navigation';
import { useUser } from '@/hooks/useUser';
import { useCodes } from '@/hooks/useCodes';

const PAGE_SIZE = 5;

function FeedPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setBottomNavVisible = useNavigationStore((s) => s.setBottomNavVisible);
  const { data: user, isLoading: isUserLoading } = useUser();
  const isLoggedIn = !!user;
  const canViewMembersOnly =
    Array.isArray(user?.allowedVisibilities) && user.allowedVisibilities.includes('MEMBERS_ONLY');

  const job = searchParams.get('job') ?? 'all';
  const [sortBy, setSortBy] = useState<SortBy>('latest');

  const setJob = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value === 'all') {
        next.delete('job');
      } else {
        next.set('job', value);
      }
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data: codesData } = useCodes();
  const jobCodes = codesData?.find((g) => g.type === 'Job')?.codes ?? [];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useInfiniteQuery({
      queryKey: [
        ...feedKeys.list({
          job: job === 'all' ? undefined : job,
          size: PAGE_SIZE,
        }),
      ],
      queryFn: ({ pageParam }) =>
        getFeed({
          job: job === 'all' ? undefined : job,
          cursor: pageParam as string | undefined,
          size: PAGE_SIZE,
        }),
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      initialPageParam: undefined as string | undefined,
    });

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];
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
    setBottomNavVisible(true);
  }, [setBottomNavVisible]);

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

  if (isUserLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  function renderFeedList() {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      );
    }
    if (isError) {
      return (
        <p className="text-destructive text-sm py-8 text-center">
          {error instanceof Error ? error.message : '피드를 불러오지 못했어요.'}
        </p>
      );
    }
    if (displayItems.length === 0) {
      return <p className="text-muted-foreground text-sm py-8 text-center">아직 질문이 없어요.</p>;
    }
    return displayItems.map((item) => (
      <FeedItemCard
        key={item.question.id}
        item={item}
        isLoggedIn={isLoggedIn}
        currentUserId={user?.id}
        canViewMembersOnly={canViewMembersOnly}
      />
    ));
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <FeedHeader />

      <div className="px-4 py-4 space-y-4">
        {/* 정렬 탭 */}
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

            {/* <TabsList variant="default" className="w-fit">
              <TabsTrigger value="latest">최신순</TabsTrigger>
              <TabsTrigger value="most-answers">답변 많은 순</TabsTrigger>
            </TabsList> */}
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
          <div className="flex items-center justify-center py-4">
            <Spinner className="size-5 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <FeedPageContent />
    </Suspense>
  );
}

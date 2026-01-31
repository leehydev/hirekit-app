'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { FeedHeader } from '@/components/Feed/FeedHeader';
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
import { useNavigationStore } from '@/store/navigation';
import { useUser } from '@/hooks/useUser';
import { useCodes } from '@/hooks/useCodes';

const PAGE_SIZE = 5;

export default function FeedPage() {
  const setBottomNavVisible = useNavigationStore((s) => s.setBottomNavVisible);
  const { data: user, isLoading: isUserLoading } = useUser();
  const isLoggedIn = !!user;

  const [job, setJob] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('latest');
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
    return <p className="py-8 text-center text-sm text-muted-foreground">로딩 중…</p>;
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
      return <p className="text-muted-foreground text-sm py-8 text-center">아직 질문이 없어요.</p>;
    }
    return displayItems.map((item) => (
      <FeedItemCard key={item.question.id} item={item} isLoggedIn={isLoggedIn} />
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
              <SelectTrigger className="w-full max-w-[200px]">
                <SelectValue placeholder="직무" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
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
            <span className="text-sm text-muted-foreground">최신순</span>
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

      {/* 새 글 작성 FAB */}
      <button
        className="fixed right-4 bottom-24 z-50 flex items-center gap-2 px-5 py-3 rounded-full font-medium text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
        style={{
          backgroundColor: 'var(--feed-accent-blue)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--feed-accent-blue-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--feed-accent-blue)';
        }}
        aria-label="새 글 작성"
      >
        <Plus className="size-5" />
        <span>새 글 작성</span>
      </button>
    </div>
  );
}

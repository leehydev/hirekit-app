'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QuestionDetailHeader,
  QuestionContent,
  AnswerList,
  ShareAnswerToUnlockModal,
  EditQuestionModal,
  DeleteQuestionDialog,
  VisibilityQuestionDialog,
  EditAnswerModal,
  DeleteAnswerDialog,
  VisibilityAnswerDialog,
} from '@/components/Question';
import { Spinner } from '@/components/ui/spinner';
import {
  getQuestionDetail,
  getAnswers,
  getMembersOnlyAnswerCount,
  toggleAnswerLike,
  questionKeys,
  Answer,
} from '@/lib/api/questions';
import { useUser } from '@/hooks/useUser';
import { useNavigationStore } from '@/store/navigation';

const PAGE_SIZE = 10;

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: user } = useUser();
  const isLoggedIn = !!user;
  const setBottomNavVisible = useNavigationStore((s) => s.setBottomNavVisible);
  const [sortBy] = useState<'latest' | 'most-liked'>('latest');
  const queryClient = useQueryClient();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [answerEditOpen, setAnswerEditOpen] = useState(false);
  const [answerDeleteOpen, setAnswerDeleteOpen] = useState(false);
  const [answerVisibilityOpen, setAnswerVisibilityOpen] = useState(false);

  useEffect(() => {
    setBottomNavVisible(false);
  }, [setBottomNavVisible]);

  // 질문 상세 조회
  const {
    data: question,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
  } = useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => getQuestionDetail(id),
    retry: false,
  });

  // 비로그인 시 회원전용 답변 개수 (볼 수 없는 답변 수)
  const { data: membersOnlyCountData } = useQuery({
    queryKey: questionKeys.membersOnlyCount(id),
    queryFn: () => getMembersOnlyAnswerCount(id),
    enabled: !isLoggedIn && !!question,
    retry: false,
  });
  const membersOnlyCount = membersOnlyCountData?.count ?? 0;

  // 답변 목록 조회 (무한스크롤)
  const {
    data: answersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isAnswersLoading,
  } = useInfiniteQuery({
    queryKey: questionKeys.answers(id, sortBy),
    queryFn: ({ pageParam }) =>
      getAnswers({
        questionId: id,
        cursor: pageParam,
        size: PAGE_SIZE,
        sortBy,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  });

  // 좋아요 토글 mutation
  const likeMutation = useMutation({
    mutationFn: ({ answerId }: { answerId: string }) =>
      toggleAnswerLike(id, answerId),
    onMutate: async ({ answerId }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: questionKeys.answers(id, sortBy) });

      const previousData = queryClient.getQueryData(questionKeys.answers(id, sortBy));

      queryClient.setQueryData(
        questionKeys.answers(id, sortBy),
        (old: { pages: { items: Answer[] }[] }) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: { items: Answer[] }) => ({
              ...page,
              items: page.items.map((answer: Answer) =>
                answer.id === answerId
                  ? {
                      ...answer,
                      isLikedByMe: !answer.isLikedByMe,
                      likeCount: answer.isLikedByMe ? answer.likeCount - 1 : answer.likeCount + 1,
                    }
                  : answer,
              ),
            })),
          };
        },
      );

      return { previousData };
    },
    onError: (_err, _answerId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(questionKeys.answers(id, sortBy), context.previousData);
      }
    },
  });

  const handleLike = (answerId: string) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    likeMutation.mutate({ answerId });
  };

  // 로딩 상태
  if (isQuestionLoading) {
    return (
      <div className="min-h-screen bg-background">
        <QuestionDetailHeader questionId={id} />
        <div className="flex items-center justify-center px-4 py-8">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      </div>
    );
  }

  // 에러 상태 (404)
  if (isQuestionError || !question) {
    return (
      <div className="min-h-screen bg-background">
        <QuestionDetailHeader questionId={id} />
        <div className="px-4 py-8 text-center space-y-4">
          <p className="text-sm text-destructive">질문을 찾을 수 없습니다.</p>
          <button onClick={() => router.back()} className="text-sm text-primary hover:underline">
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const allAnswers = answersData?.pages.flatMap((p) => p.items) ?? [];
  const isAuthor = !!user && user.id === question.authorId;
  const hasAnswers = allAnswers.length > 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      {isLoggedIn && <ShareAnswerToUnlockModal questionId={id} />}
      <QuestionDetailHeader
        questionId={id}
        isAuthor={isAuthor}
        hasAnswers={hasAnswers}
        onEditClick={() => setEditModalOpen(true)}
        onDeleteClick={() => setDeleteDialogOpen(true)}
        onVisibilityClick={() => setVisibilityDialogOpen(true)}
      />
      <EditQuestionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        question={question}
      />
      <DeleteQuestionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        questionId={id}
      />
      <VisibilityQuestionDialog
        open={visibilityDialogOpen}
        onOpenChange={setVisibilityDialogOpen}
        question={question}
      />

      {selectedAnswer && (
        <>
          <EditAnswerModal
            open={answerEditOpen}
            onOpenChange={setAnswerEditOpen}
            questionId={id}
            answer={selectedAnswer}
            onSuccess={() => setSelectedAnswer(null)}
          />
          <DeleteAnswerDialog
            open={answerDeleteOpen}
            onOpenChange={setAnswerDeleteOpen}
            questionId={id}
            answerId={selectedAnswer.id}
            onSuccess={() => setSelectedAnswer(null)}
          />
          <VisibilityAnswerDialog
            open={answerVisibilityOpen}
            onOpenChange={setAnswerVisibilityOpen}
            questionId={id}
            answer={selectedAnswer}
            onSuccess={() => setSelectedAnswer(null)}
          />
        </>
      )}

      <div className="px-4 py-6 space-y-6">
        {/* 질문 상세 */}
        <QuestionContent question={question} isLoggedIn={isLoggedIn} isQuestionAuthor={isAuthor} />

        {/* 답변 목록 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              답변
              {membersOnlyCount > 0 ? membersOnlyCount + allAnswers.length : allAnswers.length}개
            </h2>

            {/* 정렬 탭 */}
            {/* <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <TabsList className="w-fit">
                <TabsTrigger value="latest">최신순</TabsTrigger>
                <TabsTrigger value="most-liked">좋아요순</TabsTrigger>
              </TabsList>
            </Tabs> */}
          </div>

          {/* 답변 목록 */}
          {isAnswersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          ) : (
            <>
              <AnswerList
                answers={allAnswers}
                isLoggedIn={isLoggedIn}
                onLoadMore={fetchNextPage}
                hasMore={hasNextPage}
                isLoadingMore={isFetchingNextPage}
                onLike={handleLike}
                membersOnlyCount={membersOnlyCount}
                currentUserId={user?.id}
                questionId={id}
                onAnswerEdit={(answer) => {
                  setSelectedAnswer(answer);
                  setAnswerEditOpen(true);
                }}
                onAnswerDelete={(answer) => {
                  setSelectedAnswer(answer);
                  setAnswerDeleteOpen(true);
                }}
                onAnswerVisibility={(answer) => {
                  setSelectedAnswer(answer);
                  setAnswerVisibilityOpen(true);
                }}
              />
              {allAnswers.length > 0 && membersOnlyCount > 0 && (
                <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-center">
                  {isLoggedIn ? (
                    <p className="text-sm text-muted-foreground">
                      <button
                        type="button"
                        onClick={() => router.push('/login')}
                        className="font-medium text-primary underline underline-offset-2 hover:no-underline"
                      >
                        로그인
                      </button>
                      하고 {membersOnlyCount}개의 답변을 더 확인해보세요.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      답변 하나를 공유하면 {membersOnlyCount}개의 답변을 더 확인할 수 있어요.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

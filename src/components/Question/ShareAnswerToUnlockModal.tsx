'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';

const MEMBERS_ONLY = 'MEMBERS_ONLY';
const STORAGE_KEY = 'shareAnswerToUnlockModal_dismissedUntil';

/** 오늘 23:59:59.999 (로컬 시간) 타임스탬프 */
function getEndOfTodayMs(): number {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

/** localStorage에 저장된 '오늘 하루 안 보기'가 아직 유효한지 */
function isDismissedForToday(): boolean {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  const dismissedUntil = parseInt(raw, 10);
  if (Number.isNaN(dismissedUntil)) return false;
  return Date.now() < dismissedUntil;
}

/** 오늘 하루 안 보기로 저장 */
function dismissForToday(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, String(getEndOfTodayMs()));
}

export interface ShareAnswerToUnlockModalProps {
  questionId: string;
}

/**
 * GET me 응답에서 allowedVisibilities에 MEMBERS_ONLY가 없을 때
 * "답변 하나 공유하고 모든 답변 확인하세요" 모달을 띄우는 컴포넌트.
 * - 그냥 닫기: 모달만 닫음 (다음 방문 시 다시 노출)
 * - 오늘 하루 안 보기: localStorage에 오늘 끝까지 저장, 내일부터 다시 노출
 */
export function ShareAnswerToUnlockModal({ questionId }: ShareAnswerToUnlockModalProps) {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const [open, setOpen] = useState(false);

  const hasMembersOnly =
    Array.isArray(user?.allowedVisibilities) && user.allowedVisibilities.includes(MEMBERS_ONLY);

  useEffect(() => {
    if (isLoading) return;
    if (user && !hasMembersOnly && !isDismissedForToday()) {
      setOpen(true);
    }
  }, [user, hasMembersOnly, isLoading]);

  const handleClose = () => setOpen(false);

  const handleDismissForToday = () => {
    dismissForToday();
    setOpen(false);
  };

  const handleWriteAnswer = () => {
    setOpen(false);
    router.push(`/questions/${questionId}/answers/new`);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="bottom"
        showCloseButton={true}
        className={cn(
          'left-1/2 right-auto w-full max-w-[430px] -translate-x-1/2 rounded-t-2xl border-t px-5 pb-8 pt-4',
          'pb-[max(2rem,env(safe-area-inset-bottom))]',
        )}
      >
        <SheetHeader className="px-0 pb-4 pt-1 text-left">
          <SheetTitle className="text-xl font-semibold">모든 답변을 확인하려면</SheetTitle>
          <SheetDescription className="text-left leading-relaxed text-muted-foreground">
            답변 하나를 공유하면 로그인 회원 전용 답변을 포함해 모든 답변을 확인할 수 있습니다.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="mt-0 flex flex-col gap-3 px-0">
          <Button
            size="lg"
            className="h-12 w-full rounded-xl font-bold bg-feed-accent-blue hover:bg-feed-accent-blue-hover text-white text-lg"
            onClick={handleWriteAnswer}
          >
            답변 작성하기
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-full rounded-xl text-md"
            onClick={handleClose}
          >
            닫기
          </Button>
          <button
            type="button"
            onClick={handleDismissForToday}
            className="py-3 text-center text-sm text-muted-foreground underline-offset-2 hover:underline"
          >
            오늘 하루 안 보기
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

'use client';

import { ArrowLeft, Share2, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface QuestionDetailHeaderProps {
  questionId: string;
  /** 작성자 여부 – true일 때만 더보기 메뉴 표시 */
  isAuthor?: boolean;
  /** 답변이 하나라도 있으면 수정/삭제/공개설정 비활성화 */
  hasAnswers?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onVisibilityClick?: () => void;
}

export function QuestionDetailHeader({
  questionId,
  isAuthor,
  hasAnswers,
  onEditClick,
  onDeleteClick,
  onVisibilityClick,
}: QuestionDetailHeaderProps) {
  const router = useRouter();
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/questions/${questionId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '면접 질문 공유',
          url,
        });
      } catch {
        // 사용자가 공유를 취소한 경우 등
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleMenuAction = (fn: (() => void) | undefined) => {
    if (!fn || hasAnswers) return;
    fn();
    setSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <ArrowLeft className="size-5" />
        </Button>

        <h1 className="text-base font-semibold text-foreground">질문 상세</h1>

        <div className="flex items-center gap-0">
          {isAuthor && (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="질문 메뉴"
                >
                  <MoreVertical className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className={cn(
                  'left-1/2 right-auto w-full max-w-[430px] -translate-x-1/2 rounded-t-2xl border-t px-5 pb-8 pt-4',
                  'pb-[max(2rem,env(safe-area-inset-bottom))]',
                )}
              >
                <SheetHeader>
                  <SheetTitle>질문 관리</SheetTitle>
                </SheetHeader>
                {hasAnswers && (
                  <p className="text-sm text-muted-foreground px-1">
                    답변이 있어 수정·삭제·공개 설정을 변경할 수 없어요.
                  </p>
                )}
                <div className="flex flex-col gap-1 py-2">
                  <Button
                    variant="ghost"
                    className="justify-start h-12"
                    disabled={hasAnswers}
                    onClick={() => handleMenuAction(onEditClick)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start h-12 text-destructive hover:text-destructive"
                    disabled={hasAnswers}
                    onClick={() => handleMenuAction(onDeleteClick)}
                  >
                    삭제
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start h-12"
                    disabled={hasAnswers}
                    onClick={() => handleMenuAction(onVisibilityClick)}
                  >
                    공개 설정 변경
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleShare}
            aria-label={shareStatus === 'copied' ? '링크 복사됨' : '공유하기'}
          >
            {shareStatus === 'copied' ? (
              <span className="text-xs text-primary">✓</span>
            ) : (
              <Share2 className="size-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

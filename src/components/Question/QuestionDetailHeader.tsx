'use client';

import { ArrowLeft, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface QuestionDetailHeaderProps {
  questionId: string;
}

export function QuestionDetailHeader({ questionId }: QuestionDetailHeaderProps) {
  const router = useRouter();
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const handleShare = async () => {
    const url = `${window.location.origin}/questions/${questionId}`;

    // Web Share API 지원 여부 확인
    if (navigator.share) {
      try {
        await navigator.share({
          title: '면접 질문 공유',
          url,
        });
      } catch (error) {
        // 사용자가 공유를 취소한 경우 등
        console.log('Share cancelled');
      }
    } else {
      // Fallback: 링크 복사
      try {
        await navigator.clipboard.writeText(url);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
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
    </header>
  );
}

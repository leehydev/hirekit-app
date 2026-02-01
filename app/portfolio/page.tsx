'use client';

import { ArrowLeft, Construction } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/store/navigation';

/**
 * 포트폴리오 페이지 (준비 중)
 */
export default function PortfolioPage() {
  const router = useRouter();
  const setBottomNavVisible = useNavigationStore((s) => s.setBottomNavVisible);

  useEffect(() => {
    setBottomNavVisible(false);
  }, [setBottomNavVisible]);

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
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

          <h1 className="text-base font-semibold text-foreground">포트폴리오</h1>

          {/* 오른쪽 정렬용 빈 공간 */}
          <div className="w-9" aria-hidden />
        </div>
      </header>

      {/* 준비 중 콘텐츠 */}
      <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <Construction className="size-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">준비중입니다</h2>
            <p className="text-muted-foreground text-sm max-w-[260px]">
              포트폴리오 기능을 열심히 만들고 있어요.
              <br />
              조금만 기다려 주세요.
            </p>
          </div>
          <Link
            href="/feed"
            className="text-primary text-sm font-medium underline underline-offset-4 hover:no-underline"
          >
            피드로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

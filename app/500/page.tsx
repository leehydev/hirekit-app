'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ServerErrorContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') ?? '500';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <p className="text-muted-foreground text-6xl font-semibold">{status}</p>
      <h1 className="mt-4 text-xl font-medium">일시적인 오류가 발생했어요</h1>
      <p className="text-muted-foreground mt-2 text-center text-sm">
        잠시 후 다시 시도해 주세요.
        <br />
        문제가 계속되면 문의해 주세요.
      </p>
      <Link
        href="/feed"
        className="text-primary mt-8 text-sm font-medium underline underline-offset-4"
      >
        피드로 돌아가기
      </Link>
    </div>
  );
}

/**
 * 알 수 없는 오류 페이지
 * 서버/API 오류(500, 503 등) 시 표시
 */
function ServerErrorFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <p className="text-muted-foreground text-6xl font-semibold">500</p>
      <h1 className="mt-4 text-xl font-medium">일시적인 오류가 발생했어요</h1>
      <p className="text-muted-foreground mt-2 text-center text-sm">
        잠시 후 다시 시도해 주세요.
        <br />
        문제가 계속되면 문의해 주세요.
      </p>
      <Link
        href="/feed"
        className="text-primary mt-8 text-sm font-medium underline underline-offset-4"
      >
        피드로 돌아가기
      </Link>
    </div>
  );
}

export default function ServerErrorPage() {
  return (
    <Suspense fallback={<ServerErrorFallback />}>
      <ServerErrorContent />
    </Suspense>
  );
}

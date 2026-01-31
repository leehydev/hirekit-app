import Link from 'next/link';

/**
 * 404 페이지
 * 페이지를 찾을 수 없을 때 표시
 */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <p className="text-muted-foreground text-6xl font-semibold">404</p>
      <h1 className="mt-4 text-xl font-medium">페이지를 찾을 수 없어요</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        요청한 주소가 없거나 변경되었을 수 있어요.
      </p>
      <Link
        href="/"
        className="text-primary mt-8 text-sm font-medium underline underline-offset-4"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

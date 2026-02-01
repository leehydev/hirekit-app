import Link from 'next/link';

/**
 * Next.js 기본 404 처리
 * 존재하지 않는 경로로 접근했을 때 자동으로 이 페이지가 렌더링됨
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <p className="text-muted-foreground text-6xl font-semibold">404</p>
      <h1 className="mt-4 text-xl font-medium">페이지를 찾을 수 없어요</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        요청한 주소가 없거나 변경되었을 수 있어요.
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

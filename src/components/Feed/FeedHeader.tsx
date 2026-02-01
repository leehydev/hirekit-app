import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FeedHeaderMenu } from './FeedHeaderMenu';

export function FeedHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2 shrink-0">
          <div className="relative w-24 h-8 shrink-0">
            <Image
              src="/hirekit/logo.png"
              alt="HireKit"
              fill
              sizes="112px"
              className="rounded-lg object-contain object-left"
            />
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="검색"
          >
            <Search className="size-5 text-foreground" />
          </button>
          <FeedHeaderMenu />
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PenSquare, SquareUser, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/feed', label: '피드', icon: Home },
  { href: '/questions/new', label: '새 글 작성', icon: PenSquare },
  { href: '/portfolio', label: '포트폴리오', icon: SquareUser },
  { href: '/my', label: '마이페이지', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-[430px] items-center justify-around border-t border-border bg-background/95 py-2 backdrop-blur supports-backdrop-filter:bg-background/80"
      role="navigation"
      aria-label="Bottom navigation"
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors min-w-0',
              isActive ? 'text-feed-accent-blue' : 'text-muted-foreground hover:text-foreground',
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="size-5" aria-hidden />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

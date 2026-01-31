'use client';

import { Menu, LayoutDashboard, FileText, Search, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useNavigationStore } from '@/store/navigation';
import { useUserStore } from '@/store/user';
import { useUser } from '@/hooks/useUser';
import { logout } from '@/lib/api';

const menuItems = [
  { href: '/', label: '서비스소개', icon: FileText },
  { href: '/feed', label: '피드', icon: LayoutDashboard },
  { href: '/search', label: '검색', icon: Search },
] as const;

/**
 * 로그인/로그아웃 블록. user는 Zustand store에서 읽음 (한 군데에서만 조회).
 */
function MenuAuthBlock({ onClose }: { onClose: () => void }) {
  const { data: user } = useUser();
  const clearUser = useUserStore((s) => s.clearUser);
  const isLoggedIn = !!user;

  const handleLogout = () => {
    onClose();
    clearUser();
    logout();
  };

  if (isLoggedIn) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-foreground hover:bg-accent transition-colors"
      >
        <LogOut className="size-5 shrink-0" />
        로그아웃
      </button>
    );
  }
  return (
    <Link
      href="/login"
      onClick={onClose}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-foreground hover:bg-accent transition-colors"
    >
      <LogIn className="size-5 shrink-0" />
      로그인
    </Link>
  );
}

export function FeedHeaderMenu() {
  const open = useNavigationStore((s) => s.isHeaderMenuOpen);
  const setOpen = useNavigationStore((s) => s.setHeaderMenuOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="메뉴 열기"
        >
          <Menu className="size-6 text-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 sm:max-w-[85vw]">
        <SheetTitle className="sr-only">메뉴</SheetTitle>
        <nav className="flex flex-col gap-1 pt-8">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-foreground hover:bg-accent transition-colors"
            >
              <Icon className="size-5 shrink-0" />
              {label}
            </Link>
          ))}
          <div className="my-2 border-t border-border" />
          {open && <MenuAuthBlock onClose={() => setOpen(false)} />}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoginButtonProps {
  provider: 'kakao' | 'naver' | 'google';
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * 소셜 로그인 버튼 컴포넌트
 */
export function LoginButton({
  provider,
  icon,
  children,
  onClick,
  disabled = false,
}: LoginButtonProps) {
  const getButtonStyles = () => {
    switch (provider) {
      case 'kakao':
        return 'bg-(--kakao-yellow) text-(--kakao-text) hover:bg-(--kakao-yellow)/90';
      case 'naver':
        return 'bg-(--naver-green) text-(--naver-text) hover:bg-(--naver-green)/90';
      case 'google':
        return 'bg-[#2F3545] text-white hover:bg-[#3F4555] border border-[#3F4555]';
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full h-14 text-base font-semibold rounded-xl transition-colors',
        getButtonStyles()
      )}
    >
      <span className="flex items-center justify-center gap-2">
        {icon}
        {children}
      </span>
    </Button>
  );
}

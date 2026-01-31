import { cn } from '@/lib/utils';
import { TagVariant } from '@/types/feed';

interface QuestionTagProps {
  label: string;
  variant: TagVariant;
}

export function QuestionTag({ label, variant }: QuestionTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
        variant === 'major' && 'bg-(--tag-blue-bg) text-(--tag-blue-text)',
        variant === 'category' && 'bg-(--tag-purple-bg) text-(--tag-purple-text)',
        variant === 'company' && 'bg-(--tag-gray-bg) text-(--tag-gray-text)'
      )}
    >
      {label}
    </span>
  );
}

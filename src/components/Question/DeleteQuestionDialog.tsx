'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteQuestion } from '@/lib/api/questions';
import { feedKeys } from '@/lib/api/feed';

interface DeleteQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string;
  onSuccess?: () => void;
}

export function DeleteQuestionDialog({
  open,
  onOpenChange,
  questionId,
  onSuccess,
}: DeleteQuestionDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteQuestion(questionId),
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
      router.replace('/feed');
      // 피드 목록만 무효화. questionKeys.all 쓰면 상세/답변 쿼리까지 무효화되어 404 재요청 → 에러 토스트 발생
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>질문 삭제</DialogTitle>
          <DialogDescription>
            정말 이 질문을 삭제할까요? 삭제하면 복구할 수 없어요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? '삭제 중…' : '삭제'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

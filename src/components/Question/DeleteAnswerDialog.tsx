'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteAnswer, questionKeys } from '@/lib/api/questions';

interface DeleteAnswerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string;
  answerId: string;
  onSuccess?: () => void;
}

export function DeleteAnswerDialog({
  open,
  onOpenChange,
  questionId,
  answerId,
  onSuccess,
}: DeleteAnswerDialogProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteAnswer(questionId, answerId),
    onSuccess: () => {
      onOpenChange(false);
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: questionKeys.answers(questionId) });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>답변 삭제</DialogTitle>
          <DialogDescription>
            정말 이 답변을 삭제할까요? 삭제하면 복구할 수 없어요.
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

'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { patchAnswerVisibility, questionKeys } from '@/lib/api/questions';
import { useCodes } from '@/hooks/useCodes';
import type { Answer } from '@/lib/api/questions';

type AnswerVisibility = 'PUBLIC' | 'MEMBERS_ONLY';

interface VisibilityAnswerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string;
  answer: Answer;
  onSuccess?: (updated: Answer) => void;
}

export function VisibilityAnswerDialog({
  open,
  onOpenChange,
  questionId,
  answer,
  onSuccess,
}: VisibilityAnswerDialogProps) {
  const queryClient = useQueryClient();
  const { getLabel } = useCodes();
  const [visibility, setVisibility] = useState<AnswerVisibility>(answer.visibility ?? 'PUBLIC');

  useEffect(() => {
    if (open) {
      setVisibility(answer.visibility ?? 'PUBLIC');
    }
  }, [open, answer.visibility]);

  const patchMutation = useMutation({
    mutationFn: (vis: AnswerVisibility) => patchAnswerVisibility(questionId, answer.id, vis),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: questionKeys.answers(questionId) });
      onSuccess?.(updated);
      onOpenChange(false);
    },
  });

  const handleSubmit = () => {
    patchMutation.mutate(visibility);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>답변 공개 설정 변경</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Select value={visibility} onValueChange={(v) => setVisibility(v as AnswerVisibility)}>
            <SelectTrigger className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLIC">{getLabel('AnswerVisibility', 'PUBLIC')}</SelectItem>
              <SelectItem value="MEMBERS_ONLY">
                {getLabel('AnswerVisibility', 'MEMBERS_ONLY')}
              </SelectItem>
              <SelectItem value="PRIVATE">{getLabel('AnswerVisibility', 'PRIVATE')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={patchMutation.isPending}>
            {patchMutation.isPending ? '변경 중…' : '확인'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

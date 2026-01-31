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
import { patchQuestionVisibility, questionKeys } from '@/lib/api/questions';
import { useCodes } from '@/hooks/useCodes';
import type { QuestionDetail, QuestionVisibility } from '@/lib/api/questions';

interface VisibilityQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionDetail;
  onSuccess?: (updated: QuestionDetail) => void;
}

export function VisibilityQuestionDialog({
  open,
  onOpenChange,
  question,
  onSuccess,
}: VisibilityQuestionDialogProps) {
  const queryClient = useQueryClient();
  const { getLabel } = useCodes();
  const [visibility, setVisibility] = useState<QuestionVisibility>(
    question.visibility ?? 'PUBLIC'
  );

  useEffect(() => {
    if (open) {
      setVisibility(question.visibility ?? 'PUBLIC');
    }
  }, [open, question.visibility]);

  const patchMutation = useMutation({
    mutationFn: (vis: QuestionVisibility) => patchQuestionVisibility(question.id, vis),
    onSuccess: (updated) => {
      queryClient.setQueryData(questionKeys.detail(question.id), updated);
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
          <DialogTitle>공개 설정 변경</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Select
            value={visibility}
            onValueChange={(v) => setVisibility(v as QuestionVisibility)}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLIC">{getLabel('QuestionVisibility', 'PUBLIC')}</SelectItem>
              <SelectItem value="PRIVATE">{getLabel('QuestionVisibility', 'PRIVATE')}</SelectItem>
            </SelectContent>
          </Select>
          {visibility === 'PRIVATE' && (
            <p className="text-xs text-destructive">
              비공개글은 마이페이지에서 조회 및 관리가 가능합니다.
            </p>
          )}
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

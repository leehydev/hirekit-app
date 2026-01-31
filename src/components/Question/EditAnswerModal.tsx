'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  updateAnswer,
  questionKeys,
  type Answer,
  type AnswerUpdateRequest,
} from '@/lib/api/questions';
import { useCodes } from '@/hooks/useCodes';

const schema = z.object({
  content: z.string().min(1, '답변 내용을 입력해주세요'),
  tip: z.string().optional(),
  passStatus: z.enum(['PASS', 'FAIL', '__none__']).optional(),
  interviewDate: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'MEMBERS_ONLY', 'PRIVATE']),
});

type FormValues = z.infer<typeof schema>;

interface EditAnswerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string;
  answer: Answer;
  onSuccess?: (updated: Answer) => void;
}

export function EditAnswerModal({
  open,
  onOpenChange,
  questionId,
  answer,
  onSuccess,
}: EditAnswerModalProps) {
  const queryClient = useQueryClient();
  const { data: codesData } = useCodes();
  const passStatusCodes = codesData?.find((g) => g.type === 'PassStatus')?.codes ?? [];
  const visibilityCodes = codesData?.find((g) => g.type === 'AnswerVisibility')?.codes ?? [];
  const PASS_STATUS_NONE = '__none__';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: answer.content,
      tip: answer.tip ?? '',
      passStatus: answer.passStatus ?? PASS_STATUS_NONE,
      interviewDate: answer.interviewDate ?? '',
      visibility: answer.visibility ?? 'PUBLIC',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        content: answer.content,
        tip: answer.tip ?? '',
        passStatus: answer.passStatus ?? PASS_STATUS_NONE,
        interviewDate: answer.interviewDate ?? '',
        visibility: answer.visibility ?? 'PUBLIC',
      });
    }
  }, [
    open,
    answer.id,
    answer.content,
    answer.tip,
    answer.passStatus,
    answer.interviewDate,
    answer.visibility,
    reset,
  ]);

  const updateMutation = useMutation({
    mutationFn: (values: FormValues) => {
      const body: AnswerUpdateRequest = {
        content: values.content,
        tip: values.tip || undefined,
        passStatus:
          values.passStatus === PASS_STATUS_NONE || values.passStatus == null
            ? undefined
            : values.passStatus,
        interviewDate: values.interviewDate || undefined,
        visibility: values.visibility,
      };
      return updateAnswer(questionId, answer.id, body);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: questionKeys.answers(questionId) });
      onSuccess?.(updated);
      onOpenChange(false);
    },
  });

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate(values);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>답변 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>답변 내용</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="답변을 입력해주세요."
                  rows={6}
                  maxLength={5000}
                  className="w-full rounded-lg border border-input bg-input/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
                />
              )}
            />
            {errors.content && (
              <p className="text-destructive text-xs" role="alert">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>팁 (선택)</Label>
            <Controller
              name="tip"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder="면접 준비에 도움이 되는 팁을 적어주세요."
                  rows={3}
                  maxLength={2000}
                  className="w-full rounded-lg border border-input bg-input/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>합격 여부</Label>
            <Controller
              name="passStatus"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? PASS_STATUS_NONE}
                  onValueChange={(v) => field.onChange(v === PASS_STATUS_NONE ? null : v)}
                >
                  <SelectTrigger className="h-11 w-full rounded-lg bg-input/30">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PASS_STATUS_NONE}>선택 안 함</SelectItem>
                    {passStatusCodes.map((opt) => (
                      <SelectItem key={opt.code} value={opt.code}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>면접 일자 (선택)</Label>
            <Controller
              name="interviewDate"
              control={control}
              render={({ field }) => (
                <input
                  type="date"
                  {...field}
                  value={field.value ?? ''}
                  className="w-full rounded-lg border border-input bg-input/30 px-4 py-3 text-sm text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>공개 범위</Label>
            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="space-y-1"
                >
                  {visibilityCodes.map((option) => (
                    <Label
                      key={option.code}
                      htmlFor={`edit-answer-vis-${answer.id}-${option.code}`}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-transparent p-3 text-sm has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent/50"
                    >
                      <RadioGroupItem
                        value={option.code}
                        id={`edit-answer-vis-${answer.id}-${option.code}`}
                      />
                      {option.label}
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? '저장 중…' : '저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

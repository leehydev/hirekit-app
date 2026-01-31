'use client';

import { useEffect } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
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
import { updateQuestion, questionKeys } from '@/lib/api/questions';
import { useCodes } from '@/hooks/useCodes';
import type { QuestionDetail } from '@/lib/api/questions';

const schema = z.object({
  job: z.string().min(1, '직무를 선택해주세요'),
  content: z.string().min(1, '질문 내용을 입력해주세요'),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  authorHidden: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface EditQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionDetail;
  onSuccess?: (updated: QuestionDetail) => void;
}

export function EditQuestionModal({
  open,
  onOpenChange,
  question,
  onSuccess,
}: EditQuestionModalProps) {
  const queryClient = useQueryClient();
  const { data: codesData } = useCodes();
  const jobCodes = codesData?.find((g) => g.type === 'Job')?.codes ?? [];
  const visibilityCodes = codesData?.find((g) => g.type === 'QuestionVisibility')?.codes ?? [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      job: question.job,
      content: question.content,
      visibility: question.visibility ?? 'PUBLIC',
      authorHidden: question.authorHidden,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        job: question.job,
        content: question.content,
        visibility: question.visibility ?? 'PUBLIC',
        authorHidden: question.authorHidden,
      });
    }
  }, [
    open,
    question.id,
    question.job,
    question.content,
    question.visibility,
    question.authorHidden,
    reset,
  ]);

  const visibility = useWatch({ control, name: 'visibility', defaultValue: 'PUBLIC' });

  const updateMutation = useMutation({
    mutationFn: (values: FormValues) =>
      updateQuestion(question.id, {
        job: values.job,
        content: values.content,
        visibility: values.visibility,
        authorHidden: values.authorHidden,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(questionKeys.detail(question.id), updated);
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
          <DialogTitle>질문 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>직무</Label>
            <Controller
              name="job"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11 w-full rounded-lg bg-input/30">
                    <SelectValue placeholder="직무 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobCodes.map((opt) => (
                      <SelectItem key={opt.code} value={opt.code}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.job && (
              <p className="text-destructive text-xs" role="alert">
                {errors.job.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>질문 내용</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="면접에서 들은 질문을 자세히 입력해주세요."
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
                      htmlFor={`edit-vis-${option.code}`}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-transparent p-3 text-sm has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent/50"
                    >
                      <RadioGroupItem value={option.code} id={`edit-vis-${option.code}`} />
                      {option.label}
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
            {visibility === 'PRIVATE' && (
              <p className="text-xs text-destructive">
                비공개글은 마이페이지에서 조회 및 관리가 가능합니다.
              </p>
            )}
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

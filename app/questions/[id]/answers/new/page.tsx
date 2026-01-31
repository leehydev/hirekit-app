'use client';

import { useCallback, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { createAnswer, getQuestionDetail, questionKeys } from '@/lib/api';
import { useCodes } from '@/hooks/useCodes';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const schema = z.object({
  content: z.string().min(1, '답변 내용은 필수입니다.'),
  tip: z.string().optional(),
  passStatus: z.enum(['PASS', 'FAIL']).optional().nullable(),
  interviewDate: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'MEMBERS_ONLY']),
});

type FormValues = z.infer<typeof schema>;

export default function AnswerNewPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;
  const { isLoading: isAuthLoading } = useRequireAuth();
  const { data: codesData } = useCodes();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: question } = useQuery({
    queryKey: questionKeys.detail(questionId),
    queryFn: () => getQuestionDetail(questionId),
    enabled: !!questionId,
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: '',
      tip: '',
      passStatus: undefined,
      interviewDate: '',
      visibility: 'PUBLIC',
    },
  });

  const passStatusCodes = codesData?.find((g) => g.type === 'PassStatus')?.codes ?? [];
  const visibilityCodes = codesData?.find((g) => g.type === 'AnswerVisibility')?.codes ?? [];

const PASS_STATUS_NONE = '__none__';

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setSubmitError(null);
      setIsSubmitting(true);
      try {
        await createAnswer(questionId, {
          content: values.content,
          tip: values.tip || undefined,
          passStatus: values.passStatus ?? undefined,
          interviewDate: values.interviewDate || undefined,
          visibility: values.visibility,
        });
        router.replace(`/questions/${questionId}`);
      } catch (e) {
        setSubmitError(e instanceof Error ? e.message : '저장 중 오류가 발생했습니다.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [questionId, router],
  );

  const contentValue = watch('content') ?? '';
  const contentLength = contentValue.length;

  if (isAuthLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">로딩 중…</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="size-10"
        >
          <X className="size-6" />
        </Button>
        <h1 className="text-lg font-semibold">답변 등록</h1>
        <Button
          type="button"
          variant="ghost"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="text-[#1E90FF] hover:text-[#1C7ED6] h-auto px-2 py-1"
        >
          등록
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-6 space-y-6">
        {/* 질문 요약 (선택) */}
        {question && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground mb-1">해당 질문</p>
            <p className="text-sm text-foreground line-clamp-2">{question.content}</p>
            {question.companyName && (
              <p className="text-xs text-muted-foreground mt-1">{question.companyName}</p>
            )}
          </div>
        )}

        {/* 답변 내용 (필수) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-foreground text-sm font-medium">답변 내용</label>
            <span className="text-xs text-muted-foreground">{contentLength} / 5000</span>
          </div>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="면접에서 답변한 내용을 입력해주세요."
                rows={10}
                maxLength={5000}
                className="w-full rounded-lg border border-input bg-input/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
                value={field.value ?? ''}
              />
            )}
          />
          {errors.content?.message && (
            <p className="text-destructive text-xs" role="alert">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* 팁 (선택) */}
        <div className="space-y-2">
          <label className="text-foreground text-sm font-medium block">팁 (선택)</label>
          <Controller
            name="tip"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="다른 지원자에게 도움이 되는 팁을 입력해주세요."
                rows={3}
                maxLength={1000}
                className="w-full rounded-lg border border-input bg-input/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
                value={field.value ?? ''}
              />
            )}
          />
        </div>

        {/* 합격 여부 (선택) */}
        <div className="space-y-2">
          <label className="text-foreground text-sm font-medium block">합격 여부 (선택)</label>
          <Controller
            name="passStatus"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? PASS_STATUS_NONE}
                onValueChange={(v) => field.onChange(v === PASS_STATUS_NONE ? undefined : v)}
              >
                <SelectTrigger className="h-11 w-full rounded-lg bg-input/30 border-input hover:bg-input/50">
                  <SelectValue placeholder="선택하세요" />
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

        {/* 면접 일자 (선택) */}
        <div className="space-y-2">
          <label className="text-foreground text-sm font-medium block">면접 일자 (선택)</label>
          <Controller
            name="interviewDate"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                {...field}
                className="w-full h-11 rounded-lg border border-input bg-input/30 px-4 py-3 text-sm text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={field.value ?? ''}
              />
            )}
          />
        </div>

        {/* 공개 범위 */}
        <div className="space-y-3">
          <label className="text-foreground text-sm font-medium block">공개 범위</label>
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="space-y-1"
              >
                {visibilityCodes.map((option) => {
                  const inputId = `visibility-${option.code}`;
                  return (
                    <div
                      key={option.code}
                      className="flex items-start gap-3 rounded-lg border border-input bg-transparent p-4 transition-colors hover:bg-input/20"
                    >
                      <RadioGroupItem value={option.code} id={inputId} className="mt-0.5" />
                      <Label
                        htmlFor={inputId}
                        className="flex-1 space-y-1 cursor-pointer block"
                      >
                        <span className="text-sm font-medium text-foreground block">
                          {option.label}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          {option.code === 'PUBLIC' && '모든 사용자가 볼 수 있습니다.'}
                          {option.code === 'MEMBERS_ONLY' && '로그인한 회원만 볼 수 있습니다.'}
                        </span>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            )}
          />
        </div>

        {submitError && (
          <p className="text-destructive text-xs" role="alert">
            {submitError}
          </p>
        )}

        {/* 하단 버튼 */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 text-base"
            disabled={isSubmitting}
            onClick={() => router.back()}
          >
            취소
          </Button>
          <Button
            type="submit"
            className="flex-1 h-12 text-base bg-[#1E90FF] hover:bg-[#1C7ED6]"
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중…' : '답변 등록'}
          </Button>
        </div>
      </form>
    </>
  );
}

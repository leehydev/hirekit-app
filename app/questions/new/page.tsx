'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider, Controller, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Search } from 'lucide-react';
import { CompanySearchModal } from '@/components/CompanySearchModal';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createCompany, createQuestion } from '@/lib/api';
import { toast } from 'sonner';
import type { CompanyResponse } from '@/lib/api';
import { useCodes } from '@/hooks/useCodes';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const schema = z.object({
  job: z.string().min(1, '직무를 선택해주세요'),
  content: z.string().min(1, '질문 내용을 입력해주세요'),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
});

type FormValues = z.infer<typeof schema>;

export default function QuestionNewPage() {
  const router = useRouter();
  const { isLoading: isAuthLoading } = useRequireAuth();
  const { data: codesData } = useCodes();
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyResponse | null>(null);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdQuestionId, setCreatedQuestionId] = useState<string | null>(null);
  const [answerConfirmOpen, setAnswerConfirmOpen] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      job: '',
      content: '',
      visibility: 'PUBLIC',
    },
  });

  const jobCodes = codesData?.find((g) => g.type === 'Job')?.codes ?? [];
  const visibilityCodes = codesData?.find((g) => g.type === 'QuestionVisibility')?.codes ?? [];

  const handleSelectCompany = useCallback((company: CompanyResponse) => {
    setSelectedCompany(company);
    setCompanyError(null);
  }, []);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setCompanyError(null);
      setSubmitError(null);
      if (!selectedCompany) {
        setCompanyError('회사를 선택해주세요.');
        return;
      }

      setIsSubmitting(true);
      try {
        let companyId: string;
        if (selectedCompany.id) {
          companyId = selectedCompany.id;
        } else {
          const created = await createCompany({
            name: selectedCompany.name,
            industry: selectedCompany.industry ?? '',
            ceoName: selectedCompany.ceoName ?? '',
            address: selectedCompany.address ?? '',
            foundedDate: selectedCompany.foundedDate ?? null,
            businessNumber: selectedCompany.businessNumber ?? '',
          });
          if (!created.id) throw new Error('회사 등록 후 ID를 받지 못했습니다.');
          companyId = created.id;
        }

        const question = await createQuestion({
          companyId,
          job: values.job,
          content: values.content,
          visibility: values.visibility,
        });
        const id =
          (question as { id?: string; data?: { id?: string } } | null)?.id ??
          (question as { data?: { id?: string } } | null)?.data?.id;
        if (id) {
          setCreatedQuestionId(id);
          setAnswerConfirmOpen(true);
        } else {
          toast.success('질문이 등록되었습니다.');
          router.replace('/feed');
        }
      } catch (e) {
        setSubmitError(e instanceof Error ? e.message : '저장 중 오류가 발생했습니다.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedCompany],
  );

  const goToAnswerPage = useCallback(() => {
    if (createdQuestionId) {
      setAnswerConfirmOpen(false);
      router.replace(`/questions/${createdQuestionId}/answers/new`);
    }
  }, [createdQuestionId, router]);

  const closeAnswerConfirm = useCallback(() => {
    setAnswerConfirmOpen(false);
    if (createdQuestionId) {
      router.replace(`/questions/${createdQuestionId}`);
    }
  }, [createdQuestionId, router]);

  if (isAuthLoading) {
    return <p className="py-12 text-center text-sm text-muted-foreground">로딩 중…</p>;
  }

  const contentValue = methods.watch('content') || '';
  const contentLength = contentValue.length;

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
        <h1 className="text-lg font-semibold">면접 질문 기록</h1>
        <Button
          type="button"
          variant="ghost"
          onClick={methods.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="text-[#1E90FF] hover:text-[#1C7ED6] h-auto px-2 py-1"
        >
          등록
        </Button>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="px-5 py-6 space-y-6">
          {/* Company */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium block">Company</label>
            <button
              type="button"
              onClick={() => setCompanyModalOpen(true)}
              className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-input/30 px-4 py-3 text-left text-sm transition-colors hover:bg-input/50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <span className={selectedCompany ? 'text-foreground' : 'text-muted-foreground'}>
                {selectedCompany ? selectedCompany.name : '회사를 검색하세요.'}
              </span>
              <Search className="size-5 text-muted-foreground" />
            </button>
            {companyError && (
              <p className="text-destructive text-xs" role="alert">
                {companyError}
              </p>
            )}
          </div>

          {/* Job Position */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium block">직무</label>
            <ControllerSelect
              control={methods.control}
              name="job"
              placeholder="직무를 선택하세요."
              options={jobCodes}
            />
            {methods.formState.errors.job?.message && (
              <p className="text-destructive text-xs mt-1" role="alert">
                {methods.formState.errors.job.message}
              </p>
            )}
          </div>

          {/* Question */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-foreground text-sm font-medium">질문 내용</label>
              <span className="text-xs text-muted-foreground">{contentLength} / 5000</span>
            </div>
            <Controller
              name="content"
              control={methods.control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="면접에서 들은 질문을 자세히 입력해주세요."
                  rows={10}
                  maxLength={5000}
                  className="w-full rounded-lg border border-input bg-input/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
                  value={field.value ?? ''}
                />
              )}
            />
            {methods.formState.errors.content?.message && (
              <p className="text-destructive text-xs" role="alert">
                {methods.formState.errors.content.message}
              </p>
            )}
          </div>

          {/* Visibility Settings */}
          <div className="space-y-3">
            <label className="text-foreground text-sm font-medium block">공개 범위</label>
            <Controller
              name="visibility"
              control={methods.control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="space-y-1"
                >
                  {visibilityCodes.map((option) => {
                    const inputId = `question-visibility-${option.code}`;
                    return (
                      <div
                        key={option.code}
                        className="flex items-start gap-3 rounded-lg border border-input bg-transparent p-4 transition-colors hover:bg-input/20"
                      >
                        <RadioGroupItem value={option.code} id={inputId} className="mt-0.5" />
                        <Label htmlFor={inputId} className="flex-1 space-y-1 cursor-pointer block">
                          <span className="text-sm font-medium text-foreground block">
                            {option.label}
                          </span>
                          <span className="text-xs text-muted-foreground block">
                            {option.code === 'PUBLIC' && '모든 사용자가 볼 수 있습니다.'}
                            {option.code === 'PRIVATE' && '나만 볼 수 있습니다.'}
                          </span>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            />
            {methods.watch('visibility') === 'PRIVATE' && (
              <p className="text-xs text-muted-foreground">
                비공개글은 마이페이지에서 조회 및 관리가 가능합니다.
              </p>
            )}
          </div>

          {submitError && (
            <p className="text-destructive text-xs" role="alert">
              {submitError}
            </p>
          )}

          {/* Action Buttons */}
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
              {isSubmitting ? '등록 중…' : '질문 등록'}
            </Button>
          </div>
        </form>
      </FormProvider>

      <CompanySearchModal
        open={companyModalOpen}
        onOpenChange={setCompanyModalOpen}
        onSelect={handleSelectCompany}
        title="회사 검색"
        description="법인명(기업명)을 입력하면 검색합니다."
      />

      <Dialog open={answerConfirmOpen} onOpenChange={setAnswerConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>답변 등록</DialogTitle>
            <DialogDescription>답변을 바로 등록하시겠습니까?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeAnswerConfirm}>
              나중에
            </Button>
            <Button type="button" onClick={goToAnswerPage}>
              답변 등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ControllerSelect({
  control,
  name,
  placeholder,
  options,
}: {
  control: Control<FormValues>;
  name: 'job' | 'visibility';
  placeholder: string;
  options: { code: string; label: string }[];
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="h-11 w-full rounded-lg bg-input/30 border-input hover:bg-input/50">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.code} value={opt.code}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

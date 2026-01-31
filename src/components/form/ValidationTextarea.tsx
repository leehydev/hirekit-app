'use client';

import { forwardRef } from 'react';
import {
  useFormContext,
  Controller,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '@/lib/utils';

export interface ValidationTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<React.ComponentProps<'textarea'>, 'name'> {
  /** react-hook-form 필드 이름 */
  name: FieldPath<TFieldValues>;
  /** 라벨 텍스트 */
  label?: string;
  /** 설명 텍스트 */
  description?: string;
  /** 필수 필드 여부 (라벨에 "(필수)" 표시) */
  required?: boolean;
  /** 라벨 숨김 여부 (스크린 리더용) */
  hideLabel?: boolean;
  /** 필드 방향 */
  orientation?: 'vertical' | 'horizontal' | 'responsive';
  /** 컨테이너 className */
  containerClassName?: string;
}

const textareaBaseClass =
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-[80px] w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';

function ValidationTextareaInner<
  TFieldValues extends FieldValues = FieldValues,
>(
  {
    name,
    label,
    description,
    required = false,
    hideLabel = false,
    orientation = 'vertical',
    containerClassName,
    className,
    disabled,
    ...props
  }: ValidationTextareaProps<TFieldValues>,
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const fieldError = name.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, errors);

  const error = fieldError as { message?: string } | undefined;
  const hasError = !!error?.message;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div
          data-invalid={hasError}
          data-disabled={disabled}
          className={cn(
            'space-y-1.5',
            orientation === 'horizontal' &&
              'flex flex-wrap items-baseline gap-x-3 gap-y-1.5',
            orientation === 'responsive' &&
              'flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-x-3',
            containerClassName,
          )}
        >
          {label && (
            <label
              htmlFor={name}
              className={cn(
                'text-foreground text-sm font-medium',
                hideLabel && 'sr-only',
                orientation === 'horizontal' && 'shrink-0',
              )}
            >
              {label}
              {required && (
                <span className="text-red-500 dark:text-red-300 text-xs font-normal">
                  (필수)
                </span>
              )}
            </label>
          )}
          <div className="flex min-w-0 flex-col gap-1.5">
            <textarea
              {...props}
              {...field}
              ref={ref}
              id={name}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={
                hasError
                  ? `${name}-error`
                  : description
                    ? `${name}-description`
                    : undefined
              }
              className={cn(textareaBaseClass, className)}
              value={field.value ?? ''}
              onChange={(e) => {
                field.onChange(e);
                props.onChange?.(e);
              }}
              onBlur={(e) => {
                field.onBlur();
                props.onBlur?.(e);
              }}
            />
            {description && !hasError && (
              <p
                id={`${name}-description`}
                className="text-muted-foreground text-xs"
              >
                {description}
              </p>
            )}
            {hasError && (
              <p
                id={`${name}-error`}
                className="text-destructive text-xs"
                role="alert"
              >
                {error.message}
              </p>
            )}
          </div>
        </div>
      )}
    />
  );
}

export const ValidationTextarea = forwardRef(
  ValidationTextareaInner,
) as <TFieldValues extends FieldValues = FieldValues>(
  props: ValidationTextareaProps<TFieldValues> & {
    ref?: React.ForwardedRef<HTMLTextAreaElement>;
  },
) => React.ReactElement;

'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCodes, codeKeys, type CodeGroupResponse } from '@/lib/api/codes';

const STALE_TIME_MS = 10 * 60 * 1000; // 10분 — 코드는 거의 변경되지 않음

/**
 * 코드 그룹 전체 조회 (React Query)
 * Job, PassStatus, AnswerVisibility, QuestionVisibility, SocialProvider, MemberStatus
 *
 * - getLabel(type, code): 해당 그룹에서 code의 라벨 반환, 없으면 code 그대로 반환
 */
export function useCodes() {
  const query = useQuery({
    queryKey: codeKeys.all,
    queryFn: getCodes,
    staleTime: STALE_TIME_MS,
  });

  const getLabel = useMemo(() => {
    const groups = query.data ?? [];
    return (type: string, code: string): string => {
      const group = groups.find((g: CodeGroupResponse) => g.type === type);
      const item = group?.codes.find((c) => c.code === code);
      return item?.label ?? code;
    };
  }, [query.data]);

  return { ...query, getLabel };
}

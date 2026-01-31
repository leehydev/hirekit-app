import { fetchApi } from './client';

/**
 * 코드 한 건 (백엔드 CodeItem과 동일)
 * @see kr.hirekit.api.common.dto.CodeItem
 */
export interface CodeItem {
  code: string;
  label: string;
}

/**
 * 코드 그룹 응답 (백엔드 CodeGroupResponse와 동일)
 * type: Job | PassStatus | AnswerVisibility | QuestionVisibility | SocialProvider | MemberStatus
 * @see kr.hirekit.api.common.dto.CodeGroupResponse
 */
export interface CodeGroupResponse {
  type: string;
  codes: CodeItem[];
}

/**
 * 코드 그룹 전체 조회
 * @see GET /api/codes
 * @see CodesController.getCodes
 */
export async function getCodes(): Promise<CodeGroupResponse[]> {
  return fetchApi<CodeGroupResponse[]>('/api/codes');
}

export const codeKeys = {
  all: ['codes'] as const,
};

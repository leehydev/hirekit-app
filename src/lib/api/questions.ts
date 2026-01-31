import { API_URL } from './constants';
import { fetchApi } from './client';

/** 질문 공개 범위 (코드 Job 아님) */
export type QuestionVisibility = 'PUBLIC' | 'PRIVATE';

export interface CreateQuestionRequest {
  companyId: string;
  job: string;
  content: string;
  visibility?: QuestionVisibility;
}

export interface QuestionDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  companyName: string;
  job: string;
  content: string;
  visibility?: QuestionVisibility;
  authorHidden: boolean;
  authorId: string;
  authorName?: string;
}

export interface UpdateQuestionRequest {
  job: string;
  content: string;
  visibility: QuestionVisibility;
  authorHidden: boolean;
}

export interface Answer {
  id: string;
  createdAt: string;
  content: string;
  tip: string | null;
  likeCount: number;
  passStatus: 'PASS' | 'FAIL' | null;
  interviewDate: string | null;
  authorHidden: boolean;
  authorId: string;
  authorName?: string;
  isLikedByMe?: boolean;
  visibility: 'PUBLIC' | 'MEMBERS_ONLY';
}

/** 답변 등록 요청 (백엔드 AnswerCreateRequest와 동일) */
export interface CreateAnswerRequest {
  content: string;
  tip?: string;
  passStatus?: 'PASS' | 'FAIL';
  interviewDate?: string; // YYYY-MM-DD
  visibility?: 'PUBLIC' | 'MEMBERS_ONLY';
}

/** 답변 수정 요청 (content, tip, passStatus, interviewDate, visibility) */
export interface AnswerUpdateRequest {
  content: string;
  tip?: string;
  passStatus?: 'PASS' | 'FAIL';
  interviewDate?: string; // YYYY-MM-DD
  visibility?: 'PUBLIC' | 'MEMBERS_ONLY' | 'PRIVATE';
}

/** 답변 공개상태 변경 요청 */
export interface AnswerVisibilityUpdateRequest {
  visibility: 'PUBLIC' | 'MEMBERS_ONLY';
}

export interface GetAnswersParams {
  questionId: string;
  cursor?: string;
  size?: number;
  sortBy?: 'latest' | 'most-liked';
}

export interface CursorAnswersResponse {
  items: Answer[];
  nextCursor: string | null;
}

/**
 * 질문 등록
 * @see POST /api/questions
 */
export async function createQuestion(body: CreateQuestionRequest): Promise<QuestionDetail> {
  return fetchApi<QuestionDetail>('/api/questions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * 질문 상세 조회
 * @see GET /api/questions/:id
 */
export async function getQuestionDetail(id: string): Promise<QuestionDetail> {
  return fetchApi<QuestionDetail>(`/api/questions/${id}`);
}

/**
 * 질문 수정
 * @see PUT /api/questions/:id
 */
export async function updateQuestion(
  id: string,
  body: UpdateQuestionRequest,
): Promise<QuestionDetail> {
  return fetchApi<QuestionDetail>(`/api/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * 질문 삭제
 * @see DELETE /api/questions/:id
 */
export async function deleteQuestion(id: string): Promise<void> {
  return fetchApi<void>(`/api/questions/${id}`, { method: 'DELETE' });
}

/**
 * 질문 공개상태 변경
 * @see PATCH /api/questions/:id/visibility
 */
export async function patchQuestionVisibility(
  id: string,
  visibility: QuestionVisibility,
): Promise<QuestionDetail> {
  return fetchApi<QuestionDetail>(`/api/questions/${id}/visibility`, {
    method: 'PATCH',
    body: JSON.stringify({ visibility }),
  });
}

/**
 * 답변 등록
 * @see POST /api/questions/:questionId/answers
 */
export async function createAnswer(questionId: string, body: CreateAnswerRequest): Promise<Answer> {
  return fetchApi<Answer>(`/api/questions/${questionId}/answers`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * 답변 목록 조회 (커서 기반 무한스크롤)
 * @see GET /api/questions/:id/answers
 */
export async function getAnswers(params: GetAnswersParams): Promise<CursorAnswersResponse> {
  const { questionId, ...rest } = params;
  const search = new URLSearchParams();
  if (rest.cursor) search.set('cursor', rest.cursor);
  if (rest.size != null) search.set('size', String(rest.size));
  if (rest.sortBy) search.set('sortBy', rest.sortBy);
  const query = search.toString();
  return fetchApi<CursorAnswersResponse>(
    `/api/questions/${questionId}/answers${query ? `?${query}` : ''}`,
  );
}

/**
 * 답변 단건 조회
 * @see GET /api/questions/:questionId/answers/:answerId
 */
export async function getAnswerDetail(questionId: string, answerId: string): Promise<Answer> {
  return fetchApi<Answer>(`/api/questions/${questionId}/answers/${answerId}`);
}

/**
 * 답변 수정 (본인 답변만 가능, 403)
 * @see PUT /api/questions/:questionId/answers/:answerId
 */
export async function updateAnswer(
  questionId: string,
  answerId: string,
  body: AnswerUpdateRequest,
): Promise<Answer> {
  return fetchApi<Answer>(`/api/questions/${questionId}/answers/${answerId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * 답변 삭제 (본인 답변만 가능, 403)
 * @see DELETE /api/questions/:questionId/answers/:answerId
 */
export async function deleteAnswer(questionId: string, answerId: string): Promise<void> {
  return fetchApi<void>(`/api/questions/${questionId}/answers/${answerId}`, { method: 'DELETE' });
}

/**
 * 답변 공개상태 변경 (본인 답변만 가능, 403)
 * @see PATCH /api/questions/:questionId/answers/:answerId/visibility
 */
export async function patchAnswerVisibility(
  questionId: string,
  answerId: string,
  visibility: 'PUBLIC' | 'MEMBERS_ONLY',
): Promise<Answer> {
  return fetchApi<Answer>(`/api/questions/${questionId}/answers/${answerId}/visibility`, {
    method: 'PATCH',
    body: JSON.stringify({ visibility }),
  });
}

/**
 * 답변 좋아요 토글
 * @see POST /api/questions/:questionId/answers/:answerId/like
 */
export async function toggleAnswerLike(questionId: string, answerId: string): Promise<void> {
  return fetchApi<void>(`/api/questions/${questionId}/answers/${answerId}/like`, {
    method: 'POST',
  });
}

/**
 * 회원전용 답변 중 현재 사용자가 볼 수 없는 개수
 * (비로그인 시 회원전용 답변 전체 개수)
 * 인증 없이 호출 가능하므로 401/에러 시 { count: 0 } 반환 (fetchApi 사용 안 함)
 * @see GET /api/questions/:id/answers/members-only-count
 */
export async function getMembersOnlyAnswerCount(questionId: string): Promise<{ count: number }> {
  try {
    const res = await fetch(`${API_URL}/api/questions/${questionId}/answers/members-only-count`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return { count: 0 };
    const data = (await res.json()) as { membersOnlyAnswerCount?: number };
    const count = data.membersOnlyAnswerCount ?? 0;
    return { count: Number(count) };
  } catch {
    return { count: 0 };
  }
}

export const questionKeys = {
  all: ['questions'] as const,
  detail: (id: string) => ['questions', 'detail', id] as const,
  answers: (id: string, sortBy?: string) => ['questions', id, 'answers', sortBy] as const,
  answerDetail: (questionId: string, answerId: string) =>
    ['questions', questionId, 'answers', 'detail', answerId] as const,
  membersOnlyCount: (questionId: string) =>
    ['questions', questionId, 'answers', 'members-only-count'] as const,
};

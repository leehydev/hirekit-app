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
  authorHidden: boolean;
  authorId: string;
  authorName?: string;
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
export async function createQuestion(
  body: CreateQuestionRequest
): Promise<QuestionDetail> {
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
 * 답변 목록 조회 (커서 기반 무한스크롤)
 * @see GET /api/questions/:id/answers
 */
export async function getAnswers(
  params: GetAnswersParams
): Promise<CursorAnswersResponse> {
  const { questionId, ...rest } = params;
  const search = new URLSearchParams();
  if (rest.cursor) search.set('cursor', rest.cursor);
  if (rest.size != null) search.set('size', String(rest.size));
  if (rest.sortBy) search.set('sortBy', rest.sortBy);
  const query = search.toString();
  return fetchApi<CursorAnswersResponse>(
    `/api/questions/${questionId}/answers${query ? `?${query}` : ''}`
  );
}

/**
 * 답변 좋아요 토글
 * @see POST /api/answers/:id/like
 */
export async function toggleAnswerLike(answerId: string): Promise<void> {
  return fetchApi<void>(`/api/answers/${answerId}/like`, {
    method: 'POST',
  });
}

export const questionKeys = {
  all: ['questions'] as const,
  detail: (id: string) => ['questions', 'detail', id] as const,
  answers: (id: string, sortBy?: string) =>
    ['questions', id, 'answers', sortBy] as const,
};

import { fetchApi } from './client';
import type { PageResponse } from './companies';
import type { CompanyResponse } from './companies';
import type { QuestionDetail } from './questions';
import type { Answer } from './questions';

export type SearchSortBy = 'latest' | 'relevance' | 'popular';
export type SortDirection = 'asc' | 'desc';

export interface SearchCompaniesParams {
  keyword: string;
  industry?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export interface SearchQuestionsParams {
  keyword: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export interface SearchAnswersParams {
  keyword: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}

/** 답변 검색 결과 (질문 정보 포함 가능) */
export interface AnswerDetailResponse extends Answer {
  questionId?: string;
  questionContent?: string;
}

/**
 * 회사 검색 (내부 DB)
 * @see GET /api/companies/search
 */
export async function searchCompanies(
  params: SearchCompaniesParams
): Promise<PageResponse<CompanyResponse>> {
  const { keyword, industry, page = 0, size = 20, sortBy, sortDirection } = params;
  const searchParams = new URLSearchParams();
  searchParams.set('keyword', keyword);
  if (industry) searchParams.set('industry', industry);
  searchParams.set('page', String(page));
  searchParams.set('size', String(size));
  if (sortBy) searchParams.set('sortBy', sortBy);
  if (sortDirection) searchParams.set('sortDirection', sortDirection);
  return fetchApi<PageResponse<CompanyResponse>>(
    `/api/companies/search?${searchParams.toString()}`
  );
}

/**
 * 질문 검색
 * @see GET /api/questions/search
 */
export async function searchQuestions(
  params: SearchQuestionsParams
): Promise<PageResponse<QuestionDetail>> {
  const { keyword, page = 0, size = 20, sortBy, sortDirection } = params;
  const searchParams = new URLSearchParams();
  searchParams.set('keyword', keyword);
  searchParams.set('page', String(page));
  searchParams.set('size', String(size));
  if (sortBy) searchParams.set('sortBy', sortBy);
  if (sortDirection) searchParams.set('sortDirection', sortDirection);
  return fetchApi<PageResponse<QuestionDetail>>(
    `/api/questions/search?${searchParams.toString()}`
  );
}

/**
 * 답변 검색
 * @see GET /api/questions/answers/search
 */
export async function searchAnswers(
  params: SearchAnswersParams
): Promise<PageResponse<AnswerDetailResponse>> {
  const { keyword, page = 0, size = 20, sortBy, sortDirection } = params;
  const searchParams = new URLSearchParams();
  searchParams.set('keyword', keyword);
  searchParams.set('page', String(page));
  searchParams.set('size', String(size));
  if (sortBy) searchParams.set('sortBy', sortBy);
  if (sortDirection) searchParams.set('sortDirection', sortDirection);
  return fetchApi<PageResponse<AnswerDetailResponse>>(
    `/api/questions/answers/search?${searchParams.toString()}`
  );
}

export const searchKeys = {
  companies: (params: SearchCompaniesParams) => ['search', 'companies', params] as const,
  questions: (params: SearchQuestionsParams) => ['search', 'questions', params] as const,
  answers: (params: SearchAnswersParams) => ['search', 'answers', params] as const,
};

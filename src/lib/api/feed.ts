import { fetchApi } from './client';

export interface FeedQuestionSummary {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  companyName: string;
  job: string;
  content: string;
  authorHidden: boolean;
  authorId: string;
}

export interface FeedAnswerSummary {
  id: string;
  createdAt: string;
  content: string;
  tip: string | null;
  likeCount: number;
  passStatus: string | null;
  interviewDate: string | null;
  authorHidden: boolean;
  authorId: string;
}

export interface FeedAnswerCounts {
  totalAnswerCount: number;
  publicAnswerCount: number;
  membersOnlyAnswerCount: number;
}

export interface FeedItemResponse {
  question: FeedQuestionSummary;
  representativeAnswer: FeedAnswerSummary | null;
  answerCounts: FeedAnswerCounts;
}

export interface CursorFeedResponse {
  items: FeedItemResponse[];
  nextCursor: string | null;
}

export interface GetFeedParams {
  companyId?: string;
  job?: string;
  cursor?: string;
  size?: number;
}

/**
 * 피드 목록 조회 (커서 기반 무한스크롤)
 * @see GET /api/feed
 */
export async function getFeed(
  params: GetFeedParams = {}
): Promise<CursorFeedResponse> {
  const search = new URLSearchParams();
  if (params.companyId) search.set('companyId', params.companyId);
  if (params.job) search.set('job', params.job);
  if (params.cursor) search.set('cursor', params.cursor);
  if (params.size != null) search.set('size', String(params.size));
  const query = search.toString();
  return fetchApi<CursorFeedResponse>(
    `/api/feed${query ? `?${query}` : ''}`
  );
}

export const feedKeys = {
  all: ['feed'] as const,
  list: (params: GetFeedParams) => ['feed', 'list', params] as const,
};

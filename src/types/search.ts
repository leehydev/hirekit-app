export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface SearchQuestion {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  answerCount: number;
  viewCount: number;
  /** 질문 상세 링크용 (API QuestionDetail 매핑 시 job, companyName 등) */
  job?: string;
  companyName?: string;
}

export interface SearchParams {
  query: string;
  type: 'questions' | 'answers' | 'companies';
}

/** URL 검색 쿼리 키 */
export const SEARCH_QUERY_KEY = 'q';

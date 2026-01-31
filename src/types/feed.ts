export type QuestionStatus = 'passed' | 'failed' | null;
export type TagVariant = 'major' | 'category' | 'company';
export type SortBy = 'latest' | 'most-answers';

export interface Tag {
  id: string;
  label: string;
  variant: TagVariant;
}

export interface Question {
  id: string;
  title: string;
  tags: Tag[];
  author: string;
  timestamp: string;
  status: QuestionStatus;
  tipPreview: string;
  quotePreview?: string;
  answerCount: number;
}

export interface QuestionsParams {
  company?: string;
  role?: string;
  sortBy?: SortBy;
  page?: number;
  limit?: number;
}

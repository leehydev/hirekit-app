import { fetchApi } from './client';

/**
 * 백엔드 CompanyResponse (기업 개요) 타입
 */
export interface CompanyResponse {
  id: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  name: string;
  industry: string;
  ceoName: string;
  address: string;
  foundedDate: string | null;
  businessNumber: string;
  registeredById: string | null;
}

/**
 * Spring Data Page 응답 타입
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * 법인명으로 기업 목록 검색 (공공데이터 기업개요 API 연동)
 * @param name 검색할 법인명(기업명)
 */
export async function searchCompanies(
  name: string
): Promise<PageResponse<CompanyResponse>> {
  const encoded = encodeURIComponent(name);
  return fetchApi<PageResponse<CompanyResponse>>(
    `/api/companies?name=${encoded}`
  );
}

export const companyKeys = {
  search: (name: string) => ['companies', 'search', name] as const,
};

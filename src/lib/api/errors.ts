/**
 * 백엔드 API 에러 응답 형식
 * @example
 * { "success": false, "code": "QUESTION_NOT_FOUND", "message": "질문을 찾을 수 없습니다.", "errors": [] }
 */
export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  errors: unknown[];
}

/** 에러 코드별 대고객 안내 메시지 */
export const API_ERROR_MESSAGES: Record<string, string> = {
  BAD_REQUEST: '잘못된 요청이에요. 다시 시도해 주세요.',
  VALIDATION_ERROR: '입력값을 확인해 주세요.',
  UNAUTHORIZED: '로그인이 필요해요.',
  FORBIDDEN: '접근 권한이 없어요.',
  NOT_FOUND: '요청한 내용을 찾을 수 없어요.',
  CONFLICT: '이미 존재하는 데이터예요.',
  COMPANY_NOT_FOUND: '기업 정보를 찾을 수 없어요.',
  MEMBER_NOT_FOUND: '회원 정보를 찾을 수 없어요.',
  QUESTION_NOT_FOUND: '질문을 찾을 수 없어요.',
  QUESTION_HAS_ANSWERS:
    '답변이 달려 있어 수정·삭제·공개 설정을 변경할 수 없어요.',
  ANSWER_NOT_FOUND: '답변을 찾을 수 없어요.',
  INTERNAL_SERVER_ERROR: '일시적인 오류가 났어요. 잠시 후 다시 시도해 주세요.',
};

const DEFAULT_MESSAGE = '오류가 발생했어요. 잠시 후 다시 시도해 주세요.';

/**
 * API 에러 응답 본문에서 대고객 노출용 메시지를 반환합니다.
 * code에 해당하는 메시지가 있으면 사용하고, 없으면 백엔드 message 또는 기본 메시지를 씁니다.
 */
export function getApiErrorMessage(
  body: Partial<ApiErrorResponse> | null,
  fallback = DEFAULT_MESSAGE
): string {
  if (!body?.code) return fallback;
  return API_ERROR_MESSAGES[body.code] ?? body.message ?? fallback;
}

/** API 에러 (code 포함, 기존 Error 호환) */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string | undefined
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

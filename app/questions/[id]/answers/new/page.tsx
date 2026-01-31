'use client';

import { useParams } from 'next/navigation';

/**
 * 답변 등록 페이지 (껍데기)
 * 질문 ID에 대한 답변을 등록하는 페이지. 내용물은 추후 구현.
 */
export default function AnswerNewPage() {
  const params = useParams();
  const questionId = params.id as string;

  return (
    <div>
      <p>답변 등록 (질문 ID: {questionId})</p>
    </div>
  );
}

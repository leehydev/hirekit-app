import type { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://hirekit.kr';
const SITE_NAME = 'HireKit';

interface QuestionDetail {
  id: string;
  content: string;
  companyName: string;
  job: string;
}

async function fetchQuestionForMetadata(questionId: string): Promise<QuestionDetail | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/questions/${questionId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const question = await fetchQuestionForMetadata(id);

  if (!question) {
    return {
      title: '질문',
      description: '면접 질문을 확인해보세요.',
    };
  }

  const title = truncate(question.content, 60);
  const descriptionParts = [question.companyName, question.job, truncate(question.content, 120)];
  const description = descriptionParts.filter(Boolean).join(' · ');

  const canonicalUrl = `${APP_URL}/questions/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: 'article',
      url: canonicalUrl,
      locale: 'ko_KR',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default function QuestionDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

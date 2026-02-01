import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import './globals.css';

const siteName = 'HireKit';
const siteDescription =
  '면접에서 나온 질문을 공유하고, 다른 사람의 답변을 참고할 수 있는 면접 질문 공유 서비스입니다.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://hirekit.kr'),
  title: {
    default: `${siteName} - 면접 질문 공유`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: ['면접', '면접 질문', '취업', '이직', '기술 면접', 'HireKit'],
  authors: [{ name: siteName }],
  creator: siteName,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName,
    title: `${siteName} - 면접 질문 공유`,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - 면접 질문 공유`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="antialiased">
        <div className="mx-auto max-w-[430px] min-h-screen bg-background">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}

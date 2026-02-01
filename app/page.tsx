import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Shield,
  Users,
  TrendingUp,
  Building2,
  Lock,
  CheckSquare,
  Smartphone,
  FileText,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-16 pb-20">
        <div className="absolute inset-0 bg-linear-to-br from-landing-gradient-from via-landing-primary to-landing-gradient-to opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-landing-primary opacity-20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-landing-navy opacity-20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-md">
          <div className="mb-6 flex justify-center">
            <Badge className="bg-landing-primary text-white px-4 py-1.5 text-sm">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              면접 준비의 새로운 기준
            </Badge>
          </div>

          <h1 className="heading-font mb-6 text-center text-4xl font-bold leading-tight tracking-tight">
            면접 준비,
            <br />
            <span className="bg-linear-to-r from-landing-primary to-landing-navy bg-clip-text text-transparent">
              혼자 막막하셨죠?
            </span>
          </h1>

          <p className="body-font mb-8 text-center text-base leading-relaxed text-muted-foreground">
            실제 면접 경험을 공유하고, 다른 사람들의 생생한 면접 후기로 완벽하게 준비하세요.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="heading-font w-full bg-kakao-yellow text-kakao-text hover:bg-kakao-yellow/90 text-base font-semibold"
              asChild
            >
              <Link href="/login" className="inline-flex items-center justify-center gap-2">
                <Image src="/icons/icon-kakao.png" alt="Kakao" width={24} height={24} />
                카카오로 시작하기
              </Link>
            </Button>
            <p className="body-font text-center text-xs text-muted-foreground">
              회원가입 없이 간편하게 시작하세요
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="mx-auto max-w-md">
          <h2 className="heading-font mb-10 text-center text-2xl font-bold">
            이런 경험 있으신가요?
          </h2>

          <div className="space-y-4">
            {[
              { emoji: '😰', text: '"이 회사 면접 어떻게 준비하지...?"' },
              { emoji: '🤔', text: '"실제로 어떤 질문이 나올까?"' },
              { emoji: '😓', text: '"합격한 사람들은 뭐라고 답했을까?"' },
              { emoji: '📱', text: '"출퇴근 시간에 빠르게 확인하고 싶은데..."' },
            ].map((item, idx) => (
              <Card key={idx} className="border-border/50 shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <span className="text-3xl">{item.emoji}</span>
                  <p className="body-font text-sm leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-md">
          <h2 className="heading-font mb-3 text-center text-2xl font-bold">
            Hirekit이 도와드릴게요
          </h2>
          <p className="body-font mb-10 text-center text-sm text-muted-foreground">
            면접 준비의 모든 것을 한 곳에서
          </p>

          <div className="space-y-6">
            {[
              {
                number: '1',
                title: '실제 면접 질문 & 답변',
                description:
                  '현직자들이 직접 공유한 진짜 면접 경험\n회사별, 직무별로 정리된 면접 정보',
                icon: Users,
              },
              {
                number: '2',
                title: '기여 기반 커뮤니티',
                description:
                  '나의 면접 경험 1개 공유 → 모든 면접 정보 열람\n양질의 정보만 모이는 선순환 구조',
                icon: TrendingUp,
              },
              {
                number: '3',
                title: '나만의 포트폴리오',
                description:
                  '면접 경험을 모아 개인 페이지 생성\n이직 시 나의 전문성을 어필하는 도구로 활용',
                icon: FileText,
              },
            ].map((item, idx) => (
              <Card key={idx} className="border-border/50 shadow-md">
                <CardHeader className="pb-3">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-landing-primary text-white">
                      <span className="heading-font text-lg font-bold">{item.number}</span>
                    </div>
                    <item.icon className="h-5 w-5 text-landing-primary" />
                  </div>
                  <CardTitle className="heading-font text-lg font-semibold">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="body-font whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="mx-auto max-w-md">
          <h2 className="heading-font mb-3 text-center text-2xl font-bold">핵심 기능</h2>
          <p className="body-font mb-10 text-center text-sm text-muted-foreground">
            Hirekit만의 특별한 기능들
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: Building2,
                title: '회사별 면접 정보',
                description: '원하는 회사의 면접 질문과 답변을 한눈에',
              },
              {
                icon: Lock,
                title: '익명 보장',
                description: '회사명은 공개, 작성자는 익명으로 안전하게',
              },
              {
                icon: CheckSquare,
                title: '품질 관리',
                description: '운영진 승인 시스템으로 검증된 정보만',
              },
              {
                icon: Smartphone,
                title: '모바일 최적화',
                description: '출퇴근길, 점심시간에 빠르게 확인',
              },
              {
                icon: FileText,
                title: '개인 페이지',
                description: '나의 면접 경험을 정리한 포트폴리오',
              },
              {
                icon: Users,
                title: '커뮤니티',
                description: '경험을 공유하고 함께 성장하세요',
              },
            ].map((item, idx) => (
              <Card key={idx} className="border-border/50 shadow-sm">
                <CardContent className="p-5">
                  <item.icon className="mb-3 h-8 w-8 text-landing-primary" />
                  <h3 className="heading-font mb-2 text-sm font-semibold">{item.title}</h3>
                  <p className="body-font text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-md">
          <h2 className="heading-font mb-3 text-center text-2xl font-bold">3단계로 시작하세요</h2>
          <p className="body-font mb-10 text-center text-sm text-muted-foreground">
            간단하고 빠르게 시작할 수 있어요
          </p>

          <div className="relative space-y-8">
            {/* Connecting line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-linear-to-b from-landing-primary to-landing-navy opacity-30" />

            {[
              {
                step: '1',
                title: '로그인',
                description: '카카오로 간편하게',
              },
              {
                step: '2',
                title: '경험 공유',
                description: '나의 면접 Q&A 1개',
              },
              {
                step: '3',
                title: '정보 열람',
                description: '무제한 면접 정보',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-landing-primary text-white shadow-lg">
                  <span className="heading-font text-lg font-bold">{item.step}</span>
                </div>
                <div className="pt-1.5">
                  <h3 className="heading-font mb-1 text-base font-semibold">{item.title}</h3>
                  <p className="body-font text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="mx-auto max-w-md">
          <h2 className="heading-font mb-10 text-center text-2xl font-bold">왜 Hirekit인가요?</h2>

          <div className="space-y-4">
            {[
              {
                icon: TrendingUp,
                title: '기여 기반 모델',
                description: '정보를 받으려면 먼저 기여, 양질의 콘텐츠 보장',
              },
              {
                icon: Shield,
                title: '운영진 검수',
                description: '허위/부적절한 정보 차단',
              },
              {
                icon: Lock,
                title: '프라이버시 보호',
                description: '익명으로 안심하고 공유',
              },
              {
                icon: CheckCircle2,
                title: '실시간 업데이트',
                description: '최신 면접 트렌드와 질문 지속 반영',
              },
            ].map((item, idx) => (
              <Card key={idx} className="border-border/50 shadow-sm">
                <CardContent className="flex items-start gap-4 p-5">
                  <item.icon className="mt-0.5 h-6 w-6 shrink-0 text-landing-primary" />
                  <div>
                    <h3 className="heading-font mb-1 text-sm font-semibold">{item.title}</h3>
                    <p className="body-font text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-md">
          <h2 className="heading-font mb-10 text-center text-2xl font-bold">
            이런 분들께 추천해요
          </h2>

          <div className="space-y-4">
            {[
              {
                emoji: '👩‍💼',
                title: '이직 준비 중인 직장인',
                description: '"다음 회사 면접, 제대로 준비하고 싶어요"',
              },
              {
                emoji: '👨‍🎓',
                title: '취업 준비생',
                description: '"실제 면접이 어떻게 진행되는지 알고 싶어요"',
              },
              {
                emoji: '🧑‍💻',
                title: '경력직 전환 희망자',
                description: '"새로운 직무의 면접 질문이 궁금해요"',
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="border-border/50 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-3xl">{item.emoji}</span>
                    <h3 className="heading-font text-base font-semibold">{item.title}</h3>
                  </div>
                  <p className="body-font text-sm italic text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="mx-auto max-w-md">
          <h2 className="heading-font mb-10 text-center text-2xl font-bold">자주 묻는 질문</h2>

          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="item-1" className="border rounded-lg px-5 bg-card">
              <AccordionTrigger className="heading-font text-sm font-semibold hover:no-underline">
                정말 익명이 보장되나요?
              </AccordionTrigger>
              <AccordionContent className="body-font text-sm text-muted-foreground leading-relaxed">
                네, 작성자 정보는 공개되지 않습니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-5 bg-card">
              <AccordionTrigger className="heading-font text-sm font-semibold hover:no-underline">
                어떤 정보를 공유해야 하나요?
              </AccordionTrigger>
              <AccordionContent className="body-font text-sm text-muted-foreground leading-relaxed">
                실제 경험한 면접 질문 1개와 본인의 답변(또는 모범 답변)을 작성해주시면 됩니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-5 bg-card">
              <AccordionTrigger className="heading-font text-sm font-semibold hover:no-underline">
                개인 페이지는 뭔가요?
              </AccordionTrigger>
              <AccordionContent className="body-font text-sm text-muted-foreground leading-relaxed">
                나의 면접 경험을 모아 공개할 수 있는 포트폴리오 페이지입니다. 선택적으로 공개 여부를
                설정할 수 있어요.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-5 bg-card">
              <AccordionTrigger className="heading-font text-sm font-semibold hover:no-underline">
                무료인가요?
              </AccordionTrigger>
              <AccordionContent className="body-font text-sm text-muted-foreground leading-relaxed">
                면접 경험 1개만 공유하시면 모든 정보를 이용할 수 있습니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 bg-linear-to-br from-landing-gradient-from via-landing-primary to-landing-gradient-to opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-landing-primary opacity-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-landing-navy opacity-20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-md text-center">
          <h2 className="heading-font mb-4 text-3xl font-bold">
            지금 바로
            <br />
            면접 준비를 시작하세요
          </h2>
          <p className="body-font mb-8 text-base leading-relaxed text-muted-foreground">
            면접 경험 하나로, 수백 개의 면접 정보를 얻으세요.
          </p>
          <Button
            size="lg"
            className="heading-font w-full max-w-xs bg-kakao-yellow text-kakao-text hover:bg-(--kakao-yellow)/90 text-base font-semibold"
            asChild
          >
            <Link href="/login" className="inline-flex items-center justify-center gap-2">
              <Image src="/icons/icon-kakao.png" alt="Kakao" width={24} height={24} />
              카카오로 시작하기
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 px-6 py-10">
        <div className="mx-auto max-w-md">
          {/* <div className="mb-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              서비스 소개
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/terms" className="hover:text-foreground transition-colors">
              이용약관
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              개인정보처리방침
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/contact" className="hover:text-foreground transition-colors">
              문의하기
            </Link>
          </div> */}
          <p className="body-font text-center text-xs text-muted-foreground">
            © 2026 Hirekit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

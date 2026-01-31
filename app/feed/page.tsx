'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { FeedHeader } from '@/components/Feed/FeedHeader';
import { QuestionCard } from '@/components/Feed/QuestionCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockQuestions } from '@/lib/mock-data/questions';
import { SortBy } from '@/types/feed';
import { useNavigationStore } from '@/store/navigation';

export default function FeedPage() {
  const setBottomNavVisible = useNavigationStore((s) => s.setBottomNavVisible);

  useEffect(() => {
    setBottomNavVisible(true);
  }, [setBottomNavVisible]);
  const [company, setCompany] = useState<string>('all');
  const [role, setRole] = useState<string>('dev');
  const [sortBy, setSortBy] = useState<SortBy>('latest');

  // Filter and sort questions based on selections
  const filteredQuestions = mockQuestions;

  return (
    <div className="min-h-screen bg-background pb-20">
      <FeedHeader />

      <div className="px-4 py-4 space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Company</SelectItem>
              <SelectItem value="major-it">Major IT</SelectItem>
              <SelectItem value="unicorn">Unicorn</SelectItem>
              <SelectItem value="startup">Startup</SelectItem>
            </SelectContent>
          </Select>

          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dev">Dev</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="pm">PM</SelectItem>
              <SelectItem value="data">Data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
          <TabsList variant="default" className="w-fit">
            <TabsTrigger value="latest">Latest</TabsTrigger>
            <TabsTrigger value="most-answers">Most Answers</TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="space-y-4 mt-4">
            {filteredQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </TabsContent>

          <TabsContent value="most-answers" className="space-y-4 mt-4">
            {[...filteredQuestions]
              .sort((a, b) => b.answerCount - a.answerCount)
              .map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed right-4 bottom-24 z-50 flex items-center gap-2 px-5 py-3 rounded-full font-medium text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
        style={{
          backgroundColor: 'var(--feed-accent-blue)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--feed-accent-blue-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--feed-accent-blue)';
        }}
        aria-label="Ask Question"
      >
        <Plus className="size-5" />
        <span>Ask Question</span>
      </button>
    </div>
  );
}

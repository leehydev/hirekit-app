'use client';

import { Suspense, useCallback, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { SearchHeader } from '@/components/Search';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SEARCH_QUERY_KEY } from '@/types/search';

function SearchResultLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get(SEARCH_QUERY_KEY) ?? '';
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);

  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  const getCurrentTab = useCallback(() => {
    if (pathname?.includes('/answers')) return 'answers';
    if (pathname?.includes('/companies')) return 'companies';
    return 'questions';
  }, [pathname]);

  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClear = () => {
    router.push('/search');
  };

  const handleSearchSubmit = (query: string) => {
    const params = new URLSearchParams({ [SEARCH_QUERY_KEY]: query });
    router.push(`/search/${getCurrentTab()}?${params.toString()}`);
  };

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    router.push(`/search/${value}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <SearchHeader
        query={searchQuery}
        onQueryChange={handleQueryChange}
        onClear={handleClear}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Tabs Navigation */}
      <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-full">
        <div className="border-b border-border/40">
          <TabsList variant="line" className="w-full justify-start px-4 gap-8 h-12">
            <TabsTrigger
              value="questions"
              className="data-[state=active]:after:bg-search-accent-blue data-[state=active]:text-search-accent-blue font-medium"
            >
              Questions
            </TabsTrigger>
            <TabsTrigger
              value="answers"
              className="data-[state=active]:after:bg-search-accent-blue data-[state=active]:text-search-accent-blue font-medium"
            >
              Answers
            </TabsTrigger>
            <TabsTrigger
              value="companies"
              className="data-[state=active]:after:bg-search-accent-blue data-[state=active]:text-search-accent-blue font-medium"
            >
              Companies
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content */}
        <TabsContent value={getCurrentTab()} className="mt-0">
          {children}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SearchResultLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SearchResultLayoutContent>{children}</SearchResultLayoutContent>
    </Suspense>
  );
}

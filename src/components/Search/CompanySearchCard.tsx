'use client';

import { Building2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { CompanyResponse } from '@/lib/api/companies';

interface CompanySearchCardProps {
  company: CompanyResponse;
}

export function CompanySearchCard({ company }: CompanySearchCardProps) {
  const href = company.id
    ? `/feed/company/${company.id}?${new URLSearchParams({ name: company.name }).toString()}`
    : null;

  const content = (
    <>
      <div className="shrink-0 w-12 h-12 rounded-lg bg-search-accent-blue/20 flex items-center justify-center">
        <Building2 className="size-6 text-search-accent-blue" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-foreground font-medium text-base leading-snug">
          {company.name}
        </h3>
        {company.industry && (
          <p className="text-muted-foreground text-sm mt-0.5">
            {company.industry}
          </p>
        )}
      </div>
      <ChevronRight className="shrink-0 size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center gap-4 px-4 py-4 hover:bg-secondary/30 transition-colors group"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4 px-4 py-4 hover:bg-secondary/30 transition-colors group">
      {content}
    </div>
  );
}

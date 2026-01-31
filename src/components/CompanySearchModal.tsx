'use client';

import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  searchCompanies,
  companyKeys,
  type CompanyResponse,
} from '@/lib/api/companies';
import { cn } from '@/lib/utils';

function formatDate(isoDate: string | null): string {
  if (!isoDate) return '-';
  const d = isoDate.slice(0, 10);
  if (d === '0000-00-00' || !d) return '-';
  return `${d.slice(0, 4)}.${d.slice(5, 7)}.${d.slice(8, 10)}`;
}

function formatBusinessNumber(bn: string): string {
  if (!bn || bn.length < 10) return bn ?? '-';
  return `${bn.slice(0, 3)}-${bn.slice(3, 5)}-${bn.slice(5, 10)}`;
}

export interface CompanySearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (company: CompanyResponse) => void;
  title?: string;
  description?: string;
}

export function CompanySearchModal({
  open,
  onOpenChange,
  onSelect,
  title = '사업자 검색',
  description = '법인명(기업명)을 입력하면 공공데이터 기업개요에서 검색합니다.',
}: CompanySearchModalProps) {
  const [keyword, setKeyword] = useState('');
  const [searchName, setSearchName] = useState('');

  const { data, isPending, isError, error } = useQuery({
    queryKey: companyKeys.search(searchName),
    queryFn: () => searchCompanies(searchName),
    enabled: open && searchName.trim().length > 0,
  });

  const handleSearch = useCallback(() => {
    const trimmed = keyword.trim();
    setSearchName(trimmed);
  }, [keyword]);

  const handleSelect = useCallback(
    (company: CompanyResponse) => {
      onSelect?.(company);
      onOpenChange(false);
      setKeyword('');
      setSearchName('');
    },
    [onSelect, onOpenChange]
  );

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        setKeyword('');
        setSearchName('');
      }
      onOpenChange(next);
    },
    [onOpenChange]
  );

  const content = data?.content ?? [];
  const hasSearched = searchName.length > 0;
  const isEmpty = hasSearched && !isPending && content.length === 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl" showCloseButton>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="법인명 또는 기업명 입력"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
              autoFocus
            />
          </div>
          <Button type="button" onClick={handleSearch} disabled={!keyword.trim()}>
            검색
          </Button>
        </div>

        <div
          className={cn(
            'border-border max-h-[min(60vh,320px)] overflow-y-auto rounded-md border',
            hasSearched && 'min-h-[120px]'
          )}
        >
          {!hasSearched && (
            <p className="text-muted-foreground p-6 text-center text-sm">
              검색할 법인명을 입력한 뒤 검색 버튼을 누르세요.
            </p>
          )}
          {hasSearched && isPending && (
            <p className="text-muted-foreground p-6 text-center text-sm">
              검색 중…
            </p>
          )}
          {hasSearched && isError && (
            <p className="text-destructive p-6 text-center text-sm">
              {error instanceof Error ? error.message : '검색 중 오류가 났습니다.'}
            </p>
          )}
          {isEmpty && (
            <p className="text-muted-foreground p-6 text-center text-sm">
              검색 결과가 없습니다. 다른 키워드로 시도해 보세요.
            </p>
          )}
          {hasSearched && content.length > 0 && (
            <ul className="divide-border divide-y">
              {content.map((company, index) => (
                <li
                  key={`${company.businessNumber ?? company.name}-${index}`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(company)}
                    className="hover:bg-muted/50 w-full px-4 py-3 text-left transition-colors"
                  >
                    <div className="font-medium">{company.name}</div>
                    <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                      {company.industry && (
                        <span>업종: {company.industry}</span>
                      )}
                      {company.ceoName && (
                        <span>대표: {company.ceoName}</span>
                      )}
                      {company.businessNumber && (
                        <span>
                          사업자번호: {formatBusinessNumber(company.businessNumber)}
                        </span>
                      )}
                      {company.foundedDate && (
                        <span>
                          설립: {formatDate(company.foundedDate)}
                        </span>
                      )}
                    </div>
                    {company.address && (
                      <div className="text-muted-foreground mt-0.5 truncate text-xs">
                        {company.address}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

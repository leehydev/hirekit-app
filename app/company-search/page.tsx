'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { CompanySearchModal } from '@/components/CompanySearchModal';
import { Button } from '@/components/ui/button';
import type { CompanyResponse } from '@/lib/api';

/**
 * 사업자 검색 모달 사용 예시 페이지
 */
export default function CompanySearchExamplePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<CompanyResponse | null>(null);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">사업자 검색 예시</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        버튼을 누르면 모달이 열리고, 법인명으로 검색한 뒤 결과에서 기업을 선택할 수 있습니다.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <div>
          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="gap-2"
          >
            <Building2 className="size-4" />
            사업자 검색
          </Button>
        </div>

        {selected && (
          <div className="border-border rounded-lg border bg-muted/30 p-4">
            <h2 className="text-muted-foreground mb-2 text-sm font-medium">
              선택한 기업
            </h2>
            <dl className="grid gap-1.5 text-sm">
              <div>
                <dt className="text-muted-foreground inline">기업명 </dt>
                <dd className="inline font-medium">{selected.name}</dd>
              </div>
              {selected.businessNumber && (
                <div>
                  <dt className="text-muted-foreground inline">사업자번호 </dt>
                  <dd className="inline">{selected.businessNumber}</dd>
                </div>
              )}
              {selected.ceoName && (
                <div>
                  <dt className="text-muted-foreground inline">대표자 </dt>
                  <dd className="inline">{selected.ceoName}</dd>
                </div>
              )}
              {selected.industry && (
                <div>
                  <dt className="text-muted-foreground inline">업종 </dt>
                  <dd className="inline">{selected.industry}</dd>
                </div>
              )}
              {selected.address && (
                <div>
                  <dt className="text-muted-foreground inline">주소 </dt>
                  <dd className="inline">{selected.address}</dd>
                </div>
              )}
            </dl>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setSelected(null)}
            >
              선택 초기화
            </Button>
          </div>
        )}
      </div>

      <CompanySearchModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSelect={setSelected}
        title="사업자 검색"
        description="법인명(기업명)을 입력하면 공공데이터 기업개요에서 검색합니다."
      />
    </div>
  );
}

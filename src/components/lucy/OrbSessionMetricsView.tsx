import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { ScreenPortal } from '@/components/layout/ScreenPortal';
import type { OrbSessionMetrics } from '@/lib/orb/orbSessionMetrics';

function seconds(value: number | null) {
  return value == null ? '측정값 없음' : `${(value / 1000).toFixed(2)}초`;
}

export function OrbSessionMetricsView({ data }: { data: ReturnType<OrbSessionMetrics['snapshot']> }) {
  const [open, setOpen] = useState(false);
  const duration = Math.round(data.durationMs / 1000);
  const format = (value: number) => new Intl.NumberFormat('ko-KR').format(value);
  const rows = [
    ['상담 시간', `${Math.floor(duration / 60)}분 ${duration % 60}초`],
    ['API 사용량', data.reports ? `입력 ${format(data.input)} · 출력 ${format(data.output)} · 전체 ${format(data.total)} 토큰` : '받은 사용량 정보 없음'],
    ['예상 API 원가', data.estimatedUsd == null ? '단가 또는 토큰 세부 정보 없음' : `US$ ${data.estimatedUsd.toFixed(6)}`],
    ['평균 첫 음성 응답', seconds(data.averageLatencyMs)],
    ['최근 첫 음성 응답', seconds(data.lastLatencyMs)],
    ['도구 계산 후 첫 음성 응답', seconds(data.averageToolLatencyMs)],
  ];
  return (
    <Dialog.Root modal={false} open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild><button type="button" className="lucy-orb-bed">상담 시간·사용량 보기</button></Dialog.Trigger>
      {open && (
        <ScreenPortal>
          <div aria-hidden="true" className="absolute inset-0 bg-black/55" />
          <Dialog.Content className="absolute left-1/2 top-1/2 flex max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-3 overflow-y-auto overscroll-contain rounded-2xl bg-slate-950 p-4 text-sm text-slate-100 shadow-2xl">
            <div className="flex justify-between gap-4">
              <Dialog.Title className="text-base font-bold">상담 시간과 API 사용량</Dialog.Title>
              <Dialog.Close className="font-bold">닫기</Dialog.Close>
            </div>
            <dl className="space-y-2">
              {rows.map(([label, value]) => (
                <div key={label} className="flex flex-wrap justify-between gap-x-4 rounded-lg bg-slate-800 px-3 py-2">
                  <dt className="text-slate-300">{label}</dt><dd>{value}</dd>
                </div>
              ))}
            </dl>
            <Dialog.Description className="break-keep text-slate-300">
              첫 음성 응답은 글 전송이나 말이 끝난 시점부터 음성 재생 시작까지예요.
              실시간 대화는 받아쓰기 수신 시점을 기준으로 잽니다.
              원가는 설정된 단가로 계산한 예상치예요.
            </Dialog.Description>
          </Dialog.Content>
        </ScreenPortal>
      )}
    </Dialog.Root>
  );
}

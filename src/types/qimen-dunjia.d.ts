declare module 'qimen-dunjia' {
  export function generateChartByDatetime(datetime: string, options?: { '定局法'?: '拆補' | '符頭'; '夜子時'?: '次日' | '當日' }): Map<string, unknown>;
  export function chartToObject(chart: Map<string, unknown>): Record<string, unknown>;
}

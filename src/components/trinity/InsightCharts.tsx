import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { motion } from 'framer-motion';
import { rechartsAnimationActive, rechartsAnimationDuration } from '@/lib/chartPerf';
import { isLegacyMobile } from '@/lib/perfMode';
import { Activity, Target, Palette, Star } from 'lucide-react';

interface InsightChartsProps {
  history: any[];
}

const ChartShell = isLegacyMobile() ? 'div' : motion.div;

export function InsightCharts({ history }: InsightChartsProps) {
  // 1. Energy Trend (Area Chart)
  const energyTrend = history
    .filter(h => h.type === 'DAILY' || h.type === 'QUICK')
    .slice(0, 10)
    .reverse()
    .map(h => {
      const date = new Date(h.createdAt || Date.now());
      const text = (h.text || "").toLowerCase();
      let energy = 50;
      if (text.includes('좋') || text.includes('긍정') || text.includes('밝')) energy = 75;
      if (text.includes('나쁘') || text.includes('죽') || text.includes('슬픔')) energy = 25;
      if (text.includes('최고') || text.includes('대박')) energy = 95;
      
      return {
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        energy,
        fullDate: date.toLocaleDateString()
      };
    });

  // 2. Luck Radar
  const stats = { hope: 65, reality: 55, intuition: 75, action: 45, emotion: 80 };

  const radarData = [
    { subject: '희망', A: stats.hope, fullMark: 100 },
    { subject: '현실', A: stats.reality, fullMark: 100 },
    { subject: '직관', A: stats. intuition, fullMark: 100 },
    { subject: '실행', A: stats.action, fullMark: 100 },
    { subject: '감성', A: stats.emotion, fullMark: 100 },
  ];

  // 3. Lucky Color Distribution
  const colorMap = [
    { name: 'Red', color: '#ff4d4d', count: 3 },
    { name: 'Blue', color: '#4d79ff', count: 5 },
    { name: 'Gold', color: '#ffd700', count: 2 },
    { name: 'Green', color: '#4dff88', count: 4 },
    { name: 'Purple', color: '#b366ff', count: 1 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1625] border border-[#c8a96e]/30 p-3 rounded-xl text-xs shadow-2xl">
          <p className="text-[#c8a96e] mb-1 font-bold">{payload[0].payload.fullDate || label}</p>
          <p className="text-white">에너지 지표: <span className="text-[#c8a96e] font-bold">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Main Energy Area Chart */}
      <ChartShell 
        {...(isLegacyMobile() ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } })}
        className="bg-white/5 border border-white/10 rounded-[28px] p-7 backdrop-blur-md"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#c8a96e]/10">
              <Activity size={20} color="#c8a96e" />
            </div>
            <div>
              <div className="text-[15px] font-bold text-white">에너지 리듬</div>
              <div className="text-[11px] text-white/40">최근 10회 기록 분석</div>
            </div>
          </div>
          <div className="text-xs text-[#c8a96e] font-bold bg-[#c8a96e]/10 px-2.5 py-1 rounded-full">FLOW</div>
        </div>
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={energyTrend}>
              <defs>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8a96e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#c8a96e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="energy" stroke="#c8a96e" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" dot={{ r: 4, fill: '#c8a96e', strokeWidth: 0 }} isAnimationActive={rechartsAnimationActive()} animationDuration={rechartsAnimationDuration()} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartShell>

      {/* Radar Chart & Stats */}
      <div className="grid grid-cols-1 gap-6">
        <ChartShell 
          {...(isLegacyMobile() ? {} : { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } })}
          className="bg-white/5 border border-white/10 rounded-[28px] p-7"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <Target size={20} color="#c8a96e" />
            <span className="text-[15px] font-bold text-white">라이프 밸런스</span>
          </div>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <Radar
                  name="Vitality"
                  dataKey="A"
                  stroke="#c8a96e"
                  fill="#c8a96e"
                  fillOpacity={0.4}
                  isAnimationActive={rechartsAnimationActive()}
                  animationDuration={rechartsAnimationDuration()}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartShell>

        <div className="grid grid-cols-2 gap-6">
          <ChartShell 
            {...(isLegacyMobile() ? {} : { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } })}
            className="bg-white/5 border border-white/10 rounded-[28px] p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Palette size={16} color="#c8a96e" />
              <span className="text-[13px] font-bold text-white">하모니 컬러</span>
            </div>
            <div className="w-full h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={colorMap} innerRadius={25} outerRadius={40} paddingAngle={5} dataKey="count" isAnimationActive={rechartsAnimationActive()} animationDuration={rechartsAnimationDuration()}>
                    {colorMap.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartShell>

          <ChartShell 
            {...(isLegacyMobile() ? {} : { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } })}
            className="bg-white/5 border border-white/10 rounded-[28px] p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} color="#c8a96e" />
              <span className="text-[13px] font-bold text-white">활동 요약</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { label: '데일리', count: history.filter(h => h.type === 'DAILY').length },
                { label: '비전', count: history.filter(h => h.type === 'VISION').length },
                { label: '전체', count: history.length },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[11px] text-white/40">{item.label}</span>
                  <span className="text-[13px] font-bold text-[#c8a96e]">{item.count}</span>
                </div>
              ))}
            </div>
          </ChartShell>
        </div>
      </div>
      
      {/* Insight Summary */}
      <ChartShell 
        {...(isLegacyMobile() ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 } })}
        className="p-6 rounded-[24px] bg-[#c8a96e]/5 border border-[#c8a96e]/20 text-center"
      >
        <div className="text-[13px] text-[#c8a96e] leading-relaxed">
          "당신의 데이터는 긍정적인 변화를 가리키고 있습니다.<br/>루시와 함께 더 깊은 통찰을 발견해보세요."
        </div>
      </ChartShell>
    </div>
  );
}

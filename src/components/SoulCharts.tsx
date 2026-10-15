import React from 'react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { motion } from 'motion/react';
import { rechartsAnimationActive, rechartsAnimationDuration } from '@/lib/chartPerf';

interface ChartProps {
  data: any[];
  height?: number;
  color?: string;
  className?: string;
}

export const SoulFrequencyChart: React.FC<ChartProps> = ({ data, height = 250, color = "#60A5FA", className = "" }) => {
  if (!data || data.length === 0) {
    return (
      <div className={cn("w-full flex items-center justify-center border border-white/5 rounded-3xl", className)} style={{ height }}>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">No frequency data yet</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="soulGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)', fontWeight: 'bold' }} 
            dy={10}
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '10px',
              color: '#fff'
            }}
            itemStyle={{ color: '#fff' }}
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#soulGradient)" 
            isAnimationActive={rechartsAnimationActive()}
            animationDuration={rechartsAnimationDuration()}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const EmotionDistribution: React.FC<{ data: any[], colors?: string[] }> = ({ data, colors = ["#60A5FA", "#818CF8", "#A78BFA", "#F472B6", "#FB7185"] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center border border-white/5 rounded-3xl">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Emotional stability achieved</p>
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
          isAnimationActive={rechartsAnimationActive()}
          animationDuration={rechartsAnimationDuration()}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={0.6} />
          ))}
        </Pie>
        <Tooltip 
           contentStyle={{ 
            backgroundColor: 'rgba(0,0,0,0.8)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '10px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const SpiritualGrowthRadar: React.FC<{ data: any[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center border border-white/5 rounded-3xl">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Growth signal pending</p>
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.05)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
        <PolarRadiusAxis hide />
        <Radar
          name="Soul Progress"
          dataKey="A"
          stroke="#60A5FA"
          fill="#60A5FA"
          fillOpacity={0.3}
          isAnimationActive={rechartsAnimationActive()}
          animationDuration={rechartsAnimationDuration()}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

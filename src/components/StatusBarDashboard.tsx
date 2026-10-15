import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Zap, Heart, Brain, X, Info } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { computeRealtimeBiometrics } from '../lib/biometrics';

interface StatusBarDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  color: string;
  appName: string;
}

export function StatusBarDashboard({ isOpen, onClose, color, appName }: StatusBarDashboardProps) {
  const { sharedState } = useApp();
  
  const { fatigue, stress, focus } = computeRealtimeBiometrics(sharedState);
  const health = 100 - (fatigue + stress) / 2;

  const getStatusColor = (val: number) => {
    if (val > 80) return 'oklch(0.70 0.15 150)'; // Good
    if (val > 50) return 'oklch(0.70 0.15 70)';  // Med
    return 'oklch(0.70 0.15 30)';               // Bad
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-white/10 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-4 right-4 z-[101] max-w-lg mx-auto glass rounded-[40px] border border-white/10 p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20" style={{ background: color }} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10" style={{ background: color + '10' }}>
                    <Info size={20} style={{ color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-widest uppercase text-white/90">Ecosystem Status</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">{appName} Connection Established</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-3 bg-white/5 rounded-full text-white/30 hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <StatusItem label="Fatigue" value={fatigue} icon={Activity} color={getStatusColor(100 - fatigue)} />
                <StatusItem label="Stress" value={stress} icon={Heart} color={getStatusColor(100 - stress)} />
                <StatusItem label="Focus" value={focus} icon={Zap} unit="m" color={getStatusColor(focus)} />
                <StatusItem label="Harmony" value={health} icon={Brain} color={getStatusColor(health)} />
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-sm font-sans text-white/60 leading-relaxed mb-1">
                  "현재 당신의 영혼은 균형을 찾아가는 중입니다. {appName}에서의 활동이 정서적 회복에 큰 도움이 되고 있어요."
                </p>
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">— Universe Guidance</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatusItem({ label, value, icon: Icon, color, unit = '%' }: any) {
  return (
    <div className="glass p-4 rounded-3xl border border-white/5 flex flex-col gap-2 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5">
        <Icon size={24} style={{ color }} />
      </div>
      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{label}</span>
      <div className="flex items-end gap-1">
        <span className="text-xl font-mono text-white/90">{Math.round(value)}</span>
        <span className="text-[10px] text-white/30 mb-0.5">{unit}</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-1">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, unit === 'm' ? (value / 60) * 100 : value)}%` }}
          className="h-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

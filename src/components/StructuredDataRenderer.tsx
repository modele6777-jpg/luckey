import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, List, BarChart3, Layout } from 'lucide-react';

interface StructuredDataRendererProps {
  data: any;
  title?: string;
  className?: string;
}

export const StructuredDataRenderer: React.FC<StructuredDataRendererProps> = ({ data, title, className = "" }) => {
  if (!data) return null;

  const renderValue = (val: any) => {
    if (typeof val === 'string') return <span className="text-white/80">{val}</span>;
    if (typeof val === 'number') return <span className="text-blue-400 font-mono">{val}</span>;
    if (typeof val === 'boolean') return val ? (
      <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="inline-block">
        <CheckCircle2 className="text-emerald-400 inline" size={14} />
      </motion.span>
    ) : (
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="inline-block">
        <AlertCircle className="text-rose-400 inline" size={14} />
      </motion.span>
    );
    
    if (Array.isArray(val)) {
      return (
        <ul className="space-y-1 mt-1">
          {val.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-white/60">
              <div className="w-1 h-1 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
              {typeof item === 'object' ? renderValue(item) : String(item)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof val === 'object' && val !== null) {
      return (
        <div className="space-y-2 mt-1 pl-3 border-l border-white/5">
          {Object.entries(val).map(([k, v]) => (
            <div key={k} className="text-xs">
              <span className="text-white/30 uppercase tracking-tighter mr-2">{k}:</span>
              {renderValue(v)}
            </div>
          ))}
        </div>
      );
    }

    return String(val);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-white/5 border border-white/10 p-4 ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
          <Layout size={14} className="text-white/40" />
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{title}</h4>
        </div>
      )}
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="group">
            <div className="flex items-center gap-2 mb-1">
              {Array.isArray(value) ? <List size={12} className="text-blue-400/50" /> : 
               typeof value === 'number' ? <BarChart3 size={12} className="text-emerald-400/50" /> : 
               <Info size={12} className="text-indigo-400/50" />}
              <span className="text-[11px] font-medium text-white/50 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5 group-hover:border-white/10 transition-colors">
              {renderValue(value)}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

import { ScreenPortal } from '@/components/layout/ScreenPortal';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Sparkles, X } from 'lucide-react';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
}

export default function NoticeModal({ isOpen, onClose, title, message, confirmLabel = "확인" }: NoticeModalProps) {
  return (
    <ScreenPortal><AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-6 glass backdrop-blur-3xl"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 shadow-2xl rounded-[40px] p-8 text-center backdrop-blur-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                <Sparkles size={32} />
              </div>
            </div>
            
            <h3 className="text-xl font-display text-slate-900 dark:text-white mb-3">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-white/80 leading-relaxed font-sans mb-8 break-keep">
              {message}
            </p>

            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-black text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md"
            >
              {confirmLabel}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence></ScreenPortal>
  );
}

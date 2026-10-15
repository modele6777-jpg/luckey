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
    <AnimatePresence>
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
            className="w-full max-w-sm glass border border-white/10 rounded-[40px] p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                <Sparkles size={32} />
              </div>
            </div>
            
            <h3 className="text-xl font-display text-white mb-3">{title}</h3>
            <p className="text-sm text-white/60 leading-relaxed font-sans mb-8 break-keep">
              {message}
            </p>

            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-white text-black text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {confirmLabel}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

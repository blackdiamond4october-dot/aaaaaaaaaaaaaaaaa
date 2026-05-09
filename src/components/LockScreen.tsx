import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ChevronRight, HelpCircle } from 'lucide-react';
import { useStore } from '../store/StoreContext';

export const LockScreen: React.FC = () => {
  const { settings, isLocked, setIsLocked } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = settings.passwords.some(p => p.value === password);
    
    if (isValid) {
      setIsLocked(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPassword('');
    }
  };

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-app-bg flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#6366f115_0%,_transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm px-6 relative"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#6366f1] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#6366f155] border border-white/10">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-app-text tracking-tighter mb-2 uppercase">
            {settings.companyName}
          </h1>
          <p className="text-app-muted text-xs font-bold uppercase tracking-[0.2em]">Terminal Secured</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Key"
              className={`w-full bg-app-surface border ${error ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-app-border focus:border-[#6366f1]'} rounded-xl px-6 py-4 text-center font-mono text-xl tracking-[0.5em] outline-none transition-all placeholder:tracking-normal placeholder:text-[10px] placeholder:font-sans placeholder:uppercase placeholder:font-black placeholder:text-app-muted`}
            />
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-red-500 font-bold uppercase text-center mt-3 tracking-widest"
              >
                Invalid Access Sequence
              </motion.p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-[#6366f1] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#6366f133] flex items-center justify-center gap-2"
          >
            Authenticate System
            <ChevronRight size={16} />
          </button>
        </form>

        <div className="mt-8 text-center flex flex-col items-center gap-3">
          <button 
            onClick={() => setShowHint(!showHint)}
            className="text-app-muted hover:text-[#6366f1] transition-colors flex items-center gap-2 group"
          >
            <HelpCircle size={14} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Toggle Access Hints</span>
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#6366f111] border border-[#6366f122] rounded-lg px-4 py-3">
                  <p className="text-[10px] text-[#6366f1] font-black uppercase tracking-widest mb-1.5 underline decoration-2 underline-offset-4">Relational Hints</p>
                  <div className="space-y-1">
                    {settings.passwords.map((p, i) => (
                      <p key={i} className="text-[11px] text-app-text font-bold italic">
                        "{p.hint || 'No hint provided'}"
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <div className="absolute bottom-10 text-[9px] text-app-muted font-black uppercase tracking-[0.3em]">
        ZEN-CORE SECURITY PROTOCOL V4.2
      </div>
    </div>
  );
};

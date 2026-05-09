import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/StoreContext';

const ADMIN_KEY = "khurram03034008573";
const TRIAL_DURATION_MS = 10 * 24 * 60 * 60 * 1000;

export const ActivationScreen: React.FC = () => {
  const { settings, setSettings } = useStore();
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const timeLeft = (settings.installedAt + TRIAL_DURATION_MS) - Date.now();
  const isExpired = timeLeft <= 0;
  
  // If not activated and expired, we block the app
  const isBlocked = !settings.isActivated && isExpired;

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === ADMIN_KEY) {
      setSuccess(true);
      setTimeout(() => {
        setSettings(prev => ({ ...prev, isActivated: true }));
      }, 1500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setKey('');
    }
  };

  if (!isBlocked && !settings.isActivated) {
    // Optional: Show warning banner if not expired but not activated
    // For now we'll just return null if not blocked
    return null;
  }

  if (settings.isActivated) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-[#09090b] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ef4444] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#6366f1] rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-[#18181b] border-2 border-app-border rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Cpu size={120} />
        </div>

        <div className="relative">
          <div className="w-16 h-16 bg-[#ef444415] border border-[#ef444433] rounded-2xl flex items-center justify-center mb-6">
            <ShieldAlert className="text-[#ef4444]" size={32} />
          </div>

          <h2 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">
            License Terminated
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium">
            The evaluative period for <span className="text-[#6366f1] font-black">ZEN-CORE OS</span> has concluded. Persistent access to terminal database and logic nodes requires an 18-character Administrator Unlock Sequence.
          </p>

          {!success ? (
            <form onSubmit={handleActivate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ef4444]">Administrative Key Required</label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX-XX"
                  className={`w-full bg-[#09090b] border ${error ? 'border-red-500' : 'border-zinc-800 focus:border-[#6366f1]'} rounded-xl px-6 py-4 font-mono text-lg text-white outline-none transition-all placeholder:text-zinc-700`}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#6366f1] hover:text-white transition-all shadow-xl flex items-center justify-center gap-2"
              >
                Execute Master Unlock
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-10 bg-[#22c55e11] border border-[#22c55e33] rounded-2xl"
            >
              <CheckCircle2 className="text-[#22c55e] mb-4" size={48} />
              <p className="text-[#22c55e] font-black uppercase tracking-widest">Protocol Verified</p>
              <p className="text-[10px] text-zinc-500 font-bold mt-2">Initializing full system kernel...</p>
            </motion.div>
          )}

          <div className="mt-10 pt-8 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">System Node ID</span>
              <span className="text-[11px] font-mono text-zinc-300">ZEN-001-XPB</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Support Contact</span>
              <span className="text-[11px] font-mono text-zinc-300">SYS-ADMIN-PROTO</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

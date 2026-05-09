import React, { useState } from 'react';
import { 
  Building2, 
  Settings as SettingsIcon, 
  Printer, 
  Database, 
  Palette, 
  ShieldCheck, 
  Globe, 
  Plus,
  Trash2,
  Lock,
  Unlock,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { cn } from '../lib/utils';

export const SettingsModule: React.FC = () => {
  const { settings, setSettings } = useStore();
  const [activeTab, setActiveTab] = useState('General');
  const [newPass, setNewPass] = useState({ value: '', hint: '' });
  const [activationKey, setActivationKey] = useState('');

  const tabs = [
    { id: 'General', icon: <SettingsIcon size={16} /> },
    { id: 'Company', icon: <Building2 size={16} /> },
    { id: 'Security', icon: <ShieldCheck size={16} /> },
    { id: 'Printing', icon: <Printer size={16} /> },
    { id: 'Theme', icon: <Palette size={16} /> },
  ];

  const addPassword = () => {
    if (!newPass.value) return;
    setSettings(prev => ({
      ...prev,
      passwords: [...prev.passwords, newPass]
    }));
    setNewPass({ value: '', hint: '' });
  };

  const removePassword = (index: number) => {
    if (settings.passwords.length <= 1) return; // Must have at least one
    setSettings(prev => ({
      ...prev,
      passwords: prev.passwords.filter((_, i) => i !== index)
    }));
  };

  const handleActivate = () => {
    if (activationKey === "khurram03034008573") {
      setSettings(prev => ({ ...prev, isActivated: true }));
      setActivationKey('');
      alert("SYSTEM ACTIVATED SUCCESSFULLY");
    } else {
      alert("INVALID MASTER SEQUENCE");
    }
  };

  return (
    <div className="bg-app-surface border border-app-border rounded-xl overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="flex border-b border-app-border bg-app-header p-1.5 gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f122]" 
                : "text-app-muted hover:text-app-text hover:bg-app-bg"
            )}
          >
            {tab.icon && React.cloneElement(tab.icon as React.ReactElement, { size: 14 })}
            {tab.id}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-12">
          {activeTab === 'Company' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="flex items-center justify-between border-b border-app-border pb-6">
                <div>
                  <h3 className="text-xl font-black tracking-tighter text-[#6366f1] flex items-center gap-3 uppercase">
                    <Building2 size={24} /> 
                    {settings.companyName}.NODE_PROFILE
                  </h3>
                  <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest mt-1 italic">Master identity configuration</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em] block">Entity Formal Name (System Title)</label>
                  <input value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} className="w-full bg-app-bg border border-app-border rounded px-4 py-3 outline-none text-[11px] font-black uppercase text-app-text focus:border-[#6366f155] transition-all" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em] block">Shop Logo Asset</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-app-bg border-2 border-dashed border-app-border rounded-xl flex items-center justify-center shrink-0 overflow-hidden group relative">
                      {settings.logoUrl ? (
                        <>
                          <img src={settings.logoUrl} className="w-full h-full object-contain p-1" alt="Preview" />
                          <button 
                            onClick={() => setSettings({...settings, logoUrl: ''})}
                            className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-black uppercase"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <ImageIcon size={24} className="text-app-muted" />
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <input 
                        type="file" 
                        id="logo-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setSettings({...settings, logoUrl: reader.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label 
                        htmlFor="logo-upload"
                        className="inline-flex items-center gap-2 bg-app-bg border border-app-border px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-app-text hover:border-[#6366f1] hover:text-[#6366f1] cursor-pointer transition-all shadow-sm"
                      >
                        <Plus size={14} />
                        Select from Gallery
                      </label>
                      <p className="text-[9px] text-app-muted font-medium italic">Recommended: PNG / JPG with transparent background (Max 2MB)</p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em] block">Geographic Coordinates (Address)</label>
                  <textarea value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full bg-app-bg border border-app-border rounded px-4 py-3 outline-none h-24 text-[10px] font-bold uppercase text-app-muted resize-none focus:border-[#6366f155]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em] block">Telecom Line</label>
                  <input value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full bg-app-bg border border-app-border rounded px-4 py-3 outline-none font-mono text-app-text" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em] block">Fiscal Unit (Currency)</label>
                  <input value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full bg-app-bg border border-app-border rounded px-4 py-3 outline-none text-2xl font-black text-[#22c55e]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="flex items-center justify-between border-b border-app-border pb-6">
                <div>
                  <h3 className="text-xl font-black tracking-tighter text-[#ef4444] flex items-center gap-3 uppercase">
                    <ShieldCheck size={24} /> 
                    KERNEL.SECURITY
                  </h3>
                  <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest mt-1 italic">Access control & licensing protocols</p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-2",
                  settings.isActivated ? "bg-[#22c55e22] text-[#22c55e]" : "bg-[#ef444422] text-[#ef4444]"
                )}>
                  {settings.isActivated ? <Unlock size={12} /> : <Lock size={12} />}
                  {settings.isActivated ? "ACTIVATED" : "TRIAL_MODE"}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em] block">Authorized Access Keys</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {settings.passwords.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-app-bg border border-app-border rounded-xl group">
                        <div>
                          <p className="text-xs font-mono font-black text-app-text">••••••••</p>
                          <p className="text-[9px] text-app-muted font-bold uppercase tracking-wider mt-1">Hint: {p.hint || 'No hint'}</p>
                        </div>
                        <button 
                          onClick={() => removePassword(i)}
                          className="p-2 text-app-muted hover:text-[#ef4444] transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-app-bg border border-dashed border-app-border rounded-xl flex gap-3 flex-wrap items-end">
                    <div className="flex-1 min-w-[120px] space-y-1.5">
                      <label className="text-[9px] font-black text-app-muted uppercase tracking-widest">New Key</label>
                      <input 
                        value={newPass.value}
                        onChange={e => setNewPass({...newPass, value: e.target.value})}
                        className="w-full bg-app-surface border border-app-border rounded px-3 py-2 text-xs text-app-text outline-none" 
                        placeholder="Key Value"
                      />
                    </div>
                    <div className="flex-[2] min-w-[180px] space-y-1.5">
                      <label className="text-[9px] font-black text-app-muted uppercase tracking-widest">Key Hint</label>
                      <input 
                        value={newPass.hint}
                        onChange={e => setNewPass({...newPass, hint: e.target.value})}
                        className="w-full bg-app-surface border border-app-border rounded px-3 py-2 text-xs text-app-text outline-none" 
                        placeholder="Memory Trigger"
                      />
                    </div>
                    <button 
                      onClick={addPassword}
                      className="bg-[#6366f1] text-white p-2 rounded-lg hover:brightness-110"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {!settings.isActivated && (
                  <div className="p-6 bg-[#ef444408] border border-[#ef444433] rounded-2xl space-y-4">
                    <div>
                      <h4 className="text-xs font-black text-[#ef4444] uppercase tracking-widest mb-1">System Activation Required</h4>
                      <p className="text-[10px] text-zinc-500 font-medium">System will lock permanently after 10 days of trial usage.</p>
                    </div>
                    <div className="flex gap-3">
                      <input 
                        value={activationKey}
                        onChange={e => setActivationKey(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX-XXXX-XX"
                        className="flex-1 bg-app-bg border border-app-border rounded-lg px-4 py-3 font-mono text-sm text-app-text outline-none focus:border-[#ef444455]"
                      />
                      <button 
                        onClick={handleActivate}
                        className="bg-[#22c55e] text-white px-6 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#22c55e22]"
                      >
                        Activate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'General' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="flex items-center justify-between border-b border-app-border pb-6">
                <div>
                  <h3 className="text-xl font-black tracking-tighter text-[#6366f1] flex items-center gap-3 uppercase">
                    <SettingsIcon size={24} /> 
                    PREFERENCE.ENGINE
                  </h3>
                  <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest mt-1 italic">Core instruction set overrides</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Visual asset rendering on HUB", key: 'showPictures' },
                  { label: "Autonomous cloud synch/backup", key: 'autoBackup' },
                  { label: "Terminal resource depletion alerts", key: 'lowStockAlert' },
                  { label: "Direct thermal hardcopy output", key: 'printOriginal' }
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between p-5 bg-app-bg border border-app-border rounded-lg cursor-pointer hover:border-[#6366f155] transition-all group overflow-hidden relative">
                    <div className="relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-app-muted group-hover:text-app-text">{item.label}</span>
                    </div>
                    <div className="relative z-10">
                      <input type="checkbox" className="w-4 h-4 accent-[#6366f1] cursor-pointer" />
                    </div>
                    <div className="absolute top-0 right-0 w-16 h-1 w-full bg-[#6366f105] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="pt-10 border-t border-app-border flex justify-between items-center bg-gradient-to-t from-app-header to-transparent -mx-10 px-10 pb-10">
            <button className="bg-[#6366f1] px-10 py-3.5 rounded font-black text-white shadow-xl shadow-[#6366f122] hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-3 text-[11px] uppercase tracking-[0.3em]">
              <CheckCircle2 size={18} />
              Commit Global State
            </button>
            <div className="hidden lg:flex flex-col items-end gap-1">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

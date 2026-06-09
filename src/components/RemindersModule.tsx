import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { AlertCircle, Package, CheckCircle, Plus, Bell, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const RemindersModule: React.FC = () => {
  const { items, reminders, setReminders } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderDate, setNewReminderDate] = useState('');

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle || !newReminderDate) return;
    const reminder = {
      id: Math.random().toString(36).substr(2, 9),
      title: newReminderTitle,
      date: newReminderDate,
      completed: false
    };
    setReminders([...reminders, reminder as any]);
    setNewReminderTitle('');
    setNewReminderDate('');
    setShowAdd(false);
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const lowStockItems = items.filter(
    (item) => item.lowStockValue > 0 && item.stock <= item.lowStockValue
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-app-text">SYSTEM REMINDERS</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-app-muted mt-1 italic">Automated alerts and notifications</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowAdd(!showAdd)} className="bg-[#6366f1] text-white px-4 py-2 rounded text-[10px] font-black uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#6366f133] transition-all flex items-center gap-2">
            <Plus size={14} /> Add Reminder
          </button>
          <div className="bg-app-surface border border-app-border rounded-full px-4 py-1.5 flex items-center gap-2">
            <AlertCircle size={14} className={lowStockItems.length > 0 ? "text-[#f59e0b]" : "text-app-muted"} />
            <span className="text-[10px] font-black uppercase text-app-text tracking-widest">{lowStockItems.length} ACTIVE ALERTS</span>
          </div>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleAddReminder} className="bg-app-surface border border-[#6366f155] rounded-xl p-4 shadow-xl flex gap-4 animate-in slide-in-from-top-2">
          <div className="flex-1">
            <input 
              value={newReminderTitle}
              onChange={e => setNewReminderTitle(e.target.value)}
              placeholder="Reminder Task Description..."
              className="w-full bg-app-bg border border-app-border rounded px-4 py-3 text-xs text-app-text focus:border-[#6366f1] outline-none"
            />
          </div>
          <div>
            <input 
              type="date"
              value={newReminderDate}
              onChange={e => setNewReminderDate(e.target.value)}
              className="w-full bg-app-bg border border-app-border rounded px-4 py-3 text-xs font-mono text-app-text focus:border-[#6366f1] outline-none"
            />
          </div>
          <button type="submit" className="bg-[#6366f1] text-white px-6 py-3 rounded font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">Save</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Alerts Section */}
        <div className="space-y-4">
          {lowStockItems.length === 0 ? (
            <div className="bg-app-surface border border-app-border rounded-xl p-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-app-header border border-app-border flex items-center justify-center mb-4">
                <CheckCircle size={24} className="text-[#22c55e]" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-app-text mb-1">ALL SYSTEMS NOMINAL</h3>
              <p className="text-[11px] text-app-muted uppercase tracking-widest">No active reminders or stock alerts at this time.</p>
            </div>
          ) : (
            <div className="bg-app-surface border border-app-border rounded-xl overflow-hidden shadow-xl">
               <div className="p-4 border-b border-app-border bg-[#f59e0b]/10 flex items-center gap-3">
                  <AlertCircle size={16} className="text-[#f59e0b]" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f59e0b]">LOW INVENTORY ALERTS</h3>
               </div>
               <div className="divide-y divide-app-border">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-app-bg transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center">
                          <Package size={16} className="text-[#f59e0b]" />
                        </div>
                        <div>
                          <h4 className="text-[12px] font-black uppercase tracking-tight text-app-text">{item.name}</h4>
                          <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest mt-0.5">Barcode: <span className="font-mono">{item.barcode || 'N/A'}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-app-muted tracking-widest mb-1">Current Stock</p>
                          <p className={cn("text-sm font-black font-mono", item.stock <= 0 ? "text-[#ef4444]" : "text-[#f59e0b]")}>{item.stock}</p>
                        </div>
                        <div className="w-px h-8 bg-app-border"></div>
                        <div className="text-left w-24">
                           <p className="text-[10px] uppercase font-bold text-app-muted tracking-widest mb-1">Alert Threshold</p>
                           <p className="text-sm font-black font-mono text-app-text">{item.lowStockValue}</p>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
        
        {/* Custom Reminders Section */}
        <div className="space-y-4">
          <div className="bg-app-surface border border-app-border rounded-xl overflow-hidden shadow-xl h-full flex flex-col">
             <div className="p-4 border-b border-app-border bg-[#6366f1]/10 flex items-center gap-3 shrink-0">
                <Bell size={16} className="text-[#6366f1]" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6366f1]">CUSTOM REMINDERS</h3>
             </div>
             <div className="divide-y divide-app-border flex-1 flex flex-col">
                {reminders && reminders.filter(r => r && r.id).map(r => (
                  <div key={r.id} className={cn("p-4 flex items-center justify-between hover:bg-app-bg transition-colors", r.completed ? "opacity-50" : "")}>
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleReminder(r.id)} className={cn("w-6 h-6 rounded flex items-center justify-center border", r.completed ? "bg-[#22c55e] border-[#22c55e]" : "border-app-border")}>
                        {r.completed && <CheckCircle size={14} className="text-[#0f0f10]" />}
                      </button>
                      <div>
                        <h4 className={cn("text-[12px] font-black uppercase tracking-tight text-app-text", r.completed ? "line-through" : "")}>{r.title || 'Untitled'}</h4>
                        <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest mt-0.5">Due: <span className="font-mono text-[#6366f1]">{r.date || 'No Date'}</span></p>
                      </div>
                    </div>
                    <button onClick={() => deleteReminder(r.id)} className="text-app-muted hover:text-[#ef4444] transition-colors p-2">
                       <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(!reminders || reminders.filter(r => r && r.id).length === 0) && (
                   <div className="flex-1 p-8 flex items-center justify-center min-h-[120px]">
                     <p className="text-[10px] text-app-muted uppercase tracking-widest italic font-bold">No custom tasks scheduled.</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Calendar, 
  User, 
  Truck,
  Plus
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { cn, formatCurrency } from '../lib/utils';

export const PaymentsModule: React.FC = () => {
  const { customers, suppliers, sales, purchases } = useStore();
  const [activeTab, setActiveTab] = useState<'RECORDS' | 'TRANSFER'>('RECORDS');

  const history = [
    ...sales.map(s => ({ type: 'INCOME', amount: s.paid, date: s.date, label: `Sale: ${s.invoiceNo}`, party: s.customerName || 'Customer' })),
    ...purchases.map(p => ({ type: 'EXPENSE', amount: p.paid, date: p.date, label: `Purchase: ${p.invoiceNo}`, party: 'Supplier' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const liquidity = history.reduce((acc, tx) => acc + (tx.type === 'INCOME' ? tx.amount : -tx.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-app-text">TRANSACTION COMMAND</h1>
        </div>
        <div className="flex bg-app-header p-1 rounded border border-app-border">
           <button onClick={() => setActiveTab('RECORDS')} className={cn("px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all", activeTab === 'RECORDS' ? "bg-[#6366f1] text-white" : "text-app-muted hover:text-app-text")}>History</button>
           <button onClick={() => setActiveTab('TRANSFER')} className={cn("px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all", activeTab === 'TRANSFER' ? "bg-[#6366f1] text-white" : "text-app-muted hover:text-app-text")}>X-fer Node</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="bg-app-surface border border-app-border rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-app-border bg-app-header flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-app-muted flex items-center gap-2">
                <CreditCard size={16} className="text-[#6366f1]" />
                Event Archive
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-app-bg">
                  <tr className="text-[10px] font-black uppercase text-app-muted tracking-[0.2em] border-b border-app-border">
                    <th className="px-6 py-4">Protocol</th>
                    <th className="px-6 py-4">Node Class</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4 text-right">Magnitude</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a]">
                  {history.map((tx, i) => (
                    <tr key={i} className="hover:bg-app-border/40 transition-colors border-b border-app-border">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-7 h-7 rounded flex items-center justify-center border",
                            tx.type === 'INCOME' ? "bg-[#22c55e11] text-[#22c55e] border-[#22c55e22]" : "bg-[#ef444411] text-[#ef4444] border-[#ef444422]"
                          )}>
                            {tx.type === 'INCOME' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          </div>
                          <p className="text-[11px] font-black uppercase tracking-tight text-app-text">{tx.label}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">{tx.party}</span></td>
                      <td className="px-6 py-4"><span className="text-[10px] font-mono text-app-muted uppercase">{new Date(tx.date).toLocaleString()}</span></td>
                      <td className="px-6 py-4 text-right">
                         <p className={cn("text-[11px] font-black font-mono", tx.type === 'INCOME' ? "text-[#22c55e]" : "text-[#ef4444]")}>
                           {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                         </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-[#6366f1] rounded-xl p-6 text-white shadow-xl shadow-[#6366f111] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.08]">
               <CreditCard size={120} className="rotate-12" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">System Liquidity</p>
             <h2 className="text-4xl font-black mt-1 font-mono tracking-tighter">{formatCurrency(liquidity)}</h2>
             <p className="text-[9px] mt-4 font-bold opacity-80 uppercase tracking-widest italic">Net Cash Flow calculation</p>
          </div>

          <div className="bg-app-surface border border-app-border rounded-xl p-6 space-y-6 shadow-xl">
             <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-app-muted flex items-center gap-2"><Plus size={16} className="text-[#6366f1]" /> Manual Override</h3>
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-2">
                 <button className="bg-app-bg border border-[#6366f144] text-[#6366f1] py-2.5 rounded text-[9px] font-black uppercase tracking-widest transition-all">Receive</button>
                 <button className="bg-app-bg border border-app-border text-app-muted py-2.5 rounded text-[9px] font-black uppercase tracking-widest hover:border-[#ef444444] hover:text-[#ef4444] transition-all">Disburse</button>
               </div>
               <div className="relative group">
                 <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-[#6366f1]" />
                 <input type="text" placeholder="Protocol Hash / Node ID..." className="w-full bg-app-bg border border-app-border rounded py-2 pl-9 pr-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-[#6366f155] transition-all" />
               </div>
               <input type="number" placeholder="0.00" className="w-full bg-app-bg border border-[#22c55e22] rounded py-4 text-center text-2xl font-black text-[#22c55e] outline-none font-mono" />
               <button className="w-full bg-[#22c55e] py-3 rounded font-black text-[11px] uppercase tracking-[0.25em] text-[#0f0f10] hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[#22c55e11]">Execute Tx</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

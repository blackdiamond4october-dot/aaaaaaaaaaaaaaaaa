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
    ...sales.map(s => ({ type: 'INCOME', amount: s.paid, date: s.date, label: `Sale: ${s.invoiceNo}`, party: 'Customer' })),
    ...purchases.map(p => ({ type: 'EXPENSE', amount: p.paid, date: p.date, label: `Purchase: ${p.invoiceNo}`, party: 'Supplier' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-[#f4f4f5]">TRANSACTION COMMAND</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#52525b] mt-1 italic">Real-time ledger synchronization</p>
        </div>
        <div className="flex bg-[#18181b] p-1 rounded border border-[#27272a]">
           <button onClick={() => setActiveTab('RECORDS')} className={cn("px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all", activeTab === 'RECORDS' ? "bg-[#6366f1] text-white" : "text-[#a1a1aa] hover:text-[#f4f4f5]")}>History</button>
           <button onClick={() => setActiveTab('TRANSFER')} className={cn("px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all", activeTab === 'TRANSFER' ? "bg-[#6366f1] text-white" : "text-[#a1a1aa] hover:text-[#f4f4f5]")}>X-fer Node</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="bg-[#1c1c1f] border border-[#27272a] rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#a1a1aa] flex items-center gap-2">
                <CreditCard size={16} className="text-[#6366f1]" />
                Event Archive
              </h3>
              <div className="flex gap-2">
                <button className="text-[9px] bg-[#22c55e11] text-[#22c55e] px-3 py-1 rounded font-black border border-[#22c55e22] uppercase tracking-wider">PDF-OUT</button>
                <button className="text-[9px] bg-[#6366f111] text-[#6366f1] px-3 py-1 rounded font-black border border-[#6366f122] uppercase tracking-wider">COM-PRINT</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0f0f10]">
                  <tr className="text-[10px] font-black uppercase text-[#a1a1aa] tracking-[0.2em] border-b border-[#27272a]">
                    <th className="px-6 py-4">Protocol</th>
                    <th className="px-6 py-4">Node Class</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4 text-right">Magnitude</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a]">
                  {history.map((tx, i) => (
                    <tr key={i} className="hover:bg-[#27272a44] transition-colors border-b border-[#27272a]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-7 h-7 rounded flex items-center justify-center border",
                            tx.type === 'INCOME' ? "bg-[#22c55e11] text-[#22c55e] border-[#22c55e22]" : "bg-[#ef444411] text-[#ef4444] border-[#ef444422]"
                          )}>
                            {tx.type === 'INCOME' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                          </div>
                          <p className="text-[11px] font-black uppercase tracking-tight text-[#f4f4f5]">{tx.label}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="text-[10px] font-bold text-[#52525b] uppercase tracking-wider">{tx.party}</span></td>
                      <td className="px-6 py-4"><span className="text-[10px] font-mono text-[#a1a1aa] uppercase">{new Date(tx.date).toLocaleString()}</span></td>
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
             <h2 className="text-4xl font-black mt-1 font-mono tracking-tighter">Rs 245,600</h2>
             <p className="text-[9px] mt-4 font-bold opacity-80 uppercase tracking-widest italic">Node capacity at peak</p>
          </div>

          <div className="bg-[#1c1c1f] border border-[#27272a] rounded-xl p-6 space-y-6 shadow-xl">
             <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#a1a1aa] flex items-center gap-2"><Plus size={16} className="text-[#6366f1]" /> Manual Override</h3>
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-2">
                 <button className="bg-[#0f0f10] border border-[#6366f144] text-[#6366f1] py-2.5 rounded text-[9px] font-black uppercase tracking-widest transition-all">Receive</button>
                 <button className="bg-[#0f0f10] border border-[#27272a] text-[#52525b] py-2.5 rounded text-[9px] font-black uppercase tracking-widest hover:border-[#ef444444] hover:text-[#ef4444] transition-all">Disburse</button>
               </div>
               <div className="relative group">
                 <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b] group-focus-within:text-[#6366f1]" />
                 <input type="text" placeholder="Protocol Hash / Node ID..." className="w-full bg-[#0f0f10] border border-[#27272a] rounded py-2 pl-9 pr-3 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-[#6366f155] transition-all" />
               </div>
               <input type="number" placeholder="0.00" className="w-full bg-[#0f0f10] border border-[#22c55e22] rounded py-4 text-center text-2xl font-black text-[#22c55e] outline-none font-mono" />
               <button className="w-full bg-[#22c55e] py-3 rounded font-black text-[11px] uppercase tracking-[0.25em] text-[#0f0f10] hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[#22c55e11]">Execute Tx</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

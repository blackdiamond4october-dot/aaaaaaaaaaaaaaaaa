import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Wallet, 
  BarChart3, 
  PieChart, 
  FileText 
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { formatCurrency } from '../lib/utils';

export const ReportsModule: React.FC = () => {
  const { sales, purchases, expenses, items } = useStore();

  const totalSales = sales.reduce((acc, s) => acc + s.total, 0);
  const totalProfit = sales.reduce((acc, s) => acc + (s.total * 0.2), 0); // Simplified 20% margin mock
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const reportCards = [
    { title: 'Total Sales Revenue', value: formatCurrency(totalSales), icon: <TrendingUp className="text-indigo-400" /> },
    { title: 'Estimated Net Profit', value: formatCurrency(totalProfit - totalExpenses), icon: <BarChart3 className="text-emerald-400" /> },
    { title: 'Total Operational Costs', value: formatCurrency(totalExpenses), icon: <Wallet className="text-rose-400" /> },
  ];

  return (
    <div className="space-y-8 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-[#f4f4f5]">INTELLIGENCE REPORTING</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#52525b] mt-1 italic">Synthesized business performance metrics</p>
        </div>
        <button className="bg-[#1c1c1f] border border-[#27272a] px-5 py-2.5 rounded text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#27272a] transition-all text-[#a1a1aa] hover:text-[#f4f4f5] shadow-lg">
          <FileText size={16} /> DATA.EXPORT(RAW)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportCards.map((card, i) => (
          <div key={i} className="bg-[#1c1c1f] border border-[#27272a] p-6 rounded-xl relative overflow-hidden group shadow-xl">
            <div className="relative z-10">
              <div className="w-10 h-10 rounded border border-[#27272a] bg-[#0f0f10] flex items-center justify-center mb-4 text-[#6366f1]">
                {card.icon}
              </div>
              <p className="text-[10px] font-black text-[#52525b] uppercase tracking-[0.2em]">{card.title}</p>
              <h2 className="text-3xl font-black mt-2 text-[#f4f4f5] font-mono tracking-tighter">{card.value}</h2>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#6366f105] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-[#1c1c1f] border border-[#27272a] rounded-xl flex flex-col shadow-xl">
          <div className="p-4 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#a1a1aa] flex items-center gap-2">
              <ShoppingBag size={16} className="text-[#6366f1]" /> Transaction Feed 
            </h3>
            <span className="text-[9px] font-black text-[#52525b] uppercase tracking-widest">v2.4 Live</span>
          </div>
          <div className="p-4 space-y-2 flex-1">
             {sales.slice(-6).reverse().map(sale => (
               <div key={sale.id} className="flex items-center justify-between p-3 bg-[#0f0f10] border border-[#27272a] rounded hover:border-[#6366f144] transition-all group">
                 <div className="flex flex-col gap-0.5">
                   <p className="text-[11px] font-black text-[#f4f4f5] uppercase tracking-tight">{sale.invoiceNo}</p>
                   <p className="text-[9px] font-mono text-[#52525b] uppercase">{new Date(sale.date).toLocaleDateString()}</p>
                 </div>
                 <p className="text-[11px] font-black text-[#6366f1] font-mono">{formatCurrency(sale.total)}</p>
               </div>
             ))}
             {sales.length === 0 && (
               <div className="py-20 text-center flex flex-col items-center gap-3">
                 <p className="text-[10px] font-black text-[#52525b] uppercase tracking-widest italic">Awaiting first settlement...</p>
                 <div className="w-16 h-0.5 bg-[#27272a] rounded-full" />
               </div>
             )}
          </div>
        </div>

        <div className="bg-[#1c1c1f] border border-[#27272a] rounded-xl flex flex-col shadow-xl">
          <div className="p-4 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ef4444] flex items-center gap-2">
              <Package size={16} /> Terminal Stock Alerts
            </h3>
            <span className="text-[9px] font-black text-[#ef4444] animate-pulse uppercase tracking-widest">Critical!</span>
          </div>
          <div className="p-4 space-y-2 flex-1">
             {items.filter(i => i.stock < i.lowStockValue).map(item => (
               <div key={item.id} className="flex items-center justify-between p-3 bg-[#0f0f10] border border-[#27272a] rounded hover:border-[#ef444444] transition-all">
                 <p className="text-[11px] font-black text-[#f4f4f5] uppercase tracking-tight">{item.name}</p>
                 <div className="px-2 py-0.5 rounded-sm bg-[#ef444411] border border-[#ef444422] text-[#ef4444] text-[9px] font-black uppercase tracking-widest">
                   {item.stock} NODE LEFT
                 </div>
               </div>
             ))}
             {items.filter(i => i.stock < i.lowStockValue).length === 0 && (
               <div className="h-full flex flex-col items-center justify-center py-20 gap-4">
                 <div className="w-12 h-12 rounded-full border-2 border-[#22c55e22] flex items-center justify-center text-[#22c55e]">
                   <CheckCircle2 size={24} />
                 </div>
                 <p className="text-[10px] font-black text-[#22c55e] uppercase tracking-[0.2em]">All nodes operational</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

import { CheckCircle2 } from 'lucide-react';

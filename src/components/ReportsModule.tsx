import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Wallet, 
  BarChart3, 
  PieChart, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { formatCurrency } from '../lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

export const ReportsModule: React.FC = () => {
  const { sales, purchases, expenses, items } = useStore();

  const totalSales = sales.reduce((acc, s) => acc + s.total, 0);
  let totalProfit = 0;
  sales.forEach(sale => {
    sale.items.forEach(cartItem => {
      const dbItem = items.find(i => i.id === cartItem.itemId);
      const costPrice = dbItem ? dbItem.costPrice : 0;
      totalProfit += (cartItem.price - costPrice) * cartItem.qty;
    });
  });
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const reportCards = [
    { title: 'Total Sales Revenue', value: formatCurrency(totalSales), icon: <TrendingUp className="text-indigo-400" /> },
    { title: 'Estimated Net Profit', value: formatCurrency(totalProfit - totalExpenses), icon: <BarChart3 className="text-emerald-400" /> },
    { title: 'Total Operational Costs', value: formatCurrency(totalExpenses), icon: <Wallet className="text-rose-400" /> },
  ];

  const handleExportCSV = () => {
    const csvContent = [
      ["Date", "Invoice No", "Customer", "SubTotal", "Discount", "Total", "Profit"].join(","),
      ...sales.map(s => {
        let saleProfit = 0;
        s.items.forEach(cartItem => {
          const dbItem = items.find(i => i.id === cartItem.itemId);
          saleProfit += (cartItem.price - (dbItem?.costPrice || 0)) * cartItem.qty;
        });
        return [
          new Date(s.date).toISOString().split('T')[0],
          s.invoiceNo,
          s.customerName.replace(/,/g, ''),
          s.subTotal,
          s.discountAmount,
          s.total,
          saleProfit
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenpos_sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const chartData = sales.slice(-7).map(s => ({
    name: new Date(s.date).toLocaleDateString(undefined, { weekday: 'short' }),
    Total: s.total
  }));

  return (
    <div className="space-y-8 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-app-text">INTELLIGENCE REPORTING</h1>
        </div>
        <button onClick={handleExportCSV} className="bg-app-surface border border-app-border px-5 py-2.5 rounded text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-app-border transition-all text-app-muted hover:text-app-text shadow-lg">
          <FileText size={16} /> DATA.EXPORT(CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportCards.map((card, i) => (
          <div key={i} className="bg-app-surface border border-app-border p-6 rounded-xl relative overflow-hidden group shadow-xl">
            <div className="relative z-10">
              <div className="w-10 h-10 rounded border border-app-border bg-app-bg flex items-center justify-center mb-4 text-[#6366f1]">
                {card.icon}
              </div>
              <p className="text-[10px] font-black text-app-muted uppercase tracking-[0.2em]">{card.title}</p>
              <h2 className="text-3xl font-black mt-2 text-app-text font-mono tracking-tighter">{card.value}</h2>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#6366f105] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
          </div>
        ))}
      </div>

      <div className="bg-app-surface border border-app-border rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-app-border bg-app-header flex items-center justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-app-muted flex items-center gap-2">
            <BarChart3 size={16} className="text-[#6366f1]" /> Sales Trajectory (Last 7 Days)
          </h3>
        </div>
        <div className="p-6 h-72">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#52525b" 
                  tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#52525b" 
                  tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => `Rs ${val}`}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{fill: '#27272a44'}}
                  contentStyle={{backgroundColor: '#0f0f10', border: '1px solid #27272a', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace'}}
                  itemStyle={{color: '#6366f1', fontWeight: 900}}
                />
                <Bar dataKey="Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-app-muted italic text-[10px] uppercase font-bold tracking-widest">
               Insufficient data points for visualization.
             </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-app-surface border border-app-border rounded-xl flex flex-col shadow-xl">
          <div className="p-4 border-b border-app-border bg-app-header flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-app-muted flex items-center gap-2">
              <ShoppingBag size={16} className="text-[#6366f1]" /> Transaction Feed 
            </h3>
            <span className="text-[9px] font-black text-app-muted uppercase tracking-widest">v2.4 Live</span>
          </div>
          <div className="p-4 space-y-2 flex-1">
             {sales.slice(-6).reverse().map(sale => (
               <div key={sale.id} className="flex items-center justify-between p-3 bg-app-bg border border-app-border rounded hover:border-[#6366f144] transition-all group">
                 <div className="flex flex-col gap-0.5">
                   <p className="text-[11px] font-black text-app-text uppercase tracking-tight">{sale.invoiceNo}</p>
                   <p className="text-[9px] font-mono text-app-muted uppercase">{new Date(sale.date).toLocaleDateString()}</p>
                 </div>
                 <p className="text-[11px] font-black text-[#6366f1] font-mono">{formatCurrency(sale.total)}</p>
               </div>
             ))}
             {sales.length === 0 && (
               <div className="py-20 text-center flex flex-col items-center gap-3">
                 <p className="text-[10px] font-black text-app-muted uppercase tracking-widest italic">Awaiting first settlement...</p>
                 <div className="w-16 h-0.5 bg-app-border rounded-full" />
               </div>
             )}
          </div>
        </div>

        <div className="bg-app-surface border border-app-border rounded-xl flex flex-col shadow-xl">
          <div className="p-4 border-b border-app-border bg-app-header flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ef4444] flex items-center gap-2">
              <Package size={16} /> Terminal Stock Alerts
            </h3>
            <span className="text-[9px] font-black text-[#ef4444] animate-pulse uppercase tracking-widest">Critical!</span>
          </div>
          <div className="p-4 space-y-2 flex-1">
             {items.filter(i => i.stock < i.lowStockValue).map(item => (
               <div key={item.id} className="flex items-center justify-between p-3 bg-app-bg border border-app-border rounded hover:border-[#ef444444] transition-all">
                 <p className="text-[11px] font-black text-app-text uppercase tracking-tight">{item.name}</p>
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

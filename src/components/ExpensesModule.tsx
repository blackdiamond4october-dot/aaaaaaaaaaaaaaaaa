import React, { useState } from 'react';
import { Save, Wallet, Calendar, Plus, ChevronRight, X } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { formatCurrency } from '../lib/utils';

export const ExpensesModule: React.FC = () => {
  const { expenses, setExpenses } = useStore();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [head, setHead] = useState('Rent');
  const [detail, setDetail] = useState('');
  const [amount, setAmount] = useState(0);

  const handleSave = () => {
    if (amount <= 0) return alert('Amount must be greater than 0');
    const newExpense = {
      id: Math.random().toString(36).substr(2, 9),
      date,
      head,
      detail,
      amount
    };
    setExpenses([newExpense, ...expenses]);
    setDetail('');
    setAmount(0);
    alert('Expense saved!');
  };

  const heads = ['Rent', 'Electricity', 'Water', 'Staff Salary', 'Internet', 'Others'];

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 xl:col-span-4">
        <div className="bg-[#1c1c1f] border border-[#27272a] rounded-xl p-6 h-fit sticky top-20 shadow-xl">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#a1a1aa] mb-8 flex items-center gap-2">
            <Wallet size={18} className="text-[#6366f1]" />
            Internal Resource Disbursement
          </h2>
          <div className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-[#52525b] uppercase tracking-wider block">Operational Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#0f0f10] border border-[#27272a] rounded px-4 py-3 outline-none focus:border-[#6366f155] text-[11px] font-bold uppercase tracking-wider text-[#f4f4f5]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-[#52525b] uppercase tracking-wider block">Disbursement Category</label>
              <select value={head} onChange={e => setHead(e.target.value)} className="w-full bg-[#0f0f10] border border-[#27272a] rounded px-4 py-3 outline-none focus:border-[#6366f155] text-[11px] font-black uppercase tracking-widest text-[#f4f4f5]">
                {heads.map(h => <option key={h} value={h}>{h.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-[#52525b] uppercase tracking-wider block">Magnitude (Rs)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="w-full bg-[#18181b] border border-[#27272a] rounded px-4 py-3 outline-none focus:border-[#ef444455] text-2xl font-black text-[#ef4444] font-mono text-center" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-[#52525b] uppercase tracking-wider block">Protocol Metadata</label>
              <textarea value={detail} onChange={e => setDetail(e.target.value)} placeholder="ENTER DISBURSEMENT RATIONALE..." className="w-full bg-[#0f0f10] border border-[#27272a] rounded px-4 py-3 outline-none focus:border-[#6366f155] text-[10px] font-bold uppercase tracking-wider h-32 resize-none placeholder-[#3f3f46]" />
            </div>
            <button onClick={handleSave} className="w-full bg-[#6366f1] hover:brightness-110 py-4 rounded font-black text-[11px] uppercase tracking-[0.3em] text-[#f4f4f5] shadow-lg shadow-[#6366f111] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <Save size={18} />
              COMMIT EXPENSE
            </button>
          </div>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-8">
        <div className="bg-[#1c1c1f] border border-[#27272a] rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#27272a] flex justify-between items-center bg-[#18181b]">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#a1a1aa]">Temporal Resource History</h3>
            <p className="text-[11px] font-black text-[#ef4444] font-mono tracking-tighter">SIGMA: {formatCurrency(expenses.reduce((acc, e) => acc+e.amount, 0))}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0f0f10]">
                <tr className="text-[10px] font-black uppercase text-[#a1a1aa] tracking-[0.25em] border-b border-[#27272a]">
                  <th className="px-6 py-4">T-Stamp</th>
                  <th className="px-6 py-4">Node Sector</th>
                  <th className="px-6 py-4">Metadata</th>
                  <th className="px-6 py-4 text-right">Magnitude</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]">
                {expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-[#27272a44] transition-colors border-b border-[#27272a]">
                    <td className="px-6 py-4 text-[10px] font-mono font-bold text-[#52525b] uppercase">{exp.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-sm bg-[#6366f111] border border-[#6366f133] text-[#6366f1] text-[9px] font-black uppercase tracking-widest">{exp.head}</span>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-[#a1a1aa] max-w-xs truncate uppercase tracking-wider">{exp.detail}</td>
                    <td className="px-6 py-4 text-right font-black text-[#ef4444] font-mono text-[11px]">{formatCurrency(exp.amount)}</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-[#52525b] italic text-[10px] font-black uppercase tracking-[0.2em]">Zero disbursement logs available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

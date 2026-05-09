import React, { useState } from 'react';
import { 
  Search, 
  Barcode, 
  Trash2, 
  Save, 
  UserCircle,
  Truck
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { Item, PurchaseItem, Supplier } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const PurchaseModule: React.FC = () => {
  const { items, suppliers, purchases, setPurchases } = useStore();
  const [cart, setCart] = useState<PurchaseItem[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);

  const subTotal = cart.reduce((acc, item) => acc + item.total, 0);
  const totalPayable = subTotal;
  const balance = totalPayable - paidAmount;

  const addItemToCart = (item: Item) => {
    const existing = cart.find(c => c.itemId === item.id);
    if (existing) {
      setCart(cart.map(c => c.itemId === item.id ? { ...c, qty: c.qty + 1, total: (c.qty + 1) * c.costPrice } : c));
    } else {
      setCart([...cart, {
        itemId: item.id,
        name: item.name,
        qty: 1,
        costPrice: item.costPrice,
        discount: 0,
        total: item.costPrice
      }]);
    }
    setSearchQuery('');
  };

  const handleSave = () => {
    if (cart.length === 0 || !selectedSupplier) return alert('Select Supplier and add items');
    const newPurchase = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNo: `PUR-${purchases.length + 1000}`,
      date: new Date().toISOString(),
      supplierId: selectedSupplier.id,
      items: cart,
      subTotal,
      total: totalPayable,
      paid: paidAmount,
      balance,
      status: 'COMPLETED' as const
    };
    setPurchases([...purchases, newPurchase]);
    setCart([]);
    setSelectedSupplier(null);
    setPaidAmount(0);
    alert('Purchase Recorded!');
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
      <div className="col-span-12 xl:col-span-8 bg-[#1c1c1f] border border-[#27272a] rounded-xl flex flex-col overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#27272a] bg-[#18181b] flex justify-between items-center group">
          <button className="flex items-center gap-2 bg-[#6366f111] text-[#6366f1] px-4 py-2 rounded border border-[#6366f122] text-[10px] font-black uppercase tracking-widest hover:bg-[#6366f122] transition-all">
            <UserCircle size={16} />
            {selectedSupplier ? selectedSupplier.name : 'AUTHENTICATE SUPPLIER (F1)'}
          </button>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
             <span className="text-[9px] font-black text-[#52525b] uppercase tracking-widest">Inbound Node Active</span>
          </div>
        </div>
        <div className="p-4 border-b border-[#27272a] flex gap-4 bg-[#0f0f10]/50 relative z-20">
          <div className="relative flex-1 group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b] group-focus-within:text-[#6366f1] transition-colors" />
            <input 
              type="text" 
              placeholder="SCAN UID OR RECORD DESCRIPTOR..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f0f10] border border-[#27272a] rounded px-4 py-2.5 pl-10 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-[#6366f155] transition-all" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence>
            {searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-x-0 top-0 bg-[#18181b] border-b border-[#27272a] z-50 p-2 space-y-1 shadow-2xl"
              >
                {items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map(i => (
                  <button key={i.id} onClick={() => addItemToCart(i)} className="w-full p-3 bg-[#0f0f10] hover:bg-[#27272a] rounded border border-[#27272a] text-left flex justify-between items-center group transition-all">
                    <span className="text-[11px] font-black text-[#a1a1aa] group-hover:text-[#f4f4f5] uppercase tracking-tight">{i.name}</span>
                    <span className="font-mono text-[10px] text-[#22c55e] font-bold">COST: {formatCurrency(i.costPrice)}</span>
                  </button>
                ))}
                {items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div className="p-4 text-center text-[#52525b] text-[10px] font-black uppercase tracking-widest italic">Zero matches in sector</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <table className="w-full text-left">
            <thead className="bg-[#0f0f10] sticky top-0 z-10">
              <tr className="text-[10px] font-black uppercase text-[#a1a1aa] tracking-[0.2em] border-b border-[#27272a]">
                <th className="px-6 py-4">Component Descriptor</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Unit Cost</th>
                <th className="px-6 py-4 text-right">Sigma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {cart.map(item => (
                <tr key={item.itemId} className="hover:bg-[#27272a44] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-black text-[#f4f4f5] uppercase tracking-tight">{item.name}</p>
                    <p className="text-[9px] font-mono text-[#52525b] mt-0.5">ID: {item.itemId.substring(0, 8)}</p>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-mono font-bold text-[#f4f4f5]">{item.qty}</td>
                  <td className="px-6 py-4 text-[11px] font-mono text-[#a1a1aa]">{formatCurrency(item.costPrice)}</td>
                  <td className="px-6 py-4 text-[11px] font-mono text-right font-black text-[#f4f4f5]">{formatCurrency(item.total)}</td>
                </tr>
              ))}
              {cart.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-[#52525b] italic text-[10px] font-black uppercase tracking-[0.2em]">Inbound buffer empty. Awaiting data stream.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
        <div className="bg-[#1c1c1f] border border-[#27272a] rounded-xl p-6 flex flex-col gap-6 shadow-xl">
          <div className="p-5 bg-[#0f0f10] rounded border border-[#27272a] shadow-inner relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform">
               <Truck size={64} className="rotate-12" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#52525b]">Aggregated Cost Basis</p>
             <p className="text-4xl font-black text-[#6366f1] mt-1 font-mono tracking-tighter">{formatCurrency(totalPayable)}</p>
          </div>
          <div className="flex-1 space-y-5">
             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-black text-[#52525b] uppercase tracking-wider">Originating Node (Supplier)</label>
               <select 
                 onChange={e => setSelectedSupplier(suppliers.find(s => s.id === e.target.value) || null)} 
                 className="w-full bg-[#0f0f10] border border-[#27272a] rounded p-2.5 outline-none text-[11px] font-black uppercase tracking-widest text-[#f4f4f5] focus:border-[#6366f155]"
               >
                 <option value="">-- UNKNOWN ORIGIN --</option>
                 {suppliers.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>)}
               </select>
             </div>
             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-black text-[#52525b] uppercase tracking-wider">Settlement Magnitude</label>
               <input 
                 type="number" 
                 value={paidAmount} 
                 onChange={e => setPaidAmount(parseFloat(e.target.value) || 0)} 
                 className="w-full bg-[#18181b] border border-[#27272a] rounded p-4 text-center text-3xl font-black text-[#22c55e] outline-none font-mono focus:border-[#22c55e55]" 
               />
             </div>
             <div className="flex justify-between items-center bg-[#0f0f10] p-4 rounded border border-[#27272a] shadow-inner">
               <span className="text-[10px] font-black text-[#52525b] uppercase tracking-wider">Outstanding Flux</span>
               <span className="text-lg font-black text-[#ef4444] font-mono">{formatCurrency(balance)}</span>
             </div>
          </div>
          <button 
            onClick={handleSave} 
            className="w-full bg-[#6366f1] text-[#f4f4f5] py-4 rounded font-black text-[11px] uppercase tracking-[0.3em] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#6366f111]"
          >
            EXECUTE INBOUND COMMIT
          </button>
        </div>
        <div className="bg-[#6366f111] border border-[#6366f122] p-4 rounded-xl flex items-center gap-4">
           <div className="w-10 h-10 rounded bg-[#6366f122] flex items-center justify-center text-[#6366f1] shrink-0 border border-[#6366f144]">
             <Save size={20} />
           </div>
           <div>
             <p className="text-[10px] font-black text-[#6366f1] uppercase tracking-widest">Inventory Log Alpha</p>
             <p className="text-[9px] text-[#a1a1aa] font-bold uppercase tracking-wider mt-0.5 italic">Ready for ledger entry</p>
           </div>
        </div>
      </div>
    </div>
  );
};

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
  const { items, setItems, suppliers, purchases, setPurchases, units } = useStore();
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
    if (cart.length === 0) return alert('Cannot execute: Cart is empty');
    
    // Increment Stock
    const updatedItems = items.map(item => {
      const cartItem = cart.find(c => c.itemId === item.id);
      if (cartItem) {
        return { ...item, stock: (item.stock || 0) + cartItem.qty, costPrice: cartItem.costPrice };
      }
      return item;
    });
    setItems(updatedItems);
    
    const newPurchase = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNo: `PUR-${purchases.length + 1000}`,
      date: new Date().toISOString(),
      supplierId: selectedSupplier?.id || 'walk-in',
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
      <div className="col-span-12 xl:col-span-8 bg-app-surface border border-app-border rounded-xl flex flex-col overflow-hidden shadow-xl">
        <div className="p-4 border-b border-app-border bg-app-header flex justify-between items-center group">
          <button className="flex items-center gap-2 bg-[#6366f111] text-[#6366f1] px-4 py-2 rounded border border-[#6366f122] text-[10px] font-black uppercase tracking-widest hover:bg-[#6366f122] transition-all">
            <UserCircle size={16} />
            {selectedSupplier ? selectedSupplier.name : 'AUTHENTICATE SUPPLIER (F1)'}
          </button>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
             <span className="text-[9px] font-black text-app-muted uppercase tracking-widest">Inbound Node Active</span>
          </div>
        </div>
        <div className="p-4 border-b border-app-border flex gap-4 bg-app-bg/50 relative z-20">
          <div className="relative flex-1 group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-[#6366f1] transition-colors" />
            <input 
              type="text" 
              placeholder="SCAN UID OR RECORD DESCRIPTOR..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-app-bg border border-app-border rounded px-4 py-2.5 pl-10 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-[#6366f155] transition-all" 
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
                className="absolute inset-x-0 top-0 bg-app-header border-b border-app-border z-50 p-2 space-y-1 shadow-2xl"
              >
                {items.filter(i => i.name?.toLowerCase().includes(searchQuery.toLowerCase())).map(i => (
                  <button key={i.id} onClick={() => addItemToCart(i)} className="w-full p-3 bg-app-bg hover:bg-app-border rounded border border-app-border text-left flex justify-between items-center group transition-all">
                    <span className="text-[11px] font-black text-app-muted group-hover:text-app-text uppercase tracking-tight">{i.name} {units.find(u => u.id === i.unitId) ? `(${units.find(u => u.id === i.unitId)?.name})` : ''}</span>
                    <span className="font-mono text-[10px] text-[#22c55e] font-bold">COST: {formatCurrency(i.costPrice)}</span>
                  </button>
                ))}
                {items.filter(i => i.name?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div className="p-4 text-center text-app-muted text-[10px] font-black uppercase tracking-widest italic">Zero matches in sector</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <table className="w-full text-left">
            <thead className="bg-app-bg sticky top-0 z-10">
              <tr className="text-[10px] font-black uppercase text-app-muted tracking-[0.2em] border-b border-app-border">
                <th className="px-6 py-4">Component Descriptor</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Unit Cost</th>
                <th className="px-6 py-4 text-right">Sigma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {cart.map(item => (
                <tr key={item.itemId} className="hover:bg-app-border/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-black text-app-text uppercase tracking-tight">
                      {item.name} 
                      {(() => {
                         const registryItem = items.find(i => i.id === item.itemId);
                         const unit = registryItem?.unitId ? units.find(u => u.id === registryItem.unitId) : null;
                         return unit ? ` (${unit.name})` : '';
                      })()}
                    </p>
                    <p className="text-[9px] font-mono text-app-muted mt-0.5">ID: {item.itemId.substring(0, 8)}</p>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-mono font-bold text-app-text">{item.qty}</td>
                  <td className="px-6 py-4 text-[11px] font-mono text-app-muted">{formatCurrency(item.costPrice)}</td>
                  <td className="px-6 py-4 text-[11px] font-mono text-right font-black text-app-text">{formatCurrency(item.total)}</td>
                </tr>
              ))}
              {cart.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-app-muted italic text-[10px] font-black uppercase tracking-[0.2em]">Inbound buffer empty. Awaiting data stream.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
        <div className="bg-app-surface border border-app-border rounded-xl p-6 flex flex-col gap-6 shadow-xl">
          <div className="p-5 bg-app-bg rounded border border-app-border shadow-inner relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform">
               <Truck size={64} className="rotate-12" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.25em] text-app-muted">Aggregated Cost Basis</p>
             <p className="text-4xl font-black text-[#6366f1] mt-1 font-mono tracking-tighter">{formatCurrency(totalPayable)}</p>
          </div>
          <div className="flex-1 space-y-5">
             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-black text-app-muted uppercase tracking-wider">Originating Node (Supplier)</label>
               <select 
                 onChange={e => setSelectedSupplier(suppliers.find(s => s.id === e.target.value) || null)} 
                 className="w-full bg-app-bg border border-app-border rounded p-2.5 outline-none text-[11px] font-black uppercase tracking-widest text-app-text focus:border-[#6366f155]"
               >
                 <option value="">-- UNKNOWN ORIGIN --</option>
                 {suppliers.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>)}
               </select>
             </div>
             <div className="flex flex-col gap-1.5">
               <label className="text-[10px] font-black text-app-muted uppercase tracking-wider">Settlement Magnitude</label>
               <input 
                 type="number" 
                 value={paidAmount} 
                 onChange={e => setPaidAmount(parseFloat(e.target.value) || 0)} 
                 className="w-full bg-app-header border border-app-border rounded p-4 text-center text-3xl font-black text-[#22c55e] outline-none font-mono focus:border-[#22c55e55]" 
               />
             </div>
             <div className="flex justify-between items-center bg-app-bg p-4 rounded border border-app-border shadow-inner">
               <span className="text-[10px] font-black text-app-muted uppercase tracking-wider">Outstanding Flux</span>
               <span className="text-lg font-black text-[#ef4444] font-mono">{formatCurrency(balance)}</span>
             </div>
          </div>
          <button 
            onClick={handleSave} 
            className="w-full bg-[#6366f1] text-app-text py-4 rounded font-black text-[11px] uppercase tracking-[0.3em] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#6366f111]"
          >
            EXECUTE INBOUND COMMIT
          </button>
        </div>

      </div>
    </div>
  );
};

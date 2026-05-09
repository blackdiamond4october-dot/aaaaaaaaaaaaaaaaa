import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Barcode, 
  Plus, 
  Trash2, 
  DollarSign, 
  Printer, 
  Save, 
  X, 
  Pause, 
  Maximize2,
  ChevronDown,
  User,
  Tags,
  Image as ImageIcon,
  CreditCard
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { Item, SaleItem, Customer } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const SaleModule: React.FC = () => {
  const { items, customers, setSales, sales, settings } = useStore();
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedType, setSelectedType] = useState<'Sale' | 'Sale Order'>('Sale');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountRs, setDiscountRs] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [otherCharges, setOtherCharges] = useState(0);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);
  const [lastAddedItemId, setLastAddedItemId] = useState<string | null>(null);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setShowCustomerSearch(true);
      } else if (e.key === 'F2') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[placeholder*="Search Item"]')?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        duplicateLastItem();
      } else if (e.key === 'F5') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, lastAddedItemId]); // Re-bind when cart or last item changes

  const duplicateLastItem = () => {
    if (!lastAddedItemId) return;
    const item = items.find(i => i.id === lastAddedItemId);
    if (item) {
      addItemToCart(item);
    }
  };
  const subTotal = cart.reduce((acc, item) => acc + item.total, 0);
  const discountFromPercent = (subTotal * discountPercent) / 100;
  const discountTotal = discountRs + discountFromPercent;
  const totalPayable = subTotal - discountTotal + otherCharges;
  const change = paidAmount > totalPayable ? paidAmount - totalPayable : 0;

  const addItemToCart = (item: Item) => {
    setLastAddedItemId(item.id);
    const existing = cart.find(c => c.itemId === item.id);
    if (existing) {
      setCart(cart.map(c => c.itemId === item.id ? { ...c, qty: c.qty + 1, total: (c.qty + 1) * c.price } : c));
    } else {
      setCart([...cart, {
        itemId: item.id,
        name: item.name,
        qty: 1,
        price: item.salePrice,
        discount: item.defaultDisc,
        total: item.salePrice
      }]);
    }
    setSearchQuery('');
  };

  const handleBarcodeScan = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find(i => i.barcode === barcodeInput);
    if (item) {
      addItemToCart(item);
      setBarcodeInput('');
    } else {
      alert('Product not found in registry');
      setBarcodeInput('');
    }
  };

  const removeItem = (id: string) => setCart(cart.filter(c => c.itemId !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart(cart.map(c => c.itemId === id ? { ...c, qty, total: qty * c.price } : c));
  };

  const { setItems } = useStore();

  const handleSave = () => {
    if (cart.length === 0) return alert('Cart is empty');
    
    // Deduct Stock
    const updatedItems = items.map(item => {
      const cartItem = cart.find(c => c.itemId === item.id);
      if (cartItem) {
        return { ...item, stock: (item.stock || 0) - cartItem.qty };
      }
      return item;
    });
    setItems(updatedItems);

    const newSale = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNo: `INV-${sales.length + 1000}`,
      date: new Date().toISOString(),
      customerId: selectedCustomer?.id || 'walk-in',
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      items: cart,
      subTotal,
      discountAmount: discountTotal,
      taxAmount: 0,
      otherCharges,
      total: totalPayable,
      paid: paidAmount,
      change,
      paymentMethod,
      status: 'COMPLETED' as const
    };

    setSales([...sales, newSale]);
    setLastSale(newSale);
    setShowReceipt(true);
    
    // Reset state
    setCart([]);
    setSelectedCustomer(null);
    setPaidAmount(0);
    setDiscountPercent(0);
    setDiscountRs(0);
    setOtherCharges(0);
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.barcode.includes(searchQuery)
  );

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
      <div className="col-span-12 xl:col-span-8 flex flex-col gap-4">
        <div className="bg-app-surface border border-app-border rounded-xl flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-app-border flex items-center justify-between bg-app-header">
            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-app-muted font-bold">Transaction Type</label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="bg-app-bg border border-app-border rounded px-3 py-1.5 text-xs outline-none w-32 focus:border-[#6366f155] transition-all text-app-text"
                >
                  <option>Sale</option>
                  <option>Order</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-app-muted font-bold">Customer (F1)</label>
                <button 
                  onClick={() => setShowCustomerSearch(true)}
                  className="flex items-center gap-4 bg-app-bg border border-app-border rounded px-3 py-1.5 text-xs min-w-[180px] hover:border-[#6366f155] transition-all group"
                >
                  <span className="font-medium text-app-text">{selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}</span>
                  <ChevronDown size={12} className="ml-auto opacity-30 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-app-surface rounded text-app-muted transition-colors"><X size={16} /></button>
              <button className="p-1.5 hover:bg-app-surface rounded text-app-muted transition-colors"><Tags size={16} /></button>
            </div>
          </div>

          <div className="p-3 border-b border-app-border flex gap-3 bg-app-header">
            <div className="flex-1 relative flex items-center bg-app-bg rounded border border-app-border px-3 py-1.5 focus-within:border-[#6366f155] transition-all group">
              <Search size={14} className="text-app-muted mr-2 transition-colors group-focus-within:text-[#6366f1]" />
              <input 
                type="text" 
                placeholder="Search Item by Name or Code (F2)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs w-full outline-none placeholder-app-muted text-app-text"
              />
              {searchQuery && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-app-header border border-app-border rounded shadow-2xl z-50 max-h-64 overflow-y-auto">
                  {filteredItems.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => addItemToCart(item)}
                      className="w-full flex items-center justify-between p-3 hover:bg-app-surface text-left transition-colors border-b border-app-border last:border-0"
                    >
                      <div>
                        <p className="text-xs font-bold text-app-text">{item.name}</p>
                        <p className="text-[10px] text-app-muted font-mono">{item.barcode}</p>
                      </div>
                      <p className="text-xs font-bold text-[#6366f1] font-mono">{formatCurrency(item.salePrice)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <form onSubmit={handleBarcodeScan} className="hidden sm:flex w-48 items-center bg-app-bg rounded border border-app-border px-3 py-1.5 focus-within:border-[#6366f155] transition-all group">
              <Barcode size={14} className="text-app-muted mr-2 group-focus-within:text-[#6366f1]" />
              <input 
                type="text" 
                placeholder="Scan Barcode" 
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="bg-transparent border-none text-xs w-full outline-none placeholder-app-muted text-app-text" 
              />
            </form>
            
            <button 
              onClick={duplicateLastItem}
              disabled={!lastAddedItemId}
              className={cn(
                "hidden sm:flex items-center gap-2 px-4 py-1.5 rounded border text-[10px] font-black uppercase tracking-widest transition-all",
                lastAddedItemId 
                  ? "bg-[#6366f111] border-[#6366f133] text-[#6366f1] hover:bg-[#6366f122]" 
                  : "bg-app-bg border-app-border text-app-muted cursor-not-allowed opacity-50"
              )}
            >
              <Plus size={12} />
              Repeat Last (F4)
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-app-surface">
            <table className="w-full text-left border-collapse">
              <thead className="bg-app-header sticky top-0 z-10">
                <tr className="text-[10px] uppercase tracking-[0.15em] text-app-muted font-bold border-b border-app-border">
                  <th className="px-4 py-3">Item Detail</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-app-border">
                {cart.map((item) => (
                  <tr key={item.itemId} className="hover:bg-app-bg transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-app-text">{item.name}</span>
                        <span className="text-[10px] text-app-muted font-mono uppercase">ID: {item.itemId.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => updateQty(item.itemId, item.qty-1)} className="w-6 h-6 bg-app-bg border border-app-border rounded flex items-center justify-center hover:bg-app-surface transition-all text-app-text">-</button>
                        <span className="text-[12px] font-black w-8 text-center font-mono">{item.qty}</span>
                        <button onClick={() => updateQty(item.itemId, item.qty+1)} className="w-6 h-6 bg-app-bg border border-app-border rounded flex items-center justify-center hover:bg-app-surface transition-all text-app-text">+</button>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-app-muted">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-4 text-right font-mono font-bold text-[#6366f1]">{formatCurrency(item.total)}</td>
                    <td className="px-4 py-4 text-center">
                      <button onClick={() => removeItem(item.itemId)} className="text-[#ef4444] opacity-30 hover:opacity-100 transition-opacity">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
        <div className="bg-app-surface border border-app-border rounded-xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex justify-between text-xs text-app-muted font-bold uppercase tracking-wider">
            <span>Sub Total</span>
            <span className="font-mono">{formatCurrency(subTotal)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
               <label className="text-[10px] uppercase tracking-wider text-app-muted font-bold">Discount (Rs)</label>
               <input 
                  type="number" 
                  value={discountRs} 
                  onChange={(e) => setDiscountRs(parseFloat(e.target.value) || 0)}
                  className="bg-app-bg border border-app-border rounded px-3 py-2 text-xs font-mono outline-none focus:border-[#ef444455] transition-all text-app-text" 
                />
            </div>
            <div className="flex flex-col gap-1.5">
               <label className="text-[10px] uppercase tracking-wider text-app-muted font-bold">Discount (%)</label>
               <input 
                  type="number" 
                  value={discountPercent} 
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  className="bg-app-bg border border-app-border rounded px-3 py-2 text-xs font-mono outline-none focus:border-[#ef444455] transition-all text-app-text" 
                />
            </div>
          </div>
          
          <div className="h-[1px] bg-app-border my-1"></div>
          
          <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase font-black text-[#6366f1] tracking-[0.2em]">Total Payable (Rs)</p>
            <p className="text-4xl font-mono font-black text-app-text">{formatCurrency(totalPayable)}</p>
          </div>
        </div>

        <div className="flex-1 bg-app-surface border border-app-border rounded-xl p-5 flex flex-col gap-5 shadow-xl overflow-hidden">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-app-muted font-bold">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setPaymentMethod('Cash')}
                className={cn(
                  "p-3 rounded border flex flex-col items-center gap-1 transition-all",
                  paymentMethod === 'Cash' 
                    ? "bg-[#6366f1] border-[#6366f1] text-white" 
                    : "bg-app-bg border-app-border text-app-muted hover:border-[#52525b]"
                )}
              >
                <DollarSign size={16} />
                <span className="text-[9px] font-black uppercase">Cash</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('Card')}
                className={cn(
                  "p-3 rounded border flex flex-col items-center gap-1 transition-all",
                  paymentMethod === 'Card' 
                    ? "bg-[#6366f1] border-[#6366f1] text-white" 
                    : "bg-app-bg border-app-border text-app-muted hover:border-[#52525b]"
                )}
              >
                <CreditCard size={16} />
                <span className="text-[9px] font-black uppercase">Card</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-auto">
            <div className="flex justify-between items-end">
              <label className="text-[10px] uppercase tracking-wider text-app-muted font-bold">Received Amount</label>
              <span className="text-[10px] text-[#22c55e] font-black font-mono italic">BAL: {formatCurrency(change)}</span>
            </div>
            <input 
              type="number" 
              value={paidAmount}
              onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
              className="bg-app-bg border border-app-border rounded px-4 py-3 text-3xl font-mono text-app-text outline-none focus:border-[#6366f1] shadow-inner" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={handleSave}
              className="w-full bg-[#22c55e] text-[#0f0f10] font-black rounded py-4 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#22c55e11]"
            >
              <Printer size={18} />
              PAY & PRINT (F5)
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-app-border text-app-text text-[10px] font-black py-2.5 rounded uppercase hover:opacity-80 transition-colors">HOLD (F8)</button>
              <button className="border border-[#ef444444] text-[#ef4444] text-[10px] font-black py-2.5 rounded uppercase hover:bg-[#ef444411] transition-colors">VOID (F12)</button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCustomerSearch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-app-surface border border-app-border rounded shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="p-4 border-b border-app-border flex justify-between items-center bg-app-header">
                <p className="text-[11px] font-black uppercase tracking-widest text-app-muted">Select Registry Entity</p>
                <X size={18} className="cursor-pointer text-app-muted hover:text-[#ef4444]" onClick={() => setShowCustomerSearch(false)} />
              </div>
              <div className="p-3 space-y-1">
                <button onClick={() => { setSelectedCustomer(null); setShowCustomerSearch(false); }} className="w-full p-3 bg-app-bg border border-app-border rounded text-left hover:bg-app-surface transition-all font-bold text-[11px] uppercase tracking-wider text-[#6366f1]">Walk-in Customer</button>
                <div className="max-h-64 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-app-border">
                  {customers.map(c => (
                    <button key={c.id} onClick={() => { setSelectedCustomer(c); setShowCustomerSearch(false); }} className="w-full p-3 bg-app-bg border border-app-border rounded text-left hover:bg-app-surface transition-all text-[11px] font-bold text-app-text">
                      {c.name}
                      <span className="block text-[9px] text-app-muted font-mono mt-0.5">{c.phone}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showReceipt && lastSale && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-white text-black w-full max-w-sm rounded p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] font-mono text-[10px] space-y-4"
              id="printable-receipt"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto mb-2 bg-black rounded flex items-center justify-center overflow-hidden">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} className="w-full h-full object-cover invert" alt="Logo" />
                  ) : (
                    <span className="text-white font-black text-xl">{settings.companyName.charAt(0)}</span>
                  )}
                </div>
                <h2 className="text-sm font-black uppercase tracking-tighter">{settings.companyName}</h2>
                <p className="opacity-70 leading-tight">{settings.address}</p>
                <p className="opacity-70">PH: {settings.phone}</p>
              </div>

              <div className="border-t border-b border-black border-dashed py-2 space-y-1">
                <div className="flex justify-between">
                  <span>INV NO:</span>
                  <span>{lastSale.invoiceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span>{new Date(lastSale.date).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>CLIENT:</span>
                  <span className="uppercase">{lastSale.customerName}</span>
                </div>
              </div>

              <table className="w-full">
                <thead className="border-b border-black border-dashed">
                  <tr>
                    <th className="text-left font-black pb-1">ITEM</th>
                    <th className="text-center font-black pb-1">QTY</th>
                    <th className="text-right font-black pb-1">AMT</th>
                  </tr>
                </thead>
                <tbody className="pt-1">
                  {lastSale.items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="py-1 uppercase">{item.name}</td>
                      <td className="py-1 text-center">x{item.qty}</td>
                      <td className="py-1 text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-black border-dashed pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span>{formatCurrency(lastSale.subTotal)}</span>
                </div>
                {lastSale.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span>DISCOUNT:</span>
                    <span>-{formatCurrency(lastSale.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-[12px]">
                  <span>NET TOTAL:</span>
                  <span>{formatCurrency(lastSale.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>RECEIVED:</span>
                  <span>{formatCurrency(lastSale.paid)}</span>
                </div>
                <div className="flex justify-between italic">
                  <span>RETURN BAL:</span>
                  <span>{formatCurrency(lastSale.change)}</span>
                </div>
              </div>

              <div className="text-center pt-4 space-y-1">
                <p className="font-black uppercase tracking-widest text-[9px]">Thank You For Visiting</p>
                <p className="opacity-50">Soft powered by ZEN-CORE OS</p>
              </div>

              <div className="pt-6 flex flex-col gap-2 no-print">
                <button 
                  onClick={() => window.print()}
                  className="w-full bg-black text-white py-3 rounded font-black text-xs uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-2"
                >
                  <Printer size={14} />
                  Print Hardcopy
                </button>
                <button 
                  onClick={() => setShowReceipt(false)}
                  className="w-full border border-black/20 py-2.5 rounded font-black text-[9px] uppercase tracking-widest hover:bg-black/5"
                >
                  Close Terminal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

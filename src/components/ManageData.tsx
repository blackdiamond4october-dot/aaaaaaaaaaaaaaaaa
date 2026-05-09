import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Search, 
  X,
  Package,
  Barcode,
  Users,
  UserCircle,
  Tag,
  Scale
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { Item, Customer, Supplier, Category, Unit } from '../types';
import { cn, formatCurrency } from '../lib/utils';

export const ManageData: React.FC<{ type: 'ITEMS' | 'CUSTOMERS' | 'SUPPLIERS' | 'CATEGORIES' | 'UNITS' }> = ({ type }) => {
  const { 
    items, setItems, 
    customers, setCustomers, 
    suppliers, setSuppliers, 
    categories, setCategories, 
    units, setUnits 
  } = useStore();

  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const [barcodeScan, setBarcodeScan] = useState('');

  const handleBarcodeStockAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find(i => i.barcode === barcodeScan);
    if (item) {
      setItems(items.map(i => i.id === item.id ? { ...i, stock: (i.stock || 0) + 1 } : i));
      setBarcodeScan('');
    } else {
      alert('Product not found. Please create it first.');
      setBarcodeScan('');
    }
  };

  const handleSave = () => {
    const id = editingId || Math.random().toString(36).substr(2, 9);
    const newData = { ...formData, id };

    if (type === 'ITEMS') {
      if (editingId) setItems(items.map(i => i.id === editingId ? newData : i));
      else setItems([...items, newData as Item]);
    } else if (type === 'CUSTOMERS') {
      if (editingId) setCustomers(customers.map(c => c.id === editingId ? newData : c));
      else setCustomers([...customers, newData]);
    } else if (type === 'SUPPLIERS') {
      if (editingId) setSuppliers(suppliers.map(s => s.id === editingId ? newData : s));
      else setSuppliers([...suppliers, newData]);
    } else if (type === 'CATEGORIES') {
      if (editingId) setCategories(categories.map(c => c.id === editingId ? newData : c));
      else setCategories([...categories, newData as Category]);
    } else if (type === 'UNITS') {
      if (editingId) setUnits(units.map(u => u.id === editingId ? newData : u));
      else setUnits([...units, newData]);
    }

    setFormData({});
    setEditingId(null);
  };

  const currentList = type === 'ITEMS' ? items : 
                    type === 'CUSTOMERS' ? customers : 
                    type === 'SUPPLIERS' ? suppliers : 
                    type === 'CATEGORIES' ? categories : units;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tighter capitalize text-app-text">{type.toLowerCase()} REGISTRY</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-app-muted mt-1 italic">Master node data synchronization</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Form Panel */}
        <div className="col-span-12 xl:col-span-4 space-y-4">
          {type === 'ITEMS' && (
            <div className="bg-[#6366f111] border border-[#6366f133] rounded-xl p-4 shadow-lg">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] mb-3 flex items-center gap-2">
                <Barcode size={14} />
                Fast Stock Increment (Scan Only)
              </h4>
              <form onSubmit={handleBarcodeStockAdd} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Scan to +1 stock..." 
                  value={barcodeScan}
                  onChange={e => setBarcodeScan(e.target.value)}
                  className="flex-1 bg-app-bg border border-app-border rounded px-3 py-1.5 text-xs font-mono outline-none focus:border-[#6366f1] text-app-text" 
                />
              </form>
            </div>
          )}
          <div className="bg-app-surface border border-app-border rounded-xl p-5 sticky top-20 shadow-xl">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-app-muted mb-6 flex items-center gap-2">
              <Plus size={16} className="text-[#6366f1]" />
              {editingId ? 'Modify Record' : 'Append New Record'}
            </h3>
            <div className="space-y-4">
              {type === 'ITEMS' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Item Identifier</label>
                    <input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-xs text-app-text focus:border-[#6366f155] outline-none transition-all placeholder-app-muted" placeholder="Ex: Premium Arabica" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Cost Basis</label>
                      <input type="number" value={formData.costPrice || ''} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-xs font-mono text-app-text outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Mkt Price</label>
                      <input type="number" value={formData.salePrice || ''} onChange={e => setFormData({...formData, salePrice: parseFloat(e.target.value)})} className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-xs font-mono text-[#22c55e] outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Available Stock</label>
                      <input type="number" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-xs font-mono text-[#6366f1] outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Universal Barcode</label>
                      <input value={formData.barcode || ''} onChange={e => setFormData({...formData, barcode: e.target.value})} className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-xs font-mono text-app-muted outline-none" />
                    </div>
                  </div>
                </>
              )}
              {(type === 'CUSTOMERS' || type === 'SUPPLIERS') && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Entity Name</label>
                    <input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-xs outline-none text-app-text" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Contact Line</label>
                    <input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-xs font-mono outline-none text-app-text" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Physical Address</label>
                    <textarea value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-xs outline-none h-20 resize-none text-app-text" />
                  </div>
                </>
              )}
              {(type === 'CATEGORIES' || type === 'UNITS') && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-app-muted uppercase tracking-wider block">Classification</label>
                  <input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-xs outline-none text-app-text" />
                </div>
              )}
              
              <button 
                onClick={handleSave} 
                className="w-full bg-[#6366f1] text-white py-3 rounded font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 mt-4 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#6366f111]"
              >
                <Save size={16} />
                {editingId ? 'Push Update' : 'Commit Record'}
              </button>
              {editingId && (
                <button 
                  onClick={() => { setFormData({}); setEditingId(null); }} 
                  className="w-full bg-app-header border border-app-border py-2.5 rounded text-[9px] font-black uppercase tracking-wider text-[#ef4444] mt-2 hover:bg-[#ef444411] transition-all"
                >
                  Terminate Adjustment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List Panel */}
        <div className="col-span-12 xl:col-span-8">
          <div className="bg-app-surface border border-app-border rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-app-border bg-app-header flex items-center justify-between">
              <div className="relative w-64 group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted group-focus-within:text-[#6366f1] transition-colors" />
                <input type="text" placeholder={`Filter ${type.toLowerCase()} registry...`} className="w-full bg-app-bg border border-app-border rounded-full py-1.5 pl-9 pr-4 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-[#6366f155] transition-all placeholder-app-muted text-app-text" />
              </div>
              <p className="text-[10px] font-black text-app-muted uppercase tracking-widest">Logged entities: {currentList.length}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-app-bg">
                  <tr className="text-[10px] font-black uppercase text-app-muted tracking-[0.2em] border-b border-app-border">
                    <th className="px-6 py-4">Descriptor</th>
                    {type === 'ITEMS' && <th className="px-6 py-4">Valuation</th>}
                    {type === 'ITEMS' && <th className="px-6 py-4">Stock</th>}
                    {type === 'ITEMS' && <th className="px-6 py-4">B-Code</th>}
                    {(type === 'CUSTOMERS' || type === 'SUPPLIERS') && <th className="px-6 py-4">Comm Line</th>}
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  {currentList.map((item: any) => (
                    <tr key={item.id} className="hover:bg-app-bg transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-[11px] font-black text-app-text uppercase tracking-tight">{item.name}</p>
                        {item.address && <p className="text-[9px] text-app-muted font-bold uppercase tracking-wider mt-0.5">{item.address}</p>}
                      </td>
                      {type === 'ITEMS' && <td className="px-6 py-4 font-mono text-[11px] text-[#22c55e] font-bold">{formatCurrency(item.salePrice)}</td>}
                      {type === 'ITEMS' && (
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-1 rounded text-[9px] font-black font-mono",
                            item.stock <= 5 ? "bg-[#ef444422] text-[#ef4444]" : "bg-[#22c55e22] text-[#22c55e]"
                          )}>
                            {item.stock}
                          </span>
                        </td>
                      )}
                      {type === 'ITEMS' && <td className="px-6 py-4 text-[10px] font-mono text-app-muted">{item.barcode}</td>}
                      {(type === 'CUSTOMERS' || type === 'SUPPLIERS') && <td className="px-6 py-4 text-[11px] font-mono font-bold text-app-text">{item.phone}</td>}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => { setFormData(item); setEditingId(item.id); }} className="text-app-muted hover:text-[#6366f1] text-[9px] font-black uppercase tracking-widest transition-colors">Adjust</button>
                          <button className="text-app-muted hover:text-[#ef4444] text-[9px] font-black uppercase tracking-widest transition-colors">Purge</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentList.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-6 py-20 text-center text-app-muted italic text-[10px] font-bold uppercase tracking-[0.2em] bg-app-header/50">
                        Zero data points detected in sector.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

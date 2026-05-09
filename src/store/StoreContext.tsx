import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Category, Unit, Item, Supplier, Customer, Sale, Purchase, 
  Expense, Reminder, AppSettings, View 
} from '../types';

interface StoreContextType {
  view: View;
  setView: (view: View) => void;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  units: Unit[];
  setUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  purchases: Purchase[];
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  companyName: 'ZenPOS Systems',
  address: '123 Business Ave, Tech City',
  phone: '0300-1234567',
  currency: 'Rs',
  taxRates: [{ name: 'GST', rate: 17 }],
  showPictures: true,
  lowStockAlert: 'low',
  theme: 'dark',
  printLogo: true,
  receiptSize: '3-inch',
  passwords: [{ value: '1234', hint: 'Default start key' }],
  installedAt: Date.now(),
  isActivated: false,
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<View>('DASHBOARD');
  const [isLocked, setIsLocked] = useState(true);

  // Load from LocalStorage or use defaults
  const [categories, setCategories] = useState<Category[]>(() => JSON.parse(localStorage.getItem('categories') || '[]'));
  const [units, setUnits] = useState<Unit[]>(() => JSON.parse(localStorage.getItem('units') || '[]'));
  const [items, setItems] = useState<Item[]>(() => JSON.parse(localStorage.getItem('items') || '[]'));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => JSON.parse(localStorage.getItem('suppliers') || '[]'));
  const [customers, setCustomers] = useState<Customer[]>(() => JSON.parse(localStorage.getItem('customers') || '[]'));
  const [sales, setSales] = useState<Sale[]>(() => JSON.parse(localStorage.getItem('sales') || '[]'));
  const [purchases, setPurchases] = useState<Purchase[]>(() => JSON.parse(localStorage.getItem('purchases') || '[]'));
  const [expenses, setExpenses] = useState<Expense[]>(() => JSON.parse(localStorage.getItem('expenses') || '[]'));
  const [reminders, setReminders] = useState<Reminder[]>(() => JSON.parse(localStorage.getItem('reminders') || '[]'));
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('settings');
    if (!saved) return defaultSettings;
    const parsed = JSON.parse(saved);
    // Merge new defaults into old settings for migration
    return { ...defaultSettings, ...parsed };
  });

  // Persistence
  useEffect(() => { localStorage.setItem('categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('units', JSON.stringify(units)); }, [units]);
  useEffect(() => { localStorage.setItem('items', JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem('suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('purchases', JSON.stringify(purchases)); }, [purchases]);
  useEffect(() => { localStorage.setItem('expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('reminders', JSON.stringify(reminders)); }, [reminders]);
  useEffect(() => { localStorage.setItem('settings', JSON.stringify(settings)); }, [settings]);

  return (
    <StoreContext.Provider value={{
      view, setView,
      categories, setCategories,
      units, setUnits,
      items, setItems,
      suppliers, setSuppliers,
      customers, setCustomers,
      sales, setSales,
      purchases, setPurchases,
      expenses, setExpenses,
      reminders, setReminders,
      settings, setSettings,
      isLocked, setIsLocked
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};

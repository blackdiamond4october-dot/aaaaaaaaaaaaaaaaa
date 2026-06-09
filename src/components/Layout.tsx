import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  Wallet, 
  BarChart3, 
  Settings, 
  LogOut, 
  PlusCircle, 
  Users, 
  UserCircle, 
  Package, 
  Tag, 
  Scale, 
  Bell,
  Search,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/StoreContext';
import { View } from '../types';
import { cn } from '../lib/utils';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  view: View;
  active: boolean;
  onClick: (view: View) => void;
  collapsed?: boolean;
  count?: number;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, view, active, onClick, collapsed, count }) => (
  <button
    onClick={() => onClick(view)}
    className={cn(
      "flex items-center justify-between px-3 py-2 rounded transition-all duration-200 group relative cursor-pointer w-full",
      active 
        ? "bg-[#6366f122] text-[#6366f1]" 
        : "text-app-muted hover:text-app-text hover:bg-app-surface"
    )}
  >
    <div className="flex items-center gap-3">
      <div className={cn("transition-transform duration-200 shrink-0", active ? "scale-105" : "group-hover:scale-105")}>
        {icon}
      </div>
      {!collapsed && <span className="font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">{label}</span>}
    </div>
    {!collapsed && count !== undefined && (
      <span className="bg-[#f59e0b] text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">
        {count}
      </span>
    )}
    {active && (
      <div className="absolute left-0 w-1 h-5 bg-[#6366f1] rounded-r-full" />
    )}
  </button>
);

const Sidebar: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const { view, setView, settings, items, setIsLocked } = useStore();

  const lowStockCount = items.filter(
    (item) => item.lowStockValue > 0 && item.stock <= item.lowStockValue
  ).length;

  const navItems: { icon: any; label: string; view: View }[] = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard', view: 'DASHBOARD' },
    { icon: <ShoppingCart size={20} />, label: 'Sale', view: 'SALE' },
    { icon: <Truck size={20} />, label: 'Purchase', view: 'PURCHASE' },
    { icon: <CreditCard size={20} />, label: 'Payments', view: 'PAYMENTS' },
    { icon: <Wallet size={20} />, label: 'Expenses', view: 'EXPENSES' },
    { icon: <BarChart3 size={20} />, label: 'Reports', view: 'REPORTS' },
    { icon: <Settings size={20} />, label: 'Settings', view: 'SETTINGS' },
  ];

  const manageItems: { icon: any; label: string; view: View; count?: number }[] = [
    { icon: <Tag size={18} />, label: 'Categories', view: 'CATEGORIES' },
    { icon: <Scale size={18} />, label: 'Units', view: 'UNITS' },
    { icon: <Package size={18} />, label: 'Items', view: 'ITEMS' },
    { icon: <UserCircle size={18} />, label: 'Suppliers', view: 'SUPPLIERS' },
    { icon: <Users size={18} />, label: 'Customers', view: 'CUSTOMERS' },
    { icon: <Bell size={18} className={lowStockCount > 0 ? "animate-pulse text-[#f59e0b]" : ""} />, label: 'Reminders', view: 'REMINDERS', count: lowStockCount > 0 ? lowStockCount : undefined },
  ];

  return (
    <aside className={cn(
      "bg-app-header border-r border-app-border transition-all duration-300 flex flex-col h-screen fixed md:sticky top-0 z-50 shadow-2xl shadow-black/50",
      collapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "w-64 translate-x-0"
    )}>
      <div className="p-4 border-b border-app-border flex items-center gap-3 h-14 overflow-hidden bg-app-header">
        <div className="w-8 h-8 rounded bg-[#6366f1] flex items-center justify-center shrink-0 shadow-lg shadow-[#6366f133] overflow-hidden">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} className="w-full h-full object-cover" alt="Logo" />
          ) : (
            <span className="font-black text-white text-base">{settings.companyName.charAt(0)}</span>
          )}
        </div>
        {!collapsed && (
          <span className="font-black text-base text-app-text tracking-tighter uppercase truncate">
            {settings.companyName}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-none">
        <div className="space-y-1">
          {!collapsed && <p className="text-[9px] font-black text-app-muted uppercase tracking-[0.2em] px-3 mb-3">Core Modules</p>}
          {navItems.map((item) => (
            <NavButton 
              key={item.view} 
              {...item} 
              active={view === item.view} 
              onClick={setView} 
              collapsed={collapsed}
            />
          ))}
        </div>

        <div className="space-y-1">
          {!collapsed && <p className="text-[9px] font-black text-app-muted uppercase tracking-[0.2em] px-3 mb-3">Registry</p>}
          {manageItems.map((item) => (
            <NavButton 
              key={item.view} 
              {...item} 
              active={view === item.view} 
              onClick={setView} 
              collapsed={collapsed}
            />
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-app-border bg-app-header">
        <button 
          onClick={() => {
            setIsLocked(true);
            window.location.reload();
          }}
          className="flex items-center gap-3 w-full px-3 py-2 text-app-muted hover:text-[#ef4444] hover:bg-[#ef444411] rounded transition-all group"
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          {!collapsed && <span className="text-[11px] font-bold uppercase tracking-wider">Session Exit</span>}
        </button>
      </div>
    </aside>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const { settings, setSettings, setView, view } = useStore();

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };



  return (
    <div className="flex min-h-screen bg-app-bg text-app-text font-sans selection:bg-[#6366f133]">
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      <Sidebar collapsed={collapsed} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-app-header border-b border-app-border flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm transition-all">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 hover:bg-app-surface rounded text-app-muted transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="hidden md:flex items-center bg-app-bg border border-app-border rounded px-3 py-1.5 gap-2 group focus-within:border-[#6366f155] transition-all">
              <Search size={14} className="text-app-muted group-focus-within:text-[#6366f1]" />
              <input 
                type="text" 
                placeholder="Search commands (⌘+K)" 
                className="bg-transparent border-none text-[11px] w-48 outline-none text-app-text placeholder-app-muted"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-app-surface rounded-lg text-app-muted hover:text-[#6366f1] transition-all"
              title="Toggle Theme"
            >
              {settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-app-surface px-3 py-1.5 rounded-md border border-app-border">
              <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Register #01</span>
            </div>
            
            <div className="h-6 w-[1px] bg-app-border mx-1" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black uppercase leading-none tracking-tight">{settings.adminName || 'Administrator'}</p>
                <p className="text-[9px] text-app-muted font-bold uppercase tracking-wider mt-0.5">Administrator</p>
              </div>
              <div className="w-8 h-8 rounded bg-[#3f3f46] border border-[#52525b] flex items-center justify-center text-[11px] font-black text-app-text uppercase">
                {(() => {
                  const name = settings.adminName || 'Admin';
                  const parts = name.trim().split(' ');
                  if (parts.length > 1) {
                    return `${parts[0][0]}${parts[parts.length - 1][0]}`;
                  }
                  return name.substring(0, 2);
                })()}
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 p-4 overflow-x-hidden relative bg-app-bg transition-colors duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </section>


      </main>
    </div>
  );
};

import React from 'react';
import { StoreProvider } from './store/StoreContext';
import { Layout } from './components/Layout';
import { Clock } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { SaleModule } from './components/SaleModule';
import { ExpensesModule } from './components/ExpensesModule';
import { SettingsModule } from './components/SettingsModule';
import { ManageData } from './components/ManageData';
import { PurchaseModule } from './components/PurchaseModule';
import { ReportsModule } from './components/ReportsModule';
import { PaymentsModule } from './components/PaymentsModule';
import { useStore } from './store/StoreContext';

const ViewRenderer = () => {
  const { view } = useStore();

  switch (view) {
    case 'DASHBOARD': return <Dashboard />;
    case 'SALE': return <SaleModule />;
    case 'PURCHASE': return <PurchaseModule />;
    case 'EXPENSES': return <ExpensesModule />;
    case 'SETTINGS': return <SettingsModule />;
    case 'ITEMS': return <ManageData type="ITEMS" />;
    case 'CUSTOMERS': return <ManageData type="CUSTOMERS" />;
    case 'SUPPLIERS': return <ManageData type="SUPPLIERS" />;
    case 'CATEGORIES': return <ManageData type="CATEGORIES" />;
    case 'UNITS': return <ManageData type="UNITS" />;
    case 'PAYMENTS': return <PaymentsModule />;
    case 'REPORTS': return <ReportsModule />;
    case 'REMINDERS': return (
      <div className="h-full flex flex-col items-center justify-center p-20 border border-dashed border-[#27272a] rounded-xl bg-[#0f0f10]/30 group">
        <div className="w-16 h-16 rounded-full border border-[#6366f122] flex items-center justify-center text-[#6366f1] mb-6 animate-pulse group-hover:scale-110 transition-transform">
           <Clock size={32} />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#a1a1aa]">PROTOCOL: TASK_SCHEDULER</p>
        <p className="text-[10px] text-[#52525b] mt-2 font-bold uppercase tracking-widest italic">Module synchronization in progress...</p>
      </div>
    );
    default: return <Dashboard />;
  }
};

import { LockScreen } from './components/LockScreen';
import { ActivationScreen } from './components/ActivationScreen';

const AppContent = () => {
  return (
    <>
      <LockScreen />
      <ActivationScreen />
      <Layout>
        <ViewRenderer />
      </Layout>
    </>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

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

import { RemindersModule } from './components/RemindersModule';

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
    case 'REMINDERS': return <RemindersModule />;
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
